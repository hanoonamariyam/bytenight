import datetime
from sqlalchemy.orm import Session
from .database import SessionLocal, init_db, engine
from .models.db_models import (
    User, Student, AcademicRecord, AttendanceRecord,
    EngagementRecord, Prediction, PredictionFactor,
    StatusHistory, Alert, VideoAnalysis
)
from .security import hash_password

def seed_database():
    print("Initializing database tables...")
    init_db()
    
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        existing_user = db.query(User).filter(User.email == "prof.smith@university.edu").first()
        if existing_user:
            print("Database already contains demo user. Resetting demo data...")
            db.query(PredictionFactor).delete()
            db.query(Prediction).delete()
            db.query(Alert).delete()
            db.query(StatusHistory).delete()
            db.query(AcademicRecord).delete()
            db.query(AttendanceRecord).delete()
            db.query(EngagementRecord).delete()
            db.query(Student).delete()
            db.query(User).delete()
            db.commit()

        # 1. Create Demo Faculty User
        faculty = User(
            id="usr_sarah_smith",
            email="prof.smith@university.edu",
            hashed_password=hash_password("Password123!"),
            full_name="Dr. Sarah Smith",
            role="FACULTY",
            department="Computer Science & Engineering",
            assigned_classes=["CS-101: Data Structures & Algorithms (Sec A)"],
            is_active=True
        )
        db.add(faculty)

        # 2. Seed 14 Benchmark Students
        students_data = [
            {
                "id": "stu_001",
                "student_code": "ST001",
                "full_name": "Sophia Al-Mansoor",
                "email": "sophia.m@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "GREEN",
                "risk_score": 0.08,
                "trend": "IMPROVING",
                "academic_score": 95.4,
                "attendance_percentage": 98.0,
                "engagement_score": 96.0,
                "current_rank": 1,
                "previous_rank": 2,
                "best_rank": 1,
                "rank_change": 1,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_002",
                "student_code": "ST002",
                "full_name": "Liam Chen",
                "email": "liam.chen@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "GREEN",
                "risk_score": 0.12,
                "trend": "STABLE",
                "academic_score": 92.1,
                "attendance_percentage": 94.5,
                "engagement_score": 89.0,
                "current_rank": 2,
                "previous_rank": 1,
                "best_rank": 1,
                "rank_change": -1,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "DATA_UNAVAILABLE" # Sensor offline in zone; neutral
                }
            },
            {
                "id": "stu_003",
                "student_code": "ST003",
                "full_name": "Ananya Sharma",
                "email": "ananya.s@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "GREEN",
                "risk_score": 0.16,
                "trend": "IMPROVING",
                "academic_score": 89.5,
                "attendance_percentage": 92.0,
                "engagement_score": 91.0,
                "current_rank": 3,
                "previous_rank": 4,
                "best_rank": 3,
                "rank_change": 1,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_004",
                "student_code": "ST004",
                "full_name": "Ethan Wright",
                "email": "ethan.w@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "GREEN",
                "risk_score": 0.22,
                "trend": "STABLE",
                "academic_score": 86.8,
                "attendance_percentage": 90.0,
                "engagement_score": 85.0,
                "current_rank": 4,
                "previous_rank": 4,
                "best_rank": 4,
                "rank_change": 0,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_005",
                "student_code": "ST005",
                "full_name": "Zoe Martinez",
                "email": "zoe.m@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "GREEN",
                "risk_score": 0.25,
                "trend": "STABLE",
                "academic_score": 84.6,
                "attendance_percentage": 88.5,
                "engagement_score": 82.0,
                "current_rank": 5,
                "previous_rank": 6,
                "best_rank": 5,
                "rank_change": 1,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_006",
                "student_code": "ST006",
                "full_name": "Marcus Vance",
                "email": "marcus.v@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "GREEN",
                "risk_score": 0.28,
                "trend": "IMPROVING",
                "academic_score": 83.2,
                "attendance_percentage": 91.0,
                "engagement_score": 84.0,
                "current_rank": 6,
                "previous_rank": 11,
                "best_rank": 6,
                "rank_change": 5,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_007",
                "student_code": "ST007",
                "full_name": "David Kim",
                "email": "david.kim@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "GREEN",
                "risk_score": 0.32,
                "trend": "STABLE",
                "academic_score": 80.4,
                "attendance_percentage": 86.0,
                "engagement_score": 78.0,
                "current_rank": 7,
                "previous_rank": 7,
                "best_rank": 6,
                "rank_change": 0,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "LOW_CONFIDENCE"
                }
            },
            {
                "id": "stu_008",
                "student_code": "ST008",
                "full_name": "Chloe Bennett",
                "email": "chloe.b@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "YELLOW",
                "risk_score": 0.49,
                "trend": "DECLINING",
                "academic_score": 76.5,
                "attendance_percentage": 79.0,
                "engagement_score": 74.0,
                "current_rank": 8,
                "previous_rank": 6,
                "best_rank": 5,
                "rank_change": -2,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_009",
                "student_code": "ST009",
                "full_name": "Aria Patel",
                "email": "aria.patel@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "YELLOW",
                "risk_score": 0.54,
                "trend": "DECLINING",
                "academic_score": 75.0,
                "attendance_percentage": 72.4,
                "engagement_score": 71.0,
                "current_rank": 9,
                "previous_rank": 5,
                "best_rank": 4,
                "rank_change": -4,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_010",
                "student_code": "ST010",
                "full_name": "Carlos Rodriguez",
                "email": "carlos.r@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "YELLOW",
                "risk_score": 0.58,
                "trend": "STABLE",
                "academic_score": 72.8,
                "attendance_percentage": 75.0,
                "engagement_score": 68.0,
                "current_rank": 10,
                "previous_rank": 9,
                "best_rank": 8,
                "rank_change": -1,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "DATA_UNAVAILABLE"
                }
            },
            {
                "id": "stu_011",
                "student_code": "ST011",
                "full_name": "Priya Nair",
                "email": "priya.n@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "YELLOW",
                "risk_score": 0.62,
                "trend": "DECLINING",
                "academic_score": 69.2,
                "attendance_percentage": 71.0,
                "engagement_score": 65.0,
                "current_rank": 11,
                "previous_rank": 10,
                "best_rank": 9,
                "rank_change": -1,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_012",
                "student_code": "ST012",
                "full_name": "Tariq Johnson",
                "email": "tariq.j@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "RED",
                "risk_score": 0.74,
                "trend": "DECLINING",
                "academic_score": 64.0,
                "attendance_percentage": 66.5,
                "engagement_score": 58.0,
                "current_rank": 12,
                "previous_rank": 10,
                "best_rank": 8,
                "rank_change": -2,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "AVAILABLE"
                }
            },
            {
                "id": "stu_013",
                "student_code": "ST013",
                "full_name": "Lucas Silva",
                "email": "lucas.s@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "RED",
                "risk_score": 0.79,
                "trend": "DECLINING",
                "academic_score": 60.5,
                "attendance_percentage": 64.0,
                "engagement_score": 54.0,
                "current_rank": 13,
                "previous_rank": 12,
                "best_rank": 10,
                "rank_change": -1,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "LOW_CONFIDENCE"
                }
            },
            {
                "id": "stu_014",
                "student_code": "ST014",
                "full_name": "Jane Doe",
                "email": "jane.doe@university.edu",
                "class_name": "CS-101 Sec A",
                "section": "A",
                "current_status": "RED",
                "risk_score": 0.84,
                "trend": "DECLINING",
                "academic_score": 57.2,
                "attendance_percentage": 61.5,
                "engagement_score": 50.0,
                "current_rank": 14,
                "previous_rank": 11,
                "best_rank": 9,
                "rank_change": -3,
                "data_availability": {
                    "academic": "AVAILABLE",
                    "attendance": "AVAILABLE",
                    "engagement": "AVAILABLE",
                    "vision": "DATA_UNAVAILABLE"
                }
            }
        ]

        for s_data in students_data:
            student = Student(
                id=s_data["id"],
                student_code=s_data["student_code"],
                full_name=s_data["full_name"],
                email=s_data["email"],
                class_name=s_data["class_name"],
                section=s_data["section"],
                current_status=s_data["current_status"],
                risk_score=s_data["risk_score"],
                trend=s_data["trend"],
                academic_score=s_data["academic_score"],
                attendance_percentage=s_data["attendance_percentage"],
                engagement_score=s_data["engagement_score"],
                current_rank=s_data["current_rank"],
                previous_rank=s_data["previous_rank"],
                best_rank=s_data["best_rank"],
                rank_change=s_data["rank_change"],
                data_availability=s_data["data_availability"]
            )
            db.add(student)

        # 3. Specific Academic Records for Benchmark Students
        academic_records_map = {
            "stu_014": [
                {"id": "ar_01", "subject": "Data Structures", "assessment_type": "Quiz 1", "assessment_date": "2026-08-10", "score": 82.0, "max_score": 100.0, "grade_label": "B", "class_average": 78.0},
                {"id": "ar_02", "subject": "Data Structures", "assessment_type": "Lab Assignment 1", "assessment_date": "2026-08-22", "score": 76.0, "max_score": 100.0, "grade_label": "C+", "class_average": 81.0},
                {"id": "ar_03", "subject": "Data Structures", "assessment_type": "Quiz 2", "assessment_date": "2026-09-02", "score": 62.0, "max_score": 100.0, "grade_label": "D", "class_average": 75.0},
                {"id": "ar_04", "subject": "Data Structures", "assessment_type": "Midterm Exam", "assessment_date": "2026-09-14", "score": 51.0, "max_score": 100.0, "grade_label": "F", "class_average": 74.0}
            ],
            "stu_002": [
                {"id": "ar_05", "subject": "Data Structures", "assessment_type": "Quiz 1", "assessment_date": "2026-08-10", "score": 95.0, "max_score": 100.0, "grade_label": "A", "class_average": 78.0},
                {"id": "ar_06", "subject": "Data Structures", "assessment_type": "Lab Assignment 1", "assessment_date": "2026-08-22", "score": 92.0, "max_score": 100.0, "grade_label": "A-", "class_average": 81.0},
                {"id": "ar_07", "subject": "Data Structures", "assessment_type": "Quiz 2", "assessment_date": "2026-09-02", "score": 89.0, "max_score": 100.0, "grade_label": "B+", "class_average": 75.0},
                {"id": "ar_08", "subject": "Data Structures", "assessment_type": "Midterm Exam", "assessment_date": "2026-09-14", "score": 92.0, "max_score": 100.0, "grade_label": "A-", "class_average": 74.0}
            ],
            "stu_006": [
                {"id": "ar_09", "subject": "Data Structures", "assessment_type": "Quiz 1", "assessment_date": "2026-08-10", "score": 58.0, "max_score": 100.0, "grade_label": "F", "class_average": 78.0},
                {"id": "ar_10", "subject": "Data Structures", "assessment_type": "Lab Assignment 1", "assessment_date": "2026-08-22", "score": 71.0, "max_score": 100.0, "grade_label": "C", "class_average": 81.0},
                {"id": "ar_11", "subject": "Data Structures", "assessment_type": "Quiz 2", "assessment_date": "2026-09-02", "score": 82.0, "max_score": 100.0, "grade_label": "B", "class_average": 75.0},
                {"id": "ar_12", "subject": "Data Structures", "assessment_type": "Midterm Exam", "assessment_date": "2026-09-14", "score": 88.0, "max_score": 100.0, "grade_label": "B+", "class_average": 74.0}
            ],
            "stu_009": [
                {"id": "ar_13", "subject": "Data Structures", "assessment_type": "Quiz 1", "assessment_date": "2026-08-10", "score": 86.0, "max_score": 100.0, "grade_label": "B", "class_average": 78.0},
                {"id": "ar_14", "subject": "Data Structures", "assessment_type": "Lab Assignment 1", "assessment_date": "2026-08-22", "score": 84.0, "max_score": 100.0, "grade_label": "B", "class_average": 81.0},
                {"id": "ar_15", "subject": "Data Structures", "assessment_type": "Quiz 2", "assessment_date": "2026-09-02", "score": 74.0, "max_score": 100.0, "grade_label": "C", "class_average": 75.0},
                {"id": "ar_16", "subject": "Data Structures", "assessment_type": "Midterm Exam", "assessment_date": "2026-09-14", "score": 71.0, "max_score": 100.0, "grade_label": "C", "class_average": 74.0}
            ]
        }

        # Seed records for all students
        for s in students_data:
            s_id = s["id"]
            if s_id in academic_records_map:
                records = academic_records_map[s_id]
            else:
                score_base = s["academic_score"]
                records = [
                    {"id": f"ar_{s_id}_1", "subject": "Data Structures", "assessment_type": "Quiz 1", "assessment_date": "2026-08-10", "score": min(100.0, score_base + 2.0), "max_score": 100.0, "grade_label": "A-", "class_average": 78.0},
                    {"id": f"ar_{s_id}_2", "subject": "Data Structures", "assessment_type": "Lab Assignment 1", "assessment_date": "2026-08-22", "score": min(100.0, score_base + 1.0), "max_score": 100.0, "grade_label": "B+", "class_average": 81.0},
                    {"id": f"ar_{s_id}_3", "subject": "Data Structures", "assessment_type": "Quiz 2", "assessment_date": "2026-09-02", "score": max(45.0, score_base - 1.0), "max_score": 100.0, "grade_label": "B", "class_average": 75.0},
                    {"id": f"ar_{s_id}_4", "subject": "Data Structures", "assessment_type": "Midterm Exam", "assessment_date": "2026-09-14", "score": score_base, "max_score": 100.0, "grade_label": "B", "class_average": 74.0}
                ]
            for r in records:
                db.add(AcademicRecord(
                    id=r["id"],
                    student_id=s_id,
                    subject=r["subject"],
                    assessment_type=r["assessment_type"],
                    assessment_date=r["assessment_date"],
                    score=r["score"],
                    max_score=r["max_score"],
                    grade_label=r["grade_label"],
                    class_average=r["class_average"],
                    status="AVAILABLE"
                ))

        # 4. Attendance Records
        attendance_map = {
            "stu_014": [
                {"id": "att_01", "date": "2026-09-18", "status": "ABSENT", "session_name": "Lecture 14: Trees & Traversals", "notes": "Unexcused absence"},
                {"id": "att_02", "date": "2026-09-16", "status": "ABSENT", "session_name": "Lab 7: Binary Search Trees", "notes": "Unexcused absence"},
                {"id": "att_03", "date": "2026-09-14", "status": "PRESENT", "session_name": "Lecture 13: Midterm Review", "notes": None},
                {"id": "att_04", "date": "2026-09-11", "status": "LATE", "session_name": "Lecture 12: Stacks & Queues", "notes": "Arrived 20 mins late"},
                {"id": "att_05", "date": "2026-09-09", "status": "ABSENT", "session_name": "Lab 6: Linked List Implementations", "notes": "Unexcused absence"},
                {"id": "att_06", "date": "2026-09-07", "status": "PRESENT", "session_name": "Lecture 11: Complexity Analysis", "notes": None}
            ],
            "stu_002": [
                {"id": "att_07", "date": "2026-09-18", "status": "PRESENT", "session_name": "Lecture 14: Trees & Traversals", "notes": None},
                {"id": "att_08", "date": "2026-09-16", "status": "PRESENT", "session_name": "Lab 7: Binary Search Trees", "notes": None},
                {"id": "att_09", "date": "2026-09-14", "status": "PRESENT", "session_name": "Lecture 13: Midterm Review", "notes": None},
                {"id": "att_10", "date": "2026-09-11", "status": "PRESENT", "session_name": "Lecture 12: Stacks & Queues", "notes": None},
                {"id": "att_11", "date": "2026-09-09", "status": "PRESENT", "session_name": "Lab 6: Linked List Implementations", "notes": None}
            ]
        }

        for s in students_data:
            s_id = s["id"]
            if s_id in attendance_map:
                att_list = attendance_map[s_id]
            else:
                pct = s["attendance_percentage"]
                att_list = [
                    {"id": f"att_{s_id}_1", "date": "2026-09-18", "status": "PRESENT" if pct > 75 else "ABSENT", "session_name": "Lecture 14: Trees & Traversals", "notes": None},
                    {"id": f"att_{s_id}_2", "date": "2026-09-16", "status": "PRESENT", "session_name": "Lab 7: Binary Search Trees", "notes": None},
                    {"id": f"att_{s_id}_3", "date": "2026-09-14", "status": "PRESENT", "session_name": "Lecture 13: Midterm Review", "notes": None},
                    {"id": f"att_{s_id}_4", "date": "2026-09-11", "status": "PRESENT" if pct > 70 else "LATE", "session_name": "Lecture 12: Stacks & Queues", "notes": None}
                ]
            for a in att_list:
                db.add(AttendanceRecord(
                    id=a["id"],
                    student_id=s_id,
                    date=a["date"],
                    status=a["status"],
                    session_name=a["session_name"],
                    notes=a.get("notes")
                ))

        # 5. Engagement Records
        for s in students_data:
            s_id = s["id"]
            vis_status = s["data_availability"].get("vision", "AVAILABLE")
            vis_index = s["engagement_score"] if vis_status == "AVAILABLE" else None
            note = (
                "Classroom camera feed unavailable in seat zone. Status evaluated neutrally on academic and attendance signals without penalty."
                if vis_status == "DATA_UNAVAILABLE" else
                "Visual posture indicators within standard range."
            )
            eng = EngagementRecord(
                id=f"eng_{s_id}",
                student_id=s_id,
                record_date="2026-09-18",
                score_metric=s["engagement_score"],
                participation_level="HIGH" if s["engagement_score"] >= 80 else "MODERATE" if s["engagement_score"] >= 65 else "LOW",
                lms_logins_weekly=round(s["engagement_score"] / 15.0, 1),
                on_time_submissions_rate=s["engagement_score"],
                vision_engagement_index=vis_index,
                vision_status=vis_status,
                vision_note=note
            )
            db.add(eng)

        # 6. Status History
        status_histories = [
            {"id": "sh_01", "student_id": "stu_014", "previous_status": "YELLOW", "current_status": "RED", "changed_at": "2026-09-15T09:30:00Z", "reason_summary": "Midterm exam score dropped to 51% coupled with 2 consecutive unexcused lecture absences."},
            {"id": "sh_02", "student_id": "stu_014", "previous_status": "GREEN", "current_status": "YELLOW", "changed_at": "2026-09-03T11:00:00Z", "reason_summary": "Quiz 2 score fell below class median; attendance dipped to 74%."},
            {"id": "sh_03", "student_id": "stu_002", "previous_status": None, "current_status": "GREEN", "changed_at": "2026-08-10T08:00:00Z", "reason_summary": "Initial assessment and onboarding complete; steady high performance verified."},
            {"id": "sh_04", "student_id": "stu_006", "previous_status": "YELLOW", "current_status": "GREEN", "changed_at": "2026-09-16T14:00:00Z", "reason_summary": "Consolidated recovery verified: Midterm score rose to 88% with sustained 100% attendance streak."},
            {"id": "sh_05", "student_id": "stu_006", "previous_status": "RED", "current_status": "YELLOW", "changed_at": "2026-09-04T10:15:00Z", "reason_summary": "Quiz 2 score improved to 82%; attended all remedial lab tutoring sessions."},
            {"id": "sh_06", "student_id": "stu_006", "previous_status": "GREEN", "current_status": "RED", "changed_at": "2026-08-12T09:00:00Z", "reason_summary": "Initial Quiz 1 dip to 58% combined with 3 unexcused early absences."},
            {"id": "sh_07", "student_id": "stu_009", "previous_status": "GREEN", "current_status": "YELLOW", "changed_at": "2026-09-12T16:20:00Z", "reason_summary": "Early monitoring triggered: Attendance fell from 88% to 72% over consecutive sessions."}
        ]
        for sh in status_histories:
            db.add(StatusHistory(
                id=sh["id"],
                student_id=sh["student_id"],
                previous_status=sh["previous_status"],
                current_status=sh["current_status"],
                changed_at=sh["changed_at"],
                reason_summary=sh["reason_summary"]
            ))

        # Default initial status history for remaining students
        seeded_hist_students = {sh["student_id"] for sh in status_histories}
        for s in students_data:
            if s["id"] not in seeded_hist_students:
                db.add(StatusHistory(
                    id=f"sh_{s['id']}_init",
                    student_id=s["id"],
                    previous_status=None,
                    current_status=s["current_status"],
                    changed_at="2026-08-15T09:00:00Z",
                    reason_summary=f"Initial baseline status established as {s['current_status']}."
                ))

        # 7. Contributing Factors / SHAP Explanations
        factors_map = {
            "stu_014": [
                {"id": "cf_01", "name": "Midterm Exam Performance Drop", "key": "academic_delta_midterm", "val": "-31% vs Quiz 1", "shap": 0.32, "dir": "INCREASES_RISK", "desc": "Significant downward trend from 82% on Quiz 1 down to 51% on Midterm assessment.", "avail": "AVAILABLE"},
                {"id": "cf_02", "name": "Recent Attendance Consistency", "key": "attendance_consecutive_absent", "val": "2 consecutive absences", "shap": 0.28, "dir": "INCREASES_RISK", "desc": "Attendance dropped to 61.5% with 2 unexcused absences in the last week.", "avail": "AVAILABLE"},
                {"id": "cf_03", "name": "Digital Coursework Activity", "key": "lms_submission_rate", "val": "50% on-time", "shap": 0.12, "dir": "INCREASES_RISK", "desc": "Portal submissions indicate overdue coursework in the last two modules.", "avail": "AVAILABLE"},
                {"id": "cf_04", "name": "Classroom Vision Sensor", "key": "vision_pose_score", "val": None, "shap": 0.0, "dir": "NEUTRAL", "desc": "Camera sensor unavailable. Factor imputed to neutral baseline to ensure zero negative bias.", "avail": "DATA_UNAVAILABLE"}
            ],
            "stu_002": [
                {"id": "cf_05", "name": "Assessment Consistency", "key": "academic_average", "val": "92.1% average", "shap": -0.38, "dir": "DECREASES_RISK", "desc": "Consistent top-quartile performance across all quizzes and assignments.", "avail": "AVAILABLE"},
                {"id": "cf_06", "name": "Attendance Consistency", "key": "attendance_rate", "val": "94.5% attendance", "shap": -0.29, "dir": "DECREASES_RISK", "desc": "Reliable class presence with zero unexcused absences.", "avail": "AVAILABLE"},
                {"id": "cf_07", "name": "Classroom Vision Sensor", "key": "vision_pose_score", "val": None, "shap": 0.0, "dir": "NEUTRAL", "desc": "Camera feed unavailable. Neutral attribution applied — student remains in GREEN status.", "avail": "DATA_UNAVAILABLE"}
            ],
            "stu_006": [
                {"id": "cf_08", "name": "Positive Academic Recovery", "key": "academic_delta_recent", "val": "+30% score rise", "shap": -0.35, "dir": "DECREASES_RISK", "desc": "Remarkable improvement from 58% on Quiz 1 up to 88% on Midterm assessment.", "avail": "AVAILABLE"},
                {"id": "cf_09", "name": "Restored Attendance Routine", "key": "attendance_streak", "val": "100% last 3 weeks", "shap": -0.22, "dir": "DECREASES_RISK", "desc": "Perfect lecture and lab attendance following academic counseling check-in.", "avail": "AVAILABLE"}
            ],
            "stu_009": [
                {"id": "cf_10", "name": "Recent Attendance Decline", "key": "attendance_rate_30d", "val": "72.4% (slipping)", "shap": 0.26, "dir": "INCREASES_RISK", "desc": "Attendance has fallen below the 80% guideline over the past fortnight.", "avail": "AVAILABLE"},
                {"id": "cf_11", "name": "Baseline Academic Foundation", "key": "academic_cumulative", "val": "75.0% average", "shap": -0.15, "dir": "DECREASES_RISK", "desc": "Current assessment scores demonstrate solid subject grasp despite attendance dip.", "avail": "AVAILABLE"}
            ]
        }

        for s in students_data:
            s_id = s["id"]
            pred_id = f"pred_{s_id}"
            pred = Prediction(
                id=pred_id,
                student_id=s_id,
                predicted_status=s["current_status"],
                risk_score=s["risk_score"],
                confidence_score=0.89,
                model_version="xgboost_oulad_baseline_v1",
                feature_snapshot={
                    "academic_score": s["academic_score"],
                    "attendance_percentage": s["attendance_percentage"],
                    "engagement_score": s["engagement_score"]
                },
                quality_status="AVAILABLE"
            )
            db.add(pred)

            f_list = factors_map.get(s_id, [
                {"id": f"cf_{s_id}_acad", "name": "Assessment Score Average", "key": "academic_score", "val": f"{s['academic_score']}%", "shap": 0.25 if s["current_status"] == "RED" else 0.10 if s["current_status"] == "YELLOW" else -0.22, "dir": "INCREASES_RISK" if s["current_status"] != "GREEN" else "DECREASES_RISK", "desc": f"Student maintains a {s['academic_score']}% aggregate score across all core assessments.", "avail": "AVAILABLE"},
                {"id": f"cf_{s_id}_att", "name": "Attendance Consistency", "key": "attendance_rate", "val": f"{s['attendance_percentage']}%", "shap": 0.20 if s["attendance_percentage"] < 75 else -0.18, "dir": "INCREASES_RISK" if s["attendance_percentage"] < 75 else "DECREASES_RISK", "desc": f"Cumulative attendance recorded at {s['attendance_percentage']}%.", "avail": "AVAILABLE"}
            ])

            for f in f_list:
                db.add(PredictionFactor(
                    id=f["id"],
                    prediction_id=pred_id,
                    factor_name=f["name"],
                    feature_key=f["key"],
                    feature_value=str(f["val"]) if f["val"] is not None else None,
                    shap_value=f["shap"],
                    direction=f["dir"],
                    description=f["desc"],
                    data_availability=f["avail"]
                ))

        # 8. Faculty Alerts
        alerts_data = [
            {
                "id": "alt_01",
                "student_id": "stu_014",
                "student_name": "Jane Doe",
                "student_code": "ST014",
                "alert_type": "STATUS_DEGRADATION",
                "severity": "CRITICAL",
                "title": "Status Shift: Requires Attention (RED)",
                "message": "Jane Doe moved from YELLOW to RED following a midterm score drop to 51% and 2 consecutive unexcused absences.",
                "timestamp": "2026-09-15T09:30:00Z",
                "is_read": False
            },
            {
                "id": "alt_02",
                "student_id": "stu_009",
                "student_name": "Aria Patel",
                "student_code": "ST009",
                "alert_type": "STATUS_DEGRADATION",
                "severity": "WARNING",
                "title": "Status Shift: Needs Monitoring (YELLOW)",
                "message": "Aria Patel transitioned to YELLOW due to an attendance drop from 88% to 72% across recent lab modules.",
                "timestamp": "2026-09-12T16:20:00Z",
                "is_read": False
            },
            {
                "id": "alt_03",
                "student_id": "stu_006",
                "student_name": "Marcus Vance",
                "student_code": "ST006",
                "alert_type": "STATUS_RECOVERY",
                "severity": "INFO",
                "title": "Positive Recovery: Stable (GREEN)",
                "message": "Marcus Vance improved to GREEN status and climbed 5 rank positions following strong midterm results (88%).",
                "timestamp": "2026-09-16T14:00:00Z",
                "is_read": True
            },
            {
                "id": "alt_04",
                "student_id": "stu_002",
                "student_name": "Liam Chen",
                "student_code": "ST002",
                "alert_type": "DATA_ANOMALY",
                "severity": "INFO",
                "title": "Data Availability: Camera Feed Offline",
                "message": "Classroom camera sensor offline for Liam Chen seat zone. Model continues running neutrally without risk penalty.",
                "timestamp": "2026-09-17T08:15:00Z",
                "is_read": True
            },
            {
                "id": "alt_05",
                "student_id": "stu_012",
                "student_name": "Tariq Johnson",
                "student_code": "ST012",
                "alert_type": "STATUS_DEGRADATION",
                "severity": "WARNING",
                "title": "Status Shift: Requires Attention (RED)",
                "message": "Tariq Johnson slipped into RED status due to declining quiz performance and incomplete homework modules.",
                "timestamp": "2026-09-13T11:45:00Z",
                "is_read": False
            }
        ]

        for alt in alerts_data:
            db.add(Alert(
                id=alt["id"],
                student_id=alt["student_id"],
                student_name=alt["student_name"],
                student_code=alt["student_code"],
                alert_type=alt["alert_type"],
                severity=alt["severity"],
                title=alt["title"],
                message=alt["message"],
                timestamp=alt["timestamp"],
                is_read=alt["is_read"]
            ))

        db.commit()
        print(f"Successfully seeded database with {len(students_data)} students, faculty user, academic/attendance records, and alerts.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
