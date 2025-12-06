/**
 * AI TEACHER PANEL COMPONENT
 * ===========================
 * Reusable component for integrating AI teaching capabilities
 * across creative and educational features.
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  MessageCircle,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  Clock,
  Target,
  X,
  Send,
  Bot,
  Lightbulb
} from 'lucide-react';
import {
  unifiedAITeacher,
  TeachingDomain,
  CURRICULUM,
  TeachingSession
} from '../services/unified-ai-teacher';

interface AITeacherPanelProps {
  domain: TeachingDomain;
  title?: string;
  minimized?: boolean;
  onClose?: () => void;
  className?: string;
}

const AITeacherPanel: React.FC<AITeacherPanelProps> = ({
  domain,
  title,
  minimized = false,
  onClose,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(!minimized);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<TeachingSession | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', message: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTopics, setShowTopics] = useState(false);

  const curriculum = CURRICULUM[domain] || {
    name: 'Learning',
    icon: '📚',
    description: 'General learning',
    topics: [],
    skills: ['Learning', 'Practice', 'Growth']
  };

  const allProgress = unifiedAITeacher.getAllProgress();
  const progress = allProgress[domain] || { sessions: 0, minutes: 0, lessons: 0 };

  let recommendations: string[] = [];
  try {
    recommendations = unifiedAITeacher.getRecommendedTopics(domain) || [];
  } catch (e) {
    recommendations = [];
  }

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem(`ai_teacher_chat_${domain}`);
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, [domain]);

  const saveChatHistory = (history: Array<{role: 'user' | 'ai', message: string}>) => {
    localStorage.setItem(`ai_teacher_chat_${domain}`, JSON.stringify(history.slice(-20))); // Keep last 20 messages
  };

  const startSession = (topicTitle: string) => {
    const session = unifiedAITeacher.startSession(domain, topicTitle);
    setCurrentSession(session);
    setSelectedTopic(topicTitle);

    // Add welcome message
    const welcomeMessage = `Great! Let's start learning about "${topicTitle}". I'm here to help you master this topic. What would you like to know first?`;
    const newHistory = [...chatHistory, { role: 'ai' as const, message: welcomeMessage }];
    setChatHistory(newHistory);
    saveChatHistory(newHistory);
  };

  const sendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    setIsLoading(true);

    // Add user message to history
    const newHistory = [...chatHistory, { role: 'user' as const, message: userMessage }];
    setChatHistory(newHistory);

    // Generate AI response based on teaching prompt
    const teachingPrompt = unifiedAITeacher.generateTeachingPrompt(domain, userMessage);

    // Simulate AI response (in real implementation, this would call Claude API)
    setTimeout(() => {
      const aiResponse = generateLocalResponse(domain, userMessage, selectedTopic);
      const updatedHistory = [...newHistory, { role: 'ai' as const, message: aiResponse }];
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
      setIsLoading(false);
    }, 1000);
  };

  const generateLocalResponse = (domain: TeachingDomain, question: string, topic: string | null): string => {
    const lowerQuestion = question.toLowerCase();

    // Domain-specific responses
    const responses: Record<TeachingDomain, string[]> = {
      'music': [
        "Great question about music! Let's break this down step by step. Practice is key - try starting with 15-minute focused sessions.",
        "In music, rhythm is foundational. Try clapping along with songs you enjoy to internalize different time signatures.",
        "For learning instruments, start slow and gradually increase tempo. Accuracy first, speed follows naturally."
      ],
      'creative-writing': [
        "Writing is about finding your unique voice. Don't worry about perfection in first drafts - just get your ideas flowing.",
        "Try the 'show, don't tell' technique. Instead of saying a character is sad, describe their actions and body language.",
        "Daily journaling, even for 10 minutes, builds your writing muscles and helps you discover your style."
      ],
      'poetry': [
        "Poetry is about distilling emotion into precise language. Start by writing what you feel without worrying about form.",
        "Try reading your poems aloud - the rhythm and sound matter as much as the words themselves.",
        "Experiment with different forms: haiku for brevity, sonnets for structure, free verse for freedom."
      ],
      'visual-art': [
        "Every artist has a unique style. Study artists you admire, but don't try to copy - let their work inspire your own vision.",
        "Practice gesture drawing daily - quick sketches help you capture movement and emotion.",
        "Color theory is fundamental. Start with a limited palette to understand how colors interact."
      ],
      'photography': [
        "The 'golden hour' (just after sunrise or before sunset) provides beautiful, warm lighting for most subjects.",
        "Learn the exposure triangle: aperture, shutter speed, and ISO work together to control light.",
        "Composition matters more than equipment. Practice the rule of thirds as a starting point."
      ],
      'fashion': [
        "Personal style is about self-expression. Start with pieces that make you feel confident and build from there.",
        "Understanding your color palette helps you make cohesive outfit choices that flatter your complexion.",
        "Quality over quantity - invest in versatile pieces that can be styled multiple ways."
      ],
      'sewing': [
        "Always pre-wash your fabric before cutting to prevent shrinkage issues later.",
        "Start with simple projects like pillowcases or tote bags before tackling garments.",
        "Take accurate measurements and add seam allowances - fit is everything in sewing."
      ],
      'wardrobe-styling': [
        "A capsule wardrobe of versatile pieces makes getting dressed easier and more sustainable.",
        "Layering is key to creating multiple outfits from fewer pieces.",
        "Organize your closet by category and color for easy outfit planning."
      ],
      'language-learning': [
        "Immersion is powerful - surround yourself with the language through music, movies, and podcasts.",
        "Don't fear making mistakes - they're essential for learning. Focus on communication over perfection.",
        "Spaced repetition helps vocabulary stick. Review new words at increasing intervals."
      ],
      'skill-development': [
        "Break complex skills into smaller components. Master each piece before combining them.",
        "Deliberate practice (focused, challenging work) beats passive repetition every time.",
        "Track your progress to stay motivated and identify areas needing more attention."
      ],
      'college-prep': [
        "Start college applications early and create a timeline for each component.",
        "Your personal essay should reveal who you are beyond grades and test scores.",
        "Research schools thoroughly - fit matters more than rankings."
      ],
      'general-education': [
        "Active learning (taking notes, asking questions, teaching others) beats passive reading.",
        "Connect new concepts to what you already know to build lasting understanding.",
        "Take breaks during study sessions - your brain consolidates learning during rest."
      ]
    };

    const domainResponses = responses[domain] || responses['general-education'];

    // Add context about the topic if selected
    if (topic) {
      return `Regarding ${topic}: ${domainResponses[Math.floor(Math.random() * domainResponses.length)]} Would you like me to explain any specific aspect in more detail?`;
    }

    return domainResponses[Math.floor(Math.random() * domainResponses.length)];
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem(`ai_teacher_chat_${domain}`);
    setCurrentSession(null);
    setSelectedTopic(null);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-20 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 ${className}`}
      >
        <GraduationCap className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-lg rounded-xl border border-purple-500/30 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/30 rounded-lg">
            <GraduationCap className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h3 className="font-bold text-white">{title || curriculum.name} Teacher</h3>
            <p className="text-xs text-purple-300">
              {progress.sessions} sessions • {progress.minutes} min learned
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors text-purple-300"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Topics Selector */}
      <div className="p-4 border-b border-purple-500/30">
        <button
          onClick={() => setShowTopics(!showTopics)}
          className="w-full flex items-center justify-between bg-purple-800/30 hover:bg-purple-800/50 p-3 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="text-purple-200">
              {selectedTopic || 'Choose a topic to learn'}
            </span>
          </div>
          {showTopics ? (
            <ChevronUp className="w-5 h-5 text-purple-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-400" />
          )}
        </button>

        {showTopics && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {curriculum.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  startSession(topic.title);
                  setShowTopics(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTopic === topic.title
                    ? 'bg-purple-600/50 border border-purple-400/50'
                    : 'bg-purple-900/30 hover:bg-purple-800/50 border border-transparent'
                }`}
              >
                <div className="font-medium text-white text-sm">{topic.title}</div>
                <div className="text-xs text-purple-300 mt-1">
                  {topic.lessons.length} lessons
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && !selectedTopic && (
        <div className="p-4 border-b border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-purple-200">Recommended for you</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((rec, idx) => (
              <button
                key={idx}
                onClick={() => {
                  startSession(rec);
                  setShowTopics(false);
                }}
                className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full transition-colors"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {chatHistory.length === 0 ? (
          <div className="text-center text-purple-300 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a topic above to start learning!</p>
            <p className="text-xs mt-2 opacity-70">
              I can help with {curriculum.skills.join(', ')}
            </p>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-purple-600/50 text-white'
                    : 'bg-indigo-800/50 text-purple-100'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-300">AI Teacher</span>
                  </div>
                )}
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-indigo-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-pulse flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-400"></div>
                </div>
                <span className="text-xs text-purple-300">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-purple-800/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={sendMessage}
            disabled={!chatMessage.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={clearChat}
            className="w-full mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Clear conversation
          </button>
        )}
      </div>

      {/* Progress Footer */}
      <div className="p-4 border-t border-purple-500/30 bg-purple-900/50">
        <div className="flex items-center justify-between text-xs text-purple-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{progress.minutes} min total</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>{progress.lessons} lessons completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITeacherPanel;
