# Product Requirements Document (PRD)

## Project: Explainable Student Performance & Early Support System

## 1. Product Vision

The Explainable Student Performance & Early Support System is an AI-assisted academic support platform designed to help faculty identify students who may need academic attention before a problem becomes severe. It combines measurable academic, attendance, engagement, and classroom-vision signals into a single, explainable support model.

The system is intended to support early intervention rather than surveillance. It helps faculty act on objective trends and context, while presenting clear, explainable reasons for caution or support. It is designed for a 24-hour hackathon MVP and should prioritize reliability, interpretability, and clear faculty workflow over broad feature scope.

The product must not rely on any single metric. Instead, student risk is based on multiple signals, including:

- Academic performance trends
- Attendance consistency
- Classroom engagement indicators
- Live classroom vision indicators
- Historical status changes over time

The system should support these goals:

- Predict likely academic performance or risk
- Identify students who may require support
- Explain the key measurable factors contributing to the prediction
- Safely handle missing or unavailable data
- Track student status over time
- Alert faculty when meaningful status changes occur
- Help faculty provide timely academic support

This is a support and early-intervention system, not a surveillance system. It should be transparent, fair, and respectful of data limitations.

---

## 2. Core Product Logic

Students are represented using three understandable statuses:

- GREEN: Stable
- YELLOW: Needs monitoring
- RED: Requires attention

These statuses should be derived from multiple available signals rather than from a simplistic rule such as:

- Low attendance = Red
- Camera failure = Red
- Low marks alone = Red

The future ML system should combine multiple features together and should consider context, history, and completeness of data. A single missing or unavailable signal should not automatically imply risky behavior.

Status changes should be tracked with a clear timeline. Examples of valid transitions include:

- Green → Yellow
- Green → Red
- Yellow → Green
- Yellow → Red
- Red → Yellow
- Red → Green

When a student moves toward risk, the system should show contributing factors. When a student improves, the system should show improvement signals and positive change patterns.

Missing data must never automatically be treated as negative behavior. A blank, unavailable, or failed sensor source should be shown clearly as “data unavailable” or “not captured,” not as evidence of poor behavior.

---

## 3. Target Users

### Primary users

1. Faculty / Teachers
   - Need a fast view of student risk and support needs for their assigned classes.

2. Class In-charges
   - Need a broader view of class-level student performance and follow-up actions.

### Secondary users

3. Academic Coordinators
   - Need aggregated insights and oversight over multiple classes or sections.

4. Administrators
   - Need user, student, class, and academic data management.

### Future user

5. Students
   - Need visibility into their own progress, status, and improvement trends.

Priority: faculty workflow is the highest priority for the 24-hour MVP.

---

## 4. User Stories

### 4.1 Faculty User Stories

#### MUST HAVE

- As a faculty member, I want to securely log in so that I can access my class and student records.
- As a faculty member, I want to view my assigned class so that I can review my students in one place.
- As a faculty member, I want to see overall student status so that I can quickly identify who may need attention.
- As a faculty member, I want to identify students requiring attention so that I can take timely support action.
- As a faculty member, I want to search and filter students so that I can find relevant students quickly.
- As a faculty member, I want to open a student profile so that I can review the student’s performance and support history.
- As a faculty member, I want to view academic trends so that I can understand whether performance is improving or declining.
- As a faculty member, I want to view attendance so that I can understand participation and consistency.
- As a faculty member, I want to view engagement so that I can understand classroom participation signals.
- As a faculty member, I want to view the current prediction and status so that I can understand the student’s current risk level.
- As a faculty member, I want to understand contributing factors so that I can explain the reason for the student’s status.
- As a faculty member, I want to view status history so that I can see recent trends and transitions over time.
- As a faculty member, I want to receive alerts so that I can act when a student’s status changes materially.
- As a faculty member, I want to understand missing or unavailable data so that I do not misinterpret incomplete information.
- As a faculty member, I want to monitor improvement so that I can recognize positive change and support success.

#### SHOULD HAVE

- As a faculty member, I want to compare multiple student groups so that I can identify broader class trends.
- As a faculty member, I want to sort by risk or support urgency so that I can prioritize attention appropriately.
- As a faculty member, I want to view alert severity and timeframe so that I can prioritize follow-up actions.
- As a faculty member, I want to see a class-level summary so that I can identify patterns across students.

#### NICE TO HAVE

- As a faculty member, I want to export student reports so that I can share notes with academic teams.
- As a faculty member, I want to annotate or note support actions so that I can maintain follow-up history.
- As a faculty member, I want to see a personalized recommendation summary so that I can decide on timely support steps.

### 4.2 Administrator User Stories

#### MUST HAVE

- As an administrator, I want to manage users so that only authorized faculty and staff can access the system.
- As an administrator, I want to manage students so that the roster remains accurate.
- As an administrator, I want to manage classes so that academic ownership and faculty assignment remain clear.
- As an administrator, I want to manage authorized academic data so that only approved data sources are used for predictions and reporting.

#### SHOULD HAVE

- As an administrator, I want to review system-wide alerts so that I can ensure operational continuity.
- As an administrator, I want to manage data quality checks so that missing or invalid records are identified early.

#### NICE TO HAVE

- As an administrator, I want to review fairness and model monitoring summaries so that I can support responsible use of AI features.

### 4.3 Student User Stories

#### MUST HAVE

- As a student, I want to view my academic progress so that I understand how I am performing.
- As a student, I want to view my status so that I understand whether I am stable, monitored, or needs attention.
- As a student, I want to view my improvement trend so that I can see whether I am moving in the right direction.

#### SHOULD HAVE

- As a student, I want to understand the main factors behind my current status so that I can take action.

#### NICE TO HAVE

- As a student, I want to receive nudges or guidance on next steps so that I can improve proactively.

---

## 5. Functional Requirements

The following requirements define the product features for the MVP and future phases.

### 5.1 Authentication

- Feature name: Secure authentication and session management
- Priority: MUST HAVE
- Purpose: Allow only approved users to access the system
- User: Faculty, administrator, future student access
- Input: Username/email, password, role assignment, active session
- Processing: Validate credentials, hash passwords, issue secure tokens, enforce role-based access
- Output: Successful login or clear error; authenticated session; protected access
- API required: POST /api/auth/login; GET /api/auth/me
- Database data required: users table, roles, password hashes, active status, last login metadata
- UI required: Login page, session state, logout action, unauthorized page states
- Acceptance criteria:
  - Users can log in only with valid credentials.
  - Passwords are never stored in plaintext.
  - Unauthorized users cannot access protected pages or APIs.
  - Expired or invalid tokens are rejected.

### 5.2 Faculty Dashboard

- Feature name: Faculty dashboard
- Priority: MUST HAVE
- Purpose: Give faculty a quick overview of class and student support needs
- User: Faculty, class in-charge
- Input: Assigned class data, aggregated student status, alerts, recent activity
- Processing: Aggregate status summaries, identify students needing attention, compute dashboard metrics
- Output: Dashboard KPI cards, alert list, class summary, student risk overview
- API required: GET /api/dashboard/summary
- Database data required: students, academic_records, attendance_records, engagement_records, alerts, status_history
- UI required: Overview cards, student list widgets, alerts panel, summary charts
- Acceptance criteria:
  - Faculty can see at-a-glance class status distribution.
  - Students needing attention are clearly surfaced.
  - Dashboard works with empty or partially available data without misclassification.

### 5.3 Student List

- Feature name: Student list
- Priority: MUST HAVE
- Purpose: Give faculty a complete view of all students in the assigned class
- User: Faculty
- Input: Student roster, filters, status, search criteria
- Processing: Query assigned students and return status, attendance, and current risk summaries
- Output: Table or card list of students with visible statuses, names, and support indicators
- API required: GET /api/students
- Database data required: students, status_history, attendance_records, academic_records
- UI required: Student list table, badges, sorting controls, search fields, status chips
- Acceptance criteria:
  - Faculty can see all assigned students without navigating to separate pages.
  - Students can be sorted or filtered by status, name, or risk level.
  - Partial data is shown with clear data unavailable indicators.

### 5.4 Student Search

- Feature name: Student search
- Priority: MUST HAVE
- Purpose: Allow faculty to find a specific student quickly
- User: Faculty
- Input: Free-text search or student metadata
- Processing: Match student name, ID, section, or class identifier
- Output: Matching student results and quick access to profile
- API required: GET /api/students with query support
- Database data required: students table indexed by name and identifiers
- UI required: Search box, responsive results, zero-result handling
- Acceptance criteria:
  - Search is accurate for common student identifiers.
  - Empty search returns a safe default view.
  - Search does not expose data beyond the user’s access scope.

### 5.5 Student Filtering

- Feature name: Student filtering
- Priority: MUST HAVE
- Purpose: Help faculty narrow the student list by risk and signal quality
- User: Faculty
- Input: Status filters, class section, attendance range, risk level, date range
- Processing: Apply and combine filters to student list query
- Output: Filtered subset of students matching criteria
- API required: GET /api/students with filter parameters
- Database data required: status_history, attendance_records, academic_records, students
- UI required: Filter panel with dropdowns and toggles
- Acceptance criteria:
  - Faculty can filter by status, risk, or section.
  - Filters are easy to reset and combine logically.
  - The system clearly communicates when no students match the current filter.

### 5.6 Student Profile

- Feature name: Student profile
- Priority: MUST HAVE
- Purpose: Provide a detailed view of a student’s academic and support status
- User: Faculty, future student access
- Input: Student ID and selected timeframe
- Processing: Retrieve profile data, current status, recent metrics, and explanatory factors
- Output: Student summary, risk placement, academic and engagement trend view, status history, alerts
- API required: GET /api/students/{id}; GET /api/students/{id}/history
- Database data required: students, academic_records, attendance_records, engagement_records, status_history, alerts
- UI required: Profile header, tabs for academic/attendance/engagement/history, explanation panel
- Acceptance criteria:
  - Faculty can open a student profile from the list or dashboard.
  - Profile contains enough data to understand the current status and trend.
  - Missing data is labeled clearly rather than interpreted as negative behavior.

### 5.7 Academic Performance

- Feature name: Academic performance tracking
- Priority: MUST HAVE
- Purpose: Show how a student is performing academically over time
- User: Faculty, future student
- Input: Assessment marks, tests, assignments, subject scores, date history
- Processing: Compute trends, compare against baseline and recent performance
- Output: Graphs, score summary, current performance band, risk context
- API required: GET /api/students/{id}/academic
- Database data required: academic_records
- UI required: Charts, subject cards, trend views, loading and empty states
- Acceptance criteria:
  - Faculty can review subject-level and overall performance trends.
  - Data gaps are explicitly marked.
  - Performance trend is presented with context, not only as a raw score.

### 5.8 Attendance

- Feature name: Attendance monitoring
- Priority: MUST HAVE
- Purpose: Show whether attendance is regular and whether there are concerning patterns
- User: Faculty, class in-charge, future student
- Input: Attendance records by day/session/course
- Processing: Calculate attendance ratio, anomalies, and recent absence patterns
- Output: Attendance trend, summary percentage, status context
- API required: GET /api/students/{id}/attendance
- Database data required: attendance_records
- UI required: Attendance cards, trend graph, missing-data warnings
- Acceptance criteria:
  - Faculty can identify attendance dips without triggering false alarms from missing data.
  - Attendance is shown alongside other factors, not in isolation.

### 5.9 Engagement

- Feature name: Engagement signal tracking
- Priority: MUST HAVE
- Purpose: Surface classroom participation or engagement indicators combined with academic and attendance data
- User: Faculty, future student
- Input: Engagement measures, participation signals, classroom activity metrics
- Processing: Aggregate class participation scores and trend over time
- Output: Engagement summary and trend with risk context
- API required: GET /api/students/{id}/engagement
- Database data required: engagement_records, optionally vision-derived indicators
- UI required: Engagement panels, charts, context labels for missing or noisy data
- Acceptance criteria:
  - Engagement is visible as a measurable factor rather than a vague qualitative note.
  - Missing engagement data is clearly labeled as unavailable.

### 5.10 Student Status Classification

- Feature name: Student status classification
- Priority: MUST HAVE
- Purpose: Translate multiple signals into GREEN/YELLOW/RED status
- User: Faculty, future student
- Input: Academic, attendance, engagement, risk factors, prediction score, status history
- Processing: Determine current status using combined evidence and thresholds defined by the model or business logic
- Output: Color-coded status label and status narrative
- API required: POST /api/predictions; GET /api/predictions/{id}
- Database data required: predictions, status_history
- UI required: Status badges, logic explanation panel, timeline visual
- Acceptance criteria:
  - A student can move from stable to risk or back to stable through status history.
  - Status is based on multiple signals, not one metric alone.
  - Red or Yellow status is explainable to faculty.

### 5.11 ML Prediction

- Feature name: AI prediction engine
- Priority: MUST HAVE
- Purpose: Estimate a student’s likely academic risk profile using integrated signals
- User: Faculty, administrators, future model monitoring
- Input: Structured features, historical academic data, attendance, engagement, other measurable features
- Processing: Run the prediction pipeline and generate a risk or support score
- Output: Prediction object, status label, confidence or score metadata, timestamp
- API required: POST /api/predictions; GET /api/predictions/{id}
- Database data required: predictions, academic_records, attendance_records, engagement_records, student metadata
- UI required: Prediction summary in dashboard and student profile
- Acceptance criteria:
  - Prediction output is available for a student record when enough valid data exists.
  - The system handles partial data without assuming negative behavior.
  - Predictions are shown as one part of an overall support assessment, not the only truth.

### 5.12 Explainability

- Feature name: Explainability panel
- Priority: MUST HAVE
- Purpose: Show why a student is at a certain status or risk level
- User: Faculty
- Input: Prediction output and generated feature importances or explanations
- Processing: Use explainability methods to rank contributing factors and identify direction and impact
- Output: Top contributing factors, positive/negative contribution summary, explanation text
- API required: GET /api/predictions/{id}/explanation
- Database data required: prediction_factors, prediction metadata
- UI required: Explanation panel with a list of important factors and trend reasons
- Acceptance criteria:
  - Faculty can understand the main drivers behind a status change.
  - Explanations reference measurable factors, not vague labels.
  - Missing data is not treated as a negative signal without context.

### 5.13 Missing-data handling

- Feature name: Missing data and unavailable signal handling
- Priority: MUST HAVE
- Purpose: Guard against false alarms and misinterpretation caused by missing or failed inputs
- User: Faculty, administrators, model pipeline
- Input: Partial student record, missing assessments, unavailable attendance, failed camera feed
- Processing: Mark data as missing, unavailable, or not captured; exclude or neutralize unreliable features in the ML pipeline where appropriate
- Output: Clear message such as “data unavailable,” “not captured,” or “not enough data for evaluation”
- API required: All relevant read and prediction APIs
- Database data required: Data quality flags, null handling metadata, status and system notes
- UI required: Data availability indicators, empty state messaging, warning banners
- Acceptance criteria:
  - Missing data never implies poor behavior automatically.
  - Faculty can tell when a metric is unavailable rather than simply absent.
  - Partial data still allows useful but limited support insights.

### 5.14 Status History

- Feature name: Status history timeline
- Priority: MUST HAVE
- Purpose: Record how a student’s classification changes over time
- User: Faculty, future student
- Input: Previous and current statuses, timestamps, reasons for change
- Processing: Store and display historical classification changes over time
- Output: Timeline with status transition events
- API required: GET /api/students/{id}/history
- Database data required: status_history
- UI required: Timeline chart or list of transitions
- Acceptance criteria:
  - Faculty can review prior Green/Yellow/Red changes.
  - A change from better to worse and vice versa is visible.
  - Reason context is available when status changes materially.

### 5.15 Faculty Alerts

- Feature name: Faculty alerts
- Priority: MUST HAVE
- Purpose: Notify faculty when a student’s status changes or a risk threshold is crossed
- User: Faculty, class in-charge
- Input: New prediction, status transitions, alert rules, severity level
- Processing: Evaluate alert conditions and generate notifications for faculty
- Output: Alert cards, unread state, status-change summary
- API required: GET /api/alerts; POST /api/alerts/{id}/read
- Database data required: alerts
- UI required: Alerts panel, unread badge, alert details
- Acceptance criteria:
  - Faculty receives alerts when the status changes meaningfully.
  - Alerts clearly explain what changed.
  - Alerts can be marked as read.

### 5.16 Improvement Tracking

- Feature name: Improvement tracking
- Priority: SHOULD HAVE
- Purpose: Show positive progress and recovery over time
- User: Faculty, future student
- Input: Historical status and performance data
- Processing: Compare current and previous states to detect improvement trend
- Output: Improvement summary, positive trend notes, restored stability view
- API required: GET /api/students/{id}/history; GET /api/students/{id}/academic
- Database data required: status_history, academic_records, attendance_records
- UI required: Improvement trend section and milestone indicators
- Acceptance criteria:
  - Faculty can see when a student’s status improves.
  - Positive changes are acknowledged and visible in the UI.

### 5.17 Live Classroom Vision Analysis

- Feature name: Live classroom vision analysis
- Priority: SHOULD HAVE
- Purpose: Generate measurable classroom participation indicators from video or classroom observation data
- User: Faculty, academic administrators
- Input: Camera or observation frames, classroom environment data, student presence and pose indicators
- Processing: Detect presence, posture, visible attention-related indicators, and quality of detection
- Output: Presence and engagement signal summaries with quality status
- API required: POST /api/vision/analyze
- Database data required: engagement_records and vision metadata when available
- UI required: Vision insight panel with quality indicators and warnings
- Acceptance criteria:
  - Camera or detection failure is clearly shown without being treated as negative behavior.
  - Vision outputs are presented as one measurable input, not as sole evidence.

### 5.18 Admin Management

- Feature name: Admin management
- Priority: SHOULD HAVE
- Purpose: Allow administrators to manage users, students, classes, and approved academic data feeds
- User: Administrator
- Input: User roles, student assignments, class records, data permissions
- Processing: Validate and store configuration and reporting access
- Output: Updated user, student, and class records
- API required: Admin endpoints as needed
- Database data required: users, students, classes, data permissions or mappings
- UI required: Admin pages for users, students, classes, and data control
- Acceptance criteria:
  - Administration can manage access and data ownership clearly.
  - Unauthorized changes are prevented by role-based rules.

### 5.19 Student Dashboard

- Feature name: Student dashboard
- Priority: NICE TO HAVE
- Purpose: Give students a simple view of their own academic progress and support status
- User: Student
- Input: Student profile, academic, attendance, improvement data
- Processing: Summarize progress and status in student-friendly wording
- Output: Status overview, trend insights, improvement narrative
- API required: GET /api/students/{id}
- Database data required: students, academic_records, attendance_records, status_history
- UI required: Student-friendly dashboard with plain-language summary
- Acceptance criteria:
  - Students can view their academic progress and status safely.
  - Only the student’s own record is accessible.

### 5.20 Data Availability Indicators

- Feature name: Data availability indicators
- Priority: MUST HAVE
- Purpose: Prevent false interpretation of missing, failed, or delayed data
- User: Faculty, administrators, future students
- Input: Data source timestamps, completeness checks, detection quality
- Processing: Determine whether data is available, partial, stale, or missing
- Output: Clear status badges and messages describing data status
- API required: All data retrieval endpoints and prediction APIs
- Database data required: Data source metadata, completeness, timestamps
- UI required: Status chip and banners in each data panel
- Acceptance criteria:
  - A missing data source is presented as unavailable instead of poor performance.
  - The system remains understandable even when some data is absent.

---

## 6. MVP Requirements

The 24-hour MVP should prioritize reliability, clarity, and faculty usefulness over feature depth.

### MUST HAVE

- Faculty login
- Faculty dashboard
- Student list
- Search and filter functionality
- Student profile
- Academic performance graph
- Attendance summary
- Engagement summary
- Green / Yellow / Red status
- Multi-factor prediction interface
- Explainable contributing factors
- Missing-data handling
- Status history
- Faculty alerts
- Demo data
- Responsive frontend
- Backend API architecture
- Database architecture
- GitHub-ready project
- Deployable frontend

### SHOULD HAVE

- Live classroom vision analysis
- Improvement tracking
- Admin management
- Advanced filters
- More detailed analytics

### NICE TO HAVE

- Student dashboard
- Advanced reports
- Export functionality
- Real-time video streaming
- Mobile application

### MVP design principles

- Use realistic demo data instead of requiring full production data ingestion.
- Focus on faculty workflow and trustworthiness.
- Ensure each status and alert is explainable.
- Avoid making hidden assumptions about missing inputs.
- Keep the system simple enough to test and deploy within 24 hours.

---

## 7. AI / ML Requirements

The AI architecture is defined at PRD level only. It will be designed and implemented later in the project lifecycle and not in the current PRD scope.

### 7.1 Structured-data ML

The future ML system should use structured data to predict academic risk or support need. Potential models include:

- XGBoost
- LightGBM

Inputs may include:

- Previous academic performance
- Current assessments
- Attendance records
- Engagement indicators
- Other measurable, defensible features

The model should not use one single signal as the sole predictor. It should combine relevant inputs in a multivariate approach.

### 7.2 Explainability

The future system should use SHAP or an equivalent explainability method.

The output should include:

- Prediction or risk score
- Contributing features
- Direction or importance where appropriate

The explanations should be presented in user-friendly language and tied to measurable factors such as attendance trend, academic dip, or engagement change.

### 7.3 Computer Vision

The future vision system may use technologies such as:

- OpenCV
- YOLO
- MediaPipe

The vision system should produce measurable indicators such as:

- Presence
- Pose or body landmarks
- Other defensible engagement indicators

The system should not treat camera assumptions as a direct sign of poor behavior. Vision-derived signals should be used as supporting evidence only, with confidence and quality indications.

### 7.4 Multimodal fusion

The future AI system should combine:

- Academic data
- Attendance data
- Engagement data
- Vision features

into a unified prediction pipeline. This fusion is important because a fair and useful support signal cannot come from a single dimension of information.

### 7.5 Reliability and evaluation

The project should define evaluation using:

- Precision
- Recall
- F1-score
- Confusion matrix

Evaluation should include training, validation, and test separation so that model performance is measured in a reliable way.

### 7.6 Missing data handling in AI

The AI system must identify unavailable data and avoid interpreting missing information as negative behavior.

Rules:

- Missing data must not automatically reduce a student to a worse risk level.
- The system should track which features were unavailable.
- Explainability should account for missing or low-quality data.
- The model should be explicit about confidence and completeness.

### 7.7 Fairness

The future model should be evaluated by relevant group-wise metrics where the dataset supports it.

Examples of fairness review include:

- Performance by student group where applicable
- Comparison of false positives and false negatives by category where legally and ethically appropriate
- Evaluation only where sufficient and valid data exist

The project must not claim fine-tuning or advanced personalization unless it is actually implemented later.

---

## 8. Frontend Requirements

The frontend should prioritize the faculty dashboard and student detail page as the most important screens.

### 8.1 Login Screen

- Purpose: Allow secure access to the system.
- User: Faculty, administrator, future student
- Main UI components: Email/username form, password field, login button, error message area, forgot password secondary path if required
- Input: Credentials and session state
- Data displayed: Login status, role information after session creation
- API dependencies: POST /api/auth/login
- States: Idle, loading, success, failed credentials, network error
- Acceptance criteria:
  - User can log in with valid credentials.
  - Invalid login is shown without exposing internal error details.
  - User is redirected to authorized landing page after success.
- Priority: MUST HAVE

### 8.2 Faculty Dashboard

- Purpose: Present a class-level summary and student support overview.
- User: Faculty, class in-charge
- Main UI components: Summary cards, alert panel, student list, filters, trending charts
- Input: Class assignment and dashboard summary data
- Data displayed: Student status distribution, alerts, class summary, student list
- API dependencies: GET /api/dashboard/summary; GET /api/students; GET /api/alerts
- States: Loading, empty state, partial data, alert state, student summary view
- Acceptance criteria:
  - Dashboard quickly highlights students needing attention.
  - Status distribution is visible at a glance.
  - Data limitations are clearly communicated.
- Priority: MUST HAVE

### 8.3 Student List

- Purpose: Show all assigned students with current status and quick actions.
- User: Faculty
- Main UI components: Search bar, filters, sortable table, status badges, risk chips
- Input: Search text and filter criteria
- Data displayed: Student name, ID, status, summary metrics
- API dependencies: GET /api/students
- States: Search results, no results, loading data, filter applied state
- Acceptance criteria:
  - A faculty member can browse and open any visible student profile.
  - Clear sorting and filtering behavior is present.
- Priority: MUST HAVE

### 8.4 Student Detail

- Purpose: Provide detailed academic and support context for one student.
- User: Faculty
- Main UI components: Header with status, academic trend chart, attendance panel, engagement panel, prediction summary, explanation panel, status history
- Input: Student ID and detailed student data
- Data displayed: Academic history, attendance, engagement, current status, explanation, history timeline
- API dependencies: GET /api/students/{id}; GET /api/students/{id}/academic; GET /api/students/{id}/attendance; GET /api/students/{id}/engagement; GET /api/predictions/{id}; GET /api/predictions/{id}/explanation; GET /api/students/{id}/history
- States: Loading, partial data, good status, risk status, no data available
- Acceptance criteria:
  - Faculty can understand why the current status is Green/Yellow/Red.
  - Missing data is clearly labeled as unavailable.
  - Trend and explanation sections are understandable without model jargon.
- Priority: MUST HAVE

### 8.5 Alerts

- Purpose: Surface important status or support updates for faculty.
- User: Faculty, class in-charge
- Main UI components: Alert list, read/unread states, detail drawer or modal
- Input: Alert data and read status
- Data displayed: Alert type, date, student, reason, severity
- API dependencies: GET /api/alerts; POST /api/alerts/{id}/read
- States: Unread, read, no alerts, silent state
- Acceptance criteria:
  - Faculty can quickly identify important changes.
  - Alert details explain the underlying status change.
- Priority: MUST HAVE

### 8.6 Vision Analysis

- Purpose: Display classroom vision-derived insights and quality status.
- User: Faculty, academic staff
- Main UI components: Vision quality badge, summary metrics, confidence indicators, notes for unavailable camera feed
- Input: Vision analysis response
- Data displayed: Presence, engagement indicators, detection quality, limitations
- API dependencies: POST /api/vision/analyze
- States: Available, low-quality, unavailable, detection failed
- Acceptance criteria:
  - Camera failure is communicated clearly and does not trigger false risk classification.
  - Vision results are displayed as supporting evidence only.
- Priority: SHOULD HAVE

### 8.7 Admin Screen

- Purpose: Manage user, student, and class configuration.
- User: Administrator
- Main UI components: User list, student roster management, class assignments, role management, data permissions
- Input: Admin actions and records
- Data displayed: User roles, staff access, class assignments, data sources
- API dependencies: Admin API set
- States: Loading, successful update, validation error, unauthorized
- Acceptance criteria:
  - Admin can manage authorized data without exposing security-sensitive settings to unauthorized users.
- Priority: SHOULD HAVE

### 8.8 Student Dashboard

- Purpose: Give students a clear summary of their own status and academic progress.
- User: Student
- Main UI components: Status summary, trend chart, academic summary, improvement view
- Input: Student-specific profile data
- Data displayed: Current status, academic trend, progress summary, improvement narrative
- API dependencies: GET /api/students/{id}
- States: Student view, loading, unavailable data, no-access state
- Acceptance criteria:
  - Students can access only their own profile and summary.
  - Language is clear and non-judgmental.
- Priority: NICE TO HAVE

---

## 9. Backend API Requirements

The backend should follow a clean REST API model suitable for a small hackathon build. All APIs should require authentication where appropriate and should return clear errors.

### 9.1 POST /api/auth/login

- Method: POST
- Endpoint: /api/auth/login
- Purpose: Authenticate a user and generate a secure session token
- Authentication: None on login
- Request data: Email or username, password
- Response data: User summary, token, role, session expiration details
- Error cases:
  - Invalid credentials
  - Locked account
  - Missing required fields
  - Server failure
- Priority: MUST HAVE

### 9.2 GET /api/auth/me

- Method: GET
- Endpoint: /api/auth/me
- Purpose: Return the authenticated user profile for the current session
- Authentication: JWT or equivalent secure session token
- Request data: None
- Response data: User ID, name, role, access scope
- Error cases:
  - Invalid token
  - Expired token
  - Unauthorized access
- Priority: MUST HAVE

### 9.3 GET /api/dashboard/summary

- Method: GET
- Endpoint: /api/dashboard/summary
- Purpose: Return class-level overview and summary metrics for the faculty view
- Authentication: Required
- Request data: Optional date range or class filter
- Response data: Summary counts, status distribution, alert metrics, recent student attention list
- Error cases:
  - No assigned class
  - Access denied
  - Data unavailable for a subset of metrics
- Priority: MUST HAVE

### 9.4 GET /api/students

- Method: GET
- Endpoint: /api/students
- Purpose: Return the list of students available to the authenticated user
- Authentication: Required
- Request data: Optional filters, search text, sorting parameters
- Response data: Student list with summary status and support indicators
- Error cases:
  - Unauthorized access
  - No students assigned
  - Invalid query parameters
- Priority: MUST HAVE

### 9.5 GET /api/students/{id}

- Method: GET
- Endpoint: /api/students/{id}
- Purpose: Return a student’s profile and current summary
- Authentication: Required
- Request data: Student ID from route
- Response data: Student details, current status, summary metrics, data availability indicators
- Error cases:
  - Student not found
  - Access denied
  - Missing data not fatal
- Priority: MUST HAVE

### 9.6 GET /api/students/{id}/academic

- Method: GET
- Endpoint: /api/students/{id}/academic
- Purpose: Return academic performance records and trends
- Authentication: Required
- Request data: Optional date range
- Response data: Assessment record set, trend metrics, subject summary
- Error cases:
  - Missing academic history
  - Data source unavailable
- Priority: MUST HAVE

### 9.7 GET /api/students/{id}/attendance

- Method: GET
- Endpoint: /api/students/{id}/attendance
- Purpose: Return attendance data and attendance summary
- Authentication: Required
- Request data: Optional date range
- Response data: Attendance percentages, recent attendance records, flags for missing data
- Error cases:
  - No attendance data available
  - Attendance records incomplete
- Priority: MUST HAVE

### 9.8 GET /api/students/{id}/engagement

- Method: GET
- Endpoint: /api/students/{id}/engagement
- Purpose: Return engagement trend and engagement indicators
- Authentication: Required
- Request data: Optional date range
- Response data: Engagement measures and trend summary
- Error cases:
  - No engagement data
  - Vision or participation data unavailable
- Priority: MUST HAVE

### 9.9 GET /api/students/{id}/history

- Method: GET
- Endpoint: /api/students/{id}/history
- Purpose: Return status and event history for a student
- Authentication: Required
- Request data: Optional date range
- Response data: Timeline of Green/Yellow/Red transitions and supporting reason snippets
- Error cases:
  - No history available yet
  - Student not found
- Priority: MUST HAVE

### 9.10 POST /api/predictions

- Method: POST
- Endpoint: /api/predictions
- Purpose: Trigger or calculate a prediction for a student
- Authentication: Required
- Request data: Student ID and relevant feature set or date context
- Response data: Prediction ID, output status, score, timestamp, data completeness metadata
- Error cases:
  - Missing required data
  - Model unavailable
  - Invalid input payload
- Priority: MUST HAVE

### 9.11 GET /api/predictions/{id}

- Method: GET
- Endpoint: /api/predictions/{id}
- Purpose: Return the saved prediction results
- Authentication: Required
- Request data: Prediction ID from route
- Response data: Prediction object, model metadata, status label, outcome details
- Error cases:
  - Prediction not found
  - Not authorized to view
- Priority: MUST HAVE

### 9.12 GET /api/predictions/{id}/explanation

- Method: GET
- Endpoint: /api/predictions/{id}/explanation
- Purpose: Return the explainability output for a prediction
- Authentication: Required
- Request data: Prediction ID from route
- Response data: Top factors, contribution direction, importance list, missing-data notes
- Error cases:
  - Explanation unavailable
  - Model output incomplete
- Priority: MUST HAVE

### 9.13 GET /api/alerts

- Method: GET
- Endpoint: /api/alerts
- Purpose: Return all alerts available to the authenticated user
- Authentication: Required
- Request data: Optional read status or severity filters
- Response data: Alert list with student and status change details
- Error cases:
  - No alerts available
  - Access denied
- Priority: MUST HAVE

### 9.14 POST /api/alerts/{id}/read

- Method: POST
- Endpoint: /api/alerts/{id}/read
- Purpose: Mark an alert as read
- Authentication: Required
- Request data: Alert ID from route
- Response data: Updated alert status or success message
- Error cases:
  - Alert not found
  - Invalid user access
- Priority: MUST HAVE

### 9.15 POST /api/vision/analyze

- Method: POST
- Endpoint: /api/vision/analyze
- Purpose: Process classroom vision inputs and generate measurable engagement indicators
- Authentication: Required
- Request data: Video frame batch, classroom context, optional student mapping
- Response data: Detection summary, quality metrics, presence indicators, confidence and error status
- Error cases:
  - Camera unavailable
  - Detection failure
  - No valid frames
  - Insufficient data quality
- Priority: SHOULD HAVE

---

## 10. Database Requirements

The production/deployed architecture should use PostgreSQL. The initial hackathon implementation may use a simplified schema but should be designed with these core entities in mind.

### 10.1 users

- Purpose: Store authenticated users and role assignments.
- Primary key: user_id
- Important fields:
  - user_id
  - email or username
  - password_hash
  - full_name
  - role (ADMIN, FACULTY, STUDENT)
  - created_at
  - last_login
  - is_active
- Relationships:
  - One user can be assigned to one role; each faculty may manage multiple classes or students.
- Required indexes:
  - Index on email or username
  - Index on role

### 10.2 students

- Purpose: Store student records and class assignment metadata.
- Primary key: student_id
- Important fields:
  - student_id
  - student_code
  - full_name
  - class_id or section
  - academic_year
  - status
  - created_at
  - updated_at
- Relationships:
  - Each student belongs to one class or section; each student has many academic, attendance, engagement, and prediction records.
- Required indexes:
  - Index on class_id or section
  - Index on student_code
  - Index on status

### 10.3 academic_records

- Purpose: Store academic performance data across assessments and time.
- Primary key: academic_record_id
- Important fields:
  - academic_record_id
  - student_id
  - assessment_type
  - assessment_date
  - score
  - subject or course
  - grade_label
  - created_at
- Relationships:
  - Many academic records per student
- Required indexes:
  - Index on student_id + assessment_date
  - Index on subject or course

### 10.4 attendance_records

- Purpose: Store attendance data over time.
- Primary key: attendance_record_id
- Important fields:
  - attendance_record_id
  - student_id
  - date
  - present_count
  - total_count
  - attendance_percent
  - marked_absent
  - source
- Relationships:
  - Many attendance records per student
- Required indexes:
  - Index on student_id + date

### 10.5 engagement_records

- Purpose: Store measurable engagement factors and classroom participation signals.
- Primary key: engagement_record_id
- Important fields:
  - engagement_record_id
  - student_id
  - date
  - engagement_score
  - participation_metric
  - source_type
  - quality_flag
  - notes
- Relationships:
  - Many engagement records per student
- Required indexes:
  - Index on student_id + date

### 10.6 predictions

- Purpose: Store prediction runs and current model output.
- Primary key: prediction_id
- Important fields:
  - prediction_id
  - student_id
  - prediction_date
  - predicted_status
  - risk_score
  - model_version
  - feature_summary
  - data_quality_status
- Relationships:
  - One student may have many predictions over time
- Required indexes:
  - Index on student_id + prediction_date
  - Index on predicted_status

### 10.7 prediction_factors

- Purpose: Store explainability factors that contributed to the prediction.
- Primary key: prediction_factor_id
- Important fields:
  - prediction_factor_id
  - prediction_id
  - factor_name
  - factor_value
  - contribution_direction
  - contribution_importance
  - data_availability_status
- Relationships:
  - Many factors per prediction
- Required indexes:
  - Index on prediction_id
  - Index on factor_name

### 10.8 status_history

- Purpose: Store the timeline of status transitions and reasons.
- Primary key: status_history_id
- Important fields:
  - status_history_id
  - student_id
  - previous_status
  - current_status
  - changed_at
  - reason_summary
  - source_prediction_id
- Relationships:
  - Many status entries per student
- Required indexes:
  - Index on student_id + changed_at

### 10.9 alerts

- Purpose: Store faculty alerts about important student events or risk changes.
- Primary key: alert_id
- Important fields:
  - alert_id
  - student_id
  - alert_type
  - severity
  - message
  - created_at
  - read_at
  - source_prediction_id
- Relationships:
  - Many alerts per student; alerts may reference a prediction or status change
- Required indexes:
  - Index on student_id + created_at
  - Index on read_at

---

## 11. Authentication Requirements

### 11.1 Login

- Users log in with a secure credential flow.
- The login process must validate the user and confirm their role.
- Faculty, administrators, and future student users must have distinct access patterns based on role.

### 11.2 Password hashing

- Passwords must never be stored in plaintext.
- Use a secure hashing method such as bcrypt, Argon2, or a similarly strong password-hashing strategy.
- No plaintext credentials should be exposed in logs or UI code.

### 11.3 JWT authentication

- The system should use JWT or equivalent secure token-based authentication for protected API access.
- Tokens should include claims for user identity and role.
- Tokens should support expiration and refresh or reauthentication as needed.

### 11.4 Role-based access control

Roles:

- ADMIN
- FACULTY
- STUDENT

Access should be enforced based on role and account ownership.

### 11.5 Protected APIs

- Protected endpoints must require valid authentication.
- API responses should reject unauthorized requests with 401 or 403 style handling, depending on the context.

### 11.6 Session/token handling

- Tokens should be stored securely on the client or backend as appropriate.
- Expired or invalid tokens must be rejected.
- Session expiry and logout flows should be explicit and clear.

### 11.7 Unauthorized access

- No user should be able to access another student’s profile or other class data unless authorized.
- Unauthorized access attempts must be logged and rejected silently or with a generic error message.

### 11.8 Faculty access restrictions

- Faculty should only access assigned class and student data for their scope.
- Faculty should not be able to alter admin-level settings.

### 11.9 Student access restrictions

- Students should access only their own record and summary information.
- Student access must be separated from faculty access and admin access.

### 11.10 Secret safety

- Never expose API keys, passwords, or secrets in frontend code.
- All secrets should live in secure environment variables or backend-only configuration.

---

## 12. Project Architecture

The architecture should stay simple and practical for a 24-hour hackathon.

Preferred architecture:

React frontend
↓
REST API
↓
Python FastAPI backend
↓
ML / vision modules
↓
PostgreSQL

### Constraints

- No microservices
- No Kubernetes
- No unnecessary distributed systems
- No oversophisticated architecture beyond the project’s small scale

### Purpose

This architecture is practical for a small academic support app with a user-facing dashboard, backend business logic, AI prediction pipeline, and persistent data store.

---

## 13. Folder Structure

A simple future structure is recommended:

project-root/

- frontend/
  - components/
  - pages/
  - services/
  - hooks/
  - styles/
  - tests/
- backend/
  - api/
  - auth/
  - models/
  - schemas/
  - services/
  - ML/
  - vision/
  - tests/
- data/
  - demo/
  - raw/
  - processed/
- docs/
- README.md
- .gitignore
- .env.example

This structure is intentionally lightweight and suitable for a hackathon project. It keeps UI, API, ML, and data concerns separated but simple.

---

## 14. Data Flow

The system should process student support data in a single, understandable pipeline.

Academic data
+
Attendance
+
Engagement
+
Vision indicators
        ↓
Validation and source checks
        ↓
Missing-data handling
        ↓
Feature engineering and normalization
        ↓
Multimodal feature fusion
        ↓
ML prediction
        ↓
Green / Yellow / Red classification
        ↓
Explainable factors
        ↓
Status comparison against prior state
        ↓
Faculty alert generation
        ↓
Faculty support workflow and intervention

### Where each component participates

- Frontend: displays data, status, history, alerts, and user interactions
- Backend: validates requests, prepares API responses, orchestrates prediction requests, enforces auth and RBAC
- Database: stores student, academic, attendance, engagement, prediction, and alert records
- ML: interprets the fused data and produces predictions and explanations
- Vision: generates engagement-related measurable indicators from classroom observations or video streams

---

## 15. Error Handling

The system must clearly distinguish “data unavailable” from “negative behavior.” Missing or failed sources should never be interpreted as a student issue by default.

### 15.1 Login failure

- Show a generic failure message for invalid credentials.
- Do not reveal whether the username or password was the failing element.
- Allow retry without exposing system details.

### 15.2 Invalid input

- Validate required fields and format on both frontend and backend.
- Return clear validation errors for malformed or missing request data.

### 15.3 Unauthorized access

- Return 401 or 403 responses.
- Redirect or block user access to unauthorized resources.
- Hide user-specific data when not allowed.

### 15.4 API unavailable

- Show a user-friendly “service unavailable” or “try again later” message.
- Preserve the current page state if possible.
- Do not silently suppress failures.

### 15.5 Database unavailable

- Show an error state and indicate that data cannot be loaded.
- Use graceful fallback messaging.
- Prevent empty or misleading UI states.

### 15.6 Missing student data

- Show a clear “student data unavailable” notification.
- Do not assume negative behavior.
- Allow partial summary where available.

### 15.7 Missing academic data

- Display academic data as unavailable or partial.
- Explain that the missing academic data may limit model confidence.
- Avoid direct negative interpretation.

### 15.8 Missing attendance

- Surface attendance data status as unavailable rather than low attendance by default.
- Keep attendance absent from risk interpretation unless valid data exists.

### 15.9 Missing engagement

- Use an “engagement data unavailable” label.
- Avoid treating missing engagement as poor participation.

### 15.10 Camera unavailable

- Show camera unavailable or detection disabled status.
- Do not automatically classify as risk simply because the camera or vision feed failed.
- Keep the system in a neutral state.

### 15.11 Vision detection failure

- Surface “vision analysis failed” with a reason when available.
- Keep the prediction pipeline aware that the vision signal is absent or low quality.
- Do not translate detection failure into negative behavior.

### 15.12 ML prediction failure

- If the model fails, show a user-friendly warning.
- Preserve the rest of the student data and show a degraded mode rather than a false risk label.
- Record the failure for monitoring and debugging later.

### Critical rule

Camera failure or missing data must not automatically mean negative behavior. The UI must show a clear reason for the data being unavailable and the system must fall back appropriately.

---

## 16. Testing Requirements

The project should include testing at all major layers.

### 16.1 Frontend testing

Required tests:

- Login flow
- Navigation between screens
- Dashboard rendering
- Search behavior
- Filter behavior
- Student detail page
- Charts and graph loaders
- Alerts interactions
- Responsive layout checks
- Error states and empty states

### 16.2 Backend testing

Required tests:

- Authentication validation
- Authorization enforcement
- API validation for malformed requests
- Student API behavior
- Prediction API behavior
- Alert API behavior

### 16.3 ML testing

Required tests:

- Train, validation, and test data separation
- Missing data handling
- Prediction generation
- Precision measurement
- Recall measurement
- F1-score measurement
- Confusion matrix evaluation
- Group-wise evaluation where applicable

### 16.4 Integration testing

Required end-to-end flow:

Login
→ Dashboard
→ Student
→ Prediction
→ Explanation
→ Alert

This flow should confirm the major system chain works together without hidden assumptions.

### 16.5 Deployment testing

Required checks:

- Production build works
- API connectivity works
- Database connectivity works
- Environment variables are configured correctly
- No secrets are exposed in frontend code

---

## 17. Deployment Requirements

The project must eventually be made accessible through a live deployment.

### Development workflow

Antigravity
→ VS Code
→ GitHub
→ Frontend deployment
→ Backend deployment
→ Final integrated deployment

### Deployment milestones

- The frontend must be deployed during the frontend checkpoint.
- The final system must include all required backend, database, and AI dependencies when ready.
- The system should be deployed in a way that is realistic, reproducible, and understandable for a hackathon team.

### Deployment principle

The architecture should remain simple enough that the team can reliably deploy and verify the app without excessive operational overhead.

---

## 18. GitHub Requirements

The repository must include the following structure and documents:

- Source code
- Documentation
- Setup and run instructions
- Environment configuration examples
- .gitignore
- README with overview and usage
- Project planning and PRD documentation
- Basic contribution or usage notes where appropriate

The project should be GitHub-ready from the start so that the team can maintain a clean history and continue development across checkpoints.

---

## 19. Success Criteria

The MVP will be successful if:

- Faculty can securely access the system.
- Faculty can see a clear summary of students in their class.
- Students with potential support needs are easy to identify.
- Status is shown as Green / Yellow / Red and is understandable.
- The system explains contributing factors based on measurable data.
- Missing data is clearly labeled and never assumed to be negative behavior.
- Faculty can review student progress and trends without excessive complexity.
- The project is deployable as a frontend-first hackathon solution with an architecture ready for later backend and AI growth.

---

## 20. Out-of-Scope for the Current PRD

The following items are intentionally out of scope for this PRD and should be addressed in subsequent technical specification and implementation work:

- Detailed UI design specification beyond required screens and flows
- Application code implementation
- Model training and evaluation code
- Actual dataset download or ingestion strategy
- Backend and database code writing
- Computer vision implementation
- Full production deployment changes beyond architecture and milestones

This PRD is the product and requirements foundation only. It should be used as the specification for the next technical design step.
