from typing import Dict, Any, Tuple
import numpy as np
from .model_loader import model_loader

# Status risk thresholds
THRESHOLD_GREEN_MAX = 0.45
THRESHOLD_YELLOW_MAX = 0.70

def predict_student_risk(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes prediction on engineered feature dictionary.
    Uses the loaded tree model if available; otherwise applies deterministic multi-signal baseline.
    """
    academic_mean = features.get("academic_score_mean", 75.0)
    academic_delta = features.get("academic_score_delta", 0.0)
    attendance_ratio = features.get("attendance_ratio", 0.85)
    on_time_rate = features.get("on_time_submission_rate", 80.0)
    
    has_missing_academic = features.get("has_missing_academic", 0)
    has_missing_attendance = features.get("has_missing_attendance", 0)
    has_missing_vision = features.get("has_missing_vision", 1)

    # 1. Determine Performance Trend
    if academic_delta >= 5.0:
        trend = "IMPROVING"
    elif academic_delta <= -5.0:
        trend = "DECLINING"
    else:
        trend = "STABLE"

    # 2. Model Prediction Execution
    if model_loader.is_loaded and model_loader.model is not None:
        try:
            feature_names = model_loader.feature_names
            if feature_names:
                # Align features to model's exact schema
                vector = [features.get(f, 0.0) for f in feature_names]
            else:
                vector = list(features.values())
            
            X = np.array([vector])
            model = model_loader.model
            
            if hasattr(model, "predict_proba"):
                probas = model.predict_proba(X)[0]
                if len(probas) == 3:
                    # 0: GREEN, 1: YELLOW, 2: RED
                    risk_score = float(probas[2] * 1.0 + probas[1] * 0.5)
                    pred_class = int(np.argmax(probas))
                    status_map = {0: "GREEN", 1: "YELLOW", 2: "RED"}
                    predicted_status = status_map.get(pred_class, "GREEN")
                elif len(probas) == 2:
                    # Binary: 0: Pass/Stable, 1: At-Risk
                    risk_score = float(probas[1])
                    predicted_status = "RED" if risk_score > THRESHOLD_YELLOW_MAX else "YELLOW" if risk_score > THRESHOLD_GREEN_MAX else "GREEN"
                else:
                    risk_score = float(probas[0])
                    predicted_status = "GREEN"
                confidence = float(np.max(probas))
            else:
                raw_pred = model.predict(X)[0]
                status_map = {0: "GREEN", 1: "YELLOW", 2: "RED"}
                predicted_status = status_map.get(int(raw_pred), "GREEN")
                risk_score = 0.85 if predicted_status == "RED" else 0.55 if predicted_status == "YELLOW" else 0.15
                confidence = 0.88

            model_version = "lightgbm_student_support_trained"
            return {
                "predicted_status": predicted_status,
                "risk_score": round(min(1.0, max(0.0, risk_score)), 3),
                "confidence": round(confidence, 2),
                "trend": trend,
                "model_version": model_version,
                "feature_snapshot": features
            }
        except Exception as e:
            # Safe degraded mode: fallback to transparent formula if prediction fails
            pass

    # 3. Transparent Heuristic Risk Engine (Safety Baseline)
    # Multi-signal evaluation: academic, attendance, and LMS engagement
    academic_risk = max(0.0, min(1.0, (92.0 - academic_mean) / 40.0))
    failed_count = features.get("failed_assessments_count", 0)
    if failed_count > 0:
        academic_risk = min(1.0, academic_risk + 0.10 * failed_count)
    if academic_delta <= -15.0:
        academic_risk = min(1.0, academic_risk + 0.12)

    attendance_risk = max(0.0, min(1.0, (0.95 - attendance_ratio) / 0.35))
    consecutive_absent = features.get("consecutive_absent_streak", 0)
    if consecutive_absent >= 2:
        attendance_risk = min(1.0, attendance_risk + 0.12)

    engagement_risk = max(0.0, min(1.0, (95.0 - on_time_rate) / 45.0))

    # Weight balancing based on sensor availability
    if has_missing_attendance == 1:
        # Attendance missing: shift weights safely to academic (75%) and LMS (25%) without penalizing
        w_academic = 0.75
        w_attendance = 0.0
        w_engagement = 0.25
        confidence = 0.75
    elif has_missing_academic == 1:
        # Academic missing: evaluate on attendance and engagement with lower confidence
        w_academic = 0.0
        w_attendance = 0.70
        w_engagement = 0.30
        confidence = 0.70
    else:
        # Standard multimodal weights
        w_academic = 0.50
        w_attendance = 0.35
        w_engagement = 0.15
        confidence = 0.90

    # Camera failure guarantee: vision absence never increases risk
    raw_risk = (w_academic * academic_risk) + (w_attendance * attendance_risk) + (w_engagement * engagement_risk)

    # Classify Green / Yellow / Red
    THRESHOLD_GREEN_MAX = 0.40
    THRESHOLD_YELLOW_MAX = 0.68

    if raw_risk >= THRESHOLD_YELLOW_MAX:
        predicted_status = "RED"
    elif raw_risk >= THRESHOLD_GREEN_MAX:
        predicted_status = "YELLOW"
    else:
        predicted_status = "GREEN"

    return {
        "predicted_status": predicted_status,
        "risk_score": round(min(1.0, max(0.0, raw_risk)), 3),
        "confidence": confidence,
        "trend": trend,
        "model_version": "baseline_multimodal_heuristic_v1",
        "feature_snapshot": features
    }
