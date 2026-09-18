import { Alert } from '../types/student.types';
import { MOCK_ALERTS } from '../data/mockData';
import { apiRequest, simulateLatency, USE_MOCK_API } from './api';

class AlertService {
  private alerts: Alert[] = [...MOCK_ALERTS];

  // Corresponds to GET /api/alerts
  async getAlerts(filter?: { isRead?: boolean; severity?: string }): Promise<Alert[]> {
    if (!USE_MOCK_API) {
      try {
        const query = new URLSearchParams();
        if (filter?.isRead !== undefined) query.append('isRead', String(filter.isRead));
        if (filter?.severity && filter.severity !== 'ALL') query.append('severity', filter.severity);

        const qs = query.toString();
        const endpoint = `/alerts${qs ? `?${qs}` : ''}`;
        const data = await apiRequest<Alert[]>(endpoint);
        this.alerts = data;
        return data;
      } catch (err) {
        console.warn('Live API error fetching alerts, falling back to mock:', err);
      }
    }

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

  // Corresponds to POST /api/alerts/{id}/read
  async markAsRead(alertId: string): Promise<Alert | null> {
    if (!USE_MOCK_API) {
      try {
        await apiRequest<{ success: boolean; alertId: string; readAt: string }>(`/alerts/${alertId}/read`, {
          method: 'POST',
        });
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
          alert.isRead = true;
          return { ...alert };
        }
      } catch (err) {
        console.warn(`Live API error marking alert '${alertId}' as read:`, err);
      }
    }

    await simulateLatency(150);
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      return { ...alert };
    }
    return null;
  }

  async markAllAsRead(): Promise<void> {
    if (!USE_MOCK_API) {
      try {
        await apiRequest<{ success: boolean; count: number }>('/alerts/read-all', {
          method: 'POST',
        });
        this.alerts = this.alerts.map(a => ({ ...a, isRead: true }));
        return;
      } catch (err) {
        console.warn('Live API error marking all alerts as read:', err);
      }
    }

    await simulateLatency(150);
    this.alerts = this.alerts.map(a => ({ ...a, isRead: true }));
  }

  getUnreadCount(): number {
    return this.alerts.filter(a => !a.isRead).length;
  }
}

export const alertService = new AlertService();
