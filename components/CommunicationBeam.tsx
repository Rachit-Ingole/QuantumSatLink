'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CommunicationBeamProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  isActive: boolean;
  direction: 'uplink' | 'downlink';
  delay?: number;
}

export function CommunicationBeam({
  start,
  end,
  color,
  isActive,
  direction,
  delay = 0
}: CommunicationBeamProps) {
  const beamRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!isActive || !beamRef.current || !pulseRef.current) return;

    timeRef.current += delta;
    
    // Only show after delay
    if (timeRef.current < delay) {
      beamRef.current.visible = false;
      pulseRef.current.visible = false;
      if (lightRef.current) lightRef.current.visible = false;
      return;
    }

    beamRef.current.visible = true;
    pulseRef.current.visible = true;
    if (lightRef.current) lightRef.current.visible = true;

    // Animate pulse traveling along the beam
    const cycleTime = 2; // 2 seconds per cycle
    const progress = ((timeRef.current - delay) % cycleTime) / cycleTime;
    
    // Interpolate position
    const actualStart = direction === 'uplink' ? start : end;
    const actualEnd = direction === 'uplink' ? end : start;
    
    const x = THREE.MathUtils.lerp(actualStart[0], actualEnd[0], progress);
    const y = THREE.MathUtils.lerp(actualStart[1], actualEnd[1], progress);
    const z = THREE.MathUtils.lerp(actualStart[2], actualEnd[2], progress);
    
    pulseRef.current.position.set(x, y, z);
    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
    }

    // Pulse the beam opacity
    const opacity = 0.3 + Math.sin(timeRef.current * 3) * 0.2;
    if (beamRef.current.material instanceof THREE.Material) {
      (beamRef.current.material as any).opacity = opacity;
    }
  });

  // Calculate beam geometry
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction_vec = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction_vec.length();
  const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

  return (
    <group>
      
      <mesh
        ref={beamRef}
        position={[midpoint.x, midpoint.y, midpoint.z]}
        quaternion={new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction_vec.normalize()
        )}
      >
        <cylinderGeometry args={[0.03, 0.03, length, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>

      
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      
      
      <pointLight
        ref={lightRef}
        color={color}
        intensity={3}
        distance={3}
      />
    </group>
  );
}
