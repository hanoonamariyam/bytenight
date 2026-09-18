from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class UploadSummaryOut(BaseModel):
    totalRows: int
    acceptedRows: int
    rejectedRows: int
    missingDataRows: int
    updatedStudents: int
    errors: List[str] = []
    message: str
