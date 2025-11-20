'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export function Earth() {
  const earthGroupRef = useRef<THREE.Group>(null);
  
  // Load Earth texture
  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
  );

  // Slow rotation
  useFrame(() => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += 0.001;
    }
  });

  const earthRadius = 2.5;
  const lat = 28.6139 * (Math.PI / 180) - 0.2; 
  const lon = 77.2090 * (Math.PI / 180) + 1.6;
  
  // Three.js uses: x = r*cos(lat)*sin(lon), y = r*sin(lat), z = r*cos(lat)*cos(lon)
  const stationX = earthRadius * Math.cos(lat) * Math.sin(lon);
  const stationY = earthRadius * Math.sin(lat);
  const stationZ = earthRadius * Math.cos(lat) * Math.cos(lon);

  return (
    <group ref={earthGroupRef}>
      
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      
      <group position={[stationX, stationY, stationZ]}>
        <mesh rotation={[-Math.PI / 2 + lat, 0, lon]}>
          <coneGeometry args={[0.3, 0.5, 8]} />
          <meshStandardMaterial 
            color="#22c55e"
            emissive="#16a34a"
            emissiveIntensity={0.5}
          />
        </mesh>
        <pointLight color="#22c55e" intensity={2} distance={3} />
      </group>
    </group>
  );
}

