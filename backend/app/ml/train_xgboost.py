"""Train the student-support LightGBM model from the existing SQLite records.

This module never creates synthetic records. Labels are the existing student
support statuses, and features are produced by the shared feature engineer.
"""

from __future__ import annotations

import argparse
import json
import logging
from typing import Any, Dict, List

import joblib
import numpy as np

from ..config import settings
from ..database import SessionLocal, init_db
from ..models.db_models import AcademicRecord, AttendanceRecord, EngagementRecord, Student
from .feature_engineering import engineer_features_for_student

logger = logging.getLogger("bytenight.ml.train_lightgbm")

FEATURE_NAMES = [
    "academic_score_mean",
    "academic_score_delta",
    "academic_min_score",
    "academic_max_score",
    "failed_assessments_count",
    "attendance_ratio",
    "consecutive_absent_streak",
    "lms_logins_weekly",
    "on_time_submission_rate",
    "vision_pose_alertness_index",
    "has_missing_academic",
    "has_missing_attendance",
    "has_missing_engagement",
    "has_missing_vision",
]
STATUS_TO_CLASS = {"GREEN": 0, "YELLOW": 1, "RED": 2}
CLASS_TO_STATUS = {value: key for key, value in STATUS_TO_CLASS.items()}


def build_training_data(db) -> tuple[np.ndarray, np.ndarray]:
    students = db.query(Student).order_by(Student.id.asc()).all()
    rows: List[List[float]] = []
    labels: List[int] = []

    for student in students:
        label = STATUS_TO_CLASS.get((student.current_status or "").upper())
        if label is None:
            continue
        academic_records = db.query(AcademicRecord).filter(
            AcademicRecord.student_id == student.id
        ).order_by(AcademicRecord.assessment_date.asc()).all()
        attendance_records = db.query(AttendanceRecord).filter(
            AttendanceRecord.student_id == student.id
        ).order_by(AttendanceRecord.date.desc()).all()
        engagement_record = db.query(EngagementRecord).filter(
            EngagementRecord.student_id == student.id
        ).order_by(EngagementRecord.record_date.desc()).first()
        features = engineer_features_for_student(
            student, academic_records, attendance_records, engagement_record
        )
        rows.append([float(features[name]) for name in FEATURE_NAMES])
        labels.append(label)

    if not rows:
        raise ValueError("No students with GREEN, YELLOW, or RED labels were found")
    if len(set(labels)) != 3:
        counts = {CLASS_TO_STATUS[label]: labels.count(label) for label in sorted(set(labels))}
        raise ValueError(f"Multiclass training requires all three labels; found {counts}")

    return np.asarray(rows, dtype=np.float32), np.asarray(labels, dtype=np.int64)


def train_lightgbm_model() -> Dict[str, Any]:
    try:
        from lightgbm import LGBMClassifier
    except ImportError as exc:
        raise RuntimeError(
            "LightGBM is required to train the model. Install backend requirements first."
        ) from exc
    try:
        from sklearn.model_selection import StratifiedKFold, cross_val_score
    except ImportError as exc:
        raise RuntimeError(
            "scikit-learn is required to validate the trained model. Install backend requirements first."
        ) from exc

    init_db()
    db = SessionLocal()
    try:
        X, y = build_training_data(db)
    finally:
        db.close()

    class_counts = np.bincount(y, minlength=3)
    if np.min(class_counts) < 2:
        raise ValueError(
            "Each support category needs at least two labeled students for validation; "
            f"counts={class_counts.tolist()}"
        )

    model = LGBMClassifier(
        objective="multiclass",
        num_class=3,
        n_estimators=80,
        max_depth=3,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        reg_lambda=1.0,
        random_state=42,
        verbosity=-1,
        n_jobs=1,
    )
    folds = min(3, int(np.min(class_counts)))
    validation = StratifiedKFold(n_splits=folds, shuffle=True, random_state=42)
    accuracy_scores = cross_val_score(model, X, y, cv=validation, scoring="accuracy")
    model.fit(X, y)

    settings.MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, settings.MODEL_PATH)
    joblib.dump(FEATURE_NAMES, settings.FEATURES_PATH)

    metrics = {
        "samples": int(len(y)),
        "class_counts": {
            CLASS_TO_STATUS[index]: int(count)
            for index, count in enumerate(class_counts)
        },
        "cv_folds": folds,
        "cv_accuracy_scores": [float(value) for value in accuracy_scores],
        "cv_accuracy_mean": float(np.mean(accuracy_scores)),
        "cv_accuracy_std": float(np.std(accuracy_scores)),
        "model_path": str(settings.MODEL_PATH),
        "features_path": str(settings.FEATURES_PATH),
    }
    logger.info("LightGBM training complete: %s", json.dumps(metrics, sort_keys=True))
    return metrics


def train_xgboost_model() -> Dict[str, Any]:
    """Backward-compatible entry point for existing scripts and integrations."""
    return train_lightgbm_model()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.parse_args()
    print(json.dumps(train_lightgbm_model(), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
