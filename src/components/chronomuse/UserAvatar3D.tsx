import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedCharacter() {
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Gentle breathing animation
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 0.5) * 0.05;
    }

    // Head slight rotation
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    }

    // Rotating aura
    if (auraRef.current) {
      auraRef.current.rotation.y = time * 0.5;
      auraRef.current.rotation.x = time * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Aura/Energy field */}
      <mesh ref={auraRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#8B6DB8"
          emissive="#8B6DB8"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Body */}
      <mesh ref={bodyRef} position={[0, -0.5, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.5, 16, 32]} />
        <meshStandardMaterial
          color="#4A5DB8"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <MeshDistortMaterial
          color="#C0C0D8"
          metalness={0.4}
          roughness={0.5}
          distort={0.2}
          speed={2}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 0.85, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[0.15, 0.85, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.6, -0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
        <meshStandardMaterial color="#4A5DB8" />
      </mesh>
      <mesh position={[0.6, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
        <meshStandardMaterial color="#4A5DB8" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.25, -1.5, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.9, 8, 16]} />
        <meshStandardMaterial color="#6B5DB8" />
      </mesh>
      <mesh position={[0.25, -1.5, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.9, 8, 16]} />
        <meshStandardMaterial color="#6B5DB8" />
      </mesh>

      {/* Floating sparkles around character */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 1.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i) * 0.5;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#C0C0D8"
              emissive="#C0C0D8"
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function UserAvatar3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }} shadows>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#C0C0D8" />
        <pointLight position={[-5, 3, -5]} intensity={0.4} color="#8B6DB8" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.5}
          penumbra={1}
          intensity={0.5}
          castShadow
          color="#D4AF37"
        />

        <AnimatedCharacter />

        {/* Ground shadow plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#0A0A0F" opacity={0.5} transparent />
        </mesh>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
