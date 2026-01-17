# File: apps/api/auth.py
from fastapi import APIRouter, HTTPException, Header, Depends, Body, status, UploadFile, File, Request
from firebase_admin import auth as firebase_auth
from firebase_admin import firestore
import firebase_admin
import time
import json
import uuid
from typing import Optional, Dict, Any
from functools import wraps
import httpx
from pydantic import BaseModel, EmailStr

# Use relative imports
from .database import db, log_action, record_profile_update
from .fmcsa import FmcsaClient
from .models import (
    UserSignup, Role, SignupResponse, LoginRequest, 
    TokenResponse, RefreshTokenRequest, UserProfile, ProfileUpdate
)
from .settings import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _normalize_identifier(value: Any) -> str | None:
    if value is None:
        return None
    s = str(value).strip()
    if not s:
        return None
    digits = "".join(ch for ch in s if ch.isdigit())
    return digits or s


def _summarize_fmcsa_verification(verification: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "result": verification.get("result"),
        "reasons": verification.get("reasons", []),
        "usdot": verification.get("usdot"),
        "mc_number": verification.get("mc_number"),
        "fetched_at": verification.get("fetched_at"),
    }


class AdminRequestSignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None


class PasswordLoginRequest(BaseModel):
    email: EmailStr
    password: str


class CustomTokenResponse(BaseModel):
    ok: bool = True
    custom_token: str
    uid: str
    role: str


class SuperAdminProfile(BaseModel):
    uid: str
    name: str
    email: EmailStr
    photo_url: Optional[str] = None


class SuperAdminProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    new_password: Optional[str] = None
    photo_url: Optional[str] = None


def _super_admin_allowlist() -> set[str]:
    raw = settings.SUPER_ADMIN_EMAILS or ""
    emails = {e.strip().lower() for e in raw.split(",") if e.strip()}
    if settings.ADMIN_EMAIL:
        emails.add(settings.ADMIN_EMAIL.strip().lower())
    return emails


async def _firebase_verify_password(email: str, password: str) -> Dict[str, Any]:
    """Verifies email/password using Firebase Identity Toolkit."""
    api_key = settings.FIREBASE_WEB_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="FIREBASE_WEB_API_KEY is not configured")

    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {"email": email, "password": password, "returnSecureToken": True}
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(url, json=payload)
    if resp.status_code != 200:
        # Normalize Firebase errors
        try:
            data = resp.json()
            msg = data.get("error", {}).get("message", "INVALID_LOGIN")
        except Exception:
            msg = "INVALID_LOGIN"
        raise HTTPException(status_code=401, detail=f"Invalid email or password ({msg})")

    return resp.json()


def _ensure_super_admin_firestore(uid: str, email: str):
    now = time.time()
    db.collection("users").document(uid).set(
        {
            "uid": uid,
            "email": email,
            "name": "Super Admin",
            "phone": None,
            "role": "super_admin",
            "company_name": None,
            "is_verified": True,
            "email_verified": True,
            "phone_verified": False,
            "mfa_enabled": False,
            "failed_login_attempts": 0,
            "is_active": True,
            "is_locked": False,
            "onboarding_completed": True,
            "onboarding_step": "COMPLETED",
            "onboarding_score": 0,
            "onboarding_data": None,
            "language": "en",
            "timezone": "UTC",
            "notification_preferences": {},
            "created_at": now,
            "updated_at": now,
            "last_login_at": None,
        },
        merge=True,
    )

    # Separate super admin profile collection
    db.collection("super_admins").document(uid).set(
        {
            "uid": uid,
            "name": "Super Admin",
            "email": email,
            "photo_url": None,
            "updated_at": now,
            "created_at": now,
        },
        merge=True,
    )


def _local_or_token_allowed(request: Request, x_admin_bootstrap_token: Optional[str]) -> None:
    """Allow only localhost when token is not set; otherwise require token."""
    if settings.ADMIN_BOOTSTRAP_TOKEN:
        if x_admin_bootstrap_token != settings.ADMIN_BOOTSTRAP_TOKEN:
            raise HTTPException(status_code=403, detail="Invalid bootstrap token")
        return

    client_host = request.client.host if request.client else ""
    if client_host not in {"127.0.0.1", "::1"}:
        raise HTTPException(
            status_code=403,
            detail="Bootstrap disabled (set ADMIN_BOOTSTRAP_TOKEN to enable non-local provisioning)",
        )


# ============================================================================
# Super Admin Bootstrap (development-friendly)
# ============================================================================

@router.post("/bootstrap-super-admin")
async def bootstrap_super_admin(
    request: Request,
    x_admin_bootstrap_token: Optional[str] = Header(None, alias="X-Admin-Bootstrap-Token"),
):
    """Bootstraps the hardcoded super-admin account in Firebase Auth + Firestore.

    Security model:
    - If settings.ADMIN_BOOTSTRAP_TOKEN is set, it must match X-Admin-Bootstrap-Token.
    - If not set (common in local dev), only allow requests from localhost.

    This endpoint exists to prevent confusing login failures when the super-admin user
    hasn't been manually created in Firebase Auth/Firestore yet.
    """
    _local_or_token_allowed(request, x_admin_bootstrap_token)

    email = settings.ADMIN_EMAIL or "freightpowerai@gmail.com"
    password = "123456"
    display_name = "Super Admin"

    try:
        try:
            user_record = firebase_auth.get_user_by_email(email)
            # Ensure the password matches the hardcoded value.
            firebase_auth.update_user(user_record.uid, password=password, display_name=display_name)
        except firebase_auth.UserNotFoundError:
            user_record = firebase_auth.create_user(
                email=email,
                password=password,
                display_name=display_name,
            )

        _ensure_super_admin_firestore(user_record.uid, email)

        log_action(user_record.uid, "SUPER_ADMIN_BOOTSTRAP", "Super admin account bootstrapped")

        return {"ok": True, "uid": user_record.uid, "email": email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bootstrap failed: {str(e)}")


@router.post("/super-admin/bootstrap-two")
async def bootstrap_two_super_admins(
    request: Request,
    x_admin_bootstrap_token: Optional[str] = Header(None, alias="X-Admin-Bootstrap-Token"),
):
    """Create two distinct super-admin accounts (Farhan and AbdulWadud).

    Notes:
    - Intended for initial setup.
    - Uses a temporary password; users can later change email/password in Profile.
    """
    _local_or_token_allowed(request, x_admin_bootstrap_token)

    temp_password = "123456"

    seeds = [
        {
            "name": "Farhan",
            "email": "freightpowerai@gmail.com",
        },
        {
            "name": "AbdulWadud",
            "email": "abdulwadudkhattak@gmail.com",
        },
    ]

    created: list[dict] = []
    for seed in seeds:
        email = seed["email"].strip().lower()
        name = seed["name"].strip()
        try:
            try:
                user_record = firebase_auth.get_user_by_email(email)
                firebase_auth.update_user(user_record.uid, display_name=name, password=temp_password)
            except firebase_auth.UserNotFoundError:
                user_record = firebase_auth.create_user(
                    email=email,
                    password=temp_password,
                    display_name=name,
                )

            now = time.time()
            db.collection("users").document(user_record.uid).set(
                {
                    "uid": user_record.uid,
                    "email": email,
                    "name": name,
                    "role": "super_admin",
                    "is_verified": True,
                    "email_verified": True,
                    "onboarding_completed": True,
                    "onboarding_step": "COMPLETED",
                    "created_at": now,
                    "updated_at": now,
                },
                merge=True,
            )
            db.collection("super_admins").document(user_record.uid).set(
                {
                    "uid": user_record.uid,
                    "name": name,
                    "email": email,
                    "photo_url": None,
                    "created_at": now,
                    "updated_at": now,
                },
                merge=True,
            )

            try:
                firebase_auth.set_custom_user_claims(user_record.uid, {"role": "super_admin"})
            except Exception:
                pass

            created.append({"uid": user_record.uid, "email": email, "name": name})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Bootstrap failed for {email}: {str(e)}")

    return {
        "ok": True,
        "temp_password": temp_password,
        "accounts": created,
        "note": "Login with the temp_password then change it in Super Admin Profile.",
    }


@router.post("/super-admin/login", response_model=CustomTokenResponse)
async def super_admin_login(payload: PasswordLoginRequest):
    """Backend-driven super admin login (supports multiple super admins)."""
    email = payload.email.strip().lower()
    auth_res = await _firebase_verify_password(email, payload.password)
    uid = auth_res.get("localId")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid login")

    allowlisted = email in _super_admin_allowlist()

    user_doc = db.collection("users").document(uid).get()
    user_data = user_doc.to_dict() if user_doc.exists else {}
    role = str((user_data or {}).get("role", "")).lower()

    # Controlled provisioning: only allowlisted emails can become super_admin.
    if (not user_doc.exists) or role != "super_admin":
        if not allowlisted:
            raise HTTPException(status_code=403, detail="Not provisioned as super admin")

        # Provision as super admin (first-time setup or recovery)
        now = time.time()
        db.collection("users").document(uid).set(
            {
                "uid": uid,
                "email": email,
                "name": user_data.get("name") or "Super Admin",
                "role": "super_admin",
                "is_verified": True,
                "email_verified": True,
                "onboarding_completed": True,
                "onboarding_step": "COMPLETED",
                "created_at": now,
                "updated_at": now,
            },
            merge=True,
        )

        db.collection("super_admins").document(uid).set(
            {
                "uid": uid,
                "name": user_data.get("name") or "Super Admin",
                "email": email,
                "photo_url": None,
                "created_at": now,
                "updated_at": now,
            },
            merge=True,
        )

        try:
            firebase_auth.set_custom_user_claims(uid, {"role": "super_admin"})
        except Exception:
            pass

        user_doc = db.collection("users").document(uid).get()
        user_data = user_doc.to_dict() or {}

    # Auto-create/merge super_admins profile doc on login
    now = time.time()
    db.collection("super_admins").document(uid).set(
        {
            "uid": uid,
            "name": user_data.get("name") or "Super Admin",
            "email": (user_data.get("email") or email).strip().lower(),
            "photo_url": user_data.get("photo_url") if user_data.get("photo_url") else None,
            "updated_at": now,
        },
        merge=True,
    )

    token = firebase_auth.create_custom_token(uid)
    token_str = token.decode("utf-8") if isinstance(token, (bytes, bytearray)) else str(token)
    return CustomTokenResponse(custom_token=token_str, uid=uid, role="super_admin")


class SuperAdminBootstrapRequest(BaseModel):
    email: EmailStr
    password: str = "123456"
    name: Optional[str] = None


@router.post("/super-admin/bootstrap")
async def bootstrap_allowlisted_super_admin(
    payload: SuperAdminBootstrapRequest,
    request: Request,
    x_admin_bootstrap_token: Optional[str] = Header(None, alias="X-Admin-Bootstrap-Token"),
):
    """Create/update a super-admin user for an allowlisted email (setup endpoint)."""
    _local_or_token_allowed(request, x_admin_bootstrap_token)

    email = payload.email.strip().lower()
    if email not in _super_admin_allowlist():
        raise HTTPException(status_code=403, detail="Email not allowlisted for super admin")

    display_name = (payload.name or "Super Admin").strip()
    password = payload.password
    try:
        try:
            user_record = firebase_auth.get_user_by_email(email)
            firebase_auth.update_user(user_record.uid, display_name=display_name, password=password)
        except firebase_auth.UserNotFoundError:
            user_record = firebase_auth.create_user(email=email, password=password, display_name=display_name)

        now = time.time()
        db.collection("users").document(user_record.uid).set(
            {
                "uid": user_record.uid,
                "email": email,
                "name": display_name,
                "role": "super_admin",
                "is_verified": True,
                "email_verified": True,
                "onboarding_completed": True,
                "onboarding_step": "COMPLETED",
                "created_at": now,
                "updated_at": now,
            },
            merge=True,
        )
        db.collection("super_admins").document(user_record.uid).set(
            {
                "uid": user_record.uid,
                "name": display_name,
                "email": email,
                "photo_url": None,
                "created_at": now,
                "updated_at": now,
            },
            merge=True,
        )

        try:
            firebase_auth.set_custom_user_claims(user_record.uid, {"role": "super_admin"})
        except Exception:
            pass

        return {"ok": True, "uid": user_record.uid, "email": email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bootstrap failed: {str(e)}")


@router.post("/admin/request-signup")
async def admin_request_signup(payload: AdminRequestSignupRequest):
    """Backend-driven admin signup request.

    Creates Firebase Auth user, writes users/{uid} with admin_approved=false, and writes admin_requests/{uid}.
    This bypasses client-side Firestore rules so the request is reliably created.
    """
    email = payload.email.strip().lower()
    try:
        user_record = firebase_auth.create_user(
            email=email,
            password=payload.password,
            display_name=payload.name.strip() if payload.name else None,
            phone_number=payload.phone if payload.phone else None,
        )
    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")

    now = time.time()
    db.collection("users").document(user_record.uid).set(
        {
            "uid": user_record.uid,
            "email": email,
            "name": payload.name.strip(),
            "phone": payload.phone or None,
            "role": "admin",
            "admin_approved": False,
            "is_verified": True,
            "email_verified": False,
            "phone_verified": False,
            "mfa_enabled": False,
            "failed_login_attempts": 0,
            "is_active": True,
            "is_locked": False,
            "created_at": now,
            "updated_at": now,
            "last_login_at": None,
        },
        merge=True,
    )

    db.collection("admin_requests").document(user_record.uid).set(
        {
            "uid": user_record.uid,
            "email": email,
            "name": payload.name.strip(),
            "requested_role": "admin",
            "status": "pending",
            "created_at": now,
            "updated_at": now,
        },
        merge=True,
    )

    log_action(user_record.uid, "ADMIN_REQUEST_SIGNUP", "Admin signup request created")
    return {"ok": True, "uid": user_record.uid}


@router.post("/admin/login", response_model=CustomTokenResponse)
async def admin_login(payload: PasswordLoginRequest):
    """Backend-driven admin login.

    Verifies email/password via Firebase Identity Toolkit, then checks admin_approved.
    If approved, issues a Firebase custom token.
    """
    auth_res = await _firebase_verify_password(payload.email.strip(), payload.password)
    uid = auth_res.get("localId")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid login")

    user_doc = db.collection("users").document(uid).get()
    if not user_doc.exists:
        # Create a pending request record as a safety net
        db.collection("admin_requests").document(uid).set(
            {
                "uid": uid,
                "email": payload.email.strip().lower(),
                "name": "",
                "requested_role": "admin",
                "status": "pending",
                "created_at": time.time(),
                "updated_at": time.time(),
            },
            merge=True,
        )
        raise HTTPException(status_code=403, detail="Pending approval")

    user_data = user_doc.to_dict()
    if str(user_data.get("role", "")).lower() != "admin" or user_data.get("admin_approved") is not True:
        # Ensure request exists
        db.collection("admin_requests").document(uid).set(
            {
                "uid": uid,
                "email": (user_data.get("email") or payload.email).strip().lower(),
                "name": user_data.get("name") or "",
                "requested_role": "admin",
                "status": "pending",
                "updated_at": time.time(),
            },
            merge=True,
        )
        raise HTTPException(status_code=403, detail="Pending approval")

    token = firebase_auth.create_custom_token(uid)
    token_str = token.decode("utf-8") if isinstance(token, (bytes, bytearray)) else str(token)
    db.collection("users").document(uid).update({"last_login_at": time.time(), "failed_login_attempts": 0})
    log_action(uid, "ADMIN_LOGIN", "Admin logged in")
    return CustomTokenResponse(custom_token=token_str, uid=uid, role="admin")


# ============================================================================
# Current User Dependency (must be defined first)
# ============================================================================

async def get_current_user(authorization: str = Header(...)) -> Dict[str, Any]:
    """
    Verifies the token AND checks if the user is verified.
    Returns comprehensive user data with RBAC-ready information.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, 
            detail="Invalid authorization header format"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        # Verify Firebase token
        decoded_token = firebase_auth.verify_id_token(token)
        uid = decoded_token.get('uid')
        
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid token structure")
        
        # Fetch Firestore user profile
        user_ref = db.collection("users").document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        user_data = user_doc.to_dict()
        
        # --- AUTO-VERIFY EMAIL ---
        # If Firebase says email is verified, but DB says unverified -> Update DB
        if decoded_token.get('email_verified') and not user_data.get('is_verified'):
            user_ref.update({
                "is_verified": True,
                "verified_at": time.time(),
                "email_verified": True
            })
            user_data['is_verified'] = True
            user_data['email_verified'] = True
            log_action(uid, "VERIFICATION", "User verified via Email Link")

        # --- ENFORCE VERIFICATION ---
        if not user_data.get("is_verified", False):
            raise HTTPException(
                status_code=403, 
                detail="Account not verified. Please check your email or verify phone."
            )
        
        # Ensure role exists and is valid
        if "role" not in user_data:
            user_data["role"] = "carrier"
            user_ref.update({"role": "carrier"})
        
        return user_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ============================================================================
# RBAC & Security Utilities (defined after get_current_user)
# ============================================================================

def require_role(*allowed_roles: Role):
    """Decorator to require specific roles for endpoints."""
    async def role_check(user: Dict[str, Any] = Depends(get_current_user)):
        user_role = Role(user.get("role", "carrier"))
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail=f"Access denied. Required roles: {[r.value for r in allowed_roles]}"
            )
        return user
    return role_check


def require_admin(user: Dict[str, Any] = Depends(get_current_user)):
    """Require admin or super_admin role."""
    user_role = user.get("role")
    if user_role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def require_super_admin(user: Dict[str, Any] = Depends(get_current_user)):
    """Require super_admin role only."""
    user_role = user.get("role")
    if user_role != "super_admin":
        raise HTTPException(status_code=403, detail="Super admin access required")
    return user


@router.get("/super-admin/profile", response_model=SuperAdminProfile)
async def get_super_admin_profile(user: Dict[str, Any] = Depends(require_super_admin)):
    uid = user.get("uid")
    profile_doc = db.collection("super_admins").document(uid).get()
    if profile_doc.exists:
        d = profile_doc.to_dict() or {}
        return SuperAdminProfile(
            uid=uid,
            name=d.get("name") or user.get("name") or "Super Admin",
            email=d.get("email") or user.get("email"),
            photo_url=d.get("photo_url"),
        )

    # Fallback: create minimal profile
    now = time.time()
    db.collection("super_admins").document(uid).set(
        {
            "uid": uid,
            "name": user.get("name") or "Super Admin",
            "email": user.get("email"),
            "photo_url": None,
            "created_at": now,
            "updated_at": now,
        },
        merge=True,
    )
    return SuperAdminProfile(uid=uid, name=user.get("name") or "Super Admin", email=user.get("email"), photo_url=None)


@router.patch("/super-admin/profile")
async def update_super_admin_profile(
    payload: SuperAdminProfileUpdate,
    user: Dict[str, Any] = Depends(require_super_admin),
):
    uid = user.get("uid")
    now = time.time()

    updates_user: dict = {"updated_at": now}
    updates_profile: dict = {"updated_at": now}

    if payload.name is not None:
        updates_user["name"] = payload.name
        updates_profile["name"] = payload.name

    if payload.photo_url is not None:
        updates_profile["photo_url"] = payload.photo_url

    # Email/password live in Firebase Auth; update via Admin SDK
    if payload.email is not None:
        firebase_auth.update_user(uid, email=str(payload.email).strip().lower())
        updates_user["email"] = str(payload.email).strip().lower()
        updates_profile["email"] = str(payload.email).strip().lower()

    if payload.new_password is not None:
        firebase_auth.update_user(uid, password=payload.new_password)

    if len(updates_user) > 1:
        db.collection("users").document(uid).set(updates_user, merge=True)

    db.collection("super_admins").document(uid).set(updates_profile, merge=True)

    log_action(uid, "SUPER_ADMIN_PROFILE_UPDATE", "Super admin profile updated")
    return {"ok": True}


@router.get("/admin-requests")
async def list_admin_requests(
    status: str = "pending",
    user: Dict[str, Any] = Depends(require_super_admin),
):
    """List admin requests (super admin only)."""
    q = db.collection("admin_requests")
    if status:
        q = q.where("status", "==", status)
    # Sort newest first when the field exists
    try:
        q = q.order_by("created_at", direction=firestore.Query.DESCENDING)
    except Exception:
        pass

    rows: list[dict] = []
    for doc_snap in q.stream():
        d = doc_snap.to_dict() or {}
        d["id"] = doc_snap.id
        rows.append(d)

    return {"ok": True, "requests": rows}


@router.post("/admin-requests/{request_id}/approve")
async def approve_admin_request(
    request_id: str,
    user: Dict[str, Any] = Depends(require_super_admin),
):
    """Approve an admin request (super admin only)."""
    approver_uid = user.get("uid")
    now = time.time()

    req_ref = db.collection("admin_requests").document(request_id)
    req_doc = req_ref.get()
    if not req_doc.exists:
        raise HTTPException(status_code=404, detail="Admin request not found")

    req_data = req_doc.to_dict() or {}
    target_uid = req_data.get("uid") or request_id

    req_ref.set(
        {
            "status": "approved",
            "approved_by": approver_uid,
            "approved_at": now,
            "updated_at": now,
        },
        merge=True,
    )

    db.collection("users").document(target_uid).set(
        {
            "role": "admin",
            "admin_approved": True,
            "admin_approved_at": now,
            "updated_at": now,
        },
        merge=True,
    )

    # Optional: set a custom claim for rules that use request.auth.token.role
    try:
        firebase_auth.set_custom_user_claims(target_uid, {"role": "admin", "admin_approved": True})
    except Exception:
        pass

    log_action(approver_uid, "ADMIN_APPROVED", f"Approved admin request for {target_uid}")
    return {"ok": True, "uid": target_uid}


@router.post("/admin-requests/{request_id}/reject")
async def reject_admin_request(
    request_id: str,
    user: Dict[str, Any] = Depends(require_super_admin),
):
    """Reject an admin request (super admin only)."""
    approver_uid = user.get("uid")
    now = time.time()

    req_ref = db.collection("admin_requests").document(request_id)
    req_doc = req_ref.get()
    if not req_doc.exists:
        raise HTTPException(status_code=404, detail="Admin request not found")

    req_data = req_doc.to_dict() or {}
    target_uid = req_data.get("uid") or request_id

    req_ref.set(
        {
            "status": "rejected",
            "rejected_by": approver_uid,
            "rejected_at": now,
            "updated_at": now,
        },
        merge=True,
    )

    log_action(approver_uid, "ADMIN_REJECTED", f"Rejected admin request for {target_uid}")
    return {"ok": True, "uid": target_uid}


# ============================================================================
# Authentication Endpoints
# ============================================================================

@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user: UserSignup,
    x_admin_bootstrap_token: Optional[str] = Header(None, alias="X-Admin-Bootstrap-Token"),
):
    """
    Creates a user in Firebase Auth with proper Firestore schema.
    Stores role and all user information for RBAC.
    """
    try:
        # Prevent public creation of privileged roles.
        # Admin/SuperAdmin accounts must be provisioned out-of-band or via a controlled bootstrap token.
        if user.role in [Role.ADMIN, Role.SUPER_ADMIN]:
            if not settings.ADMIN_BOOTSTRAP_TOKEN or x_admin_bootstrap_token != settings.ADMIN_BOOTSTRAP_TOKEN:
                raise HTTPException(
                    status_code=403,
                    detail="Privileged roles cannot be created via public signup"
                )

        # 1. Create user in Firebase Authentication
        user_record = firebase_auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name,
            phone_number=user.phone if user.phone else None
        )
        
        # 2. Prepare comprehensive Firestore user data
        user_data = {
            "uid": user_record.uid,
            "email": user.email,
            "name": user.name,
            "phone": user.phone or None,
            "role": user.role.value,  # Store role as string
            "company_name": user.company_name or None,
            "is_verified": True,  # Auto-verify users on signup to allow onboarding
            "email_verified": False,
            "phone_verified": False,
            "mfa_enabled": False,
            "failed_login_attempts": 0,
            "is_active": True,
            "is_locked": False,
            # Onboarding fields
            "onboarding_completed": False,
            "onboarding_step": "WELCOME",
            "onboarding_score": 0,
            "onboarding_data": None,
            # Business info
            "dot_number": None,
            "mc_number": None,
            "first_name": None,
            "last_name": None,
            # Preferences
            "language": "en",
            "timezone": "UTC",
            "notification_preferences": {},
            # Timestamps
            "created_at": time.time(),
            "updated_at": time.time(),
            "last_login_at": None
        }

        # 3. Save to Firestore with proper schema
        db.collection("users").document(user_record.uid).set(user_data)
        
        # 4. Create role-specific profile records
        if user.role.value == "carrier":
            # Create carrier profile for marketplace visibility
            carrier_profile = {
                "id": user_record.uid,
                "carrier_id": user_record.uid,
                "name": user.company_name or user.name,
                "email": user.email,
                "phone": user.phone or None,
                "mc_number": None,
                "dot_number": None,
                "equipment_types": [],
                "service_areas": [],
                "rating": 0,
                "total_loads": 0,
                "status": "active",
                "created_at": time.time(),
                "updated_at": time.time()
            }
            db.collection("carriers").document(user_record.uid).set(carrier_profile)
            log_action(user_record.uid, "CARRIER_PROFILE_CREATED", "Carrier profile created in marketplace")
        
        elif user.role.value == "driver":
            # Create driver profile for carrier marketplace
            driver_profile = {
                "id": user_record.uid,
                "driver_id": user_record.uid,
                "name": user.name,
                "email": user.email,
                "phone": user.phone or None,
                "cdl_class": None,
                "cdl_number": None,
                "status": "available",
                "current_location": None,
                "rating": 0,
                "total_deliveries": 0,
                "created_at": time.time(),
                "updated_at": time.time()
            }
            db.collection("drivers").document(user_record.uid).set(driver_profile)
            log_action(user_record.uid, "DRIVER_PROFILE_CREATED", "Driver profile created in marketplace")

        # 5. Audit log
        log_action(user_record.uid, "SIGNUP", f"User signed up as {user.role.value}")

        return SignupResponse(
            user_id=user_record.uid,
            email=user.email,
            phone=user.phone,
            role=user.role.value,
            requires_email_verification=False,  # Auto-verified for onboarding
            requires_phone_verification=False,
            message="Account created successfully! You can now complete your onboarding."
        )

    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email already registered")
    except firebase_auth.PhoneNumberAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    except firebase_admin.exceptions.FirebaseError as e:
        # Handle Firebase Admin SDK errors properly
        error_msg = str(e) if hasattr(e, '__str__') else "Firebase authentication error"
        raise HTTPException(status_code=500, detail=f"Signup failed: {error_msg}")
    except Exception as e:
        # Generic error handler
        error_msg = str(e) if str(e) else "Unknown error occurred"
        raise HTTPException(status_code=500, detail=f"Signup failed: {error_msg}")


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """
    Authenticate user with email and password.
    Returns access token with user profile.
    """
    try:
        # Verify password via Firebase Identity Toolkit
        auth_res = await _firebase_verify_password(request.email.strip(), request.password)
        uid = auth_res.get("localId")
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        user_doc = db.collection("users").document(uid).get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User profile not found")

        user_data = user_doc.to_dict()
        
        # Check if user is locked
        if user_data.get("is_locked"):
            raise HTTPException(status_code=403, detail="Account is locked. Contact support.")
        
        try:
            # Create a custom token for the frontend to exchange.
            custom_token = firebase_auth.create_custom_token(uid)
            
            # Update last login
            db.collection("users").document(uid).update({
                "last_login_at": time.time(),
                "failed_login_attempts": 0
            })
            
            log_action(uid, "LOGIN", "User logged in")
            
            return TokenResponse(
                access_token=custom_token.decode('utf-8') if isinstance(custom_token, bytes) else custom_token,
                refresh_token="",  # Firebase handles refresh automatically
                token_type="bearer",
                expires_in=3600,
                user={
                    "uid": uid,
                    "email": user_data["email"],
                    "name": user_data["name"],
                    "role": user_data.get("role", "carrier"),
                    "onboarding_completed": user_data.get("onboarding_completed", False),
                    "onboarding_step": user_data.get("onboarding_step", "WELCOME"),
                }
            )
        except Exception as e:
            # Increment failed attempts
            failed_attempts = user_data.get("failed_login_attempts", 0) + 1
            if failed_attempts >= 5:
                db.collection("users").document(user_data["uid"]).update({
                    "is_locked": True,
                    "failed_login_attempts": failed_attempts
                })
                raise HTTPException(status_code=403, detail="Too many login attempts. Account locked.")
            
            db.collection("users").document(user_data["uid"]).update({
                "failed_login_attempts": failed_attempts
            })
            raise HTTPException(status_code=401, detail="Invalid email or password")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")


@router.post("/verify-otp")
async def verify_otp(authorization: str = Header(...)):
    """
    Called when frontend successfully verifies SMS code.
    Marks user as verified.
    """
    try:
        token = authorization.split(" ")[1]
        decoded = firebase_auth.verify_id_token(token)
        uid = decoded.get('uid')
        
        db.collection("users").document(uid).update({
            "is_verified": True,
            "phone_verified": True,
            "verified_at": time.time()
        })
        
        log_action(uid, "VERIFICATION", "User verified via OTP")
        return {"status": "success", "message": "Account verified"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token or verification failed")


@router.post("/mfa-toggle")
async def toggle_mfa(
    enable: bool = Body(..., embed=True), 
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Toggle MFA for current user."""
    uid = user['uid']
    db.collection("users").document(uid).update({"mfa_enabled": enable})
    
    action = "ENABLED" if enable else "DISABLED"
    log_action(uid, "MFA_CHANGE", f"MFA was {action}")
    return {"mfa_enabled": enable}


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user profile."""
    # Ensure all required fields exist with defaults
    profile_data = {
        "uid": user.get("uid", ""),
        "email": user.get("email", ""),
        "name": user.get("name") or user.get("full_name") or user.get("email", "").split("@")[0],
        "phone": user.get("phone"),
        "role": Role(user.get("role", "carrier")),
        "company_name": user.get("company_name"),
        "dot_number": user.get("dot_number"),
        "mc_number": user.get("mc_number"),
        "is_verified": user.get("is_verified", False),
        "mfa_enabled": user.get("mfa_enabled", False),
        "onboarding_completed": user.get("onboarding_completed", False),
        "onboarding_step": user.get("onboarding_step", "WELCOME"),
        "onboarding_score": user.get("onboarding_score", 0),
        "created_at": user.get("created_at"),
        "profile_picture_url": user.get("profile_picture_url"),
        "address": user.get("address"),
        "emergency_contact_name": user.get("emergency_contact_name"),
        "emergency_contact_relationship": user.get("emergency_contact_relationship"),
        "emergency_contact_phone": user.get("emergency_contact_phone"),
    }
    return UserProfile(**profile_data)


@router.post("/profile/update")
async def update_profile(
    update: ProfileUpdate,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Update user profile information."""
    uid = user['uid']
    user_ref = db.collection("users").document(uid)
    before = (user_ref.get().to_dict() or {})
    update_data = update.dict(exclude_unset=True)
    
    if update_data:
        # Normalize DOT/MC inputs
        if "dot_number" in update_data:
            update_data["dot_number"] = _normalize_identifier(update_data.get("dot_number"))
        if "mc_number" in update_data:
            update_data["mc_number"] = _normalize_identifier(update_data.get("mc_number"))

        fmcsa_summary: Dict[str, Any] | None = None
        # FMCSA verification gate for carriers when DOT/MC is being set/changed.
        if (user.get("role") == "carrier") and ("dot_number" in update_data or "mc_number" in update_data):
            dot_number = update_data.get("dot_number") or before.get("dot_number")
            mc_number = update_data.get("mc_number") or before.get("mc_number")
            dot_number = _normalize_identifier(dot_number)
            mc_number = _normalize_identifier(mc_number)
            if not dot_number and not mc_number:
                raise HTTPException(status_code=400, detail="Provide at least a DOT or MC number")
            try:
                client = FmcsaClient()
                verification = client.verify(usdot=dot_number, mc_number=mc_number)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc))
            except Exception as exc:
                raise HTTPException(status_code=502, detail=f"FMCSA verification failed: {str(exc)}")

            if verification.get("result") == "Blocked":
                raise HTTPException(status_code=403, detail="FMCSA verification blocked this carrier")

            fmcsa_summary = _summarize_fmcsa_verification(verification)
            update_data["fmcsa_verification"] = fmcsa_summary
            update_data["fmcsa_verified"] = verification.get("result") == "Verified"
            update_data["fmcsa_last_checked_at"] = time.time()
            if verification.get("usdot"):
                update_data["dot_number"] = _normalize_identifier(verification.get("usdot"))
            if verification.get("mc_number"):
                update_data.setdefault("mc_number", _normalize_identifier(verification.get("mc_number")))

        update_data['updated_at'] = time.time()
        user_ref.update(update_data)

        changed: Dict[str, Any] = {}
        for k, after_v in update_data.items():
            if k == "updated_at":
                continue
            before_v = before.get(k)
            if before_v != after_v:
                changed[k] = {"before": before_v, "after": after_v}
        if changed:
            record_profile_update(
                user_id=uid,
                changes=changed,
                source="auth.profile.update",
                actor_id=uid,
                actor_role=user.get("role"),
                fmcsa_verification=fmcsa_summary,
            )

        log_action(uid, "PROFILE_UPDATE", f"Updated fields: {list(update_data.keys())}")
    
    return {"status": "success", "message": "Profile updated"}


    @router.get("/profile/updates")
    async def list_profile_updates(user: Dict[str, Any] = Depends(get_current_user)):
        """Return recent profile update history for the current user."""
        uid = user.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="Unauthorized")

        try:
            snaps = (
                db.collection("users")
                .document(uid)
                .collection("profile_updates")
                .order_by("timestamp", direction=firestore.Query.DESCENDING)
                .limit(50)
                .stream()
            )
            items = []
            for s in snaps:
                d = s.to_dict() or {}
                d["id"] = s.id
                items.append(d)
            return {"items": items}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to load profile updates: {str(e)}")


@router.post("/profile/picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Upload profile picture and update user profile."""
    from .database import bucket
    
    uid = user['uid']
    
    # Validate file type (images only)
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_ext = file.filename.lower().split('.')[-1]
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (max 5MB)
    file_data = await file.read()
    if len(file_data) > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(status_code=400, detail="File size must be less than 5MB")
    
    try:
        # Upload to Firebase Storage
        picture_id = str(uuid.uuid4())
        storage_path = f"profile_pictures/{uid}/{picture_id}.{file_ext}"
        blob = bucket.blob(storage_path)
        
        # Determine content type
        content_type = f"image/{file_ext}" if file_ext != 'jpg' else "image/jpeg"
        
        blob.upload_from_string(file_data, content_type=content_type)
        blob.make_public()
        download_url = blob.public_url
        
        # Update user profile with picture URL
        db.collection("users").document(uid).update({
            "profile_picture_url": download_url,
            "updated_at": time.time()
        })
        
        log_action(uid, "PROFILE_PICTURE_UPLOAD", f"Profile picture uploaded: {storage_path}")
        
        return {
            "status": "success",
            "message": "Profile picture uploaded successfully",
            "profile_picture_url": download_url
        }
    except Exception as e:
        print(f"Error uploading profile picture: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload profile picture: {str(e)}"
        )


@router.post("/log-login")
async def log_login(authorization: str = Header(...)):
    """Log user login activity."""
    try:
        if not authorization.startswith("Bearer "):
            return {"status": "ignored", "reason": "invalid_header"}

        token = authorization.split(" ")[1]
        decoded = firebase_auth.verify_id_token(token)
        uid = decoded.get('uid')
        log_action(uid, "LOGIN", "User logged in via Firebase")
        return {"status": "logged"}
    except Exception as e:
        print(f"Login Log Error: {e}")
        return {"status": "error", "reason": str(e)}
        return {"status": "error", "detail": str(e)}