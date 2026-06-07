import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingStore } from '../../store/useBuildingStore';
import { useEmergencyStore } from '../../store/useEmergencyStore';

const CommandCenterBuilding = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);
  const { drill } = useEmergencyStore();

  useFrame((state) => {
    setRotation(state.clock.elapsedTime * 0.2);
  });

  const position = { x: 0, y: 0, z: 0 };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedBuilding('commandCenter', 'command1');
  };

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
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
        <meshStandardMaterial color="#2a2a3a" />
      </mesh>

      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5, 5.2, 32]} />
        <meshStandardMaterial
          color={drill.isActive ? '#D62828' : '#2C5F2D'}
          emissive={drill.isActive ? '#D62828' : '#2C5F2D'}
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[4, 4.5, 5, 8]} />
        <meshStandardMaterial
          color={hovered ? '#3a4a5a' : '#2a3a4a'}
          emissive={drill.isActive ? '#D62828' : hovered ? '#2a3a4a' : '#000000'}
          emissiveIntensity={drill.isActive ? 0.2 : hovered ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, 5.5, 0]}>
        <cylinderGeometry args={[3, 4, 1.5, 8]} />
        <meshStandardMaterial color="#1a2a3a" />
      </mesh>

      <mesh position={[0, 7, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color={drill.isActive ? '#D62828' : '#1E3A5F'}
          emissive={drill.isActive ? '#D62828' : '#1E3A5F'}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      <group position={[0, 7, 0]} rotation={[0, rotation, 0]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0.8, 2.5, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[1.5, 0.1, 1]} />
          <meshStandardMaterial color="#D62828" />
        </mesh>
      </group>

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 3.5;
        const z = Math.sin(angle) * 3.5;
        return (
          <mesh key={i} position={[x, 2.5, z]}>
            <boxGeometry args={[0.8, 1.5, 0.1]} />
            <meshStandardMaterial
              color="#87CEEB"
              transparent
              opacity={0.5}
              emissive="#87CEEB"
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      <pointLight
        position={[0, 8, 0]}
        color={drill.isActive ? '#D62828' : '#0077B6'}
        intensity={drill.isActive ? 3 : 1}
        distance={20}
      />

      <Html position={[0, 10, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-military-500/50 whitespace-nowrap">
          <p className="text-white text-sm font-bold font-orbitron">指挥中心</p>
          {drill.isActive && (
            <p className="text-xs text-red-500 animate-pulse font-bold">
              ⚠ 应急演练进行中
            </p>
          )}
        </div>
      </Html>
    </group>
  );
};

export default CommandCenterBuilding;
