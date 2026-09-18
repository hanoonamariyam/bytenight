import os
import logging
from pathlib import Path
from typing import Optional, List, Any, Tuple
import joblib

from ..config import settings

logger = logging.getLogger("bytenight.ml.model_loader")

class ModelLoader:
    _instance: Optional["ModelLoader"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.model: Optional[Any] = None
        self.feature_names: Optional[List[str]] = None
        self.is_loaded: bool = False
        self.load_status: str = "NOT_INITIALIZED"
        self.load_error: Optional[str] = None
        
        self.reload()
        self._initialized = True

    def reload(self) -> bool:
        """Attempt to load student_support_xgb_model.pkl and student_support_features.pkl."""
        model_path = settings.MODEL_PATH
        features_path = settings.FEATURES_PATH

        if not model_path.exists():
            self.is_loaded = False
            self.load_status = "FILE_NOT_FOUND"
            self.load_error = f"Expected model file not found at {model_path}. Fallback prediction engine active."
            logger.warning(self.load_error)
            return False

        try:
            logger.info(f"Loading trained XGBoost model from {model_path}...")
            self.model = joblib.load(model_path)
            
            if features_path.exists():
                logger.info(f"Loading feature schema from {features_path}...")
                self.feature_names = joblib.load(features_path)
            else:
                # Try reading feature names directly from model if available
                if hasattr(self.model, "feature_names_in_"):
                    self.feature_names = list(self.model.feature_names_in_)
                else:
                    self.feature_names = None
                    logger.warning(f"Features file not found at {features_path}; feature order unverified.")

            self.is_loaded = True
            self.load_status = "LOADED"
            self.load_error = None
            logger.info("Trained model successfully loaded into memory.")
            return True
        except Exception as e:
            self.is_loaded = False
            self.load_status = "LOAD_ERROR"
            self.load_error = f"Failed to deserialize model: {str(e)}"
            logger.error(self.load_error)
            return False

    def get_info(self) -> dict:
        return {
            "is_loaded": self.is_loaded,
            "load_status": self.load_status,
            "model_path": str(settings.MODEL_PATH),
            "features_path": str(settings.FEATURES_PATH),
            "feature_count": len(self.feature_names) if self.feature_names else 0,
            "feature_names": self.feature_names,
            "load_error": self.load_error
        }

model_loader = ModelLoader()
