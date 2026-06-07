export type UserRole = '班长' | '连长' | '营长' | '旅长';

export interface User {
  id: string;
  name: string;
  rank: string;
  role: UserRole;
  unit: string;
  avatar?: string;
}

export interface TrainingScore {
  subject: string;
  score: number;
  date: string;
}

export interface Soldier {
  id: string;
  name: string;
  rank: string;
  unit: string;
  position: { x: number; y: number; z: number };
  targetPosition?: { x: number; y: number; z: number };
  isInForbiddenZone: boolean;
  trainingScores: TrainingScore[];
  roomId?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  soldiers: Soldier[];
  bedOccupancy: number;
  maxBeds: number;
}

export interface Barracks {
  id: string;
  name: string;
  rooms: Room[];
  position: { x: number; y: number; z: number };
}

export interface TrainingSchedule {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  participants: number;
  unit: string;
}

export interface TrainingGround {
  id: string;
  name: string;
  currentSubject: string;
  participantCount: number;
  capacity: number;
  occupancyRate: number;
  schedule: TrainingSchedule[];
  position: { x: number; y: number; z: number };
}

export interface WeaponCabinet {
  id: string;
  cabinetNumber: string;
  weaponType: string;
  quantity: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  needsMaintenance: boolean;
  daysUntilMaintenance: number;
}

export interface Armory {
  id: string;
  name: string;
  cabinets: WeaponCabinet[];
  position: { x: number; y: number; z: number };
}

export interface Dish {
  id: string;
  name: string;
  stock: number;
  safetyThreshold: number;
  needsPurchase: boolean;
  unit: string;
}

export interface CanteenWindow {
  id: string;
  windowNumber: string;
  queueCount: number;
  dishes: Dish[];
}

export interface Canteen {
  id: string;
  name: string;
  windows: CanteenWindow[];
  position: { x: number; y: number; z: number };
}

export interface Approval {
  role: string;
  approver: string;
  time: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type PurchaseRequestStatus = 'pending' | 'approved1' | 'approved2' | 'approved' | 'rejected';

export interface PurchaseRequest {
  id: string;
  dishName: string;
  quantity: number;
  unit: string;
  status: PurchaseRequestStatus;
  applicant: string;
  applyTime: string;
  approvals: Approval[];
}

export interface GuardPost {
  id: string;
  name: string;
  guard: Soldier;
  startTime: string;
  shiftDuration: number;
  needsRelief: boolean;
  position: { x: number; y: number; z: number };
}

export interface ForbiddenZone {
  id: string;
  name: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  color: string;
}

export interface EvacuationRoute {
  id: string;
  points: { x: number; y: number; z: number }[];
}

export interface DangerZone {
  id: string;
  name: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export interface EmergencyDrill {
  id: string;
  isActive: boolean;
  startTime: string;
  evacuationRoutes: EvacuationRoute[];
  dangerZones: DangerZone[];
}

export interface OperationLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  time: string;
  ip: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface DailyReport {
  date: string;
  barracksStats: {
    totalRooms: number;
    totalBeds: number;
    occupiedBeds: number;
    occupancyRate: number;
  };
  trainingGroundStats: {
    totalUsageHours: number;
    avgOccupancyRate: number;
    trainingCount: number;
    totalParticipants: number;
  };
  armoryStats: {
    totalWeapons: number;
    maintainedCount: number;
    pendingMaintenance: number;
  };
  guardPostStats: {
    totalShifts: number;
    onTimeRelief: number;
    reliefRate: number;
  };
}

export type BuildingType = 'barracks' | 'trainingGround' | 'armory' | 'canteen' | 'guardPost' | 'commandCenter';

export interface SelectedBuilding {
  type: BuildingType;
  id: string;
}
