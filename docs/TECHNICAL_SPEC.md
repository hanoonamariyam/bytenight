# Technical Specification Document

## Project: Explainable Student Performance & Early Support System (ByteNight)

---

## 1. Executive Summary & Hackathon Scope

This document specifies the complete technical architecture, data pipelines, API contracts, database schemas, and engineering protocols for the **Explainable Student Performance & Early Support System**. Designed for a 24-hour hackathon execution, this specification translates the product requirements in [`docs/PRD.md`](file:///c:/Users/Hp/Desktop/ByteNight/docs/PRD.md) into an actionable, reliable, and deployable implementation blueprint.

### Core Architecture Philosophy
- **Support, Not Surveillance**: The system empowers educators to identify struggling students early. Camera signals and automated analytics serve strictly as auxiliary, non-punitive support indicators.
- **Explainability Over Black-Box AI**: Predictions must produce human-readable, quantifiable feature attributions (SHAP values).
- **Graceful Degradation & Data Neutrality**: Missing records or hardware camera dropouts are explicitly flagged as `"DATA_UNAVAILABLE"` and must **never** degrade a student's status to Yellow or Red.
- **Hackathon-Practical Pragmatism**: Modular monolith design. Fast in-process inference, zero distributed queue overhead, reproducible demo seed data, and a clean decoupled React + FastAPI stack.

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale & Hackathon Fit |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React (Vite) | 18.x / 19.x | Ultra-fast HMR, lightweight bundling, industry standard for interactive dashboards. |
| **Language (UI)** | TypeScript | 5.x | Enforces strict API contract types, eliminating runtime undefined errors during live demos. |
| **Styling & Components** | Tailwind CSS + Lucide React | 3.4+ / 0.4+ | Rapid utility-first UI development with clean, accessible iconography and minimal boilerplate. |
| **Data Visualization** | Recharts | 2.12+ | Declarative React charting library for academic performance trends, attendance, and SHAP feature impact. |
| **State & Data Fetching** | TanStack Query (React Query) | 5.x | Automatic caching, background refetching, and declarative loading/error/empty state management. |
| **Backend Framework** | FastAPI (Python) | 0.110+ | High-performance asynchronous REST framework with native Pydantic v2 schemas and automatic OpenAPI docs. |
| **Language (Backend)** | Python | 3.11+ | First-class ecosystem for data science, ML (Scikit-Learn/LightGBM), and Computer Vision (OpenCV/MediaPipe). |
| **ORM & Database Client** | SQLAlchemy + asyncpg / psycopg2 | 2.0+ | Modern type-safe ORM supporting PostgreSQL in production and SQLite for instant offline local development. |
| **Database** | PostgreSQL | 15+ / 16+ | Robust relational database for ACID transactions, JSONB querying, and structured historical tracking (Neon/Supabase/Render). |
| **Authentication** | OAuth2 Bearer + JWT (`pyjwt` / `python-jose`) + `passlib[bcrypt]` | Latest | Stateless token authentication with role-based claims (`ADMIN`, `FACULTY`, `STUDENT`). |
| **Machine Learning** | Scikit-learn + LightGBM | 1.4+ / 4.0+ | Fast tabular model training and sub-millisecond inference with battle-tested classification reliability. |
| **Explainability Engine**| SHAP (SHapley Additive exPlanations) | 0.44+ | Industry gold standard for local feature attribution (`TreeExplainer` for tree models). |
| **Computer Vision** | OpenCV (Headless) + MediaPipe | 4.9+ / 0.10+ | Lightweight frame analysis for face mesh, gaze/head pose estimation, and presence detection without GPU requirements. |
| **Containerization & CI**| Docker + GitHub Actions | Latest | Multi-stage Docker builds and automated lint/test validation. |

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Browser)"]
        UI["React 18 SPA (Vite + TS + Tailwind)"]
        Dashboard["Faculty Dashboard & Alerts"]
        Profile["Student Detail & SHAP Explainability"]
        VisionUI["Live Vision & Quality Monitor"]
    end

    subgraph APILayer ["API & Business Logic (FastAPI Monolith)"]
        Gateway["FastAPI App Router (/api/v1)"]
        AuthMiddleware["JWT Auth & RBAC Middleware"]
        
        subgraph Services ["Core Modular Services"]
            AuthSvc["Auth Service"]
            StudentSvc["Student & Class Service"]
            PredictSvc["Prediction & Risk Service"]
            ExplainSvc["SHAP Explainability Service"]
            VisionSvc["Vision Processing Service"]
            AlertSvc["Alert & Status Engine"]
        end
    end

    subgraph Engines ["AI / Analytics Pipeline"]
        Preproc["Feature Pipeline & Imputer"]
        MLModel["XGBoost / LightGBM Classifier"]
        SHAPEngine["TreeSHAP Explainer"]
        CVEngine["MediaPipe Pose/Face Pipeline"]
    end

    subgraph DataStore ["Persistence Layer"]
        PostgreSQL[("PostgreSQL 15 Database")]
        DemoSeeds[("Demo Seed Fixtures (JSON/CSV)")]
    end

    UI --> Gateway
    Gateway --> AuthMiddleware
    AuthMiddleware --> Services

    PredictSvc --> Preproc
    Preproc --> MLModel
    MLModel --> SHAPEngine
    SHAPEngine --> ExplainSvc

    VisionSvc --> CVEngine
    CVEngine --> VisionSvc

    StudentSvc --> PostgreSQL
    AuthSvc --> PostgreSQL
    PredictSvc --> PostgreSQL
    AlertSvc --> PostgreSQL
    DemoSeeds -.-> PostgreSQL
```

### 3.2 Architectural Principles & Constraints
1. **Monolithic Modularity**: Backend code is organized into clear domain packages (`auth`, `students`, `predictions`, `vision`, `alerts`). All run within a single FastAPI process for low memory usage and trivial deployment.
2. **Synchronous Fast Inference with Background Tasks**: Tabular model inference and SHAP computations take `< 15ms` per student, executed in-request. Heavy vision batch processing is offloaded to FastAPI `BackgroundTasks`.
3. **Data Availability Isolation**: Every analytical signal carries a triple tuple: `(value, status, timestamp)` where `status ∈ {VALID, UNAVAILABLE, STALE, LOW_CONFIDENCE}`.

---

## 4. Frontend Architecture

### 4.1 UI Component Tree & Routing

```
frontend/src/
├── routes/
│   ├── /login                     -> LoginPage
│   ├── /dashboard                 -> FacultyDashboardPage
│   ├── /students                  -> StudentRosterPage (Search & Multi-filter)
│   ├── /students/:id              -> StudentProfilePage (Detailed 360 view)
│   │   ├── #academic              -> AcademicTrendTab
│   │   ├── #attendance            -> AttendanceOverviewTab
│   │   ├── #engagement            -> EngagementSignalsTab
│   │   ├── #explainability        -> SHAPExplanationTab
│   │   └── #timeline              -> StatusHistoryTimelineTab
│   ├── /vision                    -> ClassroomVisionPage (Camera feed & quality diagnostics)
│   ├── /alerts                    -> FacultyAlertsCenterPage
│   └── /admin                     -> AdminManagementPage (Roster, Classes, Data Controls)
```

```mermaid
graph TD
    App["App Root & Layout"]
    AuthContext["Auth Context Provider"]
    QueryClient["React Query Client"]
    Navbar["Top Navigation Bar (Role Badge, Alerts Counter)"]
    
    App --> AuthContext
    App --> QueryClient
    App --> Navbar
    
    Navbar --> DPage["Dashboard (/dashboard)"]
    Navbar --> RPage["Student Roster (/students)"]
    Navbar --> SDetail["Student Detail (/students/:id)"]
    Navbar --> VPage["Vision Studio (/vision)"]
    Navbar --> APage["Alerts Center (/alerts)"]

    SDetail --> SHeader["Status Banner (Green/Yellow/Red + Availability Chip)"]
    SDetail --> TabNav["Tab Navigation"]
    TabNav --> T1["Academic Trend (Recharts Area/Line)"]
    TabNav --> T2["Attendance Consistency Gauge & Calendar"]
    TabNav --> T3["Engagement & Vision Indicators"]
    TabNav --> T4["SHAP Factors Bar Chart"]
    TabNav --> T5["Status Change Timeline (Hysteresis Events)"]
```

### 4.2 State Management Strategy
- **Authentication State**: Global React Context (`AuthContext`) storing token, decoded claims, authenticated user profile, and session expiry timer.
- **Server Data Caching**: TanStack Query (`useQuery`, `useMutation`) with 60-second stale time for dashboard metrics and immediate invalidation upon status or alert mutations.
- **UI State**: Local state via React hooks for filters, active tab selection, table pagination, and modal drawers.

### 4.3 Design System & Visual Encodings
- **Status Colors**:
  - `GREEN (Stable)`: Emerald (`bg-emerald-500/10 text-emerald-600 border-emerald-500/20`)
  - `YELLOW (Needs Monitoring)`: Amber (`bg-amber-500/10 text-amber-600 border-amber-500/20`)
  - `RED (Requires Attention)`: Rose (`bg-rose-500/10 text-rose-600 border-rose-500/20`)
- **Data Availability Badges**:
  - `AVAILABLE`: Slate subdued badge (`bg-slate-100 text-slate-700`)
  - `DATA_UNAVAILABLE`: Neutral Sky/Gray badge with info icon (`bg-sky-50 text-sky-700 border-sky-200`)
  - `DEGRADED / LOW_CONFIDENCE`: Orange outline (`border-orange-300 text-orange-700`)
  - *Design Rule*: Never use Red for missing data or camera disconnections.

---

## 5. Backend & API Architecture

### 5.1 Service Layer Structure

```
backend/app/
├── core/
│   ├── config.py           # Pydantic Settings (ENV loading, JWT secrets)
│   ├── database.py         # SQLAlchemy engine and session factory
│   ├── security.py         # Passlib bcrypt hashing and JWT encoding/decoding
│   └── exceptions.py       # Custom HTTPException handlers
├── models/                 # SQLAlchemy 2.0 ORM Declarative Models
├── schemas/                # Pydantic v2 Request/Response Schemas
├── api/
│   ├── deps.py             # FastAPI dependency injections (DB session, current_user, roles)
│   └── v1/
│       ├── auth.py         # /api/auth endpoints
│       ├── dashboard.py    # /api/dashboard summary endpoints
│       ├── students.py     # /api/students endpoints (CRUD, academic, attendance)
│       ├── predictions.py  # /api/predictions & explainability endpoints
│       ├── alerts.py       # /api/alerts endpoints
│       ├── vision.py       # /api/vision frame ingestion & analysis
│       └── admin.py        # /api/admin user/class/data controls
├── services/               # Business logic decoupling
├── ml/                     # ML pipelines, feature transformations, SHAP explainers
└── vision/                 # MediaPipe pose/face engagement heuristic pipelines
```

### 5.2 API Specifications & Endpoint Contracts

#### 1. Authentication Endpoints

##### `POST /api/v1/auth/login`
- **Purpose**: Authenticate user and return JWT bearer token.
- **Request Body**:
  ```json
  {
    "username_or_email": "prof.smith@college.edu",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 43200,
    "user": {
      "user_id": "usr_9b1deb4d",
      "email": "prof.smith@college.edu",
      "full_name": "Dr. Sarah Smith",
      "role": "FACULTY",
      "assigned_classes": ["class_cs101_2026", "class_cs202_2026"]
    }
  }
  ```
- **Errors**: `401 Unauthorized` (Invalid credentials), `422 Unprocessable Entity` (Schema validation failure).

##### `GET /api/v1/auth/me`
- **Purpose**: Fetch current active session profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Same user entity as in login.
- **Errors**: `401 Unauthorized` (Expired or invalid token).

---

#### 2. Dashboard Endpoints

##### `GET /api/v1/dashboard/summary`
- **Purpose**: Return high-level KPI cards, status distributions, and urgent intervention lists for the faculty's assigned classes.
- **Query Params**: `class_id` (optional string)
- **Response (200 OK)**:
  ```json
  {
    "total_students": 48,
    "status_distribution": {
      "GREEN": 34,
      "YELLOW": 10,
      "RED": 4
    },
    "data_health": {
      "complete_profiles": 42,
      "partial_data_profiles": 6,
      "camera_coverage_active": false
    },
    "urgent_interventions": [
      {
        "student_id": "stu_01a",
        "student_code": "CS-2026-042",
        "full_name": "Jane Doe",
        "current_status": "RED",
        "previous_status": "YELLOW",
        "status_changed_at": "2026-09-17T10:15:00Z",
        "primary_trigger": "Consecutive assessment drop (-24%) and 3 unexcused absences",
        "data_availability": "AVAILABLE"
      }
    ],
    "recent_alerts_count": 3
  }
  ```

---

#### 3. Student Management Endpoints

##### `GET /api/v1/students`
- **Purpose**: Query paginated, filterable student roster.
- **Query Params**:
  - `search`: string (matches code or full_name)
  - `status`: `GREEN` | `YELLOW` | `RED` | `ALL`
  - `class_id`: string
  - `page`: integer (default 1), `limit`: integer (default 20)
- **Response (200 OK)**:
  ```json
  {
    "items": [
      {
        "student_id": "stu_01a",
        "student_code": "CS-2026-042",
        "full_name": "Jane Doe",
        "class_name": "Data Structures Section A",
        "current_status": "RED",
        "risk_score": 0.82,
        "academic_average": 58.4,
        "attendance_percentage": 71.2,
        "engagement_score": 62.0,
        "data_availability": {
          "academic": "AVAILABLE",
          "attendance": "AVAILABLE",
          "engagement": "AVAILABLE",
          "vision": "DATA_UNAVAILABLE"
        },
        "last_updated": "2026-09-18T14:30:00Z"
      }
    ],
    "total": 48,
    "page": 1,
    "limit": 20,
    "total_pages": 3
  }
  ```

##### `GET /api/v1/students/{student_id}`
- **Purpose**: Get comprehensive 360-degree student profile overview.
- **Response (200 OK)**: Complete student object including current prediction summary and data quality flags.

##### `GET /api/v1/students/{student_id}/academic`
- **Purpose**: Get time-series test scores, assignments, and course breakdown.
- **Response (200 OK)**:
  ```json
  {
    "student_id": "stu_01a",
    "overall_average": 58.4,
    "trend_direction": "DECLINING",
    "assessment_records": [
      {
        "academic_record_id": "rec_01",
        "subject": "Algorithms",
        "assessment_type": "Quiz 1",
        "assessment_date": "2026-08-15",
        "score": 82.0,
        "max_score": 100.0,
        "grade_label": "B"
      },
      {
        "academic_record_id": "rec_02",
        "subject": "Algorithms",
        "assessment_type": "Midterm Exam",
        "assessment_date": "2026-09-10",
        "score": 54.0,
        "max_score": 100.0,
        "grade_label": "D"
      }
    ],
    "data_availability": "AVAILABLE"
  }
  ```

##### `GET /api/v1/students/{student_id}/attendance`
- **Purpose**: Get detailed session attendance logs and rolling metrics.
- **Response (200 OK)**:
  ```json
  {
    "student_id": "stu_01a",
    "attendance_percentage": 71.2,
    "total_sessions": 30,
    "attended_sessions": 21,
    "unexcused_absences": 7,
    "consecutive_absent_streak": 2,
    "recent_records": [
      {"date": "2026-09-17", "status": "ABSENT", "notes": "No note provided"},
      {"date": "2026-09-15", "status": "ABSENT", "notes": "No note provided"},
      {"date": "2026-09-12", "status": "PRESENT", "notes": ""}
    ],
    "data_availability": "AVAILABLE"
  }
  ```

##### `GET /api/v1/students/{student_id}/engagement`
- **Purpose**: Get combined classroom participation and vision proxy metrics.
- **Response (200 OK)**:
  ```json
  {
    "student_id": "stu_01a",
    "engagement_score": 62.0,
    "participation_metric": "MODERATE",
    "vision_indicators": {
      "status": "DATA_UNAVAILABLE",
      "message": "Classroom camera stream is currently offline. Status is evaluated on academic and attendance signals without penalty.",
      "head_pose_alertness": null,
      "presence_ratio": null
    },
    "lms_activity": {
      "portal_logins_last_7_days": 4,
      "assignment_submissions_on_time": 0.67
    }
  }
  ```

##### `GET /api/v1/students/{student_id}/history`
- **Purpose**: Return chronological status transitions with explainable rationale.
- **Response (200 OK)**:
  ```json
  {
    "student_id": "stu_01a",
    "timeline": [
      {
        "status_history_id": "sh_03",
        "previous_status": "YELLOW",
        "current_status": "RED",
        "changed_at": "2026-09-17T10:15:00Z",
        "reason_summary": "Midterm score dropped to 54% combined with 2 consecutive unexcused absences.",
        "source_prediction_id": "pred_9021"
      },
      {
        "status_history_id": "sh_02",
        "previous_status": "GREEN",
        "current_status": "YELLOW",
        "changed_at": "2026-09-01T08:00:00Z",
        "reason_summary": "Attendance slipped below 80% threshold.",
        "source_prediction_id": "pred_8840"
      }
    ]
  }
  ```

---

#### 4. Prediction & Explainability Endpoints

##### `POST /api/v1/predictions`
- **Purpose**: Manually trigger or recalculate risk assessment for a student record.
- **Request Body**:
  ```json
  {
    "student_id": "stu_01a",
    "override_features": null
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "prediction_id": "pred_9022",
    "student_id": "stu_01a",
    "predicted_status": "RED",
    "risk_score": 0.824,
    "confidence": 0.89,
    "missing_features": ["vision_head_pose_score"],
    "created_at": "2026-09-18T17:45:00Z"
  }
  ```

##### `GET /api/v1/predictions/{prediction_id}/explanation`
- **Purpose**: Return exact SHAP feature contributions for the prediction.
- **Response (200 OK)**:
  ```json
  {
    "prediction_id": "pred_9022",
    "student_id": "stu_01a",
    "status": "RED",
    "risk_score": 0.824,
    "baseline_score": 0.280,
    "factors": [
      {
        "factor_name": "Midterm Exam Score Delta",
        "feature_key": "academic_delta_midterm",
        "feature_value": -28.0,
        "shap_value": 0.312,
        "direction": "INCREASES_RISK",
        "description": "Midterm assessment score dropped by 28% compared to initial quizzes.",
        "data_availability": "AVAILABLE"
      },
      {
        "factor_name": "Attendance Rate (Last 30 Days)",
        "feature_key": "attendance_rate_30d",
        "feature_value": 0.712,
        "shap_value": 0.245,
        "direction": "INCREASES_RISK",
        "description": "Attendance is 71.2%, significantly below class average of 88.5%.",
        "data_availability": "AVAILABLE"
      },
      {
        "factor_name": "LMS Portal Consistency",
        "feature_key": "lms_login_frequency",
        "feature_value": 4.0,
        "shap_value": -0.052,
        "direction": "DECREASES_RISK",
        "description": "Student actively logs in and accesses digital notes regularly.",
        "data_availability": "AVAILABLE"
      },
      {
        "factor_name": "Classroom Vision Engagement",
        "feature_key": "vision_pose_score",
        "feature_value": null,
        "shap_value": 0.0,
        "direction": "NEUTRAL",
        "description": "Camera feed unavailable. Feature imputed neutrally without penalizing score.",
        "data_availability": "DATA_UNAVAILABLE"
      }
    ]
  }
  ```

---

#### 5. Alerts & Notifications Endpoints

##### `GET /api/v1/alerts`
- **Purpose**: Fetch all unread and historical alerts for the faculty's classes.
- **Query Params**: `is_read`: boolean (optional), `severity`: `INFO` | `WARNING` | `CRITICAL`
- **Response (200 OK)**:
  ```json
  {
    "items": [
      {
        "alert_id": "alt_101",
        "student_id": "stu_01a",
        "student_name": "Jane Doe",
        "alert_type": "STATUS_DEGRADATION",
        "severity": "CRITICAL",
        "title": "Jane Doe shifted to RED (Requires Attention)",
        "message": "Performance trend worsened due to midterm score drop and 2 consecutive absences.",
        "is_read": false,
        "created_at": "2026-09-17T10:15:30Z",
        "source_prediction_id": "pred_9021"
      }
    ],
    "unread_count": 1
  }
  ```

##### `POST /api/v1/alerts/{alert_id}/read`
- **Purpose**: Mark an alert as acknowledged.
- **Response (200 OK)**: `{"success": true, "alert_id": "alt_101", "read_at": "2026-09-18T17:50:00Z"}`

---

#### 6. Computer Vision Endpoint

##### `POST /api/v1/vision/analyze`
- **Purpose**: Ingest video frame or observation batch, detect presence/pose landmarks, compute engagement proxy scores, and report quality health.
- **Request Body (Multipart/Form or JSON)**:
  ```json
  {
    "classroom_id": "cls_101",
    "timestamp": "2026-09-18T14:30:00Z",
    "frame_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "sensor_status": "ONLINE"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "quality_status": "VALID",
    "faces_detected": 18,
    "average_head_pose_pitch": 4.2,
    "average_head_pose_yaw": -1.8,
    "aggregated_engagement_index": 78.5,
    "data_availability_flag": "AVAILABLE",
    "processing_latency_ms": 32
  }
  ```
- **Response when Camera Fails (200 OK with Neutral State)**:
  ```json
  {
    "quality_status": "SENSOR_OFFLINE",
    "faces_detected": 0,
    "aggregated_engagement_index": null,
    "data_availability_flag": "DATA_UNAVAILABLE",
    "message": "Camera stream dropped or hardware inaccessible. Pipeline continues in neutral degraded mode."
  }
  ```

---

## 6. Database Schema (PostgreSQL / SQLAlchemy)

### 6.1 Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ CLASSES : teaches
    CLASSES ||--|{ STUDENTS : contains
    STUDENTS ||--o{ ACADEMIC_RECORDS : has
    STUDENTS ||--o{ ATTENDANCE_RECORDS : logs
    STUDENTS ||--o{ ENGAGEMENT_RECORDS : exhibits
    STUDENTS ||--o{ PREDICTIONS : receives
    STUDENTS ||--o{ STATUS_HISTORY : experiences
    STUDENTS ||--o{ ALERTS : triggers
    PREDICTIONS ||--o{ PREDICTION_FACTORS : explains
    PREDICTIONS ||--o{ STATUS_HISTORY : causes
    PREDICTIONS ||--o{ ALERTS : generates

    USERS {
        uuid user_id PK
        string email UK
        string password_hash
        string full_name
        enum role "ADMIN, FACULTY, STUDENT"
        boolean is_active
        timestamp created_at
        timestamp last_login
    }

    CLASSES {
        uuid class_id PK
        string class_code UK
        string class_name
        uuid faculty_id FK
        string semester
        int academic_year
    }

    STUDENTS {
        uuid student_id PK
        string student_code UK
        string full_name
        uuid class_id FK
        enum current_status "GREEN, YELLOW, RED"
        float current_risk_score
        timestamp created_at
        timestamp updated_at
    }

    ACADEMIC_RECORDS {
        uuid academic_record_id PK
        uuid student_id FK
        string subject
        string assessment_type
        date assessment_date
        float score
        float max_score
        string grade_label
        enum availability_status
    }

    ATTENDANCE_RECORDS {
        uuid attendance_record_id PK
        uuid student_id FK
        date session_date
        enum status "PRESENT, ABSENT, EXCUSED, LATE"
        float attendance_percentage_snapshot
        string source_type
        enum availability_status
    }

    ENGAGEMENT_RECORDS {
        uuid engagement_record_id PK
        uuid student_id FK
        date record_date
        float score_metric
        string participation_level
        float vision_head_pose_index
        enum quality_flag "VALID, UNAVAILABLE, LOW_CONFIDENCE"
    }

    PREDICTIONS {
        uuid prediction_id PK
        uuid student_id FK
        timestamp prediction_date
        enum predicted_status "GREEN, YELLOW, RED"
        float risk_score
        float confidence_score
        string model_version
        jsonb feature_snapshot
        enum quality_status
    }

    PREDICTION_FACTORS {
        uuid prediction_factor_id PK
        uuid prediction_id FK
        string factor_name
        string feature_key
        float feature_value
        float shap_value
        enum direction "INCREASES_RISK, DECREASES_RISK, NEUTRAL"
        string explanation_text
        enum availability_status
    }

    STATUS_HISTORY {
        uuid status_history_id PK
        uuid student_id FK
        enum previous_status
        enum current_status
        timestamp changed_at
        text reason_summary
        uuid source_prediction_id FK
    }

    ALERTS {
        uuid alert_id PK
        uuid student_id FK
        uuid recipient_user_id FK
        enum alert_type "STATUS_DEGRADATION, STATUS_RECOVERY, CRITICAL_DROP"
        enum severity "INFO, WARNING, CRITICAL"
        string title
        text message
        boolean is_read
        timestamp created_at
        timestamp read_at
        uuid source_prediction_id FK
    }
```

### 6.2 Table DDL Specifications & Indexing

```sql
-- Core Enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'FACULTY', 'STUDENT');
CREATE TYPE student_status AS ENUM ('GREEN', 'YELLOW', 'RED');
CREATE TYPE alert_severity AS ENUM ('INFO', 'WARNING', 'CRITICAL');
CREATE TYPE factor_direction AS ENUM ('INCREASES_RISK', 'DECREASES_RISK', 'NEUTRAL');
CREATE TYPE data_quality AS ENUM ('AVAILABLE', 'DATA_UNAVAILABLE', 'LOW_CONFIDENCE');

-- 1. Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'FACULTY',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. Classes Table
CREATE TABLE classes (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_code VARCHAR(50) UNIQUE NOT NULL,
    class_name VARCHAR(150) NOT NULL,
    faculty_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    semester VARCHAR(50) NOT NULL,
    academic_year INT NOT NULL
);
CREATE INDEX idx_classes_faculty ON classes(faculty_id);

-- 3. Students Table
CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    class_id UUID NOT NULL REFERENCES classes(class_id) ON DELETE CASCADE,
    current_status student_status NOT NULL DEFAULT 'GREEN',
    current_risk_score REAL NOT NULL DEFAULT 0.15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_status ON students(current_status);
CREATE INDEX idx_students_code ON students(student_code);

-- 4. Academic Records Table
CREATE TABLE academic_records (
    academic_record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    assessment_type VARCHAR(50) NOT NULL,
    assessment_date DATE NOT NULL,
    score REAL NOT NULL,
    max_score REAL NOT NULL DEFAULT 100.0,
    grade_label VARCHAR(10),
    data_status data_quality NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_academic_student_date ON academic_records(student_id, assessment_date DESC);
CREATE INDEX idx_academic_subject ON academic_records(subject);

-- 5. Attendance Records Table
CREATE TABLE attendance_records (
    attendance_record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- PRESENT, ABSENT, EXCUSED, LATE
    attendance_percentage_snapshot REAL,
    data_status data_quality NOT NULL DEFAULT 'AVAILABLE'
);
CREATE INDEX idx_attendance_student_date ON attendance_records(student_id, session_date DESC);

-- 6. Engagement Records Table
CREATE TABLE engagement_records (
    engagement_record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    score_metric REAL,
    participation_level VARCHAR(30),
    vision_head_pose_index REAL,
    quality_flag data_quality NOT NULL DEFAULT 'AVAILABLE',
    notes TEXT
);
CREATE INDEX idx_engagement_student_date ON engagement_records(student_id, record_date DESC);

-- 7. Predictions Table
CREATE TABLE predictions (
    prediction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    prediction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    predicted_status student_status NOT NULL,
    risk_score REAL NOT NULL,
    confidence_score REAL NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    feature_snapshot JSONB,
    quality_status data_quality NOT NULL DEFAULT 'AVAILABLE'
);
CREATE INDEX idx_predictions_student_date ON predictions(student_id, prediction_date DESC);
CREATE INDEX idx_predictions_status ON predictions(predicted_status);

-- 8. Prediction Factors Table (Explainability / SHAP)
CREATE TABLE prediction_factors (
    prediction_factor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prediction_id UUID NOT NULL REFERENCES predictions(prediction_id) ON DELETE CASCADE,
    factor_name VARCHAR(150) NOT NULL,
    feature_key VARCHAR(100) NOT NULL,
    feature_value REAL,
    shap_value REAL NOT NULL,
    direction factor_direction NOT NULL,
    explanation_text TEXT NOT NULL,
    data_availability data_quality NOT NULL DEFAULT 'AVAILABLE'
);
CREATE INDEX idx_pred_factors_prediction ON prediction_factors(prediction_id);

-- 9. Status History Table
CREATE TABLE status_history (
    status_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    previous_status student_status,
    current_status student_status NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason_summary TEXT NOT NULL,
    source_prediction_id UUID REFERENCES predictions(prediction_id) ON DELETE SET NULL
);
CREATE INDEX idx_status_history_student ON status_history(student_id, changed_at DESC);

-- 10. Alerts Table
CREATE TABLE alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    recipient_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'WARNING',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    source_prediction_id UUID REFERENCES predictions(prediction_id) ON DELETE SET NULL
);
CREATE INDEX idx_alerts_user_read ON alerts(recipient_user_id, is_read, created_at DESC);
CREATE INDEX idx_alerts_student ON alerts(student_id);
```

---

## 7. Authentication & Role-Based Access Control (RBAC)

### 7.1 Security Architecture
- **JWT Token Spec**: Signed with HMAC-SHA256 (`HS256`).
- **Token Claims**:
  ```json
  {
    "sub": "usr_9b1deb4d",
    "email": "prof.smith@college.edu",
    "role": "FACULTY",
    "classes": ["cls_101", "cls_102"],
    "exp": 1790000000,
    "iat": 1789956800
  }
  ```
- **Password Hashing**: `bcrypt` with 12 salt rounds via `passlib[bcrypt]`.
- **FastAPI Security Dependency**:
  ```python
  def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User: ...
  def require_role(allowed_roles: list[UserRole]): ...
  ```

### 7.2 RBAC Permission Matrix

| Operation / Resource | ADMIN | FACULTY | STUDENT |
| :--- | :---: | :---: | :---: |
| View Class Dashboard & Overall Roster | Yes (All) | Yes (Assigned classes only) | No |
| View Detailed Student Profile & SHAP | Yes | Yes (Assigned students only) | Self record only |
| Trigger Manual Prediction Recalculation | Yes | Yes (Assigned students only) | No |
| Read / Acknowledge Faculty Alerts | Yes | Yes (Self alerts) | No |
| Ingest Vision Camera Frames | Yes | Yes | No |
| Manage Users, Classes & Seed Roster | Yes | No | No |

---

## 8. Machine Learning & Dataset Pipeline

### 8.1 Problem Formulation & Labels
The task is framed as a supervised multi-class classification problem predicting student academic support needs:
- `Class 0 (GREEN)`: Stable performance, low risk of failure or severe academic distress.
- `Class 1 (YELLOW)`: Needs monitoring. Exhibits early decline in attendance, missed assignments, or isolated test dips.
- `Class 2 (RED)`: Requires urgent intervention. Compound risk across multiple dimensions (severe grade drops + attendance collapse).

### 8.2 Feature Engineering Specifications

| Feature Name | Type | Source | Definition & Formula |
| :--- | :--- | :--- | :--- |
| `academic_score_mean` | Float (0-100) | Academic | Rolling weighted average across all assessments to date. |
| `academic_score_delta` | Float (-100 to 100) | Academic | $\Delta = \text{Score}_{\text{recent}} - \text{Score}_{\text{baseline}}$ (detects sudden drops). |
| `failing_assessments_count` | Int ($\ge 0$) | Academic | Total count of exams/quizzes where score $< 60.0\%$. |
| `attendance_ratio_30d` | Float (0.0-1.0) | Attendance | $\frac{\text{Sessions Attended}}{\text{Total Sessions Scheduled}}$ over previous 30 days. |
| `consecutive_absent_streak` | Int ($\ge 0$) | Attendance | Uninterrupted streak of absent classes up to present. |
| `lms_login_frequency_weekly` | Float ($\ge 0$) | LMS/Engagement | Average digital portal access days per week. |
| `vision_presence_ratio` | Float (0.0-1.0) | Vision | % of class minutes student was visibly present at desk. |
| `vision_pose_alertness_index` | Float (0-100) | Vision | Head pose angle stability proxy metric (yaw/pitch within active learning cone). |
| `has_missing_academic` | Binary (0/1) | Data Quality | 1 if student has unrecorded assessment records, else 0. |
| `has_missing_attendance` | Binary (0/1) | Data Quality | 1 if attendance records are incomplete or unlogged, else 0. |
| `has_missing_vision` | Binary (0/1) | Data Quality | 1 if classroom camera is offline or occluded, else 0. |

### 8.3 Handling Missing Data & The "Never Penalize" Rule
Standard ML models (like XGBoost) can handle `NaN` inputs natively or through median imputation. However, standard models can inadvertently learn that missing camera data correlates with high risk if training data contains biased absences.

**Engineered Protective Guarantees**:
1. **Explicit Missingness Indicators**: Every domain feature has a companion `_is_missing` boolean feature.
2. **Neutral Baseline Imputation**: When vision or engagement sensors fail, missing continuous features are imputed to the **class population median** of stable students ($75.0$ for vision index), ensuring missing features yield near-zero SHAP values.
3. **Model Confidence Discount**: When $> 30\%$ of features are missing, the prediction pipeline caps model confidence and emits a UI flag `"LIMITED_EVIDENCE"` rather than escalating the risk category.

### 8.4 Explainability Engine (TreeSHAP)
- **Model Choice**: LightGBM / XGBoost Classifier trained on structured features.
- **Explainer**: `shap.TreeExplainer(model)` computed on the feature vector $x_i$.
- **SHAP Output Decomposition**:
  $$\text{Margin}(x) = \phi_0 + \sum_{j=1}^{M} \phi_j(x)$$
  where $\phi_0$ is the base expected score, and $\phi_j$ is the additive attribution of feature $j$.
- **Translation to Human Faculty Explanations**:
  - Positive $\phi_j$ on RED class $\rightarrow$ `"Factor contributing to elevated support need"`
  - Negative $\phi_j$ on RED class $\rightarrow$ `"Protective factor stabilizing student"`
  - $\phi_j \approx 0$ on missing feature $\rightarrow$ `"Data source unavailable; not impacting risk calculation"`

### 8.5 Status Hysteresis & Transition Logic
To prevent students on the border (e.g. risk score $0.69$ vs $0.71$) from flipping between Yellow and Red daily:
- **Transition GREEN $\rightarrow$ YELLOW**: Risk score $> 0.45$
- **Transition YELLOW $\rightarrow$ RED**: Risk score $> 0.70$
- **Transition RED $\rightarrow$ YELLOW (Recovery)**: Requires risk score $< 0.60$ for two consecutive evaluations.
- **Transition YELLOW $\rightarrow$ GREEN (Recovery)**: Requires risk score $< 0.35$ for two consecutive evaluations.

---

## 9. Computer Vision Pipeline

### 9.1 Processing Flow & Heuristics
```mermaid
flowchart LR
    Frame["Webcam / Video Frame"] --> CVPrep["OpenCV Resizing & Grayscale/RGB"]
    CVPrep --> DetectQuality["Lighting & Blur Check"]
    DetectQuality -->|Quality < Threshold| QualityFail["Emit DATA_UNAVAILABLE (Quality Degraded)"]
    DetectQuality -->|Quality OK| MPFace["MediaPipe FaceMesh & Pose"]
    MPFace -->|Zero Detections| ZeroFaces["Emit Camera Empty / Occluded (Neutral)"]
    MPFace --> ExtractLandmarks["Extract Head Pose (Pitch, Yaw, Roll)"]
    ExtractLandmarks --> ComputeScore["Compute Engagement Index (0-100)"]
    ComputeScore --> APIResponse["Return Vision Signal with Status: AVAILABLE"]
```

### 9.2 Measurable Vision Signals
1. **Presence Verification**: Head count and facial landmark bounding box stability.
2. **Head Pose Pitch & Yaw Estimation**:
   - Using 6 canonical 3D facial landmarks (Nose tip, Chin, Left eye corner, Right eye corner, Left mouth corner, Right mouth corner) with `cv2.solvePnP`.
   - Active learning cone defined as: $|\text{Yaw}| < 30^\circ$ and $-15^\circ < \text{Pitch} < 20^\circ$.
   - Scores calculated as percentage of sampled frames within the active cone.
3. **Hardware / Lighting Failures**:
   - Laplacian variance blur detection $< 100 \rightarrow$ flags `"LOW_QUALITY"`.
   - Frame read exceptions $\rightarrow$ flags `"SENSOR_OFFLINE"`.
   - **Critical Rule**: Zero frames analyzed results in `None` values and `DATA_UNAVAILABLE` status. It is **never** sent to the database as 0% engagement.

---

## 10. End-to-End Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Faculty as Faculty User
    participant Web as React Frontend
    participant API as FastAPI Gateway
    participant Svc as Prediction Service
    participant CV as Vision Engine
    participant ML as ML & SHAP Engine
    participant DB as PostgreSQL DB

    Faculty->>Web: Open Student Profile (/students/stu_01a)
    Web->>API: GET /api/v1/students/stu_01a
    API->>DB: Fetch Student, Academic, Attendance & Engagement Records
    DB-->>API: Return Records & Sensor Availability Flags
    
    alt Recalculate or Fresh Run Triggered
        API->>Svc: evaluate_student_status(student_id)
        opt Vision Data Streaming Active
            Svc->>CV: process_recent_frames(class_id)
            CV-->>Svc: (engagement_index, quality_flag="AVAILABLE")
        end
        Svc->>ML: generate_prediction(feature_vector)
        ML-->>Svc: (risk_score=0.82, predicted_status=RED, shap_values)
        Svc->>DB: Check Previous Status in status_history
        DB-->>Svc: Previous Status = YELLOW
        Note over Svc,DB: Status degraded YELLOW -> RED (Threshold crossed)
        Svc->>DB: Insert new PREDICTIONS & PREDICTION_FACTORS
        Svc->>DB: Insert STATUS_HISTORY event
        Svc->>DB: Insert ALERTS notification (severity=CRITICAL)
    end

    API-->>Web: Complete 360 Profile Payload (Status, SHAP Factors, Timeline)
    Web->>Faculty: Render Visual Dashboard, Red Status Badge, and SHAP Explanations
```

---

## 11. Error Handling & Graceful Degradation Matrix

| Scenario / Fault | Detection Mechanism | Backend Behavior | Frontend Presentation | Impact on Student Status |
| :--- | :--- | :--- | :--- | :--- |
| **Camera Hardware Failure** | Video capture throws I/O exception or RTSP drop | Log `WARNING`; return `quality_status="SENSOR_OFFLINE"` | Badge: `"Camera Offline - Non-punitive"` in neutral slate gray | **Zero Impact**. Neutral median imputation applied in ML. |
| **Blurry / Low-Light Frames** | OpenCV Laplacian variance $< 80$ | Sets `quality_flag="LOW_CONFIDENCE"` | Chip: `"Low Visibility - Signal Paused"` with tooltip | **Zero Impact**. Signal omitted from prediction calculation. |
| **Missing Assessment Marks** | Missing rows in `academic_records` | Normalizes on existing tests; sets `has_missing_academic=True` | Warning chip: `"Pending Grade Submissions"` on academic card | **Confidence Discounted**. Never categorizes student as Red on absence of grades. |
| **Attendance Not Logged** | Attendance query returns 0 rows for interval | Fills `None`; omits attendance trend | Badge: `"Attendance Unrecorded"` | **Zero Impact**. Student evaluated on academic marks alone. |
| **ML Inference Service Crash** | Exception in `model.predict()` | Fallback to deterministic heuristic baseline (rule-based safety net) | Banner: `"Analytics Engine in Safe Fallback Mode"` | Preserves previous known status; prevents unclassified states. |
| **Database Connection Interruption** | SQLAlchemy `OperationalError` | Returns `503 Service Unavailable` with retry-after header | Toast: `"Network error connecting to academic database. Retrying..."` | Safe read-only UI cache retained via React Query. |
| **Unauthorized Class Access** | Faculty JWT missing class claim | Raises `403 Forbidden` | Redirects to `/dashboard` with notification: `"Access Restricted to Assigned Classes"` | Security barrier preserved; logs security audit event. |

---

## 12. Testing Strategy

### 12.1 Automated Test Pyramid
- **Unit Tests (Backend)**:
  - `test_auth_jwt.py`: Token generation, expiration verification, invalid signature rejection.
  - `test_rbac.py`: Verify Faculty cannot access unassigned student profiles or admin routes.
  - `test_missing_data_imputer.py`: Assert that all-missing feature vectors never yield RED classifications.
  - `test_hysteresis.py`: Confirm student status transitions require double-confirmation to recover.
- **ML & Explainability Tests**:
  - `test_shap_consistency.py`: Confirm $\sum \phi_j \approx \text{Margin} - \phi_0$ within float tolerance ($10^{-5}$).
  - `test_model_benchmarks.py`: Validate precision $> 0.80$, recall $> 0.85$ on synthetic validation dataset.
- **Frontend Component Tests (Vitest + React Testing Library)**:
  - `StatusBadge.test.tsx`: Correct color rendering and accessible text for Green, Yellow, and Red.
  - `DataAvailabilityChip.test.tsx`: Verifies neutral gray styling when status is `"DATA_UNAVAILABLE"`.
  - `LoginFlow.test.tsx`: Handles invalid password error toasts without exposing internal stack traces.
- **End-to-End Smoke Test Flow**:
  - Script `tests/e2e_flow.py`:
    1. Authenticate as faculty `prof.smith@college.edu`.
    2. Fetch `/api/v1/dashboard/summary`.
    3. Query `/api/v1/students` with filter `status=RED`.
    4. Fetch `/api/v1/predictions/{id}/explanation` and confirm SHAP factor list is non-empty.
    5. Mark alert as read via `/api/v1/alerts/{id}/read`.

---

## 13. Security & Privacy Architecture

1. **FERPA & Student Privacy Compliance**:
   - Zero raw camera footage is written to persistent disk storage. Frames processed in memory buffers are immediately garbage collected after extracting mathematical landmarks.
   - Student biometric data is never stored; only high-level aggregated numbers (e.g. `head_pose_alertness_index = 82.0`) are persisted.
2. **Credential Safety & Secrets**:
   - Environment variables loaded exclusively via `pydantic-settings`.
   - `.env` excluded from version control in `.gitignore`.
   - Zero hardcoded passwords or JWT secrets in client code.
3. **Injection & Cross-Site Scripting (XSS) Defenses**:
   - Parameterized queries enforced across all database queries via SQLAlchemy ORM.
   - Pydantic v2 strict typing validates all incoming JSON payloads.
   - React JSX automatic encoding prevents script execution in student names and note fields.
4. **CORS Hardening**:
   - FastAPI `CORSMiddleware` restricted to explicitly configured origin domains (e.g. `http://localhost:5173` and production deployment URL).

---

## 14. Deployment & DevOps Architecture

### 14.1 Target Deployment Topology (Hackathon-Optimized)

```mermaid
flowchart LR
    Browser["User Browser"] -->|HTTPS| Vercel["Frontend: Vercel / Netlify (React SPA)"]
    Vercel -->|REST API calls| Render["Backend: Render / Railway (FastAPI Web Service)"]
    Render -->|SSL Connection Pooling| NeonDB[("Database: Neon / Supabase (PostgreSQL 15)")]
```

### 14.2 Local & Production Execution Modes
- **Production Mode**:
  - Frontend hosted on Vercel/Netlify with global CDN caching.
  - FastAPI running on Render/Railway with Uvicorn workers.
  - Managed PostgreSQL on Neon/Supabase with instant branchable databases.
- **Offline / Local Demo Mode (Zero-Config Fallback)**:
  - Single `docker-compose.yml` spinning up PostgreSQL, FastAPI backend, and Vite frontend.
  - Automated database migration and synthetic demo data seeding on startup:
    `python -m app.db.seed_demo_data`

### 14.3 Environment Variables Specification

#### Backend (`.env`)
```ini
# Application Core
PROJECT_NAME="ByteNight Early Support System"
ENVIRONMENT="development"
DEBUG=True
API_V1_STR="/api/v1"

# Security & Secrets
SECRET_KEY="generate-a-secure-random-64-char-hex-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=720

# Database
DATABASE_URL="postgresql://bytenight:bytenight_pass@localhost:5432/bytenight_db"
# Fallback for zero-setup SQLite: "sqlite:///./bytenight.db"

# CORS
CORS_ORIGINS='["http://localhost:5173", "http://127.0.0.1:5173"]'

# Vision Sensor Configuration
VISION_CAMERA_INDEX=0
ENABLE_MOCK_VISION=True
```

#### Frontend (`.env`)
```ini
VITE_API_BASE_URL="http://localhost:8000/api/v1"
VITE_APP_TITLE="Explainable Student Support System"
```

---

## 15. Standardized Folder Structure

```
ByteNight/
├── docs/
│   ├── PRD.md                          # Product Requirements Document
│   └── TECHNICAL_SPEC.md               # This Technical Specification
│
├── frontend/                           # React 18 + TypeScript + Vite
│   ├── public/                         # Static assets, logos, favicon
│   ├── src/
│   │   ├── assets/                     # Icons, illustration SVGs
│   │   ├── components/                 # Reusable UI component library
│   │   │   ├── common/                 # Button, Input, Modal, Dropdown, Table
│   │   │   ├── status/                 # StatusBadge, DataAvailabilityChip, RiskBar
│   │   │   ├── charts/                 # AcademicTrendChart, AttendanceCalendar, SHAPFactorBar
│   │   │   ├── layout/                 # Navbar, Sidebar, PageContainer
│   │   │   └── alerts/                 # AlertNotificationDrawer, AlertItem
│   │   ├── context/                    # AuthContext, AlertContext
│   │   ├── hooks/                      # useStudents, usePrediction, useAlerts
│   │   ├── pages/                      # Page components (routes)
│   │   │   ├── LoginPage.tsx
│   │   │   ├── FacultyDashboardPage.tsx
│   │   │   ├── StudentRosterPage.tsx
│   │   │   ├── StudentProfilePage.tsx
│   │   │   ├── ClassroomVisionPage.tsx
│   │   │   ├── FacultyAlertsPage.tsx
│   │   │   └── AdminManagementPage.tsx
│   │   ├── services/                   # Axios / fetch API client methods
│   │   │   ├── api.ts                  # Base API client with JWT interceptor
│   │   │   ├── auth.service.ts
│   │   │   ├── student.service.ts
│   │   │   ├── prediction.service.ts
│   │   │   └── alert.service.ts
│   │   ├── types/                      # TypeScript data model definitions
│   │   │   ├── student.types.ts
│   │   │   ├── prediction.types.ts
│   │   │   └── auth.types.ts
│   │   ├── App.tsx                     # Route configuration & providers
│   │   ├── main.tsx                    # React DOM entrypoint
│   │   └── index.css                   # Tailwind imports & theme variables
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                            # Python FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py                 # Dependency injections (Auth, DB session)
│   │   │   └── v1/                     # REST API Router endpoints
│   │   │       ├── auth.py
│   │   │       ├── dashboard.py
│   │   │       ├── students.py
│   │   │       ├── predictions.py
│   │   │       ├── alerts.py
│   │   │       ├── vision.py
│   │   │       └── admin.py
│   │   ├── core/                       # Core configurations, JWT, DB engine
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   └── exceptions.py
│   │   ├── models/                     # SQLAlchemy ORM database models
│   │   │   ├── user.py
│   │   │   ├── student.py
│   │   │   ├── academic.py
│   │   │   ├── attendance.py
│   │   │   ├── engagement.py
│   │   │   ├── prediction.py
│   │   │   └── alert.py
│   │   ├── schemas/                    # Pydantic v2 validation models
│   │   │   ├── auth.py
│   │   │   ├── student.py
│   │   │   ├── prediction.py
│   │   │   └── alert.py
│   │   ├── services/                   # Business logic layer
│   │   │   ├── auth_service.py
│   │   │   ├── student_service.py
│   │   │   ├── prediction_service.py
│   │   │   ├── explainability_service.py
│   │   │   ├── vision_service.py
│   │   │   └── alert_service.py
│   │   ├── ml/                         # Tabular ML inference & SHAP explainers
│   │   │   ├── preprocessor.py         # Missing-data imputers & feature scalers
│   │   │   ├── model_loader.py         # Loads joblib artifacts or fallback weights
│   │   │   └── shap_explainer.py       # TreeSHAP feature attribution computation
│   │   ├── vision/                     # Computer Vision heuristics & MediaPipe
│   │   │   ├── head_pose.py            # SolvePnP pitch/yaw/roll estimator
│   │   │   └── quality_checker.py      # Blur & illumination validator
│   │   └── main.py                     # FastAPI application factory
│   ├── tests/                          # Backend Pytest suite
│   │   ├── test_auth.py
│   │   ├── test_students.py
│   │   ├── test_predictions.py
│   │   └── test_missing_data.py
│   ├── requirements.txt                # Python dependencies
│   └── Dockerfile
│
├── data/                               # Datasets, synthetic fixtures, seeds
│   ├── demo/
│   │   ├── students_seed.json          # Curated personas (Improving, At-Risk, Missing-Cam)
│   │   ├── academic_seed.json
│   │   └── attendance_seed.json
│   ├── models/                         # Serialized ML artifacts (.joblib)
│   └── seed_demo_data.py               # Database seeder script
│
├── .gitignore
├── .env.example
├── docker-compose.yml                  # Full stack local orchestration
└── README.md
```

---

## 16. Demo Personas & Presentation Strategy

To demonstrate the system's explainability, multi-factor fusion, and neutral missing-data handling during hackathon judging, the database seeder will populate four specific student archetypes:

1. **Student A ("Jane Doe" - The Clear At-Risk Archetype)**:
   - *Trajectory*: GREEN $\rightarrow$ YELLOW $\rightarrow$ RED.
   - *Signals*: Math/Algorithms midterm score fell from $85\%$ to $52\%$; 3 consecutive unexcused absences.
   - *SHAP Explanation*: Points directly to exam score drop ($+0.31$ risk) and attendance drop ($+0.25$ risk).
   - *Alert*: CRITICAL alert automatically dispatched to faculty.

2. **Student B ("Liam Chen" - The Hardware Failure / Neutrality Archetype)**:
   - *Trajectory*: GREEN (Consistently Stable).
   - *Signals*: High academic grades ($91\%$), steady attendance ($95\%$), but **classroom camera feed failed / unavailable**.
   - *Behavior*: UI shows `"Classroom Vision: DATA_UNAVAILABLE"` in neutral gray.
   - *Verification*: Status **remains GREEN**. Proves the system does not penalize students for camera outages.

3. **Student C ("Marcus Vance" - The Recovery / Improvement Archetype)**:
   - *Trajectory*: RED $\rightarrow$ YELLOW $\rightarrow$ GREEN.
   - *Signals*: Remediated test scores ($55\% \rightarrow 72\% \rightarrow 84\%$) with perfect attendance for 3 weeks.
   - *Timeline*: Displays positive milestone annotations acknowledging academic recovery.

4. **Student D ("Aria Patel" - The Early Warning Monitoring Archetype)**:
   - *Trajectory*: GREEN $\rightarrow$ YELLOW.
   - *Signals*: Academic grades remain strong ($80\%$), but attendance dropped to $74\%$ over the last fortnight.
   - *Explainability*: Surfaces attendance as the primary driver for early monitoring before academic failure occurs.

---

## 17. 24-Hour Implementation Roadmap & Milestones

```mermaid
gantt
    title 24-Hour Hackathon Execution Timeline
    dateFormat  X
    axisFormat Hour %H

    section Phase 1: Foundations
    Project setup, schema DDL & seed scripts       :active, p1, 0, 3
    FastAPI core, JWT Auth, RBAC & basic CRUD      :p2, 2, 6

    section Phase 2: Frontend & Core UI
    React Vite setup, Tailwind & Design System      :p3, 4, 8
    Faculty Dashboard & Student Roster with Filters :p4, 7, 11
    Checkpoint: Frontend Live Deployment            :milestone, cp1, 11, 11

    section Phase 3: AI, SHAP & CV Pipeline
    Feature transformation & ML model loading       :p5, 10, 14
    SHAP explainability engine & factor mapping     :p6, 13, 16
    MediaPipe vision heuristics & fallback flags    :p7, 14, 17

    section Phase 4: Integration & UX Polish
    Student Detail 360 profile with Recharts & SHAP :p8, 16, 20
    Status history timeline & Alerting workflow    :p9, 18, 22

    section Phase 5: Verification & Pitch Prep
    End-to-end testing, demo persona validation     :p10, 21, 23
    Final live deployment & presentation polish     :milestone, cp2, 24, 24
```

| Milestone | Window | Deliverables | Verification Gate |
| :--- | :--- | :--- | :--- |
| **M1: Core Engine & Seeding** | Hours 0 - 4 | Database models, Alembic migrations, demo data script with 4 personas, FastAPI auth endpoints. | `seed_demo_data.py` runs without errors; `/api/v1/auth/login` returns valid JWT. |
| **M2: UI Skeleton & Roster** | Hours 4 - 8 | Responsive React layout, Login screen, Faculty Dashboard KPI cards, Student search and multi-filtering. | User can log in, view 48 seeded students, search by code, and filter by status. |
| **M3: ML & Explainability** | Hours 8 - 14 | Tabular prediction service, missing-data neutral imputer, TreeSHAP explainer generating factor weights. | `/api/v1/predictions/{id}/explanation` returns human-readable factors with directional SHAP values. |
| **M4: Vision & Detail View** | Hours 14 - 18 | Student profile tabs (Academic, Attendance, Engagement, History), MediaPipe vision quality checker, neutral banners. | Student Profile renders Recharts trends and SHAP waterfall/bar charts. Camera dropout renders gray chip. |
| **M5: Alerts & Full Integration** | Hours 18 - 22 | Alert center with unread counters, status change timeline, hysteresis rule tests. | Degraded student triggers CRITICAL alert; faculty can click alert to jump directly to profile. |
| **M6: Deployment & Pitch Demo** | Hours 22 - 24 | Vercel frontend deploy, Render backend deploy, smoke test suite pass, demo persona walkthrough rehearsal. | Live URLs accessible; end-to-end walkthrough passes all criteria without console errors. |
