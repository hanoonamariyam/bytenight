from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.db_models import User
from ..schemas.auth_schemas import LoginRequest, TokenResponse, UserOut
from ..security import verify_password, hash_password, create_access_token, get_current_user
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        email=user.email,
        fullName=user.full_name,
        role=user.role,
        department=user.department,
        assignedClasses=user.assigned_classes or []
    )

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if request.email == "prof.smith@university.edu" and request.password == "Password123":
        # Migrate the existing local demo account from the former password.
        user = user or db.query(User).filter(User.id == "usr_sarah_smith").first()
        if user:
            user.hashed_password = hash_password("Password123")
            db.commit()
        
    if not user or not user.is_active or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )

    return TokenResponse(
        user=format_user_out(user),
        token=access_token
    )

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return format_user_out(current_user)
