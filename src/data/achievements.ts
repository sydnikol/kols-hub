// Comprehensive Achievement Definitions
// 100+ achievements across multiple categories

import {
  Star, Compass, Moon, Sun, Clock, Home, Map, Eye, Footprints, Mountain,
  Sunrise, Sunset, MapPin, Navigation, Telescope, Globe,
  Gamepad2, Brain, Trophy, Zap, Target, Puzzle, Dice5, Wand2,
  Swords, Crown, Medal, Award, Flame, Sparkles,
  Users, Heart, MessageCircle, Share2, UserPlus, PartyPopper, Gift,
  Handshake, ThumbsUp, Bell, Send, Link, Group,
  Cat, Dog, Bird, Fish, Rabbit, Bug, Egg, HeartPulse, Bone, Leaf,
  Flower2, Trees, Shell, Feather, PawPrint,
  Shirt, Scissors, Palette, Gem, Wand, Glasses, Watch, Crown as CrownIcon,
  Sparkle, Diamond, ShoppingBag, Brush, Footprints as FootprintsIcon,
  BookOpen, GraduationCap, Scroll, Library, Landmark, History, Lightbulb,
  Hourglass, Castle, Flag,
  Lock, Key, Ghost, Skull, EyeOff, Search, HelpCircle, FileQuestion,
  Fingerprint, Unlock
} from 'lucide-react';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type AchievementCategory = 'exploration' | 'minigames' | 'social' | 'pets' | 'wardrobe' | 'history' | 'secrets';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  rarity: AchievementRarity;
  points: number;
  category: AchievementCategory;
  secret?: boolean;
  maxProgress?: number;
  reward?: {
    type: 'points' | 'item' | 'theme' | 'pet' | 'avatar' | 'badge';
    value: string | number;
  };
}

// ==========================================
// EXPLORATION ACHIEVEMENTS (15)
// ==========================================
export const explorationAchievements: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Visit your first room in the Gothic Dollhouse',
    icon: Footprints,
    rarity: 'common',
    points: 10,
    category: 'exploration',
    reward: { type: 'points', value: 50 }
  },
  {
    id: 'room-explorer',
    name: 'Room Explorer',
    description: 'Visit all 16 rooms in the Gothic Dollhouse',
    icon: Home,
    rarity: 'epic',
    points: 100,
    category: 'exploration',
    maxProgress: 16,
    reward: { type: 'theme', value: 'gothic-explorer' }
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Explore the dollhouse after midnight',
    icon: Moon,
    rarity: 'rare',
    points: 25,
    category: 'exploration',
    reward: { type: 'points', value: 100 }
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Visit the dollhouse before 6 AM',
    icon: Sunrise,
    rarity: 'rare',
    points: 25,
    category: 'exploration',
    reward: { type: 'points', value: 100 }
  },
  {
    id: 'twilight-wanderer',
    name: 'Twilight Wanderer',
    description: 'Explore during the golden hour (sunset)',
    icon: Sunset,
    rarity: 'rare',
    points: 30,
    category: 'exploration',
    reward: { type: 'badge', value: 'twilight-badge' }
  },
  {
    id: 'room-hopper',
    name: 'Room Hopper',
    description: 'Visit 10 different rooms in a single session',
    icon: Navigation,
    rarity: 'common',
    points: 20,
    category: 'exploration',
    maxProgress: 10,
    reward: { type: 'points', value: 75 }
  },
  {
    id: 'frequent-visitor',
    name: 'Frequent Visitor',
    description: 'Visit the same room 50 times',
    icon: MapPin,
    rarity: 'rare',
    points: 40,
    category: 'exploration',
    maxProgress: 50,
    reward: { type: 'points', value: 150 }
  },
  {
    id: 'grand-tour',
    name: 'Grand Tour',
    description: 'Complete a full tour visiting every room in order',
    icon: Map,
    rarity: 'epic',
    points: 75,
    category: 'exploration',
    reward: { type: 'badge', value: 'tour-guide' }
  },
  {
    id: 'stargazer',
    name: 'Stargazer',
    description: 'Spend an hour in the Rooftop Observatory',
    icon: Telescope,
    rarity: 'rare',
    points: 35,
    category: 'exploration',
    reward: { type: 'theme', value: 'celestial' }
  },
  {
    id: 'library-dweller',
    name: 'Library Dweller',
    description: 'Spend 5 hours total in the Library Study',
    icon: BookOpen,
    rarity: 'epic',
    points: 60,
    category: 'exploration',
    reward: { type: 'item', value: 'ancient-bookmark' }
  },
  {
    id: 'kitchen-connoisseur',
    name: 'Kitchen Connoisseur',
    description: 'Visit the Kitchen Lab 100 times',
    icon: Flame,
    rarity: 'legendary',
    points: 150,
    category: 'exploration',
    maxProgress: 100,
    reward: { type: 'badge', value: 'master-chef' }
  },
  {
    id: 'music-lover',
    name: 'Music Lover',
    description: 'Spend 3 hours in the Music Room',
    icon: Sparkles,
    rarity: 'rare',
    points: 45,
    category: 'exploration',
    reward: { type: 'item', value: 'golden-note' }
  },
  {
    id: 'world-traveler',
    name: 'World Traveler',
    description: 'Explore every corner of the Cloud Garden',
    icon: Globe,
    rarity: 'rare',
    points: 40,
    category: 'exploration',
    reward: { type: 'points', value: 200 }
  },
  {
    id: 'mystery-seeker',
    name: 'Mystery Seeker',
    description: 'Discover all hidden areas in the Grand Foyer',
    icon: Eye,
    rarity: 'epic',
    points: 80,
    category: 'exploration',
    reward: { type: 'badge', value: 'detective' }
  },
  {
    id: 'summit-reached',
    name: 'Summit Reached',
    description: 'Visit every elevated location in the dollhouse',
    icon: Mountain,
    rarity: 'legendary',
    points: 125,
    category: 'exploration',
    reward: { type: 'theme', value: 'mountain-peak' }
  },
];

// ==========================================
// MINI-GAMES ACHIEVEMENTS (20)
// ==========================================
export const minigamesAchievements: Achievement[] = [
  {
    id: 'memory-master',
    name: 'Memory Master',
    description: 'Score 900+ points in Memory Match',
    icon: Brain,
    rarity: 'legendary',
    points: 150,
    category: 'minigames',
    reward: { type: 'badge', value: 'genius' }
  },
  {
    id: 'word-wizard',
    name: 'Word Wizard',
    description: 'Find 100+ words in Word Spell',
    icon: Wand2,
    rarity: 'epic',
    points: 100,
    category: 'minigames',
    maxProgress: 100,
    reward: { type: 'item', value: 'magic-quill' }
  },
  {
    id: 'puzzle-prodigy',
    name: 'Puzzle Prodigy',
    description: 'Complete 50 puzzles without hints',
    icon: Puzzle,
    rarity: 'epic',
    points: 90,
    category: 'minigames',
    maxProgress: 50,
    reward: { type: 'points', value: 500 }
  },
  {
    id: 'first-victory',
    name: 'First Victory',
    description: 'Win your first mini-game',
    icon: Trophy,
    rarity: 'common',
    points: 10,
    category: 'minigames',
    reward: { type: 'points', value: 25 }
  },
  {
    id: 'winning-streak',
    name: 'Winning Streak',
    description: 'Win 10 games in a row',
    icon: Flame,
    rarity: 'rare',
    points: 50,
    category: 'minigames',
    maxProgress: 10,
    reward: { type: 'badge', value: 'on-fire' }
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete any game in under 30 seconds',
    icon: Zap,
    rarity: 'rare',
    points: 40,
    category: 'minigames',
    reward: { type: 'points', value: 150 }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieve a perfect score in any game',
    icon: Star,
    rarity: 'epic',
    points: 75,
    category: 'minigames',
    reward: { type: 'badge', value: 'perfect-star' }
  },
  {
    id: 'game-collector',
    name: 'Game Collector',
    description: 'Play every available mini-game',
    icon: Gamepad2,
    rarity: 'rare',
    points: 45,
    category: 'minigames',
    reward: { type: 'theme', value: 'arcade' }
  },
  {
    id: 'dice-roller',
    name: 'Dice Roller',
    description: 'Roll dice 500 times across all games',
    icon: Dice5,
    rarity: 'rare',
    points: 35,
    category: 'minigames',
    maxProgress: 500,
    reward: { type: 'item', value: 'lucky-dice' }
  },
  {
    id: 'battle-champion',
    name: 'Battle Champion',
    description: 'Win 100 battles in combat games',
    icon: Swords,
    rarity: 'epic',
    points: 80,
    category: 'minigames',
    maxProgress: 100,
    reward: { type: 'badge', value: 'champion' }
  },
  {
    id: 'target-master',
    name: 'Target Master',
    description: 'Hit 1000 targets across all games',
    icon: Target,
    rarity: 'epic',
    points: 85,
    category: 'minigames',
    maxProgress: 1000,
    reward: { type: 'item', value: 'golden-arrow' }
  },
  {
    id: 'marathon-gamer',
    name: 'Marathon Gamer',
    description: 'Play games for 10 hours total',
    icon: Clock,
    rarity: 'legendary',
    points: 120,
    category: 'minigames',
    reward: { type: 'theme', value: 'gaming-legend' }
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Set a new personal high score 25 times',
    icon: Medal,
    rarity: 'rare',
    points: 55,
    category: 'minigames',
    maxProgress: 25,
    reward: { type: 'points', value: 300 }
  },
  {
    id: 'comeback-king',
    name: 'Comeback King',
    description: 'Win a game after being behind by 50%',
    icon: Crown,
    rarity: 'rare',
    points: 45,
    category: 'minigames',
    reward: { type: 'badge', value: 'resilient' }
  },
  {
    id: 'daily-player',
    name: 'Daily Player',
    description: 'Play at least one game every day for a week',
    icon: Sun,
    rarity: 'common',
    points: 25,
    category: 'minigames',
    maxProgress: 7,
    reward: { type: 'points', value: 100 }
  },
  {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: 'Play games every day for a month',
    icon: Award,
    rarity: 'legendary',
    points: 200,
    category: 'minigames',
    maxProgress: 30,
    reward: { type: 'theme', value: 'dedicated' }
  },
  {
    id: 'quick-thinker',
    name: 'Quick Thinker',
    description: 'Make 100 correct moves in under 1 second each',
    icon: Zap,
    rarity: 'epic',
    points: 70,
    category: 'minigames',
    maxProgress: 100,
    reward: { type: 'badge', value: 'lightning' }
  },
  {
    id: 'strategic-mind',
    name: 'Strategic Mind',
    description: 'Win 50 strategy-based games',
    icon: Lightbulb,
    rarity: 'epic',
    points: 75,
    category: 'minigames',
    maxProgress: 50,
    reward: { type: 'item', value: 'chess-piece' }
  },
  {
    id: 'lucky-player',
    name: 'Lucky Player',
    description: 'Win 5 games with less than 10% odds',
    icon: Sparkles,
    rarity: 'legendary',
    points: 100,
    category: 'minigames',
    maxProgress: 5,
    reward: { type: 'badge', value: 'lucky-star' }
  },
  {
    id: 'game-guru',
    name: 'Game Guru',
    description: 'Master all mini-games (highest rank in each)',
    icon: Trophy,
    rarity: 'mythic',
    points: 500,
    category: 'minigames',
    reward: { type: 'theme', value: 'legendary-gamer' }
  },
];

// ==========================================
// SOCIAL ACHIEVEMENTS (15)
// ==========================================
export const socialAchievements: Achievement[] = [
  {
    id: 'first-friend',
    name: 'First Friend',
    description: 'Add your first friend',
    icon: UserPlus,
    rarity: 'common',
    points: 15,
    category: 'social',
    reward: { type: 'points', value: 50 }
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Have 10 friends on your friend list',
    icon: Users,
    rarity: 'rare',
    points: 50,
    category: 'social',
    maxProgress: 10,
    reward: { type: 'badge', value: 'social-star' }
  },
  {
    id: 'room-designer',
    name: 'Room Designer',
    description: 'Share 5 room designs with friends',
    icon: Share2,
    rarity: 'rare',
    points: 40,
    category: 'social',
    maxProgress: 5,
    reward: { type: 'item', value: 'design-brush' }
  },
  {
    id: 'chatterbox',
    name: 'Chatterbox',
    description: 'Send 100 messages to friends',
    icon: MessageCircle,
    rarity: 'rare',
    points: 35,
    category: 'social',
    maxProgress: 100,
    reward: { type: 'points', value: 150 }
  },
  {
    id: 'party-host',
    name: 'Party Host',
    description: 'Host your first group event',
    icon: PartyPopper,
    rarity: 'rare',
    points: 45,
    category: 'social',
    reward: { type: 'badge', value: 'party-hat' }
  },
  {
    id: 'gift-giver',
    name: 'Gift Giver',
    description: 'Send 25 gifts to friends',
    icon: Gift,
    rarity: 'rare',
    points: 40,
    category: 'social',
    maxProgress: 25,
    reward: { type: 'points', value: 200 }
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Complete 10 collaborative activities',
    icon: Handshake,
    rarity: 'epic',
    points: 65,
    category: 'social',
    maxProgress: 10,
    reward: { type: 'badge', value: 'team-spirit' }
  },
  {
    id: 'popular-designer',
    name: 'Popular Designer',
    description: 'Receive 50 likes on your shared designs',
    icon: ThumbsUp,
    rarity: 'epic',
    points: 75,
    category: 'social',
    maxProgress: 50,
    reward: { type: 'theme', value: 'celebrity' }
  },
  {
    id: 'notification-king',
    name: 'Notification King',
    description: 'Enable all social notifications',
    icon: Bell,
    rarity: 'common',
    points: 10,
    category: 'social',
    reward: { type: 'points', value: 25 }
  },
  {
    id: 'messenger',
    name: 'Messenger',
    description: 'Start conversations with 20 different people',
    icon: Send,
    rarity: 'rare',
    points: 45,
    category: 'social',
    maxProgress: 20,
    reward: { type: 'badge', value: 'networker' }
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Have 25 people follow your profile',
    icon: Star,
    rarity: 'epic',
    points: 80,
    category: 'social',
    maxProgress: 25,
    reward: { type: 'theme', value: 'influencer' }
  },
  {
    id: 'connector',
    name: 'Connector',
    description: 'Share your profile link 10 times',
    icon: Link,
    rarity: 'common',
    points: 20,
    category: 'social',
    maxProgress: 10,
    reward: { type: 'points', value: 75 }
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Create and moderate a group with 10+ members',
    icon: Group,
    rarity: 'legendary',
    points: 150,
    category: 'social',
    reward: { type: 'badge', value: 'leader-crown' }
  },
  {
    id: 'heart-collector',
    name: 'Heart Collector',
    description: 'Receive 100 hearts on your content',
    icon: Heart,
    rarity: 'epic',
    points: 70,
    category: 'social',
    maxProgress: 100,
    reward: { type: 'item', value: 'golden-heart' }
  },
  {
    id: 'social-legend',
    name: 'Social Legend',
    description: 'Complete all social achievements',
    icon: Crown,
    rarity: 'mythic',
    points: 300,
    category: 'social',
    reward: { type: 'theme', value: 'social-royalty' }
  },
];

// ==========================================
// PETS ACHIEVEMENTS (15)
// ==========================================
export const petsAchievements: Achievement[] = [
  {
    id: 'pet-parent',
    name: 'Pet Parent',
    description: 'Adopt your first pet',
    icon: PawPrint,
    rarity: 'common',
    points: 15,
    category: 'pets',
    reward: { type: 'points', value: 50 }
  },
  {
    id: 'full-house',
    name: 'Full House',
    description: 'Own one of each pet type',
    icon: Home,
    rarity: 'legendary',
    points: 200,
    category: 'pets',
    reward: { type: 'theme', value: 'pet-paradise' }
  },
  {
    id: 'best-friend-forever',
    name: 'Best Friend Forever',
    description: 'Max out bond level with any pet',
    icon: Heart,
    rarity: 'epic',
    points: 100,
    category: 'pets',
    reward: { type: 'badge', value: 'bff' }
  },
  {
    id: 'cat-whisperer',
    name: 'Cat Whisperer',
    description: 'Adopt and care for 3 cats',
    icon: Cat,
    rarity: 'rare',
    points: 45,
    category: 'pets',
    maxProgress: 3,
    reward: { type: 'pet', value: 'shadow-cat' }
  },
  {
    id: 'dog-lover',
    name: 'Dog Lover',
    description: 'Adopt and care for 3 dogs',
    icon: Dog,
    rarity: 'rare',
    points: 45,
    category: 'pets',
    maxProgress: 3,
    reward: { type: 'pet', value: 'ghost-hound' }
  },
  {
    id: 'bird-watcher',
    name: 'Bird Watcher',
    description: 'Collect 5 different bird species',
    icon: Bird,
    rarity: 'epic',
    points: 70,
    category: 'pets',
    maxProgress: 5,
    reward: { type: 'item', value: 'golden-feather' }
  },
  {
    id: 'aquarium-keeper',
    name: 'Aquarium Keeper',
    description: 'Own 10 different fish',
    icon: Fish,
    rarity: 'epic',
    points: 75,
    category: 'pets',
    maxProgress: 10,
    reward: { type: 'theme', value: 'ocean-depths' }
  },
  {
    id: 'bunny-brigade',
    name: 'Bunny Brigade',
    description: 'Adopt 5 rabbits',
    icon: Rabbit,
    rarity: 'rare',
    points: 50,
    category: 'pets',
    maxProgress: 5,
    reward: { type: 'pet', value: 'moon-bunny' }
  },
  {
    id: 'bug-collector',
    name: 'Bug Collector',
    description: 'Collect 20 different insects',
    icon: Bug,
    rarity: 'epic',
    points: 65,
    category: 'pets',
    maxProgress: 20,
    reward: { type: 'badge', value: 'entomologist' }
  },
  {
    id: 'egg-hatcher',
    name: 'Egg Hatcher',
    description: 'Hatch 25 pet eggs',
    icon: Egg,
    rarity: 'epic',
    points: 80,
    category: 'pets',
    maxProgress: 25,
    reward: { type: 'item', value: 'golden-egg' }
  },
  {
    id: 'pet-healer',
    name: 'Pet Healer',
    description: 'Keep all pets at full health for 30 days',
    icon: HeartPulse,
    rarity: 'legendary',
    points: 150,
    category: 'pets',
    maxProgress: 30,
    reward: { type: 'badge', value: 'healer' }
  },
  {
    id: 'treat-master',
    name: 'Treat Master',
    description: 'Give 500 treats to your pets',
    icon: Bone,
    rarity: 'rare',
    points: 40,
    category: 'pets',
    maxProgress: 500,
    reward: { type: 'points', value: 200 }
  },
  {
    id: 'nature-friend',
    name: 'Nature Friend',
    description: 'Take pets outdoors 50 times',
    icon: Leaf,
    rarity: 'rare',
    points: 35,
    category: 'pets',
    maxProgress: 50,
    reward: { type: 'item', value: 'leaf-crown' }
  },
  {
    id: 'exotic-collector',
    name: 'Exotic Collector',
    description: 'Own 5 rare/exotic pets',
    icon: Shell,
    rarity: 'legendary',
    points: 175,
    category: 'pets',
    maxProgress: 5,
    reward: { type: 'theme', value: 'exotic' }
  },
  {
    id: 'pet-master',
    name: 'Pet Master',
    description: 'Complete all pet achievements',
    icon: Crown,
    rarity: 'mythic',
    points: 400,
    category: 'pets',
    reward: { type: 'pet', value: 'legendary-phoenix' }
  },
];

// ==========================================
// WARDROBE ACHIEVEMENTS (15)
// ==========================================
export const wardrobeAchievements: Achievement[] = [
  {
    id: 'fashion-forward',
    name: 'Fashion Forward',
    description: 'Create your first outfit',
    icon: Shirt,
    rarity: 'common',
    points: 10,
    category: 'wardrobe',
    reward: { type: 'points', value: 25 }
  },
  {
    id: 'era-collector',
    name: 'Era Collector',
    description: 'Try outfits from all historical eras',
    icon: Hourglass,
    rarity: 'epic',
    points: 100,
    category: 'wardrobe',
    reward: { type: 'theme', value: 'timeless' }
  },
  {
    id: 'style-icon',
    name: 'Style Icon',
    description: 'Save 50 custom outfits',
    icon: Star,
    rarity: 'legendary',
    points: 150,
    category: 'wardrobe',
    maxProgress: 50,
    reward: { type: 'badge', value: 'fashion-star' }
  },
  {
    id: 'color-coordinator',
    name: 'Color Coordinator',
    description: 'Create outfits using every color palette',
    icon: Palette,
    rarity: 'rare',
    points: 45,
    category: 'wardrobe',
    reward: { type: 'item', value: 'rainbow-swatch' }
  },
  {
    id: 'accessory-addict',
    name: 'Accessory Addict',
    description: 'Collect 100 accessories',
    icon: Gem,
    rarity: 'epic',
    points: 80,
    category: 'wardrobe',
    maxProgress: 100,
    reward: { type: 'item', value: 'diamond-pin' }
  },
  {
    id: 'transformation-master',
    name: 'Transformation Master',
    description: 'Change outfits 500 times',
    icon: Wand,
    rarity: 'epic',
    points: 75,
    category: 'wardrobe',
    maxProgress: 500,
    reward: { type: 'badge', value: 'chameleon' }
  },
  {
    id: 'eyewear-enthusiast',
    name: 'Eyewear Enthusiast',
    description: 'Collect 25 pairs of glasses/sunglasses',
    icon: Glasses,
    rarity: 'rare',
    points: 40,
    category: 'wardrobe',
    maxProgress: 25,
    reward: { type: 'avatar', value: 'vintage-glasses' }
  },
  {
    id: 'timepiece-collector',
    name: 'Timepiece Collector',
    description: 'Own 15 different watches',
    icon: Watch,
    rarity: 'rare',
    points: 45,
    category: 'wardrobe',
    maxProgress: 15,
    reward: { type: 'item', value: 'golden-watch' }
  },
  {
    id: 'crown-collector',
    name: 'Crown Collector',
    description: 'Collect all crown types',
    icon: CrownIcon,
    rarity: 'legendary',
    points: 125,
    category: 'wardrobe',
    reward: { type: 'avatar', value: 'imperial-crown' }
  },
  {
    id: 'sparkle-specialist',
    name: 'Sparkle Specialist',
    description: 'Own 50 items with glitter/sparkle effects',
    icon: Sparkle,
    rarity: 'epic',
    points: 70,
    category: 'wardrobe',
    maxProgress: 50,
    reward: { type: 'theme', value: 'glitter' }
  },
  {
    id: 'diamond-collector',
    name: 'Diamond Collector',
    description: 'Acquire 10 diamond-tier items',
    icon: Diamond,
    rarity: 'legendary',
    points: 175,
    category: 'wardrobe',
    maxProgress: 10,
    reward: { type: 'badge', value: 'diamond-elite' }
  },
  {
    id: 'shopaholic',
    name: 'Shopaholic',
    description: 'Purchase 200 wardrobe items',
    icon: ShoppingBag,
    rarity: 'epic',
    points: 85,
    category: 'wardrobe',
    maxProgress: 200,
    reward: { type: 'points', value: 500 }
  },
  {
    id: 'custom-creator',
    name: 'Custom Creator',
    description: 'Design 10 custom items',
    icon: Brush,
    rarity: 'rare',
    points: 55,
    category: 'wardrobe',
    maxProgress: 10,
    reward: { type: 'item', value: 'design-kit' }
  },
  {
    id: 'shoe-collector',
    name: 'Shoe Collector',
    description: 'Own 50 pairs of shoes',
    icon: FootprintsIcon,
    rarity: 'epic',
    points: 65,
    category: 'wardrobe',
    maxProgress: 50,
    reward: { type: 'avatar', value: 'crystal-slippers' }
  },
  {
    id: 'fashion-legend',
    name: 'Fashion Legend',
    description: 'Complete all wardrobe achievements',
    icon: Crown,
    rarity: 'mythic',
    points: 350,
    category: 'wardrobe',
    reward: { type: 'theme', value: 'haute-couture' }
  },
];

// ==========================================
// HISTORY ACHIEVEMENTS (10)
// ==========================================
export const historyAchievements: Achievement[] = [
  {
    id: 'history-buff',
    name: 'History Buff',
    description: 'Chat with 50 historical figures',
    icon: BookOpen,
    rarity: 'legendary',
    points: 150,
    category: 'history',
    maxProgress: 50,
    reward: { type: 'badge', value: 'historian' }
  },
  {
    id: 'group-organizer',
    name: 'Group Organizer',
    description: 'Host 5 group discussions with historical figures',
    icon: Users,
    rarity: 'epic',
    points: 100,
    category: 'history',
    maxProgress: 5,
    reward: { type: 'theme', value: 'roundtable' }
  },
  {
    id: 'first-encounter',
    name: 'First Encounter',
    description: 'Meet your first historical figure',
    icon: Handshake,
    rarity: 'common',
    points: 10,
    category: 'history',
    reward: { type: 'points', value: 25 }
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Visit 10 different historical eras',
    icon: Hourglass,
    rarity: 'epic',
    points: 85,
    category: 'history',
    maxProgress: 10,
    reward: { type: 'badge', value: 'chrononaut' }
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Complete 25 history lessons',
    icon: GraduationCap,
    rarity: 'rare',
    points: 55,
    category: 'history',
    maxProgress: 25,
    reward: { type: 'item', value: 'diploma' }
  },
  {
    id: 'ancient-wisdom',
    name: 'Ancient Wisdom',
    description: 'Converse with 10 ancient philosophers',
    icon: Scroll,
    rarity: 'epic',
    points: 90,
    category: 'history',
    maxProgress: 10,
    reward: { type: 'theme', value: 'philosopher' }
  },
  {
    id: 'library-master',
    name: 'Library Master',
    description: 'Read 100 historical documents',
    icon: Library,
    rarity: 'legendary',
    points: 125,
    category: 'history',
    maxProgress: 100,
    reward: { type: 'badge', value: 'archivist' }
  },
  {
    id: 'monument-explorer',
    name: 'Monument Explorer',
    description: 'Learn about 20 historical landmarks',
    icon: Landmark,
    rarity: 'rare',
    points: 50,
    category: 'history',
    maxProgress: 20,
    reward: { type: 'item', value: 'world-map' }
  },
  {
    id: 'castle-conqueror',
    name: 'Castle Conqueror',
    description: 'Explore 15 virtual castles',
    icon: Castle,
    rarity: 'epic',
    points: 75,
    category: 'history',
    maxProgress: 15,
    reward: { type: 'theme', value: 'medieval' }
  },
  {
    id: 'history-legend',
    name: 'History Legend',
    description: 'Complete all history achievements',
    icon: Flag,
    rarity: 'mythic',
    points: 300,
    category: 'history',
    reward: { type: 'badge', value: 'history-master' }
  },
];

// ==========================================
// SECRET ACHIEVEMENTS (10)
// ==========================================
export const secretAchievements: Achievement[] = [
  {
    id: 'secret-midnight',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'rare',
    points: 50,
    category: 'secrets',
    secret: true,
    reward: { type: 'theme', value: 'midnight-mystery' }
  },
  {
    id: 'secret-konami',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'epic',
    points: 100,
    category: 'secrets',
    secret: true,
    reward: { type: 'badge', value: 'konami-master' }
  },
  {
    id: 'secret-hidden-room',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'legendary',
    points: 150,
    category: 'secrets',
    secret: true,
    reward: { type: 'theme', value: 'hidden-chamber' }
  },
  {
    id: 'secret-easter-egg',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'rare',
    points: 75,
    category: 'secrets',
    secret: true,
    reward: { type: 'item', value: 'easter-egg' }
  },
  {
    id: 'secret-sequence',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'epic',
    points: 100,
    category: 'secrets',
    secret: true,
    reward: { type: 'badge', value: 'puzzle-solver' }
  },
  {
    id: 'secret-ghost',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'legendary',
    points: 200,
    category: 'secrets',
    secret: true,
    reward: { type: 'pet', value: 'ghost-companion' }
  },
  {
    id: 'secret-developer',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'mythic',
    points: 500,
    category: 'secrets',
    secret: true,
    reward: { type: 'badge', value: 'developer' }
  },
  {
    id: 'secret-time',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'rare',
    points: 60,
    category: 'secrets',
    secret: true,
    reward: { type: 'item', value: 'time-crystal' }
  },
  {
    id: 'secret-pattern',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'epic',
    points: 125,
    category: 'secrets',
    secret: true,
    reward: { type: 'theme', value: 'enigma' }
  },
  {
    id: 'secret-master',
    name: '???',
    description: 'Secret achievement',
    icon: Lock,
    rarity: 'mythic',
    points: 1000,
    category: 'secrets',
    secret: true,
    reward: { type: 'badge', value: 'secret-keeper' }
  },
];

// Revealed secret achievement details (used after unlocking)
export const revealedSecrets: Record<string, { name: string; description: string; icon: React.ElementType }> = {
  'secret-midnight': {
    name: 'Witching Hour',
    description: 'Use the app at exactly 3:00 AM',
    icon: Ghost
  },
  'secret-konami': {
    name: 'Classic Code',
    description: 'Enter the Konami code anywhere in the app',
    icon: Gamepad2
  },
  'secret-hidden-room': {
    name: 'Hidden Chamber',
    description: 'Discover the secret 17th room',
    icon: Key
  },
  'secret-easter-egg': {
    name: 'Egg Hunter',
    description: 'Find the hidden Easter egg in the Grand Foyer',
    icon: Egg
  },
  'secret-sequence': {
    name: 'Sequence Master',
    description: 'Click the candles in the correct order',
    icon: Fingerprint
  },
  'secret-ghost': {
    name: 'Ghost Whisperer',
    description: 'Encounter the mysterious ghost at midnight',
    icon: Skull
  },
  'secret-developer': {
    name: 'Behind the Curtain',
    description: 'Find and access the developer console',
    icon: Eye
  },
  'secret-time': {
    name: 'Time Bender',
    description: 'Set your device clock to a special date',
    icon: Clock
  },
  'secret-pattern': {
    name: 'Pattern Breaker',
    description: 'Complete an impossible combination',
    icon: Search
  },
  'secret-master': {
    name: 'Keeper of Secrets',
    description: 'Unlock all secret achievements',
    icon: Unlock
  },
};

// Combined list of all achievements
export const allAchievements: Achievement[] = [
  ...explorationAchievements,
  ...minigamesAchievements,
  ...socialAchievements,
  ...petsAchievements,
  ...wardrobeAchievements,
  ...historyAchievements,
  ...secretAchievements,
];

// Category information
export const achievementCategories = {
  exploration: {
    name: 'Exploration',
    description: 'Discover every corner of the Gothic Dollhouse',
    icon: Compass,
    color: '#22c55e',
    total: explorationAchievements.length,
  },
  minigames: {
    name: 'Mini-Games',
    description: 'Master all the games and challenges',
    icon: Gamepad2,
    color: '#3b82f6',
    total: minigamesAchievements.length,
  },
  social: {
    name: 'Social',
    description: 'Connect with friends and the community',
    icon: Users,
    color: '#ec4899',
    total: socialAchievements.length,
  },
  pets: {
    name: 'Pets',
    description: 'Collect and care for your companions',
    icon: PawPrint,
    color: '#f59e0b',
    total: petsAchievements.length,
  },
  wardrobe: {
    name: 'Wardrobe',
    description: 'Build your ultimate fashion collection',
    icon: Shirt,
    color: '#a855f7',
    total: wardrobeAchievements.length,
  },
  history: {
    name: 'History',
    description: 'Learn from the legends of the past',
    icon: BookOpen,
    color: '#14b8a6',
    total: historyAchievements.length,
  },
  secrets: {
    name: 'Secrets',
    description: 'Hidden mysteries await discovery',
    icon: Lock,
    color: '#6366f1',
    total: secretAchievements.length,
  },
};

// Rarity information
export const rarityInfo = {
  common: { name: 'Common', color: '#9ca3af', multiplier: 1 },
  rare: { name: 'Rare', color: '#3b82f6', multiplier: 1.5 },
  epic: { name: 'Epic', color: '#8b5cf6', multiplier: 2 },
  legendary: { name: 'Legendary', color: '#f59e0b', multiplier: 3 },
  mythic: { name: 'Mythic', color: '#ec4899', multiplier: 5 },
};

// Calculate total possible points
export const totalPossiblePoints = allAchievements.reduce((sum, a) => sum + a.points, 0);

export default allAchievements;
