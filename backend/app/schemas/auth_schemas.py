from pydantic import BaseModel, EmailStr
from typing import List, Optional

class LoginRequest(BaseModel):
    email: str
    password: str

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
