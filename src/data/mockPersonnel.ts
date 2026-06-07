import { Soldier, TrainingScore } from '../utils/types';
import { BUILDING_POSITIONS } from '../utils/constants';
import { randomRange } from '../utils/helpers';

const generateTrainingScores = (): TrainingScore[] => [
  { subject: '射击', score: Math.round(randomRange(75, 95)), date: '2026-06-01' },
  { subject: '体能', score: Math.round(randomRange(70, 98)), date: '2026-06-02' },
  { subject: '战术', score: Math.round(randomRange(72, 96)), date: '2026-06-03' },
  { subject: '队列', score: Math.round(randomRange(80, 99)), date: '2026-06-04' },
];

const soldierNames = [
  '陈伟', '刘洋', '杨帆', '周杰', '吴强', '郑浩', '孙鹏', '马超',
  '朱峰', '胡磊', '林峰', '何涛', '罗斌', '梁军', '宋凯', '唐亮',
  '许阳', '韩冰', '冯刚', '董波', '程磊', '曹阳', '袁鹏', '邓辉',
];

const ranks = ['列兵', '上等兵', '下士', '中士', '上士'];

export const mockSoldiers: Soldier[] = soldierNames.map((name, index) => ({
  id: `soldier_${index + 1}`,
  name,
  rank: ranks[index % ranks.length],
  unit: `一连${Math.floor(index / 8) + 1}班`,
  position: {
    x: randomRange(-25, 25),
    y: 0,
    z: randomRange(-25, 25),
  },
  targetPosition: {
    x: randomRange(-25, 25),
    y: 0,
    z: randomRange(-25, 25),
  },
  isInForbiddenZone: false,
  trainingScores: generateTrainingScores(),
  roomId: `room_${Math.floor(index / 4) + 1}`,
}));

export const mockGuardSoldiers = [
  mockSoldiers[0],
  mockSoldiers[5],
  mockSoldiers[10],
  mockSoldiers[15],
];
