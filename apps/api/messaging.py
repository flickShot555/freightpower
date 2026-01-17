from __future__ import annotations

import asyncio
import json
import time
import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from firebase_admin import firestore
from firebase_admin import auth as firebase_auth
from firebase_admin import messaging as fcm

from .auth import get_current_user, require_admin
from .database import db, log_action
from .settings import settings


router = APIRouter(prefix="/messaging", tags=["Messaging"])


# -----------------------------
# Models
# -----------------------------

class SendMessageRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)


class CreateDirectThreadRequest(BaseModel):
    driver_id: str


class CreateShipperDirectThreadRequest(BaseModel):
    shipper_id: str


class CreateCarrierDirectThreadRequest(BaseModel):
    carrier_id: str


class CreateGroupThreadRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=80)
    driver_ids: List[str] = Field(default_factory=list, min_length=1, max_length=50)


class RegisterDeviceTokenRequest(BaseModel):
    token: str = Field(..., min_length=10, max_length=4096)
    platform: Optional[str] = None  # web/android/ios


class AdminChannelMessageRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)
    target_role: str = Field(..., min_length=1, max_length=30)  # carrier/driver/shipper/broker/all
    title: Optional[str] = Field(default=None, max_length=80)


# -----------------------------
# Helpers
# -----------------------------

def _now() -> float:
    return time.time()


def _normalize_uid(value: Any) -> str:
    s = str(value or "").strip()
    if not s:
        raise HTTPException(status_code=400, detail="Missing id")
    return s


def _direct_thread_id(carrier_id: str, driver_id: str) -> str:
    return f"cd_{carrier_id}_{driver_id}"


def _shipper_carrier_thread_id(shipper_id: str, carrier_id: str) -> str:
    return f"sc_{shipper_id}_{carrier_id}"


def _get_driver_doc(driver_id: str) -> Dict[str, Any]:
    snap = db.collection("drivers").document(driver_id).get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Driver not found")
    return snap.to_dict() or {}


def _driver_carrier_id(driver_id: str) -> Optional[str]:
    d = _get_driver_doc(driver_id)
    return d.get("carrier_id")


def _ensure_carrier_owns_driver(carrier_id: str, driver_id: str) -> None:
    current = _driver_carrier_id(driver_id)
    if not current:
        raise HTTPException(status_code=403, detail="Driver is not hired by any carrier")
    if current != carrier_id:
        raise HTTPException(status_code=403, detail="Driver is hired by another carrier")


def _ensure_driver_has_carrier(driver_id: str) -> str:
    carrier_id = _driver_carrier_id(driver_id)
    if not carrier_id:
        raise HTTPException(status_code=403, detail="Driver is not linked to a carrier")
    return carrier_id


def _get_thread(thread_id: str) -> Dict[str, Any]:
    snap = db.collection("conversations").document(thread_id).get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Thread not found")
    d = snap.to_dict() or {}
    d["id"] = snap.id
    return d


def _assert_member(user_id: str, thread: Dict[str, Any]) -> None:
    members = thread.get("member_uids") or []
    if user_id not in members:
        raise HTTPException(status_code=403, detail="Not a member of this thread")


def _assert_send_allowed(user: Dict[str, Any], thread: Dict[str, Any]) -> None:
    role = user.get("role")
    uid = user.get("uid")

    if thread.get("kind") not in {"carrier_driver_direct", "carrier_driver_group", "shipper_carrier_direct"}:
        raise HTTPException(status_code=400, detail="Unsupported thread type")

    _assert_member(uid, thread)

    carrier_id = thread.get("carrier_id")
    kind = thread.get("kind")
    if kind in {"carrier_driver_direct", "carrier_driver_group"}:
        if role == "driver":
            # Driver can only chat within threads owned by their carrier
            my_carrier = _ensure_driver_has_carrier(uid)
            if carrier_id != my_carrier:
                raise HTTPException(status_code=403, detail="Driver can only message their carrier")
        elif role == "carrier":
            # Carrier can only message hired drivers
            if carrier_id != uid:
                raise HTTPException(status_code=403, detail="Carrier can only message within their own threads")
        else:
            raise HTTPException(status_code=403, detail="Messaging not enabled for this role")
        return

    if kind == "shipper_carrier_direct":
        shipper_id = thread.get("shipper_id")
        if role == "shipper":
            if shipper_id != uid:
                raise HTTPException(status_code=403, detail="Shipper can only message within their own threads")
        elif role == "carrier":
            if carrier_id != uid:
                raise HTTPException(status_code=403, detail="Carrier can only message within their own threads")
        else:
            raise HTTPException(status_code=403, detail="Messaging not enabled for this role")
        return

    raise HTTPException(status_code=400, detail="Unsupported thread type")


def _get_user_doc(uid: str) -> Dict[str, Any]:
    snap = db.collection("users").document(uid).get()
    return snap.to_dict() or {}


def _display_name_for_user_doc(d: Dict[str, Any]) -> str:
    return (
        d.get("display_name")
        or d.get("name")
        or d.get("company_name")
        or d.get("email")
        or "User"
    )


def _photo_url_for_user_doc(d: Dict[str, Any]) -> Optional[str]:
    return d.get("profile_picture_url") or d.get("photo_url") or d.get("avatar_url")


def _ensure_shipper_carrier_relationship(shipper_id: str, carrier_id: str) -> None:
    q = (
        db.collection("shipper_carrier_relationships")
        .where("shipper_id", "==", shipper_id)
        .where("carrier_id", "==", carrier_id)
        .where("status", "==", "active")
        .limit(1)
    )
    if not list(q.stream()):
        raise HTTPException(status_code=403, detail="Shipper and carrier are not linked")


def _thread_view_for_user(user: Dict[str, Any], thread: Dict[str, Any]) -> Dict[str, Any]:
    """Return a viewer-specific thread payload (name/avatar are the other party)."""
    uid = user.get("uid")
    role = user.get("role")
    t = dict(thread or {})
    kind = t.get("kind")

    if kind == "carrier_driver_direct":
        other_id = None
        driver_ids = t.get("driver_ids") or []
        if role == "carrier":
            other_id = driver_ids[0] if driver_ids else None
            other_role = "driver"
        else:
            other_id = t.get("carrier_id")
            other_role = "carrier"

        if other_id:
            if other_role == "driver":
                ddoc = _get_driver_doc(other_id)
                t["other_display_name"] = ddoc.get("name") or ddoc.get("display_name") or ddoc.get("email") or "Driver"
                t["other_photo_url"] = ddoc.get("profile_picture_url") or ddoc.get("photo_url") or ddoc.get("avatar_url")
            else:
                udoc = _get_user_doc(other_id)
                t["other_display_name"] = _display_name_for_user_doc(udoc)
                t["other_photo_url"] = _photo_url_for_user_doc(udoc)

        # Preserve legacy title, but prefer viewer-safe label
        t["display_title"] = t.get("other_display_name") or t.get("title")
        return t

    if kind == "shipper_carrier_direct":
        shipper_id = t.get("shipper_id")
        carrier_id = t.get("carrier_id")
        if uid == shipper_id:
            other_id = carrier_id
            other_role = "carrier"
        else:
            other_id = shipper_id
            other_role = "shipper"

        if other_id:
            udoc = _get_user_doc(other_id)
            t["other_display_name"] = _display_name_for_user_doc(udoc)
            t["other_photo_url"] = _photo_url_for_user_doc(udoc)
        t["display_title"] = t.get("other_display_name") or t.get("title")
        return t

    # group threads: keep title as-is
    t["display_title"] = t.get("title")
    return t


def _ensure_admin_channel(channel_id: str, target_role: str) -> Dict[str, Any]:
    ref = db.collection("admin_channels").document(channel_id)
    snap = ref.get()
    if snap.exists:
        d = snap.to_dict() or {}
        d["id"] = channel_id
        return d

    now = _now()
    d = {
        "id": channel_id,
        "target_role": target_role,
        "name": f"{target_role.title()} Notifications" if target_role != "all" else "All Users",
        "created_at": now,
        "updated_at": now,
    }
    ref.set(d)
    return d


def _send_push(tokens: List[str], title: str, body: str) -> Dict[str, Any]:
    # Web push via FCM requires frontend registration/VAPID; we attempt send and report.
    if not tokens:
        return {"attempted": 0, "success": 0, "failure": 0}

    # FCM limit: 500 tokens per call
    attempted = 0
    success = 0
    failure = 0

    for i in range(0, len(tokens), 500):
        chunk = tokens[i : i + 500]
        attempted += len(chunk)
        message = fcm.MulticastMessage(
            tokens=chunk,
            notification=fcm.Notification(title=title, body=body),
            data={"type": "admin_broadcast"},
        )
        resp = fcm.send_multicast(message)
        success += resp.success_count
        failure += resp.failure_count

    return {"attempted": attempted, "success": success, "failure": failure}


async def _get_user_from_query_token(token: str) -> Dict[str, Any]:
    token = str(token or "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        decoded = firebase_auth.verify_id_token(token)
        uid = decoded.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_doc = db.collection("users").document(uid).get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User profile not found")
        user_data = user_doc.to_dict() or {}
        if not user_data.get("uid"):
            user_data["uid"] = uid
        # Mirror existing auth behavior: enforce verified flag.
        if not user_data.get("is_verified", False):
            raise HTTPException(status_code=403, detail="Account not verified")
        return user_data
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# -----------------------------
# Carrier / Driver messaging
# -----------------------------

@router.get("/threads")
async def list_threads(user: Dict[str, Any] = Depends(get_current_user)):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    role = user.get("role")
    if role not in {"carrier", "driver", "shipper"}:
        return {"threads": []}

    threads: List[Dict[str, Any]] = []
    q = db.collection("conversations").where("member_uids", "array_contains", uid)
    for snap in q.stream():
        d = snap.to_dict() or {}
        d["id"] = snap.id
        threads.append(_thread_view_for_user(user, d))

    threads.sort(key=lambda x: x.get("updated_at", 0), reverse=True)
    return {"threads": threads}


@router.get("/carrier/drivers")
async def list_carrier_drivers(user: Dict[str, Any] = Depends(get_current_user)):
    uid = user.get("uid")
    if user.get("role") != "carrier":
        raise HTTPException(status_code=403, detail="Carrier access required")

    rows: List[Dict[str, Any]] = []
    q = db.collection("drivers").where("carrier_id", "==", uid)
    for snap in q.stream():
        d = snap.to_dict() or {}
        d["id"] = snap.id
        rows.append(d)

    rows.sort(key=lambda x: (x.get("name") or "").lower())
    return {"drivers": rows}


@router.post("/carrier/threads/direct")
async def create_or_get_direct_thread(
    payload: CreateDirectThreadRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    if user.get("role") != "carrier":
        raise HTTPException(status_code=403, detail="Carrier access required")

    carrier_id = user.get("uid")
    driver_id = _normalize_uid(payload.driver_id)
    _ensure_carrier_owns_driver(carrier_id, driver_id)

    thread_id = _direct_thread_id(carrier_id, driver_id)
    ref = db.collection("conversations").document(thread_id)
    snap = ref.get()

    if snap.exists:
        d = snap.to_dict() or {}
        d["id"] = thread_id
        return {"thread": _thread_view_for_user(user, d)}

    now = _now()
    driver_doc = _get_driver_doc(driver_id)
    title = driver_doc.get("name") or "Driver"

    data = {
        "id": thread_id,
        "kind": "carrier_driver_direct",
        "title": title,
        "carrier_id": carrier_id,
        "driver_ids": [driver_id],
        "member_uids": [carrier_id, driver_id],
        "created_by": carrier_id,
        "created_at": now,
        "updated_at": now,
        "last_message": None,
        "last_message_at": None,
    }
    ref.set(data)
    log_action(carrier_id, "THREAD_CREATED", f"Direct thread created with driver {driver_id}")
    return {"thread": _thread_view_for_user(user, data)}


@router.post("/driver/threads/my-carrier")
async def create_or_get_driver_carrier_thread(user: Dict[str, Any] = Depends(get_current_user)):
    if user.get("role") != "driver":
        raise HTTPException(status_code=403, detail="Driver access required")

    driver_id = user.get("uid")
    carrier_id = _ensure_driver_has_carrier(driver_id)
    thread_id = _direct_thread_id(carrier_id, driver_id)

    ref = db.collection("conversations").document(thread_id)
    snap = ref.get()
    if snap.exists:
        d = snap.to_dict() or {}
        d["id"] = thread_id
        return {"thread": _thread_view_for_user(user, d)}

    now = _now()
    carrier_doc = db.collection("users").document(carrier_id).get().to_dict() or {}
    title = carrier_doc.get("company_name") or carrier_doc.get("name") or "Carrier"

    data = {
        "id": thread_id,
        "kind": "carrier_driver_direct",
        "title": title,
        "carrier_id": carrier_id,
        "driver_ids": [driver_id],
        "member_uids": [carrier_id, driver_id],
        "created_by": driver_id,
        "created_at": now,
        "updated_at": now,
        "last_message": None,
        "last_message_at": None,
    }
    ref.set(data)
    log_action(driver_id, "THREAD_CREATED", f"Direct thread created with carrier {carrier_id}")
    return {"thread": _thread_view_for_user(user, data)}


# -----------------------------
# Shipper / Carrier messaging
# -----------------------------


@router.get("/carrier/shippers")
async def list_carrier_shippers(user: Dict[str, Any] = Depends(get_current_user)):
    if user.get("role") != "carrier":
        raise HTTPException(status_code=403, detail="Carrier access required")

    carrier_id = user.get("uid")
    q = (
        db.collection("shipper_carrier_relationships")
        .where("carrier_id", "==", carrier_id)
        .where("status", "==", "active")
    )

    shippers: Dict[str, Dict[str, Any]] = {}
    for snap in q.stream():
        rel = snap.to_dict() or {}
        shipper_id = rel.get("shipper_id")
        if not shipper_id:
            continue
        udoc = _get_user_doc(shipper_id)
        shippers[shipper_id] = {
            "id": shipper_id,
            "name": _display_name_for_user_doc(udoc),
            "profile_picture_url": _photo_url_for_user_doc(udoc),
            "email": udoc.get("email"),
            "company_name": udoc.get("company_name"),
        }

    rows = list(shippers.values())
    rows.sort(key=lambda x: (x.get("name") or "").lower())
    return {"shippers": rows}


@router.get("/shipper/carriers")
async def list_shipper_carriers(user: Dict[str, Any] = Depends(get_current_user)):
    if user.get("role") != "shipper":
        raise HTTPException(status_code=403, detail="Shipper access required")

    shipper_id = user.get("uid")
    q = (
        db.collection("shipper_carrier_relationships")
        .where("shipper_id", "==", shipper_id)
        .where("status", "==", "active")
    )

    carriers: Dict[str, Dict[str, Any]] = {}
    for snap in q.stream():
        rel = snap.to_dict() or {}
        carrier_id = rel.get("carrier_id")
        if not carrier_id:
            continue
        udoc = _get_user_doc(carrier_id)
        carriers[carrier_id] = {
            "id": carrier_id,
            "name": _display_name_for_user_doc(udoc),
            "profile_picture_url": _photo_url_for_user_doc(udoc),
            "email": udoc.get("email"),
            "company_name": udoc.get("company_name"),
        }

    rows = list(carriers.values())
    rows.sort(key=lambda x: (x.get("name") or "").lower())
    return {"carriers": rows}


@router.post("/carrier/threads/shipper-direct")
async def create_or_get_shipper_direct_thread_as_carrier(
    payload: CreateShipperDirectThreadRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    if user.get("role") != "carrier":
        raise HTTPException(status_code=403, detail="Carrier access required")

    carrier_id = user.get("uid")
    shipper_id = _normalize_uid(payload.shipper_id)
    _ensure_shipper_carrier_relationship(shipper_id, carrier_id)

    thread_id = _shipper_carrier_thread_id(shipper_id, carrier_id)
    ref = db.collection("conversations").document(thread_id)
    snap = ref.get()
    if snap.exists:
        d = snap.to_dict() or {}
        d["id"] = thread_id
        return {"thread": _thread_view_for_user(user, d)}

    now = _now()
    shipper_doc = _get_user_doc(shipper_id)
    title = _display_name_for_user_doc(shipper_doc)
    data = {
        "id": thread_id,
        "kind": "shipper_carrier_direct",
        "title": title,
        "shipper_id": shipper_id,
        "carrier_id": carrier_id,
        "member_uids": [shipper_id, carrier_id],
        "created_by": carrier_id,
        "created_at": now,
        "updated_at": now,
        "last_message": None,
        "last_message_at": None,
    }
    ref.set(data)
    log_action(carrier_id, "THREAD_CREATED", f"Direct thread created with shipper {shipper_id}")
    return {"thread": _thread_view_for_user(user, data)}


@router.post("/shipper/threads/direct")
async def create_or_get_carrier_direct_thread_as_shipper(
    payload: CreateCarrierDirectThreadRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    if user.get("role") != "shipper":
        raise HTTPException(status_code=403, detail="Shipper access required")

    shipper_id = user.get("uid")
    carrier_id = _normalize_uid(payload.carrier_id)
    _ensure_shipper_carrier_relationship(shipper_id, carrier_id)

    thread_id = _shipper_carrier_thread_id(shipper_id, carrier_id)
    ref = db.collection("conversations").document(thread_id)
    snap = ref.get()
    if snap.exists:
        d = snap.to_dict() or {}
        d["id"] = thread_id
        return {"thread": _thread_view_for_user(user, d)}

    now = _now()
    carrier_doc = _get_user_doc(carrier_id)
    title = _display_name_for_user_doc(carrier_doc)
    data = {
        "id": thread_id,
        "kind": "shipper_carrier_direct",
        "title": title,
        "shipper_id": shipper_id,
        "carrier_id": carrier_id,
        "member_uids": [shipper_id, carrier_id],
        "created_by": shipper_id,
        "created_at": now,
        "updated_at": now,
        "last_message": None,
        "last_message_at": None,
    }
    ref.set(data)
    log_action(shipper_id, "THREAD_CREATED", f"Direct thread created with carrier {carrier_id}")
    return {"thread": _thread_view_for_user(user, data)}


@router.post("/carrier/threads/group")
async def create_group_thread(
    payload: CreateGroupThreadRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    if user.get("role") != "carrier":
        raise HTTPException(status_code=403, detail="Carrier access required")

    carrier_id = user.get("uid")
    driver_ids = [_normalize_uid(x) for x in payload.driver_ids]
    # Ensure all drivers belong to this carrier
    for driver_id in driver_ids:
        _ensure_carrier_owns_driver(carrier_id, driver_id)

    thread_id = f"cg_{uuid.uuid4().hex}"
    now = _now()

    data = {
        "id": thread_id,
        "kind": "carrier_driver_group",
        "title": payload.title,
        "carrier_id": carrier_id,
        "driver_ids": driver_ids,
        "member_uids": [carrier_id, *driver_ids],
        "created_by": carrier_id,
        "created_at": now,
        "updated_at": now,
        "last_message": None,
        "last_message_at": None,
    }

    db.collection("conversations").document(thread_id).set(data)
    log_action(carrier_id, "THREAD_CREATED", f"Group thread created with {len(driver_ids)} drivers")
    return {"thread": data}


@router.get("/threads/{thread_id}/messages")
async def list_messages(thread_id: str, limit: int = 50, user: Dict[str, Any] = Depends(get_current_user)):
    uid = user.get("uid")
    thread = _get_thread(thread_id)
    _assert_member(uid, thread)

    limit = max(1, min(int(limit or 50), 200))
    q = (
        db.collection("conversations")
        .document(thread_id)
        .collection("messages")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )

    items: List[Dict[str, Any]] = []
    for snap in q.stream():
        d = snap.to_dict() or {}
        d["id"] = snap.id
        items.append(d)

    items.reverse()
    return {"messages": items, "thread": thread}


@router.post("/threads/{thread_id}/messages")
async def send_message(
    thread_id: str,
    payload: SendMessageRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    uid = user.get("uid")
    thread = _get_thread(thread_id)
    _assert_send_allowed(user, thread)

    now = _now()
    msg = {
        "sender_id": uid,
        "sender_role": user.get("role"),
        "text": payload.text.strip(),
        "created_at": now,
    }

    msg_ref = (
        db.collection("conversations").document(thread_id).collection("messages").document()
    )
    msg_ref.set(msg)

    # update conversation metadata
    db.collection("conversations").document(thread_id).update(
        {
            "updated_at": now,
            "last_message": {
                "text": msg["text"],
                "sender_id": uid,
                "sender_role": msg["sender_role"],
            },
            "last_message_at": now,
        }
    )

    log_action(uid, "MESSAGE_SENT", f"Sent message in thread {thread_id}")
    return {"ok": True, "message": {**msg, "id": msg_ref.id}}


@router.get("/threads/{thread_id}/stream")
async def stream_messages(thread_id: str, token: str, since: float = 0.0):
    """SSE stream of new messages for a thread.

    Note: EventSource cannot send Authorization headers, so we accept an ID token
    as a query param. Use only over HTTPS in production.
    """

    user = await _get_user_from_query_token(token)
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    thread = _get_thread(thread_id)
    _assert_member(uid, thread)

    async def event_gen():
        cursor = float(since or 0.0)
        # Keep connection alive; client auto-reconnects.
        while True:
            # Heartbeat
            yield ": ping\n\n"

            q = (
                db.collection("conversations")
                .document(thread_id)
                .collection("messages")
                .where("created_at", ">", cursor)
                .order_by("created_at", direction=firestore.Query.ASCENDING)
                .limit(50)
            )

            new_items: List[Dict[str, Any]] = []
            for snap in q.stream():
                d = snap.to_dict() or {}
                d["id"] = snap.id
                new_items.append(d)

            for item in new_items:
                cursor = max(cursor, float(item.get("created_at") or 0.0))
                payload = {"type": "message", "thread_id": thread_id, "message": item}
                yield f"data: {json.dumps(payload)}\n\n"

            await asyncio.sleep(2)

    return StreamingResponse(event_gen(), media_type="text/event-stream")


# -----------------------------
# Admin notification channels
# -----------------------------

@router.get("/notifications/channels")
async def list_notification_channels(user: Dict[str, Any] = Depends(get_current_user)):
    role = user.get("role") or "carrier"
    # Users can see: all + their role
    channel_ids = ["all", role]

    channels: List[Dict[str, Any]] = []
    for cid in channel_ids:
        channels.append(_ensure_admin_channel(cid, cid))

    return {"channels": channels}


@router.get("/notifications/channels/{channel_id}/messages")
async def list_channel_messages(channel_id: str, limit: int = 50, user: Dict[str, Any] = Depends(get_current_user)):
    role = user.get("role") or "carrier"
    if channel_id not in {"all", role} and user.get("role") not in {"admin", "super_admin"}:
        raise HTTPException(status_code=403, detail="Not allowed")

    limit = max(1, min(int(limit or 50), 200))
    q = (
        db.collection("admin_channels")
        .document(channel_id)
        .collection("messages")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )

    items: List[Dict[str, Any]] = []
    for snap in q.stream():
        d = snap.to_dict() or {}
        d["id"] = snap.id
        items.append(d)

    items.reverse()
    return {"messages": items}


@router.post("/admin/notifications/send")
async def admin_send_notification(
    payload: AdminChannelMessageRequest,
    user: Dict[str, Any] = Depends(require_admin),
):
    target_role = (payload.target_role or "").strip().lower()
    if target_role not in {"all", "carrier", "driver", "shipper", "broker"}:
        raise HTTPException(status_code=400, detail="Invalid target_role")

    channel_id = target_role
    _ensure_admin_channel(channel_id, target_role)

    now = _now()
    msg = {
        "sender_id": user.get("uid"),
        "sender_role": user.get("role"),
        "text": payload.text.strip(),
        "title": payload.title,
        "created_at": now,
        "one_way": True,
    }

    ref = db.collection("admin_channels").document(channel_id).collection("messages").document()
    ref.set(msg)

    # Update channel updated_at
    db.collection("admin_channels").document(channel_id).set({"updated_at": now}, merge=True)

    push_result = {"attempted": 0, "success": 0, "failure": 0}
    if getattr(settings, "ENABLE_FCM", False):
        # Fetch all tokens by role
        token_q = db.collection("device_tokens")
        if target_role != "all":
            token_q = token_q.where("role", "==", target_role)
        tokens = []
        for s in token_q.stream():
            d = s.to_dict() or {}
            t = d.get("token")
            if t:
                tokens.append(t)
        push_result = _send_push(tokens, payload.title or "FreightPower", payload.text.strip())

    log_action(user.get("uid"), "ADMIN_NOTIFICATION_SENT", f"Channel={channel_id}")
    return {"ok": True, "message": {**msg, "id": ref.id}, "push": push_result}


# -----------------------------
# Device tokens
# -----------------------------

@router.post("/devices/register")
async def register_device_token(
    payload: RegisterDeviceTokenRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = payload.token.strip()
    now = _now()

    # Use token as doc id to avoid duplicates
    db.collection("device_tokens").document(token).set(
        {
            "token": token,
            "uid": uid,
            "role": user.get("role"),
            "platform": payload.platform,
            "updated_at": now,
            "created_at": now,
        },
        merge=True,
    )

    return {"ok": True}
