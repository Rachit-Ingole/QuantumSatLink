'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LaserBeamProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  isActive?: boolean;
  opacity?: number;
}

export function LaserBeam({ 
  start, 
  end, 
  color = '#ef4444',
  isActive = true,
  opacity = 0.6
}: LaserBeamProps) {
  const lineRef = useRef<THREE.Line>(null);
  const timeRef = useRef(0);

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  useFrame((state, delta) => {
    if (lineRef.current && isActive) {
      timeRef.current += delta * 2;
      const pulse = Math.sin(timeRef.current * 3) * 0.3 + 0.7;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = pulse * opacity;
    }
  });

  if (!isActive) return null;

  return (
    <primitive 
      object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        linewidth: 2
      }))}
      ref={lineRef}
    />
  );
}
