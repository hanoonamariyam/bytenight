from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.db_models import Alert
from ..schemas.alert_schemas import AlertOut, MarkAlertReadResponse
from .serializers import format_alert

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertOut])
@router.get("/", response_model=List[AlertOut])
def get_alerts(
    is_read: Optional[bool] = Query(None, alias="isRead"),
    severity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if is_read is not None:
        query = query.filter(Alert.is_read == is_read)
    if severity and severity.upper() != "ALL":
        query = query.filter(Alert.severity == severity.upper())

    alerts = query.order_by(Alert.timestamp.desc()).all()
    return [format_alert(a) for a in alerts]

@router.post("/{alert_id}/read", response_model=MarkAlertReadResponse)
def mark_alert_as_read(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert '{alert_id}' not found"
        )
    alert.is_read = True
    db.commit()

    return MarkAlertReadResponse(
        success=True,
        alertId=alert.id,
        readAt=datetime.utcnow().isoformat() + "Z"
    )

@router.post("/read-all")
def mark_all_alerts_read(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.is_read == False).all()
    count = len(alerts)
    for a in alerts:
        a.is_read = True
    db.commit()
    return {"success": True, "count": count, "message": f"Marked {count} alerts as read."}
