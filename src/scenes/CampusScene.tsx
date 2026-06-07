import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
import { FORBIDDEN_ZONES, EVACUATION_ROUTES, DANGER_ZONES } from '../utils/constants';

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
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

      {drill.evacuationRoutes.map((route) => {
        const points = route.points.map(p => new THREE.Vector3(p.x, p.y + 0.1, p.z));
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
        
        return (
          <group key={route.id}>
            <mesh geometry={tubeGeometry}>
              <meshBasicMaterial color="#00A86B" transparent opacity={0.8} />
            </mesh>
            {points.slice(0, -1).map((point, i) => {
              const nextPoint = points[i + 1];
              const direction = new THREE.Vector3().subVectors(nextPoint, point).normalize();
              const arrowPosition = point.clone().add(direction.multiplyScalar(0.5));
              return (
                <mesh
                  key={i}
                  position={[arrowPosition.x, arrowPosition.y + 0.3, arrowPosition.z]}
                  rotation={[
                    0,
                    Math.atan2(nextPoint.x - point.x, nextPoint.z - point.z),
                    0
                  ]}
                >
                  <coneGeometry args={[0.25, 0.5, 4]} />
                  <meshBasicMaterial color="#00A86B" />
                </mesh>
              );
            })}
          </group>
        );
      })}
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
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

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
    </>
  );
}

const CampusScene = () => {
  const setSelectedBuilding = useBuildingStore(state => state.setSelectedBuilding);

  return (
    <div className="w-full h-full" onClick={() => setSelectedBuilding(null)}>
      <Canvas
        shadows
        camera={{ position: [35, 25, 35], fov: 55 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0a0f1a']} />
        <fog attach="fog" args={['#0a0f1a', 50, 120]} />
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
