import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Radio, Settings, MessageCircle, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useKolHubStore } from '../store/kolhub-store';

interface VoiceCommand {
  command: string;
  variations: string[];
  action: () => void;
  category: string;
}

interface VoiceMessage {
  id: string;
  type: 'user' | 'kol';
  text: string;
  timestamp: string;
  audioUrl?: string;
}

export const VoiceInteraction: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState('en-US');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
    loadVoiceSettings();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('Listening...');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(`Voice error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const voices = synthRef.current!.getVoices();
        setAvailableVoices(voices);
        
        // Select default voice
        const defaultVoice = voices.find(v => v.lang === language) || voices[0];
        setSelectedVoice(defaultVoice);
      };

      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }
  };

  const loadVoiceSettings = () => {
    const settings = localStorage.getItem('kol_voice_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setVoiceSpeed(parsed.speed || 1.0);
      setVoicePitch(parsed.pitch || 1.0);
      setLanguage(parsed.language || 'en-US');
    }
  };

  const saveVoiceSettings = () => {
    const settings = {
      speed: voiceSpeed,
      pitch: voicePitch,
      language: language
    };
    localStorage.setItem('kol_voice_settings', JSON.stringify(settings));
    toast.success('Voice settings saved');
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current || !voiceEnabled) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;
    utterance.lang = language;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);

    // Add to messages
    const message: VoiceMessage = {
      id: `msg_${Date.now()}`,
      type: 'kol',
      text: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, message]);
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    // Add user message
    const userMessage: VoiceMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      text: command,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Process commands
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      speak('Hello! I am KOL, your personal AI companion. How can I help you today?');
    } else if (lowerCommand.includes('how are you')) {
      speak('I am functioning optimally and ready to assist you. How are you feeling today?');
    } else if (lowerCommand.includes('medication') || lowerCommand.includes('medicine')) {
      speak('Let me check your medication schedule. You can also say "take medication" to log a dose.');
    } else if (lowerCommand.includes('reminder')) {
      speak('I can help you set reminders. Just tell me what you need to remember and when.');
    } else if (lowerCommand.includes('health') || lowerCommand.includes('symptoms')) {
      speak('I can help you track your health. What symptoms or vitals would you like to record?');
    } else if (lowerCommand.includes('energy') || lowerCommand.includes('spoons')) {
      speak('How many spoons do you have today? I can help you plan your activities accordingly.');
    } else if (lowerCommand.includes('journal') || lowerCommand.includes('write')) {
      speak('I am ready to take your journal entry. Start speaking whenever you are ready.');
    } else if (lowerCommand.includes('music') || lowerCommand.includes('play')) {
      speak('Opening your music sanctuary. What would you like to listen to?');
    } else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      speak('I can help you with medications, health tracking, journaling, reminders, energy management, and much more. Just ask me anything!');
    } else if (lowerCommand.includes('stop') || lowerCommand.includes('quiet')) {
      stopListening();
      speak('I will be quiet now. Let me know when you need me again.');
    } else {
      speak('I heard you say: ' + command + '. I am still learning how to respond to that. Can you try rephrasing?');
    }

    setTranscript('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Radio className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Voice Interaction</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                voiceEnabled ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {voiceEnabled ? 'Voice On' : 'Voice Off'}
            </button>
          </div>
        </div>

        {/* Main Voice Control */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Microphone Button */}
            <motion.button
              onClick={isListening ? stopListening : startListening}
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <MicOff className="w-16 h-16 text-white" />
              ) : (
                <Mic className="w-16 h-16 text-white" />
              )}
            </motion.button>

            {/* Status */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to Listen'}
              </h3>
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="flex gap-2 justify-center"
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </motion.div>
              )}
            </div>

            {/* Live Transcript */}
            {transcript && (
              <div className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-200 text-center">{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Voice Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Voice</label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.name === e.target.value);
                  setSelectedVoice(voice || null);
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
              >
                {availableVoices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Speed: {voiceSpeed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Pitch: {voicePitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voicePitch}
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={saveVoiceSettings}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Conversation History */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            Conversation History
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No conversation yet. Start talking to KOL!
              </p>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Commands */}
        <div className="mt-6 bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Try These Commands
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Hello KOL',
              'How are you?',
              'Check my medications',
              'Set a reminder',
              'How many spoons do I have?',
              'Open my journal',
              'Play some music',
              'Help me'
            ].map(cmd => (
              <button
                key={cmd}
                onClick={() => processVoiceCommand(cmd)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-left text-sm text-gray-300"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
