import { Barracks, TrainingGround, Armory, Canteen, GuardPost, TrainingSchedule, WeaponCabinet, CanteenWindow, Dish } from '../utils/types';
import { BUILDING_POSITIONS, FORBIDDEN_ZONES, EVACUATION_ROUTES, DANGER_ZONES } from '../utils/constants';
import { mockSoldiers, mockGuardSoldiers } from './mockPersonnel';
import { formatDate, randomRange } from '../utils/helpers';

const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
const twoHoursAgo = new Date(today.getTime() - 2 * 60 * 60 * 1000);
const threeHoursAgo = new Date(today.getTime() - 3 * 60 * 60 * 1000);

export const mockBarracks: Barracks[] = [
  {
    id: 'barracks1',
    name: '一营营房',
    position: BUILDING_POSITIONS.barracks1,
    rooms: [
      {
        id: 'room_1',
        roomNumber: '101',
        soldiers: mockSoldiers.slice(0, 4),
        bedOccupancy: 4,
        maxBeds: 8,
      },
      {
        id: 'room_2',
        roomNumber: '102',
        soldiers: mockSoldiers.slice(4, 8),
        bedOccupancy: 4,
        maxBeds: 8,
      },
      {
        id: 'room_3',
        roomNumber: '103',
        soldiers: mockSoldiers.slice(8, 12),
        bedOccupancy: 4,
        maxBeds: 8,
      },
      {
        id: 'room_4',
        roomNumber: '201',
        soldiers: mockSoldiers.slice(12, 16),
        bedOccupancy: 4,
        maxBeds: 8,
      },
      {
        id: 'room_5',
        roomNumber: '202',
        soldiers: mockSoldiers.slice(16, 20),
        bedOccupancy: 4,
        maxBeds: 8,
      },
      {
        id: 'room_6',
        roomNumber: '203',
        soldiers: mockSoldiers.slice(20, 24),
        bedOccupancy: 4,
        maxBeds: 8,
      },
    ],
  },
  {
    id: 'barracks2',
    name: '二营营房',
    position: BUILDING_POSITIONS.barracks2,
    rooms: [
      {
        id: 'room_7',
        roomNumber: '101',
        soldiers: [],
        bedOccupancy: 6,
        maxBeds: 8,
      },
      {
        id: 'room_8',
        roomNumber: '102',
        soldiers: [],
        bedOccupancy: 8,
        maxBeds: 8,
      },
      {
        id: 'room_9',
        roomNumber: '103',
        soldiers: [],
        bedOccupancy: 3,
        maxBeds: 8,
      },
    ],
  },
];

const trainingSchedules: TrainingSchedule[] = [
  {
    id: 'sch1',
    subject: '队列训练',
    startTime: '08:00',
    endTime: '10:00',
    participants: 45,
    unit: '一营',
  },
  {
    id: 'sch2',
    subject: '战术演练',
    startTime: '10:30',
    endTime: '12:00',
    participants: 30,
    unit: '二连',
  },
  {
    id: 'sch3',
    subject: '体能训练',
    startTime: '14:00',
    endTime: '16:00',
    participants: 60,
    unit: '全营',
  },
  {
    id: 'sch4',
    subject: '射击训练',
    startTime: '16:30',
    endTime: '18:00',
    participants: 25,
    unit: '一连',
  },
];

export const mockTrainingGround: TrainingGround = {
  id: 'training1',
  name: '综合训练场',
  currentSubject: '战术演练',
  participantCount: 85,
  capacity: 100,
  occupancyRate: 85,
  schedule: trainingSchedules,
  position: BUILDING_POSITIONS.trainingGround,
};

const weaponCabinets: WeaponCabinet[] = [
  {
    id: 'cab1',
    cabinetNumber: 'A01',
    weaponType: '95式自动步枪',
    quantity: 20,
    lastMaintenanceDate: formatDate(new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000)),
    nextMaintenanceDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
    needsMaintenance: true,
    daysUntilMaintenance: 5,
  },
  {
    id: 'cab2',
    cabinetNumber: 'A02',
    weaponType: '92式手枪',
    quantity: 15,
    lastMaintenanceDate: formatDate(new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)),
    nextMaintenanceDate: formatDate(new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000)),
    needsMaintenance: false,
    daysUntilMaintenance: 20,
  },
  {
    id: 'cab3',
    cabinetNumber: 'B01',
    weaponType: '88式狙击步枪',
    quantity: 5,
    lastMaintenanceDate: formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)),
    nextMaintenanceDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
    needsMaintenance: true,
    daysUntilMaintenance: 2,
  },
  {
    id: 'cab4',
    cabinetNumber: 'B02',
    weaponType: '03式自动步枪',
    quantity: 12,
    lastMaintenanceDate: formatDate(new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)),
    nextMaintenanceDate: formatDate(new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)),
    needsMaintenance: false,
    daysUntilMaintenance: 15,
  },
];

export const mockArmory: Armory = {
  id: 'armory1',
  name: '武器库',
  cabinets: weaponCabinets,
  position: BUILDING_POSITIONS.armory,
};

const dishes1: Dish[] = [
  { id: 'd1', name: '红烧肉', stock: 45, safetyThreshold: 30, needsPurchase: false, unit: '份' },
  { id: 'd2', name: '清蒸鱼', stock: 20, safetyThreshold: 25, needsPurchase: true, unit: '份' },
  { id: 'd3', name: '炒青菜', stock: 80, safetyThreshold: 40, needsPurchase: false, unit: '份' },
];

const dishes2: Dish[] = [
  { id: 'd4', name: '宫保鸡丁', stock: 15, safetyThreshold: 25, needsPurchase: true, unit: '份' },
  { id: 'd5', name: '麻婆豆腐', stock: 60, safetyThreshold: 30, needsPurchase: false, unit: '份' },
  { id: 'd6', name: '西红柿炒蛋', stock: 55, safetyThreshold: 35, needsPurchase: false, unit: '份' },
];

const dishes3: Dish[] = [
  { id: 'd7', name: '牛肉面', stock: 30, safetyThreshold: 20, needsPurchase: false, unit: '碗' },
  { id: 'd8', name: '鸡蛋面', stock: 40, safetyThreshold: 20, needsPurchase: false, unit: '碗' },
  { id: 'd9', name: '酸辣汤', stock: 50, safetyThreshold: 25, needsPurchase: false, unit: '碗' },
];

const canteenWindows: CanteenWindow[] = [
  { id: 'w1', windowNumber: '1号窗口', queueCount: 8, dishes: dishes1 },
  { id: 'w2', windowNumber: '2号窗口', queueCount: 5, dishes: dishes2 },
  { id: 'w3', windowNumber: '3号窗口(面食)', queueCount: 12, dishes: dishes3 },
];

export const mockCanteen: Canteen = {
  id: 'canteen1',
  name: '官兵食堂',
  windows: canteenWindows,
  position: BUILDING_POSITIONS.canteen,
};

export const mockGuardPosts: GuardPost[] = [
  {
    id: 'gp1',
    name: '东门岗哨',
    guard: mockGuardSoldiers[0],
    startTime: twoHoursAgo.toISOString(),
    shiftDuration: 2,
    needsRelief: true,
    position: BUILDING_POSITIONS.guardPost1,
  },
  {
    id: 'gp2',
    name: '西门岗哨',
    guard: mockGuardSoldiers[1],
    startTime: new Date(today.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    shiftDuration: 1,
    needsRelief: false,
    position: BUILDING_POSITIONS.guardPost2,
  },
  {
    id: 'gp3',
    name: '南门岗哨',
    guard: mockGuardSoldiers[2],
    startTime: threeHoursAgo.toISOString(),
    shiftDuration: 3,
    needsRelief: true,
    position: BUILDING_POSITIONS.guardPost3,
  },
  {
    id: 'gp4',
    name: '北门岗哨',
    guard: mockGuardSoldiers[3],
    startTime: new Date(today.getTime() - 0.5 * 60 * 60 * 1000).toISOString(),
    shiftDuration: 0.5,
    needsRelief: false,
    position: BUILDING_POSITIONS.guardPost4,
  },
];

export const mockCommandCenter = {
  id: 'command1',
  name: '指挥中心',
  position: BUILDING_POSITIONS.commandCenter,
};

export { FORBIDDEN_ZONES, EVACUATION_ROUTES, DANGER_ZONES };
