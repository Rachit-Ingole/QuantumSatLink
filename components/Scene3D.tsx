'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Earth } from './Earth';
import { Satellite } from './Satellite';
import { LaserBeam } from './LaserBeam';
import { PhotonStream } from './PhotonStream';
import { CommunicationBeam } from './CommunicationBeam';

interface Scene3DProps {
  isSimulating: boolean;
  aliceBits: number[];
  aliceBases: string[];
  eveActive: boolean;
  distanceKm?: number;
  satelliteRadius?: number;
  satelliteSpeed?: number;
  showCommunication?: boolean;
}

function SatelliteTracker({ 
  onPositionUpdate,
  radius 
}: { 
  onPositionUpdate: (pos: [number, number, number]) => void;
  radius: number;
}) {
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.3;
    const angle = timeRef.current;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle * 0.3) * 1.5;
    const z = Math.sin(angle) * radius;
    
    onPositionUpdate([x, y, z]);
  });

  return null;
}

export function Scene3D({
  isSimulating,
  aliceBits,
  aliceBases,
  eveActive,
  distanceKm = 500,
  satelliteSpeed = 0.3,
  showCommunication = false
}: Scene3DProps) {
  // Scale satellite orbit based on distance: 200km->6 units, 500km->8 units, 2000km->14 units
  // Recalculate on every render when distanceKm changes
  const satelliteRadius = 6 + ((distanceKm - 200) / 1800) * 8;
  const satellitePosRef = useRef<[number, number, number]>([satelliteRadius, 0, 0]);
  
  // India's ground station position on Earth surface
  const earthRadius = 2.5;
  const lat = 20.5937 * (Math.PI / 180);
  const lon = 78.9629 * (Math.PI / 180);
  const groundStationPos: [number, number, number] = [
    earthRadius * Math.cos(lat) * Math.cos(lon),
    earthRadius * Math.sin(lat),
    earthRadius * Math.cos(lat) * Math.sin(lon)
  ];

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <directionalLight position={[-10, 5, -5]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} intensity={1.2} color="#3b82f6" />
          <pointLight position={[10, 5, 10]} intensity={1} color="#ffffff" />

          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5}
          />
          <Earth />

          <Satellite 
            radius={satelliteRadius} 
            speed={satelliteSpeed}
            color={eveActive ? '#ef4444' : '#f59e0b'}
          />

          <SatelliteTracker 
            radius={satelliteRadius}
            onPositionUpdate={(pos) => {
              satellitePosRef.current = pos;
            }}
          />

          
          {isSimulating && (
            <LaserBeam
              start={satellitePosRef.current}
              end={groundStationPos}
              color={eveActive ? '#ef4444' : '#3b82f6'}
              isActive={isSimulating}
              opacity={0.4}
            />
          )}

          
          {isSimulating && aliceBits.length > 0 && (
            <PhotonStream
              bits={aliceBits}
              bases={aliceBases}
              isActive={isSimulating}
              speed={0.015}
              startPosition={satellitePosRef.current}
              endPosition={groundStationPos}
              eveActive={eveActive}
            />
          )}

          
          {eveActive && (
            <group position={[
              satellitePosRef.current[0] * 0.5,
              satellitePosRef.current[1] * 0.5,
              satellitePosRef.current[2] * 0.5
            ]}>
              <mesh>
                <octahedronGeometry args={[0.4, 0]} />
                <meshStandardMaterial
                  color="#ef4444"
                  emissive="#dc2626"
                  emissiveIntensity={1}
                  wireframe
                />
              </mesh>
              <pointLight color="#ef4444" intensity={5} distance={5} />
            </group>
          )}

          
          {showCommunication && !isSimulating && (
            <>
              
              <CommunicationBeam
                start={groundStationPos}
                end={satellitePosRef.current}
                color="#10b981"
                isActive={true}
                direction="uplink"
                delay={0}
              />
              
              
              <CommunicationBeam
                start={groundStationPos}
                end={satellitePosRef.current}
                color="#06b6d4"
                isActive={true}
                direction="downlink"
                delay={1}
              />
            </>
          )}

          <OrbitControls
            enablePan={false}
            minDistance={10}
            maxDistance={30}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
