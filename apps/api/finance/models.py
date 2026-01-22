from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    ISSUED = "issued"
    SENT = "sent"
    FACTORING_SUBMITTED = "factoring_submitted"
    FACTORING_ACCEPTED = "factoring_accepted"
    FACTORING_REJECTED = "factoring_rejected"
    PARTIALLY_PAID = "partially_paid"
    PAID = "paid"
    OVERDUE = "overdue"
    VOID = "void"


class FactoringSubmissionStatus(str, Enum):
    SUBMITTED = "submitted"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    FUNDED = "funded"
    CANCELLED = "cancelled"


class PaymentMethod(str, Enum):
    ACH = "ach"
    WIRE = "wire"
    CHECK = "check"
    CARD = "card"
    FACTORING_ADVANCE = "factoring_advance"
    FACTORING_RESERVE_RELEASE = "factoring_reserve_release"
    OTHER = "other"


class InvoiceAttachment(BaseModel):
    kind: str  # e.g. POD, BOL, RATE_CONFIRMATION, OTHER
    url: Optional[str] = None
    document_id: Optional[str] = None
    filename: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class InvoiceCreateRequest(BaseModel):
    load_id: str
    amount_total: float
    currency: str = "USD"

    # Optional overrides
    invoice_number: Optional[str] = None
    due_date: Optional[float] = None
    due_in_days: Optional[int] = None

    # If omitted, derived from load.
    payer_uid: Optional[str] = None
    payer_role: Optional[str] = None

    # Factoring intent
    factoring_enabled: bool = False
    factoring_provider: Optional[str] = None

    attachments: List[InvoiceAttachment] = Field(default_factory=list)
    notes: Optional[str] = None


class InvoiceActionResponse(BaseModel):
    ok: bool = True
    invoice_id: str
    status: InvoiceStatus
    message: str


class InvoiceRecord(BaseModel):
    invoice_id: str
    invoice_number: str

    load_id: str

    issuer_uid: str
    issuer_role: str

    payer_uid: str
    payer_role: str

    status: InvoiceStatus

    amount_total: float
    amount_paid: float = 0.0
    currency: str = "USD"

    due_date: Optional[float] = None
    issued_at: Optional[float] = None
    sent_at: Optional[float] = None
    paid_at: Optional[float] = None
    overdue_at: Optional[float] = None
    voided_at: Optional[float] = None

    factoring_enabled: bool = False
    factoring_provider: Optional[str] = None
    factoring_submission_id: Optional[str] = None

    attachments: List[InvoiceAttachment] = Field(default_factory=list)
    notes: Optional[str] = None

    created_at: float
    updated_at: float

    # Freeform extensibility.
    metadata: Dict[str, Any] = Field(default_factory=dict)


class InvoiceListResponse(BaseModel):
    invoices: List[InvoiceRecord]
    total: int


class FactoringSubmitRequest(BaseModel):
    provider: str


class FactoringSubmissionRecord(BaseModel):
    submission_id: str
    invoice_id: str
    provider: str
    status: FactoringSubmissionStatus

    provider_reference: Optional[str] = None

    submitted_at: float
    updated_at: float

    advance_amount: Optional[float] = None
    fee_amount: Optional[float] = None
    funded_at: Optional[float] = None

    metadata: Dict[str, Any] = Field(default_factory=dict)


class FactoringWebhookRequest(BaseModel):
    event_id: str
    event_type: str
    occurred_at: Optional[float] = None

    invoice_id: Optional[str] = None
    submission_id: Optional[str] = None

    payload: Dict[str, Any] = Field(default_factory=dict)


class WebhookEventRecord(BaseModel):
    provider: str
    event_id: str
    event_type: str
    received_at: float
    occurred_at: Optional[float] = None

    processed_at: Optional[float] = None
    processing_error: Optional[str] = None

    invoice_id: Optional[str] = None
    submission_id: Optional[str] = None

    payload: Dict[str, Any] = Field(default_factory=dict)


class PaymentCreateRequest(BaseModel):
    amount: float
    currency: str = "USD"
    method: PaymentMethod = PaymentMethod.OTHER
    received_at: Optional[float] = None
    external_id: Optional[str] = None
    notes: Optional[str] = None


class PaymentTransactionRecord(BaseModel):
    payment_id: str
    invoice_id: str

    amount: float
    currency: str = "USD"
    method: PaymentMethod

    received_at: float
    created_at: float

    external_id: Optional[str] = None
    notes: Optional[str] = None

    metadata: Dict[str, Any] = Field(default_factory=dict)


class FinanceSummaryResponse(BaseModel):
    role_scope: str

    outstanding_amount: float
    overdue_amount: float
    paid_amount_30d: float

    open_invoice_count: int
    overdue_invoice_count: int

    factoring_outstanding_amount: float


class FinanceForecastResponse(BaseModel):
    role_scope: str
    range_days: int

    expected_direct_payments: float
    expected_factoring_advances: float
    overdue_collections: float
