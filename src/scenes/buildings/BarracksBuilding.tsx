import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingStore } from '../../store/useBuildingStore';
import { getOccupancyColor } from '../../utils/helpers';
import { Barracks as BarracksType } from '../../utils/types';

interface Props {
  barracks: BarracksType;
}

const BarracksBuilding = ({ barracks }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);

  const avgOccupancy = barracks.rooms.reduce((sum, room) => sum + (room.bedOccupancy / room.maxBeds * 100), 0) / barracks.rooms.length;
  const occupancyColor = getOccupancyColor(avgOccupancy);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedBuilding('barracks', barracks.id);
  };

  return (
    <group
      ref={groupRef}
      position={[barracks.position.x, barracks.position.y, barracks.position.z]}
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
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 8]} />
        <meshStandardMaterial
          color={hovered ? '#4a7c4a' : '#2C5F2D'}
          emissive={hovered ? '#2C5F2D' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[6.2, 0.3, 8.2]} />
        <meshStandardMaterial color="#1a3a1a" />
      </mesh>

      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 4.1]}>
          <boxGeometry args={[1, 1.5, 0.1]} />
          <meshStandardMaterial color="#1E3A5F" />
        </mesh>
      ))}

      {[-2, 0, 2].map((x, i) => (
        <mesh key={`win-${i}`} position={[x, 1.5, -4.1]}>
          <boxGeometry args={[1, 1.5, 0.1]} />
          <meshStandardMaterial color="#1E3A5F" emissive="#0077B6" emissiveIntensity={0.3} />
        </mesh>
      ))}

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 9]} />
        <meshStandardMaterial color="#3a3a4a" />
      </mesh>

      <Html position={[0, 4, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-military-500/50 whitespace-nowrap">
          <p className="text-white text-xs font-bold">{barracks.name}</p>
          <p className="text-xs" style={{ color: occupancyColor }}>
            入住率: {avgOccupancy.toFixed(0)}%
          </p>
        </div>
      </Html>
    </group>
  );
};

export default BarracksBuilding;
