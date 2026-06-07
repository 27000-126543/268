import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingStore } from '../../store/useBuildingStore';
import { getOccupancyColor } from '../../utils/helpers';
import { TrainingGround as TrainingGroundType } from '../../utils/types';

interface Props {
  trainingGround: TrainingGroundType;
}

const TrainingGroundBuilding = ({ trainingGround }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);

  const occupancyColor = getOccupancyColor(trainingGround.occupancyRate);
  const isHighOccupancy = trainingGround.occupancyRate >= 80;

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedBuilding('trainingGround', trainingGround.id);
  };

  return (
    <group
      ref={groupRef}
      position={[trainingGround.position.x, trainingGround.position.y, trainingGround.position.z]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color={isHighOccupancy ? '#D62828' : '#2d5a2d'}
          emissive={isHighOccupancy ? '#D62828' : hovered ? '#2C5F2D' : '#000000'}
          emissiveIntensity={isHighOccupancy ? 0.2 : hovered ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#3d7a3d" />
      </mesh>

      {[-4, 0, 4].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 2, -5]}>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 3.5, -5]}>
            <boxGeometry args={[0.05, 3, 2]} />
            <meshStandardMaterial color="#D62828" />
          </mesh>
        </group>
      ))}

      {[0, 1, 2, 3].map((i) => (
        <mesh key={`obs-${i}`} position={[5 - i * 0.8, i * 0.3, -5]}>
          <boxGeometry args={[0.6, 0.3, 2]} />
          <meshStandardMaterial color="#5a5a5a" />
        </mesh>
      ))}

      <Html position={[0, 5, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-military-500/50 whitespace-nowrap">
          <p className="text-white text-xs font-bold">{trainingGround.name}</p>
          <p className="text-xs text-gray-300">{trainingGround.currentSubject}</p>
          <p className="text-xs" style={{ color: occupancyColor }}>
            占用率: {trainingGround.occupancyRate}% ({trainingGround.participantCount}/{trainingGround.capacity}人)
          </p>
        </div>
      </Html>
    </group>
  );
};

export default TrainingGroundBuilding;
