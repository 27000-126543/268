import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingStore } from '../../store/useBuildingStore';
import { GuardPost as GuardPostType } from '../../utils/types';

interface Props {
  guardPost: GuardPostType;
}

const GuardPostBuilding = ({ guardPost }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(0);
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);

  useFrame((state) => {
    if (guardPost.needsRelief) {
      setLightIntensity((Math.sin(state.clock.elapsedTime * 2) + 1) / 2);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedBuilding('guardPost', guardPost.id);
  };

  return (
    <group
      ref={groupRef}
      position={[guardPost.position.x, guardPost.position.y, guardPost.position.z]}
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
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial
          color={guardPost.needsRelief ? '#F77F00' : '#2C5F2D'}
          emissive={guardPost.needsRelief ? '#F77F00' : '#000000'}
          emissiveIntensity={guardPost.needsRelief ? lightIntensity * 0.5 : 0}
        />
      </mesh>

      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 8]} />
        <meshStandardMaterial
          color={guardPost.needsRelief ? '#F77F00' : '#00A86B'}
          emissive={guardPost.needsRelief ? '#F77F00' : '#00A86B'}
          emissiveIntensity={guardPost.needsRelief ? lightIntensity * 0.8 : 0.3}
        />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color={hovered ? '#5a5a6a' : '#4a4a5a'}
          emissive={hovered ? '#4a4a5a' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[2.2, 0.2, 2.2]} />
        <meshStandardMaterial color="#3a3a4a" />
      </mesh>

      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}

      <mesh position={[0, 1, 1.05]}>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.5}
          emissive="#87CEEB"
          emissiveIntensity={0.4}
        />
      </mesh>

      <pointLight
        position={[0, 3, 0]}
        color={guardPost.needsRelief ? '#F77F00' : '#00A86B'}
        intensity={guardPost.needsRelief ? lightIntensity * 2 : 0.5}
        distance={5}
      />

      <Html position={[0, 3.5, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-military-500/50 whitespace-nowrap">
          <p className="text-white text-xs font-bold">{guardPost.name}</p>
          <p className="text-xs text-gray-300">
            {guardPost.guard.name} · {guardPost.shiftDuration.toFixed(1)}小时
          </p>
          {guardPost.needsRelief && (
            <p className="text-xs text-orange-500 animate-pulse">⚠ 需换岗</p>
          )}
        </div>
      </Html>
    </group>
  );
};

export default GuardPostBuilding;
