from typing import List, Dict, Any, Optional
import numpy as np
from ..models.db_models import Student, AcademicRecord, AttendanceRecord, EngagementRecord

# Default neutral benchmarks
BASELINE_ACADEMIC_SCORE = 75.0
BASELINE_ATTENDANCE_RATIO = 0.85
BASELINE_LMS_LOGINS = 4.0
BASELINE_ON_TIME_RATE = 80.0
BASELINE_VISION_INDEX = 75.0

def engineer_features_for_student(
    student: Student,
    academic_records: Optional[List[AcademicRecord]] = None,
    attendance_records: Optional[List[AttendanceRecord]] = None,
    engagement_record: Optional[EngagementRecord] = None
) -> Dict[str, Any]:
    """
    Transforms multi-source student records into normalized ML feature dictionary.
    Guarantees:
    - Missing data never penalizes the student.
    - Imputes missing sensors to population neutral median.
    - Tracks explicit boolean missingness indicators.
    """
    if academic_records is None:
        academic_records = student.academic_records or []
    if attendance_records is None:
        attendance_records = student.attendance_records or []
    if engagement_record is None and student.engagement_records:
        engagement_record = student.engagement_records[0]

    # 1. Academic Performance Features
    if academic_records:
        scores = [r.score for r in academic_records]
        academic_score_mean = float(np.mean(scores))
        academic_min_score = float(np.min(scores))
        academic_max_score = float(np.max(scores))
        
        # Calculate recent delta (last assessment vs earliest baseline)
        if len(scores) >= 2:
            academic_score_delta = float(scores[-1] - scores[0])
        else:
            academic_score_delta = 0.0
            
        failed_assessments_count = sum(1 for s in scores if s < 60.0)
        has_missing_academic = 0
    else:
        academic_score_mean = float(student.academic_score) if student.academic_score is not None else BASELINE_ACADEMIC_SCORE
        academic_min_score = academic_score_mean
        academic_max_score = academic_score_mean
        academic_score_delta = 0.0
        failed_assessments_count = 0
        has_missing_academic = 1

    # 2. Attendance Features (Separated from LMS)
    if attendance_records:
        total_sessions = len(attendance_records)
        attended_sessions = sum(1 for r in attendance_records if r.status in ["PRESENT", "LATE"])
        attendance_ratio = attended_sessions / total_sessions if total_sessions > 0 else BASELINE_ATTENDANCE_RATIO
        
        # Calculate consecutive absent streak starting from most recent
        consecutive_absent_streak = 0
        for r in attendance_records:
            if r.status == "ABSENT":
                consecutive_absent_streak += 1
            else:
                break
        has_missing_attendance = 0
    else:
        if student.attendance_percentage is not None and student.attendance_percentage > 0:
            attendance_ratio = student.attendance_percentage / 100.0
            consecutive_absent_streak = 0
            has_missing_attendance = 0
        else:
            # Explicitly mark attendance as missing; impute neutrally
            attendance_ratio = BASELINE_ATTENDANCE_RATIO
            consecutive_absent_streak = 0
            has_missing_attendance = 1

    # 3. LMS Digital Engagement (Derived from OULAD interaction model)
    if engagement_record:
        lms_logins_weekly = float(engagement_record.lms_logins_weekly)
        on_time_submission_rate = float(engagement_record.on_time_submissions_rate)
        has_missing_engagement = 0
    else:
        lms_logins_weekly = (float(student.engagement_score) / 15.0) if student.engagement_score else BASELINE_LMS_LOGINS
        on_time_submission_rate = float(student.engagement_score) if student.engagement_score else BASELINE_ON_TIME_RATE
        has_missing_engagement = 0 if student.engagement_score is not None else 1

    # 4. Auxiliary Classroom Vision Signals
    data_avail = student.data_availability or {}
    vision_status = data_avail.get("vision", "AVAILABLE")
    
    if engagement_record and engagement_record.vision_engagement_index is not None and vision_status == "AVAILABLE":
        vision_pose_alertness_index = float(engagement_record.vision_engagement_index)
        has_missing_vision = 0
    else:
        # Camera offline or unavailable: neutral median imputation to prevent risk bias
        vision_pose_alertness_index = BASELINE_VISION_INDEX
        has_missing_vision = 1

    features = {
        "academic_score_mean": round(academic_score_mean, 2),
        "academic_score_delta": round(academic_score_delta, 2),
        "academic_min_score": round(academic_min_score, 2),
        "academic_max_score": round(academic_max_score, 2),
        "failed_assessments_count": failed_assessments_count,
        "attendance_ratio": round(attendance_ratio, 3),
        "consecutive_absent_streak": consecutive_absent_streak,
        "lms_logins_weekly": round(lms_logins_weekly, 2),
        "on_time_submission_rate": round(on_time_submission_rate, 2),
        "vision_pose_alertness_index": round(vision_pose_alertness_index, 2),
        # Missingness Indicators
        "has_missing_academic": has_missing_academic,
        "has_missing_attendance": has_missing_attendance,
        "has_missing_engagement": has_missing_engagement,
        "has_missing_vision": has_missing_vision
    }

    return features
