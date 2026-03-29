import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'milestone';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationCtx {
  notifications: Notification[];
  unreadCount: number;
  add: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const STORAGE_KEY = 'ecopulse-notifications';

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Seed default notifications
  return [
    { id: 'seed-1', type: 'info', title: 'Monthly Report Available', message: 'Your March 2026 emissions report is ready for download.', timestamp: Date.now() - 3600_000, read: false },
    { id: 'seed-2', type: 'milestone', title: 'Renewable Milestone', message: 'Azerbaijan reached 20% renewable energy share for the first time!', timestamp: Date.now() - 86400_000, read: false },
    { id: 'seed-3', type: 'success', title: 'Prediction Model Updated', message: 'LSTM v2.1 model has been retrained with latest 2025 data.', timestamp: Date.now() - 172800_000, read: true },
    { id: 'seed-4', type: 'warning', title: 'Carbon Budget Alert', message: 'Cumulative emissions have reached 91% of the 2030 carbon budget.', timestamp: Date.now() - 259200_000, read: false },
  ];
}

let idCounter = 100;

const NotificationContext = createContext<NotificationCtx>({
  notifications: [], unreadCount: 0, add: () => {}, markRead: () => {}, markAllRead: () => {}, clearAll: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const add = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((prev) => [
      { ...n, id: `n-${++idCounter}`, timestamp: Date.now(), read: false },
      ...prev,
    ]);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, add, markRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
