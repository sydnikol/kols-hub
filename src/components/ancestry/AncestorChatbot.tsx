import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, Calendar, MapPin, BookOpen, History, Heart } from 'lucide-react';
import { Ancestor } from '../../services/ancestryService';

interface Message {
  id: string;
  role: 'user' | 'ancestor';
  content: string;
  ancestorName?: string;
  timestamp: Date;
}

interface AncestorChatbotProps {
  ancestors: Ancestor[];
}

export default function AncestorChatbot({ ancestors }: AncestorChatbotProps) {
  const [selectedAncestor, setSelectedAncestor] = useState<Ancestor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedAncestor) {
      // Initial greeting from ancestor
      const greeting = generateGreeting(selectedAncestor);
      setMessages([{
        id: '1',
        role: 'ancestor',
        content: greeting,
        ancestorName: selectedAncestor.name,
        timestamp: new Date()
      }]);
    }
  }, [selectedAncestor]);

  const generateGreeting = (ancestor: Ancestor): string => {
    const greetings = [
      `Hello, dear one. I am ${ancestor.name}, your ${ancestor.relation}. I lived from ${ancestor.birthYear} to ${ancestor.deathYear || 'my time'}. What would you like to know about our family?`,
      `Greetings from the past. I'm ${ancestor.name}. I've been waiting to share our family's story with you.`,
      `Welcome, descendant. I am ${ancestor.name}. Through the veil of time, I can tell you about ${ancestor.birthPlace || 'our homeland'} and the life I lived.`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const generateResponse = async (userMessage: string, ancestor: Ancestor): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Context-aware responses based on ancestor data and user question
    if (lowerMessage.includes('life') || lowerMessage.includes('lived')) {
      return `I lived during ${ancestor.birthYear ? 'the ' + Math.floor(ancestor.birthYear / 100) * 100 + 's' : 'a time of great change'}${
        ancestor.birthPlace ? ` in ${ancestor.birthPlace}` : ''
      }. ${ancestor.occupation ? `I worked as a ${ancestor.occupation}, which was ${getOccupationContext(ancestor.occupation)}.` : 'Those were different times.'}`;
    }

    if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('occupation')) {
      if (ancestor.occupation) {
        return `I was a ${ancestor.occupation}. ${getOccupationStory(ancestor.occupation)} It was honest work that helped provide for our family.`;
      }
      return "I worked hard to provide for the family, as we all did in those days.";
    }

    if (lowerMessage.includes('home') || lowerMessage.includes('place') || lowerMessage.includes('where')) {
      if (ancestor.birthPlace) {
        return `I was born in ${ancestor.birthPlace}. ${getPlaceContext(ancestor.birthPlace)} The land and its people shaped who I became.`;
      }
      return "Our homeland was a place of both struggle and beauty. It made us who we are.";
    }

    if (lowerMessage.includes('culture') || lowerMessage.includes('tradition')) {
      if (ancestor.culturalBackground && ancestor.culturalBackground.length > 0) {
        return `Our family's roots are in ${ancestor.culturalBackground.join(' and ')} culture. We honored traditions like ${getCulturalTraditions(ancestor.culturalBackground[0])}. These practices connected us to our ancestors and to the land.`;
      }
      return "We held our traditions dear. They connected us to those who came before and guided those who would come after.";
    }

    if (lowerMessage.includes('family') || lowerMessage.includes('children') || lowerMessage.includes('relatives')) {
      return `Family was everything to us. ${ancestor.relation === 'Mother' || ancestor.relation === 'Father' ? 'I raised my children to be strong and kind.' : 'We looked after each other through good times and hard times.'} The bonds we shared transcend even death.`;
    }

    if (lowerMessage.includes('advice') || lowerMessage.includes('wisdom') || lowerMessage.includes('learn')) {
      return getAncestralWisdom(ancestor);
    }

    if (lowerMessage.includes('story') || lowerMessage.includes('tell me')) {
      if (ancestor.stories && ancestor.stories.length > 0) {
        return ancestor.stories[Math.floor(Math.random() * ancestor.stories.length)];
      }
      return "Let me tell you something... In my time, we learned that perseverance and love for family could overcome any obstacle. Remember that, always.";
    }

    if (lowerMessage.includes('hard') || lowerMessage.includes('difficult') || lowerMessage.includes('struggle')) {
      return `Life had its challenges, yes. ${ancestor.birthYear && ancestor.birthYear < 1920 ? 'We faced hardships you might find hard to imagine.' : 'But we found strength in each other.'} But remember, you come from a line of survivors. That strength flows in your veins.`;
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('grateful')) {
      return "Your gratitude warms my spirit. Remember, we live on through you. Honor our memory by living fully and loving deeply.";
    }

    // Default thoughtful response
    const defaultResponses = [
      "That's a good question. In my time, we approached things differently, but the core of what matters - family, love, perseverance - remains the same.",
      "I see the same curiosity in you that ran through our family. Never stop asking questions, dear one.",
      "The world has changed so much since my time, yet some truths remain eternal. What else would you like to know?",
      `I wish I could sit with you and share all the stories face to face. But know that I'm proud of who you're becoming.`,
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const getOccupationContext = (occupation: string): string => {
    const contexts: { [key: string]: string } = {
      'farmer': 'how we connected with the earth and the seasons',
      'blacksmith': 'essential work that required both strength and skill',
      'teacher': 'a noble calling to shape young minds',
      'merchant': 'how we built connections between communities',
      'soldier': 'serving with honor despite the hardships',
      'seamstress': 'creating beauty and warmth with our hands',
    };
    return contexts[occupation.toLowerCase()] || 'important work that contributed to our community';
  };

  const getOccupationStory = (occupation: string): string => {
    const stories: { [key: string]: string } = {
      'farmer': 'Each harvest taught me patience and gratitude.',
      'blacksmith': 'The forge was hot, but the craft was rewarding.',
      'teacher': 'Every child I taught carried a piece of our legacy forward.',
      'merchant': 'Trading brought not just goods, but stories and friendships.',
      'soldier': 'I served to protect what we held dear.',
      'seamstress': 'Every stitch was made with care and love.',
    };
    return stories[occupation.toLowerCase()] || 'It taught me discipline and dedication.';
  };

  const getPlaceContext = (place: string): string => {
    const contexts = [
      'It was a place of great natural beauty.',
      'The community there was tight-knit and supportive.',
      'Life there shaped our family\'s values.',
      'The landscape and climate influenced everything we did.',
    ];
    return contexts[Math.floor(Math.random() * contexts.length)];
  };

  const getCulturalTraditions = (culture: string): string => {
    const traditions: { [key: string]: string } = {
      'irish': 'storytelling by the fire, celebrating our heritage with music and dance',
      'italian': 'gathering for meals, honoring our saints, preserving family recipes',
      'african': 'oral history, community celebrations, honoring our ancestors',
      'asian': 'respect for elders, seasonal festivals, maintaining family bonds',
      'native american': 'connection to the land, passing down sacred knowledge',
    };
    return traditions[culture.toLowerCase()] || 'gathering together, honoring our elders, celebrating our heritage';
  };

  const getAncestralWisdom = (ancestor: Ancestor): string => {
    const wisdom = [
      "Remember that family is your greatest treasure. Nurture those bonds.",
      "Hard work and integrity will carry you through life's storms.",
      "Never forget where you came from. Your roots give you strength.",
      "Be kind, even when it's difficult. Kindness echoes through generations.",
      "Listen to your elders. They carry wisdom earned through experience.",
      "Preserve our stories. They are the threads that connect past to future.",
      "Face challenges with courage. You come from a line of strong people.",
    ];
    return wisdom[Math.floor(Math.random() * wisdom.length)];
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedAncestor) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const response = await generateResponse(input, selectedAncestor);
    const ancestorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ancestor',
      content: response,
      ancestorName: selectedAncestor.name,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, ancestorMessage]);
    setIsTyping(false);
  };

  const suggestedQuestions = [
    "What was life like in your time?",
    "Tell me about our family traditions",
    "What advice would you give me?",
    "What was your greatest joy?",
    "Tell me a story from your life",
    "What do you want me to remember?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      {/* Ancestor Selection Sidebar */}
      <div className="lg:col-span-1 bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-4 overflow-y-auto">
        <h3 className="text-lg font-bold text-amber-200 mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Choose an Ancestor
        </h3>

        <div className="space-y-2">
          {ancestors.map((ancestor) => (
            <motion.button
              key={ancestor.id}
              onClick={() => setSelectedAncestor(ancestor)}
              whileHover={{ scale: 1.02 }}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedAncestor?.id === ancestor.id
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-500'
                  : 'bg-[#0A0A0F]/40 border border-amber-600/20 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {ancestor.photoUrl ? (
                  <img
                    src={ancestor.photoUrl}
                    alt={ancestor.name}
                    className="w-10 h-10 rounded-lg object-cover sepia"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-700/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-400/60" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-amber-200 truncate">{ancestor.name}</p>
                  <p className="text-xs text-[#C0C0D8]/60">{ancestor.relation}</p>
                </div>
              </div>

              {ancestor.birthYear && (
                <div className="flex items-center gap-2 text-xs text-[#C0C0D8]/60">
                  <Calendar className="w-3 h-3" />
                  <span>{ancestor.birthYear} - {ancestor.deathYear || '?'}</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {ancestors.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-amber-400/30 mx-auto mb-3" />
            <p className="text-sm text-[#C0C0D8]/60">
              Add ancestors to start chatting with them
            </p>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg flex flex-col">
        {selectedAncestor ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-amber-600/20">
              <div className="flex items-center gap-3">
                {selectedAncestor.photoUrl ? (
                  <img
                    src={selectedAncestor.photoUrl}
                    alt={selectedAncestor.name}
                    className="w-12 h-12 rounded-lg object-cover sepia"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-700/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-amber-400/60" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-amber-200">{selectedAncestor.name}</h3>
                  <p className="text-sm text-[#C0C0D8]/60">
                    {selectedAncestor.relation}
                    {selectedAncestor.birthYear && ` • ${selectedAncestor.birthYear}-${selectedAncestor.deathYear || '?'}`}
                  </p>
                </div>
                <div className="ml-auto">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-amber-600/30 to-amber-700/30 border border-amber-500/30 text-[#E8E8F4]'
                          : 'bg-[#0A0A0F]/60 border border-amber-600/30 text-[#C0C0D8]'
                      }`}
                      style={{
                        backgroundImage: message.role === 'ancestor'
                          ? 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'oldpaper\' x=\'0\' y=\'0\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Cfilter id=\'papernoise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23papernoise)\' opacity=\'0.03\' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23oldpaper)\' /%3E%3C/svg%3E")'
                          : 'none'
                      }}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-[10px] text-[#C0C0D8]/40 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#0A0A0F]/60 border border-amber-600/30 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-[#C0C0D8]/60 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(question)}
                      className="text-xs px-3 py-1.5 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-full hover:border-amber-500/40 transition-all text-amber-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-amber-600/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your ancestor anything..."
                  className="flex-1 bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-3 text-[#E8E8F4] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Heart className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-200 mb-2">
                Connect with Your Ancestors
              </h3>
              <p className="text-[#C0C0D8]/60 mb-4">
                Select an ancestor to start a conversation across time
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
