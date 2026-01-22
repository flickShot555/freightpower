from __future__ import annotations

import time
import uuid
from typing import Any, Dict, List, Optional, Tuple

from firebase_admin import firestore

from ..database import db
from ..storage import ResponseStore
from .factoring_provider import get_provider
from .models import (
    FactoringSubmissionRecord,
    FactoringSubmissionStatus,
    InvoiceAttachment,
    InvoiceCreateRequest,
    InvoiceRecord,
    InvoiceStatus,
    PaymentCreateRequest,
    PaymentTransactionRecord,
    WebhookEventRecord,
)
from .state import InvoiceRequirements, assert_transition, required_docs_present


def _now() -> float:
    return float(time.time())


def _days_from_payment_terms(payment_terms: Optional[str]) -> Optional[int]:
    if not payment_terms:
        return None
    s = str(payment_terms).strip().lower()
    if "quick" in s:
        return 2
    if s.startswith("7"):
        return 7
    if s.startswith("15"):
        return 15
    if s.startswith("30"):
        return 30
    return None


def _generate_invoice_number() -> str:
    # Human-friendly, unique enough for UI; authoritative key is invoice_id.
    return f"INV-{uuid.uuid4().hex[:8].upper()}"


def _invoice_doc_ref(invoice_id: str):
    return db.collection("invoices").document(invoice_id)


def _submission_doc_ref(submission_id: str):
    return db.collection("factoring_submissions").document(submission_id)


def _event_doc_ref(provider: str, event_id: str):
    key = f"{provider}:{event_id}"
    return db.collection("factoring_webhook_events").document(key)


def _payment_doc_ref(payment_id: str):
    return db.collection("payment_transactions").document(payment_id)


def _load_from_sources(load_id: str, store: ResponseStore) -> Optional[Dict[str, Any]]:
    # Prefer Firestore, fallback to JSON store.
    try:
        snap = db.collection("loads").document(load_id).get()
        if snap.exists:
            d = snap.to_dict() or {}
            d["load_id"] = snap.id
            return d
    except Exception:
        pass
    return store.get_load(load_id)


def create_invoice(*, request: InvoiceCreateRequest, user: Dict[str, Any], store: ResponseStore) -> InvoiceRecord:
    uid = user["uid"]
    role = str(user.get("role") or "")

    load = _load_from_sources(request.load_id, store)
    if not load:
        raise ValueError("Load not found")

    load_status = str(load.get("status") or "").lower()
    if load_status not in {"delivered", "completed"}:
        raise ValueError("Invoice can only be created for delivered/completed loads")

    payer_uid = request.payer_uid or str(load.get("created_by") or "")
    payer_role = request.payer_role or "shipper"

    if not payer_uid:
        raise ValueError("payer_uid could not be determined")

    invoice_id = str(uuid.uuid4())
    invoice_number = request.invoice_number or _generate_invoice_number()

    now = _now()

    due_date = request.due_date
    if due_date is None:
        if request.due_in_days is not None:
            due_date = now + int(request.due_in_days) * 86400.0
        else:
            days = _days_from_payment_terms(load.get("payment_terms"))
            if days is not None:
                due_date = now + float(days) * 86400.0

    attachments: List[InvoiceAttachment] = list(request.attachments or [])

    # Auto-attach POD from load if present and caller didn't provide it.
    has_pod = any((a.kind or "").strip().upper() == "POD" for a in attachments)
    if not has_pod and load.get("delivery_photo_url"):
        attachments.append(InvoiceAttachment(kind="POD", url=str(load.get("delivery_photo_url"))))

    record = InvoiceRecord(
        invoice_id=invoice_id,
        invoice_number=invoice_number,
        load_id=request.load_id,
        issuer_uid=uid,
        issuer_role=role,
        payer_uid=payer_uid,
        payer_role=payer_role,
        status=InvoiceStatus.ISSUED,
        amount_total=float(request.amount_total),
        amount_paid=0.0,
        currency=request.currency,
        due_date=due_date,
        issued_at=now,
        sent_at=None,
        paid_at=None,
        overdue_at=None,
        voided_at=None,
        factoring_enabled=bool(request.factoring_enabled),
        factoring_provider=(request.factoring_provider or None),
        factoring_submission_id=None,
        attachments=attachments,
        notes=request.notes,
        created_at=now,
        updated_at=now,
        metadata={},
    )

    _invoice_doc_ref(invoice_id).set(record.model_dump(mode="json"), merge=True)

    # Best-effort: write invoice_number back to load for UI convenience.
    try:
        db.collection("loads").document(request.load_id).set(
            {"invoice_id": invoice_id, "invoice_number": invoice_number, "invoiced_at": now, "updated_at": now},
            merge=True,
        )
    except Exception:
        pass
    try:
        store.update_load(request.load_id, {"invoice_id": invoice_id, "invoice_number": invoice_number, "invoiced_at": now, "updated_at": now})
    except Exception:
        pass

    return record


def list_invoices_for_user(*, user: Dict[str, Any], limit: int = 200) -> List[InvoiceRecord]:
    uid = user["uid"]
    role = str(user.get("role") or "")

    col = db.collection("invoices")

    snaps = []
    if role in {"carrier", "driver"}:
        snaps = list(col.where("issuer_uid", "==", uid).limit(int(limit)).stream())
    elif role in {"shipper"}:
        snaps = list(col.where("payer_uid", "==", uid).limit(int(limit)).stream())
    elif role in {"broker"}:
        # Firestore has no OR; merge both sides.
        a = list(col.where("issuer_uid", "==", uid).limit(int(limit)).stream())
        b = list(col.where("payer_uid", "==", uid).limit(int(limit)).stream())
        seen = set()
        for s in a + b:
            if s.id in seen:
                continue
            snaps.append(s)
            seen.add(s.id)
    else:
        # Admin/super_admin: return latest
        snaps = list(col.limit(int(limit)).stream())

    out: List[InvoiceRecord] = []
    for s in snaps:
        d = s.to_dict() or {}
        d.setdefault("invoice_id", s.id)
        out.append(InvoiceRecord(**d))

    # Sort by created_at desc (best-effort).
    out.sort(key=lambda r: float(r.created_at or 0), reverse=True)
    return out


def get_invoice(*, invoice_id: str) -> InvoiceRecord:
    snap = _invoice_doc_ref(invoice_id).get()
    if not snap.exists:
        raise ValueError("Invoice not found")
    d = snap.to_dict() or {}
    d.setdefault("invoice_id", snap.id)
    return InvoiceRecord(**d)


def _update_invoice_status(*, invoice_id: str, new_status: InvoiceStatus, now: float, extra: Dict[str, Any] | None = None) -> InvoiceRecord:
    ref = _invoice_doc_ref(invoice_id)

    @firestore.transactional
    def txn_update(txn: firestore.Transaction) -> Dict[str, Any]:
        snap = ref.get(transaction=txn)
        if not snap.exists:
            raise ValueError("Invoice not found")
        current = snap.to_dict() or {}
        cur_status = InvoiceStatus(str(current.get("status") or InvoiceStatus.DRAFT.value))
        assert_transition(cur_status, new_status)

        patch: Dict[str, Any] = {"status": new_status.value, "updated_at": now}
        if new_status == InvoiceStatus.SENT:
            patch["sent_at"] = now
        if new_status == InvoiceStatus.OVERDUE:
            patch["overdue_at"] = now
        if new_status == InvoiceStatus.VOID:
            patch["voided_at"] = now

        if extra:
            patch.update(extra)

        txn.set(ref, patch, merge=True)
        updated = dict(current)
        updated.update(patch)
        updated.setdefault("invoice_id", invoice_id)
        return updated

    txn = db.transaction()
    updated = txn_update(txn)
    return InvoiceRecord(**updated)


def send_invoice(*, invoice_id: str, user: Dict[str, Any]) -> InvoiceRecord:
    inv = get_invoice(invoice_id=invoice_id)
    uid = user["uid"]
    if inv.issuer_uid != uid and user.get("role") not in {"admin", "super_admin"}:
        raise ValueError("Not authorized to send this invoice")
    return _update_invoice_status(invoice_id=invoice_id, new_status=InvoiceStatus.SENT, now=_now())


def submit_to_factoring(*, invoice_id: str, user: Dict[str, Any], provider_name: str) -> Tuple[InvoiceRecord, FactoringSubmissionRecord]:
    now = _now()
    inv = get_invoice(invoice_id=invoice_id)
    uid = user["uid"]
    if inv.issuer_uid != uid and user.get("role") not in {"admin", "super_admin"}:
        raise ValueError("Not authorized to submit this invoice")

    if not inv.factoring_enabled:
        raise ValueError("Factoring not enabled for this invoice")

    # Enforce minimal document requirement before factoring.
    if not required_docs_present([a.model_dump() for a in inv.attachments], InvoiceRequirements(require_pod=True, require_bol=False)):
        raise ValueError("Missing required documents (POD) for factoring submission")

    provider = get_provider(provider_name)

    submission_id = str(uuid.uuid4())
    result = provider.submit_invoice(invoice=inv.model_dump(mode="json"))

    submission_status = FactoringSubmissionStatus.ACCEPTED if result.accepted else FactoringSubmissionStatus.REJECTED

    sub = FactoringSubmissionRecord(
        submission_id=submission_id,
        invoice_id=invoice_id,
        provider=provider_name,
        status=submission_status,
        provider_reference=result.provider_reference,
        submitted_at=now,
        updated_at=now,
        advance_amount=(float(inv.amount_total) * float(result.metadata.get("advance_rate", 0.9)) if result.accepted else None),
        fee_amount=None,
        funded_at=None,
        metadata=result.metadata,
    )

    _submission_doc_ref(submission_id).set(sub.model_dump(mode="json"), merge=True)

    inv2 = _update_invoice_status(
        invoice_id=invoice_id,
        new_status=(InvoiceStatus.FACTORING_ACCEPTED if result.accepted else InvoiceStatus.FACTORING_REJECTED),
        now=now,
        extra={"factoring_provider": provider_name, "factoring_submission_id": submission_id},
    )

    return inv2, sub


def record_payment(*, invoice_id: str, request: PaymentCreateRequest, user: Dict[str, Any]) -> Tuple[InvoiceRecord, PaymentTransactionRecord]:
    now = _now()
    inv = get_invoice(invoice_id=invoice_id)

    uid = user["uid"]
    # Issuer (seller) and payer (buyer) can record payments; admins too.
    if uid not in {inv.issuer_uid, inv.payer_uid} and user.get("role") not in {"admin", "super_admin"}:
        raise ValueError("Not authorized to record payment")

    received_at = float(request.received_at or now)

    payment_id = str(uuid.uuid4())
    pay = PaymentTransactionRecord(
        payment_id=payment_id,
        invoice_id=invoice_id,
        amount=float(request.amount),
        currency=request.currency,
        method=request.method,
        received_at=received_at,
        created_at=now,
        external_id=request.external_id,
        notes=request.notes,
        metadata={},
    )
    _payment_doc_ref(payment_id).set(pay.model_dump(mode="json"), merge=True)

    new_paid = float(inv.amount_paid or 0) + float(pay.amount)
    new_status = InvoiceStatus.PAID if new_paid >= float(inv.amount_total) else InvoiceStatus.PARTIALLY_PAID

    inv2 = _update_invoice_status(
        invoice_id=invoice_id,
        new_status=new_status,
        now=now,
        extra={"amount_paid": new_paid, "paid_at": (now if new_status == InvoiceStatus.PAID else None)},
    )

    return inv2, pay


def process_webhook_event(*, provider: str, req: Dict[str, Any]) -> WebhookEventRecord:
    provider = (provider or "").strip().lower() or "mock"
    event_id = str(req.get("event_id") or "").strip()
    if not event_id:
        raise ValueError("event_id is required")

    now = _now()
    occurred_at = req.get("occurred_at")
    event_type = str(req.get("event_type") or "").strip() or "unknown"
    invoice_id = req.get("invoice_id")
    submission_id = req.get("submission_id")
    payload = req.get("payload") or {}

    event_ref = _event_doc_ref(provider, event_id)

    @firestore.transactional
    def txn_process(txn: firestore.Transaction) -> Dict[str, Any]:
        snap = event_ref.get(transaction=txn)
        if snap.exists:
            existing = snap.to_dict() or {}
            # Idempotent: if already processed, return it.
            if existing.get("processed_at"):
                return existing

        base = {
            "provider": provider,
            "event_id": event_id,
            "event_type": event_type,
            "received_at": now,
            "occurred_at": occurred_at,
            "processed_at": None,
            "processing_error": None,
            "invoice_id": invoice_id,
            "submission_id": submission_id,
            "payload": payload,
        }
        txn.set(event_ref, base, merge=True)

        try:
            # Apply minimal, provider-agnostic effects.
            if invoice_id:
                if event_type in {"invoice.paid", "paid"}:
                    inv = get_invoice(invoice_id=invoice_id)
                    # Mark as paid (no amount info from webhook assumed).
                    assert_transition(InvoiceStatus(inv.status), InvoiceStatus.PAID)
                    txn.set(_invoice_doc_ref(invoice_id), {"status": InvoiceStatus.PAID.value, "paid_at": now, "updated_at": now}, merge=True)
                elif event_type in {"factoring.accepted", "submission.accepted"}:
                    inv = get_invoice(invoice_id=invoice_id)
                    assert_transition(InvoiceStatus(inv.status), InvoiceStatus.FACTORING_ACCEPTED)
                    txn.set(_invoice_doc_ref(invoice_id), {"status": InvoiceStatus.FACTORING_ACCEPTED.value, "updated_at": now}, merge=True)
                elif event_type in {"factoring.rejected", "submission.rejected"}:
                    inv = get_invoice(invoice_id=invoice_id)
                    assert_transition(InvoiceStatus(inv.status), InvoiceStatus.FACTORING_REJECTED)
                    txn.set(_invoice_doc_ref(invoice_id), {"status": InvoiceStatus.FACTORING_REJECTED.value, "updated_at": now}, merge=True)
        except Exception as e:
            base["processing_error"] = str(e)

        base["processed_at"] = now
        txn.set(event_ref, {"processed_at": now, "processing_error": base.get("processing_error")}, merge=True)
        return base

    txn = db.transaction()
    d = txn_process(txn)
    return WebhookEventRecord(**d)


def mark_overdue_invoices(*, max_docs: int = 250) -> int:
    now = _now()
    col = db.collection("invoices")

    # Fetch candidates by status; due_date filter is not indexed everywhere, so filter in Python.
    statuses = [InvoiceStatus.SENT.value, InvoiceStatus.ISSUED.value, InvoiceStatus.PARTIALLY_PAID.value, InvoiceStatus.FACTORING_SUBMITTED.value, InvoiceStatus.FACTORING_ACCEPTED.value]

    try:
        snaps = list(col.where("status", "in", statuses).limit(int(max_docs)).stream())
    except Exception:
        snaps = list(col.limit(int(max_docs)).stream())

    updated = 0
    for s in snaps:
        d = s.to_dict() or {}
        try:
            due = d.get("due_date")
            if not due:
                continue
            if float(due) >= now:
                continue
            st = str(d.get("status") or "")
            if st == InvoiceStatus.OVERDUE.value or st == InvoiceStatus.PAID.value or st == InvoiceStatus.VOID.value:
                continue
            _invoice_doc_ref(s.id).set({"status": InvoiceStatus.OVERDUE.value, "overdue_at": now, "updated_at": now}, merge=True)
            updated += 1
        except Exception:
            continue

    return updated
