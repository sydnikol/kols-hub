/**
 * AI AVATAR TEACHER SERVICE
 * Creates a personalized AI avatar that looks and sounds like you
 *
 * Features:
 * - Photo-based avatar generation
 * - Voice cloning with ElevenLabs
 * - Claude AI brain for intelligence
 * - Teaching/tutoring capabilities
 * - Personality customization
 */

import { claudeChat } from './claude-chat-service';
import { db } from '../utils/database';

// ============================================
// TYPES
// ============================================

export interface AvatarProfile {
  id: string;
  name: string;
  photos: string[]; // Base64 or URLs
  voiceId?: string; // ElevenLabs voice ID
  voiceSamples?: string[]; // Audio URLs for voice cloning
  personality: AvatarPersonality;
  appearance: AvatarAppearance;
  createdAt: Date;
  updatedAt: Date;
}

export interface AvatarPersonality {
  traits: string[];
  speakingStyle: 'formal' | 'casual' | 'friendly' | 'professional' | 'nurturing';
  teachingStyle: 'socratic' | 'direct' | 'encouraging' | 'challenging' | 'patient';
  interests: string[];
  catchphrases?: string[];
  emotionalTone: 'warm' | 'neutral' | 'energetic' | 'calm' | 'playful';
}

export interface AvatarAppearance {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  bodyType: 'slim' | 'average' | 'athletic' | 'curvy' | 'plus';
  height: 'short' | 'average' | 'tall';
  clothing: ClothingPreset;
  accessories: string[];
}

export interface ClothingPreset {
  style: 'gothic' | 'casual' | 'professional' | 'artistic' | 'cozy' | 'elegant';
  topColor: string;
  bottomColor: string;
  shoes: string;
  extras?: string[];
}

export interface TeachingSession {
  id: string;
  topic: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  messages: TeachingMessage[];
  progress: number;
  startedAt: Date;
  lastActive: Date;
}

export interface TeachingMessage {
  id: string;
  role: 'teacher' | 'student';
  content: string;
  audioUrl?: string;
  timestamp: Date;
  emotion?: string;
}

export interface VoiceSettings {
  provider: 'elevenlabs' | 'browser' | 'coqui';
  voiceId?: string;
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
}

// ============================================
// AVATAR TEACHER SERVICE
// ============================================

class AIAvatarTeacherService {
  private currentProfile: AvatarProfile | null = null;
  private voiceSettings: VoiceSettings | null = null;
  private elevenLabsApiKey: string | null = null;
  private sessions: Map<string, TeachingSession> = new Map();

  // ============================================
  // INITIALIZATION
  // ============================================

  async initialize() {
    // Load from localStorage
    this.elevenLabsApiKey = localStorage.getItem('elevenlabs_api_key');

    const savedProfile = localStorage.getItem('avatar_profile');
    if (savedProfile) {
      this.currentProfile = JSON.parse(savedProfile);
    }

    const savedVoice = localStorage.getItem('avatar_voice_settings');
    if (savedVoice) {
      this.voiceSettings = JSON.parse(savedVoice);
    }

    console.log('AI Avatar Teacher initialized');
    return true;
  }

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  async createProfile(
    name: string,
    photos: File[],
    personality: Partial<AvatarPersonality>,
    appearance: Partial<AvatarAppearance>
  ): Promise<AvatarProfile> {
    // Convert photos to base64
    const photoBase64 = await Promise.all(
      photos.map(photo => this.fileToBase64(photo))
    );

    const profile: AvatarProfile = {
      id: `avatar-${Date.now()}`,
      name,
      photos: photoBase64,
      personality: {
        traits: personality.traits || ['kind', 'patient', 'knowledgeable'],
        speakingStyle: personality.speakingStyle || 'friendly',
        teachingStyle: personality.teachingStyle || 'encouraging',
        interests: personality.interests || [],
        catchphrases: personality.catchphrases || [],
        emotionalTone: personality.emotionalTone || 'warm'
      },
      appearance: {
        skinTone: appearance.skinTone || '#8B4513',
        hairColor: appearance.hairColor || '#1a1a2e',
        hairStyle: appearance.hairStyle || 'natural curls',
        eyeColor: appearance.eyeColor || '#4a3728',
        bodyType: appearance.bodyType || 'curvy',
        height: appearance.height || 'average',
        clothing: appearance.clothing || {
          style: 'gothic',
          topColor: '#2d1b4e',
          bottomColor: '#1a1a2e',
          shoes: 'black boots'
        },
        accessories: appearance.accessories || ['silver jewelry', 'crystals']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.currentProfile = profile;
    localStorage.setItem('avatar_profile', JSON.stringify(profile));

    return profile;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getProfile(): AvatarProfile | null {
    return this.currentProfile;
  }

  updateProfile(updates: Partial<AvatarProfile>): AvatarProfile | null {
    if (!this.currentProfile) return null;

    this.currentProfile = {
      ...this.currentProfile,
      ...updates,
      updatedAt: new Date()
    };

    localStorage.setItem('avatar_profile', JSON.stringify(this.currentProfile));
    return this.currentProfile;
  }

  // ============================================
  // VOICE CLONING (ElevenLabs)
  // ============================================

  setElevenLabsApiKey(apiKey: string) {
    this.elevenLabsApiKey = apiKey;
    localStorage.setItem('elevenlabs_api_key', apiKey);
  }

  async cloneVoice(name: string, audioFiles: File[]): Promise<string | null> {
    if (!this.elevenLabsApiKey) {
      console.error('ElevenLabs API key not set');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', `Voice clone for ${name} - KOL Hub Avatar`);

      audioFiles.forEach((file, index) => {
        formData.append('files', file, `sample_${index}.mp3`);
      });

      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
          'xi-api-key': this.elevenLabsApiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Voice cloning failed');
      }

      const data = await response.json();
      const voiceId = data.voice_id;

      // Save to profile
      if (this.currentProfile) {
        this.currentProfile.voiceId = voiceId;
        localStorage.setItem('avatar_profile', JSON.stringify(this.currentProfile));
      }

      this.voiceSettings = {
        provider: 'elevenlabs',
        voiceId,
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.5,
        speakerBoost: true
      };
      localStorage.setItem('avatar_voice_settings', JSON.stringify(this.voiceSettings));

      return voiceId;
    } catch (error) {
      console.error('Voice cloning error:', error);
      return null;
    }
  }

  async speak(text: string): Promise<string | null> {
    // Try ElevenLabs first
    if (this.elevenLabsApiKey && this.voiceSettings?.voiceId) {
      return this.speakWithElevenLabs(text);
    }

    // Fallback to browser TTS
    return this.speakWithBrowserTTS(text);
  }

  private async speakWithElevenLabs(text: string): Promise<string | null> {
    if (!this.elevenLabsApiKey || !this.voiceSettings?.voiceId) return null;

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceSettings.voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.elevenLabsApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: this.voiceSettings.stability,
              similarity_boost: this.voiceSettings.similarityBoost,
              style: this.voiceSettings.style,
              use_speaker_boost: this.voiceSettings.speakerBoost
            }
          })
        }
      );

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      const audio = new Audio(audioUrl);
      audio.play();

      return audioUrl;
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      return this.speakWithBrowserTTS(text);
    }
  }

  private speakWithBrowserTTS(text: string): Promise<string | null> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Try to find a good voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(v =>
        v.name.includes('Female') ||
        v.name.includes('Samantha') ||
        v.name.includes('Karen')
      ) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onend = () => resolve(null);
      utterance.onerror = () => resolve(null);

      speechSynthesis.speak(utterance);
    });
  }

  // ============================================
  // TEACHING FUNCTIONALITY
  // ============================================

  async startTeachingSession(
    topic: string,
    subject: string,
    difficulty: TeachingSession['difficulty'] = 'beginner'
  ): Promise<TeachingSession> {
    const session: TeachingSession = {
      id: `session-${Date.now()}`,
      topic,
      subject,
      difficulty,
      messages: [],
      progress: 0,
      startedAt: new Date(),
      lastActive: new Date()
    };

    this.sessions.set(session.id, session);

    // Generate opening message
    const openingPrompt = this.getOpeningPrompt(topic, subject, difficulty);
    const response = await this.generateTeacherResponse(session.id, openingPrompt, true);

    if (response) {
      session.messages.push({
        id: `msg-${Date.now()}`,
        role: 'teacher',
        content: response,
        timestamp: new Date(),
        emotion: 'welcoming'
      });

      // Speak the opening
      await this.speak(response);
    }

    return session;
  }

  private getOpeningPrompt(topic: string, subject: string, difficulty: string): string {
    const personality = this.currentProfile?.personality;
    const style = personality?.teachingStyle || 'encouraging';
    const tone = personality?.emotionalTone || 'warm';

    return `You are teaching about "${topic}" in the subject of "${subject}" at a ${difficulty} level.

Your teaching style is ${style} and your emotional tone is ${tone}.
${personality?.catchphrases ? `You sometimes say: "${personality.catchphrases.join('", "')}"` : ''}

Start the lesson with an engaging introduction. Be ${tone} and ${style}.
Make the student feel comfortable and excited to learn.
Keep your response conversational and under 3 paragraphs.`;
  }

  async sendStudentMessage(sessionId: string, message: string): Promise<string | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Add student message
    session.messages.push({
      id: `msg-${Date.now()}`,
      role: 'student',
      content: message,
      timestamp: new Date()
    });

    session.lastActive = new Date();

    // Generate teacher response
    const response = await this.generateTeacherResponse(sessionId, message, false);

    if (response) {
      session.messages.push({
        id: `msg-${Date.now()}-resp`,
        role: 'teacher',
        content: response,
        timestamp: new Date(),
        emotion: this.detectEmotion(response)
      });

      // Update progress
      session.progress = Math.min(100, session.progress + 5);

      // Speak the response
      await this.speak(response);
    }

    return response;
  }

  private async generateTeacherResponse(
    sessionId: string,
    input: string,
    isOpening: boolean
  ): Promise<string | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const personality = this.currentProfile?.personality;

    // Build context from conversation history
    const history = session.messages
      .slice(-10)
      .map(m => `${m.role === 'teacher' ? 'Teacher' : 'Student'}: ${m.content}`)
      .join('\n');

    const systemPrompt = `You are an AI teacher avatar named ${this.currentProfile?.name || 'Teacher'}.

Teaching Session:
- Topic: ${session.topic}
- Subject: ${session.subject}
- Difficulty: ${session.difficulty}
- Progress: ${session.progress}%

Your Personality:
- Traits: ${personality?.traits?.join(', ') || 'patient, knowledgeable'}
- Speaking Style: ${personality?.speakingStyle || 'friendly'}
- Teaching Style: ${personality?.teachingStyle || 'encouraging'}
- Emotional Tone: ${personality?.emotionalTone || 'warm'}

${isOpening ? 'Start a new lesson with an engaging introduction.' : 'Continue teaching based on the student\'s response.'}

Conversation so far:
${history}

Guidelines:
- Be ${personality?.emotionalTone || 'warm'} and ${personality?.teachingStyle || 'encouraging'}
- Keep responses conversational (2-3 paragraphs max)
- Ask follow-up questions to engage the student
- Praise progress and effort
- Break complex topics into simple parts
- Use examples and analogies`;

    try {
      const response = await claudeChat.quickChat(
        isOpening ? input : `Student says: "${input}"\n\nRespond as the teacher:`,
        'technical'
      );

      return response;
    } catch (error) {
      console.error('Teacher response generation error:', error);
      return "I'm having a moment - let me gather my thoughts. Could you repeat that?";
    }
  }

  private detectEmotion(text: string): string {
    const emotions = {
      excited: ['amazing', 'wonderful', 'excellent', 'fantastic', 'great job'],
      encouraging: ['you can', 'try', 'almost', 'good', 'keep going'],
      curious: ['interesting', 'tell me more', 'what do you think', 'how about'],
      thoughtful: ['consider', 'think about', 'reflect', 'imagine'],
      proud: ['proud', 'impressed', 'well done', 'perfect', 'exactly']
    };

    const lower = text.toLowerCase();

    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(k => lower.includes(k))) {
        return emotion;
      }
    }

    return 'neutral';
  }

  // ============================================
  // SUBJECT HELPERS
  // ============================================

  getAvailableSubjects(): Array<{ id: string; name: string; topics: string[] }> {
    return [
      {
        id: 'health',
        name: 'Health & Wellness',
        topics: [
          'Understanding POTS',
          'Managing Chronic Pain',
          'Spoon Theory & Energy Management',
          'Mental Health Basics',
          'Medication Management',
          'Nutrition for Chronic Illness',
          'Sleep Hygiene',
          'Stress Management'
        ]
      },
      {
        id: 'finance',
        name: 'Personal Finance',
        topics: [
          'Budgeting Basics',
          'Passive Income Streams',
          'Investing 101',
          'Debt Management',
          'Tax Planning',
          'Disability Benefits',
          'Side Hustles',
          'Emergency Funds'
        ]
      },
      {
        id: 'creative',
        name: 'Creative Arts',
        topics: [
          'Digital Art Basics',
          'Writing & Storytelling',
          'Music Production',
          'Photography Fundamentals',
          'Sewing & Crafts',
          'Worldbuilding for Fiction',
          'Character Design',
          'Creative Journaling'
        ]
      },
      {
        id: 'spirituality',
        name: 'Spirituality & Heritage',
        topics: [
          'Hoodoo Basics',
          'Ancestral Connection',
          'Herbal Knowledge',
          'Meditation Practices',
          'Moon Cycles',
          'Tarot & Divination',
          'Ritual Creation',
          'Energy Work'
        ]
      },
      {
        id: 'tech',
        name: 'Technology',
        topics: [
          'Web Development',
          'AI & Machine Learning',
          'Automation Basics',
          'Digital Privacy',
          'Smart Home Setup',
          'Content Creation Tools',
          'App Development',
          'Cybersecurity Basics'
        ]
      },
      {
        id: 'gaming',
        name: 'Gaming & D&D',
        topics: [
          'D&D Campaign Creation',
          'Character Building',
          'Dungeon Mastering',
          'Worldbuilding',
          'Board Game Strategy',
          'Video Game Design',
          'Narrative Design',
          'Game Theory'
        ]
      }
    ];
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

  getSession(sessionId: string): TeachingSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): TeachingSession[] {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
  }

  endSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  // ============================================
  // AVATAR EXPRESSION MAPPING
  // ============================================

  getAvatarExpression(emotion: string): {
    expression: string;
    animation: string;
    particles?: string;
  } {
    const expressionMap: Record<string, { expression: string; animation: string; particles?: string }> = {
      welcoming: { expression: 'happy', animation: 'wave', particles: 'sparkles' },
      excited: { expression: 'excited', animation: 'bounce', particles: 'confetti' },
      encouraging: { expression: 'smile', animation: 'nod', particles: 'hearts' },
      curious: { expression: 'curious', animation: 'headTilt' },
      thoughtful: { expression: 'thinking', animation: 'stroke_chin' },
      proud: { expression: 'beaming', animation: 'clap', particles: 'stars' },
      neutral: { expression: 'neutral', animation: 'idle' },
      listening: { expression: 'attentive', animation: 'lean_forward' },
      explaining: { expression: 'focused', animation: 'gesture' }
    };

    return expressionMap[emotion] || expressionMap.neutral;
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const avatarTeacher = new AIAvatarTeacherService();

// React hook
export function useAvatarTeacher() {
  const [profile, setProfile] = React.useState<AvatarProfile | null>(null);
  const [currentSession, setCurrentSession] = React.useState<TeachingSession | null>(null);
  const [isTeaching, setIsTeaching] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  React.useEffect(() => {
    avatarTeacher.initialize().then(() => {
      setProfile(avatarTeacher.getProfile());
    });
  }, []);

  const createProfile = async (
    name: string,
    photos: File[],
    personality: Partial<AvatarPersonality>,
    appearance: Partial<AvatarAppearance>
  ) => {
    const newProfile = await avatarTeacher.createProfile(name, photos, personality, appearance);
    setProfile(newProfile);
    return newProfile;
  };

  const startSession = async (topic: string, subject: string, difficulty: TeachingSession['difficulty']) => {
    setIsTeaching(true);
    const session = await avatarTeacher.startTeachingSession(topic, subject, difficulty);
    setCurrentSession(session);
    setIsTeaching(false);
    return session;
  };

  const sendMessage = async (message: string) => {
    if (!currentSession) return null;
    setIsSpeaking(true);
    const response = await avatarTeacher.sendStudentMessage(currentSession.id, message);
    setCurrentSession(avatarTeacher.getSession(currentSession.id) || null);
    setIsSpeaking(false);
    return response;
  };

  return {
    profile,
    currentSession,
    isTeaching,
    isSpeaking,
    createProfile,
    startSession,
    sendMessage,
    endSession: (id: string) => {
      avatarTeacher.endSession(id);
      if (currentSession?.id === id) setCurrentSession(null);
    },
    getSubjects: () => avatarTeacher.getAvailableSubjects(),
    cloneVoice: avatarTeacher.cloneVoice.bind(avatarTeacher),
    setApiKey: avatarTeacher.setElevenLabsApiKey.bind(avatarTeacher),
    speak: async (text: string) => {
      setIsSpeaking(true);
      await avatarTeacher.speak(text);
      setIsSpeaking(false);
    },
    getExpression: avatarTeacher.getAvatarExpression.bind(avatarTeacher)
  };
}

import React from 'react';
