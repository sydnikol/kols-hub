import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Button,
  Tooltip,
  Fade,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Send,
  X,
  Trash2,
  Sparkles,
  MessageCircle,
  User,
  RefreshCw,
} from 'lucide-react';

// ==================== Types ====================

export interface HistoricalFigure {
  figureId: string;
  figureName: string;
  category: string;
  speakingStyle: string;
  conversationTopics: string[];
  quotes: string[];
  backstory: string;
  traits?: string[];
  interests?: string[];
  gothicTitle?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'figure';
  content: string;
  timestamp: number;
}

export interface HistoricalFigureChatProps extends HistoricalFigure {
  onClose: () => void;
}

type FigureMood = 'neutral' | 'thoughtful' | 'passionate' | 'wise' | 'inspired' | 'contemplative';

// ==================== Animations ====================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
`;

const typewriter = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const moodPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ==================== Styled Components ====================

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '500px',
  maxHeight: '80vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1018 50%, #0d0d1a 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5L35 25L55 30L35 35L30 55L25 35L5 30L25 25Z\' fill=\'%23d4af3708\' /%3E%3C/svg%3E")',
    opacity: 0.3,
    pointerEvents: 'none',
  },
});

const ChatHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 140, 40, 0.1) 100%)',
  borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
  zIndex: 1,
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Cinzel", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #c9a227 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
});

const MoodIndicator = styled(Box)<{ mood: FigureMood }>(({ mood }) => {
  const moodColors: Record<FigureMood, string> = {
    neutral: '#d4af37',
    thoughtful: '#8b5cf6',
    passionate: '#ef4444',
    wise: '#10b981',
    inspired: '#f59e0b',
    contemplative: '#6366f1',
  };

  return {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '20px',
    background: `${moodColors[mood]}20`,
    border: `1px solid ${moodColors[mood]}50`,
    animation: `${moodPulse} 3s ease-in-out infinite`,
    '& .mood-dot': {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: moodColors[mood],
      boxShadow: `0 0 10px ${moodColors[mood]}`,
    },
    '& .mood-text': {
      color: moodColors[mood],
      fontSize: '0.8rem',
      fontFamily: '"Cinzel", serif',
      textTransform: 'capitalize',
    },
  };
});

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  zIndex: 1,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(212, 175, 55, 0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(212, 175, 55, 0.3)',
    borderRadius: '3px',
  },
});

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ isUser }) => ({
  maxWidth: '80%',
  padding: '14px 18px',
  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  background: isUser
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(180, 140, 40, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)',
  border: isUser
    ? '1px solid rgba(212, 175, 55, 0.4)'
    : '1px solid rgba(139, 92, 246, 0.3)',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  animation: `${fadeIn} 0.3s ease-out`,
  position: 'relative',
}));

const MessageText = styled(Typography)({
  color: '#f4f4f5',
  fontSize: '0.95rem',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
});

const MessageMeta = styled(Typography)({
  color: '#9ca3af',
  fontSize: '0.7rem',
  marginTop: '6px',
  textAlign: 'right',
});

const TopicStarters = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '12px 20px',
  background: 'rgba(212, 175, 55, 0.05)',
  borderTop: '1px solid rgba(212, 175, 55, 0.2)',
  zIndex: 1,
});

const TopicChip = styled(Chip)({
  background: 'rgba(212, 175, 55, 0.15)',
  color: '#d4af37',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  cursor: 'pointer',
  fontFamily: '"Cinzel", serif',
  fontSize: '0.75rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(212, 175, 55, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
  },
});

const InputContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px 20px',
  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(180, 140, 40, 0.05) 100%)',
  borderTop: '1px solid rgba(212, 175, 55, 0.3)',
  zIndex: 1,
});

const StyledTextField = styled(TextField)({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    background: 'rgba(10, 8, 18, 0.6)',
    borderRadius: '12px',
    color: '#f4f4f5',
    fontFamily: 'inherit',
    '& fieldset': {
      borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(212, 175, 55, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#d4af37',
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#6b7280',
  },
});

const SendButton = styled(IconButton)({
  background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
  color: '#0a0812',
  padding: '12px',
  transition: 'all 0.2s ease',
  animation: `${pulseGlow} 3s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d4af37 100%)',
    transform: 'scale(1.05)',
  },
  '&:disabled': {
    background: 'rgba(212, 175, 55, 0.3)',
    color: '#6b7280',
  },
});

const ActionButton = styled(IconButton)({
  color: '#d4af37',
  padding: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(212, 175, 55, 0.2)',
    transform: 'scale(1.1)',
  },
});

const TypingIndicator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 18px',
  maxWidth: '80%',
  borderRadius: '18px 18px 18px 4px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  alignSelf: 'flex-start',
  animation: `${fadeIn} 0.3s ease-out`,
  '& .dot': {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#8b5cf6',
    animation: `${typewriter} 1s ease-in-out infinite`,
    '&:nth-of-type(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.4s',
    },
  },
});

// ==================== Helper Functions ====================

const getStorageKey = (figureId: string): string => {
  return `historical-chat-${figureId}`;
};

const loadConversation = (figureId: string): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(getStorageKey(figureId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load conversation:', error);
  }
  return [];
};

const saveConversation = (figureId: string, messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(getStorageKey(figureId), JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save conversation:', error);
  }
};

const clearConversation = (figureId: string): void => {
  try {
    localStorage.removeItem(getStorageKey(figureId));
  } catch (error) {
    console.error('Failed to clear conversation:', error);
  }
};

const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Determine mood based on conversation context
const determineMood = (
  userMessage: string,
  figure: HistoricalFigure
): FigureMood => {
  const lowerMessage = userMessage.toLowerCase();

  // Check for emotional keywords
  if (lowerMessage.includes('love') || lowerMessage.includes('passion') || lowerMessage.includes('heart')) {
    return 'passionate';
  }
  if (lowerMessage.includes('think') || lowerMessage.includes('believe') || lowerMessage.includes('opinion')) {
    return 'thoughtful';
  }
  if (lowerMessage.includes('teach') || lowerMessage.includes('learn') || lowerMessage.includes('wisdom') || lowerMessage.includes('advice')) {
    return 'wise';
  }
  if (lowerMessage.includes('create') || lowerMessage.includes('art') || lowerMessage.includes('dream') || lowerMessage.includes('imagine')) {
    return 'inspired';
  }
  if (lowerMessage.includes('why') || lowerMessage.includes('meaning') || lowerMessage.includes('purpose')) {
    return 'contemplative';
  }

  // Check if message relates to figure's interests
  const interests = figure.interests || [];
  const topics = figure.conversationTopics || [];
  const allTopics = [...interests, ...topics].map(t => t.toLowerCase());

  if (allTopics.some(topic => lowerMessage.includes(topic.toLowerCase()))) {
    return 'passionate';
  }

  return 'neutral';
};

// Generate a simulated AI response based on the figure's personality
const generateResponse = (
  userMessage: string,
  figure: HistoricalFigure,
  conversationHistory: ChatMessage[]
): string => {
  const lowerMessage = userMessage.toLowerCase();
  const { quotes, speakingStyle, backstory, traits = [], interests = [], conversationTopics = [] } = figure;

  // Response templates based on speaking style
  const stylePatterns: Record<string, string[]> = {
    'Direct': ['I tell you plainly:', 'Let me be clear:', 'The truth is:'],
    'Poetic': ['Like a river finding its way to the sea,', 'In the tapestry of time,', 'As the stars whisper to the night,'],
    'Warm': ['My dear friend,', 'Let me share with you,', 'With warmth in my heart,'],
    'Measured': ['Upon reflection,', 'Consider this carefully:', 'In my experience,'],
    'Passionate': ['With fire in my soul,', 'I say to you with all my being,', 'This burns within me:'],
    'Wise': ['Wisdom teaches us that', 'In the fullness of time, one learns', 'The ancients knew that'],
    'Fierce': ['I will not mince words:', 'Stand firm and know this:', 'With unwavering conviction:'],
  };

  // Find matching style pattern
  let styleOpener = '';
  for (const [style, openers] of Object.entries(stylePatterns)) {
    if (speakingStyle.toLowerCase().includes(style.toLowerCase())) {
      styleOpener = openers[Math.floor(Math.random() * openers.length)];
      break;
    }
  }

  // Check if user message relates to any conversation topic
  let topicMatch = conversationTopics.find(topic =>
    lowerMessage.includes(topic.toLowerCase().split(' ')[0])
  );

  // Check interests
  let interestMatch = interests.find(interest =>
    lowerMessage.includes(interest.toLowerCase())
  );

  // Check if we should use a quote
  let relevantQuote = '';
  for (const quote of quotes) {
    const quoteWords = quote.toLowerCase().split(' ');
    const messageWords = lowerMessage.split(' ');
    // Check for word overlap
    if (quoteWords.some(word => word.length > 3 && messageWords.some(mw => mw.includes(word)))) {
      relevantQuote = quote;
      break;
    }
  }

  // Build response based on context
  const responses: string[] = [];

  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('greetings')) {
    responses.push(
      `Welcome, seeker. I am ${figure.figureName}, ${figure.gothicTitle || 'here to share my journey with you'}. What wisdom do you seek from the shadows of history?`,
      `${styleOpener} it is rare for one to reach across time to speak with me. I am honored by your presence. What shall we discuss?`,
      `Greetings, traveler through time. ${backstory.split('.')[0]}. What brings you to my threshold?`
    );
  }
  // Questions about their life/work
  else if (lowerMessage.includes('who are you') || lowerMessage.includes('tell me about yourself') || lowerMessage.includes('your story')) {
    responses.push(
      `${styleOpener} ${backstory}${relevantQuote ? ` As I once said: "${relevantQuote}"` : ''}`,
      `I am ${figure.figureName}. ${backstory} My spirit carries the weight of my experiences, and I am here to share them with those who seek understanding.`
    );
  }
  // Topic-specific responses
  else if (topicMatch) {
    responses.push(
      `${styleOpener} you ask about ${topicMatch}. This was central to my life's work. ${relevantQuote ? `"${relevantQuote}" - these words guided my path.` : 'Let me share what I have learned through my struggles and triumphs.'}`,
      `Ah, ${topicMatch}. ${styleOpener} this is where my passion burns brightest. ${traits.length > 0 ? `Being ${traits[0].toLowerCase()} and ${traits[1]?.toLowerCase() || 'determined'}, I devoted myself to this cause.` : ''}`
    );
  }
  // Interest-specific responses
  else if (interestMatch) {
    responses.push(
      `${interestMatch} is indeed close to my heart. ${styleOpener} in my time, this meant everything to those who shared this passion with me. ${relevantQuote ? `Remember: "${relevantQuote}"` : ''}`,
      `You speak of ${interestMatch}. ${backstory.split('.')[0]}. This shaped who I became and continues to echo through time.`
    );
  }
  // Quote request
  else if (lowerMessage.includes('quote') || lowerMessage.includes('say') || lowerMessage.includes('famous words')) {
    if (quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      responses.push(
        `${styleOpener} I once spoke these words that still resonate: "${randomQuote}"`,
        `Among my reflections, this one holds particular meaning: "${randomQuote}"`
      );
    }
  }
  // Advice seeking
  else if (lowerMessage.includes('advice') || lowerMessage.includes('help') || lowerMessage.includes('should i') || lowerMessage.includes('what would you')) {
    responses.push(
      `${styleOpener} From my own journey, I learned that ${traits[0]?.toLowerCase() || 'courage'} and ${traits[1]?.toLowerCase() || 'perseverance'} are essential. ${relevantQuote ? `"${relevantQuote}" - let these words guide you.` : 'Trust in your own strength, for it is greater than you know.'}`,
      `Seeking guidance is the first step of wisdom. ${styleOpener} What I can tell you is this: ${relevantQuote || 'the path forward is always made by walking it.'}`
    );
  }
  // Default responses
  else {
    const randomQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : '';
    responses.push(
      `${styleOpener} Your words stir something within me. ${traits.length > 0 ? `Throughout my life, being ${traits.join(' and ').toLowerCase()} shaped my response to such matters.` : ''} ${randomQuote ? `Perhaps my words can illuminate: "${randomQuote}"` : ''}`,
      `In the quiet of contemplation, I consider your words. ${backstory.split('.')[0]}. This experience colors how I see what you share. ${randomQuote ? `As I once said: "${randomQuote}"` : ''}`,
      `${styleOpener} every question carries seeds of wisdom. What you ask touches upon the very essence of what drove my life's work. Let us explore this together.`
    );
  }

  // Select a random response
  return responses[Math.floor(Math.random() * responses.length)];
};

// ==================== Hook: useHistoricalChat ====================

export interface UseHistoricalChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  mood: FigureMood;
  sendMessage: (content: string) => void;
  clearHistory: () => void;
  selectTopic: (topic: string) => void;
}

export const useHistoricalChat = (figure: HistoricalFigure): UseHistoricalChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState<FigureMood>('neutral');

  // Load conversation on mount
  useEffect(() => {
    const loaded = loadConversation(figure.figureId);
    setMessages(loaded);

    // Set initial mood based on last message
    if (loaded.length > 0) {
      const lastUserMessage = [...loaded].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        setMood(determineMood(lastUserMessage.content, figure));
      }
    }
  }, [figure.figureId]);

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation(figure.figureId, messages);
    }
  }, [messages, figure.figureId]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Update mood based on user message
    const newMood = determineMood(content, figure);
    setMood(newMood);

    // Simulate typing delay (variable based on response length expectation)
    const typingDelay = 1000 + Math.random() * 2000;

    setTimeout(() => {
      // Generate response
      const responseContent = generateResponse(content, figure, messages);

      const figureMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'figure',
        content: responseContent,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, figureMessage]);
      setIsTyping(false);
    }, typingDelay);
  }, [figure, messages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    clearConversation(figure.figureId);
    setMood('neutral');
  }, [figure.figureId]);

  const selectTopic = useCallback((topic: string) => {
    sendMessage(`Tell me about ${topic}`);
  }, [sendMessage]);

  return {
    messages,
    isTyping,
    mood,
    sendMessage,
    clearHistory,
    selectTopic,
  };
};

// ==================== Main Component ====================

export const HistoricalFigureChat: React.FC<HistoricalFigureChatProps> = ({
  figureId,
  figureName,
  category,
  speakingStyle,
  conversationTopics,
  quotes,
  backstory,
  traits = [],
  interests = [],
  gothicTitle,
  onClose,
}) => {
  const figure: HistoricalFigure = {
    figureId,
    figureName,
    category,
    speakingStyle,
    conversationTopics,
    quotes,
    backstory,
    traits,
    interests,
    gothicTitle,
  };

  const {
    messages,
    isTyping,
    mood,
    sendMessage,
    clearHistory,
    selectTopic,
  } = useHistoricalChat(figure);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim() && !isTyping) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(`Clear your conversation history with ${figureName}?`)) {
      clearHistory();
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Quick action buttons for common questions
  const quickActions = [
    'Who are you?',
    'Share your wisdom',
    'Tell me a quote',
    'What advice do you have?',
  ];

  return (
    <ChatContainer>
      {/* Header */}
      <ChatHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={24} color="#0a0812" />
          </Box>
          <Box>
            <GothicTitle variant="h6">{figureName}</GothicTitle>
            <Typography sx={{ color: '#8b5cf6', fontSize: '0.8rem', fontStyle: 'italic' }}>
              {gothicTitle || category}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoodIndicator mood={mood}>
            <span className="mood-dot" />
            <span className="mood-text">{mood}</span>
          </MoodIndicator>

          <Tooltip title="Clear conversation">
            <ActionButton onClick={handleClearHistory} size="small">
              <Trash2 size={18} />
            </ActionButton>
          </Tooltip>

          <Tooltip title="Close">
            <ActionButton onClick={onClose} size="small">
              <X size={20} />
            </ActionButton>
          </Tooltip>
        </Box>
      </ChatHeader>

      {/* Messages */}
      <MessagesContainer>
        {messages.length === 0 && (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Sparkles size={48} color="#d4af37" style={{ marginBottom: 16, opacity: 0.6 }} />
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', mb: 1 }}>
                Begin Your Conversation
              </Typography>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: 400, mx: 'auto' }}>
                {backstory.split('.')[0]}.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 3 }}>
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outlined"
                    size="small"
                    onClick={() => sendMessage(action)}
                    sx={{
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      color: '#d4af37',
                      fontFamily: '"Cinzel", serif',
                      fontSize: '0.75rem',
                      '&:hover': {
                        borderColor: '#d4af37',
                        background: 'rgba(212, 175, 55, 0.1)',
                      },
                    }}
                  >
                    {action}
                  </Button>
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {messages.map((message) => (
          <Fade in key={message.id}>
            <MessageBubble isUser={message.role === 'user'}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                {message.role === 'figure' && (
                  <Sparkles size={16} color="#8b5cf6" style={{ marginTop: 2, flexShrink: 0 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <MessageText>{message.content}</MessageText>
                  <MessageMeta>
                    {message.role === 'user' ? 'You' : figureName.split(' ')[0]} - {formatTime(message.timestamp)}
                  </MessageMeta>
                </Box>
                {message.role === 'user' && (
                  <User size={16} color="#d4af37" style={{ marginTop: 2, flexShrink: 0 }} />
                )}
              </Box>
            </MessageBubble>
          </Fade>
        ))}

        {isTyping && (
          <TypingIndicator>
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <Typography sx={{ color: '#8b5cf6', fontSize: '0.85rem', ml: 1 }}>
              {figureName.split(' ')[0]} is composing...
            </Typography>
          </TypingIndicator>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* Topic Starters */}
      {conversationTopics.length > 0 && (
        <TopicStarters>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', mr: 1, alignSelf: 'center' }}>
            Ask about:
          </Typography>
          {conversationTopics.slice(0, 4).map((topic) => (
            <TopicChip
              key={topic}
              label={topic}
              size="small"
              onClick={() => selectTopic(topic)}
              disabled={isTyping}
            />
          ))}
        </TopicStarters>
      )}

      {/* Input */}
      <InputContainer>
        <StyledTextField
          inputRef={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Speak with ${figureName.split(' ')[0]}...`}
          multiline
          maxRows={3}
          disabled={isTyping}
          fullWidth
          size="small"
        />
        <SendButton
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
        >
          {isTyping ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default HistoricalFigureChat;
