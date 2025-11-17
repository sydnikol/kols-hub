import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ChronoMuseAvatarProps {
  mood: 'overwhelm' | 'curiosity' | 'grief' | 'focus' | 'victory' | 'calm';
}

export default function ChronoMuseAvatar({ mood }: ChronoMuseAvatarProps) {
  const [glowColor, setGlowColor] = useState('#4A5DB8');
  
  useEffect(() => {
    const moodColors = {
      overwhelm: '#4A7DB8',
      curiosity: '#D4AF37',
      grief: '#6B7DB8',
      focus: '#C0C0D8',
      victory: '#D4AF37',
      calm: '#4A5DB8'
    };
    setGlowColor(moodColors[mood]);
  }, [mood]);

  return (
    <motion.div
      className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#C0C0D8]/30 bg-gradient-to-br from-[#0A0A0F] to-[#1A1A24] relative"
      animate={{ borderColor: `${glowColor}60` }}
      transition={{ duration: 1 }}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color={glowColor} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#C0C0D8" />
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.3} metalness={0.6} roughness={0.4} />
        </mesh>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
      
      {/* Mood Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-[#C0C0D8]/30">
        <p className="text-[#C0C0D8] text-xs font-medium">{mood}</p>
      </div>
    </motion.div>
  );
}
