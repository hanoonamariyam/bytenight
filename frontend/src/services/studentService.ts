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
import { apiRequest, simulateLatency, USE_MOCK_API } from './api';

export interface StudentFilterParams {
  search?: string;
  status?: 'ALL' | StudentStatus;
  sortBy?: 'rank' | 'name' | 'status' | 'academic' | 'attendance' | 'engagement' | 'rankChange';
  sortOrder?: 'asc' | 'desc';
}

class StudentService {
  // Corresponds to GET /api/students
  async getStudents(params: StudentFilterParams = {}): Promise<Student[]> {
    if (!USE_MOCK_API) {
      try {
        const query = new URLSearchParams();
        if (params.search) query.append('search', params.search);
        if (params.status && params.status !== 'ALL') query.append('status', params.status);
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortOrder) query.append('sortOrder', params.sortOrder);

        const qs = query.toString();
        const endpoint = `/students${qs ? `?${qs}` : ''}`;
        return await apiRequest<Student[]>(endpoint);
      } catch (err) {
        console.warn('Live API error fetching students, falling back to mock:', err);
      }
    }

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

  // Corresponds to GET /api/students/{id}
  async getStudentById(id: string): Promise<Student | null> {
    const detail = await this.getStudentDetail(id);
    return detail ? detail.student : null;
  }

  // Corresponds to 360-degree aggregated profile endpoint: GET /api/students/{id}
  async getStudentDetail(id: string): Promise<StudentDetailData | null> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<StudentDetailData>(`/students/${id}`);
      } catch (err) {
        console.warn(`Live API error fetching student detail '${id}', falling back to mock:`, err);
      }
    }

    await simulateLatency(300);
    return getMockStudentDetail(id);
  }

  // Corresponds to GET /api/students/{id}/academic
  async getAcademicRecords(id: string): Promise<AcademicRecord[]> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<AcademicRecord[]>(`/students/${id}/academic`);
      } catch (err) {
        console.warn(`Live API error for academic records '${id}':`, err);
      }
    }
    const detail = await this.getStudentDetail(id);
    return detail ? detail.academicRecords : [];
  }

  // Corresponds to GET /api/students/{id}/attendance
  async getAttendanceRecords(id: string): Promise<AttendanceRecord[]> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<AttendanceRecord[]>(`/students/${id}/attendance`);
      } catch (err) {
        console.warn(`Live API error for attendance records '${id}':`, err);
      }
    }
    const detail = await this.getStudentDetail(id);
    return detail ? detail.attendanceRecords : [];
  }

  // Corresponds to GET /api/students/{id}/engagement
  async getEngagement(id: string): Promise<EngagementMetrics | null> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<EngagementMetrics>(`/students/${id}/engagement`);
      } catch (err) {
        console.warn(`Live API error for engagement metrics '${id}':`, err);
      }
    }
    const detail = await this.getStudentDetail(id);
    return detail ? detail.engagement : null;
  }

  // Corresponds to GET /api/students/{id}/history
  async getStatusHistory(id: string): Promise<StatusTransition[]> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<StatusTransition[]>(`/students/${id}/history`);
      } catch (err) {
        console.warn(`Live API error for status history '${id}':`, err);
      }
    }
    const detail = await this.getStudentDetail(id);
    return detail ? detail.statusHistory : [];
  }

  // Corresponds to GET /api/students/{id}/explanation
  async getContributingFactors(id: string): Promise<ContributingFactor[]> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<ContributingFactor[]>(`/students/${id}/explanation`);
      } catch (err) {
        console.warn(`Live API error for contributing factors '${id}':`, err);
      }
    }
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
