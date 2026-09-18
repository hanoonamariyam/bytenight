import { 
  Student, 
  AcademicRecord, 
  AttendanceRecord, 
  EngagementMetrics, 
  ContributingFactor, 
  StatusTransition, 
  RankHistoryEntry, 
  StudentDetailData, 
  Alert, 
  User 
} from '../types/student.types';

export const MOCK_FACULTY_USER: User = {
  id: 'usr_sarah_smith',
  email: 'prof.smith@university.edu',
  fullName: 'Dr. Sarah Smith',
  role: 'FACULTY',
  department: 'Computer Science & Engineering',
  assignedClasses: ['CS-101: Data Structures & Algorithms (Sec A)']
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'stu_001',
    studentCode: 'ST001',
    fullName: 'Sophia Al-Mansoor',
    email: 'sophia.m@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'GREEN',
    riskScore: 0.08,
    trend: 'IMPROVING',
    academicScore: 95.4,
    attendancePercentage: 98.0,
    engagementScore: 96.0,
    currentRank: 1,
    previousRank: 2,
    bestRank: 1,
    rankChange: 1, // ↑ 1
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_002',
    studentCode: 'ST002',
    fullName: 'Liam Chen',
    email: 'liam.chen@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'GREEN',
    riskScore: 0.12,
    trend: 'STABLE',
    academicScore: 92.1,
    attendancePercentage: 94.5,
    engagementScore: 89.0,
    currentRank: 2,
    previousRank: 1,
    bestRank: 1,
    rankChange: -1, // ↓ 1
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'DATA_UNAVAILABLE' // Camera sensor offline in his classroom quadrant
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_003',
    studentCode: 'ST003',
    fullName: 'Ananya Sharma',
    email: 'ananya.s@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'GREEN',
    riskScore: 0.16,
    trend: 'IMPROVING',
    academicScore: 89.5,
    attendancePercentage: 92.0,
    engagementScore: 91.0,
    currentRank: 3,
    previousRank: 4,
    bestRank: 3,
    rankChange: 1, // ↑ 1
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_004',
    studentCode: 'ST004',
    fullName: 'Ethan Wright',
    email: 'ethan.w@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'GREEN',
    riskScore: 0.22,
    trend: 'STABLE',
    academicScore: 86.8,
    attendancePercentage: 90.0,
    engagementScore: 85.0,
    currentRank: 4,
    previousRank: 4,
    bestRank: 4,
    rankChange: 0, // No Change
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_005',
    studentCode: 'ST005',
    fullName: 'Zoe Martinez',
    email: 'zoe.m@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'GREEN',
    riskScore: 0.25,
    trend: 'STABLE',
    academicScore: 84.6,
    attendancePercentage: 88.5,
    engagementScore: 82.0,
    currentRank: 5,
    previousRank: 6,
    bestRank: 5,
    rankChange: 1, // ↑ 1
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_006',
    studentCode: 'ST006',
    fullName: 'Marcus Vance',
    email: 'marcus.v@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'GREEN',
    riskScore: 0.28,
    trend: 'IMPROVING', // Remarkable recovery archetype
    academicScore: 83.2,
    attendancePercentage: 91.0,
    engagementScore: 84.0,
    currentRank: 6,
    previousRank: 11,
    bestRank: 6,
    rankChange: 5, // ↑ 5 significant improvement
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_007',
    studentCode: 'ST007',
    fullName: 'David Kim',
    email: 'david.kim@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'GREEN',
    riskScore: 0.32,
    trend: 'STABLE',
    academicScore: 80.4,
    attendancePercentage: 86.0,
    engagementScore: 78.0,
    currentRank: 7,
    previousRank: 7,
    bestRank: 6,
    rankChange: 0, // No Change
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'LOW_CONFIDENCE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_008',
    studentCode: 'ST008',
    fullName: 'Chloe Bennett',
    email: 'chloe.b@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'YELLOW',
    riskScore: 0.49,
    trend: 'DECLINING',
    academicScore: 76.5,
    attendancePercentage: 79.0,
    engagementScore: 74.0,
    currentRank: 8,
    previousRank: 6,
    bestRank: 5,
    rankChange: -2, // ↓ 2
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_009',
    studentCode: 'ST009',
    fullName: 'Aria Patel',
    email: 'aria.patel@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'YELLOW',
    riskScore: 0.54,
    trend: 'DECLINING', // Early warning archetype: strong marks but recent attendance dip
    academicScore: 75.0,
    attendancePercentage: 72.4,
    engagementScore: 71.0,
    currentRank: 9,
    previousRank: 5,
    bestRank: 4,
    rankChange: -4, // ↓ 4 significant rank drop
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_010',
    studentCode: 'ST010',
    fullName: 'Carlos Rodriguez',
    email: 'carlos.r@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'YELLOW',
    riskScore: 0.58,
    trend: 'STABLE',
    academicScore: 72.8,
    attendancePercentage: 75.0,
    engagementScore: 68.0,
    currentRank: 10,
    previousRank: 9,
    bestRank: 8,
    rankChange: -1, // ↓ 1
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'DATA_UNAVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_011',
    studentCode: 'ST011',
    fullName: 'Priya Nair',
    email: 'priya.n@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'YELLOW',
    riskScore: 0.62,
    trend: 'DECLINING',
    academicScore: 69.2,
    attendancePercentage: 71.0,
    engagementScore: 65.0,
    currentRank: 11,
    previousRank: 10,
    bestRank: 9,
    rankChange: -1, // ↓ 1
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_012',
    studentCode: 'ST012',
    fullName: 'Tariq Johnson',
    email: 'tariq.j@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'RED',
    riskScore: 0.74,
    trend: 'DECLINING',
    academicScore: 64.0,
    attendancePercentage: 66.5,
    engagementScore: 58.0,
    currentRank: 12,
    previousRank: 10,
    bestRank: 8,
    rankChange: -2, // ↓ 2
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'AVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_013',
    studentCode: 'ST013',
    fullName: 'Lucas Silva',
    email: 'lucas.s@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'RED',
    riskScore: 0.79,
    trend: 'DECLINING',
    academicScore: 60.5,
    attendancePercentage: 64.0,
    engagementScore: 54.0,
    currentRank: 13,
    previousRank: 12,
    bestRank: 10,
    rankChange: -1, // ↓ 1
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'LOW_CONFIDENCE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  },
  {
    id: 'stu_014',
    studentCode: 'ST014',
    fullName: 'Jane Doe',
    email: 'jane.doe@university.edu',
    className: 'CS-101 Sec A',
    section: 'A',
    currentStatus: 'RED',
    riskScore: 0.84,
    trend: 'DECLINING', // Clear at-risk archetype
    academicScore: 57.2,
    attendancePercentage: 61.5,
    engagementScore: 50.0,
    currentRank: 14,
    previousRank: 11,
    bestRank: 9,
    rankChange: -3, // ↓ 3
    dataAvailability: {
      academic: 'AVAILABLE',
      attendance: 'AVAILABLE',
      engagement: 'AVAILABLE',
      vision: 'DATA_UNAVAILABLE'
    },
    lastEvaluated: '2026-09-18T10:30:00Z'
  }
];

export const MOCK_ACADEMIC_RECORDS: Record<string, AcademicRecord[]> = {
  stu_014: [
    { id: 'ar_01', subject: 'Data Structures', assessmentType: 'Quiz 1', assessmentDate: '2026-08-10', score: 82, maxScore: 100, gradeLabel: 'B', classAverage: 78, status: 'AVAILABLE' },
    { id: 'ar_02', subject: 'Data Structures', assessmentType: 'Lab Assignment 1', assessmentDate: '2026-08-22', score: 76, maxScore: 100, gradeLabel: 'C+', classAverage: 81, status: 'AVAILABLE' },
    { id: 'ar_03', subject: 'Data Structures', assessmentType: 'Quiz 2', assessmentDate: '2026-09-02', score: 62, maxScore: 100, gradeLabel: 'D', classAverage: 75, status: 'AVAILABLE' },
    { id: 'ar_04', subject: 'Data Structures', assessmentType: 'Midterm Exam', assessmentDate: '2026-09-14', score: 51, maxScore: 100, gradeLabel: 'F', classAverage: 74, status: 'AVAILABLE' }
  ],
  stu_002: [
    { id: 'ar_05', subject: 'Data Structures', assessmentType: 'Quiz 1', assessmentDate: '2026-08-10', score: 95, maxScore: 100, gradeLabel: 'A', classAverage: 78, status: 'AVAILABLE' },
    { id: 'ar_06', subject: 'Data Structures', assessmentType: 'Lab Assignment 1', assessmentDate: '2026-08-22', score: 92, maxScore: 100, gradeLabel: 'A-', classAverage: 81, status: 'AVAILABLE' },
    { id: 'ar_07', subject: 'Data Structures', assessmentType: 'Quiz 2', assessmentDate: '2026-09-02', score: 89, maxScore: 100, gradeLabel: 'B+', classAverage: 75, status: 'AVAILABLE' },
    { id: 'ar_08', subject: 'Data Structures', assessmentType: 'Midterm Exam', assessmentDate: '2026-09-14', score: 92, maxScore: 100, gradeLabel: 'A-', classAverage: 74, status: 'AVAILABLE' }
  ],
  stu_006: [
    { id: 'ar_09', subject: 'Data Structures', assessmentType: 'Quiz 1', assessmentDate: '2026-08-10', score: 58, maxScore: 100, gradeLabel: 'F', classAverage: 78, status: 'AVAILABLE' },
    { id: 'ar_10', subject: 'Data Structures', assessmentType: 'Lab Assignment 1', assessmentDate: '2026-08-22', score: 71, maxScore: 100, gradeLabel: 'C', classAverage: 81, status: 'AVAILABLE' },
    { id: 'ar_11', subject: 'Data Structures', assessmentType: 'Quiz 2', assessmentDate: '2026-09-02', score: 82, maxScore: 100, gradeLabel: 'B', classAverage: 75, status: 'AVAILABLE' },
    { id: 'ar_12', subject: 'Data Structures', assessmentType: 'Midterm Exam', assessmentDate: '2026-09-14', score: 88, maxScore: 100, gradeLabel: 'B+', classAverage: 74, status: 'AVAILABLE' }
  ],
  stu_009: [
    { id: 'ar_13', subject: 'Data Structures', assessmentType: 'Quiz 1', assessmentDate: '2026-08-10', score: 86, maxScore: 100, gradeLabel: 'B', classAverage: 78, status: 'AVAILABLE' },
    { id: 'ar_14', subject: 'Data Structures', assessmentType: 'Lab Assignment 1', assessmentDate: '2026-08-22', score: 84, maxScore: 100, gradeLabel: 'B', classAverage: 81, status: 'AVAILABLE' },
    { id: 'ar_15', subject: 'Data Structures', assessmentType: 'Quiz 2', assessmentDate: '2026-09-02', score: 74, maxScore: 100, gradeLabel: 'C', classAverage: 75, status: 'AVAILABLE' },
    { id: 'ar_16', subject: 'Data Structures', assessmentType: 'Midterm Exam', assessmentDate: '2026-09-14', score: 71, maxScore: 100, gradeLabel: 'C', classAverage: 74, status: 'AVAILABLE' }
  ]
};

export const MOCK_ATTENDANCE_RECORDS: Record<string, AttendanceRecord[]> = {
  stu_014: [
    { id: 'att_01', date: '2026-09-18', status: 'ABSENT', sessionName: 'Lecture 14: Trees & Traversals', notes: 'Unexcused absence' },
    { id: 'att_02', date: '2026-09-16', status: 'ABSENT', sessionName: 'Lab 7: Binary Search Trees', notes: 'Unexcused absence' },
    { id: 'att_03', date: '2026-09-14', status: 'PRESENT', sessionName: 'Lecture 13: Midterm Review' },
    { id: 'att_04', date: '2026-09-11', status: 'LATE', sessionName: 'Lecture 12: Stacks & Queues', notes: 'Arrived 20 mins late' },
    { id: 'att_05', date: '2026-09-09', status: 'ABSENT', sessionName: 'Lab 6: Linked List Implementations', notes: 'Unexcused absence' },
    { id: 'att_06', date: '2026-09-07', status: 'PRESENT', sessionName: 'Lecture 11: Complexity Analysis' }
  ],
  stu_002: [
    { id: 'att_07', date: '2026-09-18', status: 'PRESENT', sessionName: 'Lecture 14: Trees & Traversals' },
    { id: 'att_08', date: '2026-09-16', status: 'PRESENT', sessionName: 'Lab 7: Binary Search Trees' },
    { id: 'att_09', date: '2026-09-14', status: 'PRESENT', sessionName: 'Lecture 13: Midterm Review' },
    { id: 'att_10', date: '2026-09-11', status: 'PRESENT', sessionName: 'Lecture 12: Stacks & Queues' },
    { id: 'att_11', date: '2026-09-09', status: 'PRESENT', sessionName: 'Lab 6: Linked List Implementations' }
  ],
  stu_006: [
    { id: 'att_12', date: '2026-09-18', status: 'PRESENT', sessionName: 'Lecture 14: Trees & Traversals' },
    { id: 'att_13', date: '2026-09-16', status: 'PRESENT', sessionName: 'Lab 7: Binary Search Trees' },
    { id: 'att_14', date: '2026-09-14', status: 'PRESENT', sessionName: 'Lecture 13: Midterm Review' },
    { id: 'att_15', date: '2026-09-11', status: 'PRESENT', sessionName: 'Lecture 12: Stacks & Queues' },
    { id: 'att_16', date: '2026-09-09', status: 'PRESENT', sessionName: 'Lab 6: Linked List Implementations' }
  ]
};

export const MOCK_ENGAGEMENT_METRICS: Record<string, EngagementMetrics> = {
  stu_014: {
    overallScore: 50.0,
    participationLevel: 'LOW',
    lmsLoginsWeekly: 2.1,
    onTimeSubmissionsRate: 50.0,
    visionEngagementIndex: null,
    visionStatus: 'DATA_UNAVAILABLE',
    visionNote: 'Classroom camera feed unavailable in seat zone. Status evaluated neutrally on academic and attendance signals without penalty.'
  },
  stu_002: {
    overallScore: 89.0,
    participationLevel: 'HIGH',
    lmsLoginsWeekly: 6.4,
    onTimeSubmissionsRate: 100.0,
    visionEngagementIndex: null,
    visionStatus: 'DATA_UNAVAILABLE',
    visionNote: 'Vision camera currently offline. In accordance with early support fairness guidelines, missing visual indicators are not penalized.'
  },
  stu_006: {
    overallScore: 84.0,
    participationLevel: 'HIGH',
    lmsLoginsWeekly: 5.8,
    onTimeSubmissionsRate: 92.0,
    visionEngagementIndex: 82.5,
    visionStatus: 'AVAILABLE',
    visionNote: 'Active participation detected in classroom sessions over the past 3 weeks.'
  },
  stu_009: {
    overallScore: 71.0,
    participationLevel: 'MODERATE',
    lmsLoginsWeekly: 3.5,
    onTimeSubmissionsRate: 80.0,
    visionEngagementIndex: 74.0,
    visionStatus: 'AVAILABLE',
    visionNote: 'Classroom visual signals consistent with moderate participation.'
  }
};

export const MOCK_CONTRIBUTING_FACTORS: Record<string, ContributingFactor[]> = {
  stu_014: [
    {
      id: 'cf_01',
      factorName: 'Midterm Exam Performance Drop',
      featureKey: 'academic_delta_midterm',
      featureValue: '-31% vs Quiz 1',
      shapValue: 0.32,
      direction: 'INCREASES_RISK',
      description: 'Significant downward trend from 82% on Quiz 1 down to 51% on Midterm assessment.',
      dataAvailability: 'AVAILABLE'
    },
    {
      id: 'cf_02',
      factorName: 'Recent Attendance Consistency',
      featureKey: 'attendance_consecutive_absent',
      featureValue: '2 consecutive absences',
      shapValue: 0.28,
      direction: 'INCREASES_RISK',
      description: 'Attendance dropped to 61.5% with 2 unexcused absences in the last week.',
      dataAvailability: 'AVAILABLE'
    },
    {
      id: 'cf_03',
      factorName: 'Digital Coursework Activity',
      featureKey: 'lms_submission_rate',
      featureValue: '50% on-time',
      shapValue: 0.12,
      direction: 'INCREASES_RISK',
      description: 'Portal submissions indicate overdue coursework in the last two modules.',
      dataAvailability: 'AVAILABLE'
    },
    {
      id: 'cf_04',
      factorName: 'Classroom Vision Sensor',
      featureKey: 'vision_pose_score',
      featureValue: null,
      shapValue: 0.0,
      direction: 'NEUTRAL',
      description: 'Camera sensor unavailable. Factor imputed to neutral baseline to ensure zero negative bias.',
      dataAvailability: 'DATA_UNAVAILABLE'
    }
  ],
  stu_002: [
    {
      id: 'cf_05',
      factorName: 'Assessment Consistency',
      featureKey: 'academic_average',
      featureValue: '92.1% average',
      shapValue: -0.38,
      direction: 'DECREASES_RISK',
      description: 'Consistent top-quartile performance across all quizzes and assignments.',
      dataAvailability: 'AVAILABLE'
    },
    {
      id: 'cf_06',
      factorName: 'Attendance Consistency',
      featureKey: 'attendance_rate',
      featureValue: '94.5% attendance',
      shapValue: -0.29,
      direction: 'DECREASES_RISK',
      description: 'Reliable class presence with zero unexcused absences.',
      dataAvailability: 'AVAILABLE'
    },
    {
      id: 'cf_07',
      factorName: 'Classroom Vision Sensor',
      featureKey: 'vision_pose_score',
      featureValue: null,
      shapValue: 0.0,
      direction: 'NEUTRAL',
      description: 'Camera feed unavailable. Neutral attribution applied — student remains in GREEN status.',
      dataAvailability: 'DATA_UNAVAILABLE'
    }
  ],
  stu_006: [
    {
      id: 'cf_08',
      factorName: 'Positive Academic Recovery',
      featureKey: 'academic_delta_recent',
      featureValue: '+30% score rise',
      shapValue: -0.35,
      direction: 'DECREASES_RISK',
      description: 'Remarkable improvement from 58% on Quiz 1 up to 88% on Midterm assessment.',
      dataAvailability: 'AVAILABLE'
    },
    {
      id: 'cf_09',
      factorName: 'Restored Attendance Routine',
      featureKey: 'attendance_streak',
      featureValue: '100% last 3 weeks',
      shapValue: -0.22,
      direction: 'DECREASES_RISK',
      description: 'Perfect lecture and lab attendance following academic counseling check-in.',
      dataAvailability: 'AVAILABLE'
    }
  ],
  stu_009: [
    {
      id: 'cf_10',
      factorName: 'Recent Attendance Decline',
      featureKey: 'attendance_rate_30d',
      featureValue: '72.4% (slipping)',
      shapValue: 0.26,
      direction: 'INCREASES_RISK',
      description: 'Attendance has fallen below the 80% guideline over the past fortnight.',
      dataAvailability: 'AVAILABLE'
    },
    {
      id: 'cf_11',
      factorName: 'Baseline Academic Foundation',
      featureKey: 'academic_cumulative',
      featureValue: '75.0% average',
      shapValue: -0.15,
      direction: 'DECREASES_RISK',
      description: 'Current assessment scores demonstrate solid subject grasp despite attendance dip.',
      dataAvailability: 'AVAILABLE'
    }
  ]
};

export const MOCK_STATUS_HISTORIES: Record<string, StatusTransition[]> = {
  stu_014: [
    { id: 'sh_01', previousStatus: 'YELLOW', currentStatus: 'RED', changedAt: '2026-09-15T09:30:00Z', reasonSummary: 'Midterm exam score dropped to 51% coupled with 2 consecutive unexcused lecture absences.' },
    { id: 'sh_02', previousStatus: 'GREEN', currentStatus: 'YELLOW', changedAt: '2026-09-03T11:00:00Z', reasonSummary: 'Quiz 2 score fell below class median; attendance dipped to 74%.' }
  ],
  stu_002: [
    { id: 'sh_03', previousStatus: null, currentStatus: 'GREEN', changedAt: '2026-08-10T08:00:00Z', reasonSummary: 'Initial assessment and onboarding complete; steady high performance verified.' }
  ],
  stu_006: [
    { id: 'sh_04', previousStatus: 'YELLOW', currentStatus: 'GREEN', changedAt: '2026-09-16T14:00:00Z', reasonSummary: 'Consolidated recovery verified: Midterm score rose to 88% with sustained 100% attendance streak.' },
    { id: 'sh_05', previousStatus: 'RED', currentStatus: 'YELLOW', changedAt: '2026-09-04T10:15:00Z', reasonSummary: 'Quiz 2 score improved to 82%; attended all remedial lab tutoring sessions.' },
    { id: 'sh_06', previousStatus: 'GREEN', currentStatus: 'RED', changedAt: '2026-08-12T09:00:00Z', reasonSummary: 'Initial Quiz 1 dip to 58% combined with 3 unexcused early absences.' }
  ],
  stu_009: [
    { id: 'sh_07', previousStatus: 'GREEN', currentStatus: 'YELLOW', changedAt: '2026-09-12T16:20:00Z', reasonSummary: 'Early monitoring triggered: Attendance fell from 88% to 72% over consecutive sessions.' }
  ]
};

export const MOCK_RANK_HISTORIES: Record<string, RankHistoryEntry[]> = {
  stu_014: [
    { term: 'Week 2 (Initial Quiz)', date: '2026-08-10', rank: 9, score: 82 },
    { term: 'Week 4 (Lab 1)', date: '2026-08-22', rank: 10, score: 76 },
    { term: 'Week 6 (Quiz 2)', date: '2026-09-02', rank: 11, score: 62 },
    { term: 'Week 8 (Midterm)', date: '2026-09-14', rank: 14, score: 51 }
  ],
  stu_002: [
    { term: 'Week 2 (Initial Quiz)', date: '2026-08-10', rank: 1, score: 95 },
    { term: 'Week 4 (Lab 1)', date: '2026-08-22', rank: 1, score: 92 },
    { term: 'Week 6 (Quiz 2)', date: '2026-09-02', rank: 1, score: 89 },
    { term: 'Week 8 (Midterm)', date: '2026-09-14', rank: 2, score: 92 }
  ],
  stu_006: [
    { term: 'Week 2 (Initial Quiz)', date: '2026-08-10', rank: 13, score: 58 },
    { term: 'Week 4 (Lab 1)', date: '2026-08-22', rank: 12, score: 71 },
    { term: 'Week 6 (Quiz 2)', date: '2026-09-02', rank: 9, score: 82 },
    { term: 'Week 8 (Midterm)', date: '2026-09-14', rank: 6, score: 88 }
  ],
  stu_009: [
    { term: 'Week 2 (Initial Quiz)', date: '2026-08-10', rank: 4, score: 86 },
    { term: 'Week 4 (Lab 1)', date: '2026-08-22', rank: 5, score: 84 },
    { term: 'Week 6 (Quiz 2)', date: '2026-09-02', rank: 7, score: 74 },
    { term: 'Week 8 (Midterm)', date: '2026-09-14', rank: 9, score: 71 }
  ]
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alt_01',
    studentId: 'stu_014',
    studentName: 'Jane Doe',
    studentCode: 'ST014',
    alertType: 'STATUS_DEGRADATION',
    severity: 'CRITICAL',
    title: 'Status Shift: Requires Attention (RED)',
    message: 'Jane Doe moved from YELLOW to RED following a midterm score drop to 51% and 2 consecutive unexcused absences.',
    timestamp: '2026-09-15T09:30:00Z',
    isRead: false
  },
  {
    id: 'alt_02',
    studentId: 'stu_009',
    studentName: 'Aria Patel',
    studentCode: 'ST009',
    alertType: 'STATUS_DEGRADATION',
    severity: 'WARNING',
    title: 'Status Shift: Needs Monitoring (YELLOW)',
    message: 'Aria Patel transitioned to YELLOW due to an attendance drop from 88% to 72% across recent lab modules.',
    timestamp: '2026-09-12T16:20:00Z',
    isRead: false
  },
  {
    id: 'alt_03',
    studentId: 'stu_006',
    studentName: 'Marcus Vance',
    studentCode: 'ST006',
    alertType: 'STATUS_RECOVERY',
    severity: 'INFO',
    title: 'Positive Recovery: Stable (GREEN)',
    message: 'Marcus Vance improved to GREEN status and climbed 5 rank positions following strong midterm results (88%).',
    timestamp: '2026-09-16T14:00:00Z',
    isRead: true
  },
  {
    id: 'alt_04',
    studentId: 'stu_002',
    studentName: 'Liam Chen',
    studentCode: 'ST002',
    alertType: 'DATA_ANOMALY',
    severity: 'INFO',
    title: 'Data Availability: Camera Feed Offline',
    message: 'Classroom camera sensor offline for Liam Chen seat zone. Model continues running neutrally without risk penalty.',
    timestamp: '2026-09-17T08:15:00Z',
    isRead: true
  },
  {
    id: 'alt_05',
    studentId: 'stu_012',
    studentName: 'Tariq Johnson',
    studentCode: 'ST012',
    alertType: 'STATUS_DEGRADATION',
    severity: 'WARNING',
    title: 'Status Shift: Requires Attention (RED)',
    message: 'Tariq Johnson slipped into RED status due to declining quiz performance and incomplete homework modules.',
    timestamp: '2026-09-13T11:45:00Z',
    isRead: false
  }
];

export function getMockStudentDetail(studentId: string): StudentDetailData | null {
  const student = MOCK_STUDENTS.find(s => s.id === studentId || s.studentCode === studentId);
  if (!student) return null;

  // If specific records exist, use them; otherwise synthesize plausible records
  const academicRecords = MOCK_ACADEMIC_RECORDS[student.id] || [
    { id: `ar_${student.id}_1`, subject: 'Data Structures', assessmentType: 'Quiz 1', assessmentDate: '2026-08-10', score: Math.min(100, Math.round(student.academicScore + 3)), maxScore: 100, gradeLabel: 'B+', classAverage: 78, status: 'AVAILABLE' },
    { id: `ar_${student.id}_2`, subject: 'Data Structures', assessmentType: 'Lab 1', assessmentDate: '2026-08-22', score: Math.min(100, Math.round(student.academicScore + 1)), maxScore: 100, gradeLabel: 'B', classAverage: 81, status: 'AVAILABLE' },
    { id: `ar_${student.id}_3`, subject: 'Data Structures', assessmentType: 'Quiz 2', assessmentDate: '2026-09-02', score: Math.max(40, Math.round(student.academicScore - 2)), maxScore: 100, gradeLabel: 'B-', classAverage: 75, status: 'AVAILABLE' },
    { id: `ar_${student.id}_4`, subject: 'Data Structures', assessmentType: 'Midterm', assessmentDate: '2026-09-14', score: Math.round(student.academicScore), maxScore: 100, gradeLabel: 'B', classAverage: 74, status: 'AVAILABLE' }
  ];

  const attendanceRecords = MOCK_ATTENDANCE_RECORDS[student.id] || [
    { id: `att_${student.id}_1`, date: '2026-09-18', status: 'PRESENT', sessionName: 'Lecture 14: Trees & Traversals' },
    { id: `att_${student.id}_2`, date: '2026-09-16', status: 'PRESENT', sessionName: 'Lab 7: Binary Search Trees' },
    { id: `att_${student.id}_3`, date: '2026-09-14', status: student.attendancePercentage > 75 ? 'PRESENT' : 'ABSENT', sessionName: 'Lecture 13: Midterm Review' },
    { id: `att_${student.id}_4`, date: '2026-09-11', status: 'PRESENT', sessionName: 'Lecture 12: Stacks & Queues' }
  ];

  const engagement = MOCK_ENGAGEMENT_METRICS[student.id] || {
    overallScore: student.engagementScore,
    participationLevel: student.engagementScore > 80 ? 'HIGH' : student.engagementScore > 65 ? 'MODERATE' : 'LOW',
    lmsLoginsWeekly: Number((student.engagementScore / 15).toFixed(1)),
    onTimeSubmissionsRate: student.engagementScore,
    visionEngagementIndex: student.dataAvailability.vision === 'AVAILABLE' ? student.engagementScore : null,
    visionStatus: student.dataAvailability.vision,
    visionNote: student.dataAvailability.vision === 'DATA_UNAVAILABLE' 
      ? 'Vision data unavailable. Evaluated neutrally without risk penalty.'
      : 'Visual indicators captured within standard active classroom ranges.'
  };

  const contributingFactors = MOCK_CONTRIBUTING_FACTORS[student.id] || [
    {
      id: `cf_${student.id}_1`,
      factorName: 'Academic Score Average',
      featureKey: 'academic_score',
      featureValue: `${student.academicScore}%`,
      shapValue: student.currentStatus === 'RED' ? 0.25 : student.currentStatus === 'YELLOW' ? 0.10 : -0.22,
      direction: student.currentStatus === 'GREEN' ? 'DECREASES_RISK' : 'INCREASES_RISK',
      description: `Student maintains a ${student.academicScore}% aggregate score across all core assessments.`,
      dataAvailability: 'AVAILABLE'
    },
    {
      id: `cf_${student.id}_2`,
      factorName: 'Attendance Consistency',
      featureKey: 'attendance_rate',
      featureValue: `${student.attendancePercentage}%`,
      shapValue: student.attendancePercentage < 75 ? 0.22 : -0.18,
      direction: student.attendancePercentage < 75 ? 'INCREASES_RISK' : 'DECREASES_RISK',
      description: `Cumulative attendance recorded at ${student.attendancePercentage}%.`,
      dataAvailability: 'AVAILABLE'
    }
  ];

  const statusHistory = MOCK_STATUS_HISTORIES[student.id] || [
    {
      id: `sh_${student.id}_1`,
      previousStatus: null,
      currentStatus: student.currentStatus,
      changedAt: '2026-08-15T09:00:00Z',
      reasonSummary: `Initial baseline status established as ${student.currentStatus}.`
    }
  ];

  const rankHistory = MOCK_RANK_HISTORIES[student.id] || [
    { term: 'Week 2 (Initial Quiz)', date: '2026-08-10', rank: student.previousRank, score: Math.round(student.academicScore - 2) },
    { term: 'Week 4 (Lab 1)', date: '2026-08-22', rank: student.previousRank, score: Math.round(student.academicScore - 1) },
    { term: 'Week 6 (Quiz 2)', date: '2026-09-02', rank: student.previousRank, score: Math.round(student.academicScore + 1) },
    { term: 'Week 8 (Midterm)', date: '2026-09-14', rank: student.currentRank, score: Math.round(student.academicScore) }
  ];

  return {
    student,
    academicRecords,
    attendanceRecords,
    engagement,
    contributingFactors,
    statusHistory,
    rankHistory
  };
}
