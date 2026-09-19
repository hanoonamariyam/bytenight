from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .student_schemas import ContributingFactorOut

class PredictionRequest(BaseModel):
    studentId: str
    academicYear: Optional[str] = None
    semester: Optional[str] = None

class PredictionOut(BaseModel):
    predictionId: str
    studentId: str
    predictedStatus: str # GREEN, YELLOW, RED
    riskScore: float
    confidence: float
    modelVersion: str
    createdAt: str
    contributingFactors: List[ContributingFactorOut]

class ExplanationOut(BaseModel):
    predictionId: str
    studentId: str
    status: str
    riskScore: float
    baselineScore: float
    factors: List[ContributingFactorOut]
