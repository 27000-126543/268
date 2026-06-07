import { create } from 'zustand';
import { Notification } from '../utils/types';
import { generateId, formatDateTime } from '../utils/helpers';

interface NotificationState {
  notifications: Notification[];
  addNotification: (type: Notification['type'], title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: 'n1',
      type: 'warning',
      title: '保养提醒',
      message: '武器柜A01还有5天需要保养',
      time: formatDateTime(new Date(Date.now() - 1800000)),
      read: false,
    },
    {
      id: 'n2',
      type: 'warning',
      title: '保养提醒',
      message: '武器柜B01还有2天需要保养',
      time: formatDateTime(new Date(Date.now() - 3600000)),
      read: false,
    },
    {
      id: 'n3',
      type: 'info',
      title: '换岗提醒',
      message: '东门岗哨已当班2小时，请安排换岗',
      time: formatDateTime(new Date(Date.now() - 7200000)),
      read: false,
    },
  ],

  get unreadCount() {
    return get().notifications.filter(n => !n.read).length;
  },

  addNotification: (type, title, message) => {
    const notification: Notification = {
      id: generateId(),
      type,
      title,
      message,
      time: formatDateTime(new Date()),
      read: false,
    };
    set(state => ({
      notifications: [notification, ...state.notifications],
    }));
  },

  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));
