import csv
import io
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.db_models import Student, AcademicRecord, AttendanceRecord
from ..schemas.upload_schemas import UploadSummaryOut

router = APIRouter(tags=["Uploads"])

@router.post("/academic/upload", response_model=UploadSummaryOut)
async def upload_academic_records(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are supported for academic batch uploads."
        )

    content = await file.read()
    try:
        decoded = content.decode("utf-8")
    except UnicodeDecodeError:
        decoded = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(decoded))
    
    total = 0
    accepted = 0
    rejected = 0
    missing = 0
    errors = []
    affected_students = set()

    for idx, row in enumerate(reader, start=1):
        total += 1
        stu_id_or_code = row.get("student_id") or row.get("student_code") or row.get("id")
        if not stu_id_or_code:
            rejected += 1
            missing += 1
            errors.append(f"Row {idx}: missing student_id or student_code")
            continue

        student = db.query(Student).filter(
            (Student.id == stu_id_or_code) | (Student.student_code == stu_id_or_code)
        ).first()

        if not student:
            rejected += 1
            errors.append(f"Row {idx}: student '{stu_id_or_code}' not found")
            continue

        try:
            score_val = float(row.get("score", 0.0))
            max_score = float(row.get("max_score", 100.0))
            academic_year = (row.get("academic_year") or row.get("academicYear") or "").strip() or None
            semester = (row.get("semester") or "").strip() or None
            subj = row.get("subject", "Data Structures")
            atype = row.get("assessment_type", "Assignment")
            adate = row.get("assessment_date", "2026-09-18")
            
            grade = "A" if score_val >= 90 else "B" if score_val >= 75 else "C" if score_val >= 60 else "D" if score_val >= 50 else "F"

            identity_filters = [
                AcademicRecord.student_id == student.id,
                AcademicRecord.academic_year == academic_year,
                AcademicRecord.semester == semester,
                AcademicRecord.subject == subj,
                AcademicRecord.assessment_type == atype,
                AcademicRecord.assessment_date == adate,
            ]
            db_record = db.query(AcademicRecord).filter(*identity_filters).first()
            if db_record:
                db_record.score = score_val
                db_record.max_score = max_score
                db_record.grade_label = grade
                db_record.status = "AVAILABLE"
            else:
                db.add(AcademicRecord(
                    id=f"ar_up_{uuid.uuid4().hex[:8]}",
                    student_id=student.id,
                    academic_year=academic_year,
                    semester=semester,
                    subject=subj,
                    assessment_type=atype,
                    assessment_date=adate,
                    score=score_val,
                    max_score=max_score,
                    grade_label=grade,
                    class_average=75.0,
                    status="AVAILABLE"
                ))
            accepted += 1
            affected_students.add((student.id, academic_year, semester))
        except (ValueError, TypeError) as e:
            rejected += 1
            errors.append(f"Row {idx}: invalid score format '{row.get('score')}'")

    # Update averages for affected students
    for s_id, academic_year, semester in affected_students:
        query = db.query(AcademicRecord).filter(AcademicRecord.student_id == s_id)
        if academic_year and semester:
            query = query.filter(
                AcademicRecord.academic_year == academic_year,
                AcademicRecord.semester == semester,
            )
        records = query.all()
        if records:
            avg_score = sum(r.score for r in records) / len(records)
            stu = db.query(Student).filter(Student.id == s_id).first()
            if stu:
                stu.academic_score = round(avg_score, 1)

    db.commit()

    return UploadSummaryOut(
        totalRows=total,
        acceptedRows=accepted,
        rejectedRows=rejected,
        missingDataRows=missing,
        updatedStudents=len(affected_students),
        errors=errors[:10],
        message=f"Successfully imported {accepted} academic records across {len({s_id for s_id, _, _ in affected_students})} students."
    )

@router.post("/attendance/upload", response_model=UploadSummaryOut)
async def upload_attendance_records(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are supported for attendance batch uploads."
        )

    content = await file.read()
    try:
        decoded = content.decode("utf-8")
    except UnicodeDecodeError:
        decoded = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(decoded))
    
    total = 0
    accepted = 0
    rejected = 0
    missing = 0
    errors = []
    affected_students = set()

    for idx, row in enumerate(reader, start=1):
        total += 1
        stu_id_or_code = row.get("student_id") or row.get("student_code") or row.get("id")
        if not stu_id_or_code:
            rejected += 1
            missing += 1
            errors.append(f"Row {idx}: missing student_id or student_code")
            continue

        student = db.query(Student).filter(
            (Student.id == stu_id_or_code) | (Student.student_code == stu_id_or_code)
        ).first()

        if not student:
            rejected += 1
            errors.append(f"Row {idx}: student '{stu_id_or_code}' not found")
            continue

        status_str = (row.get("status") or "PRESENT").upper()
        if status_str not in ["PRESENT", "ABSENT", "LATE", "EXCUSED"]:
            status_str = "PRESENT"

        session_name = row.get("session_name", "Lecture Session")
        date_str = row.get("date", "2026-09-18")
        notes = row.get("notes")

        db_att = AttendanceRecord(
            id=f"att_up_{uuid.uuid4().hex[:8]}",
            student_id=student.id,
            date=date_str,
            status=status_str,
            session_name=session_name,
            notes=notes
        )
        db.add(db_att)
        accepted += 1
        affected_students.add(student.id)

    # Recalculate attendance percentage strictly from attendance records (separate from LMS clicks)
    for s_id in affected_students:
        records = db.query(AttendanceRecord).filter(AttendanceRecord.student_id == s_id).all()
        if records:
            attended = sum(1 for r in records if r.status in ["PRESENT", "LATE"])
            pct = (attended / len(records)) * 100.0
            stu = db.query(Student).filter(Student.id == s_id).first()
            if stu:
                stu.attendance_percentage = round(pct, 1)

    db.commit()

    return UploadSummaryOut(
        totalRows=total,
        acceptedRows=accepted,
        rejectedRows=rejected,
        missingDataRows=missing,
        updatedStudents=len(affected_students),
        errors=errors[:10],
        message=f"Successfully imported {accepted} attendance records across {len(affected_students)} students."
    )
