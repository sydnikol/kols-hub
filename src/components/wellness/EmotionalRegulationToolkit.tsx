/**
 * Emotional Regulation Toolkit
 * ============================
 * A comprehensive, trauma-informed emotional regulation system
 * Based on EMOTIONAL_REGULATION and TRAUMA_INFORMED_COMMUNICATION from kol-master-feature-list.ts
 * 
 * Features:
 * 1. Grounding Exercises (5-4-3-2-1, temperature, box breathing, body scan)
 * 2. Co-Regulation Scripts for partners
 * 3. Breathing Timers with animations
 * 4. Sensory Kit Quick Access
 * 5. Safe Playlists integration
 * 6. Affirmation Library with favorites
 * 7. Meltdown/Shutdown Mode (ultra-simplified)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Heart,
  Wind,
  Thermometer,
  Eye,
  Ear,
  Hand,
  Sparkles,
  Music,
  Users,
  Shield,
  Phone,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Star,
  Bookmark,
  BookmarkCheck,
  Shuffle,
  ExternalLink,
  Moon,
  Sun,
  Droplets,
  Leaf,
  X,
  Check,
  Home,
  Brain,
  Waves,
  Coffee,
  Zap,
} from 'lucide-react';

// ===== TYPES =====
interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  color: string;
}

interface Affirmation {
  id: string;
  text: string;
  category: 'self-worth' | 'pain-validation' | 'rest-permission' | 'safety' | 'strength';
}

interface SensoryItem {
  id: string;
  name: string;
  location: string;
  icon: React.ReactNode;
  category: 'tactile' | 'weighted' | 'scent' | 'visual';
}

interface CoRegulationScript {
  id: string;
  situation: string;
  whatToSay: string[];
  whatNotToSay: string[];
  physicalOptions: string[];
}

interface EmergencyContact {
  name: string;
  relationship: string;
  priority: number;
}

type ViewMode = 'home' | 'grounding' | 'breathing' | 'coregulation' | 'sensory' | 'playlists' | 'affirmations' | 'meltdown';
type GroundingExercise = '54321' | 'temperature' | 'boxbreathing' | 'bodyscan';
type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';

// ===== DATA =====
const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal parts in, hold, out, hold. Calming and grounding.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: 'from-sky-400/30 to-teal-400/30',
  },
  {
    id: '4-7-8',
    name: '4-7-8 Relaxing',
    description: 'Deep relaxation breath for sleep and anxiety relief.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    color: 'from-indigo-400/30 to-purple-400/30',
  },
  {
    id: 'calming',
    name: 'Extended Exhale',
    description: 'Long exhale activates the parasympathetic system.',
    inhale: 4,
    hold1: 2,
    exhale: 8,
    hold2: 0,
    color: 'from-violet-400/30 to-fuchsia-400/30',
  },
  {
    id: 'custom',
    name: 'Gentle Breath',
    description: 'Simple, easy rhythm for when you need something soft.',
    inhale: 3,
    hold1: 0,
    exhale: 5,
    hold2: 2,
    color: 'from-rose-400/30 to-pink-400/30',
  },
];

const AFFIRMATIONS: Affirmation[] = [
  // Self-Worth
  { id: 'sw1', text: 'I am worthy of care and compassion, especially from myself.', category: 'self-worth' },
  { id: 'sw2', text: 'My worth is not determined by my productivity.', category: 'self-worth' },
  { id: 'sw3', text: 'I deserve to take up space in this world.', category: 'self-worth' },
  { id: 'sw4', text: 'I am enough, exactly as I am right now.', category: 'self-worth' },
  { id: 'sw5', text: 'My existence is valuable beyond what I can do for others.', category: 'self-worth' },
  
  // Pain Validation
  { id: 'pv1', text: 'My pain is real. My experience is valid.', category: 'pain-validation' },
  { id: 'pv2', text: 'I am not exaggerating. I know my body.', category: 'pain-validation' },
  { id: 'pv3', text: 'Chronic illness is not a character flaw.', category: 'pain-validation' },
  { id: 'pv4', text: 'I am the expert on my own body and experience.', category: 'pain-validation' },
  { id: 'pv5', text: 'Believing myself is an act of resistance and healing.', category: 'pain-validation' },
  { id: 'pv6', text: 'My symptoms are not "all in my head" and never were.', category: 'pain-validation' },
  
  // Rest Permission
  { id: 'rp1', text: 'Rest is not laziness. Rest is medicine.', category: 'rest-permission' },
  { id: 'rp2', text: 'I do not need to earn rest. It is my right.', category: 'rest-permission' },
  { id: 'rp3', text: 'My body is asking for rest, and I will listen.', category: 'rest-permission' },
  { id: 'rp4', text: 'Doing nothing is sometimes the most important thing I can do.', category: 'rest-permission' },
  { id: 'rp5', text: 'I release guilt around resting. I am healing.', category: 'rest-permission' },
  { id: 'rp6', text: 'Rest as resistance. Rest as reclamation.', category: 'rest-permission' },
  
  // Safety
  { id: 'sf1', text: 'Right now, in this moment, I am safe.', category: 'safety' },
  { id: 'sf2', text: 'This feeling will pass. I have survived every hard moment so far.', category: 'safety' },
  { id: 'sf3', text: 'I am here. I am present. I am grounded.', category: 'safety' },
  { id: 'sf4', text: 'I can handle this one breath at a time.', category: 'safety' },
  { id: 'sf5', text: 'I am allowed to feel scared and still be okay.', category: 'safety' },
  
  // Strength
  { id: 'st1', text: 'I have survived 100% of my worst days.', category: 'strength' },
  { id: 'st2', text: 'My resilience is not a performance. It is inherent.', category: 'strength' },
  { id: 'st3', text: 'I am doing the best I can with what I have right now.', category: 'strength' },
  { id: 'st4', text: 'Asking for help is a sign of wisdom, not weakness.', category: 'strength' },
  { id: 'st5', text: 'I carry the strength of my ancestors within me.', category: 'strength' },
];

const SENSORY_KIT: SensoryItem[] = [
  { id: 's1', name: 'Fidget Cube', location: 'Nightstand drawer', icon: <Hand className="w-5 h-5" />, category: 'tactile' },
  { id: 's2', name: 'Stress Ball', location: 'Desk organizer', icon: <Hand className="w-5 h-5" />, category: 'tactile' },
  { id: 's3', name: 'Textured Fabric Swatches', location: 'Sensory box - closet shelf', icon: <Hand className="w-5 h-5" />, category: 'tactile' },
  { id: 's4', name: 'Weighted Blanket (15lb)', location: 'Foot of bed', icon: <Moon className="w-5 h-5" />, category: 'weighted' },
  { id: 's5', name: 'Weighted Lap Pad', location: 'Living room basket', icon: <Moon className="w-5 h-5" />, category: 'weighted' },
  { id: 's6', name: 'Lavender Essential Oil', location: 'Nightstand', icon: <Leaf className="w-5 h-5" />, category: 'scent' },
  { id: 's7', name: 'Peppermint Oil', location: 'Kitchen cabinet', icon: <Leaf className="w-5 h-5" />, category: 'scent' },
  { id: 's8', name: 'Vanilla Candle', location: 'Living room shelf', icon: <Leaf className="w-5 h-5" />, category: 'scent' },
  { id: 's9', name: 'LED Color Lamp', location: 'Bedroom', icon: <Sun className="w-5 h-5" />, category: 'visual' },
  { id: 's10', name: 'Liquid Motion Timer', location: 'Desk', icon: <Droplets className="w-5 h-5" />, category: 'visual' },
];

const CO_REGULATION_SCRIPTS: CoRegulationScript[] = [
  {
    id: 'overwhelmed',
    situation: 'When I am overwhelmed or spiraling',
    whatToSay: [
      '"I\'m here with you."',
      '"You don\'t have to figure this out right now."',
      '"What do you need - space or closeness?"',
      '"I believe you."',
      '"This is really hard. I see that."',
    ],
    whatNotToSay: [
      '"Calm down" or "Just breathe"',
      '"It\'s not that bad"',
      '"Have you tried..."',
      '"You\'re overreacting"',
      '"Everything happens for a reason"',
    ],
    physicalOptions: [
      'Sit nearby without touching',
      'Offer hand to hold (ask first)',
      'Light pressure on shoulder (if pre-approved)',
      'Bring weighted blanket',
      'Lower lights',
    ],
  },
  {
    id: 'meltdown',
    situation: 'During a meltdown',
    whatToSay: [
      '"I\'m not going anywhere."',
      '"You\'re safe."',
      '"Take all the time you need."',
      'Nothing - just be present',
    ],
    whatNotToSay: [
      'Questions that require thinking',
      '"What\'s wrong?"',
      '"Why are you upset?"',
      'Anything that requires a response',
    ],
    physicalOptions: [
      'Reduce sensory input (lights, sounds)',
      'Create a physical barrier from stimuli',
      'Offer earplugs or sunglasses',
      'Do NOT touch unless requested',
      'Stay calm and quiet',
    ],
  },
  {
    id: 'shutdown',
    situation: 'During a shutdown',
    whatToSay: [
      '"I\'m here when you\'re ready."',
      '"You don\'t need to talk."',
      '"I\'ll stay nearby."',
      '"Blink once for yes, twice for no" (if nonverbal)',
    ],
    whatNotToSay: [
      '"Talk to me"',
      '"What\'s happening?"',
      '"Snap out of it"',
      'Anything requiring verbal response',
    ],
    physicalOptions: [
      'Dim lights',
      'Bring comfort items nearby',
      'Offer drink with straw',
      'Gentle, rhythmic sounds if helpful',
      'Weighted blanket if pre-approved',
    ],
  },
  {
    id: 'medical-trauma',
    situation: 'After a medical appointment or trigger',
    whatToSay: [
      '"That was really hard. I\'m proud of you."',
      '"What do you need right now?"',
      '"We can talk about it or not - your choice."',
      '"I believe everything you experienced."',
    ],
    whatNotToSay: [
      '"At least it\'s over"',
      '"That doctor was just trying to help"',
      '"You should be grateful"',
      '"It wasn\'t that bad"',
    ],
    physicalOptions: [
      'Comfort food available',
      'Cozy rest space prepared',
      'No immediate obligations',
      'Gentle physical affection if wanted',
      'Time and space to decompress',
    ],
  },
];

const SAFE_PLAYLISTS = [
  { id: 'calming', name: 'Calming & Grounding', description: 'Soft ambient, lo-fi, nature sounds', icon: <Waves className="w-5 h-5" />, url: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u', color: 'from-teal-500/20 to-cyan-500/20' },
  { id: 'grounding', name: 'Grounding Bass', description: 'Deep bass, slow beats, grounding rhythms', icon: <Zap className="w-5 h-5" />, url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY', color: 'from-indigo-500/20 to-violet-500/20' },
  { id: 'energizing', name: 'Gentle Energy', description: 'Uplifting but not overwhelming', icon: <Sun className="w-5 h-5" />, url: 'https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr', color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'comfort', name: 'Comfort Songs', description: 'Familiar, safe, nostalgic', icon: <Heart className="w-5 h-5" />, url: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6', color: 'from-rose-500/20 to-pink-500/20' },
  { id: 'sleep', name: 'Sleep & Rest', description: 'Drift off safely', icon: <Moon className="w-5 h-5" />, url: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp', color: 'from-purple-500/20 to-indigo-500/20' },
];

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: 'Quincy', relationship: 'Partner', priority: 1 },
  { name: "Da'Veon", relationship: 'Partner', priority: 2 },
  { name: 'Mary Jones', relationship: 'Mother', priority: 3 },
];

// ===== COMPONENT =====
const EmotionalRegulationToolkit: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [groundingExercise, setGroundingExercise] = useState<GroundingExercise | null>(null);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Grounding exercise state
  const [senseStep, setSenseStep] = useState(0);
  const [senseItems, setSenseItems] = useState<string[]>([]);
  const [bodyScanStep, setBodyScanStep] = useState(0);
  
  // Breathing state
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [phaseTime, setPhaseTime] = useState(0);
  const [breathCycles, setBreathCycles] = useState(0);
  
  // Affirmation state
  const [affirmationCategory, setAffirmationCategory] = useState<string>('all');
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<BreathPhase>('idle');

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ert-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('ert-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Haptic feedback
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!hapticEnabled || !navigator.vibrate) return;
    const patterns = { light: [30], medium: [60], heavy: [120] };
    navigator.vibrate(patterns[intensity]);
  }, [hapticEnabled]);

  // ===== BREATHING LOGIC =====
  const getPhaseDuration = useCallback((phase: BreathPhase) => {
    const durations: Record<BreathPhase, number> = {
      inhale: selectedPattern.inhale,
      hold1: selectedPattern.hold1,
      exhale: selectedPattern.exhale,
      hold2: selectedPattern.hold2,
      idle: 0,
    };
    return durations[phase];
  }, [selectedPattern]);

  const getNextPhase = useCallback((current: BreathPhase): BreathPhase => {
    const sequence: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    const index = sequence.indexOf(current);
    for (let i = 1; i <= sequence.length; i++) {
      const nextIndex = (index + i) % sequence.length;
      const nextPhase = sequence[nextIndex];
      if (getPhaseDuration(nextPhase) > 0) return nextPhase;
    }
    return 'inhale';
  }, [getPhaseDuration]);

  useEffect(() => {
    if (isBreathing) {
      timerRef.current = setInterval(() => {
        setPhaseTime((prev) => {
          const duration = getPhaseDuration(phaseRef.current) * 10;
          if (prev >= duration) {
            const nextPhase = getNextPhase(phaseRef.current);
            if (nextPhase === 'inhale' && phaseRef.current !== 'idle') {
              setBreathCycles((c) => c + 1);
              triggerHaptic('heavy');
            } else {
              triggerHaptic('light');
            }
            phaseRef.current = nextPhase;
            setBreathPhase(nextPhase);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isBreathing, getPhaseDuration, getNextPhase, triggerHaptic]);

  const startBreathing = () => {
    phaseRef.current = 'inhale';
    setBreathPhase('inhale');
    setPhaseTime(0);
    setIsBreathing(true);
    triggerHaptic('medium');
  };

  const stopBreathing = () => {
    setIsBreathing(false);
  };

  const resetBreathing = () => {
    setIsBreathing(false);
    phaseRef.current = 'idle';
    setBreathPhase('idle');
    setPhaseTime(0);
    setBreathCycles(0);
  };

  const getBreathCircleScale = () => {
    if (breathPhase === 'idle') return 0.5;
    const duration = getPhaseDuration(breathPhase) * 10;
    const progress = duration > 0 ? phaseTime / duration : 0;
    switch (breathPhase) {
      case 'inhale': return 0.5 + 0.5 * progress;
      case 'hold1': return 1.0;
      case 'exhale': return 1.0 - 0.5 * progress;
      case 'hold2': return 0.5;
      default: return 0.5;
    }
  };

  // ===== AFFIRMATION LOGIC =====
  const getFilteredAffirmations = () => {
    if (affirmationCategory === 'all') return AFFIRMATIONS;
    if (affirmationCategory === 'favorites') return AFFIRMATIONS.filter(a => favorites.includes(a.id));
    return AFFIRMATIONS.filter(a => a.category === affirmationCategory);
  };

  const getRandomAffirmation = () => {
    const filtered = getFilteredAffirmations();
    if (filtered.length === 0) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentAffirmation(random);
    triggerHaptic('light');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    triggerHaptic('light');
  };

  // ===== 5-4-3-2-1 GROUNDING =====
  const senseSteps = [
    { count: 5, sense: 'SEE', icon: <Eye className="w-8 h-8" />, prompt: 'Name 5 things you can see right now' },
    { count: 4, sense: 'TOUCH', icon: <Hand className="w-8 h-8" />, prompt: 'Name 4 things you can feel/touch' },
    { count: 3, sense: 'HEAR', icon: <Ear className="w-8 h-8" />, prompt: 'Name 3 things you can hear' },
    { count: 2, sense: 'SMELL', icon: <Leaf className="w-8 h-8" />, prompt: 'Name 2 things you can smell' },
    { count: 1, sense: 'TASTE', icon: <Coffee className="w-8 h-8" />, prompt: 'Name 1 thing you can taste' },
  ];

  const bodyScanSteps = [
    { area: 'Feet & Toes', instruction: 'Notice your feet on the ground. Wiggle your toes gently. Feel the weight of your body supported.' },
    { area: 'Legs & Knees', instruction: 'Soften your legs. Notice any tension in your calves or thighs. Let it release.' },
    { area: 'Hips & Lower Back', instruction: 'Feel your hips settling. Notice your lower back. Breathe into any tightness.' },
    { area: 'Belly & Chest', instruction: 'Place a hand on your belly if comfortable. Feel it rise and fall naturally.' },
    { area: 'Shoulders & Arms', instruction: 'Drop your shoulders away from your ears. Let your arms rest heavy.' },
    { area: 'Neck & Throat', instruction: 'Gently roll your neck if it helps. Soften your jaw.' },
    { area: 'Face & Head', instruction: 'Relax your forehead. Unclench your jaw. Soften your eyes.' },
    { area: 'Whole Body', instruction: 'Feel your entire body as one. You are here. You are present. You are safe.' },
  ];

  // ===== RENDER HELPERS =====
  const renderHome = () => (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-sage-100 mb-2">How can I support you?</h2>
        <p className="text-sage-400 text-sm">Choose what feels right for this moment</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { mode: 'grounding' as ViewMode, icon: <Brain className="w-6 h-6" />, label: 'Grounding', sublabel: 'Get present' },
          { mode: 'breathing' as ViewMode, icon: <Wind className="w-6 h-6" />, label: 'Breathing', sublabel: 'Calm your system' },
          { mode: 'coregulation' as ViewMode, icon: <Users className="w-6 h-6" />, label: 'Partner Scripts', sublabel: 'Co-regulation' },
          { mode: 'sensory' as ViewMode, icon: <Hand className="w-6 h-6" />, label: 'Sensory Kit', sublabel: 'Find comfort items' },
          { mode: 'playlists' as ViewMode, icon: <Music className="w-6 h-6" />, label: 'Safe Sounds', sublabel: 'Playlists' },
          { mode: 'affirmations' as ViewMode, icon: <Sparkles className="w-6 h-6" />, label: 'Affirmations', sublabel: 'Gentle reminders' },
        ].map(({ mode, icon, label, sublabel }) => (
          <button
            key={mode}
            onClick={() => { setViewMode(mode); triggerHaptic('light'); }}
            className="p-5 rounded-2xl bg-sage-900/40 border border-sage-700/30 hover:bg-sage-800/50 hover:border-sage-600/40 transition-all duration-500 text-left group"
          >
            <div className="text-sage-400 group-hover:text-sage-300 transition-colors mb-2">{icon}</div>
            <div className="text-sage-200 font-medium">{label}</div>
            <div className="text-sage-500 text-xs">{sublabel}</div>
          </button>
        ))}
      </div>

      {/* Meltdown Mode Button */}
      <button
        onClick={() => { setViewMode('meltdown'); triggerHaptic('medium'); }}
        className="w-full mt-6 p-4 rounded-2xl bg-rose-950/30 border border-rose-800/30 hover:bg-rose-900/40 transition-all duration-500"
      >
        <div className="flex items-center justify-center gap-3">
          <Shield className="w-5 h-5 text-rose-400" />
          <span className="text-rose-300 font-medium">Meltdown/Shutdown Mode</span>
        </div>
        <p className="text-rose-400/60 text-xs mt-1 text-center">Ultra-simplified. Emergency only.</p>
      </button>
    </div>
  );

  const renderGrounding = () => (
    <div className="space-y-4">
      {!groundingExercise ? (
        <>
          <h2 className="text-xl font-light text-sage-100 text-center mb-6">Choose a Grounding Exercise</h2>
          <div className="space-y-3">
            {[
              { id: '54321' as GroundingExercise, icon: <Eye className="w-6 h-6" />, label: '5-4-3-2-1 Senses', desc: 'Use your senses to anchor to now' },
              { id: 'temperature' as GroundingExercise, icon: <Thermometer className="w-6 h-6" />, label: 'Temperature Grounding', desc: 'Cold water, ice, or cool surface' },
              { id: 'boxbreathing' as GroundingExercise, icon: <Wind className="w-6 h-6" />, label: 'Box Breathing', desc: '4-4-4-4 breathing square' },
              { id: 'bodyscan' as GroundingExercise, icon: <Heart className="w-6 h-6" />, label: 'Body Scan', desc: 'Gentle awareness from feet to head' },
            ].map(({ id, icon, label, desc }) => (
              <button
                key={id}
                onClick={() => { setGroundingExercise(id); triggerHaptic('light'); }}
                className="w-full p-4 rounded-xl bg-sage-900/40 border border-sage-700/30 hover:bg-sage-800/50 transition-all duration-500 text-left flex items-center gap-4"
              >
                <div className="p-3 rounded-xl bg-sage-800/50 text-sage-400">{icon}</div>
                <div>
                  <div className="text-sage-200 font-medium">{label}</div>
                  <div className="text-sage-500 text-sm">{desc}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-sage-600 ml-auto" />
              </button>
            ))}
          </div>
        </>
      ) : groundingExercise === '54321' ? (
        <div className="text-center">
          <div className="mb-8">
            <div className={`inline-flex p-6 rounded-full bg-gradient-to-br from-sage-700/30 to-sage-800/30 border border-sage-600/30 mb-4`}>
              {senseSteps[senseStep]?.icon}
            </div>
            <div className="text-5xl font-light text-sage-200 mb-2">{senseSteps[senseStep]?.count}</div>
            <div className="text-lg text-sage-400 mb-1">Things you can {senseSteps[senseStep]?.sense}</div>
            <p className="text-sage-500 text-sm">{senseSteps[senseStep]?.prompt}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-center gap-2 mb-4">
              {senseSteps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= senseStep ? 'bg-sage-400' : 'bg-sage-700'}`} />
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => { if (senseStep > 0) { setSenseStep(senseStep - 1); triggerHaptic('light'); } }}
              disabled={senseStep === 0}
              className="p-3 rounded-xl bg-sage-800/50 text-sage-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                if (senseStep < 4) {
                  setSenseStep(senseStep + 1);
                  triggerHaptic('medium');
                } else {
                  setGroundingExercise(null);
                  setSenseStep(0);
                  triggerHaptic('heavy');
                }
              }}
              className="px-8 py-3 rounded-xl bg-sage-700/50 text-sage-200 font-medium hover:bg-sage-600/50 transition-all"
            >
              {senseStep < 4 ? 'Next' : 'Complete'}
            </button>
          </div>
        </div>
      ) : groundingExercise === 'temperature' ? (
        <div className="text-center space-y-6">
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-sky-700/30 to-teal-800/30 border border-sky-600/30">
            <Thermometer className="w-10 h-10 text-sky-400" />
          </div>
          <h3 className="text-xl text-sage-200 font-light">Temperature Grounding</h3>
          
          <div className="space-y-4 text-left bg-sage-900/40 rounded-xl p-6 border border-sage-700/30">
            <p className="text-sage-300 leading-relaxed">Temperature change can quickly shift your nervous system from panic to presence.</p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-medium">1</div>
                <p className="text-sage-400 text-sm">Run cold water over your wrists for 30-60 seconds</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-medium">2</div>
                <p className="text-sage-400 text-sm">Hold ice cubes in your hands (wrap in cloth if too intense)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-medium">3</div>
                <p className="text-sage-400 text-sm">Splash cold water on your face</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-medium">4</div>
                <p className="text-sage-400 text-sm">Press a cold can or bottle to your neck or forehead</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setGroundingExercise(null); triggerHaptic('medium'); }}
            className="px-6 py-3 rounded-xl bg-sage-700/50 text-sage-200 font-medium"
          >
            Back to Exercises
          </button>
        </div>
      ) : groundingExercise === 'bodyscan' ? (
        <div className="text-center">
          <div className="mb-6">
            <div className="text-sage-400 text-sm mb-2">Step {bodyScanStep + 1} of {bodyScanSteps.length}</div>
            <h3 className="text-xl text-sage-200 font-light mb-1">{bodyScanSteps[bodyScanStep]?.area}</h3>
          </div>

          <div className="bg-sage-900/40 rounded-xl p-6 border border-sage-700/30 mb-8">
            <p className="text-sage-300 leading-relaxed text-lg">{bodyScanSteps[bodyScanStep]?.instruction}</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {bodyScanSteps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= bodyScanStep ? 'bg-sage-400' : 'bg-sage-700'}`} />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => { if (bodyScanStep > 0) { setBodyScanStep(bodyScanStep - 1); triggerHaptic('light'); } }}
              disabled={bodyScanStep === 0}
              className="p-3 rounded-xl bg-sage-800/50 text-sage-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                if (bodyScanStep < bodyScanSteps.length - 1) {
                  setBodyScanStep(bodyScanStep + 1);
                  triggerHaptic('medium');
                } else {
                  setGroundingExercise(null);
                  setBodyScanStep(0);
                  triggerHaptic('heavy');
                }
              }}
              className="px-8 py-3 rounded-xl bg-sage-700/50 text-sage-200 font-medium"
            >
              {bodyScanStep < bodyScanSteps.length - 1 ? 'Continue' : 'Complete'}
            </button>
          </div>
        </div>
      ) : groundingExercise === 'boxbreathing' ? (
        // Redirect to breathing view with box pattern
        (() => { setViewMode('breathing'); setSelectedPattern(BREATHING_PATTERNS[0]); return null; })()
      ) : null}

      {groundingExercise && (
        <button
          onClick={() => { setGroundingExercise(null); setSenseStep(0); setBodyScanStep(0); }}
          className="w-full mt-6 py-3 text-sage-500 hover:text-sage-400 transition-colors text-sm"
        >
          Choose different exercise
        </button>
      )}
    </div>
  );

  const renderBreathing = () => (
    <div className="text-center">
      {/* Pattern selector */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {BREATHING_PATTERNS.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => { setSelectedPattern(pattern); resetBreathing(); triggerHaptic('light'); }}
            disabled={isBreathing}
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
              selectedPattern.id === pattern.id
                ? 'bg-sage-700/60 text-sage-200 border border-sage-500/40'
                : 'bg-sage-900/40 text-sage-500 border border-sage-800/40 hover:bg-sage-800/50'
            } ${isBreathing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      {/* Breathing circle */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border border-sage-700/30" />
        <div
          className={`absolute inset-0 m-auto rounded-full bg-gradient-to-br ${selectedPattern.color} border border-sage-500/20 flex items-center justify-center transition-all duration-300`}
          style={{ 
            width: `${getBreathCircleScale() * 100}%`, 
            height: `${getBreathCircleScale() * 100}%`,
            boxShadow: isBreathing ? '0 0 60px rgba(134, 150, 132, 0.2)' : 'none'
          }}
        >
          <div className="text-center">
            <div className="text-3xl font-light text-sage-200">
              {breathPhase !== 'idle' ? Math.ceil(getPhaseDuration(breathPhase) - phaseTime / 10) : '--'}
            </div>
            <div className="text-sage-400 text-sm mt-1">
              {breathPhase === 'idle' ? 'Ready' :
               breathPhase === 'inhale' ? 'Breathe In' :
               breathPhase === 'exhale' ? 'Breathe Out' : 'Hold'}
            </div>
          </div>
        </div>
      </div>

      {/* Cycle counter */}
      <div className="text-sage-500 text-sm mb-6">Cycles: {breathCycles}</div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isBreathing ? (
          <button
            onClick={startBreathing}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-sage-700/50 text-sage-200 font-medium hover:bg-sage-600/50 transition-all"
          >
            <Play className="w-5 h-5" />
            {breathPhase !== 'idle' ? 'Resume' : 'Begin'}
          </button>
        ) : (
          <button
            onClick={stopBreathing}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-sage-800/50 text-sage-300 font-medium"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}
        <button
          onClick={resetBreathing}
          className="p-3 rounded-xl bg-sage-900/50 text-sage-500 hover:bg-sage-800/50"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Pattern info */}
      <div className="mt-8 p-4 bg-sage-900/30 rounded-xl border border-sage-800/30">
        <div className="flex justify-center gap-4 text-sm">
          <span className="text-sage-500">In: <span className="text-sage-300">{selectedPattern.inhale}s</span></span>
          {selectedPattern.hold1 > 0 && <span className="text-sage-500">Hold: <span className="text-sage-300">{selectedPattern.hold1}s</span></span>}
          <span className="text-sage-500">Out: <span className="text-sage-300">{selectedPattern.exhale}s</span></span>
          {selectedPattern.hold2 > 0 && <span className="text-sage-500">Hold: <span className="text-sage-300">{selectedPattern.hold2}s</span></span>}
        </div>
        <p className="text-sage-500 text-xs mt-2">{selectedPattern.description}</p>
      </div>
    </div>
  );

  const renderCoRegulation = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-sage-100 mb-2">Partner Support Scripts</h2>
        <p className="text-sage-500 text-sm">Share these with your support people</p>
      </div>

      {CO_REGULATION_SCRIPTS.map((script) => (
        <details key={script.id} className="group bg-sage-900/40 rounded-xl border border-sage-700/30 overflow-hidden">
          <summary className="p-4 cursor-pointer list-none flex items-center justify-between hover:bg-sage-800/30 transition-colors">
            <span className="text-sage-200 font-medium">{script.situation}</span>
            <ChevronRight className="w-5 h-5 text-sage-500 group-open:rotate-90 transition-transform" />
          </summary>
          <div className="p-4 pt-0 space-y-4 border-t border-sage-800/30">
            <div>
              <h4 className="text-sage-400 text-sm font-medium mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> What to Say
              </h4>
              <ul className="space-y-1">
                {script.whatToSay.map((phrase, i) => (
                  <li key={i} className="text-sage-300 text-sm pl-4 border-l-2 border-green-500/30">{phrase}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sage-400 text-sm font-medium mb-2 flex items-center gap-2">
                <X className="w-4 h-4 text-rose-500" /> What NOT to Say
              </h4>
              <ul className="space-y-1">
                {script.whatNotToSay.map((phrase, i) => (
                  <li key={i} className="text-sage-400 text-sm pl-4 border-l-2 border-rose-500/30">{phrase}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sage-400 text-sm font-medium mb-2 flex items-center gap-2">
                <Hand className="w-4 h-4 text-sky-500" /> Physical Options
              </h4>
              <ul className="space-y-1">
                {script.physicalOptions.map((option, i) => (
                  <li key={i} className="text-sage-400 text-sm pl-4 border-l-2 border-sky-500/30">{option}</li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      ))}
    </div>
  );

  const renderSensory = () => {
    const groupedItems = SENSORY_KIT.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, SensoryItem[]>);

    const categoryLabels: Record<string, string> = {
      tactile: 'Tactile / Fidgets',
      weighted: 'Weighted Items',
      scent: 'Calming Scents',
      visual: 'Visual Comfort',
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-light text-sage-100 mb-2">Sensory Kit</h2>
          <p className="text-sage-500 text-sm">Quick access to your comfort items</p>
        </div>

        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sage-400 text-sm font-medium mb-3">{categoryLabels[category]}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="p-3 bg-sage-900/40 rounded-xl border border-sage-700/30 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sage-800/50 text-sage-400">{item.icon}</div>
                  <div className="flex-1">
                    <div className="text-sage-200 text-sm font-medium">{item.name}</div>
                    <div className="text-sage-500 text-xs">{item.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPlaylists = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-light text-sage-100 mb-2">Safe Sounds</h2>
        <p className="text-sage-500 text-sm">Playlists for different needs</p>
      </div>

      {SAFE_PLAYLISTS.map((playlist) => (
        <a
          key={playlist.id}
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block p-4 rounded-xl bg-gradient-to-r ${playlist.color} border border-sage-700/30 hover:border-sage-500/40 transition-all duration-300`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sage-900/50 text-sage-300">{playlist.icon}</div>
            <div className="flex-1">
              <div className="text-sage-200 font-medium">{playlist.name}</div>
              <div className="text-sage-400 text-sm">{playlist.description}</div>
            </div>
            <ExternalLink className="w-5 h-5 text-sage-500" />
          </div>
        </a>
      ))}
    </div>
  );

  const renderAffirmations = () => (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All' },
          { id: 'self-worth', label: 'Self-Worth' },
          { id: 'pain-validation', label: 'Pain Valid.' },
          { id: 'rest-permission', label: 'Rest' },
          { id: 'safety', label: 'Safety' },
          { id: 'strength', label: 'Strength' },
          { id: 'favorites', label: 'Saved' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setAffirmationCategory(id); triggerHaptic('light'); }}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              affirmationCategory === id
                ? 'bg-sage-700/60 text-sage-200'
                : 'bg-sage-900/40 text-sage-500 hover:bg-sage-800/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Current affirmation */}
      {currentAffirmation && (
        <div className="bg-sage-900/50 rounded-2xl p-6 border border-sage-700/30 text-center">
          <blockquote className="text-xl font-light text-sage-200 italic leading-relaxed mb-4">
            "{currentAffirmation.text}"
          </blockquote>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => toggleFavorite(currentAffirmation.id)}
              className={`p-2 rounded-lg transition-colors ${
                favorites.includes(currentAffirmation.id)
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-sage-800/50 text-sage-500 hover:text-sage-400'
              }`}
            >
              {favorites.includes(currentAffirmation.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Get new affirmation */}
      <button
        onClick={getRandomAffirmation}
        className="w-full py-4 rounded-xl bg-sage-700/40 text-sage-200 font-medium hover:bg-sage-600/40 transition-all flex items-center justify-center gap-2"
      >
        <Shuffle className="w-5 h-5" />
        {currentAffirmation ? 'Another Affirmation' : 'Get Affirmation'}
      </button>

      {/* Favorites list */}
      {affirmationCategory === 'favorites' && favorites.length > 0 && (
        <div className="space-y-2">
          {AFFIRMATIONS.filter(a => favorites.includes(a.id)).map((aff) => (
            <div key={aff.id} className="p-3 bg-sage-900/30 rounded-xl border border-sage-800/30 flex items-center gap-3">
              <p className="text-sage-300 text-sm flex-1">"{aff.text}"</p>
              <button onClick={() => toggleFavorite(aff.id)} className="text-amber-400">
                <BookmarkCheck className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMeltdownMode = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
      {/* Large calming visual */}
      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-sage-600/20 to-sage-700/20 border border-sage-600/20 flex items-center justify-center mb-8 animate-pulse" style={{ animationDuration: '4s' }}>
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-sage-500/20 to-sage-600/20 border border-sage-500/20 flex items-center justify-center">
          <Heart className="w-12 h-12 text-sage-400" />
        </div>
      </div>

      {/* Minimal text */}
      <p className="text-2xl text-sage-300 font-light mb-2">You are safe.</p>
      <p className="text-sage-500 mb-12">This will pass.</p>

      {/* Emergency contacts only */}
      <div className="w-full max-w-xs space-y-3">
        <p className="text-sage-500 text-sm mb-4">Call for support:</p>
        {EMERGENCY_CONTACTS.map((contact) => (
          <button
            key={contact.name}
            className="w-full p-4 rounded-xl bg-sage-900/50 border border-sage-700/30 flex items-center gap-4 hover:bg-sage-800/50 transition-colors"
          >
            <Phone className="w-6 h-6 text-sage-400" />
            <div className="text-left">
              <div className="text-sage-200 font-medium">{contact.name}</div>
              <div className="text-sage-500 text-sm">{contact.relationship}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Exit button */}
      <button
        onClick={() => setViewMode('home')}
        className="mt-12 px-6 py-3 text-sage-500 hover:text-sage-400 transition-colors text-sm"
      >
        Exit Meltdown Mode
      </button>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-950 via-sage-900 to-sage-950 text-white">
      {/* Calming background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sage-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-lg mx-auto p-6">
        {/* Header */}
        {viewMode !== 'meltdown' && (
          <header className="mb-8">
            <div className="flex items-center justify-between">
              {viewMode !== 'home' && (
                <button
                  onClick={() => { setViewMode('home'); setGroundingExercise(null); resetBreathing(); }}
                  className="p-2 rounded-xl bg-sage-900/50 text-sage-400 hover:bg-sage-800/50 transition-colors"
                >
                  <Home className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-light text-sage-200 flex-1 text-center">
                {viewMode === 'home' && 'Emotional Regulation'}
                {viewMode === 'grounding' && 'Grounding'}
                {viewMode === 'breathing' && 'Breathing'}
                {viewMode === 'coregulation' && 'Partner Scripts'}
                {viewMode === 'sensory' && 'Sensory Kit'}
                {viewMode === 'playlists' && 'Safe Sounds'}
                {viewMode === 'affirmations' && 'Affirmations'}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setHapticEnabled(!hapticEnabled)}
                  className={`p-2 rounded-xl transition-colors ${hapticEnabled ? 'bg-sage-700/50 text-sage-300' : 'bg-sage-900/50 text-sage-600'}`}
                  title="Toggle haptic feedback"
                >
                  <Vibrate className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <main className="transition-all duration-500">
          {viewMode === 'home' && renderHome()}
          {viewMode === 'grounding' && renderGrounding()}
          {viewMode === 'breathing' && renderBreathing()}
          {viewMode === 'coregulation' && renderCoRegulation()}
          {viewMode === 'sensory' && renderSensory()}
          {viewMode === 'playlists' && renderPlaylists()}
          {viewMode === 'affirmations' && renderAffirmations()}
          {viewMode === 'meltdown' && renderMeltdownMode()}
        </main>
      </div>

      {/* Custom sage color styles */}
      <style>{`
        .bg-sage-950 { background-color: #0f1410; }
        .bg-sage-900 { background-color: #1a201c; }
        .bg-sage-900\\/30 { background-color: rgba(26, 32, 28, 0.3); }
        .bg-sage-900\\/40 { background-color: rgba(26, 32, 28, 0.4); }
        .bg-sage-900\\/50 { background-color: rgba(26, 32, 28, 0.5); }
        .bg-sage-800 { background-color: #252e28; }
        .bg-sage-800\\/30 { background-color: rgba(37, 46, 40, 0.3); }
        .bg-sage-800\\/50 { background-color: rgba(37, 46, 40, 0.5); }
        .bg-sage-700 { background-color: #3a4a40; }
        .bg-sage-700\\/30 { background-color: rgba(58, 74, 64, 0.3); }
        .bg-sage-700\\/40 { background-color: rgba(58, 74, 64, 0.4); }
        .bg-sage-700\\/50 { background-color: rgba(58, 74, 64, 0.5); }
        .bg-sage-700\\/60 { background-color: rgba(58, 74, 64, 0.6); }
        .bg-sage-600 { background-color: #4d6354; }
        .bg-sage-600\\/20 { background-color: rgba(77, 99, 84, 0.2); }
        .bg-sage-600\\/40 { background-color: rgba(77, 99, 84, 0.4); }
        .bg-sage-600\\/50 { background-color: rgba(77, 99, 84, 0.5); }
        .bg-sage-500 { background-color: #617c68; }
        .bg-sage-500\\/20 { background-color: rgba(97, 124, 104, 0.2); }
        .border-sage-800 { border-color: #252e28; }
        .border-sage-800\\/30 { border-color: rgba(37, 46, 40, 0.3); }
        .border-sage-800\\/40 { border-color: rgba(37, 46, 40, 0.4); }
        .border-sage-700 { border-color: #3a4a40; }
        .border-sage-700\\/30 { border-color: rgba(58, 74, 64, 0.3); }
        .border-sage-600 { border-color: #4d6354; }
        .border-sage-600\\/20 { border-color: rgba(77, 99, 84, 0.2); }
        .border-sage-600\\/30 { border-color: rgba(77, 99, 84, 0.3); }
        .border-sage-600\\/40 { border-color: rgba(77, 99, 84, 0.4); }
        .border-sage-500 { border-color: #617c68; }
        .border-sage-500\\/20 { border-color: rgba(97, 124, 104, 0.2); }
        .border-sage-500\\/40 { border-color: rgba(97, 124, 104, 0.4); }
        .text-sage-100 { color: #e8ebe9; }
        .text-sage-200 { color: #c8d0cb; }
        .text-sage-300 { color: #a8b5ac; }
        .text-sage-400 { color: #869684; }
        .text-sage-500 { color: #647a66; }
        .text-sage-600 { color: #4d6354; }
        .from-sage-400\\/30 { --tw-gradient-from: rgba(134, 150, 132, 0.3); }
        .to-sage-400\\/30 { --tw-gradient-to: rgba(134, 150, 132, 0.3); }
        .from-sage-500\\/20 { --tw-gradient-from: rgba(97, 124, 104, 0.2); }
        .to-sage-500\\/20 { --tw-gradient-to: rgba(97, 124, 104, 0.2); }
        .from-sage-600\\/20 { --tw-gradient-from: rgba(77, 99, 84, 0.2); }
        .to-sage-600\\/20 { --tw-gradient-to: rgba(77, 99, 84, 0.2); }
        .from-sage-700\\/30 { --tw-gradient-from: rgba(58, 74, 64, 0.3); }
        .to-sage-700\\/30 { --tw-gradient-to: rgba(58, 74, 64, 0.3); }
        .from-sage-800\\/30 { --tw-gradient-from: rgba(37, 46, 40, 0.3); }
        .to-sage-800\\/30 { --tw-gradient-to: rgba(37, 46, 40, 0.3); }
        .hover\\:bg-sage-600\\/40:hover { background-color: rgba(77, 99, 84, 0.4); }
        .hover\\:bg-sage-600\\/50:hover { background-color: rgba(77, 99, 84, 0.5); }
        .hover\\:bg-sage-700:hover { background-color: #3a4a40; }
        .hover\\:bg-sage-800:hover { background-color: #252e28; }
        .hover\\:bg-sage-800\\/30:hover { background-color: rgba(37, 46, 40, 0.3); }
        .hover\\:bg-sage-800\\/50:hover { background-color: rgba(37, 46, 40, 0.5); }
        .hover\\:border-sage-500\\/40:hover { border-color: rgba(97, 124, 104, 0.4); }
        .hover\\:border-sage-600\\/40:hover { border-color: rgba(77, 99, 84, 0.4); }
        .hover\\:text-sage-300:hover { color: #a8b5ac; }
        .hover\\:text-sage-400:hover { color: #869684; }
      `}</style>
    </div>
  );
};

export default EmotionalRegulationToolkit;
