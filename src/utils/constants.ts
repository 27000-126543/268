export const COLORS = {
  military: {
    primary: '#2C5F2D',
    primaryLight: '#5a9e5a',
    primaryDark: '#1e3e1f',
  },
  navy: {
    primary: '#1E3A5F',
    primaryLight: '#5b81a9',
    primaryDark: '#122237',
  },
  alert: {
    red: '#D62828',
    orange: '#F77F00',
    green: '#00A86B',
    blue: '#0077B6',
    yellow: '#FFD700',
  },
  background: {
    dark: '#0F0F1A',
    darker: '#0a0a12',
    panel: 'rgba(15, 15, 26, 0.85)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#a0a0b0',
    muted: '#606070',
  }
};

export const BUILDING_POSITIONS = {
  commandCenter: { x: 0, y: 0, z: 0 },
  barracks1: { x: -20, y: 0, z: 15 },
  barracks2: { x: -20, y: 0, z: -15 },
  trainingGround: { x: 20, y: 0, z: 0 },
  armory: { x: 0, y: 0, z: 20 },
  canteen: { x: 0, y: 0, z: -20 },
  guardPost1: { x: 15, y: 0, z: 15 },
  guardPost2: { x: -15, y: 0, z: -15 },
  guardPost3: { x: 15, y: 0, z: -15 },
  guardPost4: { x: -15, y: 0, z: 15 },
};

export const FORBIDDEN_ZONES = [
  {
    id: 'zone1',
    name: '武器库禁区',
    bounds: { minX: -5, maxX: 5, minZ: 15, maxZ: 25 },
    color: '#D62828',
  },
  {
    id: 'zone2',
    name: '指挥中心核心区',
    bounds: { minX: -5, maxX: 5, minZ: -5, maxZ: 5 },
    color: '#F77F00',
  },
];

export const EVACUATION_ROUTES = [
  {
    id: 'route1',
    points: [
      { x: -20, y: 0.1, z: 15 },
      { x: -15, y: 0.1, z: 10 },
      { x: -10, y: 0.1, z: 5 },
      { x: -25, y: 0.1, z: 0 },
    ],
  },
  {
    id: 'route2',
    points: [
      { x: 20, y: 0.1, z: 0 },
      { x: 15, y: 0.1, z: -5 },
      { x: 10, y: 0.1, z: -10 },
      { x: 25, y: 0.1, z: -15 },
    ],
  },
  {
    id: 'route3',
    points: [
      { x: 0, y: 0.1, z: -20 },
      { x: -5, y: 0.1, z: -15 },
      { x: -10, y: 0.1, z: -20 },
      { x: -25, y: 0.1, z: -20 },
    ],
  },
];

export const DANGER_ZONES = [
  {
    id: 'danger1',
    name: '遇袭区域',
    bounds: { minX: -3, maxX: 3, minZ: 8, maxZ: 15 },
  },
];

export const ROLE_PERMISSIONS = {
  '班长': {
    canViewBarracks: true,
    canViewTraining: true,
    canViewArmory: false,
    canViewCanteen: true,
    canViewGuardPost: true,
    canApproveGuardRelief: false,
    canApproveMaintenance: false,
    canApprovePurchase: false,
    canStartEmergency: false,
    canExportData: false,
  },
  '连长': {
    canViewBarracks: true,
    canViewTraining: true,
    canViewArmory: true,
    canViewCanteen: true,
    canViewGuardPost: true,
    canApproveGuardRelief: true,
    canApproveMaintenance: false,
    canApprovePurchase: false,
    canStartEmergency: false,
    canExportData: false,
  },
  '营长': {
    canViewBarracks: true,
    canViewTraining: true,
    canViewArmory: true,
    canViewCanteen: true,
    canViewGuardPost: true,
    canApproveGuardRelief: true,
    canApproveMaintenance: true,
    canApprovePurchase: false,
    canStartEmergency: true,
    canExportData: true,
  },
  '旅长': {
    canViewBarracks: true,
    canViewTraining: true,
    canViewArmory: true,
    canViewCanteen: true,
    canViewGuardPost: true,
    canApproveGuardRelief: true,
    canApproveMaintenance: true,
    canApprovePurchase: true,
    canStartEmergency: true,
    canExportData: true,
  },
};
