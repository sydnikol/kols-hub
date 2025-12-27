// OracleCards.tsx
// 50 custom oracle cards with affirmation-style messages

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box, Typography, Chip, IconButton, Tooltip, Dialog, DialogContent
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Sparkles, Heart, Briefcase, Brain, Leaf, Sunrise, Star, Moon, Sun,
  Shuffle, RotateCcw, X, BookOpen, Clock, Calendar, Flame, Droplets,
  Wind, Mountain, Feather, Eye, Shield, Compass, Crown, Gem, Key,
  Flower2, Bird, Butterfly, TreePine, Waves, Cloud, Lightning, Rainbow
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.3); }
  50% { box-shadow: 0 0 60px rgba(236, 72, 153, 0.6); }
`;

const flipIn = keyframes`
  0% { transform: rotateY(180deg) scale(0.8); opacity: 0; }
  50% { transform: rotateY(90deg) scale(0.9); }
  100% { transform: rotateY(0deg) scale(1); opacity: 1; }
`;

const pulseGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 10px currentColor); }
  50% { filter: drop-shadow(0 0 25px currentColor); }
`;

// Types
export type OracleCategory = 'love' | 'career' | 'spiritual' | 'growth' | 'healing';

export interface OracleCard {
  id: string;
  name: string;
  affirmation: string;
  message: string;
  category: OracleCategory;
  keywords: string[];
  guidance: string;
  symbol: React.ReactNode;
  colorGradient: string;
}

// Category configuration
const categoryConfig: Record<OracleCategory, {
  name: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}> = {
  love: {
    name: 'Love',
    color: '#ec4899',
    icon: <Heart size={18} />,
    description: 'Matters of the heart, relationships, and self-love'
  },
  career: {
    name: 'Career',
    color: '#f59e0b',
    icon: <Briefcase size={18} />,
    description: 'Work, success, purpose, and ambition'
  },
  spiritual: {
    name: 'Spiritual',
    color: '#8b5cf6',
    icon: <Sparkles size={18} />,
    description: 'Soul growth, intuition, and divine connection'
  },
  growth: {
    name: 'Growth',
    color: '#10b981',
    icon: <Leaf size={18} />,
    description: 'Personal development and transformation'
  },
  healing: {
    name: 'Healing',
    color: '#3b82f6',
    icon: <Droplets size={18} />,
    description: 'Emotional and physical restoration'
  }
};

// 50 Oracle Cards
const oracleCards: OracleCard[] = [
  // Love Category (10 cards)
  {
    id: 'love-1',
    name: 'Unconditional Love',
    affirmation: 'I am worthy of deep, authentic love.',
    message: 'Love flows to you like a river to the sea. Open your heart without conditions, and you will find that love has been waiting for you all along.',
    category: 'love',
    keywords: ['acceptance', 'worth', 'openness'],
    guidance: 'Practice self-compassion today. The love you seek begins within.',
    symbol: <Heart size={40} />,
    colorGradient: 'linear-gradient(135deg, #ec4899, #f472b6)'
  },
  {
    id: 'love-2',
    name: 'Sacred Union',
    affirmation: 'I attract relationships that honor my soul.',
    message: 'True partnership is two whole beings choosing to walk together. You do not need another to complete you—you seek one to complement you.',
    category: 'love',
    keywords: ['partnership', 'balance', 'harmony'],
    guidance: 'Reflect on what you truly desire in partnership. Be specific in your intentions.',
    symbol: <Moon size={40} />,
    colorGradient: 'linear-gradient(135deg, #a855f7, #ec4899)'
  },
  {
    id: 'love-3',
    name: 'Forgiveness',
    affirmation: 'I release old wounds and welcome new beginnings.',
    message: 'Forgiveness is not for them—it is for you. Release the chains of the past and set your heart free to love again.',
    category: 'love',
    keywords: ['release', 'healing', 'freedom'],
    guidance: 'Write a letter of forgiveness (you need not send it) to release what burdens your heart.',
    symbol: <Feather size={40} />,
    colorGradient: 'linear-gradient(135deg, #f472b6, #fca5a5)'
  },
  {
    id: 'love-4',
    name: 'Self-Romance',
    affirmation: 'I cherish and nurture myself with tender care.',
    message: 'Treat yourself as you would your most beloved. You are deserving of the flowers, the sweet words, the gentle touches you give so freely to others.',
    category: 'love',
    keywords: ['self-love', 'nurturing', 'care'],
    guidance: 'Plan a date with yourself. Do something that brings you pure joy.',
    symbol: <Flower2 size={40} />,
    colorGradient: 'linear-gradient(135deg, #ec4899, #e879f9)'
  },
  {
    id: 'love-5',
    name: 'Open Heart',
    affirmation: 'I courageously open my heart to love\'s possibilities.',
    message: 'A closed heart is safe but lonely. Take the risk of being seen, of being known. The magic happens when we dare to be vulnerable.',
    category: 'love',
    keywords: ['vulnerability', 'courage', 'openness'],
    guidance: 'Share something authentic with someone you trust today.',
    symbol: <Sunrise size={40} />,
    colorGradient: 'linear-gradient(135deg, #fb7185, #fda4af)'
  },
  {
    id: 'love-6',
    name: 'Divine Connection',
    affirmation: 'My soulful connections are divinely guided.',
    message: 'The universe conspires to bring kindred spirits together. Trust the timing, trust the path. Your people are finding their way to you.',
    category: 'love',
    keywords: ['destiny', 'connection', 'trust'],
    guidance: 'Notice the synchronicities around you—they are signposts on your path.',
    symbol: <Star size={40} />,
    colorGradient: 'linear-gradient(135deg, #c084fc, #ec4899)'
  },
  {
    id: 'love-7',
    name: 'Boundaries of Love',
    affirmation: 'I honor myself through healthy boundaries.',
    message: 'Loving boundaries are not walls—they are fences with gates. You decide who enters your sacred space and under what conditions.',
    category: 'love',
    keywords: ['boundaries', 'respect', 'honor'],
    guidance: 'Identify one boundary you need to strengthen and take one small action toward it.',
    symbol: <Shield size={40} />,
    colorGradient: 'linear-gradient(135deg, #ec4899, #a855f7)'
  },
  {
    id: 'love-8',
    name: 'Passionate Heart',
    affirmation: 'I embrace the fire of passion in my life.',
    message: 'Passion is the life force flowing through you. Let it burn brightly—in love, in creativity, in everything that makes you feel alive.',
    category: 'love',
    keywords: ['passion', 'vitality', 'desire'],
    guidance: 'Do something today that makes your heart race with excitement.',
    symbol: <Flame size={40} />,
    colorGradient: 'linear-gradient(135deg, #f43f5e, #ec4899)'
  },
  {
    id: 'love-9',
    name: 'Gentle Patience',
    affirmation: 'Love unfolds in its own perfect time.',
    message: 'The finest wines cannot be rushed. Trust that love is developing, deepening, preparing itself for the perfect moment of revelation.',
    category: 'love',
    keywords: ['patience', 'trust', 'timing'],
    guidance: 'Practice patience with yourself and others. All is unfolding as it should.',
    symbol: <Clock size={40} />,
    colorGradient: 'linear-gradient(135deg, #f9a8d4, #ec4899)'
  },
  {
    id: 'love-10',
    name: 'Eternal Devotion',
    affirmation: 'My love is a sacred offering to the world.',
    message: 'When you love deeply, you touch the eternal. Your capacity for devotion is a gift that transforms everything it touches.',
    category: 'love',
    keywords: ['devotion', 'depth', 'commitment'],
    guidance: 'Express your love to someone important to you today.',
    symbol: <Gem size={40} />,
    colorGradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
  },

  // Career Category (10 cards)
  {
    id: 'career-1',
    name: 'Abundance Flows',
    affirmation: 'I am a magnet for prosperity and success.',
    message: 'Abundance is your birthright. Remove the blocks, align with purpose, and watch as the universe opens doors you never knew existed.',
    category: 'career',
    keywords: ['prosperity', 'success', 'abundance'],
    guidance: 'Write down three ways you can add value to the world today.',
    symbol: <Crown size={40} />,
    colorGradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
  },
  {
    id: 'career-2',
    name: 'Bold Action',
    affirmation: 'I take inspired action toward my dreams.',
    message: 'Dreams require action to manifest. Each bold step you take sends ripples through reality, reshaping your future with every choice.',
    category: 'career',
    keywords: ['action', 'courage', 'initiative'],
    guidance: 'Take one concrete step toward your goal today, no matter how small.',
    symbol: <Lightning size={40} />,
    colorGradient: 'linear-gradient(135deg, #fb923c, #f59e0b)'
  },
  {
    id: 'career-3',
    name: 'Creative Power',
    affirmation: 'My unique creativity is my superpower.',
    message: 'No one else can create what you can create. Your unique perspective is valuable beyond measure. Express it without apology.',
    category: 'career',
    keywords: ['creativity', 'uniqueness', 'expression'],
    guidance: 'Approach a familiar task in a completely new way today.',
    symbol: <Sparkles size={40} />,
    colorGradient: 'linear-gradient(135deg, #f59e0b, #a855f7)'
  },
  {
    id: 'career-4',
    name: 'Strategic Vision',
    affirmation: 'I see clearly the path to my goals.',
    message: 'Vision without strategy is just a dream. Map your path with intention, and let each step be purposeful and aligned.',
    category: 'career',
    keywords: ['vision', 'strategy', 'clarity'],
    guidance: 'Take 15 minutes to visualize your ideal work life in vivid detail.',
    symbol: <Eye size={40} />,
    colorGradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)'
  },
  {
    id: 'career-5',
    name: 'Collaboration',
    affirmation: 'Together we achieve more than alone.',
    message: 'Seek out those whose strengths complement your own. In collaboration, magic multiplies and limitations dissolve.',
    category: 'career',
    keywords: ['teamwork', 'partnership', 'synergy'],
    guidance: 'Reach out to a potential collaborator or mentor today.',
    symbol: <Bird size={40} />,
    colorGradient: 'linear-gradient(135deg, #f59e0b, #ec4899)'
  },
  {
    id: 'career-6',
    name: 'Resilient Spirit',
    affirmation: 'I rise stronger from every challenge.',
    message: 'Setbacks are setups for comebacks. Your resilience is being forged in the fire of difficulty. You will emerge transformed.',
    category: 'career',
    keywords: ['resilience', 'strength', 'perseverance'],
    guidance: 'Reflect on a past challenge and acknowledge how it strengthened you.',
    symbol: <Mountain size={40} />,
    colorGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)'
  },
  {
    id: 'career-7',
    name: 'Authentic Leadership',
    affirmation: 'I lead with integrity and inspire others.',
    message: 'True leadership comes from authentic being, not from titles. Your presence can elevate everyone around you.',
    category: 'career',
    keywords: ['leadership', 'integrity', 'influence'],
    guidance: 'Mentor someone or share your knowledge today.',
    symbol: <Sun size={40} />,
    colorGradient: 'linear-gradient(135deg, #fbbf24, #fb923c)'
  },
  {
    id: 'career-8',
    name: 'Doors Opening',
    affirmation: 'New opportunities flow to me effortlessly.',
    message: 'The right doors are opening for you now. Stay alert, stay prepared, and be ready to step through when they appear.',
    category: 'career',
    keywords: ['opportunity', 'luck', 'timing'],
    guidance: 'Stay open to unexpected opportunities today.',
    symbol: <Key size={40} />,
    colorGradient: 'linear-gradient(135deg, #f59e0b, #10b981)'
  },
  {
    id: 'career-9',
    name: 'Focused Intention',
    affirmation: 'My focus shapes my reality.',
    message: 'Where attention goes, energy flows. Direct your focus with laser precision and watch your intentions manifest into form.',
    category: 'career',
    keywords: ['focus', 'intention', 'manifestation'],
    guidance: 'Eliminate one distraction from your work today.',
    symbol: <Compass size={40} />,
    colorGradient: 'linear-gradient(135deg, #fb923c, #f59e0b)'
  },
  {
    id: 'career-10',
    name: 'Worthy Compensation',
    affirmation: 'I receive fair reward for my gifts.',
    message: 'Your work has value. Stand firm in knowing your worth and the universe will reflect it back to you in compensation.',
    category: 'career',
    keywords: ['worth', 'value', 'compensation'],
    guidance: 'Affirm your worth by raising your standards in some area today.',
    symbol: <Gem size={40} />,
    colorGradient: 'linear-gradient(135deg, #f59e0b, #d4af37)'
  },

  // Spiritual Category (10 cards)
  {
    id: 'spiritual-1',
    name: 'Divine Connection',
    affirmation: 'I am connected to the infinite source.',
    message: 'You are never separate from the Divine. The connection is always there—you need only remember and attune to its frequency.',
    category: 'spiritual',
    keywords: ['connection', 'source', 'oneness'],
    guidance: 'Spend time in meditation or prayer today, however brief.',
    symbol: <Sparkles size={40} />,
    colorGradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)'
  },
  {
    id: 'spiritual-2',
    name: 'Inner Knowing',
    affirmation: 'I trust the wisdom within me.',
    message: 'Your intuition is a direct line to higher wisdom. Quiet the noise, listen deeply, and you will hear the guidance you seek.',
    category: 'spiritual',
    keywords: ['intuition', 'wisdom', 'trust'],
    guidance: 'Follow an intuitive nudge today without questioning it.',
    symbol: <Eye size={40} />,
    colorGradient: 'linear-gradient(135deg, #a855f7, #8b5cf6)'
  },
  {
    id: 'spiritual-3',
    name: 'Ancestral Wisdom',
    affirmation: 'I carry the wisdom of those who came before.',
    message: 'Your ancestors walk with you, their wisdom encoded in your very being. Call upon them for guidance—they are closer than you know.',
    category: 'spiritual',
    keywords: ['ancestors', 'heritage', 'guidance'],
    guidance: 'Honor your ancestors in some way today—light a candle, speak their names.',
    symbol: <TreePine size={40} />,
    colorGradient: 'linear-gradient(135deg, #8b5cf6, #10b981)'
  },
  {
    id: 'spiritual-4',
    name: 'Sacred Surrender',
    affirmation: 'I release control and trust the divine plan.',
    message: 'In surrender, there is freedom. Release your grip on outcomes and allow the universe to work its magic through you.',
    category: 'spiritual',
    keywords: ['surrender', 'trust', 'flow'],
    guidance: 'Identify one thing you are trying to control and practice releasing it.',
    symbol: <Cloud size={40} />,
    colorGradient: 'linear-gradient(135deg, #c084fc, #a855f7)'
  },
  {
    id: 'spiritual-5',
    name: 'Dream Messages',
    affirmation: 'My dreams carry sacred messages.',
    message: 'The veil between worlds is thin in sleep. Pay attention to your dreams—they carry messages from your higher self and beyond.',
    category: 'spiritual',
    keywords: ['dreams', 'messages', 'insight'],
    guidance: 'Keep a dream journal by your bed tonight.',
    symbol: <Moon size={40} />,
    colorGradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
  },
  {
    id: 'spiritual-6',
    name: 'Light Worker',
    affirmation: 'I am a channel for healing light.',
    message: 'You came here with a purpose—to bring light to the shadows. Your very presence elevates the energy around you.',
    category: 'spiritual',
    keywords: ['purpose', 'light', 'service'],
    guidance: 'Send loving energy to someone in need today.',
    symbol: <Star size={40} />,
    colorGradient: 'linear-gradient(135deg, #a855f7, #fbbf24)'
  },
  {
    id: 'spiritual-7',
    name: 'Sacred Ritual',
    affirmation: 'I honor the sacred in everyday moments.',
    message: 'The mundane becomes magical when approached with reverence. Create rituals that anchor you in the sacred nature of existence.',
    category: 'spiritual',
    keywords: ['ritual', 'reverence', 'magic'],
    guidance: 'Create a small ritual for something you do daily.',
    symbol: <Flame size={40} />,
    colorGradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
  },
  {
    id: 'spiritual-8',
    name: 'Awakening',
    affirmation: 'I embrace my spiritual awakening.',
    message: 'You are waking up to a greater reality. The old must fall away to make room for the new. Trust this process of becoming.',
    category: 'spiritual',
    keywords: ['awakening', 'transformation', 'evolution'],
    guidance: 'Notice what old beliefs or patterns are ready to be released.',
    symbol: <Sunrise size={40} />,
    colorGradient: 'linear-gradient(135deg, #c084fc, #fbbf24)'
  },
  {
    id: 'spiritual-9',
    name: 'Universal Love',
    affirmation: 'I am loved by the universe itself.',
    message: 'You are made of stars and held by the infinite. The universe loves you with a love beyond human comprehension.',
    category: 'spiritual',
    keywords: ['love', 'belonging', 'cosmos'],
    guidance: 'Spend time under the night sky and feel your connection to the cosmos.',
    symbol: <Star size={40} />,
    colorGradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
  },
  {
    id: 'spiritual-10',
    name: 'Mystical Signs',
    affirmation: 'I am surrounded by signs and synchronicities.',
    message: 'The universe is always speaking to you through signs, symbols, and synchronicities. Open your eyes and you will see them everywhere.',
    category: 'spiritual',
    keywords: ['signs', 'synchronicity', 'guidance'],
    guidance: 'Be alert for repeating numbers, animals, or symbols today.',
    symbol: <Butterfly size={40} />,
    colorGradient: 'linear-gradient(135deg, #a855f7, #c084fc)'
  },

  // Growth Category (10 cards)
  {
    id: 'growth-1',
    name: 'Phoenix Rising',
    affirmation: 'I rise transformed from every ending.',
    message: 'Like the phoenix, you are reborn through fire. What feels like destruction is actually transformation. You will emerge more magnificent.',
    category: 'growth',
    keywords: ['transformation', 'rebirth', 'power'],
    guidance: 'Embrace one change that feels uncomfortable but necessary.',
    symbol: <Flame size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #f59e0b)'
  },
  {
    id: 'growth-2',
    name: 'Limitless Potential',
    affirmation: 'There are no limits to what I can become.',
    message: 'The only limits are those you accept. Your potential is vast, unexplored territory. Venture beyond your perceived boundaries.',
    category: 'growth',
    keywords: ['potential', 'expansion', 'possibility'],
    guidance: 'Attempt something today you previously thought you couldn\'t do.',
    symbol: <Mountain size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #22d3d1)'
  },
  {
    id: 'growth-3',
    name: 'Beautiful Unfolding',
    affirmation: 'I trust my natural process of growth.',
    message: 'A flower does not force itself to bloom—it simply responds to light and water. Trust your own beautiful unfolding.',
    category: 'growth',
    keywords: ['trust', 'natural', 'unfolding'],
    guidance: 'Be patient with yourself where you are in your journey.',
    symbol: <Flower2 size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #ec4899)'
  },
  {
    id: 'growth-4',
    name: 'Learning Spirit',
    affirmation: 'Every experience is an opportunity to grow.',
    message: 'Life is the greatest teacher. Every challenge, every joy, every moment holds a lesson. Remain a student of life.',
    category: 'growth',
    keywords: ['learning', 'wisdom', 'experience'],
    guidance: 'Learn something new today, however small.',
    symbol: <BookOpen size={40} />,
    colorGradient: 'linear-gradient(135deg, #22d3d1, #10b981)'
  },
  {
    id: 'growth-5',
    name: 'Breaking Through',
    affirmation: 'I break through every limitation.',
    message: 'The shell must crack for the butterfly to emerge. Your breakthroughs are imminent—keep pushing against the walls.',
    category: 'growth',
    keywords: ['breakthrough', 'liberation', 'strength'],
    guidance: 'Push past one comfort zone today.',
    symbol: <Lightning size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #fbbf24)'
  },
  {
    id: 'growth-6',
    name: 'Rooted Strength',
    affirmation: 'I grow strong roots while reaching for the sky.',
    message: 'Like a tree, grow your roots deep while reaching toward the light. Balance groundedness with aspiration.',
    category: 'growth',
    keywords: ['grounding', 'aspiration', 'balance'],
    guidance: 'Connect with nature today to ground your energy.',
    symbol: <TreePine size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #065f46)'
  },
  {
    id: 'growth-7',
    name: 'Courageous Heart',
    affirmation: 'I face my fears with courage.',
    message: 'Courage is not the absence of fear—it is feeling the fear and moving forward anyway. Your bravery inspires others.',
    category: 'growth',
    keywords: ['courage', 'bravery', 'fear'],
    guidance: 'Face one small fear today.',
    symbol: <Shield size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #f43f5e)'
  },
  {
    id: 'growth-8',
    name: 'Authentic Self',
    affirmation: 'I embrace and express my true self.',
    message: 'You are here to be yourself, not a copy of anyone else. The world needs your authentic expression—give it freely.',
    category: 'growth',
    keywords: ['authenticity', 'truth', 'expression'],
    guidance: 'Express one truth about yourself you usually hide.',
    symbol: <Star size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #a855f7)'
  },
  {
    id: 'growth-9',
    name: 'New Horizons',
    affirmation: 'Exciting new chapters await me.',
    message: 'A new chapter is beginning. Release the old story and step into the new narrative with excitement and wonder.',
    category: 'growth',
    keywords: ['new beginnings', 'adventure', 'future'],
    guidance: 'Envision your ideal future and feel it as already real.',
    symbol: <Compass size={40} />,
    colorGradient: 'linear-gradient(135deg, #22d3d1, #3b82f6)'
  },
  {
    id: 'growth-10',
    name: 'Inner Warrior',
    affirmation: 'I am stronger than any challenge.',
    message: 'Within you lives a warrior spirit that has survived every challenge so far. Call upon this strength—it has never failed you.',
    category: 'growth',
    keywords: ['strength', 'warrior', 'power'],
    guidance: 'Recall a time you overcame great difficulty and draw on that strength.',
    symbol: <Flame size={40} />,
    colorGradient: 'linear-gradient(135deg, #10b981, #f59e0b)'
  },

  // Healing Category (10 cards)
  {
    id: 'healing-1',
    name: 'Deep Healing',
    affirmation: 'Healing flows through me now.',
    message: 'Your body and soul know how to heal. Support this innate wisdom with rest, nourishment, and gentle compassion.',
    category: 'healing',
    keywords: ['restoration', 'health', 'renewal'],
    guidance: 'Give your body something it truly needs today.',
    symbol: <Droplets size={40} />,
    colorGradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
  },
  {
    id: 'healing-2',
    name: 'Releasing Pain',
    affirmation: 'I release what no longer serves my highest good.',
    message: 'Pain that is not released is pain that is stored. Let it flow through you and out of you. You are not meant to carry it forever.',
    category: 'healing',
    keywords: ['release', 'letting go', 'freedom'],
    guidance: 'Cry, write, move—release stored emotions in whatever way feels right.',
    symbol: <Wind size={40} />,
    colorGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
  },
  {
    id: 'healing-3',
    name: 'Gentle Rest',
    affirmation: 'I honor my need for rest and renewal.',
    message: 'Rest is not laziness—it is medicine. Your body and soul are calling for stillness. Honor that call without guilt.',
    category: 'healing',
    keywords: ['rest', 'peace', 'stillness'],
    guidance: 'Take a restorative break today, even if brief.',
    symbol: <Moon size={40} />,
    colorGradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
  },
  {
    id: 'healing-4',
    name: 'Emotional Waters',
    affirmation: 'I honor all my emotions as sacred messengers.',
    message: 'Emotions are energy in motion. Let them flow like water—acknowledge them, feel them, and let them pass through you.',
    category: 'healing',
    keywords: ['emotions', 'feelings', 'flow'],
    guidance: 'Allow yourself to fully feel one emotion you\'ve been suppressing.',
    symbol: <Waves size={40} />,
    colorGradient: 'linear-gradient(135deg, #06b6d4, #22d3d1)'
  },
  {
    id: 'healing-5',
    name: 'Self-Compassion',
    affirmation: 'I treat myself with infinite kindness.',
    message: 'You have suffered enough at the hands of your inner critic. Speak to yourself as you would to a beloved child—with tenderness and love.',
    category: 'healing',
    keywords: ['compassion', 'kindness', 'self-love'],
    guidance: 'Replace one self-critical thought with words of compassion.',
    symbol: <Heart size={40} />,
    colorGradient: 'linear-gradient(135deg, #3b82f6, #ec4899)'
  },
  {
    id: 'healing-6',
    name: 'Nature\'s Medicine',
    affirmation: 'I am healed by the power of nature.',
    message: 'The earth carries profound healing energy. Connect with nature—feel the grass, breathe the air, bathe in sunlight.',
    category: 'healing',
    keywords: ['nature', 'earth', 'connection'],
    guidance: 'Spend time outdoors and consciously receive nature\'s healing.',
    symbol: <Leaf size={40} />,
    colorGradient: 'linear-gradient(135deg, #3b82f6, #10b981)'
  },
  {
    id: 'healing-7',
    name: 'Inner Child',
    affirmation: 'I nurture and protect my inner child.',
    message: 'Your inner child still lives within you and needs your protection and love. Give them the safety and joy they deserve.',
    category: 'healing',
    keywords: ['inner child', 'nurturing', 'play'],
    guidance: 'Do something today purely for fun, like a child would.',
    symbol: <Sun size={40} />,
    colorGradient: 'linear-gradient(135deg, #06b6d4, #fbbf24)'
  },
  {
    id: 'healing-8',
    name: 'Light Through Cracks',
    affirmation: 'My wounds become my greatest strengths.',
    message: 'Like the Japanese art of kintsugi, your breaks can be filled with gold. Your wounds are where your wisdom and light shine through.',
    category: 'healing',
    keywords: ['resilience', 'strength', 'beauty'],
    guidance: 'Reflect on how past pain has made you stronger or wiser.',
    symbol: <Star size={40} />,
    colorGradient: 'linear-gradient(135deg, #3b82f6, #d4af37)'
  },
  {
    id: 'healing-9',
    name: 'Sacred Tears',
    affirmation: 'My tears are holy and healing.',
    message: 'Tears are not weakness—they are the soul\'s release. Let them flow when they need to. They wash clean the heart.',
    category: 'healing',
    keywords: ['tears', 'release', 'cleansing'],
    guidance: 'Allow yourself to cry if you need to, without judgment.',
    symbol: <Droplets size={40} />,
    colorGradient: 'linear-gradient(135deg, #3b82f6, #a855f7)'
  },
  {
    id: 'healing-10',
    name: 'After the Storm',
    affirmation: 'Peace and clarity follow every storm.',
    message: 'The storm is passing. Hold on just a little longer. The rainbow, the calm, the clarity—they are coming.',
    category: 'healing',
    keywords: ['peace', 'hope', 'renewal'],
    guidance: 'Trust that better days are on their way to you.',
    symbol: <Rainbow size={40} />,
    colorGradient: 'linear-gradient(135deg, #06b6d4, #ec4899)'
  }
];

// Styled components
const OracleContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '24px',
});

const OracleTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #ec4899)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 4s linear infinite`,
  textAlign: 'center',
  marginBottom: '8px',
});

const OracleOrb = styled(Box)({
  width: '220px',
  height: '220px',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 30% 30%, #ec4899, #8b5cf6, #1a1028)',
  margin: '0 auto 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${float} 5s ease-in-out infinite, ${glow} 3s ease-in-out infinite`,
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 20px 60px rgba(236, 72, 153, 0.4)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-6px',
    borderRadius: '50%',
    border: '2px solid rgba(236, 72, 153, 0.4)',
    animation: `${glow} 3s ease-in-out infinite 0.5s`,
  },
});

const DrawnCardDisplay = styled(Box)<{ gradient: string }>(({ gradient }) => ({
  width: '300px',
  minHeight: '450px',
  borderRadius: '20px',
  background: 'linear-gradient(180deg, #1a1028 0%, #0a0812 100%)',
  border: '2px solid rgba(236, 72, 153, 0.4)',
  boxShadow: '0 12px 40px rgba(236, 72, 153, 0.3)',
  padding: '24px',
  margin: '0 auto 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  animation: `${flipIn} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: gradient,
  },
}));

const SymbolContainer = styled(Box)<{ color: string }>(({ color }) => ({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '20px',
  marginBottom: '20px',
  color: color,
  animation: `${pulseGlow} 2s ease-in-out infinite`,
}));

const CategoryFilter = styled(Chip)<{ catColor: string; selected: boolean }>(({ catColor, selected }) => ({
  margin: '4px',
  background: selected ? `${catColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `2px solid ${catColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  color: selected ? catColor : '#888888',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `${catColor}20`,
    borderColor: catColor,
  },
}));

const FavoriteCard = styled(Box)<{ color: string }>(({ color }) => ({
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(20, 20, 30, 0.8)',
  border: `1px solid ${color}40`,
  marginBottom: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `${color}10`,
    borderColor: color,
  },
}));

interface OracleCardsProps {
  onClose?: () => void;
}

export const OracleCards: React.FC<OracleCardsProps> = ({ onClose }) => {
  const [drawnCard, setDrawnCard] = useState<OracleCard | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<OracleCategory | null>(null);
  const [dailyCard, setDailyCard] = useState<OracleCard | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Load favorites and daily card from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('oracle_favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }

    // Check for daily card
    const savedDaily = localStorage.getItem('oracle_daily');
    if (savedDaily) {
      const { cardId, date } = JSON.parse(savedDaily);
      const today = new Date().toDateString();
      if (date === today) {
        const card = oracleCards.find(c => c.id === cardId);
        if (card) setDailyCard(card);
      }
    }
  }, []);

  const saveFavorites = useCallback((favs: Set<string>) => {
    localStorage.setItem('oracle_favorites', JSON.stringify([...favs]));
  }, []);

  const toggleFavorite = useCallback((cardId: string) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(cardId)) {
        updated.delete(cardId);
      } else {
        updated.add(cardId);
      }
      saveFavorites(updated);
      return updated;
    });
  }, [saveFavorites]);

  const filteredCards = useMemo(() => {
    if (!selectedCategory) return oracleCards;
    return oracleCards.filter(card => card.category === selectedCategory);
  }, [selectedCategory]);

  const handleDraw = useCallback(() => {
    const cards = filteredCards;
    const randomIndex = Math.floor(Math.random() * cards.length);
    setDrawnCard(cards[randomIndex]);
  }, [filteredCards]);

  const handleDailyDraw = useCallback(() => {
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem('oracle_daily');

    if (savedDaily) {
      const { date, cardId } = JSON.parse(savedDaily);
      if (date === today) {
        const card = oracleCards.find(c => c.id === cardId);
        if (card) {
          setDailyCard(card);
          setDrawnCard(card);
          return;
        }
      }
    }

    // Draw new daily card
    const randomIndex = Math.floor(Math.random() * oracleCards.length);
    const card = oracleCards[randomIndex];
    setDailyCard(card);
    setDrawnCard(card);
    localStorage.setItem('oracle_daily', JSON.stringify({ date: today, cardId: card.id }));
  }, []);

  const favoriteCards = useMemo(() => {
    return oracleCards.filter(card => favorites.has(card.id));
  }, [favorites]);

  return (
    <OracleContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <OracleTitle>
          <Sparkles size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#ec4899' }} />
          Oracle of Shadows
        </OracleTitle>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Receive sacred guidance from the mystic realm
        </Typography>
      </Box>

      {/* Oracle Orb */}
      <OracleOrb onClick={handleDraw}>
        <Sparkles size={60} color="#fff" />
      </OracleOrb>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
        <GothicButton
          variant="primary"
          startIcon={<Sparkles size={18} />}
          onClick={handleDraw}
        >
          Draw Card
        </GothicButton>

        <GothicButton
          variant="secondary"
          startIcon={<Calendar size={18} />}
          onClick={handleDailyDraw}
        >
          {dailyCard ? 'View Daily Card' : 'Daily Oracle'}
        </GothicButton>

        <GothicButton
          variant="ghost"
          startIcon={<Star size={18} />}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          Favorites ({favorites.size})
        </GothicButton>

        <GothicButton
          variant="ghost"
          startIcon={<RotateCcw size={18} />}
          onClick={() => setDrawnCard(null)}
        >
          Clear
        </GothicButton>
      </Box>

      {/* Category Filter */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <CategoryFilter
          label="All"
          catColor="#888888"
          selected={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
        />
        {(Object.entries(categoryConfig) as [OracleCategory, typeof categoryConfig[OracleCategory]][]).map(([key, config]) => (
          <CategoryFilter
            key={key}
            icon={config.icon}
            label={config.name}
            catColor={config.color}
            selected={selectedCategory === key}
            onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
          />
        ))}
      </Box>

      {/* Daily Card Banner */}
      {dailyCard && !drawnCard && (
        <GothicCard variant="glass" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', textAlign: 'center' }}>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', mb: 1 }}>
            <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Today's Oracle Card
          </Typography>
          <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', fontWeight: 600 }}>
            {dailyCard.name}
          </Typography>
          <Typography sx={{ color: '#9080a0', fontStyle: 'italic', mt: 1 }}>
            {dailyCard.affirmation}
          </Typography>
          <GothicButton variant="ghost" sx={{ mt: 2 }} onClick={() => setDrawnCard(dailyCard)}>
            View Full Card
          </GothicButton>
        </GothicCard>
      )}

      {/* Drawn Card Display */}
      {drawnCard && (
        <Box sx={{ mb: 4 }}>
          <DrawnCardDisplay gradient={drawnCard.colorGradient}>
            <Box sx={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              gap: 1
            }}>
              <Tooltip title={favorites.has(drawnCard.id) ? 'Remove from favorites' : 'Add to favorites'}>
                <IconButton
                  onClick={() => toggleFavorite(drawnCard.id)}
                  sx={{ color: favorites.has(drawnCard.id) ? '#f59e0b' : '#888888' }}
                >
                  <Star size={20} fill={favorites.has(drawnCard.id) ? '#f59e0b' : 'none'} />
                </IconButton>
              </Tooltip>
            </Box>

            <Chip
              icon={categoryConfig[drawnCard.category].icon}
              label={categoryConfig[drawnCard.category].name}
              sx={{
                background: `${categoryConfig[drawnCard.category].color}20`,
                color: categoryConfig[drawnCard.category].color,
                border: `1px solid ${categoryConfig[drawnCard.category].color}40`
              }}
            />

            <SymbolContainer color={categoryConfig[drawnCard.category].color}>
              {drawnCard.symbol}
            </SymbolContainer>

            <Typography sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '1.5rem',
              color: '#e0e0e0',
              textAlign: 'center',
              mb: 2
            }}>
              {drawnCard.name}
            </Typography>

            <Box sx={{
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              p: 2,
              mb: 2,
              width: '100%'
            }}>
              <Typography sx={{
                color: '#a78bfa',
                fontStyle: 'italic',
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 500
              }}>
                "{drawnCard.affirmation}"
              </Typography>
            </Box>

            <Typography sx={{
              color: '#d0d0d0',
              textAlign: 'center',
              lineHeight: 1.6,
              mb: 2
            }}>
              {drawnCard.message}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
              {drawnCard.keywords.map((kw, i) => (
                <Chip
                  key={i}
                  label={kw}
                  size="small"
                  sx={{
                    background: 'rgba(100, 100, 120, 0.3)',
                    color: '#888888',
                    fontSize: '0.7rem'
                  }}
                />
              ))}
            </Box>
          </DrawnCardDisplay>

          <GothicCard variant="glass" sx={{ maxWidth: '500px', mx: 'auto' }}>
            <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
              <Compass size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Guidance for Today
            </Typography>
            <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
              {drawnCard.guidance}
            </Typography>
          </GothicCard>
        </Box>
      )}

      {/* Favorites Panel */}
      {showFavorites && (
        <GothicCard variant="elevated" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          <Typography sx={{
            color: '#d4af37',
            fontFamily: '"Cinzel", serif',
            fontSize: '1.2rem',
            mb: 3
          }}>
            <Star size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Favorite Cards ({favoriteCards.length})
          </Typography>

          {favoriteCards.length === 0 ? (
            <Typography sx={{ color: '#888888', textAlign: 'center' }}>
              No favorites yet. Draw cards and tap the star to save them!
            </Typography>
          ) : (
            favoriteCards.map(card => (
              <FavoriteCard
                key={card.id}
                color={categoryConfig[card.category].color}
                onClick={() => setDrawnCard(card)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ color: categoryConfig[card.category].color }}>
                        {categoryConfig[card.category].icon}
                      </Box>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>
                        {card.name}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#9080a0', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      {card.affirmation}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(card.id);
                    }}
                    sx={{ color: '#f59e0b' }}
                  >
                    <Star size={16} fill="#f59e0b" />
                  </IconButton>
                </Box>
              </FavoriteCard>
            ))
          )}
        </GothicCard>
      )}

      {/* Card Categories Info */}
      <GothicCard variant="glass" sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Typography sx={{
          color: '#d4af37',
          fontFamily: '"Cinzel", serif',
          fontSize: '1.1rem',
          mb: 3,
          textAlign: 'center'
        }}>
          Oracle Categories
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {(Object.entries(categoryConfig) as [OracleCategory, typeof categoryConfig[OracleCategory]][]).map(([key, config]) => (
            <Box
              key={key}
              sx={{
                p: 2,
                borderRadius: '12px',
                background: `${config.color}10`,
                border: `1px solid ${config.color}30`,
                minWidth: '140px',
                textAlign: 'center'
              }}
            >
              <Box sx={{ color: config.color, mb: 1 }}>{config.icon}</Box>
              <Typography sx={{ color: config.color, fontWeight: 600, mb: 0.5 }}>
                {config.name}
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
                {oracleCards.filter(c => c.category === key).length} cards
              </Typography>
            </Box>
          ))}
        </Box>
      </GothicCard>
    </OracleContainer>
  );
};

export default OracleCards;
