import { Alert } from '../types/student.types';
import { MOCK_ALERTS } from '../data/mockData';
import { simulateLatency } from './api';

class AlertService {
  private alerts: Alert[] = [...MOCK_ALERTS];

  // Corresponds to GET /api/v1/alerts
  async getAlerts(filter?: { isRead?: boolean; severity?: string }): Promise<Alert[]> {
    await simulateLatency(200);

    let result = [...this.alerts];
    if (filter?.isRead !== undefined) {
      result = result.filter(a => a.isRead === filter.isRead);
    }
    if (filter?.severity && filter.severity !== 'ALL') {
      result = result.filter(a => a.severity === filter.severity);
    }
    return result;
  }

  // Corresponds to POST /api/v1/alerts/{id}/read
  async markAsRead(alertId: string): Promise<Alert | null> {
    await simulateLatency(150);
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      return { ...alert };
    }
    return null;
  }

  async markAllAsRead(): Promise<void> {
    await simulateLatency(150);
    this.alerts = this.alerts.map(a => ({ ...a, isRead: true }));
  }

  getUnreadCount(): number {
    return this.alerts.filter(a => !a.isRead).length;
  }
}

export const alertService = new AlertService();
