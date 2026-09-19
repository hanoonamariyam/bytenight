import logging
from typing import Optional, List, Any
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
        """Attempt to load the trained model and its feature schema."""
        model_path = settings.MODEL_PATH
        features_path = settings.FEATURES_PATH

        if not model_path.exists() or not features_path.exists():
            missing = []
            if not model_path.exists():
                missing.append(str(model_path))
            if not features_path.exists():
                missing.append(str(features_path))
            self.is_loaded = False
            self.model = None
            self.feature_names = None
            self.load_status = "ARTIFACTS_MISSING"
            self.load_error = f"Required model artifacts not found: {', '.join(missing)}. Fallback prediction engine active."
            logger.warning(self.load_error)
            return False

        try:
            logger.info(f"Loading trained student-support model from {model_path}...")
            self.model = joblib.load(model_path)
            
            logger.info(f"Loading feature schema from {features_path}...")
            self.feature_names = joblib.load(features_path)
            if not isinstance(self.feature_names, list) or not self.feature_names:
                raise ValueError("Feature artifact must contain a non-empty list")
            if not hasattr(self.model, "predict_proba"):
                raise ValueError("Model artifact does not expose predict_proba")
            classes = list(getattr(self.model, "classes_", []))
            if classes != [0, 1, 2]:
                raise ValueError(f"Model classes must be [0, 1, 2], found {classes}")

            self.is_loaded = True
            self.load_status = "LOADED"
            self.load_error = None
            logger.info("Trained model successfully loaded into memory.")
            return True
        except Exception as e:
            self.is_loaded = False
            self.model = None
            self.feature_names = None
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
