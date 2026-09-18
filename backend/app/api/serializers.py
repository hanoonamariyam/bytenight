from typing import Optional, List, Dict, Any
from ..models.db_models import (
    Student, AcademicRecord, AttendanceRecord,
    EngagementRecord, PredictionFactor, StatusHistory, Alert
)
from ..schemas.student_schemas import (
    StudentOut, DataAvailabilitySchema, AcademicRecordOut,
    AttendanceRecordOut, EngagementMetricsOut, ContributingFactorOut,
    StatusTransitionOut, RankHistoryEntryOut
)
from ..schemas.alert_schemas import AlertOut

def format_student(student: Student) -> StudentOut:
    raw_avail = student.data_availability or {}
    availability = DataAvailabilitySchema(
        academic=raw_avail.get("academic", "AVAILABLE"),
        attendance=raw_avail.get("attendance", "AVAILABLE"),
        engagement=raw_avail.get("engagement", "AVAILABLE"),
        vision=raw_avail.get("vision", "AVAILABLE")
    )
    last_eval = student.last_evaluated.isoformat() + "Z" if student.last_evaluated else "2026-09-18T10:30:00Z"
    
    return StudentOut(
        id=student.id,
        studentCode=student.student_code,
        fullName=student.full_name,
        email=student.email,
        className=student.class_name,
        section=student.section,
        avatarUrl=student.avatar_url,
        currentStatus=student.current_status,
        riskScore=round(float(student.risk_score), 2),
        trend=student.trend,
        academicScore=round(float(student.academic_score), 1),
        attendancePercentage=round(float(student.attendance_percentage), 1),
        engagementScore=round(float(student.engagement_score), 1),
        currentRank=student.current_rank,
        previousRank=student.previous_rank,
        bestRank=student.best_rank,
        rankChange=student.rank_change,
        dataAvailability=availability,
        lastEvaluated=last_eval
    )

def format_academic_record(record: AcademicRecord) -> AcademicRecordOut:
    return AcademicRecordOut(
        id=record.id,
        subject=record.subject,
        assessmentType=record.assessment_type,
        assessmentDate=record.assessment_date,
        score=float(record.score),
        maxScore=float(record.max_score),
        gradeLabel=record.grade_label,
        classAverage=float(record.class_average),
        status=record.status or "AVAILABLE"
    )

def format_attendance_record(record: AttendanceRecord) -> AttendanceRecordOut:
    return AttendanceRecordOut(
        id=record.id,
        date=record.date,
        status=record.status,
        sessionName=record.session_name,
        notes=record.notes
    )

def format_engagement(record: Optional[EngagementRecord], student: Student) -> EngagementMetricsOut:
    if record:
        vis_index = float(record.vision_engagement_index) if record.vision_engagement_index is not None else None
        return EngagementMetricsOut(
            overallScore=round(float(record.score_metric), 1),
            participationLevel=record.participation_level or "MODERATE",
            lmsLoginsWeekly=round(float(record.lms_logins_weekly), 1),
            onTimeSubmissionsRate=round(float(record.on_time_submissions_rate), 1),
            visionEngagementIndex=vis_index,
            visionStatus=record.vision_status or "AVAILABLE",
            visionNote=record.vision_note or ""
        )
    # Default synthesis if record is missing
    raw_avail = student.data_availability or {}
    vis_status = raw_avail.get("vision", "AVAILABLE")
    vis_index = float(student.engagement_score) if vis_status == "AVAILABLE" else None
    return EngagementMetricsOut(
        overallScore=round(float(student.engagement_score), 1),
        participationLevel="HIGH" if student.engagement_score >= 80 else "MODERATE" if student.engagement_score >= 65 else "LOW",
        lmsLoginsWeekly=round(float(student.engagement_score) / 15.0, 1),
        onTimeSubmissionsRate=round(float(student.engagement_score), 1),
        visionEngagementIndex=vis_index,
        visionStatus=vis_status,
        visionNote="Classroom visual indicators within standard active range." if vis_status == "AVAILABLE" else "Vision sensor data unavailable."
    )

def format_factor(factor: PredictionFactor) -> ContributingFactorOut:
    return ContributingFactorOut(
        id=factor.id,
        factorName=factor.factor_name,
        featureKey=factor.feature_key,
        featureValue=factor.feature_value,
        shapValue=round(float(factor.shap_value), 2),
        direction=factor.direction,
        description=factor.description,
        dataAvailability=factor.data_availability or "AVAILABLE"
    )

def format_status_transition(trans: StatusHistory) -> StatusTransitionOut:
    return StatusTransitionOut(
        id=trans.id,
        previousStatus=trans.previous_status,
        currentStatus=trans.current_status,
        changedAt=trans.changed_at,
        reasonSummary=trans.reason_summary,
        sourcePredictionId=trans.source_prediction_id
    )

def format_alert(alert: Alert) -> AlertOut:
    return AlertOut(
        id=alert.id,
        studentId=alert.student_id,
        studentName=alert.student_name,
        studentCode=alert.student_code,
        alertType=alert.alert_type,
        severity=alert.severity,
        title=alert.title,
        message=alert.message,
        timestamp=alert.timestamp,
        isRead=alert.is_read
    )
