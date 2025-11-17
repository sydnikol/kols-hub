import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Environment, MeshReflectorMaterial } from '@react-three/drei';

function CreativeTools({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group position={position}>
        {/* Paintbrush */}
        <mesh position={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.5} />
        </mesh>
        {/* Pen */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
          <meshStandardMaterial color="#C0C0D8" metalness={0.8} />
        </mesh>
        {/* Music Note */}
        <mesh position={[0.3, 0.1, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#8B6DB8" emissive="#8B6DB8" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

export default function StudioRoom() {
  return (
    <Canvas camera={{ position: [0, 3, 7], fov: 60 }} shadows>
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 8, 5]} angle={0.4} penumbra={1} intensity={0.7} castShadow color="#C0C0D8" />
      <pointLight position={[0, 4, 0]} intensity={0.4} color="#8B6DB8" />
      <Environment preset="city" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial color="#0A0A0F" metalness={0.5} roughness={0.3} mirror={0.2} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <CreativeTools key={i} position={[Math.cos(i * Math.PI / 3) * 3, Math.sin(i * 0.5) * 0.5, Math.sin(i * Math.PI / 3) * 3]} />
      ))}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 2]} />
        <meshStandardMaterial color="#1A1A24" metalness={0.4} />
      </mesh>
      <Sparkles count={150} scale={12} size={3} speed={0.4} color="#8B6DB8" opacity={0.4} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={3} maxDistance={12} />
    </Canvas>
  );
}
