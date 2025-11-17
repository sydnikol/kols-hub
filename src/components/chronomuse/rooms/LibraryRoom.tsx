import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Sparkles, Environment } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

// Floating Book Component
function FloatingBook({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} rotation={rotation} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.05]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
        {/* Spine glow */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.28, 0.38, 0.02]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </mesh>
    </Float>
  );
}

// Era Shelf Component
function EraShelf({ position, label, glowColor }: { position: [number, number, number]; label: string; glowColor: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[3, 0.1, 0.4]} />
        <meshStandardMaterial color="#1A1A24" metalness={0.8} roughness={0.2} />
      </mesh>
      <Text3D
        position={[-1.4, 0.2, 0]}
        font="/fonts/gothic-serif.json"
        size={0.15}
        height={0.02}
      >
        {label}
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.5} />
      </Text3D>
    </group>
  );
}

export default function LibraryRoom() {
  const bookColors = ['#4A5DB8', '#C0C0D8', '#6B5DB8', '#8B6DB8'];
  
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 60 }} shadows>
      {/* Lighting - Dim velvet reading room */}
      <ambientLight intensity={0.2} />
      <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={0.5} castShadow color="#C0C0D8" />
      <spotLight position={[-5, 10, 5]} angle={0.3} penumbra={1} intensity={0.5} castShadow color="#C0C0D8" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#4A5DB8" />
      
      {/* Environment */}
      <Environment preset="night" />
      <fog attach="fog" args={['#0A0A0F', 10, 30]} />
      
      {/* Velvet Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1A1A24" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Floating Books - Multiple arranged in semi-circle */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 1.5 - Math.PI * 0.75;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 0.5;
        return (
          <FloatingBook
            key={i}
            position={[x, y, z]}
            rotation={[Math.random() * 0.2, angle, Math.random() * 0.2]}
            color={bookColors[i % bookColors.length]}
          />
        );
      })}
      
      {/* Era Shelves */}
      <EraShelf position={[-4, 0, -5]} label="Ancient Civilizations" glowColor="#D4AF37" />
      <EraShelf position={[4, 0, -5]} label="Renaissance Era" glowColor="#C0C0D8" />
      <EraShelf position={[-4, 1.5, -5]} label="Modern History" glowColor="#4A5DB8" />
      <EraShelf position={[4, 1.5, -5]} label="Future Visions" glowColor="#8B6DB8" />
      
      {/* Mystical Particles */}
      <Sparkles count={100} scale={10} size={2} speed={0.3} color="#C0C0D8" opacity={0.3} />
      
      {/* Reading Desk */}
      <mesh position={[0, 0, 2]} castShadow>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#0A0A0F" metalness={0.6} roughness={0.4} />
      </mesh>
      
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={12} />
    </Canvas>
  );
}
