import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.db_models import (
    Student, AcademicRecord, AttendanceRecord,
    EngagementRecord, Prediction, PredictionFactor,
    StatusHistory, Alert
)
from ..schemas.prediction_schemas import (
    PredictionRequest, PredictionOut, ExplanationOut
)
from ..schemas.student_schemas import ContributingFactorOut
from ..ml.feature_engineering import engineer_features_for_student
from ..ml.predictor import predict_student_risk
from ..ml.explanation import explain_prediction
from .serializers import format_factor

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("", response_model=PredictionOut)
@router.post("/", response_model=PredictionOut)
def run_prediction(request: PredictionRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(
        (Student.id == request.studentId) | (Student.student_code == request.studentId)
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student '{request.studentId}' not found"
        )

    academic_query = db.query(AcademicRecord).filter(
        AcademicRecord.student_id == student.id
    )
    requested_semester = request.semester
    requested_year = request.academicYear
    if requested_semester == "current":
        latest = academic_query.filter(
            AcademicRecord.academic_year.isnot(None),
            AcademicRecord.semester.isnot(None),
        ).order_by(AcademicRecord.assessment_date.desc()).first()
        if latest:
            requested_year = requested_year or latest.academic_year
            requested_semester = latest.semester
        else:
            requested_semester = "__no_current_semester__"
    if requested_year is not None:
        academic_query = academic_query.filter(AcademicRecord.academic_year == requested_year)
    if requested_semester is not None:
        academic_query = academic_query.filter(AcademicRecord.semester == requested_semester)
    academic_records = academic_query.all()
    attendance_records = db.query(AttendanceRecord).filter(
        AttendanceRecord.student_id == student.id
    ).all()
    engagement_record = db.query(EngagementRecord).filter(
        EngagementRecord.student_id == student.id
    ).first()

    # 1. Feature Engineering
    features = engineer_features_for_student(
        student, academic_records, attendance_records, engagement_record
    )

    # 2. Risk Inference
    pred_result = predict_student_risk(features)
    predicted_status = pred_result["predicted_status"]
    risk_score = pred_result["risk_score"]
    confidence = pred_result["confidence"]
    trend = pred_result["trend"]
    model_version = pred_result["model_version"]

    # 3. Explainability / SHAP Attributions
    factors_out = explain_prediction(
        student.id, features, predicted_status, risk_score
    )

    # 4. Save to Database
    prediction_id = f"pred_{uuid.uuid4().hex[:8]}"
    db_pred = Prediction(
        id=prediction_id,
        student_id=student.id,
        prediction_date=datetime.utcnow(),
        predicted_status=predicted_status,
        risk_score=risk_score,
        confidence_score=confidence,
        model_version=model_version,
        feature_snapshot=features,
        quality_status="AVAILABLE"
    )
    db.add(db_pred)

    # Save factors
    for factor in factors_out:
        db_factor = PredictionFactor(
            id=f"pf_{uuid.uuid4().hex[:8]}",
            prediction_id=prediction_id,
            factor_name=factor.factorName,
            feature_key=factor.featureKey,
            feature_value=str(factor.featureValue) if factor.featureValue is not None else None,
            shap_value=factor.shapValue,
            direction=factor.direction,
            description=factor.description,
            data_availability=factor.dataAvailability
        )
        db.add(db_factor)

    # 5. Check if Status Changed and log history / alert if needed
    if student.current_status != predicted_status:
        prev = student.current_status
        student.current_status = predicted_status
        student.risk_score = risk_score
        student.trend = trend
        student.last_evaluated = datetime.utcnow()

        history_entry = StatusHistory(
            id=f"sh_{uuid.uuid4().hex[:8]}",
            student_id=student.id,
            previous_status=prev,
            current_status=predicted_status,
            changed_at=datetime.utcnow().isoformat() + "Z",
            reason_summary=f"Automated evaluation shifted status from {prev} to {predicted_status} (Risk: {risk_score}).",
            source_prediction_id=prediction_id
        )
        db.add(history_entry)

        # Trigger alert if degradation
        if (prev == "GREEN" and predicted_status in ["YELLOW", "RED"]) or (prev == "YELLOW" and predicted_status == "RED"):
            alert_sev = "CRITICAL" if predicted_status == "RED" else "WARNING"
            alert = Alert(
                id=f"alt_{uuid.uuid4().hex[:8]}",
                student_id=student.id,
                student_name=student.full_name,
                student_code=student.student_code,
                alert_type="STATUS_DEGRADATION",
                severity=alert_sev,
                title=f"Status Shift: {predicted_status}",
                message=f"{student.full_name} moved from {prev} to {predicted_status}.",
                timestamp=datetime.utcnow().isoformat() + "Z",
                is_read=False
            )
            db.add(alert)
    else:
        student.risk_score = risk_score
        student.trend = trend
        student.last_evaluated = datetime.utcnow()

    db.commit()

    return PredictionOut(
        predictionId=prediction_id,
        studentId=student.id,
        predictedStatus=predicted_status,
        riskScore=risk_score,
        confidence=confidence,
        modelVersion=model_version,
        createdAt=datetime.utcnow().isoformat() + "Z",
        contributingFactors=factors_out
    )

@router.get("/{prediction_id}", response_model=PredictionOut)
def get_prediction(prediction_id: str, db: Session = Depends(get_db)):
    pred = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not pred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction '{prediction_id}' not found"
        )
    factors = db.query(PredictionFactor).filter(
        PredictionFactor.prediction_id == pred.id
    ).all()

    return PredictionOut(
        predictionId=pred.id,
        studentId=pred.student_id,
        predictedStatus=pred.predicted_status,
        riskScore=pred.risk_score,
        confidence=pred.confidence_score,
        modelVersion=pred.model_version,
        createdAt=pred.prediction_date.isoformat() + "Z",
        contributingFactors=[format_factor(f) for f in factors]
    )

@router.get("/{prediction_id}/explanation", response_model=ExplanationOut)
def get_prediction_explanation(prediction_id: str, db: Session = Depends(get_db)):
    pred = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not pred:
        # Check if prediction_id is actually a student_id
        pred = db.query(Prediction).filter(
            Prediction.student_id == prediction_id
        ).order_by(Prediction.prediction_date.desc()).first()

    if not pred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction or explanation for '{prediction_id}' not found"
        )

    factors = db.query(PredictionFactor).filter(
        PredictionFactor.prediction_id == pred.id
    ).all()

    return ExplanationOut(
        predictionId=pred.id,
        studentId=pred.student_id,
        status=pred.predicted_status,
        riskScore=pred.risk_score,
        baselineScore=0.25,
        factors=[format_factor(f) for f in factors]
    )
