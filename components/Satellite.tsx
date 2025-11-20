'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SatelliteProps {
  radius?: number;
  speed?: number;
  color?: string;
}

export function Satellite({ 
  radius = 8, 
  speed = 0.3,
  color = '#f59e0b'
}: SatelliteProps) {
  const satelliteRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (satelliteRef.current) {
      timeRef.current += delta * speed;
      const angle = timeRef.current;
      
      // Orbital position
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle * 0.3) * 1.5; // Inclined orbit
      const z = Math.sin(angle) * radius;
      
      satelliteRef.current.position.set(x, y, z);
      
      // Rotate to face Earth
      satelliteRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={satelliteRef}>
      
      <mesh>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.8]} />
        <meshStandardMaterial 
          color="#1e3a8a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.8]} />
        <meshStandardMaterial 
          color="#1e3a8a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      
      
      <pointLight color={color} intensity={2} distance={3} />
    </group>
  );
}
