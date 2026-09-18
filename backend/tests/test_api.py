import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.seed_data import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    seed_database()

@pytest.fixture
def client():
    return TestClient(app)

def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "model_loader" in data
    assert data["model_loader"]["is_loaded"] is False # Original model files not present per spec

def test_auth_login_and_me(client):
    login_res = client.post("/api/auth/login", json={
        "email": "prof.smith@university.edu",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    auth_data = login_res.json()
    assert "token" in auth_data
    assert auth_data["user"]["email"] == "prof.smith@university.edu"
    assert auth_data["user"]["fullName"] == "Dr. Sarah Smith"

    token = auth_data["token"]
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["id"] == "usr_sarah_smith"

def test_dashboard_summary(client):
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["totalStudents"] == 14
    assert data["statusDistribution"]["GREEN"] == 7
    assert data["statusDistribution"]["YELLOW"] == 4
    assert data["statusDistribution"]["RED"] == 3
    assert len(data["urgentStudents"]) >= 3
    assert len(data["topPerformers"]) == 5
    assert len(data["recentAlerts"]) > 0

def test_students_roster_and_filters(client):
    # All students
    res = client.get("/api/students")
    assert res.status_code == 200
    students = res.json()
    assert len(students) == 14

    # Status filter
    red_res = client.get("/api/students?status=RED")
    assert red_res.status_code == 200
    reds = red_res.json()
    assert len(reds) == 3
    assert all(s["currentStatus"] == "RED" for s in reds)

    # Search filter
    search_res = client.get("/api/students?search=Sophia")
    assert search_res.status_code == 200
    assert len(search_res.json()) == 1
    assert search_res.json()[0]["studentCode"] == "ST001"

def test_student_360_profile(client):
    res = client.get("/api/students/stu_014")
    assert res.status_code == 200
    data = res.json()
    assert data["student"]["fullName"] == "Jane Doe"
    assert data["student"]["currentStatus"] == "RED"
    assert len(data["academicRecords"]) == 4
    assert len(data["attendanceRecords"]) >= 4
    assert data["engagement"]["overallScore"] == 50.0
    assert data["engagement"]["visionStatus"] == "DATA_UNAVAILABLE"
    assert len(data["contributingFactors"]) >= 3
    assert len(data["statusHistory"]) >= 2
    assert len(data["rankHistory"]) == 4

def test_student_sub_endpoints(client):
    acad = client.get("/api/students/stu_002/academic")
    assert acad.status_code == 200
    assert len(acad.json()) == 4

    att = client.get("/api/students/stu_002/attendance")
    assert att.status_code == 200
    assert len(att.json()) >= 4

    eng = client.get("/api/students/stu_002/engagement")
    assert eng.status_code == 200
    assert eng.json()["visionStatus"] == "DATA_UNAVAILABLE"

    hist = client.get("/api/students/stu_006/history")
    assert hist.status_code == 200
    assert len(hist.json()) >= 3

def test_predictions_and_shap_explanations(client):
    pred_res = client.post("/api/predictions", json={"studentId": "stu_014"})
    assert pred_res.status_code == 200
    pred = pred_res.json()
    assert pred["studentId"] == "stu_014"
    assert pred["predictedStatus"] == "RED"
    assert "riskScore" in pred
    assert len(pred["contributingFactors"]) >= 3

    # Explanation endpoint
    exp_res = client.get(f"/api/predictions/{pred['predictionId']}/explanation")
    assert exp_res.status_code == 200
    exp = exp_res.json()
    assert len(exp["factors"]) >= 3
    assert any("academic" in f["featureKey"] for f in exp["factors"])

def test_alerts_workflow(client):
    alerts_res = client.get("/api/alerts")
    assert alerts_res.status_code == 200
    alerts = alerts_res.json()
    assert len(alerts) >= 5

    # Mark as read
    read_res = client.post("/api/alerts/alt_01/read")
    assert read_res.status_code == 200
    assert read_res.json()["success"] is True

def test_attendance_and_academic_uploads(client):
    # CSV attendance upload
    att_csv = "student_code,date,status,session_name\nST001,2026-09-20,PRESENT,Lecture 15\nST014,2026-09-20,PRESENT,Lecture 15\n"
    res_att = client.post(
        "/api/attendance/upload",
        files={"file": ("attendance.csv", att_csv.encode("utf-8"), "text/csv")}
    )
    assert res_att.status_code == 200
    assert res_att.json()["acceptedRows"] == 2

    # CSV academic upload
    acad_csv = "student_code,subject,assessment_type,assessment_date,score,max_score\nST014,Data Structures,Quiz 3,2026-09-21,75,100\n"
    res_acad = client.post(
        "/api/academic/upload",
        files={"file": ("grades.csv", acad_csv.encode("utf-8"), "text/csv")}
    )
    assert res_acad.status_code == 200
    assert res_acad.json()["acceptedRows"] == 1

def test_vision_endpoints(client):
    # Status
    status_res = client.get("/api/vision/status")
    assert status_res.status_code == 200
    assert status_res.json()["cameraStatus"] == "ONLINE"
    assert len(status_res.json()["simulatedDetections"]) >= 5

    # Analyze dummy video frame
    dummy_frame = b"\x00\x01\x02\x03fakevideocontent"
    analyze_res = client.post(
        "/api/vision/analyze",
        files={"file": ("test_frame.mp4", dummy_frame, "video/mp4")}
    )
    assert analyze_res.status_code == 200
    data = analyze_res.json()
    assert data["status"] == "completed"
    assert len(data["students"]) >= 4
