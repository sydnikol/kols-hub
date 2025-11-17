import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Environment, Ring, Torus } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function OrbitRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.7} />
    </mesh>
  );
}

function EraStar({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#C0C0D8" emissive="#C0C0D8" emissiveIntensity={0.8} />
        </mesh>
        <pointLight intensity={0.3} distance={2} color="#C0C0D8" />
      </group>
    </Float>
  );
}

export default function ObservatoryRoom() {
  return (
    <Canvas camera={{ position: [0, 3, 10], fov: 65 }} shadows>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#C0C0D8" />
      <Environment preset="night" />
      <OrbitRing radius={3} speed={0.1} color="#4A5DB8" />
      <OrbitRing radius={4.5} speed={-0.08} color="#6B5DB8" />
      <OrbitRing radius={6} speed={0.06} color="#8B6DB8" />
      {[
        { pos: [3, 0.5, 0], label: "Harlem 1920s" },
        { pos: [-3, -0.5, 1], label: "Ancient Nubia" },
        { pos: [2, 1, -2], label: "Edo Japan" },
        { pos: [-2, -1, -2], label: "Cyber Seoul" },
        { pos: [0, 1.5, 3], label: "Afro-Future" },
        { pos: [1, -1.5, 2], label: "Queer Liberation" }
      ].map((star, i) => (
        <EraStar key={i} position={star.pos as [number, number, number]} label={star.label} />
      ))}
      <Sparkles count={300} scale={15} size={2} speed={0.3} color="#C0C0D8" opacity={0.5} />
      <OrbitControls enablePan={true} minDistance={5} maxDistance={15} />
    </Canvas>
  );
}
