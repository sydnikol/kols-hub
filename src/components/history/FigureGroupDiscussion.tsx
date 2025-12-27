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
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Send,
  X,
  Trash2,
  Sparkles,
  Users,
  User,
  RefreshCw,
  Plus,
  Minus,
} from 'lucide-react';

// ==================== Types ====================

interface VoiceSettings {
  pitch: string;
  pace: string;
  accent: string;
}

export interface HistoricalFigureData {
  id: string;
  name: string;
  gothicTitle: string;
  category: string;
  years: string;
  traits: string[];
  speakingStyle: string;
  interests: string[];
  backstory: string;
  appearanceStyle?: string;
  avatarDescription?: string;
  conversationTopics: string[];
  quotes: string[];
  voiceSettings?: VoiceSettings;
}

export interface GroupMessage {
  id: string;
  role: 'user' | 'figure';
  figureId?: string;
  figureName?: string;
  content: string;
  timestamp: number;
}

export interface FigureGroupDiscussionProps {
  figures: HistoricalFigureData[];
  onClose: () => void;
}

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

// ==================== Styled Components ====================

const DiscussionContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '600px',
  maxHeight: '85vh',
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

const Header = styled(Box)({
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

const ParticipantsPanel = styled(Box)({
  padding: '12px 20px',
  background: 'rgba(139, 92, 246, 0.1)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
  maxHeight: '200px',
  overflowY: 'auto',
  zIndex: 1,
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(139, 92, 246, 0.3)',
    borderRadius: '2px',
  },
});

const ParticipantChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  margin: '4px',
  background: selected
    ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
    : 'rgba(139, 92, 246, 0.2)',
  color: selected ? '#fff' : '#a78bfa',
  border: `1px solid ${selected ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
      : 'rgba(139, 92, 246, 0.3)',
  },
}));

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

const MessageBubble = styled(Box)<{ isUser: boolean; figureColor?: string }>(({ isUser, figureColor }) => ({
  maxWidth: '85%',
  padding: '14px 18px',
  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  background: isUser
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(180, 140, 40, 0.2) 100%)'
    : `linear-gradient(135deg, ${figureColor || 'rgba(139, 92, 246, 0.2)'} 0%, ${figureColor || 'rgba(124, 58, 237, 0.15)'} 100%)`,
  border: isUser
    ? '1px solid rgba(212, 175, 55, 0.4)'
    : `1px solid ${figureColor || 'rgba(139, 92, 246, 0.3)'}`,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  animation: `${fadeIn} 0.3s ease-out`,
  position: 'relative',
}));

const FigureLabel = styled(Typography)({
  color: '#d4af37',
  fontSize: '0.75rem',
  fontWeight: 600,
  fontFamily: '"Cinzel", serif',
  marginBottom: '4px',
});

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

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Black Liberation': '#8b5cf6',
    'LGBTQ+ Pioneers': '#ec4899',
    'Latinx Legends': '#f59e0b',
    'Indigenous Ancestors': '#10b981',
    'Disability Rights': '#3b82f6',
    'Feminist Icons': '#f43f5e',
    'Artists & Writers': '#a855f7',
    'Asian Trailblazers': '#ef4444',
  };
  return colors[category] || '#d4af37';
};

const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate a response from a figure based on their personality
const generateFigureResponse = (
  figure: HistoricalFigureData,
  userMessage: string,
  previousMessages: GroupMessage[],
  otherParticipants: HistoricalFigureData[]
): string => {
  const lowerMessage = userMessage.toLowerCase();
  const { quotes, speakingStyle, backstory, traits = [], interests = [], conversationTopics = [] } = figure;

  // Style patterns based on speaking style
  const stylePatterns: Record<string, string[]> = {
    'Direct': ['I tell you plainly:', 'Let me be clear:', 'The truth is:'],
    'Poetic': ['Like a river finding its way,', 'In the tapestry of time,', 'As stars guide the wanderer,'],
    'Warm': ['My dear friends,', 'Let me share with you,', 'With warmth in my heart,'],
    'Measured': ['Upon reflection,', 'Consider this carefully:', 'In my experience,'],
    'Passionate': ['With fire in my soul,', 'I say with all my being,', 'This burns within me:'],
    'Wise': ['Wisdom teaches us that', 'In the fullness of time, one learns', 'The ancestors knew that'],
    'Fierce': ['I will not mince words:', 'Stand firm and know this:', 'With unwavering conviction:'],
  };

  let styleOpener = '';
  for (const [style, openers] of Object.entries(stylePatterns)) {
    if (speakingStyle.toLowerCase().includes(style.toLowerCase())) {
      styleOpener = openers[Math.floor(Math.random() * openers.length)];
      break;
    }
  }

  // Check for relevant quote
  let relevantQuote = '';
  for (const quote of quotes) {
    const quoteWords = quote.toLowerCase().split(' ');
    const messageWords = lowerMessage.split(' ');
    if (quoteWords.some(word => word.length > 3 && messageWords.some(mw => mw.includes(word)))) {
      relevantQuote = quote;
      break;
    }
  }

  // Check if topic relates to interests
  const topicMatch = interests.find(interest =>
    lowerMessage.includes(interest.toLowerCase())
  ) || conversationTopics.find(topic =>
    lowerMessage.toLowerCase().includes(topic.toLowerCase().split(' ')[0])
  );

  // Build response
  const responses: string[] = [];

  // Reference to other participants if applicable
  const otherNames = otherParticipants
    .filter(p => p.id !== figure.id)
    .map(p => p.name.split(' ')[0]);

  const mayReferenceOthers = Math.random() > 0.6 && otherNames.length > 0;
  const randomOther = otherNames[Math.floor(Math.random() * otherNames.length)];

  if (topicMatch) {
    responses.push(
      `${styleOpener} speaking of ${topicMatch}, this is close to my heart. ${mayReferenceOthers ? `I wonder what ${randomOther} thinks of this. ` : ''}${relevantQuote ? `As I once said: "${relevantQuote}"` : ''}`,
      `This touches on ${topicMatch}. ${backstory.split('.')[0]}. ${relevantQuote ? `"${relevantQuote}" - these words still guide me.` : ''}`
    );
  } else if (lowerMessage.includes('agree') || lowerMessage.includes('think')) {
    responses.push(
      `${styleOpener} ${traits.length > 0 ? `Being ${traits[0].toLowerCase()}, ` : ''}I believe we must consider all perspectives. ${mayReferenceOthers ? `${randomOther} raises important points. ` : ''}${relevantQuote ? `Remember: "${relevantQuote}"` : ''}`,
      `In my journey, I learned that ${traits.join(' and ').toLowerCase()} are essential. ${styleOpener} we must hold these truths together.`
    );
  } else {
    const randomQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : '';
    responses.push(
      `${styleOpener} ${traits.length > 0 ? `Throughout my life, being ${traits.slice(0, 2).join(' and ').toLowerCase()} shaped my response to such matters. ` : ''}${mayReferenceOthers ? `I find myself agreeing with ${randomOther} on this. ` : ''}${randomQuote ? `"${randomQuote}"` : ''}`,
      `${backstory.split('.')[0]}. ${styleOpener} this experience colors how I see what we discuss today.`
    );
  }

  return responses[Math.floor(Math.random() * responses.length)];
};

// ==================== Main Component ====================

export const FigureGroupDiscussion: React.FC<FigureGroupDiscussionProps> = ({
  figures,
  onClose,
}) => {
  const [selectedFigures, setSelectedFigures] = useState<string[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingFigure, setCurrentTypingFigure] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleFigure = (figureId: string) => {
    setSelectedFigures(prev =>
      prev.includes(figureId)
        ? prev.filter(id => id !== figureId)
        : [...prev, figureId]
    );
  };

  const getSelectedFigureData = useCallback((): HistoricalFigureData[] => {
    return figures.filter(f => selectedFigures.includes(f.id));
  }, [figures, selectedFigures]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isTyping || selectedFigures.length === 0) return;

    // Add user message
    const userMessage: GroupMessage = {
      id: generateMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const selectedFigureData = getSelectedFigureData();

    // Generate responses from each selected figure with staggered timing
    selectedFigureData.forEach((figure, index) => {
      const delay = 1500 + (index * 2000) + Math.random() * 1000;

      setTimeout(() => {
        setCurrentTypingFigure(figure.name);

        setTimeout(() => {
          const response = generateFigureResponse(
            figure,
            inputValue,
            messages,
            selectedFigureData
          );

          const figureMessage: GroupMessage = {
            id: generateMessageId(),
            role: 'figure',
            figureId: figure.id,
            figureName: figure.name,
            content: response,
            timestamp: Date.now(),
          };

          setMessages(prev => [...prev, figureMessage]);

          // Clear typing state after last figure responds
          if (index === selectedFigureData.length - 1) {
            setIsTyping(false);
            setCurrentTypingFigure(null);
          }
        }, 1000 + Math.random() * 1000);
      }, delay);
    });
  }, [inputValue, isTyping, selectedFigures, messages, getSelectedFigureData]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear the group discussion history?')) {
      setMessages([]);
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFigureColor = (figureId?: string): string => {
    if (!figureId) return 'rgba(139, 92, 246, 0.2)';
    const figure = figures.find(f => f.id === figureId);
    if (!figure) return 'rgba(139, 92, 246, 0.2)';
    const color = getCategoryColor(figure.category);
    return `${color}30`;
  };

  return (
    <DiscussionContainer>
      {/* Header */}
      <Header>
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
            <Users size={24} color="#0a0812" />
          </Box>
          <Box>
            <GothicTitle variant="h6">Group Discussion</GothicTitle>
            <Typography sx={{ color: '#8b5cf6', fontSize: '0.8rem' }}>
              {selectedFigures.length} participant{selectedFigures.length !== 1 ? 's' : ''} selected
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Clear discussion">
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
      </Header>

      {/* Participants Panel */}
      <ParticipantsPanel>
        <Typography sx={{ color: '#d4af37', fontSize: '0.8rem', mb: 1, fontFamily: '"Cinzel", serif' }}>
          Select Historical Figures to Join the Discussion:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {figures.slice(0, 20).map((figure) => (
            <ParticipantChip
              key={figure.id}
              label={figure.name}
              size="small"
              selected={selectedFigures.includes(figure.id)}
              onClick={() => toggleFigure(figure.id)}
              icon={selectedFigures.includes(figure.id) ? <Minus size={14} /> : <Plus size={14} />}
            />
          ))}
        </Box>
        {figures.length > 20 && (
          <Typography sx={{ color: '#9ca3af', fontSize: '0.75rem', mt: 1 }}>
            Showing first 20 figures. Select up to 5 for best discussion experience.
          </Typography>
        )}
      </ParticipantsPanel>

      {/* Messages */}
      <MessagesContainer>
        {messages.length === 0 && (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Users size={48} color="#d4af37" style={{ marginBottom: 16, opacity: 0.6 }} />
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', mb: 1 }}>
                Start a Group Discussion
              </Typography>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: 500, mx: 'auto' }}>
                Select historical figures above and pose a question or topic. Watch as they share their perspectives and engage with each other's ideas.
              </Typography>
            </Box>
          </Fade>
        )}

        {messages.map((message) => (
          <Fade in key={message.id}>
            <MessageBubble
              isUser={message.role === 'user'}
              figureColor={getFigureColor(message.figureId)}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                {message.role === 'figure' && (
                  <Sparkles size={16} color="#8b5cf6" style={{ marginTop: 2, flexShrink: 0 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  {message.role === 'figure' && message.figureName && (
                    <FigureLabel>{message.figureName}</FigureLabel>
                  )}
                  <MessageText>{message.content}</MessageText>
                  <MessageMeta>
                    {message.role === 'user' ? 'You' : message.figureName?.split(' ')[0]} - {formatTime(message.timestamp)}
                  </MessageMeta>
                </Box>
                {message.role === 'user' && (
                  <User size={16} color="#d4af37" style={{ marginTop: 2, flexShrink: 0 }} />
                )}
              </Box>
            </MessageBubble>
          </Fade>
        ))}

        {isTyping && currentTypingFigure && (
          <TypingIndicator>
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            <Typography sx={{ color: '#8b5cf6', fontSize: '0.85rem', ml: 1 }}>
              {currentTypingFigure} is composing...
            </Typography>
          </TypingIndicator>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* Input */}
      <InputContainer>
        <StyledTextField
          inputRef={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            selectedFigures.length === 0
              ? 'Select participants above to begin...'
              : `Ask ${selectedFigures.length} figure${selectedFigures.length !== 1 ? 's' : ''} a question...`
          }
          multiline
          maxRows={3}
          disabled={isTyping || selectedFigures.length === 0}
          fullWidth
          size="small"
        />
        <SendButton
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping || selectedFigures.length === 0}
        >
          {isTyping ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
        </SendButton>
      </InputContainer>
    </DiscussionContainer>
  );
};

export default FigureGroupDiscussion;
