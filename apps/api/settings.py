from pydantic_settings import BaseSettings
from pydantic import Field
import os
from pathlib import Path
import dotenv

# Always load apps/.env (relative to this file), regardless of where the process is started.
_APPS_DIR = Path(__file__).resolve().parents[1]
dotenv.load_dotenv(dotenv_path=_APPS_DIR / ".env", override=False)


class Settings(BaseSettings):
    GROQ_API_KEY: str = Field(default=os.getenv("GROQ_API_KEY", ""))
    GROQ_TEXT_MODEL: str = Field(default=os.getenv("GROQ_TEXT_MODEL", "llama-3.3-70b-versatile"))
    GROQ_VISION_MODEL: str = Field(default=os.getenv("GROQ_VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct"))

    DATA_DIR: str = Field(default=os.getenv("DATA_DIR", "./data"))
    APP_HOST: str = Field(default=os.getenv("APP_HOST", "0.0.0.0"))
    APP_PORT: int = Field(default=int(os.getenv("APP_PORT", "8000")))
    API_BASE_URL: str = Field(default=os.getenv("API_BASE_URL", "http://localhost:8000"))
    FRONTEND_BASE_URL: str = Field(default=os.getenv("FRONTEND_BASE_URL", "http://localhost:5173"))
    FMCSA_BASE_URL: str = Field(default=os.getenv("FMCSA_BASE_URL", "https://mobile.fmcsa.dot.gov/qc/services"))
    FMCSA_API_KEY: str = Field(default=os.getenv("FMCSA_API_KEY", ""))
    FMCSA_WEB_KEY: str = Field(default=os.getenv("FMCSA_WEB_KEY", ""))
    ALERT_WEBHOOK_URL: str = Field(default=os.getenv("ALERT_WEBHOOK_URL", ""))
    
    # Email settings
    SMTP_SERVER: str = Field(default=os.getenv("SMTP_SERVER", "smtp.gmail.com"))
    SMTP_PORT: int = Field(default=int(os.getenv("SMTP_PORT", "587")))
    SMTP_USERNAME: str = Field(default=os.getenv("SMTP_USERNAME", ""))
    # Gmail app passwords are often copied with spaces; SMTP login expects the raw token.
    SMTP_PASSWORD: str = Field(default=os.getenv("SMTP_PASSWORD", "").strip().replace(" ", ""))
    EMAIL_FROM: str = Field(default=os.getenv("EMAIL_FROM", "noreply@freightpower.ai"))
    ADMIN_EMAIL: str = Field(default=os.getenv("ADMIN_EMAIL", "freightpowerai@gmail.com"))  # Email for fraud reports and edit suggestions

    # Messaging notifications
    # If true, backend will send SMTP emails to thread recipients on new messages.
    ENABLE_MESSAGE_EMAIL_NOTIFICATIONS: bool = Field(
        default=(os.getenv("ENABLE_MESSAGE_EMAIL_NOTIFICATIONS", "false").strip().lower() == "true")
    )

    # Delay (seconds) before sending a message email notification.
    # Email is only sent if the message remains unread at send time.
    MESSAGE_EMAIL_DELAY_SECONDS: int = Field(default=int(os.getenv("MESSAGE_EMAIL_DELAY_SECONDS", "300")))

    # Comma-separated allowlist of super admin emails.
    # Only allowlisted emails can be provisioned/access super-admin endpoints.
    SUPER_ADMIN_EMAILS: str = Field(
        default=os.getenv("SUPER_ADMIN_EMAILS", "freightpowerai@gmail.com,abdulwadudkhattak@gmail.com")
    )

    # Privileged account provisioning
    # If set, creating users with role=admin/super_admin via /auth/signup requires header: X-Admin-Bootstrap-Token
    ADMIN_BOOTSTRAP_TOKEN: str = Field(default=os.getenv("ADMIN_BOOTSTRAP_TOKEN", ""))

    # Firebase Identity Toolkit (email/password verification)
    # Public API key; required for backend-driven password login.
    FIREBASE_WEB_API_KEY: str = Field(default=os.getenv("FIREBASE_WEB_API_KEY", "AIzaSyClzYECMNer89EjBs_h12hb5tDIghUslMM"))
    
    # HERE Maps API settings
    HERE_API_KEY_BACKEND: str = Field(default=os.getenv("HERE_API_KEY_BACKEND", "FMFVzQgeOW8PvMnWkWHj"))
    HERE_API_KEY_FRONTEND: str = Field(default=os.getenv("HERE_API_KEY_FRONTEND", "kjjMfJtDGJMWfi63U4RO"))
    
    # Geoapify Places API settings (for development)
    GEOAPIFY_API_KEY: str = Field(default=os.getenv("GEOAPIFY_API_KEY", ""))

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields like VITE_API_URL


settings = Settings()
