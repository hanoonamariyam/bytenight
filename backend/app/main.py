from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import settings
from .database import init_db, get_db, SessionLocal
from .models.db_models import User, Student
from .ml.model_loader import model_loader
from .seed_data import seed_database

# Import routers
from .api.auth import router as auth_router
from .api.dashboard import router as dashboard_router
from .api.students import router as students_router
from .api.predictions import router as predictions_router
from .api.alerts import router as alerts_router
from .api.uploads import router as uploads_router
from .api.vision import router as vision_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and demo seed data is present
    init_db()
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        student_count = db.query(Student).count()
        if user_count == 0 or student_count == 0:
            print("Database empty; executing initial seed...")
            seed_database()
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint (available at root, /api/health, and /api/v1/health)
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(Student.__table__.select().limit(1))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "database": db_status,
        "model_loader": model_loader.get_info(),
        "version": "1.0.0"
    }

# Master API router that groups all domain routers
api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(students_router)
api_router.include_router(predictions_router)
api_router.include_router(alerts_router)
api_router.include_router(uploads_router)
api_router.include_router(vision_router)

# Mount master router under BOTH /api and /api/v1 for complete frontend & spec compatibility
app.include_router(api_router, prefix="/api")
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Root"])
def root():
    return {
        "project": "ByteNight — Explainable Student Performance & Early Support System",
        "docs": "/docs",
        "health": "/api/health"
    }
