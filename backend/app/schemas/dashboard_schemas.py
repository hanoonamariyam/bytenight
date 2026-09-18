from pydantic import BaseModel
from typing import List, Dict
from .student_schemas import StudentOut
from .alert_schemas import AlertOut

class StatusDistribution(BaseModel):
    GREEN: int
    YELLOW: int
    RED: int

class DataQualityHealth(BaseModel):
    completeProfilesCount: int
    cameraSensorStatus: str # ONLINE, OFFLINE, DEGRADED

class DashboardSummaryOut(BaseModel):
    totalStudents: int
    statusDistribution: StatusDistribution
    classAverageScore: float
    averageAttendance: float
    activeAlertsCount: int
    recentAlerts: List[AlertOut]
    urgentStudents: List[StudentOut]
    topPerformers: List[StudentOut]
    significantRankChanges: List[StudentOut]
    dataQualityHealth: DataQualityHealth
