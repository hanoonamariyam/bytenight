import os
from pathlib import Path
from typing import List

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
UPLOADS_DIR = BASE_DIR / "uploads"
PROCESSED_DIR = BASE_DIR / "processed"

# Ensure runtime directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
(UPLOADS_DIR / "videos").mkdir(parents=True, exist_ok=True)
(UPLOADS_DIR / "academic").mkdir(parents=True, exist_ok=True)
(UPLOADS_DIR / "attendance").mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "ByteNight Early Support System"
    API_V1_STR: str = "/api/v1"
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bytenight-hackathon-insecure-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database: Default to SQLite for immediate hackathon reliability, easily swappable to PostgreSQL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{DATA_DIR / 'bytenight.db'}"
    )
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Model Artifact Paths
    MODEL_PATH: Path = MODELS_DIR / "student_support_model.pkl"
    FEATURES_PATH: Path = MODELS_DIR / "student_support_features.pkl"
    
    # Vision Settings
    MAX_VIDEO_SIZE_MB: int = 150
    FRAME_SAMPLE_INTERVAL: int = 5  # Process 1 out of every 5 frames for efficiency
    MIN_FACE_CONFIDENCE: float = 0.5
    MIN_POSE_CONFIDENCE: float = 0.5

settings = Settings()
