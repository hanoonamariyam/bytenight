from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class DetectedStudentBehavior(BaseModel):
    student_id: str
    desk_label: Optional[str] = None
    behaviour: str # ATTENTIVE, TALKING, PHONE_USAGE, SLEEPING, UNKNOWN
    confidence: float
    indicators: List[str] = []

class BehaviourSummary(BaseModel):
    attentive: int = 0
    talking: int = 0
    phone_usage: int = 0
    sleeping: int = 0
    unknown: int = 0

class VisionAnalyzeResponse(BaseModel):
    video_id: str
    status: str # completed, degraded, failed
    students_detected: int
    analysis_duration: str
    data_quality: str # VALID, LOW_CONFIDENCE, SENSOR_OFFLINE
    confidence: float
    behaviour_summary: BehaviourSummary
    students: List[DetectedStudentBehavior]
    processing_warnings: List[str] = []

class SimulatedDetection(BaseModel):
    id: str
    deskLabel: str
    studentName: str
    headPoseStatus: str # ACTIVE_ATTENTION, LOOKING_DOWN, LOOKING_AWAY
    presenceConfidence: float
    engagementScore: float

class VisionStatusResponse(BaseModel):
    classroomId: str
    classroomName: str
    cameraStatus: str # ONLINE, OFFLINE, DEGRADED
    detectionFps: int
    activeStudentsDetected: int
    averageEngagementIndex: float
    confidenceScore: float
    lightingQuality: str # OPTIMAL, FAIR, POOR
    frameResolution: str
    dataAvailabilityNote: str
    simulatedDetections: List[SimulatedDetection]
