import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

import BarracksBuilding from './buildings/BarracksBuilding';
import TrainingGroundBuilding from './buildings/TrainingGroundBuilding';
import ArmoryBuilding from './buildings/ArmoryBuilding';
import CanteenBuilding from './buildings/CanteenBuilding';
import GuardPostBuilding from './buildings/GuardPostBuilding';
import CommandCenterBuilding from './buildings/CommandCenterBuilding';
import SoldierModel from './personnel/SoldierModel';

import { useBuildingStore } from '../store/useBuildingStore';
import { usePersonnelStore } from '../store/usePersonnelStore';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { FORBIDDEN_ZONES } from '../utils/constants';
import { useBuildingStore as useBuildingStoreSelector } from '../store/useBuildingStore';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[120, 120, 50, 50]} />
      <meshStandardMaterial color="#1a2a1a" />
    </mesh>
  );
}

function Roads() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[60, 4]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[4, 60]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <planeGeometry args={[0.2, 60]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.025, 0]}>
        <planeGeometry args={[0.2, 60]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

function ForbiddenZones() {
  return (
    <group>
      {FORBIDDEN_ZONES.map((zone) => {
        const width = zone.bounds.maxX - zone.bounds.minX;
        const depth = zone.bounds.maxZ - zone.bounds.minZ;
        const centerX = (zone.bounds.minX + zone.bounds.maxX) / 2;
        const centerZ = (zone.bounds.minZ + zone.bounds.maxZ) / 2;
        return (
          <group key={zone.id}>
            <mesh
              position={[centerX, 0.03, centerZ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[width, depth]} />
              <meshStandardMaterial
                color={zone.color}
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh
              position={[centerX, 0.1, centerZ]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[Math.min(width, depth) / 2 - 0.1, Math.min(width, depth) / 2, 32]} />
              <meshBasicMaterial
                color={zone.color}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function EmergencyOverlay() {
  const { drill } = useEmergencyStore();

  if (!drill.isActive) return null;

  return (
    <group>
      {drill.dangerZones.map((zone) => {
        const width = zone.bounds.maxX - zone.bounds.minX;
        const depth = zone.bounds.maxZ - zone.bounds.minZ;
        const centerX = (zone.bounds.minX + zone.bounds.maxX) / 2;
        const centerZ = (zone.bounds.minZ + zone.bounds.maxZ) / 2;
        return (
          <mesh
            key={zone.id}
            position={[centerX, 0.05, centerZ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[width, depth]} />
            <meshStandardMaterial
              color="#D62828"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {drill.evacuationRoutes.map((route) => (
        <line key={route.id}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={route.points.length}
              array={new Float32Array(route.points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00A86B" linewidth={3} />
        </line>
      ))}

      {drill.evacuationRoutes.map((route) => (
        <group key={`arrow-${route.id}`}>
          {route.points.slice(0, -1).map((point, i) => {
            const nextPoint = route.points[i + 1];
            return (
              <mesh
                key={i}
                position={[point.x, point.y + 0.2, point.z]}
                rotation={[
                  Math.atan2(
                    nextPoint.z - point.z,
                    Math.sqrt(Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2))
                  ),
                  0,
                  -Math.atan2(nextPoint.x - point.x, nextPoint.y - point.y)
                ]}
              >
                <coneGeometry args={[0.2, 0.4, 4]} />
                <meshBasicMaterial color="#00A86B" />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function SceneUpdater() {
  const updateSoldierPositions = usePersonnelStore(state => state.updateSoldierPositions);
  const checkForbiddenZones = usePersonnelStore(state => state.checkForbiddenZones);
  const lastUpdateRef = useRef(0);

  useFrame((_, delta) => {
    lastUpdateRef.current += delta;
    if (lastUpdateRef.current >= 0.1) {
      updateSoldierPositions(lastUpdateRef.current);
      checkForbiddenZones();
      lastUpdateRef.current = 0;
    }
  });

  return null;
}

function CameraController() {
  const { camera } = useThree();
  const selectedBuilding = useBuildingStore(state => state.selectedBuilding);
  const { barracks, trainingGround, armory, canteen, guardPosts } = useBuildingStore();

  useEffect(() => {
    if (!selectedBuilding) return;

    let targetPos: { x: number; y: number; z: number } | null = null;

    switch (selectedBuilding.type) {
      case 'barracks':
        const barrack = barracks.find(b => b.id === selectedBuilding.id);
        if (barrack) targetPos = barrack.position;
        break;
      case 'trainingGround':
        targetPos = trainingGround.position;
        break;
      case 'armory':
        targetPos = armory.position;
        break;
      case 'canteen':
        targetPos = canteen.position;
        break;
      case 'guardPost':
        const gp = guardPosts.find(g => g.id === selectedBuilding.id);
        if (gp) targetPos = gp.position;
        break;
      case 'commandCenter':
        targetPos = { x: 0, y: 0, z: 0 };
        break;
    }

    if (targetPos) {
      const offset = { x: targetPos.x + 15, y: 15, z: targetPos.z + 15 };
      camera.position.lerp(new THREE.Vector3(offset.x, offset.y, offset.z), 0.1);
    }
  }, [selectedBuilding, camera, barracks, trainingGround, armory, canteen, guardPosts]);

  return null;
}

function SceneContent() {
  const { barracks, trainingGround, armory, canteen, guardPosts } = useBuildingStore();
  const { soldiers } = usePersonnelStore();

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Ground />
      <Roads />
      <ForbiddenZones />
      <EmergencyOverlay />

      {barracks.map(barrack => (
        <BarracksBuilding key={barrack.id} barracks={barrack} />
      ))}
      <TrainingGroundBuilding trainingGround={trainingGround} />
      <ArmoryBuilding armory={armory} />
      <CanteenBuilding canteen={canteen} />
      {guardPosts.map(gp => (
        <GuardPostBuilding key={gp.id} guardPost={gp} />
      ))}
      <CommandCenterBuilding />

      {soldiers.slice(0, 15).map(soldier => (
        <SoldierModel key={soldier.id} soldier={soldier} />
      ))}

      <SceneUpdater />
      <CameraController />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  );
}

const CampusScene = () => {
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);

  return (
    <div className="w-full h-full" onClick={() => setSelectedBuilding(null)}>
      <Canvas
        shadows
        camera={{ position: [30, 25, 30], fov: 60 }}
        gl={{ antialias: true }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={80}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
        />
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default CampusScene;
