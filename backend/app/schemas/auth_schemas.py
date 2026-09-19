import re

from pydantic import BaseModel, field_validator
from typing import List, Optional

class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip()
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", value):
            raise ValueError("Enter a valid email address using letters and numbers.")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not re.fullmatch(r"[A-Za-z0-9]+", value):
            raise ValueError("Password can contain only letters and numbers.")
        return value

class UserOut(BaseModel):
    id: str
    email: str
    fullName: str
    role: str
    department: str
    assignedClasses: List[str]

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    user: UserOut
    token: str
