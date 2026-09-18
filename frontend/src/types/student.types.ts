export type StudentStatus = 'GREEN' | 'YELLOW' | 'RED';

export type DataAvailabilityStatus = 'AVAILABLE' | 'DATA_UNAVAILABLE' | 'LOW_CONFIDENCE';

export type PerformanceTrend = 'IMPROVING' | 'STABLE' | 'DECLINING';

export type FactorDirection = 'INCREASES_RISK' | 'DECREASES_RISK' | 'NEUTRAL';

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  email: string;
  className: string;
  section: string;
  avatarUrl?: string;
  
  // Status and Risk
  currentStatus: StudentStatus;
  riskScore: number; // 0.0 to 1.0
  trend: PerformanceTrend;
  
  // Core Metrics (0 - 100)
  academicScore: number;
  attendancePercentage: number;
  engagementScore: number;
  
  // Ranking System
  currentRank: number;
  previousRank: number;
  bestRank: number;
  rankChange: number; // e.g. +2 (improved), -3 (declined), 0 (unchanged)
  
  // Data Availability Flags
  dataAvailability: {
    academic: DataAvailabilityStatus;
    attendance: DataAvailabilityStatus;
    engagement: DataAvailabilityStatus;
    vision: DataAvailabilityStatus;
  };
  
  lastEvaluated: string;
}

export interface AcademicRecord {
  id: string;
  subject: string;
  assessmentType: string;
  assessmentDate: string;
  score: number;
  maxScore: number;
  gradeLabel: string;
  classAverage: number;
  status: DataAvailabilityStatus;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  sessionName: string;
  notes?: string;
}

export interface EngagementMetrics {
  overallScore: number;
  participationLevel: 'HIGH' | 'MODERATE' | 'LOW';
  lmsLoginsWeekly: number;
  onTimeSubmissionsRate: number;
  visionEngagementIndex: number | null;
  visionStatus: DataAvailabilityStatus;
  visionNote: string;
}

export interface ContributingFactor {
  id: string;
  factorName: string;
  featureKey: string;
  featureValue: string | number | null;
  shapValue: number;
  direction: FactorDirection;
  description: string;
  dataAvailability: DataAvailabilityStatus;
}

export interface StatusTransition {
  id: string;
  previousStatus: StudentStatus | null;
  currentStatus: StudentStatus;
  changedAt: string;
  reasonSummary: string;
  sourcePredictionId?: string;
}

export interface RankHistoryEntry {
  term: string;
  date: string;
  rank: number;
  score: number;
}

export interface StudentDetailData {
  student: Student;
  academicRecords: AcademicRecord[];
  attendanceRecords: AttendanceRecord[];
  engagement: EngagementMetrics;
  contributingFactors: ContributingFactor[];
  statusHistory: StatusTransition[];
  rankHistory: RankHistoryEntry[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'FACULTY' | 'ADMIN' | 'STUDENT';
  department: string;
  assignedClasses: string[];
}

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  alertType: 'STATUS_DEGRADATION' | 'STATUS_RECOVERY' | 'DATA_ANOMALY';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface DashboardSummary {
  totalStudents: number;
  statusDistribution: {
    GREEN: number;
    YELLOW: number;
    RED: number;
  };
  classAverageScore: number;
  averageAttendance: number;
  activeAlertsCount: number;
  recentAlerts: Alert[];
  urgentStudents: Student[];
  topPerformers: Student[];
  significantRankChanges: Student[];
  dataQualityHealth: {
    completeProfilesCount: number;
    cameraSensorStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  };
}
