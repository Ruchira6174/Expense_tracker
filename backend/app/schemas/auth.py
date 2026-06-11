import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
