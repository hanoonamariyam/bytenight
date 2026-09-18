import { 
  Student, 
  StudentStatus, 
  StudentDetailData, 
  AcademicRecord, 
  AttendanceRecord, 
  EngagementMetrics, 
  ContributingFactor, 
  StatusTransition, 
  RankHistoryEntry 
} from '../types/student.types';
import { MOCK_STUDENTS, getMockStudentDetail } from '../data/mockData';
import { simulateLatency } from './api';

export interface StudentFilterParams {
  search?: string;
  status?: 'ALL' | StudentStatus;
  sortBy?: 'rank' | 'name' | 'status' | 'academic' | 'attendance' | 'engagement' | 'rankChange';
  sortOrder?: 'asc' | 'desc';
}

class StudentService {
  // Corresponds to GET /api/v1/students
  async getStudents(params: StudentFilterParams = {}): Promise<Student[]> {
    await simulateLatency(250);

    let filtered = [...MOCK_STUDENTS];

    // Search query
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        s => s.fullName.toLowerCase().includes(q) || s.studentCode.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter(s => s.currentStatus === params.status);
    }

    // Sorting
    const sortBy = params.sortBy || 'rank';
    const sortOrder = params.sortOrder || 'asc';

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'rank':
          comparison = a.currentRank - b.currentRank;
          break;
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'status': {
          const order: Record<StudentStatus, number> = { RED: 1, YELLOW: 2, GREEN: 3 };
          comparison = order[a.currentStatus] - order[b.currentStatus];
          break;
        }
        case 'academic':
          comparison = b.academicScore - a.academicScore;
          break;
        case 'attendance':
          comparison = b.attendancePercentage - a.attendancePercentage;
          break;
        case 'engagement':
          comparison = b.engagementScore - a.engagementScore;
          break;
        case 'rankChange':
          comparison = b.rankChange - a.rankChange;
          break;
        default:
          comparison = a.currentRank - b.currentRank;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }

  // Corresponds to GET /api/v1/students/{id}
  async getStudentById(id: string): Promise<Student | null> {
    await simulateLatency(200);
    return MOCK_STUDENTS.find(s => s.id === id || s.studentCode === id) || null;
  }

  // Corresponds to 360-degree aggregated profile endpoint
  async getStudentDetail(id: string): Promise<StudentDetailData | null> {
    await simulateLatency(300);
    return getMockStudentDetail(id);
  }

  // Corresponds to GET /api/v1/students/{id}/academic
  async getAcademicRecords(id: string): Promise<AcademicRecord[]> {
    const detail = await this.getStudentDetail(id);
    return detail ? detail.academicRecords : [];
  }

  // Corresponds to GET /api/v1/students/{id}/attendance
  async getAttendanceRecords(id: string): Promise<AttendanceRecord[]> {
    const detail = await this.getStudentDetail(id);
    return detail ? detail.attendanceRecords : [];
  }

  // Corresponds to GET /api/v1/students/{id}/engagement
  async getEngagement(id: string): Promise<EngagementMetrics | null> {
    const detail = await this.getStudentDetail(id);
    return detail ? detail.engagement : null;
  }

  // Corresponds to GET /api/v1/students/{id}/history
  async getStatusHistory(id: string): Promise<StatusTransition[]> {
    const detail = await this.getStudentDetail(id);
    return detail ? detail.statusHistory : [];
  }

  // Corresponds to GET /api/v1/predictions/{id}/explanation
  async getContributingFactors(id: string): Promise<ContributingFactor[]> {
    const detail = await this.getStudentDetail(id);
    return detail ? detail.contributingFactors : [];
  }

  // Corresponds to rank history progression
  async getRankHistory(id: string): Promise<RankHistoryEntry[]> {
    const detail = await this.getStudentDetail(id);
    return detail ? detail.rankHistory : [];
  }
}

export const studentService = new StudentService();
