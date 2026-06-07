import { create } from 'zustand';
import { EmergencyDrill } from '../utils/types';
import { EVACUATION_ROUTES, DANGER_ZONES } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';

interface EmergencyState {
  drill: EmergencyDrill;
  startDrill: () => void;
  endDrill: () => void;
  notifications: string[];
}

export const useEmergencyStore = create<EmergencyState>((set) => ({
  drill: {
    id: 'drill1',
    isActive: false,
    startTime: '',
    evacuationRoutes: [],
    dangerZones: [],
  },
  notifications: [],

  startDrill: () => {
    set({
      drill: {
        id: 'drill1',
        isActive: true,
        startTime: formatDateTime(new Date()),
        evacuationRoutes: EVACUATION_ROUTES,
        dangerZones: DANGER_ZONES,
      },
      notifications: [
        '【紧急警报】营区遭遇模拟袭击，请所有人员立即疏散！',
        '已生成疏散路径，请沿绿色指示路线撤离',
        '警戒区域已划定，请勿进入红色区域',
      ],
    });
  },

  endDrill: () => {
    set({
      drill: {
        id: 'drill1',
        isActive: false,
        startTime: '',
        evacuationRoutes: [],
        dangerZones: [],
      },
      notifications: ['【演练结束】应急演练已结束，感谢配合'],
    });
  },
}));
