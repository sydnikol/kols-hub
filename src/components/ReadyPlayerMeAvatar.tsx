import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { AvatarDisplayProps } from '../types/avatar';

/**
 * 🎮 READY PLAYER ME AVATAR - 3D Display Component
 * =================================================
 * Full-featured 3D avatar display with mood-based effects,
 * animations, and customizable controls for KOL companion.
 */

/**
 * 3D Avatar Model with Advanced Animations
 */
const AvatarModel: React.FC<{ 
  url: string; 
  mood?: string; 
  animationSpeed?: number;
  expression?: string;
}> = ({ 
  url, 
  mood = 'neutral',
  animationSpeed = 1,
  expression = 'idle'
}) => {
  const gltf = useLoader(GLTFLoader, url);
  const modelRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);
  const [animationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null);

  // Initialize animation mixer if model has animations
  useEffect(() => {
    if (gltf && gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      setAnimationMixer(mixer);

      // Play first animation by default
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
  }, [gltf]);

  // Animation loop with mood-based effects
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Rotation animation (idle swaying)
      const rotationSpeed = getRotationSpeed(mood, animationSpeed);
      setRotation((prev) => prev + delta * rotationSpeed);
      modelRef.current.rotation.y = rotation;
      
      // Vertical movement (breathing animation)
      const breatheIntensity = getBreathIntensity(mood);
      const breathe = Math.sin(state.clock.elapsedTime * 2) * breatheIntensity;
      modelRef.current.position.y = breathe;

      // Head bobbing for certain moods
      if (mood === 'thinking' || mood === 'curious') {
        const headBob = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
        modelRef.current.rotation.x = headBob;
      }

      // Update animation mixer
      if (animationMixer) {
        animationMixer.update(delta * animationSpeed);
      }
    }
  });

  useEffect(() => {
    if (gltf && modelRef.current) {
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());      
      gltf.scene.position.x = -center.x;
      gltf.scene.position.y = -center.y;
      gltf.scene.position.z = -center.z;
      
      // Apply mood-based visual effects
      applyMoodEffect(gltf.scene, mood);
      
      // Apply expression-based pose adjustments
      applyExpressionPose(gltf.scene, expression);
    }
  }, [gltf, mood, expression]);

  return (
    <group ref={modelRef}>
      <primitive object={gltf.scene} scale={2} />
    </group>
  );
};

/**
 * Get rotation speed based on mood
 */
const getRotationSpeed = (mood: string, baseSpeed: number): number => {
  const moodSpeeds: Record<string, number> = {
    'excited': 0.4,
    'happy': 0.3,
    'neutral': 0.2,
    'thinking': 0.1,
    'mysterious': 0.15,
    'sad': 0.05,
    'angry': 0.25,
  };
  return (moodSpeeds[mood] || 0.2) * baseSpeed;
};

/**
 * Get breathing intensity based on mood
 */
const getBreathIntensity = (mood: string): number => {
  const moodIntensities: Record<string, number> = {
    'excited': 0.02,
    'happy': 0.015,
    'neutral': 0.01,
    'thinking': 0.008,
    'mysterious': 0.012,
    'sad': 0.005,
    'angry': 0.018,
  };
  return moodIntensities[mood] || 0.01;
};

/**
 * Apply visual effects based on mood (gothic futurism aesthetic)
 */
const applyMoodEffect = (scene: THREE.Object3D, mood: string) => {
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      
      if (material) {
        // Gothic futurism color palette
        const moodColors: Record<string, number> = {
          'happy': 0xaa44ff,      // Purple glow
          'thinking': 0x4400ff,   // Deep blue-purple
          'excited': 0xff00ff,    // Magenta
          'mysterious': 0x8800ff, // Dark purple
          'sad': 0x4444aa,        // Muted blue
          'angry': 0xff0066,      // Crimson
          'neutral': 0x6633cc,    // Medium purple
        };

        material.emissive = new THREE.Color(moodColors[mood] || 0x000000);
        material.emissiveIntensity = 0.3;
        
        // Add subtle glow effect
        if (mood !== 'neutral') {
          material.metalness = 0.3;
          material.roughness = 0.7;
        }
      }
    }
  });
};

/**
 * Apply pose adjustments based on expression
 */
const applyExpressionPose = (scene: THREE.Object3D, expression: string) => {
  // Find skeleton/bones if available
  scene.traverse((child) => {
    if (child.type === 'Bone') {
      const bone = child as THREE.Bone;
      
      // Adjust head tilt based on expression
      if (bone.name.toLowerCase().includes('head')) {
        switch (expression) {
          case 'curious':
            bone.rotation.x = 0.1;
            bone.rotation.z = 0.05;
            break;
          case 'confident':
            bone.rotation.x = -0.05;
            break;
          case 'thinking':
            bone.rotation.x = 0.08;
            bone.rotation.y = 0.1;
            break;
        }
      }
    }
  });
};

/**
 * Loading fallback component
 */
const LoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p className="text-purple-300 animate-pulse">Summoning avatar...</p>
      <p className="text-purple-400/60 text-sm mt-2">Loading from the digital realm</p>
    </div>
  </div>
);

/**
 * Error fallback component
 */
const ErrorFallback: React.FC<{ error: Error; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
    <div className="text-center text-red-400 p-6 max-w-md">
      <div className="text-6xl mb-4">⚠️</div>
      <p className="text-xl mb-2 font-semibold">Avatar Loading Failed</p>
      <p className="text-sm text-red-300 mb-4">{error.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

/**
 * Main Ready Player Me Avatar Component
 */
const ReadyPlayerMeAvatar: React.FC<AvatarDisplayProps> = ({
  avatarUrl,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  animationSpeed = 1,
  quality = 'medium',
  enableRotation = true,
  enableZoom = true,
  mood = 'neutral',
  expression = 'idle',
  showControls = false,
  backgroundColor = 'transparent',
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add quality parameter to URL
  const qualityUrl = quality !== 'high' 
    ? `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}quality=${quality}`
    : avatarUrl;

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
  };

  if (error) {
    return <ErrorFallback error={error} onRetry={handleRetry} />;
  }

  // Determine background style
  const bgClass = backgroundColor === 'transparent' 
    ? 'bg-transparent'
    : backgroundColor === 'dark'
    ? 'bg-gradient-to-b from-gray-900 to-black'
    : `bg-${backgroundColor}`;

  return (
    <div className={`w-full h-full ${bgClass} relative`}>
      {isLoading && <LoadingFallback />}
      
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setIsLoading(false)}
        onError={(err) => {
          setError(err as Error);
          setIsLoading(false);
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1, 3]} />
                    
          {/* Advanced Lighting Setup */}
          <ambientLight intensity={0.6} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8844ff" />
          <pointLight position={[0, 10, 0]} intensity={0.3} color="#44aaff" />
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#000000', 5, 15]} />
          
          {/* Avatar Model */}
          <group position={position} rotation={rotation} scale={scale}>
            <AvatarModel 
              url={qualityUrl} 
              mood={mood} 
              animationSpeed={animationSpeed}
              expression={expression}
            />
          </group>
          
          {/* Controls */}
          <OrbitControls
            enableRotate={enableRotation}
            enableZoom={enableZoom}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
            target={[0, 1, 0]}
            autoRotate={mood === 'excited'}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>

      {/* Control Panel Overlay */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 flex gap-4 items-center">
          <div className="text-xs text-purple-300">
            <span className="font-semibold">Mood:</span> {mood}
          </div>
          <div className="text-xs text-purple-300">
            <span className="font-semibold">Quality:</span> {quality}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyPlayerMeAvatar;
