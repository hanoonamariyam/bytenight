from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union

class DataAvailabilitySchema(BaseModel):
    academic: str = "AVAILABLE" # AVAILABLE, DATA_UNAVAILABLE, LOW_CONFIDENCE
    attendance: str = "AVAILABLE"
    engagement: str = "AVAILABLE"
    vision: str = "AVAILABLE"

class StudentBase(BaseModel):
    id: str
    studentCode: str
    fullName: str
    email: str
    className: str
    section: str
    avatarUrl: Optional[str] = None
    
    currentStatus: str = "GREEN" # GREEN, YELLOW, RED
    riskScore: float = 0.15
    trend: str = "STABLE" # IMPROVING, STABLE, DECLINING
    
    academicScore: float = 75.0
    attendancePercentage: float = 85.0
    engagementScore: float = 80.0
    
    currentRank: int = 1
    previousRank: int = 1
    bestRank: int = 1
    rankChange: int = 0
    
    dataAvailability: DataAvailabilitySchema
    lastEvaluated: str

class StudentOut(StudentBase):
    class Config:
        from_attributes = True

class AcademicRecordOut(BaseModel):
    id: str
    subject: str
    assessmentType: str
    assessmentDate: str
    score: float
    maxScore: float = 100.0
    gradeLabel: str
    classAverage: float
    status: str = "AVAILABLE"

    class Config:
        from_attributes = True

class AttendanceRecordOut(BaseModel):
    id: str
    date: str
    status: str # PRESENT, ABSENT, LATE, EXCUSED
    sessionName: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class EngagementMetricsOut(BaseModel):
    overallScore: float
    participationLevel: str # HIGH, MODERATE, LOW
    lmsLoginsWeekly: float
    onTimeSubmissionsRate: float
    visionEngagementIndex: Optional[float] = None
    visionStatus: str = "AVAILABLE"
    visionNote: str = ""

    class Config:
        from_attributes = True

class ContributingFactorOut(BaseModel):
    id: str
    factorName: str
    featureKey: str
    featureValue: Optional[Union[str, float, int]] = None
    shapValue: float
    direction: str # INCREASES_RISK, DECREASES_RISK, NEUTRAL
    description: str
    dataAvailability: str = "AVAILABLE"

    class Config:
        from_attributes = True

class StatusTransitionOut(BaseModel):
    id: str
    previousStatus: Optional[str] = None
    currentStatus: str
    changedAt: str
    reasonSummary: str
    sourcePredictionId: Optional[str] = None

    class Config:
        from_attributes = True

class RankHistoryEntryOut(BaseModel):
    term: str
    date: str
    rank: int
    score: float

    class Config:
        from_attributes = True

class StudentDetailOut(BaseModel):
    student: StudentOut
    academicRecords: List[AcademicRecordOut]
    attendanceRecords: List[AttendanceRecordOut]
    engagement: EngagementMetricsOut
    contributingFactors: List[ContributingFactorOut]
    statusHistory: List[StatusTransitionOut]
    rankHistory: List[RankHistoryEntryOut]
