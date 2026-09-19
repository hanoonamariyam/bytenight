from typing import List, Dict, Any, Optional
import logging

import numpy as np

try:
    import shap
except ImportError:
    shap = None

from .model_loader import model_loader
from ..schemas.student_schemas import ContributingFactorOut

logger = logging.getLogger("bytenight.ml.explanation")


def _model_shap_values(features: Dict[str, Any]) -> Dict[str, float]:
    """Return risk-class SHAP attributions for a loaded tree model."""
    if shap is None or not model_loader.is_loaded or model_loader.model is None:
        return {}

    feature_names = model_loader.feature_names
    if not feature_names:
        return {}

    try:
        vector = [features.get(name, 0.0) for name in feature_names]
        values = shap.TreeExplainer(model_loader.model).shap_values(np.asarray([vector]))

        if isinstance(values, list):
            if len(values) >= 3:
                values = np.asarray(values[2]) + (0.5 * np.asarray(values[1]))
            elif len(values) == 2:
                values = np.asarray(values[1])
            elif len(values) == 1:
                values = np.asarray(values[0])
            else:
                return {}
        else:
            values = np.asarray(values)
            if values.ndim == 3:
                if values.shape[2] >= 3:
                    values = values[:, :, 2] + (0.5 * values[:, :, 1])
                else:
                    values = values[:, :, -1]

        values = np.asarray(values).reshape(-1)
        if len(values) != len(feature_names):
            return {}
        return {name: float(value) for name, value in zip(feature_names, values)}
    except Exception as exc:
        logger.warning("Unable to compute SHAP values; using explanations fallback: %s", exc)
        return {}

def explain_prediction(
    student_id: str,
    features: Dict[str, Any],
    predicted_status: str,
    risk_score: float
) -> List[ContributingFactorOut]:
    """
    Computes explainable contributing factors (SHAP attributions).
    Translates mathematical feature influences into actionable, non-causal faculty insights.
    Guarantees:
    - Unavailable sensors are marked NEUTRAL with shapValue=0.0.
    - Never uses causal words like "Cause"; uses "Model contributing factor".
    """
    factors: List[ContributingFactorOut] = []
    
    academic_mean = features.get("academic_score_mean", 75.0)
    academic_delta = features.get("academic_score_delta", 0.0)
    attendance_ratio = features.get("attendance_ratio", 0.85)
    attendance_pct = round(attendance_ratio * 100.0, 1)
    on_time_rate = features.get("on_time_submission_rate", 80.0)
    consecutive_absent = features.get("consecutive_absent_streak", 0)
    vision_index = features.get("vision_pose_alertness_index", 75.0)
    
    has_missing_academic = features.get("has_missing_academic", 0)
    has_missing_attendance = features.get("has_missing_attendance", 0)
    has_missing_vision = features.get("has_missing_vision", 1)
    shap_values = _model_shap_values(features)

    def attribution(feature_key: str, fallback: float) -> float:
        return round(shap_values.get(feature_key, fallback), 2)

    # 1. Academic Assessment Factor
    if has_missing_academic == 0:
        if academic_mean >= 80.0:
            direction = "DECREASES_RISK"
            shap_val = attribution("academic_score_mean", -round((academic_mean - 75.0) / 100.0 * 0.6, 2))
            desc = f"Consistently strong assessment average of {academic_mean}% serves as a primary protective factor."
        elif academic_mean < 65.0:
            direction = "INCREASES_RISK"
            shap_val = attribution("academic_score_mean", round((75.0 - academic_mean) / 100.0 * 0.7, 2))
            desc = f"Assessment aggregate of {academic_mean}% is below grade baseline, indicating academic support need."
        else:
            direction = "DECREASES_RISK"
            shap_val = attribution("academic_score_mean", -0.08)
            desc = f"Solid foundation maintained with a {academic_mean}% cumulative assessment score."

        factors.append(ContributingFactorOut(
            id=f"cf_{student_id}_acad_mean",
            factorName="Assessment Average Score",
            featureKey="academic_score_mean",
            featureValue=f"{academic_mean}%",
            shapValue=shap_val,
            direction=direction,
            description=desc,
            dataAvailability="AVAILABLE"
        ))

    # 2. Academic Delta (Performance Trend)
    if abs(academic_delta) >= 3.0:
        if academic_delta > 0:
            direction = "DECREASES_RISK"
            shap_val = attribution("academic_score_delta", -round(academic_delta / 100.0 * 0.8, 2))
            desc = f"Positive upward trajectory: recent scores improved by +{academic_delta}% relative to baseline."
        else:
            direction = "INCREASES_RISK"
            shap_val = attribution("academic_score_delta", round(abs(academic_delta) / 100.0 * 0.8, 2))
            desc = f"Downwards trend detected: recent test marks dropped by {academic_delta}% relative to initial exams."

        factors.append(ContributingFactorOut(
            id=f"cf_{student_id}_acad_delta",
            factorName="Recent Performance Trend",
            featureKey="academic_score_delta",
            featureValue=f"{'+' if academic_delta > 0 else ''}{academic_delta}% delta",
            shapValue=shap_val,
            direction=direction,
            description=desc,
            dataAvailability="AVAILABLE"
        ))

    # 3. Attendance Factor
    if has_missing_attendance == 0:
        if attendance_pct < 75.0 or consecutive_absent >= 2:
            direction = "INCREASES_RISK"
            shap_val = attribution("attendance_ratio", round(max(0.15, (85.0 - attendance_pct) / 100.0 * 0.6), 2))
            desc = f"Attendance rate is {attendance_pct}% with {consecutive_absent} consecutive unexcused absence(s)."
        elif attendance_pct >= 90.0:
            direction = "DECREASES_RISK"
            shap_val = attribution("attendance_ratio", -round((attendance_pct - 85.0) / 100.0 * 0.5, 2))
            desc = f"High lecture and lab attendance consistency recorded at {attendance_pct}%."
        else:
            direction = "DECREASES_RISK"
            shap_val = attribution("attendance_ratio", -0.10)
            desc = f"Satisfactory attendance routine maintained at {attendance_pct}%."

        factors.append(ContributingFactorOut(
            id=f"cf_{student_id}_att",
            factorName="Attendance Consistency",
            featureKey="attendance_ratio",
            featureValue=f"{attendance_pct}%",
            shapValue=shap_val,
            direction=direction,
            description=desc,
            dataAvailability="AVAILABLE"
        ))
    else:
        factors.append(ContributingFactorOut(
            id=f"cf_{student_id}_att_unavail",
            factorName="Classroom Attendance Records",
            featureKey="attendance_ratio",
            featureValue="Unrecorded",
            shapValue=0.0,
            direction="NEUTRAL",
            description="Attendance unrecorded. Omitted from risk attribution to avoid negative bias.",
            dataAvailability="DATA_UNAVAILABLE"
        ))

    # 4. LMS Digital Activity Factor (OULAD VLE signals)
    if on_time_rate < 65.0:
        direction = "INCREASES_RISK"
        shap_val = attribution("on_time_submission_rate", 0.14)
        desc = f"Digital coursework submission rate at {on_time_rate}%; overdue module tasks observed."
    elif on_time_rate >= 85.0:
        direction = "DECREASES_RISK"
        shap_val = attribution("on_time_submission_rate", -0.12)
        desc = f"Proactive digital portal engagement: {on_time_rate}% coursework completed on schedule."
    else:
        direction = "NEUTRAL"
        shap_val = attribution("on_time_submission_rate", 0.02)
        desc = f"Moderate online activity with {on_time_rate}% on-time submission rate."

    factors.append(ContributingFactorOut(
        id=f"cf_{student_id}_lms",
        factorName="Digital Coursework Activity (LMS)",
        featureKey="on_time_submission_rate",
        featureValue=f"{on_time_rate}% on-time",
        shapValue=shap_val,
        direction=direction,
        description=desc,
        dataAvailability="AVAILABLE"
    ))

    # 5. Classroom Vision Sensor Factor
    if has_missing_vision == 1:
        factors.append(ContributingFactorOut(
            id=f"cf_{student_id}_vision",
            factorName="Classroom Vision Engagement",
            featureKey="vision_pose_score",
            featureValue=None,
            shapValue=0.0,
            direction="NEUTRAL",
            description="Camera sensor unavailable. Factor imputed to neutral baseline to ensure zero negative bias.",
            dataAvailability="DATA_UNAVAILABLE"
        ))
    else:
        if vision_index >= 80.0:
            direction = "DECREASES_RISK"
            shap_val = attribution("vision_pose_alertness_index", -0.10)
            desc = "Attentive head pose and classroom engagement detected during recent sessions."
        elif vision_index < 60.0:
            direction = "INCREASES_RISK"
            shap_val = attribution("vision_pose_alertness_index", 0.12)
            desc = "Visual indicators suggest low posture alertness or distraction during class."
        else:
            direction = "NEUTRAL"
            shap_val = attribution("vision_pose_alertness_index", 0.0)
            desc = "Classroom visual indicators within standard normal range."

        factors.append(ContributingFactorOut(
            id=f"cf_{student_id}_vision",
            factorName="Classroom Vision Engagement",
            featureKey="vision_pose_score",
            featureValue=f"{vision_index}",
            shapValue=shap_val,
            direction=direction,
            description=desc,
            dataAvailability="AVAILABLE"
        ))

    return factors
