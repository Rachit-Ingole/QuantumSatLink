'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBasisColor } from '@/lib/utils';

interface PhotonStreamProps {
  bits: number[];
  bases: string[];
  isActive: boolean;
  speed?: number;
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  eveActive?: boolean;
}

interface Photon {
  position: THREE.Vector3;
  bit: number;
  basis: string;
  progress: number;
  color: string;
  isIntercepted: boolean;
}

export function PhotonStream({
  bits,
  bases,
  isActive,
  speed = 0.02,
  startPosition,
  endPosition,
  eveActive = false
}: PhotonStreamProps) {
  const photonsRef = useRef<Photon[]>([]);
  const timeRef = useRef(0);
  const spawnCounterRef = useRef(0);

  // Initialize photons
  useMemo(() => {
    if (isActive && bits.length > 0) {
      photonsRef.current = [];
    }
  }, [isActive, bits]);

  useFrame((state, delta) => {
    if (!isActive || bits.length === 0) return;

    timeRef.current += delta;
    spawnCounterRef.current += delta;

    // Spawn new photons
    if (spawnCounterRef.current > 0.1 && photonsRef.current.length < bits.length) {
      const index = photonsRef.current.length;
      const basis = bases[index] || '+';
      const isIntercepted = eveActive && Math.random() > 0.5;
      
      photonsRef.current.push({
        position: new THREE.Vector3(...startPosition),
        bit: bits[index],
        basis: basis,
        progress: 0,
        color: isIntercepted ? '#ef4444' : getBasisColor(basis),
        isIntercepted
      });
      spawnCounterRef.current = 0;
    }

    // Update photon positions
    photonsRef.current.forEach(photon => {
      photon.progress += speed;
      
      if (photon.progress <= 1) {
        photon.position.lerpVectors(
          new THREE.Vector3(...startPosition),
          new THREE.Vector3(...endPosition),
          photon.progress
        );
      }
    });

    // Remove completed photons
    photonsRef.current = photonsRef.current.filter(p => p.progress <= 1.2);
  });

  return (
    <group>
      {photonsRef.current.map((photon, i) => (
        <mesh key={i} position={photon.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={photon.color}
            emissive={photon.color}
            emissiveIntensity={photon.isIntercepted ? 1.5 : 0.8}
            transparent
            opacity={1 - photon.progress * 0.5}
          />
          {photon.isIntercepted && (
            <pointLight 
              color="#ef4444" 
              intensity={3} 
              distance={2} 
            />
          )}
        </mesh>
      ))}
    </group>
  );
}
