from __future__ import annotations

import asyncio
import json
import smtplib
import time
import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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


def _conversation_read_doc_id(thread_id: str, uid: str) -> str:
    return f"{thread_id}_{uid}"


def _channel_read_doc_id(channel_id: str, uid: str) -> str:
    return f"{channel_id}_{uid}"


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


def _get_driver_identity(driver_id: str) -> Dict[str, Any]:
    """Return best-effort driver identity (name/photo) across drivers + users docs."""
    ddoc = _get_driver_doc(driver_id)
    # Many profiles store photo/name on users/{uid}; drivers/{uid} can be operational data only.
    udoc = _get_user_doc(driver_id)

    name = (
        ddoc.get("name")
        or ddoc.get("display_name")
        or udoc.get("display_name")
        or udoc.get("name")
        or udoc.get("email")
        or ddoc.get("email")
        or "Driver"
    )
    photo = (
        ddoc.get("profile_picture_url")
        or ddoc.get("photo_url")
        or ddoc.get("avatar_url")
        or _photo_url_for_user_doc(udoc)
    )
    return {"name": name, "photo_url": photo}


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


def _email_for_uid(uid: str) -> Optional[str]:
    udoc = _get_user_doc(uid)
    email = (udoc.get("email") or "").strip()
    if email:
        return email
    # Drivers sometimes store email on drivers/{uid}
    try:
        ddoc = db.collection("drivers").document(uid).get()
        if ddoc.exists:
            d = ddoc.to_dict() or {}
            email2 = (d.get("email") or "").strip()
            if email2:
                return email2
    except Exception:
        pass
    return None


def _sender_display_name(user: Dict[str, Any]) -> str:
    uid = user.get("uid")
    role = user.get("role")
    if not uid:
        return "User"
    try:
        if role == "driver":
            return _get_driver_identity(uid).get("name") or "Driver"
        udoc = _get_user_doc(uid)
        return _display_name_for_user_doc(udoc)
    except Exception:
        return user.get("display_name") or user.get("name") or user.get("email") or "User"


def _send_email(to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
    """Send an email using SMTP. If SMTP is not configured, logs the email."""
    try:
        if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
            print(f"[DEV] Email would be sent to {to_email}")
            print(f"[DEV] Subject: {subject}")
            print(f"[DEV] Body: {body}")
            return True

        msg = MIMEMultipart()
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "html" if is_html else "plain"))

        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


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
                ident = _get_driver_identity(other_id)
                t["other_display_name"] = ident.get("name")
                t["other_photo_url"] = ident.get("photo_url")
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
async def list_threads(limit: int = 200, user: Dict[str, Any] = Depends(get_current_user)):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    role = user.get("role")
    if role not in {"carrier", "driver", "shipper"}:
        return {"threads": []}

    limit = max(1, min(int(limit or 200), 500))

    # Prefer a server-side order_by for performance. If an index is missing, fall back.
    try:
        q = (
            db.collection("conversations")
            .where("member_uids", "array_contains", uid)
            .order_by("updated_at", direction=firestore.Query.DESCENDING)
            .limit(limit)
        )
        snaps = list(q.stream())
    except Exception:
        q = db.collection("conversations").where("member_uids", "array_contains", uid).limit(limit)
        snaps = list(q.stream())

    raw: List[Dict[str, Any]] = []
    for snap in snaps:
        d = snap.to_dict() or {}
        d["id"] = snap.id
        raw.append(d)

    # Batch-load identities to avoid N+1 Firestore reads.
    driver_ids: List[str] = []
    user_ids: List[str] = []
    for t in raw:
        kind = t.get("kind")
        if kind == "carrier_driver_direct":
            if role == "carrier":
                dids = t.get("driver_ids") or []
                other_id = dids[0] if dids else None
                if other_id:
                    driver_ids.append(other_id)
            else:
                other_id = t.get("carrier_id")
                if other_id:
                    user_ids.append(other_id)
        elif kind == "shipper_carrier_direct":
            shipper_id = t.get("shipper_id")
            carrier_id = t.get("carrier_id")
            other_id = carrier_id if uid == shipper_id else shipper_id
            if other_id:
                user_ids.append(other_id)

    driver_ids = list({x for x in driver_ids if x})
    # Drivers also often store name/photo in users/{uid}
    user_ids = list({x for x in (user_ids + driver_ids) if x})

    driver_docs: Dict[str, Dict[str, Any]] = {}
    user_docs: Dict[str, Dict[str, Any]] = {}
    if driver_ids:
        try:
            driver_refs = [db.collection("drivers").document(did) for did in driver_ids]
            driver_docs = {s.id: (s.to_dict() or {}) for s in db.get_all(driver_refs) if s.exists}
        except Exception:
            driver_docs = {}
    if user_ids:
        try:
            user_refs = [db.collection("users").document(uid2) for uid2 in user_ids]
            user_docs = {s.id: (s.to_dict() or {}) for s in db.get_all(user_refs) if s.exists}
        except Exception:
            user_docs = {}

    def _identity_for_driver(did: str) -> Dict[str, Any]:
        ddoc = driver_docs.get(did) or {}
        udoc = user_docs.get(did) or {}
        name = (
            ddoc.get("name")
            or ddoc.get("display_name")
            or udoc.get("display_name")
            or udoc.get("name")
            or udoc.get("email")
            or ddoc.get("email")
            or "Driver"
        )
        photo = (
            ddoc.get("profile_picture_url")
            or ddoc.get("photo_url")
            or ddoc.get("avatar_url")
            or _photo_url_for_user_doc(udoc)
        )
        return {"name": name, "photo_url": photo}

    threads: List[Dict[str, Any]] = []
    for t0 in raw:
        t = dict(t0)
        kind = t.get("kind")

        if kind == "carrier_driver_direct":
            dids = t.get("driver_ids") or []
            if role == "carrier":
                other_id = dids[0] if dids else None
                if other_id:
                    ident = _identity_for_driver(other_id)
                    t["other_display_name"] = ident.get("name")
                    t["other_photo_url"] = ident.get("photo_url")
            else:
                other_id = t.get("carrier_id")
                if other_id:
                    udoc = user_docs.get(other_id) or {}
                    t["other_display_name"] = _display_name_for_user_doc(udoc)
                    t["other_photo_url"] = _photo_url_for_user_doc(udoc)

            t["display_title"] = t.get("other_display_name") or t.get("title")
            threads.append(t)
            continue

        if kind == "shipper_carrier_direct":
            shipper_id = t.get("shipper_id")
            carrier_id = t.get("carrier_id")
            other_id = carrier_id if uid == shipper_id else shipper_id
            if other_id:
                udoc = user_docs.get(other_id) or {}
                t["other_display_name"] = _display_name_for_user_doc(udoc)
                t["other_photo_url"] = _photo_url_for_user_doc(udoc)
            t["display_title"] = t.get("other_display_name") or t.get("title")
            threads.append(t)
            continue

        # Group threads: keep title as-is
        t["display_title"] = t.get("title")
        threads.append(t)

    threads.sort(key=lambda x: x.get("updated_at", 0), reverse=True)
    return {"threads": threads}


@router.get("/unread/summary")
async def unread_summary(user: Dict[str, Any] = Depends(get_current_user)):
    """Return unread state for messaging threads + admin notification channels.

    This is used for:
    - dashboard nav badge (total_unread)
    - per-chat unread markers (threads[channel_id].has_unread)
    """
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    role = user.get("role")
    if role not in {"carrier", "driver", "shipper"}:
        return {"total_unread": 0, "threads": {}, "channels": {}}

    # Threads (membership-based). Use an ordered+limited query to avoid scanning huge sets.
    try:
        thread_snaps = list(
            db.collection("conversations")
            .where("member_uids", "array_contains", uid)
            .order_by("updated_at", direction=firestore.Query.DESCENDING)
            .limit(500)
            .stream()
        )
    except Exception:
        thread_snaps = list(
            db.collection("conversations")
            .where("member_uids", "array_contains", uid)
            .limit(500)
            .stream()
        )
    read_refs = [db.collection("conversation_reads").document(_conversation_read_doc_id(s.id, uid)) for s in thread_snaps]
    read_docs = {d.id: (d.to_dict() or {}) for d in db.get_all(read_refs)} if read_refs else {}

    threads_out: Dict[str, Dict[str, Any]] = {}
    unread_threads = 0
    for snap in thread_snaps:
        t = snap.to_dict() or {}
        thread_id = snap.id

        last_at = float(t.get("last_message_at") or 0.0)
        last_sender = (t.get("last_message") or {}).get("sender_id")
        read_id = _conversation_read_doc_id(thread_id, uid)
        last_read_at = float((read_docs.get(read_id) or {}).get("last_read_at") or 0.0)

        has_unread = bool(last_at and last_at > last_read_at and last_sender and last_sender != uid)
        if has_unread:
            unread_threads += 1
        threads_out[thread_id] = {"has_unread": has_unread, "last_message_at": last_at, "last_read_at": last_read_at}

    # Admin channels (role-based)
    channel_ids = ["all", role]
    channel_read_refs = [db.collection("admin_channel_reads").document(_channel_read_doc_id(cid, uid)) for cid in channel_ids]
    channel_read_docs = {d.id: (d.to_dict() or {}) for d in db.get_all(channel_read_refs)} if channel_read_refs else {}

    channels_out: Dict[str, Dict[str, Any]] = {}
    unread_channels = 0
    for cid in channel_ids:
        # Use cached metadata when present; fall back to querying last message.
        ch = db.collection("admin_channels").document(cid).get()
        chd = ch.to_dict() or {}
        last_at = float(chd.get("last_message_at") or 0.0)
        if not last_at:
            q = (
                db.collection("admin_channels")
                .document(cid)
                .collection("messages")
                .order_by("created_at", direction=firestore.Query.DESCENDING)
                .limit(1)
            )
            for ms in q.stream():
                md = ms.to_dict() or {}
                last_at = float(md.get("created_at") or 0.0)

        read_id = _channel_read_doc_id(cid, uid)
        last_read_at = float((channel_read_docs.get(read_id) or {}).get("last_read_at") or 0.0)
        has_unread = bool(last_at and last_at > last_read_at)
        if has_unread:
            unread_channels += 1
        channels_out[cid] = {"has_unread": has_unread, "last_message_at": last_at, "last_read_at": last_read_at}

    return {
        "total_unread": int(unread_threads + unread_channels),
        "threads": threads_out,
        "channels": channels_out,
    }


@router.post("/threads/{thread_id}/read")
async def mark_thread_read(thread_id: str, user: Dict[str, Any] = Depends(get_current_user)):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")
    thread = _get_thread(thread_id)
    _assert_member(uid, thread)

    now = _now()
    db.collection("conversation_reads").document(_conversation_read_doc_id(thread_id, uid)).set(
        {
            "thread_id": thread_id,
            "uid": uid,
            "last_read_at": now,
            "updated_at": now,
        },
        merge=True,
    )
    return {"ok": True, "thread_id": thread_id, "last_read_at": now}


@router.get("/carrier/drivers")
async def list_carrier_drivers(user: Dict[str, Any] = Depends(get_current_user)):
    uid = user.get("uid")
    if user.get("role") != "carrier":
        raise HTTPException(status_code=403, detail="Carrier access required")

    rows: List[Dict[str, Any]] = []
    q = db.collection("drivers").where("carrier_id", "==", uid)
    for snap in q.stream():
        d = snap.to_dict() or {}
        driver_id = snap.id
        d["id"] = driver_id
        try:
            ident = _get_driver_identity(driver_id)
            d.setdefault("name", ident.get("name"))
            d["profile_picture_url"] = ident.get("photo_url")
        except Exception:
            # Keep minimal driver record if profile lookup fails
            pass
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

    # Optional email notifications
    if getattr(settings, "ENABLE_MESSAGE_EMAIL_NOTIFICATIONS", False):
        try:
            members = thread.get("member_uids") or []
            recipients = [m for m in members if m and m != uid]
            sender_name = _sender_display_name(user)
            thread_label = thread.get("title") or "Conversation"
            subject = f"New message from {sender_name}"
            body = f"{sender_name} sent a new message in {thread_label}:\n\n{msg['text']}\n"

            async def _send(to_uid: str):
                email = _email_for_uid(to_uid)
                if not email:
                    return False
                return await asyncio.to_thread(_send_email, email, subject, body, False)

            await asyncio.gather(*[_send(r) for r in recipients])
        except Exception as e:
            # Never fail sending a chat message due to email issues
            print(f"Email notification error: {e}")

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
        ch = _ensure_admin_channel(cid, cid)
        # Backfill last_message metadata if missing (keeps frontend fast).
        if not ch.get("last_message_at"):
            try:
                q = (
                    db.collection("admin_channels")
                    .document(cid)
                    .collection("messages")
                    .order_by("created_at", direction=firestore.Query.DESCENDING)
                    .limit(1)
                )
                last = None
                for s in q.stream():
                    last = s.to_dict() or {}
                if last and last.get("created_at"):
                    db.collection("admin_channels").document(cid).set(
                        {
                            "last_message_at": float(last.get("created_at") or 0.0),
                            "last_message": {
                                "text": last.get("text"),
                                "title": last.get("title"),
                                "sender_role": last.get("sender_role"),
                            },
                            "updated_at": float(last.get("created_at") or _now()),
                        },
                        merge=True,
                    )
                    # Keep response consistent
                    ch["last_message_at"] = float(last.get("created_at") or 0.0)
                    ch["last_message"] = {
                        "text": last.get("text"),
                        "title": last.get("title"),
                        "sender_role": last.get("sender_role"),
                    }
            except Exception:
                pass
        channels.append(ch)

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


@router.post("/notifications/channels/{channel_id}/read")
async def mark_channel_read(channel_id: str, user: Dict[str, Any] = Depends(get_current_user)):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    role = user.get("role") or "carrier"
    if channel_id not in {"all", role} and user.get("role") not in {"admin", "super_admin"}:
        raise HTTPException(status_code=403, detail="Not allowed")

    now = _now()
    db.collection("admin_channel_reads").document(_channel_read_doc_id(channel_id, uid)).set(
        {
            "channel_id": channel_id,
            "uid": uid,
            "last_read_at": now,
            "updated_at": now,
        },
        merge=True,
    )
    return {"ok": True, "channel_id": channel_id, "last_read_at": now}


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
    db.collection("admin_channels").document(channel_id).set(
        {
            "updated_at": now,
            "last_message_at": now,
            "last_message": {"text": msg["text"], "title": msg.get("title"), "sender_role": msg.get("sender_role")},
        },
        merge=True,
    )

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
