import { create } from 'zustand';
import { User, UserRole, OperationLog } from '../utils/types';
import { mockUsers } from '../data/mockUsers';
import { generateId, formatDateTime } from '../utils/helpers';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isFaceScanning: boolean;
  operationLogs: OperationLog[];
  login: (role: UserRole) => void;
  logout: () => void;
  startFaceScan: () => void;
  stopFaceScan: () => void;
  addOperationLog: (action: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isFaceScanning: false,
  operationLogs: [],

  login: (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      set({ currentUser: user, isAuthenticated: true, isFaceScanning: false });
      get().addOperationLog(`${user.name}(${user.role})登录系统`);
    }
  },

  logout: () => {
    const user = get().currentUser;
    if (user) {
      get().addOperationLog(`${user.name}(${user.role})退出系统`);
    }
    set({ currentUser: null, isAuthenticated: false });
  },

  startFaceScan: () => set({ isFaceScanning: true }),
  stopFaceScan: () => set({ isFaceScanning: false }),

  addOperationLog: (action: string) => {
    const user = get().currentUser;
    const log: OperationLog = {
      id: generateId(),
      userId: user?.id || 'unknown',
      userName: user?.name || 'unknown',
      action,
      time: formatDateTime(new Date()),
      ip: '127.0.0.1',
    };
    set(state => ({
      operationLogs: [log, ...state.operationLogs].slice(0, 100),
    }));
  },
}));
