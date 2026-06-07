import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingStore } from '../../store/useBuildingStore';
import { Armory as ArmoryType } from '../../utils/types';

interface Props {
  armory: ArmoryType;
}

const ArmoryBuilding = ({ armory }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [flashIntensity, setFlashIntensity] = useState(0);
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);

  const needsMaintenance = armory.cabinets.some(c => c.needsMaintenance);

  useFrame((state) => {
    if (needsMaintenance) {
      setFlashIntensity((Math.sin(state.clock.elapsedTime * 3) + 1) / 2);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedBuilding('armory', armory.id);
  };

  return (
    <group
      ref={groupRef}
      position={[armory.position.x, armory.position.y, armory.position.z]}
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
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[7, 4, 6]} />
        <meshStandardMaterial
          color={hovered ? '#5a4020' : '#4a3520'}
          emissive={needsMaintenance ? '#F77F00' : hovered ? '#4a3520' : '#000000'}
          emissiveIntensity={needsMaintenance ? flashIntensity * 0.4 : hovered ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, 4.3, 0]}>
        <boxGeometry args={[7.2, 0.4, 6.2]} />
        <meshStandardMaterial color="#2a2010" />
      </mesh>

      <mesh position={[0, 1.5, 3.1]}>
        <boxGeometry args={[2, 3, 0.2]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>

      <mesh position={[0, 2, 3.2]}>
        <torusGeometry args={[0.15, 0.05, 8, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {[-2, 2].map((x, i) => (
        <mesh key={i} position={[x, 2, 3.05]}>
          <boxGeometry args={[1.5, 2, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 7]} />
        <meshStandardMaterial color="#3a3a4a" />
      </mesh>

      <Html position={[0, 5.5, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-military-500/50 whitespace-nowrap">
          <p className="text-white text-xs font-bold">{armory.name}</p>
          {needsMaintenance && (
            <p className="text-xs text-orange-500 animate-pulse">
              ⚠ 有武器柜需要保养
            </p>
          )}
          <p className="text-xs text-gray-400">
            共 {armory.cabinets.reduce((sum, c) => sum + c.quantity, 0)} 件武器
          </p>
        </div>
      </Html>
    </group>
  );
};

export default ArmoryBuilding;
