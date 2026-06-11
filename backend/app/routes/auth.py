from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import AuthResponse, UserLogin, UserRegister, UserResponse
from app.services import auth_service


auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@auth_router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = auth_service.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    user = auth_service.create_user(db, user_data)
    return {
        "access_token": auth_service.create_access_token(user.id),
        "token_type": "bearer",
        "user": user,
    }


@auth_router.post("/login", response_model=AuthResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.get_user_by_email(db, credentials.email)
    if not user or not auth_service.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return {
        "access_token": auth_service.create_access_token(user.id),
        "token_type": "bearer",
        "user": user,
    }


@auth_router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
