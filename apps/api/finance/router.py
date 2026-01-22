from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from typing import Any, Dict, Optional

from pathlib import Path

from ..auth import get_current_user, require_admin
from ..storage import ResponseStore

from .models import (
    FactoringSubmitRequest,
    FactoringWebhookRequest,
    FinanceForecastResponse,
    FinanceSummaryResponse,
    InvoiceActionResponse,
    InvoiceCreateRequest,
    InvoiceListResponse,
    InvoiceRecord,
    PaymentCreateRequest,
)
from .repo import (
    create_invoice,
    get_invoice,
    list_invoices_for_user,
    mark_overdue_invoices,
    process_webhook_event,
    record_payment,
    send_invoice,
    submit_to_factoring,
)
from .service import compute_forecast, compute_summary


router = APIRouter(prefix="", tags=["Finance"])


_STORE = ResponseStore(base_dir=str(Path(__file__).resolve().parents[3] / "data"))


def _store() -> ResponseStore:
    return _STORE


@router.get("/invoices", response_model=InvoiceListResponse)
async def invoices_list(
    limit: int = 200,
    user: Dict[str, Any] = Depends(get_current_user),
):
    items = list_invoices_for_user(user=user, limit=limit)
    return InvoiceListResponse(invoices=items, total=len(items))


@router.get("/invoices/{invoice_id}", response_model=InvoiceRecord)
async def invoices_get(invoice_id: str, user: Dict[str, Any] = Depends(get_current_user)):
    inv = get_invoice(invoice_id=invoice_id)
    uid = user["uid"]
    role = str(user.get("role") or "")
    if role not in {"admin", "super_admin"} and uid not in {inv.issuer_uid, inv.payer_uid}:
        raise HTTPException(status_code=403, detail="Not authorized")
    return inv


@router.post("/invoices", response_model=InvoiceRecord)
async def invoices_create(req: InvoiceCreateRequest, user: Dict[str, Any] = Depends(get_current_user)):
    role = str(user.get("role") or "")
    if role not in {"carrier", "broker", "admin", "super_admin"}:
        raise HTTPException(status_code=403, detail="Only carriers/brokers can create invoices")

    try:
        return create_invoice(request=req, user=user, store=_store())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/invoices/{invoice_id}/send", response_model=InvoiceActionResponse)
async def invoices_send(invoice_id: str, user: Dict[str, Any] = Depends(get_current_user)):
    try:
        inv = send_invoice(invoice_id=invoice_id, user=user)
        return InvoiceActionResponse(invoice_id=inv.invoice_id, status=inv.status, message="Invoice sent")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/invoices/{invoice_id}/submit-factoring")
async def invoices_submit_factoring(
    invoice_id: str,
    req: FactoringSubmitRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    try:
        inv, submission = submit_to_factoring(invoice_id=invoice_id, user=user, provider_name=req.provider)
        return {"invoice": inv.model_dump(mode="json"), "submission": submission.model_dump(mode="json")}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/invoices/{invoice_id}/payments")
async def invoices_record_payment(
    invoice_id: str,
    req: PaymentCreateRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    try:
        inv, payment = record_payment(invoice_id=invoice_id, request=req, user=user)
        return {"invoice": inv.model_dump(mode="json"), "payment": payment.model_dump(mode="json")}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/factoring/webhooks/{provider}")
async def factoring_webhook(provider: str, req: FactoringWebhookRequest):
    try:
        event = process_webhook_event(provider=provider, req=req.model_dump(mode="json"))
        return {"ok": True, "event": event.model_dump(mode="json")}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/finance/summary", response_model=FinanceSummaryResponse)
async def finance_summary(user: Dict[str, Any] = Depends(get_current_user)):
    invoices = list_invoices_for_user(user=user, limit=500)
    role_scope = str(user.get("role") or "")
    return compute_summary(invoices=invoices, role_scope=role_scope)


@router.get("/finance/forecast", response_model=FinanceForecastResponse)
async def finance_forecast(range_days: int = 30, user: Dict[str, Any] = Depends(get_current_user)):
    invoices = list_invoices_for_user(user=user, limit=500)
    role_scope = str(user.get("role") or "")
    return compute_forecast(invoices=invoices, role_scope=role_scope, range_days=range_days)


@router.post("/finance/overdue/run")
async def finance_run_overdue(user: Dict[str, Any] = Depends(require_admin)):
    updated = mark_overdue_invoices(max_docs=500)
    return {"ok": True, "updated": updated}
