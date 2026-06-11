import base64
import hashlib
import hmac
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import UserRegister


SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-development-secret")
TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _base64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000,
    ).hex()
    return f"{salt}${password_hash}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, expected_hash = stored_hash.split("$", 1)
    except ValueError:
        return False

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000,
    ).hex()
    return hmac.compare_digest(password_hash, expected_hash)


def create_access_token(user_id: int) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(user_id),
        "exp": int((datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)).timestamp()),
    }

    signing_input = ".".join([
        _base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8")),
        _base64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8")),
    ])
    signature = hmac.new(
        SECRET_KEY.encode("utf-8"),
        signing_input.encode("ascii"),
        hashlib.sha256,
    ).digest()
    return f"{signing_input}.{_base64url_encode(signature)}"


def decode_access_token(token: str) -> Optional[int]:
    try:
        header_part, payload_part, signature_part = token.split(".")
        signing_input = f"{header_part}.{payload_part}"
        expected_signature = hmac.new(
            SECRET_KEY.encode("utf-8"),
            signing_input.encode("ascii"),
            hashlib.sha256,
        ).digest()
        actual_signature = _base64url_decode(signature_part)

        if not hmac.compare_digest(actual_signature, expected_signature):
            return None

        payload = json.loads(_base64url_decode(payload_part))
        if int(payload.get("exp", 0)) < int(datetime.now(timezone.utc).timestamp()):
            return None

        return int(payload["sub"])
    except Exception:
        return None


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_data: UserRegister) -> User:
    user = User(
        name=user_data.name.strip(),
        email=user_data.email.lower(),
        password_hash=hash_password(user_data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
