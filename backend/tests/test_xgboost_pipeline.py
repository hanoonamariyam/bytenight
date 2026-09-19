import pytest

from app.config import settings
from app.database import SessionLocal
from app.ml import model_loader
from app.ml.feature_engineering import engineer_features_for_student
from app.ml.explanation import explain_prediction
from app.ml.predictor import predict_student_risk
from app.ml.train_xgboost import train_xgboost_model
from app.models.db_models import AcademicRecord, AttendanceRecord, EngagementRecord, Student


def test_xgboost_training_and_prediction_pipeline():
    pytest.importorskip("xgboost")
    pytest.importorskip("shap")
    pytest.importorskip("sklearn")

    metrics = train_xgboost_model()
    assert metrics["samples"] >= 3
    assert set(metrics["class_counts"]) == {"GREEN", "YELLOW", "RED"}
    assert settings.MODEL_PATH.exists()
    assert settings.FEATURES_PATH.exists()

    assert model_loader.reload() is True
    assert model_loader.is_loaded is True

    db = SessionLocal()
    try:
        student = db.query(Student).order_by(Student.id.asc()).first()
        academic_records = db.query(AcademicRecord).filter(
            AcademicRecord.student_id == student.id
        ).all()
        attendance_records = db.query(AttendanceRecord).filter(
            AttendanceRecord.student_id == student.id
        ).all()
        engagement_record = db.query(EngagementRecord).filter(
            EngagementRecord.student_id == student.id
        ).first()
        features = engineer_features_for_student(
            student, academic_records, attendance_records, engagement_record
        )
    finally:
        db.close()

    prediction = predict_student_risk(features)
    assert prediction["model_version"] == "xgboost_student_support_trained"
    assert prediction["predicted_status"] in {"GREEN", "YELLOW", "RED"}

    factors = explain_prediction(
        student.id,
        features,
        prediction["predicted_status"],
        prediction["risk_score"],
    )
    assert factors
    assert any(factor.featureKey == "academic_score_mean" for factor in factors)
