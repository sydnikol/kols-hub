import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Book, Palette, Heart, Globe } from 'lucide-react';
import { useChronoMuseStore } from '../../store/chronoMuseStore';

interface Message {
  id: string;
  role: 'user' | 'chronomuse';
  content: string;
  mood?: string;
  timestamp: Date;
}

export default function ChronoMuseChat({ currentRoom }: { currentRoom: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'chronomuse',
      content: "Hey Kol. I'm here with you. What are we exploring today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentMood, currentToneMode, currentEra, energyLevel } = useChronoMuseStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRoomGreeting = (room: string) => {
    const greetings = {
      library: "The books are glowing for you. What knowledge calls to you?",
      studio: "Your creative space is ready. What are we building today?",
      sanctuary: "This is your safe place. Take all the time you need.",
      observatory: "The timelines are waiting. Where do you want to go?"
    };
    return greetings[room as keyof typeof greetings] || "I'm here with you.";
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    // This would integrate with your actual AI backend
    // For now, context-aware responses based on room, mood, energy
    
    const context = {
      room: currentRoom,
      mood: currentMood,
      tone: currentToneMode,
      era: currentEra,
      energy: energyLevel
    };

    // Adaptive responses based on context
    if (context.energy < 4) {
      return "I see you're running low on energy. Want me to keep things simple and gentle right now?";
    }

    if (context.mood === 'overwhelm') {
      return "Hey, I'm picking up on some overwhelm. Let's ground together. Focus on my voice. You're safe here.";
    }

    if (context.room === 'library' && userMessage.toLowerCase().includes('learn')) {
      return `Perfect. The ${context.era || 'current'} section is calling. Let me pull up some contextualized knowledge for you.`;
    }

    // Default thoughtful response
    return "I'm listening. Tell me more about what you're thinking.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time (300-1000ms)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    const response = await generateResponse(input);
    const chronoMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'chronomuse',
      content: response,
      mood: currentMood,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, chronoMessage]);
    setIsTyping(false);
  };

  const getRoomIcon = (room: string) => {
    const icons = {
      library: Book,
      studio: Palette,
      sanctuary: Heart,
      observatory: Globe
    };
    const Icon = icons[room as keyof typeof icons] || Sparkles;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A5DB8] to-purple-600 flex items-center justify-center">
            {getRoomIcon(currentRoom)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#C0C0D8]">ChronoMuse</h3>
            <p className="text-xs text-[#E8E8F4]/60">Your AI Twin • {currentToneMode}</p>
          </div>
        </div>
        {currentEra && (
          <div className="text-xs text-[#4A5DB8] bg-[#4A5DB8]/10 px-3 py-1 rounded-full inline-block">
            📍 {currentEra}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-[#4A5DB8]/30 to-purple-900/30 text-[#E8E8F4] border border-[#4A5DB8]/30'
                  : 'bg-[#0A0A0F]/60 text-[#C0C0D8] border border-[#C0C0D8]/20'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className="text-[10px] text-[#E8E8F4]/40 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#0A0A0F]/60 rounded-2xl px-4 py-3 border border-[#C0C0D8]/20">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#C0C0D8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#C0C0D8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#C0C0D8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Speak your thoughts..."
          className="flex-1 bg-[#1A1A24]/60 border border-[#C0C0D8]/30 rounded-xl px-4 py-3 text-[#E8E8F4] placeholder-[#E8E8F4]/40 focus:outline-none focus:border-[#4A5DB8] transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A5DB8] to-purple-600 flex items-center justify-center hover:from-[#4A5DB8]/80 hover:to-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Energy Indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-[#E8E8F4]/60">
        <span>Your Energy:</span>
        <div className="flex-1 h-1.5 bg-[#1A1A24] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4A5DB8] to-purple-600 transition-all duration-300"
            style={{ width: `${energyLevel * 10}%` }}
          />
        </div>
        <span>{energyLevel}/10</span>
      </div>
    </div>
  );
}
