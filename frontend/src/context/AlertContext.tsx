import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from '../types/student.types';
import { alertService } from '../services/alertService';

interface AlertContextType {
  alerts: Alert[];
  unreadCount: number;
  isLoading: boolean;
  refreshAlerts: () => Promise<void>;
  markAsRead: (alertId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAlerts = useCallback(async () => {
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  const markAsRead = async (alertId: string) => {
    await alertService.markAsRead(alertId);
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, isRead: true } : a))
    );
  };

  const markAllAsRead = async () => {
    await alertService.markAllAsRead();
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        isLoading,
        refreshAlerts,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
