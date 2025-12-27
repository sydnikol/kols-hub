import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Collapse,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Sparkles,
  Eye,
  Search,
  BookOpen,
  Moon,
  Star,
  Wand2,
  Scroll,
  Brain,
  Heart,
} from 'lucide-react';
import { dreamSymbols, detectSymbolsInText, getSymbolById, dreamSymbolCategories, DreamSymbol } from '../../data/dream_symbols';

// ============ ANIMATIONS ============
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ============ STYLED COMPONENTS ============
const InterpreterContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #0d0a1a 50%, #1a0d1a 100%)',
  padding: '24px',
  position: 'relative',
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #c0c0c0 0%, #a78bfa 30%, #8b5cf6 60%, #c0c0c0 100%)',
  backgroundSize: '200% auto',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
  animation: `${shimmer} 4s linear infinite`,
});

const InputCard = styled(Card)({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '20px',
  animation: `${glow} 4s ease-in-out infinite`,
});

const SymbolCard = styled(Card)<{ color?: string }>(({ color }) => ({
  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
  border: `1px solid ${color}40`,
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 32px ${color}30`,
  },
}));

const InterpretationBox = styled(Box)({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
  border: '1px solid rgba(192, 192, 192, 0.3)',
  borderRadius: '16px',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #8b5cf6, #c0c0c0, #8b5cf6)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s linear infinite`,
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(139, 92, 246, 0.05)',
    borderRadius: '16px',
    color: '#e9d5ff',
    fontSize: '1.1rem',
    lineHeight: 1.8,
    '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
    '&:hover fieldset': { borderColor: '#8b5cf6' },
    '&.Mui-focused fieldset': { borderColor: '#c0c0c0' },
  },
  '& .MuiInputLabel-root': { color: '#a78bfa' },
});

const MysticButton = styled(Button)({
  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
  },
});

// ============ TYPES ============
interface DetectedSymbol {
  symbol: DreamSymbol;
  relevance: number;
}

interface Interpretation {
  overall: string;
  symbols: DetectedSymbol[];
  themes: string[];
  advice: string;
  moonInfluence?: string;
}

// ============ HELPER FUNCTIONS ============
const getCategoryColor = (category: string): string => {
  const cat = dreamSymbolCategories.find(c => c.id === category);
  return cat?.color || '#8b5cf6';
};

const generateMysticInterpretation = (symbols: DetectedSymbol[]): Interpretation => {
  const themes: string[] = [];
  const overallParts: string[] = [];

  // Analyze primary themes
  const categories = symbols.map(s => s.symbol.category);
  const categoryCount: Record<string, number> = {};
  categories.forEach(c => {
    categoryCount[c] = (categoryCount[c] || 0) + 1;
  });

  // Generate themes based on categories
  if (categoryCount['animals'] >= 2) {
    themes.push('Instinctual Wisdom');
    overallParts.push('The creatures of your dream speak of primal knowledge stirring within.');
  }
  if (categoryCount['nature'] >= 2) {
    themes.push('Natural Forces');
    overallParts.push('The elements themselves have messages for you, forces beyond mortal control.');
  }
  if (categoryCount['people'] >= 2) {
    themes.push('Relationships & Self');
    overallParts.push('The figures in your dream represent aspects of your psyche or connections with others.');
  }
  if (categoryCount['objects'] >= 2) {
    themes.push('Tools of Transformation');
    overallParts.push('The objects you encountered are keys to locked doors within yourself.');
  }
  if (categoryCount['actions'] >= 2) {
    themes.push('Movement & Change');
    overallParts.push('Your dream actions reflect how you navigate life\'s challenges.');
  }
  if (categoryCount['places'] >= 2) {
    themes.push('Inner Landscapes');
    overallParts.push('The places you visited are territories within your own consciousness.');
  }
  if (categoryCount['colors'] >= 2) {
    themes.push('Emotional Spectrum');
    overallParts.push('The colors paint the emotional tone of your unconscious message.');
  }
  if (categoryCount['numbers'] >= 2) {
    themes.push('Sacred Numerology');
    overallParts.push('Numbers carry vibrations and hidden meanings in the dream realm.');
  }

  // Add default themes if few detected
  if (themes.length === 0) {
    themes.push('Personal Revelation');
    overallParts.push('Your dream contains personal symbols that speak directly to your soul.');
  }

  // Generate advice based on dominant meanings
  const allMeanings = symbols.flatMap(s => s.symbol.meanings);
  const adviceParts: string[] = [];

  if (allMeanings.includes('Transformation') || allMeanings.includes('Change')) {
    adviceParts.push('Embrace the changes coming to your life; resistance only prolongs the transition.');
  }
  if (allMeanings.includes('Fear') || allMeanings.includes('Anxiety')) {
    adviceParts.push('Face what you have been avoiding; the shadow loses power when confronted.');
  }
  if (allMeanings.includes('Freedom') || allMeanings.includes('Liberation')) {
    adviceParts.push('Your spirit yearns to break free; consider what cages you have built around yourself.');
  }
  if (allMeanings.includes('Healing') || allMeanings.includes('Recovery')) {
    adviceParts.push('Allow yourself time to heal; the dream world offers restoration the waking world cannot.');
  }
  if (allMeanings.includes('Wisdom') || allMeanings.includes('Knowledge')) {
    adviceParts.push('Seek the knowledge that has been calling to you; your unconscious knows what you need to learn.');
  }

  if (adviceParts.length === 0) {
    adviceParts.push('Meditate on the symbols that appeared; their meaning will unfold in time.');
  }

  return {
    overall: overallParts.join(' '),
    symbols,
    themes,
    advice: adviceParts.join(' '),
    moonInfluence: 'The current moon phase amplifies the prophetic nature of your dream.',
  };
};

// ============ MAIN COMPONENT ============
export const DreamInterpreter: React.FC = () => {
  const [dreamText, setDreamText] = useState('');
  const [detectedSymbols, setDetectedSymbols] = useState<DetectedSymbol[]>([]);
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Auto-detect symbols as user types
  useEffect(() => {
    if (dreamText.length > 10) {
      const symbolIds = detectSymbolsInText(dreamText);
      const detected: DetectedSymbol[] = symbolIds
        .map(id => {
          const symbol = getSymbolById(id);
          if (!symbol) return null;
          return { symbol, relevance: calculateRelevance(dreamText, symbol) };
        })
        .filter((s): s is DetectedSymbol => s !== null)
        .sort((a, b) => b.relevance - a.relevance);
      setDetectedSymbols(detected);
    } else {
      setDetectedSymbols([]);
    }
  }, [dreamText]);

  const calculateRelevance = (text: string, symbol: DreamSymbol): number => {
    const lowerText = text.toLowerCase();
    let score = 0;

    // Check for symbol name
    if (lowerText.includes(symbol.name.toLowerCase())) score += 3;

    // Check for meanings
    symbol.meanings.forEach(meaning => {
      if (lowerText.includes(meaning.toLowerCase())) score += 1;
    });

    return score;
  };

  const analyzeAndInterpret = () => {
    if (detectedSymbols.length === 0) return;

    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate mystical analysis delay
    setTimeout(() => {
      const interp = generateMysticInterpretation(detectedSymbols);
      setInterpretation(interp);
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const clearAll = () => {
    setDreamText('');
    setDetectedSymbols([]);
    setInterpretation(null);
    setShowResults(false);
  };

  return (
    <InterpreterContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <GothicTitle variant="h3">Dream Interpreter</GothicTitle>
        <Typography sx={{ color: '#a78bfa', fontSize: '1.1rem', mt: 1 }}>
          Unveil the hidden meanings within your nocturnal visions
        </Typography>
      </Box>

      {/* Input Section */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <InputCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Scroll size={24} color="#c0c0c0" />
              <Typography sx={{ color: '#e9d5ff', fontSize: '1.2rem', fontFamily: '"Cinzel", serif' }}>
                Describe Your Dream
              </Typography>
            </Box>

            <StyledTextField
              multiline
              rows={6}
              fullWidth
              placeholder="Enter the details of your dream... Include imagery, feelings, people, places, and actions you remember..."
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
            />

            {/* Live Symbol Detection */}
            {detectedSymbols.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Search size={18} color="#a78bfa" />
                  <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
                    {detectedSymbols.length} symbol{detectedSymbols.length !== 1 ? 's' : ''} detected
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {detectedSymbols.slice(0, 10).map(({ symbol }) => (
                    <Chip
                      key={symbol.id}
                      label={symbol.name}
                      sx={{
                        background: `${getCategoryColor(symbol.category)}20`,
                        color: getCategoryColor(symbol.category),
                        border: `1px solid ${getCategoryColor(symbol.category)}40`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
              <MysticButton
                startIcon={<Wand2 size={18} />}
                onClick={analyzeAndInterpret}
                disabled={detectedSymbols.length === 0 || isAnalyzing}
              >
                {isAnalyzing ? 'Consulting the Spirits...' : 'Interpret Dream'}
              </MysticButton>
              <Button
                variant="outlined"
                onClick={clearAll}
                sx={{
                  borderColor: 'rgba(192, 192, 192, 0.3)',
                  color: '#c0c0c0',
                  '&:hover': { borderColor: '#c0c0c0' },
                }}
              >
                Clear
              </Button>
            </Box>

            {isAnalyzing && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress
                  sx={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #8b5cf6, #c0c0c0)',
                    },
                  }}
                />
                <Typography sx={{ color: '#a78bfa', textAlign: 'center', mt: 2, fontStyle: 'italic' }}>
                  The oracle peers into the depths of your dream...
                </Typography>
              </Box>
            )}
          </CardContent>
        </InputCard>
      </Box>

      {/* Results Section */}
      <Collapse in={showResults && interpretation !== null}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          {/* Overall Interpretation */}
          <InterpretationBox sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Moon size={28} color="#c0c0c0" style={{ animation: `${float} 3s ease-in-out infinite` }} />
              <Typography sx={{ color: '#e9d5ff', fontSize: '1.4rem', fontFamily: '"Cinzel", serif' }}>
                The Oracle Speaks
              </Typography>
            </Box>

            <Typography sx={{
              color: '#c4b5fd',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              fontStyle: 'italic',
              borderLeft: '3px solid #8b5cf6',
              pl: 2,
              mb: 3,
            }}>
              "{interpretation?.overall}"
            </Typography>

            {/* Themes */}
            {interpretation?.themes && interpretation.themes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem', mb: 1 }}>
                  Primary Themes
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {interpretation.themes.map((theme, i) => (
                    <Chip
                      key={i}
                      label={theme}
                      icon={<Star size={14} />}
                      sx={{
                        background: 'rgba(192, 192, 192, 0.2)',
                        color: '#c0c0c0',
                        border: '1px solid rgba(192, 192, 192, 0.3)',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Advice */}
            <Box sx={{
              p: 2,
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Brain size={18} color="#a78bfa" />
                <Typography sx={{ color: '#a78bfa', fontWeight: 600 }}>Guidance</Typography>
              </Box>
              <Typography sx={{ color: '#c4b5fd' }}>
                {interpretation?.advice}
              </Typography>
            </Box>
          </InterpretationBox>

          {/* Symbol Breakdown */}
          <Typography sx={{
            color: '#e9d5ff',
            fontSize: '1.3rem',
            fontFamily: '"Cinzel", serif',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <BookOpen size={24} color="#c0c0c0" />
            Symbol Interpretations
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 3,
          }}>
            {interpretation?.symbols.map(({ symbol }) => (
              <SymbolCard key={symbol.id} color={getCategoryColor(symbol.category)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{
                      background: `${getCategoryColor(symbol.category)}30`,
                      width: 48,
                      height: 48,
                    }}>
                      <Eye size={24} color={getCategoryColor(symbol.category)} />
                    </Avatar>
                    <Box>
                      <Typography sx={{
                        color: '#e9d5ff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        fontFamily: '"Cinzel", serif',
                      }}>
                        {symbol.name}
                      </Typography>
                      <Chip
                        label={symbol.category}
                        size="small"
                        sx={{
                          background: `${getCategoryColor(symbol.category)}20`,
                          color: getCategoryColor(symbol.category),
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem', mb: 0.5 }}>
                      Common Meanings
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {symbol.meanings.map((meaning, i) => (
                        <Chip
                          key={i}
                          label={meaning}
                          size="small"
                          sx={{
                            background: 'rgba(139, 92, 246, 0.15)',
                            color: '#c4b5fd',
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.2)', my: 2 }} />

                  <Box sx={{
                    p: 2,
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Sparkles size={14} color="#c0c0c0" />
                      <Typography sx={{ color: '#c0c0c0', fontSize: '0.8rem', fontWeight: 600 }}>
                        Gothic Interpretation
                      </Typography>
                    </Box>
                    <Typography sx={{
                      color: '#a78bfa',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                    }}>
                      {symbol.gothicInterpretation}
                    </Typography>
                  </Box>

                  {symbol.contexts.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography sx={{ color: '#6366f1', fontSize: '0.8rem', mb: 0.5 }}>
                        Context Variations
                      </Typography>
                      <Typography sx={{ color: '#818cf8', fontSize: '0.8rem' }}>
                        {symbol.contexts[0]}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </SymbolCard>
            ))}
          </Box>

          {/* Category Legend */}
          <Box sx={{
            mt: 4,
            p: 3,
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}>
            <Typography sx={{ color: '#a78bfa', mb: 2, fontWeight: 600 }}>
              Symbol Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {dreamSymbolCategories.map(cat => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  sx={{
                    background: `${cat.color}20`,
                    color: cat.color,
                    border: `1px solid ${cat.color}40`,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Empty State */}
      {!showResults && !isAnalyzing && dreamText.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, maxWidth: 600, mx: 'auto' }}>
          <Eye size={64} color="#8b5cf6" style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography sx={{ color: '#a78bfa', fontSize: '1.1rem', mb: 2 }}>
            Enter your dream description above
          </Typography>
          <Typography sx={{ color: '#6366f1', fontSize: '0.9rem' }}>
            The more detail you provide, the richer your interpretation will be.
            Include feelings, colors, people, and places you remember.
          </Typography>
        </Box>
      )}
    </InterpreterContainer>
  );
};

export default DreamInterpreter;
