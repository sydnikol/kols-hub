/**
 * AI AVATAR TEACHER PAGE
 * Your personalized AI teacher that looks and sounds like you
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  User, Upload, Mic, MicOff, Camera, Video, Play, Pause,
  Settings, BookOpen, GraduationCap, Brain, Heart, Sparkles,
  Volume2, VolumeX, Send, ChevronRight, X, Check, Image,
  Music, Palette, Code, Leaf, Gamepad2, DollarSign, Key, Shirt, Wand2
} from 'lucide-react';
import { useAvatarTeacher, AvatarPersonality, AvatarAppearance, TeachingSession } from '../services/ai-avatar-teacher';
import AvatarWardrobeSelector from '../components/AvatarWardrobeSelector';
import ClothingScannerModal from '../components/ClothingScannerModal';
import avatarWardrobeIntegration, { AvatarOutfit, WardrobeClothingItem } from '../services/avatar-wardrobe-integration';

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  health: <Heart className="w-5 h-5" />,
  finance: <DollarSign className="w-5 h-5" />,
  creative: <Palette className="w-5 h-5" />,
  spirituality: <Leaf className="w-5 h-5" />,
  tech: <Code className="w-5 h-5" />,
  gaming: <Gamepad2 className="w-5 h-5" />
};

const AIAvatarTeacherPage: React.FC = () => {
  const {
    profile,
    currentSession,
    isTeaching,
    isSpeaking,
    createProfile,
    startSession,
    sendMessage,
    endSession,
    getSubjects,
    cloneVoice,
    setApiKey,
    speak,
    getExpression
  } = useAvatarTeacher();

  const [showSetup, setShowSetup] = useState(!profile);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedVoiceSamples, setSelectedVoiceSamples] = useState<File[]>([]);
  const [avatarName, setAvatarName] = useState('Sydney');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [avatarEmotion, setAvatarEmotion] = useState('neutral');

  // Wardrobe state
  const [showWardrobeSelector, setShowWardrobeSelector] = useState(false);
  const [showClothingScanner, setShowClothingScanner] = useState(false);
  const [currentAvatarOutfit, setCurrentAvatarOutfit] = useState<AvatarOutfit | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const [personality, setPersonality] = useState<Partial<AvatarPersonality>>({
    traits: ['nurturing', 'patient', 'wise'],
    speakingStyle: 'friendly',
    teachingStyle: 'encouraging',
    emotionalTone: 'warm',
    interests: ['spirituality', 'health', 'creativity'],
    catchphrases: ["Let's explore this together", "You're doing amazing"]
  });

  const [appearance, setAppearance] = useState<Partial<AvatarAppearance>>({
    skinTone: '#8B4513',
    hairColor: '#1a1a2e',
    hairStyle: 'natural curls',
    eyeColor: '#4a3728',
    bodyType: 'curvy',
    height: 'average',
    clothing: {
      style: 'gothic',
      topColor: '#2d1b4e',
      bottomColor: '#1a1a2e',
      shoes: 'black boots'
    },
    accessories: ['silver jewelry', 'crystals', 'moon pendant']
  });

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // Load saved avatar outfit
  useEffect(() => {
    const loadAvatarOutfit = async () => {
      const state = await avatarWardrobeIntegration.getAvatarState();
      if (state.currentOutfit) {
        setCurrentAvatarOutfit(state.currentOutfit);
      }
    };
    loadAvatarOutfit();
  }, []);

  // Handle outfit selection
  const handleOutfitSelected = (outfit: AvatarOutfit) => {
    setCurrentAvatarOutfit(outfit);
  };

  // Handle items added from scanner
  const handleItemsAddedFromScanner = async (items: WardrobeClothingItem[]) => {
    await avatarWardrobeIntegration.syncWardrobeItems(items);
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedPhotos(Array.from(e.target.files));
    }
  };

  // Handle voice sample upload
  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedVoiceSamples(Array.from(e.target.files));
    }
  };

  // Complete setup
  const completeSetup = async () => {
    if (selectedPhotos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    await createProfile(avatarName, selectedPhotos, personality, appearance);

    // Clone voice if samples provided
    if (selectedVoiceSamples.length > 0 && elevenLabsKey) {
      setApiKey(elevenLabsKey);
      await cloneVoice(avatarName, selectedVoiceSamples);
    }

    setShowSetup(false);
  };

  // Start teaching session
  const handleStartSession = async () => {
    if (!selectedSubject || !selectedTopic) return;

    await startSession(selectedTopic, selectedSubject, 'beginner');
    setAvatarEmotion('welcoming');
  };

  // Send message
  const handleSendMessage = async () => {
    if (!input.trim() || !currentSession) return;

    const message = input;
    setInput('');
    setAvatarEmotion('listening');

    const response = await sendMessage(message);

    if (response) {
      // Update avatar emotion based on response
      const emotion = detectResponseEmotion(response);
      setAvatarEmotion(emotion);
    }
  };

  const detectResponseEmotion = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('amazing') || lower.includes('great')) return 'excited';
    if (lower.includes('think about') || lower.includes('consider')) return 'thoughtful';
    if (lower.includes('proud') || lower.includes('well done')) return 'proud';
    if (lower.includes('try') || lower.includes('keep going')) return 'encouraging';
    return 'neutral';
  };

  // Toggle voice input
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const subjects = getSubjects();

  // Setup wizard
  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Your AI Avatar Teacher</h1>
            <p className="text-gray-400">Upload photos and voice samples to create an avatar that looks and sounds like you</p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  setupStep >= step ? 'bg-purple-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
            {/* Step 1: Photos */}
            {setupStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="w-6 h-6 text-purple-400" />
                  Upload Your Photos
                </h2>
                <p className="text-gray-400">Upload 3-5 clear photos of yourself for best results</p>

                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Image className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Click to upload photos</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                  </label>
                </div>

                {selectedPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPhotos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setSelectedPhotos(p => p.filter((_, i) => i !== idx))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setSetupStep(2)}
                  disabled={selectedPhotos.length === 0}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Voice */}
            {setupStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Mic className="w-6 h-6 text-purple-400" />
                  Upload Voice Samples (Optional)
                </h2>
                <p className="text-gray-400">Upload audio recordings of your voice to clone your voice</p>

                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleVoiceUpload}
                    className="hidden"
                    id="voice-upload"
                  />
                  <label htmlFor="voice-upload" className="cursor-pointer">
                    <Music className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Click to upload voice samples</p>
                    <p className="text-sm text-gray-500">MP3, WAV - at least 30 seconds of clear speech</p>
                  </label>
                </div>

                {selectedVoiceSamples.length > 0 && (
                  <div className="space-y-2">
                    {selectedVoiceSamples.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
                        <Music className="w-5 h-5 text-purple-400" />
                        <span className="flex-1 truncate">{file.name}</span>
                        <button
                          onClick={() => setSelectedVoiceSamples(v => v.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedVoiceSamples.length > 0 && (
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <label className="block text-sm font-medium mb-2">
                      <Key className="w-4 h-4 inline mr-2" />
                      ElevenLabs API Key (for voice cloning)
                    </label>
                    <input
                      type="password"
                      value={elevenLabsKey}
                      onChange={(e) => setElevenLabsKey(e.target.value)}
                      placeholder="Enter your ElevenLabs API key"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setSetupStep(1)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setSetupStep(3)}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Personality */}
            {setupStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  Customize Personality
                </h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Avatar Name</label>
                  <input
                    type="text"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Speaking Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['formal', 'casual', 'friendly', 'professional', 'nurturing'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setPersonality(p => ({ ...p, speakingStyle: style as any }))}
                        className={`py-2 rounded-lg capitalize transition-colors ${
                          personality.speakingStyle === style
                            ? 'bg-purple-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teaching Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['socratic', 'direct', 'encouraging', 'challenging', 'patient'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setPersonality(p => ({ ...p, teachingStyle: style as any }))}
                        className={`py-2 rounded-lg capitalize transition-colors ${
                          personality.teachingStyle === style
                            ? 'bg-purple-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Emotional Tone</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['warm', 'neutral', 'energetic', 'calm', 'playful'].map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setPersonality(p => ({ ...p, emotionalTone: tone as any }))}
                        className={`py-2 rounded-lg capitalize transition-colors ${
                          personality.emotionalTone === tone
                            ? 'bg-purple-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSetupStep(2)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setSetupStep(4)}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Appearance */}
            {setupStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Palette className="w-6 h-6 text-purple-400" />
                  Customize Appearance
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Skin Tone</label>
                    <input
                      type="color"
                      value={appearance.skinTone}
                      onChange={(e) => setAppearance(a => ({ ...a, skinTone: e.target.value }))}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hair Color</label>
                    <input
                      type="color"
                      value={appearance.hairColor}
                      onChange={(e) => setAppearance(a => ({ ...a, hairColor: e.target.value }))}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hair Style</label>
                  <input
                    type="text"
                    value={appearance.hairStyle}
                    onChange={(e) => setAppearance(a => ({ ...a, hairStyle: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Clothing Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['gothic', 'casual', 'professional', 'artistic', 'cozy', 'elegant'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setAppearance(a => ({
                          ...a,
                          clothing: { ...a.clothing!, style: style as any }
                        }))}
                        className={`py-2 rounded-lg capitalize transition-colors ${
                          appearance.clothing?.style === style
                            ? 'bg-purple-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSetupStep(3)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={completeSetup}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Create Avatar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Subject selection
  if (!currentSession && !selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          {/* Avatar preview */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {profile?.photos[0] ? (
                <img
                  src={profile.photos[0]}
                  alt="Your Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg shadow-purple-500/30"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="w-16 h-16" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mt-4">{profile?.name || 'Teacher'}</h1>
            <p className="text-gray-400">Your AI Avatar Teacher</p>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-center">What would you like to learn today?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className="p-6 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {SUBJECT_ICONS[subject.id]}
                  </div>
                  <h3 className="font-semibold text-lg">{subject.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{subject.topics.length} topics available</p>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setShowWardrobeSelector(true)}
              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Shirt className="w-5 h-5" />
              Dress Avatar
            </button>
            <button
              onClick={() => setShowClothingScanner(true)}
              className="px-4 py-2 bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/30 rounded-lg text-pink-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Scan Clothes
            </button>
            <button
              onClick={() => setShowSetup(true)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>

          {/* Current outfit display */}
          {currentAvatarOutfit && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl max-w-md mx-auto">
              <h3 className="text-sm text-gray-400 mb-2">Current Outfit:</h3>
              <div className="flex gap-2 justify-center">
                {[currentAvatarOutfit.top || currentAvatarOutfit.dress, currentAvatarOutfit.bottom, currentAvatarOutfit.shoes]
                  .filter(Boolean)
                  .map((item, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-purple-500/30">
                      <img src={item!.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                {currentAvatarOutfit.accessories?.slice(0, 2).map((acc, idx) => (
                  <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-pink-500/30">
                    <img src={acc.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">{currentAvatarOutfit.name}</p>
            </div>
          )}
        </div>

        {/* Wardrobe Selector Modal */}
        <AvatarWardrobeSelector
          isOpen={showWardrobeSelector}
          onClose={() => setShowWardrobeSelector(false)}
          onOutfitSelected={handleOutfitSelected}
          currentOutfit={currentAvatarOutfit}
        />

        {/* Clothing Scanner Modal */}
        <ClothingScannerModal
          isOpen={showClothingScanner}
          onClose={() => setShowClothingScanner(false)}
          onItemsAdded={handleItemsAddedFromScanner}
        />
      </div>
    );
  }

  // Topic selection
  if (!currentSession && selectedSubject) {
    const subject = subjects.find(s => s.id === selectedSubject);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to subjects
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400">
              {SUBJECT_ICONS[selectedSubject]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{subject?.name}</h1>
              <p className="text-gray-400">Choose a topic to start learning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subject?.topics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  handleStartSession();
                }}
                disabled={isTeaching}
                className="p-4 bg-gray-800/50 hover:bg-purple-600/20 border border-gray-700 hover:border-purple-500/50 rounded-lg text-left transition-all flex items-center gap-3"
              >
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>{topic}</span>
                <ChevronRight className="w-5 h-5 ml-auto text-gray-500" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Teaching session
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-4">
        <button
          onClick={() => {
            if (currentSession) endSession(currentSession.id);
            setSelectedSubject(null);
            setSelectedTopic(null);
          }}
          className="p-2 hover:bg-gray-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <h1 className="font-semibold">{currentSession?.topic}</h1>
          <p className="text-sm text-gray-500">{currentSession?.subject}</p>
        </div>

        {/* Progress */}
        <div className="text-right">
          <span className="text-sm text-gray-400">{currentSession?.progress}% complete</span>
          <div className="w-24 h-2 bg-gray-800 rounded-full mt-1">
            <div
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${currentSession?.progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 hover:bg-gray-800 rounded-lg"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Avatar and messages */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Avatar display */}
        <div className="w-full md:w-1/3 p-4 flex items-center justify-center bg-gradient-to-b from-purple-900/20 to-transparent">
          <div className="text-center">
            <div className="relative">
              {profile?.photos[0] ? (
                <img
                  src={profile.photos[0]}
                  alt="Teacher Avatar"
                  className={`w-48 h-48 rounded-full object-cover border-4 transition-all duration-300 ${
                    isSpeaking
                      ? 'border-purple-400 shadow-lg shadow-purple-500/50 scale-105'
                      : 'border-purple-600'
                  }`}
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="w-24 h-24" />
                </div>
              )}

              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-4 bg-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold mt-4">{profile?.name}</h3>
            <p className="text-sm text-gray-400 capitalize">{avatarEmotion}</p>

            {/* Current outfit display during teaching */}
            {currentAvatarOutfit && (
              <div className="mt-3 flex gap-1 justify-center">
                {[currentAvatarOutfit.top || currentAvatarOutfit.dress, currentAvatarOutfit.bottom, currentAvatarOutfit.shoes]
                  .filter(Boolean)
                  .map((item, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-lg overflow-hidden border border-purple-500/30">
                      <img src={item!.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
              </div>
            )}

            {/* Dress avatar button */}
            <button
              onClick={() => setShowWardrobeSelector(true)}
              className="mt-3 px-3 py-1 text-xs bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white transition-colors"
            >
              <Shirt className="w-3 h-3 inline mr-1" />
              Change Outfit
            </button>

            {/* Emotion particles */}
            {avatarEmotion === 'excited' && (
              <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-0 animate-bounce" />
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentSession?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'student' ? 'justify-end' : ''}`}
              >
                {message.role === 'teacher' && (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {profile?.photos[0] ? (
                      <img src={profile.photos[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-purple-600 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`max-w-lg rounded-2xl px-4 py-3 ${
                    message.role === 'student'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.emotion && (
                    <span className="text-xs opacity-50 mt-1 block capitalize">
                      {message.emotion}
                    </span>
                  )}
                </div>

                {message.role === 'student' && (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {isTeaching && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response or use voice..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500"
              />

              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTeaching}
                className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wardrobe Selector Modal for Teaching Session */}
      <AvatarWardrobeSelector
        isOpen={showWardrobeSelector}
        onClose={() => setShowWardrobeSelector(false)}
        onOutfitSelected={handleOutfitSelected}
        currentOutfit={currentAvatarOutfit}
      />
    </div>
  );
};

export default AIAvatarTeacherPage;
