import { create } from 'zustand';
import {
  Barracks, TrainingGround, Armory, Canteen, GuardPost,
  PurchaseRequest, BuildingType, SelectedBuilding, WeaponCabinet,
} from '../utils/types';
import {
  mockBarracks, mockTrainingGround, mockArmory, mockCanteen, mockGuardPosts,
} from '../data/mockBuildings';
import { generateId, formatDateTime } from '../utils/helpers';

interface BuildingState {
  barracks: Barracks[];
  trainingGround: TrainingGround;
  armory: Armory;
  canteen: Canteen;
  guardPosts: GuardPost[];
  selectedBuilding: SelectedBuilding | null;
  purchaseRequests: PurchaseRequest[];
  setSelectedBuilding: (type: BuildingType | null, id?: string) => void;
  updateTrainingOccupancy: (occupancyRate: number) => void;
  adjustTrainingSchedule: () => void;
  createMaintenanceOrder: (cabinetId: string) => void;
  createPurchaseRequest: (dishName: string, quantity: number, unit: string) => void;
  approvePurchaseRequest: (requestId: string, role: string, comment: string) => void;
  rejectPurchaseRequest: (requestId: string, role: string, comment: string) => void;
  reliefGuard: (guardPostId: string) => void;
}

export const useBuildingStore = create<BuildingState>((set, get) => ({
  barracks: mockBarracks,
  trainingGround: mockTrainingGround,
  armory: mockArmory,
  canteen: mockCanteen,
  guardPosts: mockGuardPosts,
  selectedBuilding: null,
  purchaseRequests: [
    {
      id: 'pr1',
      dishName: '清蒸鱼',
      quantity: 50,
      unit: '份',
      status: 'pending',
      applicant: '司务长',
      applyTime: formatDateTime(new Date()),
      approvals: [
        { role: '司务长', approver: '', time: '', comment: '', status: 'pending' },
        { role: '后勤处长', approver: '', time: '', comment: '', status: 'pending' },
        { role: '政委', approver: '', time: '', comment: '', status: 'pending' },
      ],
    },
    {
      id: 'pr2',
      dishName: '宫保鸡丁',
      quantity: 40,
      unit: '份',
      status: 'pending',
      applicant: '司务长',
      applyTime: formatDateTime(new Date(Date.now() - 3600000)),
      approvals: [
        { role: '司务长', approver: '', time: '', comment: '', status: 'pending' },
        { role: '后勤处长', approver: '', time: '', comment: '', status: 'pending' },
        { role: '政委', approver: '', time: '', comment: '', status: 'pending' },
      ],
    },
  ],

  setSelectedBuilding: (type, id) => {
    if (type && id) {
      set({ selectedBuilding: { type, id } });
    } else {
      set({ selectedBuilding: null });
    }
  },

  updateTrainingOccupancy: (occupancyRate: number) => {
    set(state => ({
      trainingGround: {
        ...state.trainingGround,
        occupancyRate,
      },
    }));
  },

  adjustTrainingSchedule: () => {
    console.log('自动调整后续排课');
  },

  createMaintenanceOrder: (cabinetId: string) => {
    console.log(`创建武器柜 ${cabinetId} 保养工单`);
  },

  createPurchaseRequest: (dishName, quantity, unit) => {
    const newRequest: PurchaseRequest = {
      id: generateId(),
      dishName,
      quantity,
      unit,
      status: 'pending',
      applicant: '司务长',
      applyTime: formatDateTime(new Date()),
      approvals: [
        { role: '司务长', approver: '', time: '', comment: '', status: 'pending' },
        { role: '后勤处长', approver: '', time: '', comment: '', status: 'pending' },
        { role: '政委', approver: '', time: '', comment: '', status: 'pending' },
      ],
    };
    set(state => ({
      purchaseRequests: [newRequest, ...state.purchaseRequests],
    }));
  },

  approvePurchaseRequest: (requestId, role, comment) => {
    set(state => ({
      purchaseRequests: state.purchaseRequests.map(req => {
        if (req.id !== requestId) return req;

        const roleIndex = role === '司务长' ? 0 : role === '后勤处长' ? 1 : 2;
        const newApprovals = [...req.approvals];
        newApprovals[roleIndex] = {
          ...newApprovals[roleIndex],
          approver: '当前用户',
          time: formatDateTime(new Date()),
          comment,
          status: 'approved',
        };

        let newStatus = req.status;
        if (role === '司务长') newStatus = 'approved1';
        else if (role === '后勤处长') newStatus = 'approved2';
        else if (role === '政委') newStatus = 'approved';

        return {
          ...req,
          status: newStatus,
          approvals: newApprovals,
        };
      }),
    }));
  },

  rejectPurchaseRequest: (requestId, role, comment) => {
    set(state => ({
      purchaseRequests: state.purchaseRequests.map(req => {
        if (req.id !== requestId) return req;

        const roleIndex = role === '司务长' ? 0 : role === '后勤处长' ? 1 : 2;
        const newApprovals = [...req.approvals];
        newApprovals[roleIndex] = {
          ...newApprovals[roleIndex],
          approver: '当前用户',
          time: formatDateTime(new Date()),
          comment,
          status: 'rejected',
        };

        return {
          ...req,
          status: 'rejected',
          approvals: newApprovals,
        };
      }),
    }));
  },

  reliefGuard: (guardPostId) => {
    set(state => ({
      guardPosts: state.guardPosts.map(gp => {
        if (gp.id !== guardPostId) return gp;
        return {
          ...gp,
          startTime: new Date().toISOString(),
          shiftDuration: 0,
          needsRelief: false,
        };
      }),
    }));
  },
}));
