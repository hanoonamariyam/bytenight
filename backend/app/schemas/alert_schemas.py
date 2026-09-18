from pydantic import BaseModel
from typing import Optional

class AlertOut(BaseModel):
    id: str
    studentId: str
    studentName: str
    studentCode: str
    alertType: str # STATUS_DEGRADATION, STATUS_RECOVERY, DATA_ANOMALY
    severity: str # CRITICAL, WARNING, INFO
    title: str
    message: str
    timestamp: str
    isRead: bool

    class Config:
        from_attributes = True

class MarkAlertReadResponse(BaseModel):
    success: bool
    alertId: str
    readAt: str
