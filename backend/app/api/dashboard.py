from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.db_models import Student, Alert
from ..schemas.dashboard_schemas import (
    DashboardSummaryOut, StatusDistribution, DataQualityHealth
)
from .serializers import format_student, format_alert

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    total_students = len(students)
    
    if total_students == 0:
        return DashboardSummaryOut(
            totalStudents=0,
            statusDistribution=StatusDistribution(GREEN=0, YELLOW=0, RED=0),
            classAverageScore=0.0,
            averageAttendance=0.0,
            activeAlertsCount=0,
            recentAlerts=[],
            urgentStudents=[],
            topPerformers=[],
            significantRankChanges=[],
            dataQualityHealth=DataQualityHealth(
                completeProfilesCount=0,
                cameraSensorStatus="ONLINE"
            )
        )

    status_dist = {
        "GREEN": sum(1 for s in students if s.current_status == "GREEN"),
        "YELLOW": sum(1 for s in students if s.current_status == "YELLOW"),
        "RED": sum(1 for s in students if s.current_status == "RED")
    }

    class_avg = round(sum(s.academic_score for s in students) / total_students, 1)
    avg_att = round(sum(s.attendance_percentage for s in students) / total_students, 1)

    # Urgent students: RED and YELLOW students sorted by risk_score descending
    urgent = [s for s in students if s.current_status in ["RED", "YELLOW"]]
    urgent.sort(key=lambda s: s.risk_score, reverse=True)

    # Top performers: sorted by rank ascending (1, 2, 3...)
    sorted_by_rank = sorted(students, key=lambda s: s.current_rank)
    top_performers = sorted_by_rank[:5]

    # Significant rank changes: abs(rank_change) >= 2, sorted by abs(rank_change) descending
    significant_changes = [s for s in students if abs(s.rank_change) >= 2]
    significant_changes.sort(key=lambda s: abs(s.rank_change), reverse=True)

    # Alerts
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).all()
    active_alerts_count = sum(1 for a in alerts if not a.is_read)
    recent_alerts = alerts[:5]

    # Data health
    complete_count = sum(1 for s in students if (s.data_availability or {}).get("vision") == "AVAILABLE")
    camera_status = "DEGRADED" if any((s.data_availability or {}).get("vision") != "AVAILABLE" for s in students) else "ONLINE"

    return DashboardSummaryOut(
        totalStudents=total_students,
        statusDistribution=StatusDistribution(**status_dist),
        classAverageScore=class_avg,
        averageAttendance=avg_att,
        activeAlertsCount=active_alerts_count,
        recentAlerts=[format_alert(a) for a in recent_alerts],
        urgentStudents=[format_student(s) for s in urgent],
        topPerformers=[format_student(s) for s in top_performers],
        significantRankChanges=[format_student(s) for s in significant_changes],
        dataQualityHealth=DataQualityHealth(
            completeProfilesCount=complete_count,
            cameraSensorStatus=camera_status
        )
    )
