from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="FACULTY") # FACULTY, ADMIN, STUDENT
    department = Column(String(100), default="Computer Science & Engineering")
    assigned_classes = Column(JSON, default=list) # List of class names
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Student(Base):
    __tablename__ = "students"

    id = Column(String(50), primary_key=True, index=True)
    student_code = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    class_name = Column(String(100), default="CS-101 Sec A")
    section = Column(String(10), default="A")
    avatar_url = Column(String(255), nullable=True)

    # Status & Risk
    current_status = Column(String(10), default="GREEN") # GREEN, YELLOW, RED
    risk_score = Column(Float, default=0.15) # 0.0 to 1.0
    trend = Column(String(20), default="STABLE") # IMPROVING, STABLE, DECLINING

    # Core Metrics (0 - 100)
    academic_score = Column(Float, default=75.0)
    attendance_percentage = Column(Float, default=85.0)
    engagement_score = Column(Float, default=80.0)

    # Ranking
    current_rank = Column(Integer, default=1)
    previous_rank = Column(Integer, default=1)
    best_rank = Column(Integer, default=1)
    rank_change = Column(Integer, default=0)

    # Data Availability Flags (JSON)
    # { academic: 'AVAILABLE', attendance: 'AVAILABLE', engagement: 'AVAILABLE', vision: 'AVAILABLE' }
    data_availability = Column(JSON, default=dict)
    last_evaluated = Column(DateTime, default=datetime.utcnow)

    # Relationships
    academic_records = relationship("AcademicRecord", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("AttendanceRecord", back_populates="student", cascade="all, delete-orphan")
    engagement_records = relationship("EngagementRecord", back_populates="student", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="student", cascade="all, delete-orphan")
    status_history = relationship("StatusHistory", back_populates="student", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="student", cascade="all, delete-orphan")

class AcademicRecord(Base):
    __tablename__ = "academic_records"

    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    subject = Column(String(100), default="Data Structures")
    assessment_type = Column(String(50), nullable=False) # Quiz 1, Midterm, Lab 1, etc.
    assessment_date = Column(String(30), nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, default=100.0)
    grade_label = Column(String(10), default="B")
    class_average = Column(Float, default=75.0)
    status = Column(String(30), default="AVAILABLE") # AVAILABLE, DATA_UNAVAILABLE

    student = relationship("Student", back_populates="academic_records")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    date = Column(String(30), nullable=False)
    status = Column(String(20), nullable=False) # PRESENT, ABSENT, LATE, EXCUSED
    session_name = Column(String(100), default="Lecture")
    notes = Column(Text, nullable=True)

    student = relationship("Student", back_populates="attendance_records")

class EngagementRecord(Base):
    __tablename__ = "engagement_records"

    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    record_date = Column(String(30), nullable=False)
    score_metric = Column(Float, default=75.0)
    participation_level = Column(String(20), default="MODERATE") # HIGH, MODERATE, LOW
    lms_logins_weekly = Column(Float, default=4.0)
    on_time_submissions_rate = Column(Float, default=80.0)
    vision_engagement_index = Column(Float, nullable=True)
    vision_status = Column(String(30), default="AVAILABLE") # AVAILABLE, DATA_UNAVAILABLE, LOW_CONFIDENCE
    vision_note = Column(Text, nullable=True)

    student = relationship("Student", back_populates="engagement_records")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    prediction_date = Column(DateTime, default=datetime.utcnow)
    predicted_status = Column(String(10), nullable=False) # GREEN, YELLOW, RED
    risk_score = Column(Float, nullable=False)
    confidence_score = Column(Float, default=0.85)
    model_version = Column(String(50), default="xgboost_oulad_v1")
    feature_snapshot = Column(JSON, default=dict)
    quality_status = Column(String(30), default="AVAILABLE")

    student = relationship("Student", back_populates="predictions")
    factors = relationship("PredictionFactor", back_populates="prediction", cascade="all, delete-orphan")

class PredictionFactor(Base):
    __tablename__ = "prediction_factors"

    id = Column(String(50), primary_key=True, index=True)
    prediction_id = Column(String(50), ForeignKey("predictions.id"), nullable=False, index=True)
    factor_name = Column(String(150), nullable=False)
    feature_key = Column(String(100), nullable=False)
    feature_value = Column(String(50), nullable=True)
    shap_value = Column(Float, nullable=False)
    direction = Column(String(30), nullable=False) # INCREASES_RISK, DECREASES_RISK, NEUTRAL
    description = Column(Text, nullable=False)
    data_availability = Column(String(30), default="AVAILABLE")

    prediction = relationship("Prediction", back_populates="factors")

class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    previous_status = Column(String(10), nullable=True)
    current_status = Column(String(10), nullable=False)
    changed_at = Column(String(50), nullable=False)
    reason_summary = Column(Text, nullable=False)
    source_prediction_id = Column(String(50), nullable=True)

    student = relationship("Student", back_populates="status_history")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    student_name = Column(String(100), nullable=False)
    student_code = Column(String(50), nullable=False)
    alert_type = Column(String(50), default="STATUS_DEGRADATION") # STATUS_DEGRADATION, STATUS_RECOVERY, DATA_ANOMALY
    severity = Column(String(20), default="WARNING") # CRITICAL, WARNING, INFO
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(String(50), nullable=False)
    is_read = Column(Boolean, default=False)

    student = relationship("Student", back_populates="alerts")

class VideoAnalysis(Base):
    __tablename__ = "video_analyses"

    id = Column(String(50), primary_key=True, index=True)
    video_filename = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="PROCESSING") # PROCESSING, COMPLETED, FAILED
    students_detected = Column(Integer, default=0)
    analysis_duration_sec = Column(Float, default=0.0)
    average_engagement_index = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    behaviour_summary = Column(JSON, default=dict) # {"attentive": 0, "talking": 0, "phone_usage": 0, "sleeping": 0, "unknown": 0}
    students_detections = Column(JSON, default=list) # List of detected student records
    data_quality = Column(String(30), default="VALID")
    processing_warnings = Column(JSON, default=list)
