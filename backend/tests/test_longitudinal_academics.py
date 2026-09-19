import pytest
from fastapi.testclient import TestClient

from app.database import SessionLocal, init_db
from app.main import app
from app.models.db_models import AcademicRecord, Prediction, Student
from app.seed_data import seed_database


@pytest.fixture(scope="module", autouse=True)
def database_setup():
    init_db()
    seed_database()


@pytest.fixture
def client():
    return TestClient(app)


def academic_csv(score: int, year: str = "2099-00", semester: str = "Semester 1") -> bytes:
    return (
        "student_code,academic_year,semester,subject,assessment_type,assessment_date,score,max_score\n"
        f"ST001,{year},{semester},Longitudinal Test,Midterm,2099-01-15,{score},100\n"
    ).encode("utf-8")


def test_longitudinal_academic_records_and_upsert(client):
    db = SessionLocal()
    original_academic_score = db.query(Student).filter(Student.student_code == "ST001").one().academic_score
    try:
        first = client.post(
            "/api/academic/upload",
            files={"file": ("semester-1.csv", academic_csv(70), "text/csv")},
        )
        second = client.post(
            "/api/academic/upload",
            files={
                "file": (
                    "semester-2.csv",
                    academic_csv(90, semester="Semester 2"),
                    "text/csv",
                )
            },
        )
        duplicate = client.post(
            "/api/academic/upload",
            files={
                "file": (
                    "semester-2-duplicate.csv",
                    academic_csv(90, semester="Semester 2"),
                    "text/csv",
                )
            },
        )
        corrected = client.post(
            "/api/academic/upload",
            files={
                "file": (
                    "semester-2-correction.csv",
                    academic_csv(95, semester="Semester 2"),
                    "text/csv",
                )
            },
        )

        assert first.status_code == second.status_code == duplicate.status_code == corrected.status_code == 200

        semester_one = client.get(
            "/api/students/ST001/academic",
            params={"academic_year": "2099-00", "semester": "Semester 1"},
        )
        semester_two = client.get(
            "/api/students/ST001/academic",
            params={"academic_year": "2099-00", "semester": "Semester 2"},
        )
        history = client.get("/api/students/ST001/academic")

        assert [(r["semester"], r["score"]) for r in semester_one.json()] == [("Semester 1", 70.0)]
        assert [(r["semester"], r["score"]) for r in semester_two.json()] == [("Semester 2", 95.0)]
        longitudinal = [
            r for r in history.json()
            if r["subject"] == "Longitudinal Test"
        ]
        assert {(r["academicYear"], r["semester"], r["score"]) for r in longitudinal} == {
            ("2099-00", "Semester 1", 70.0),
            ("2099-00", "Semester 2", 95.0),
        }

        db.expire_all()
        rows = db.query(AcademicRecord).filter(
            AcademicRecord.student_id == "stu_001",
            AcademicRecord.subject == "Longitudinal Test",
        ).all()
        assert len(rows) == 2
        assert {row.score for row in rows} == {70.0, 95.0}
    finally:
        db.query(AcademicRecord).filter(
            AcademicRecord.student_id == "stu_001",
            AcademicRecord.subject == "Longitudinal Test",
        ).delete(synchronize_session=False)
        student = db.query(Student).filter(Student.student_code == "ST001").one()
        student.academic_score = original_academic_score
        db.commit()
        db.close()


def test_current_semester_prediction_uses_selected_academic_records(client):
    db = SessionLocal()
    original_academic_score = db.query(Student).filter(Student.student_code == "ST001").one().academic_score
    try:
        response = client.post(
            "/api/academic/upload",
            files={"file": ("semester-current.csv", academic_csv(88), "text/csv")},
        )
        assert response.status_code == 200

        prediction = client.post(
            "/api/predictions",
            json={
                "studentId": "ST001",
                "academicYear": "2099-00",
                "semester": "Semester 1",
            },
        )
        assert prediction.status_code == 200

        db.expire_all()
        saved_prediction = db.query(Prediction).filter(
            Prediction.id == prediction.json()["predictionId"]
        ).one()
        assert saved_prediction.feature_snapshot["academic_score_mean"] == 88.0
        db.delete(saved_prediction)
        db.commit()
    finally:
        db.query(AcademicRecord).filter(
            AcademicRecord.student_id == "stu_001",
            AcademicRecord.subject == "Longitudinal Test",
        ).delete(synchronize_session=False)
        student = db.query(Student).filter(Student.student_code == "ST001").one()
        student.academic_score = original_academic_score
        db.commit()
        db.close()
