# ByteNight — Explainable Student Performance & Early Support System

An AI-assisted academic support platform designed to help educators identify students who may need academic attention before a problem becomes severe. It combines academic assessment trends, attendance consistency, LMS engagement, and classroom vision indicators into a single, explainable support model.

> **Core Philosophy**: Support and early intervention, **not surveillance**. Missing or failed sensor inputs (e.g. camera offline) are treated with non-punitive neutrality and **never** degrade a student's risk category.

---

## 🌟 Key Features

1. **Faculty Intervention Dashboard**:
   - Immediate at-a-glance visibility: *"Which students need attention?"*
   - Real-time status cards: **GREEN (Stable)**, **YELLOW (Needs Monitoring)**, **RED (Requires Attention)** with strict dual-encoding (colors + text labels).
   - Students requiring attention table with direct links to student profiles.
   - Cohort score distribution and attendance health charts.

2. **Overall Student Rankings & Momentum**:
   - Complete class roster with Current Rank, Previous Rank, and Rank Change momentum (`↑`, `↓`, `—`).
   - "Top Performing Students" and "Students with Significant Rank Changes" highlight lists.
   - Filtering and sorting by Rank, Name, Status, Academic Performance, Attendance, Engagement, and Rank Momentum.

3. **360° Explainable Student Profile**:
   - **Academic Performance**: Interactive Recharts trend chart comparing student score against cohort average.
   - **Attendance Consistency**: Visual progress indicator against 75% guidance threshold, absent streak counts, and session logs.
   - **LMS & Coursework**: Weekly portal access frequency and on-time homework submission rates.
   - **Explainable Model Indicators**: Measurable contributing factors (TreeSHAP attributions) providing clear, non-causal educational context.
   - **Performance & Rank History**: Term-by-term assessment and cohort rank progression log.
   - **Status History Timeline**: Auditable timeline of status transitions (e.g., `GREEN → YELLOW → RED` or `RED → YELLOW → GREEN`) with recorded rationales.
   - **Data Availability Transparency**: Clear non-punitive disclosures when sensors or grades are unavailable.

4. **Faculty Alert Center**:
   - Notifications for status degradations, recovery milestones, and sensory data anomalies.
   - Severity filtering (Critical, Warning, Info) and read state tracking.

5. **Classroom Vision Studio (Prototype Preview)**:
   - Optical telemetry monitor showing active students detected, engagement index, and pose heuristics.
   - Clear disclosure: *"Vision analysis service will be connected during the AI/ML integration phase."*

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript 5.x + Vite 8
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Data Visualization**: Recharts (Line charts, Bar charts, Responsive containers)
- **Routing**: React Router DOM v7
- **Architecture**: Modular Service Layer with mock/API toggle (`VITE_USE_MOCK_API`) ready for seamless FastAPI backend integration.

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- Node.js `v18+` (Tested on `v24.19.0`)
- npm `v9+` (Tested on `v11.17.0`)

### Installation & Run Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/ByteNight.git
   cd ByteNight/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Credentials

For testing during hackathon review:

| Role | Institutional Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Faculty Instructor** | `prof.smith@university.edu` | `Password123!` | CS-101 Data Structures (Full Access) |

*Note: The login screen also features an "Auto-fill" button for 1-click evaluation.*

---

## 🧭 Application Routes

| Path | Screen | Description |
| :--- | :--- | :--- |
| `/login` | Faculty Login | Institutional login with demo credentials and session state |
| `/dashboard` | Faculty Dashboard | Overview KPIs, urgent attention students, top performers, alerts |
| `/students` | Roster & Rankings | Searchable, multi-filterable table with all 10 required ranking columns |
| `/students/:id` | Student Profile | 360° dossier: Academic, Attendance, Engagement, SHAP factors, Rank & Status history |
| `/alerts` | Notification Center | Status transitions, recovery alerts, unread counters |
| `/vision` | Vision Studio | Classroom camera telemetry and engagement diagnostic preview |

---

## 👥 Curated Evaluation Archetypes

The demo dataset includes 14 students representing critical real-world academic patterns:

- **Liam Chen (`ST002`, Rank 2, 92%)**: Camera sensor hardware offline (`DATA_UNAVAILABLE`). Status remains **GREEN (Stable)** with zero risk penalty, validating non-punitive sensor handling.
- **Jane Doe (`ST014`, Rank 14, 57%)**: Midterm score drop from 82% to 51% + 2 unexcused absences. Status is **RED (Requires Attention)** with explainability pointing directly to assessment and attendance deltas.
- **Marcus Vance (`ST006`, Rank 6, 83%)**: Climbed from Rank 11 to Rank 6 (`↑ 5`). Transitioned from `RED → YELLOW → GREEN` following strong recovery on Midterm (88%).
- **Aria Patel (`ST009`, Rank 9, 75%)**: High academic baseline, but attendance slipped to 72% $\rightarrow$ Status is **YELLOW (Needs Monitoring)**, demonstrating early-warning intervention before grades drop.

---

## 📦 Project Structure

```
ByteNight/
├── docs/
│   ├── PRD.md                          # Product Requirements Document
│   └── TECHNICAL_SPEC.md               # Technical Specification
├── frontend/                           # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                 # StatusBadge, DataAvailabilityChip, RankChangeIndicator
│   │   │   ├── layout/                 # Navbar, Footer
│   │   │   ├── dashboard/              # KpiCard, UrgentAttentionTable, TopPerformers, Charts
│   │   │   ├── students/               # StudentSearchFilter, StudentRankingTable
│   │   │   ├── studentDetail/          # ProfileHeader, Academic, Attendance, SHAP factors
│   │   │   ├── alerts/                 # AlertList
│   │   │   └── vision/                 # VisionStudio
│   │   ├── context/                    # AuthContext, AlertContext
│   │   ├── data/                       # mockData.ts (Centralized realistic demo data)
│   │   ├── services/                   # api.ts, studentService, authService, dashboardService
│   │   ├── types/                      # student.types.ts
│   │   ├── pages/                      # LoginPage, Dashboard, Roster, Profile, Alerts, Vision
│   │   ├── App.tsx                     # React Router configuration & Protected routes
│   │   └── main.tsx                    # Entrypoint
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
├── .env.example
└── README.md
```

---

## 🌐 Deployment (Frontend)

To deploy to **Vercel** or **Netlify**:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
