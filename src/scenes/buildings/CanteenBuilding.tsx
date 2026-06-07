import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useBuildingStore } from '../../store/useBuildingStore';
import { Canteen as CanteenType } from '../../utils/types';

interface Props {
  canteen: CanteenType;
}

const CanteenBuilding = ({ canteen }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);

  const lowStockDishes = canteen.windows.flatMap(w => w.dishes).filter(d => d.needsPurchase);
  const totalQueue = canteen.windows.reduce((sum, w) => sum + w.queueCount, 0);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedBuilding('canteen', canteen.id);
  };

  return (
    <group
      ref={groupRef}
      position={[canteen.position.x, canteen.position.y, canteen.position.z]}
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
        <boxGeometry args={[8, 4, 7]} />
        <meshStandardMaterial
          color={hovered ? '#e8d5b7' : '#d4c4a8'}
          emissive={hovered ? '#d4c4a8' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      <mesh position={[0, 4.3, 0]}>
        <coneGeometry args={[5.5, 1.5, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      <mesh position={[0, 4.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {[-2.5, 0, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 3.6]}>
          <boxGeometry args={[1.5, 2.5, 0.1]} />
          <meshStandardMaterial
            color="#87CEEB"
            transparent
            opacity={0.6}
            emissive="#87CEEB"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      <mesh position={[0, 1, 3.6]}>
        <boxGeometry args={[2, 2, 0.15]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 8]} />
        <meshStandardMaterial color="#3a3a4a" />
      </mesh>

      <mesh position={[-3, 0.1, -2]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
        <meshStandardMaterial color="#2d5a2d" />
      </mesh>

      <Html position={[0, 6, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-military-500/50 whitespace-nowrap">
          <p className="text-white text-xs font-bold">{canteen.name}</p>
          <p className="text-xs text-gray-300">排队人数: {totalQueue}人</p>
          {lowStockDishes.length > 0 && (
            <p className="text-xs text-red-500 animate-pulse">
              ⚠ {lowStockDishes.length}种菜品库存不足
            </p>
          )}
        </div>
      </Html>
    </group>
  );
};

export default CanteenBuilding;
