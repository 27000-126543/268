import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Soldier as SoldierType } from '../../utils/types';
import { usePersonnelStore } from '../../store/usePersonnelStore';

interface Props {
  soldier: SoldierType;
}

const SoldierModel = ({ soldier }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const setSelectedSoldier = usePersonnelStore(state => state.setSelectedSoldier);

  const color = soldier.isInForbiddenZone ? '#D62828' : '#2C5F2D';

  return (
    <group
      ref={groupRef}
      position={[soldier.position.x, soldier.position.y, soldier.position.z]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSoldier(soldier);
      }}
    >
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={soldier.isInForbiddenZone ? '#D62828' : '#000000'}
          emissiveIntensity={soldier.isInForbiddenZone ? 0.5 : 0}
        />
      </mesh>

      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.1, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {soldier.isInForbiddenZone && (
        <pointLight
          position={[0, 1, 0]}
          color="#D62828"
          intensity={1}
          distance={3}
        />
      )}

      <Html position={[0, 2.2, 0]} center>
        <div className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
          soldier.isInForbiddenZone
            ? 'bg-red-500/90 text-white animate-pulse'
            : 'bg-black/70 text-white'
        }`}>
          {soldier.name}
        </div>
      </Html>
    </group>
  );
};

export default SoldierModel;
