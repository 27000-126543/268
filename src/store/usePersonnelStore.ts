import { create } from 'zustand';
import { Soldier } from '../utils/types';
import { mockSoldiers } from '../data/mockPersonnel';
import { FORBIDDEN_ZONES } from '../utils/constants';
import { randomRange, lerp } from '../utils/helpers';

interface PersonnelState {
  soldiers: Soldier[];
  selectedSoldier: Soldier | null;
  updateSoldierPosition: (soldierId: string, position: { x: number; y: number; z: number }) => void;
  setSelectedSoldier: (soldier: Soldier | null) => void;
  checkForbiddenZones: () => void;
  updateSoldierPositions: (delta: number) => void;
}

export const usePersonnelStore = create<PersonnelState>((set, get) => ({
  soldiers: mockSoldiers,
  selectedSoldier: null,

  updateSoldierPosition: (soldierId, position) => {
    set(state => ({
      soldiers: state.soldiers.map(s =>
        s.id === soldierId ? { ...s, position } : s
      ),
    }));
  },

  setSelectedSoldier: (soldier) => set({ selectedSoldier: soldier }),

  checkForbiddenZones: () => {
    set(state => ({
      soldiers: state.soldiers.map(soldier => {
        let isInForbidden = false;
        for (const zone of FORBIDDEN_ZONES) {
          if (
            soldier.position.x >= zone.bounds.minX &&
            soldier.position.x <= zone.bounds.maxX &&
            soldier.position.z >= zone.bounds.minZ &&
            soldier.position.z <= zone.bounds.maxZ
          ) {
            isInForbidden = true;
            break;
          }
        }
        return { ...soldier, isInForbiddenZone: isInForbidden };
      }),
    }));
  },

  updateSoldierPositions: (delta: number) => {
    set(state => ({
      soldiers: state.soldiers.map(soldier => {
        if (!soldier.targetPosition) return soldier;

        const speed = 2 * delta;
        const dx = soldier.targetPosition.x - soldier.position.x;
        const dz = soldier.targetPosition.z - soldier.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 0.5) {
          return {
            ...soldier,
            targetPosition: {
              x: randomRange(-25, 25),
              y: 0,
              z: randomRange(-25, 25),
            },
          };
        }

        const moveX = (dx / dist) * speed;
        const moveZ = (dz / dist) * speed;

        return {
          ...soldier,
          position: {
            x: soldier.position.x + moveX,
            y: 0,
            z: soldier.position.z + moveZ,
          },
        };
      }),
    }));
  },
}));
