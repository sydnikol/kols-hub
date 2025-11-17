import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Environment } from '@react-three/drei';

function BreathOrb({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh position={position}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#4A7DB8" transparent opacity={0.6} emissive="#4A7DB8" emissiveIntensity={0.4} />
      </mesh>
    </Float>
  );
}

export default function SanctuaryRoom() {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 55 }} shadows>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#4A7DB8" />
      <spotLight position={[3, 6, 3]} angle={0.5} penumbra={1.5} intensity={0.2} color="#6B7DB8" />
      <Environment preset="night" />
      <fog attach="fog" args={['#0A0A0F', 5, 20]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#0A0A0F" roughness={1} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <BreathOrb key={i} position={[Math.cos(i * Math.PI * 2 / 5) * 2, Math.sin(i * 0.3) * 0.3 + 1, Math.sin(i * Math.PI * 2 / 5) * 2]} />
      ))}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color="#1A1A24" roughness={0.8} />
      </mesh>
      <Sparkles count={80} scale={8} size={1.5} speed={0.2} color="#4A7DB8" opacity={0.2} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={10} />
    </Canvas>
  );
}
