import { DashboardSummary } from '../types/student.types';
import { MOCK_STUDENTS, MOCK_ALERTS } from '../data/mockData';
import { apiRequest, simulateLatency, USE_MOCK_API } from './api';

class DashboardService {
  // Corresponds to GET /api/dashboard/summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    if (!USE_MOCK_API) {
      try {
        return await apiRequest<DashboardSummary>('/dashboard/summary');
      } catch (err) {
        console.warn('Live API error for dashboard summary, falling back to mock:', err);
      }
    }

    await simulateLatency(300);

    const totalStudents = MOCK_STUDENTS.length;
    
    const statusDistribution = {
      GREEN: MOCK_STUDENTS.filter(s => s.currentStatus === 'GREEN').length,
      YELLOW: MOCK_STUDENTS.filter(s => s.currentStatus === 'YELLOW').length,
      RED: MOCK_STUDENTS.filter(s => s.currentStatus === 'RED').length,
    };

    const classAverageScore = Number(
      (MOCK_STUDENTS.reduce((acc, s) => acc + s.academicScore, 0) / totalStudents).toFixed(1)
    );

    const averageAttendance = Number(
      (MOCK_STUDENTS.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents).toFixed(1)
    );

    // Urgent students: RED first (by risk descending), then YELLOW (by risk descending)
    const urgentStudents = MOCK_STUDENTS
      .filter(s => s.currentStatus === 'RED' || s.currentStatus === 'YELLOW')
      .sort((a, b) => b.riskScore - a.riskScore);

    // Top performers: sorted by rank ascending (1, 2, 3, 4, 5)
    const topPerformers = [...MOCK_STUDENTS]
      .sort((a, b) => a.currentRank - b.currentRank)
      .slice(0, 5);

    // Significant rank changes: sorted by absolute rank change descending
    const significantRankChanges = [...MOCK_STUDENTS]
      .filter(s => Math.abs(s.rankChange) >= 2)
      .sort((a, b) => Math.abs(b.rankChange) - Math.abs(a.rankChange));

    const activeAlertsCount = MOCK_ALERTS.filter(a => !a.isRead).length;

    return {
      totalStudents,
      statusDistribution,
      classAverageScore,
      averageAttendance,
      activeAlertsCount,
      recentAlerts: MOCK_ALERTS.slice(0, 4),
      urgentStudents,
      topPerformers,
      significantRankChanges,
      dataQualityHealth: {
        completeProfilesCount: MOCK_STUDENTS.filter(s => s.dataAvailability.vision === 'AVAILABLE').length,
        cameraSensorStatus: 'DEGRADED' // Since Liam Chen's zone camera is offline
      }
    };
  }
}

export const dashboardService = new DashboardService();
