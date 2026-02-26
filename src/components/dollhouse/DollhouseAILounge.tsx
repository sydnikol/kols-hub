import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  text: string;
  category: string;
}

interface Mood {
  id: string;
  timestamp: number;
  mood: number;
  notes: string;
}

const THEME = {
  primary: '#FF1493',
  secondary: '#9B30FF',
  background: '#0a0010',
  surface: 'rgba(255,20,147,0.08)',
  accent: '#E0A0FF',
  mint: '#00FFB3',
  text: '#F5E6FF',
  glass: 'rgba(155,48,255,0.15)',
};

const AFFIRMATIONS = [
  'You are stronger than you believe.',
  'Your pain does not define you.',
  'Rest is productive. Rest is healing.',
  'You deserve compassion, especially from yourself.',
  'Progress is not always visible, but it is real.',
  'Your body is doing its best. That is enough.',
  'Gentle movement is still movement.',
  'You are allowed to take breaks.',
  'Chronic illness is not your fault.',
  'You matter, exactly as you are.',
];

const PROMPTS_DATA: Prompt[] = [
  // Health & Wellness
  {
    id: '1',
    title: 'Chronic Pain Management',
    description: 'Guide for managing chronic pain mindfully',
    category: 'Health & Wellness',
    text: 'I have chronic pain. Help me create a personalized pain management strategy that includes gentle movement, relaxation techniques, and mental health approaches.',
  },
  {
    id: '2',
    title: 'Energy Management (POTS)',
    description: 'Strategies for managing energy with POTS',
    category: 'Health & Wellness',
    text: 'I have POTS (Postural Orthostatic Tachycardia Syndrome). Help me understand how to manage my energy and create a realistic daily routine.',
  },
  {
    id: '3',
    title: 'Sleep Optimization',
    description: 'Improve sleep quality naturally',
    category: 'Health & Wellness',
    text: 'I struggle with sleep due to chronic illness. Create a evidence-based sleep hygiene plan that accounts for my condition.',
  },
  {
    id: '4',
    title: 'Nutrition for Chronic Illness',
    description: 'Eat well while managing symptoms',
    category: 'Health & Wellness',
    text: 'Help me design a simple, nutritious meal plan that works around my energy limitations and dietary sensitivities.',
  },
  {
    id: '5',
    title: 'Doctor Communication',
    description: 'How to advocate for yourself',
    category: 'Health & Wellness',
    text: 'I struggle to communicate with my doctors about my symptoms. Help me prepare questions and documentation for my next appointment.',
  },
  // Productivity
  {
    id: '6',
    title: 'Spoon Theory Planning',
    description: 'Plan your day using spoon theory',
    category: 'Productivity',
    text: 'Help me plan my week using spoon theory principles. I have limited energy due to chronic illness. How can I prioritize tasks?',
  },
  {
    id: '7',
    title: 'Flexible To-Do List',
    description: 'Create adaptable task lists',
    category: 'Productivity',
    text: 'Design a flexible to-do system that allows me to adjust plans based on how I feel each day without guilt.',
  },
  {
    id: '8',
    title: 'Work From Home Setup',
    description: 'Optimize your home workspace',
    category: 'Productivity',
    text: 'I work from home with chronic illness. Help me create an ergonomic, comfortable workspace that reduces symptoms.',
  },
  {
    id: '9',
    title: 'Habit Building for Chronically Ill',
    description: 'Build sustainable habits slowly',
    category: 'Productivity',
    text: 'I want to build positive habits but struggle with consistency due to health fluctuations. What are realistic tiny habits I can start?',
  },
  {
    id: '10',
    title: 'Time Blocking Lite',
    description: 'Simple scheduling for variable energy',
    category: 'Productivity',
    text: 'Create a flexible time-blocking system that works for someone with unpredictable energy levels.',
  },
  // Creative Writing
  {
    id: '11',
    title: 'Story Starter: Second Chances',
    description: 'Begin a story about redemption',
    category: 'Creative Writing',
    text: 'Write an engaging opening paragraph for a story about a character getting a second chance at life.',
  },
  {
    id: '12',
    title: 'Character Development Guide',
    description: 'Create deep, believable characters',
    category: 'Creative Writing',
    text: 'Help me develop a character with chronic illness as a complex, three-dimensional person in my story.',
  },
  {
    id: '13',
    title: 'Poetry on Pain',
    description: 'Express emotions through poetry',
    category: 'Creative Writing',
    text: 'Help me write a poem that captures what it feels like to live with chronic pain, turning struggle into art.',
  },
  {
    id: '14',
    title: 'Worldbuilding for Disabled Characters',
    description: 'Create inclusive fantasy worlds',
    category: 'Creative Writing',
    text: 'I am building a fantasy world. Help me create an inclusive world where disabled and chronically ill characters are natural parts of society.',
  },
  {
    id: '15',
    title: 'Dialogue Writing Tips',
    description: 'Master natural conversation',
    category: 'Creative Writing',
    text: 'Give me tips for writing authentic dialogue that feels real and moves the story forward.',
  },
  // Learning
  {
    id: '16',
    title: 'Learn JavaScript Basics',
    description: 'Start programming fundamentals',
    category: 'Learning',
    text: 'Explain JavaScript fundamentals like variables, functions, and loops in simple terms with examples.',
  },
  {
    id: '17',
    title: 'Study Strategy for Fatigue',
    description: 'Study effectively with limited energy',
    category: 'Learning',
    text: 'I want to continue learning but struggle with fatigue. What are short, effective study techniques?',
  },
  {
    id: '18',
    title: 'Understanding POTS',
    description: 'Learn about your own condition',
    category: 'Learning',
    text: 'Explain POTS (Postural Orthostatic Tachycardia Syndrome) to me like I am seven years old, then explain it like I am a medical student.',
  },
  {
    id: '19',
    title: 'History of Disability Rights',
    description: 'Explore important movements',
    category: 'Learning',
    text: 'Give me an overview of the disability rights movement and its major milestones.',
  },
  {
    id: '20',
    title: 'Book Club Questions',
    description: 'Generate discussion questions',
    category: 'Learning',
    text: 'Create 10 thoughtful discussion questions for a book club about this novel: [add title].',
  },
  // Coding
  {
    id: '21',
    title: 'React Hooks Guide',
    description: 'Master React hooks',
    category: 'Coding',
    text: 'Explain useState, useEffect, and useContext hooks with practical examples and when to use each.',
  },
  {
    id: '22',
    title: 'Debug This Code',
    description: 'Find and fix errors',
    category: 'Coding',
    text: 'I have a bug in my code. Help me debug and explain what went wrong and how to prevent it.',
  },
  {
    id: '23',
    title: 'API Integration Help',
    description: 'Connect external services',
    category: 'Coding',
    text: 'Help me understand how to call an external API and handle the response properly in my JavaScript application.',
  },
  {
    id: '24',
    title: 'CSS Flexbox Mastery',
    description: 'Learn CSS layout techniques',
    category: 'Coding',
    text: 'Explain CSS Flexbox with visual examples. How do align-items, justify-content, and flex-direction work?',
  },
  {
    id: '25',
    title: 'Code Review Checklist',
    description: 'Review code like a pro',
    category: 'Coding',
    text: 'Create a checklist for reviewing code quality, security, performance, and readability.',
  },
  // Self-Care
  {
    id: '26',
    title: 'Self-Compassion Practice',
    description: 'Develop kindness toward yourself',
    category: 'Self-Care',
    text: 'I struggle with self-criticism about my limitations. Guide me through a self-compassion exercise.',
  },
  {
    id: '27',
    title: 'Mindfulness for Pain',
    description: 'Reduce pain through mindfulness',
    category: 'Self-Care',
    text: 'Teach me a mindfulness technique specifically designed to help manage chronic pain.',
  },
  {
    id: '28',
    title: 'Journaling Prompts',
    description: 'Explore emotions through writing',
    category: 'Self-Care',
    text: 'Give me 5 thoughtful journaling prompts for processing emotions and tracking my wellness journey.',
  },
  {
    id: '29',
    title: 'Grounding Techniques',
    description: 'Stay present in the moment',
    category: 'Self-Care',
    text: 'Teach me the 5-4-3-2-1 grounding technique and other tools for anxiety and dissociation.',
  },
  {
    id: '30',
    title: 'Boundary Setting',
    description: 'Protect your energy and time',
    category: 'Self-Care',
    text: 'Help me craft kind but firm boundaries with friends and family about my limitations and needs.',
  },
];

export const DollhouseAILounge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('chronomuse');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiSettings, setShowApiSettings] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [speechPitch, setSpeechPitch] = useState<number>(1);
  const [writingInput, setWritingInput] = useState<string>('');
  const [writingOutput, setWritingOutput] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('Friendly');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageDescription, setImageDescription] = useState<string>('');
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Health & Wellness');
  const [moods, setMoods] = useState<Mood[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(5);
  const [moodNotes, setMoodNotes] = useState<string>('');
  const [gratitudeEntry, setGratitudeEntry] = useState<string>('');
  const [breathing, setBreathing] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingScale, setBreathingScale] = useState<number>(1);
  const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pomodoroIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    loadFromStorage();
    const key = import.meta.env?.VITE_ANTHROPIC_API_KEY || '';
    setApiKey(key);
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Pomodoro timer
  useEffect(() => {
    if (pomodoroRunning) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroTime((t) => {
          if (t <= 1) {
            setPomodoroRunning(false);
            const message = `Pomodoro session complete! Great work!`;
            speakText(message);
            return 25 * 60;
          }
          return t - 1;
        });
      }, 1000);
    } else if (pomodoroIntervalRef.current) {
      clearInterval(pomodoroIntervalRef.current);
    }
    return () => {
      if (pomodoroIntervalRef.current) clearInterval(pomodoroIntervalRef.current);
    };
  }, [pomodoroRunning]);

  // Breathing exercise
  useEffect(() => {
    if (!breathing) return;
    const phases = ['inhale', 'hold', 'exhale'] as const;
    const durations = [4000, 4000, 4000];
    let currentPhaseIndex = 0;

    const cycle = () => {
      const phase = phases[currentPhaseIndex];
      const duration = durations[currentPhaseIndex];
      setBreathingPhase(phase);
      setBreathingScale(phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1);

      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        cycle();
      }, duration);
    };

    cycle();
    return () => {
      setBreathingScale(1);
    };
  }, [breathing]);

  const loadFromStorage = () => {
    const saved = localStorage.getItem('dollhouse-ai-conversations');
    if (saved) {
      const convs = JSON.parse(saved) as Conversation[];
      setConversations(convs);
      if (convs.length > 0) setCurrentConversationId(convs[0].id);
    }
    const saved_favorites = localStorage.getItem('dollhouse-ai-favorites');
    if (saved_favorites) setFavoritePrompts(JSON.parse(saved_favorites));
    const saved_moods = localStorage.getItem('dollhouse-ai-moods');
    if (saved_moods) setMoods(JSON.parse(saved_moods));
  };

  const saveToStorage = (convs: Conversation[]) => {
    localStorage.setItem('dollhouse-ai-conversations', JSON.stringify(convs));
    setConversations(convs);
  };

  const loadVoices = () => {
    const available = window.speechSynthesis.getVoices();
    setVoices(available);
    if (available.length > 0) setSelectedVoice(0);
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoice]) utterance.voice = voices[selectedVoice];
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentConversationId]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setVoiceText(transcript);
      processVoiceCommand(transcript);
    };
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    setIsListening(false);
  };

  const processVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();
    let response = '';

    if (lower.includes('weather')) {
      response = 'I do not have real-time weather data. Please check a weather service.';
    } else if (lower.includes('timer')) {
      response = 'You can set a timer in the AI Toolkit tab.';
    } else if (lower.includes('remind')) {
      response = 'Set reminders in your calendar or phone app. I can help you prepare what to remember!';
    } else if (lower.includes('music')) {
      response = 'You can play music from Spotify, Apple Music, or YouTube.';
    } else {
      response = `You said: ${text}. How can I help you with this?`;
    }

    speakText(response);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    let convId = currentConversationId;
    let convs = [...conversations];

    if (!convId) {
      const newConv: Conversation = {
        id: Math.random().toString(),
        title: input.slice(0, 50) || 'New Conversation',
        messages: [newMessage],
        createdAt: Date.now(),
      };
      convs = [newConv, ...convs];
      convId = newConv.id;
      setCurrentConversationId(convId);
    } else {
      convs = convs.map((c) =>
        c.id === convId ? { ...c, messages: [...c.messages, newMessage] } : c
      );
    }

    saveToStorage(convs);
    setInput('');
    setLoading(true);

    try {
      if (apiKey) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system:
              'You are ChronoMuse, a caring AI companion for someone with chronic illness (POTS, EDS, chronic pain). Be warm, supportive, knowledgeable about health, and encouraging.',
            messages: convs
              .find((c) => c.id === convId)
              ?.messages.map((m) => ({ role: m.role, content: m.content })) || [],
          }),
        });

        const data = await response.json();
        const assistantMessage: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.content[0].text,
          timestamp: Date.now(),
        };

        convs = convs.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, assistantMessage] } : c
        );
      } else {
        const assistantMessage: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: `(Offline mode) I am ChronoMuse. Without API access, I cannot provide real-time responses, but I want you to know: ${AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]}`,
          timestamp: Date.now(),
        };

        convs = convs.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, assistantMessage] } : c
        );
      }

      saveToStorage(convs);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: Date.now(),
      };
      convs = convs.map((c) =>
        c.id === convId ? { ...c, messages: [...c.messages, errorMessage] } : c
      );
      saveToStorage(convs);
    }

    setLoading(false);
  };

  const processWriting = async (tool: string) => {
    if (!writingInput.trim()) return;

    let output = '';

    if (!apiKey) {
      // Offline mode
      const wordCount = writingInput.split(/\s+/).length;
      const charCount = writingInput.length;
      const avgWordLength = charCount / wordCount;
      const complexity = avgWordLength > 6 ? 'High' : 'Medium';

      switch (tool) {
        case 'Summarize':
          output = `Summary (offline): This text has ${wordCount} words. Key points: [Unable to analyze without API]`;
          break;
        case 'Expand':
          output = `Expansion (offline): Your text is ${wordCount} words. Add more details and examples to expand it further.`;
          break;
        case 'Rewrite':
          output = `Rewrite (offline): Try reordering your sentences or using different word choices to improve flow.`;
          break;
        case 'Fix Grammar':
          output = `Grammar check (offline): Review: subject-verb agreement, punctuation, and sentence structure. Consider reading aloud.`;
          break;
        case 'Translate':
          output = `Translation (offline): Please specify a target language. This feature requires an API.`;
          break;
        case 'Simplify':
          output = `Simplification (offline): Replace complex words. Average word length: ${avgWordLength.toFixed(1)} characters. Aim for 4-5 characters.`;
          break;
        default:
          output = 'Unknown tool';
      }
    } else {
      // API mode
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: `You are a writing assistant. The user requests to ${tool} text with a ${selectedTone} tone. Be concise and helpful.`,
            messages: [{ role: 'user', content: writingInput }],
          }),
        });

        const data = await response.json();
        output = data.content[0].text;
      } catch (error) {
        output = 'Error processing with API. Check your key.';
      }
    }

    setWritingOutput(output);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImage(dataUrl);

      if (!apiKey) {
        const kb = (file.size / 1024).toFixed(2);
        const img = new Image();
        img.onload = () => {
          setImageDescription(
            `Offline mode: Image size ${kb}KB, dimensions ${img.width}x${img.height}. Cannot analyze without API.`
          );
        };
        img.src = dataUrl;
      } else {
        describeImageWithAPI(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const describeImageWithAPI = async (dataUrl: string) => {
    try {
      const base64 = dataUrl.split(',')[1];
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: base64,
                  },
                },
                {
                  type: 'text',
                  text: 'Describe this image in detail for accessibility. Include colors, composition, any text, and mood.',
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      setImageDescription(data.content[0].text);
    } catch (error) {
      setImageDescription('Error describing image. Check your API key.');
    }
  };

  const toggleFavorite = (promptId: string) => {
    const updated = favoritePrompts.includes(promptId)
      ? favoritePrompts.filter((id) => id !== promptId)
      : [...favoritePrompts, promptId];
    setFavoritePrompts(updated);
    localStorage.setItem('dollhouse-ai-favorites', JSON.stringify(updated));
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Prompt copied!');
  };

  const saveMood = () => {
    const newMood: Mood = {
      id: Math.random().toString(),
      timestamp: Date.now(),
      mood: currentMood,
      notes: moodNotes,
    };
    const updated = [...moods, newMood];
    setMoods(updated);
    localStorage.setItem('dollhouse-ai-moods', JSON.stringify(updated));
    setMoodNotes('');
    alert('Mood saved!');
  };

  const newConversation = () => {
    setCurrentConversationId('');
    setInput('');
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    saveToStorage(updated);
    if (currentConversationId === id) setCurrentConversationId('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    height: '90vh',
    backgroundColor: THEME.background,
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    color: THEME.text,
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    overflow: 'hidden',
    boxShadow: `0 0 40px ${THEME.secondary}40`,
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    backgroundColor: `${THEME.surface}`,
    borderBottom: `1px solid ${THEME.secondary}40`,
    overflowX: 'auto',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: active ? THEME.primary : 'transparent',
    color: active ? '#000' : THEME.text,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    scrollBehavior: 'smooth',
  };

  // RENDER TABS
  const renderChronomuseChat = () => (
    <div style={{ display: 'flex', height: '100%', gap: '12px' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '200px',
          borderRight: `1px solid ${THEME.secondary}40`,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '12px',
        }}
      >
        <button
          onClick={newConversation}
          style={{
            padding: '8px 12px',
            backgroundColor: THEME.primary,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '12px',
          }}
        >
          New Chat
        </button>
        <div style={{ fontSize: '11px', opacity: 0.7, fontWeight: '600', marginTop: '8px' }}>
          HISTORY
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setCurrentConversationId(conv.id)}
              style={{
                padding: '8px',
                backgroundColor:
                  currentConversationId === conv.id ? `${THEME.primary}40` : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                border: `1px solid ${currentConversationId === conv.id ? THEME.primary : 'transparent'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: THEME.primary,
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {conversations
            .find((c) => c.id === currentConversationId)
            ?.messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor:
                    msg.role === 'user' ? `${THEME.primary}60` : THEME.glass,
                  backdropFilter: msg.role === 'user' ? 'none' : 'blur(20px)',
                  border: `1px solid ${msg.role === 'user' ? THEME.primary : THEME.secondary}40`,
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {msg.content}
              </div>
            ))}
          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: THEME.glass,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${THEME.secondary}40`,
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ animation: 'pulse 0.8s infinite', animationDelay: '0s' }}>●</span>
                <span style={{ animation: 'pulse 0.8s infinite', animationDelay: '0.2s' }}>●</span>
                <span style={{ animation: 'pulse 0.8s infinite', animationDelay: '0.4s' }}>●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Chat with ChronoMuse..."
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: THEME.glass,
              border: `1px solid ${THEME.secondary}40`,
              borderRadius: '6px',
              color: THEME.text,
              fontSize: '14px',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: THEME.primary,
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderVoiceAssistant = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      {/* Push-to-talk button */}
      <div style={{ position: 'relative', width: '120px', height: '120px', marginTop: '40px' }}>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `3px solid ${THEME.primary}`,
            animation: isListening ? 'pulse-ring 1.5s infinite' : 'none',
          }}
        />
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: isListening ? THEME.primary : THEME.secondary,
            border: 'none',
            cursor: 'pointer',
            fontSize: '40px',
            color: '#000',
            fontWeight: '600',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isListening ? '🎤' : '🎙️'}
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '12px', opacity: 0.7 }}>
          {isListening ? 'Listening...' : 'Press and hold to speak'}
        </p>
      </div>

      {voiceText && (
        <div
          style={{
            padding: '12px',
            backgroundColor: THEME.glass,
            border: `1px solid ${THEME.secondary}40`,
            borderRadius: '8px',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>TRANSCRIPTION</div>
          {voiceText}
        </div>
      )}

      {/* Voice Settings */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            Voice
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: THEME.glass,
              border: `1px solid ${THEME.secondary}40`,
              borderRadius: '6px',
              color: THEME.text,
            }}
          >
            {voices.map((voice, idx) => (
              <option key={idx} value={idx} style={{ backgroundColor: THEME.background }}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            Speed: {speechRate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            Pitch: {speechPitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechPitch}
            onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={() => speakText('Hello! This is a test of the voice synthesis system.')}
          style={{
            padding: '10px',
            backgroundColor: THEME.mint,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          Test Voice
        </button>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );

  const renderWritingStudio = () => (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      {/* Input */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>WRITING INPUT</div>
        <textarea
          value={writingInput}
          onChange={(e) => setWritingInput(e.target.value)}
          placeholder="Paste or type your text here..."
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: THEME.glass,
            border: `1px solid ${THEME.secondary}40`,
            borderRadius: '6px',
            color: THEME.text,
            fontSize: '13px',
            fontFamily: 'inherit',
            resize: 'none',
          }}
        />
      </div>

      {/* Tools */}
      <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            TONE
          </label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: THEME.glass,
              border: `1px solid ${THEME.secondary}40`,
              borderRadius: '4px',
              color: THEME.text,
              fontSize: '12px',
            }}
          >
            {['Professional', 'Casual', 'Academic', 'Creative', 'Friendly'].map((t) => (
              <option key={t} value={t} style={{ backgroundColor: THEME.background }}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '11px', fontWeight: '600', opacity: 0.7, marginTop: '8px' }}>
          TOOLS
        </div>

        {['Summarize', 'Expand', 'Rewrite', 'Fix Grammar', 'Translate', 'Simplify'].map((tool) => (
          <button
            key={tool}
            onClick={() => processWriting(tool)}
            style={{
              padding: '8px 12px',
              backgroundColor: THEME.secondary,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {tool}
          </button>
        ))}

        <div style={{ fontSize: '11px', fontWeight: '600', opacity: 0.7, marginTop: '8px' }}>
          TEMPLATES
        </div>

        {['Email', 'Blog Post', 'Social Media', 'Cover Letter'].map((tpl) => (
          <button
            key={tpl}
            onClick={() =>
              setWritingInput(
                `[Insert ${tpl} content here for the assistant to improve...]`
              )
            }
            style={{
              padding: '8px 12px',
              backgroundColor: THEME.accent,
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {tpl}
          </button>
        ))}
      </div>

      {/* Output */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>OUTPUT</div>
        <div
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: THEME.glass,
            border: `1px solid ${THEME.secondary}40`,
            borderRadius: '6px',
            color: THEME.text,
            fontSize: '13px',
            lineHeight: '1.6',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {writingOutput || 'Output will appear here...'}
        </div>
        {writingOutput && (
          <button
            onClick={() => navigator.clipboard.writeText(writingOutput)}
            style={{
              padding: '8px 12px',
              backgroundColor: THEME.mint,
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px',
            }}
          >
            Copy Output
          </button>
        )}
      </div>
    </div>
  );

  const renderImageDescriber = () => (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      {/* Upload */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          border: `2px dashed ${THEME.primary}`,
          borderRadius: '8px',
          padding: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${THEME.surface}`,
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
        <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🖼️</div>
          <div style={{ fontSize: '14px', fontWeight: '600' }}>Upload Image</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
            Click or drag image here
          </div>
        </div>
      </div>

      {/* Preview & Description */}
      {uploadedImage && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <img
            src={uploadedImage}
            alt="Uploaded"
            style={{
              maxHeight: '200px',
              borderRadius: '6px',
              objectFit: 'cover',
              border: `1px solid ${THEME.secondary}40`,
            }}
          />
          <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>DESCRIPTION</div>
          <div
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: THEME.glass,
              border: `1px solid ${THEME.secondary}40`,
              borderRadius: '6px',
              color: THEME.text,
              fontSize: '13px',
              lineHeight: '1.6',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {imageDescription || 'Analyzing image...'}
          </div>
          {imageDescription && (
            <button
              onClick={() => navigator.clipboard.writeText(imageDescription)}
              style={{
                padding: '8px 12px',
                backgroundColor: THEME.mint,
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px',
              }}
            >
              Copy Description
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderPromptLibrary = () => (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      {/* Categories */}
      <div style={{ width: '160px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {['Health & Wellness', 'Productivity', 'Creative Writing', 'Learning', 'Coding', 'Self-Care'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 12px',
                backgroundColor: selectedCategory === cat ? THEME.primary : THEME.glass,
                color: selectedCategory === cat ? '#000' : THEME.text,
                border: `1px solid ${selectedCategory === cat ? THEME.primary : THEME.secondary}40`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                textAlign: 'left',
              }}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Prompts Grid */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {PROMPTS_DATA.filter((p) => p.category === selectedCategory).map((prompt) => (
          <div
            key={prompt.id}
            style={{
              padding: '12px',
              backgroundColor: THEME.glass,
              border: `1px solid ${THEME.secondary}40`,
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '6px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>{prompt.title}</div>
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                  {prompt.description}
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(prompt.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {favoritePrompts.includes(prompt.id) ? '⭐' : '☆'}
              </button>
            </div>
            <div
              style={{
                padding: '8px',
                backgroundColor: `${THEME.background}`,
                borderRadius: '4px',
                fontSize: '12px',
                lineHeight: '1.5',
                marginBottom: '8px',
                maxHeight: '80px',
                overflowY: 'auto',
                color: THEME.text,
              }}
            >
              {prompt.text}
            </div>
            <button
              onClick={() => copyPrompt(prompt.text)}
              style={{
                padding: '6px 12px',
                backgroundColor: THEME.mint,
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAIToolkit = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
      {/* Text-to-Speech */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>TEXT-TO-SPEECH READER</div>
        <textarea
          placeholder="Paste text to read aloud..."
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: THEME.glass,
            border: `1px solid ${THEME.secondary}40`,
            borderRadius: '6px',
            color: THEME.text,
            fontSize: '13px',
            fontFamily: 'inherit',
            resize: 'none',
          }}
          id="tts-input"
        />
        <button
          onClick={() => {
            const text = (document.getElementById('tts-input') as HTMLTextAreaElement).value;
            if (text) speakText(text);
          }}
          style={{
            padding: '10px',
            backgroundColor: THEME.primary,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          Read Aloud
        </button>
        <button
          onClick={() => window.speechSynthesis.cancel()}
          style={{
            padding: '10px',
            backgroundColor: `${THEME.secondary}`,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          Stop
        </button>
      </div>

      {/* Pomodoro */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>POMODORO TIMER</div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: THEME.mint,
            fontFamily: 'monospace',
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          {formatTime(pomodoroTime)}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button
            onClick={() => setPomodoroRunning(!pomodoroRunning)}
            style={{
              padding: '10px 20px',
              backgroundColor: pomodoroRunning ? THEME.secondary : THEME.primary,
              color: pomodoroRunning ? '#fff' : '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            {pomodoroRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => {
              setPomodoroTime(25 * 60);
              setPomodoroRunning(false);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: THEME.accent,
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Breathing Exercise */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>BREATHING EXERCISE</div>
        <div
          style={{
            width: '150px',
            height: '150px',
            position: 'relative',
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: THEME.primary,
              opacity: 0.6,
              transform: `scale(${breathingScale})`,
              transition: breathing ? 'transform 4s ease-in-out' : 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: THEME.mint,
            }}
          >
            {breathingPhase}
          </div>
        </div>
        <button
          onClick={() => setBreathing(!breathing)}
          style={{
            padding: '10px 20px',
            backgroundColor: breathing ? THEME.secondary : THEME.primary,
            color: breathing ? '#fff' : '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            marginTop: '20px',
          }}
        >
          {breathing ? 'Stop' : 'Start Breathing'}
        </button>
      </div>

      {/* Mood Tracker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>MOOD TRACKER</div>
        <div
          style={{
            padding: '12px',
            backgroundColor: THEME.glass,
            borderRadius: '6px',
            border: `1px solid ${THEME.secondary}40`,
          }}
        >
          <div style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>
            How are you feeling? {currentMood}/10
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={currentMood}
            onChange={(e) => setCurrentMood(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <textarea
          value={moodNotes}
          onChange={(e) => setMoodNotes(e.target.value)}
          placeholder="Add notes..."
          style={{
            padding: '8px',
            backgroundColor: THEME.glass,
            border: `1px solid ${THEME.secondary}40`,
            borderRadius: '6px',
            color: THEME.text,
            fontSize: '12px',
            fontFamily: 'inherit',
            minHeight: '60px',
            resize: 'none',
          }}
        />
        <button
          onClick={saveMood}
          style={{
            padding: '8px',
            backgroundColor: THEME.mint,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '12px',
          }}
        >
          Save Mood
        </button>
        <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px' }}>
          {moods.length} entries recorded
        </div>
      </div>
    </div>
  );

  const renderGratitudeJournal = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>GRATITUDE JOURNAL</div>

      {/* Random Affirmation */}
      <div
        style={{
          padding: '16px',
          backgroundColor: THEME.glass,
          border: `1px solid ${THEME.primary}`,
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '14px',
          fontStyle: 'italic',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]}
      </div>

      {/* Input */}
      <textarea
        value={gratitudeEntry}
        onChange={(e) => setGratitudeEntry(e.target.value)}
        placeholder="What are you grateful for today? Write freely..."
        style={{
          padding: '12px',
          backgroundColor: THEME.glass,
          border: `1px solid ${THEME.secondary}40`,
          borderRadius: '6px',
          color: THEME.text,
          fontSize: '13px',
          fontFamily: 'inherit',
          minHeight: '120px',
          resize: 'none',
        }}
      />

      <button
        onClick={() => {
          if (gratitudeEntry.trim()) {
            const entry = {
              id: Math.random().toString(),
              timestamp: Date.now(),
              text: gratitudeEntry,
            };
            const saved = localStorage.getItem('dollhouse-gratitude') || '[]';
            const entries = JSON.parse(saved);
            entries.push(entry);
            localStorage.setItem('dollhouse-gratitude', JSON.stringify(entries));
            setGratitudeEntry('');
            alert('Gratitude entry saved!');
          }
        }}
        style={{
          padding: '10px',
          backgroundColor: THEME.mint,
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        Save Entry
      </button>
    </div>
  );

  const renderSettings = () => (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          padding: '12px',
          backgroundColor: `${THEME.secondary}20`,
          borderLeft: `3px solid ${THEME.secondary}`,
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        API keys are stored in your browser's localStorage. Be cautious about security!
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
          Anthropic API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            localStorage.setItem('anthropic-key', e.target.value);
          }}
          placeholder="sk-..."
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: THEME.glass,
            border: `1px solid ${THEME.secondary}40`,
            borderRadius: '6px',
            color: THEME.text,
            fontSize: '12px',
          }}
        />
        <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
          {apiKey ? '✅ Key set' : '⚠️ No key (offline mode)'}
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          setConversations([]);
          setFavoritePrompts([]);
          setMoods([]);
          alert('All data cleared');
        }}
        style={{
          padding: '10px',
          backgroundColor: '#8B0000',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        Clear All Data
      </button>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Tabs */}
      <div style={tabsStyle}>
        {[
          { id: 'chronomuse', label: '✨ ChronoMuse Chat' },
          { id: 'voice', label: '🎙️ Voice Assistant' },
          { id: 'writing', label: '✍️ Writing Studio' },
          { id: 'image', label: '🖼️ Image Describer' },
          { id: 'prompts', label: '📚 Prompt Library' },
          { id: 'toolkit', label: '🛠️ AI Toolkit' },
          { id: 'gratitude', label: '💖 Gratitude' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabStyle(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {activeTab === 'chronomuse' && renderChronomuseChat()}
        {activeTab === 'voice' && renderVoiceAssistant()}
        {activeTab === 'writing' && renderWritingStudio()}
        {activeTab === 'image' && renderImageDescriber()}
        {activeTab === 'prompts' && renderPromptLibrary()}
        {activeTab === 'toolkit' && renderAIToolkit()}
        {activeTab === 'gratitude' && renderGratitudeJournal()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default DollhouseAILounge;
