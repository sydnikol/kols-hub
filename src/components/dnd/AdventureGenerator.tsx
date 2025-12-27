import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Fade,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
  Avatar,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Heart,
  Skull,
  Sword,
  HelpCircle,
  Coffee,
  Shuffle,
  BookOpen,
  Users,
  User,
  MapPin,
  Target,
  Sparkles,
  Star,
  X,
  ChevronRight,
  Bookmark,
  Share2,
  Dice6,
  Scroll,
  Castle,
  Ghost,
  Flower2,
  Flame,
} from 'lucide-react';

// Animations
const diceRoll = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

// Styled Components
const GeneratorContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d1a 50%, #0d1a1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z\' fill=\'%23d4af3708\'/%3E%3C/svg%3E")',
    opacity: 0.5,
    pointerEvents: 'none',
  },
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #c9a227 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
  marginBottom: '8px',
});

const AdventureCard = styled(Card)<{ vibe?: string }>(({ vibe }) => ({
  background: vibe === 'cozy'
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)'
    : vibe === 'dark'
    ? 'linear-gradient(135deg, rgba(127, 29, 29, 0.2) 0%, rgba(55, 0, 55, 0.15) 100%)'
    : vibe === 'epic'
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)'
    : vibe === 'mystery'
    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid',
  borderColor: vibe === 'cozy' ? 'rgba(34, 197, 94, 0.3)'
    : vibe === 'dark' ? 'rgba(185, 28, 28, 0.3)'
    : vibe === 'epic' ? 'rgba(212, 175, 55, 0.3)'
    : vibe === 'mystery' ? 'rgba(99, 102, 241, 0.3)'
    : 'rgba(236, 72, 153, 0.3)',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: vibe === 'cozy' ? '0 8px 32px rgba(34, 197, 94, 0.3)'
      : vibe === 'dark' ? '0 8px 32px rgba(185, 28, 28, 0.3)'
      : vibe === 'epic' ? '0 8px 32px rgba(212, 175, 55, 0.3)'
      : vibe === 'mystery' ? '0 8px 32px rgba(99, 102, 241, 0.3)'
      : '0 8px 32px rgba(236, 72, 153, 0.3)',
  },
}));

const VibeChip = styled(Chip)<{ vibetype?: string }>(({ vibetype }) => ({
  background: vibetype === 'cozy' ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
    : vibetype === 'dark' ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)'
    : vibetype === 'epic' ? 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)'
    : vibetype === 'mystery' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    : 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  color: '#fff',
  fontWeight: 600,
  border: 'none',
}));

const ModeChip = styled(Chip)<{ modetype?: string }>(({ modetype }) => ({
  background: modetype === 'solo'
    ? 'rgba(139, 92, 246, 0.2)'
    : modetype === 'duet'
    ? 'rgba(236, 72, 153, 0.2)'
    : 'rgba(34, 197, 94, 0.2)',
  color: modetype === 'solo' ? '#a78bfa'
    : modetype === 'duet' ? '#f472b6'
    : '#4ade80',
  border: `1px solid ${modetype === 'solo' ? 'rgba(139, 92, 246, 0.4)'
    : modetype === 'duet' ? 'rgba(236, 72, 153, 0.4)'
    : 'rgba(34, 197, 94, 0.4)'}`,
}));

const FilterChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)'
    : 'rgba(212, 175, 55, 0.15)',
  color: selected ? '#000' : '#d4af37',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)'
      : 'rgba(212, 175, 55, 0.3)',
  },
}));

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
  color: '#000',
  fontWeight: 700,
  padding: '12px 32px',
  borderRadius: '12px',
  '&:hover': {
    background: 'linear-gradient(135deg, #c9a227 0%, #d97706 100%)',
    transform: 'scale(1.02)',
  },
  '& .dice-icon': {
    animation: `${diceRoll} 0.5s ease`,
  },
});

const NPCBadge = styled(Box)({
  background: 'rgba(212, 175, 55, 0.1)',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  borderRadius: '8px',
  padding: '8px 12px',
  marginBottom: '8px',
});

const HookBadge = styled(Box)({
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '8px',
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

// Adventure Data (sample from the 50)
const adventures = [
  {
    id: 'dnd_001',
    title: 'The Vanishing Village',
    mode: 'group',
    vibe: 'mystery',
    description: 'An entire village disappears overnight, leaving behind only footprints leading to the forest.',
    setting: 'Rural farming community at forest edge',
    objective: 'Discover why the village vanished and rescue survivors',
    npcs: ['Sheriff Maren (worried lawkeeper)', 'Old Tilda (forest hermit)', 'The Shepherd Boy (only witness)'],
    hooks: ['A family member lived in the village', 'The party owes the village a debt', 'A valuable artifact was lost there'],
  },
  {
    id: 'dnd_002',
    title: 'The Cozy Cauldron Competition',
    mode: 'duet',
    vibe: 'cozy',
    description: 'A beloved tavern hosts its annual cooking competition, but someone is sabotaging contestants.',
    setting: 'Warm tavern during autumn festival',
    objective: 'Win the cooking competition and expose the saboteur',
    npcs: ['Helga Brewbottom (tavern owner)', 'Gustav the Glutton (rival chef)', 'Penny Peppermill (helpful halfling)'],
    hooks: ['Your family recipe is at stake', 'The prize is a rare ingredient you need', 'The tavern owner is an old friend'],
  },
  {
    id: 'dnd_003',
    title: "Dragon's Last Breath",
    mode: 'group',
    vibe: 'epic',
    description: 'An ancient dragon calls upon heroes not to slay it, but to witness its final days and protect its legacy.',
    setting: 'Mountain peak sanctuary',
    objective: "Protect the dragon's final egg from corrupting forces",
    npcs: ['Aurixalath (dying gold dragon)', 'Cult of the Void (antagonists)', 'Dragonborn Guardian (loyal protector)'],
    hooks: ['The dragon saved your ancestor', 'You carry a dragon-touched item', 'Prophecy names you as witness'],
  },
  {
    id: 'dnd_004',
    title: 'Whispers in the Asylum',
    mode: 'group',
    vibe: 'dark',
    description: 'Patients at Greymoor Asylum are experiencing shared nightmares. Something ancient awakens in the basement.',
    setting: 'Gothic asylum on stormy cliffs',
    objective: 'Stop the entity before it fully awakens',
    npcs: ['Dr. Holloway (desperate physician)', 'Patient Zero (connection to entity)', 'Nurse Blackwood (knows more than she says)'],
    hooks: ['A loved one is committed here', 'You experienced the nightmares', 'Hired by concerned family'],
  },
  {
    id: 'dnd_005',
    title: 'Letters Never Sent',
    mode: 'solo',
    vibe: 'slice-of-life',
    description: 'You discover love letters never delivered. Tracing their origin leads to a story of forbidden love.',
    setting: 'Small coastal town with hidden history',
    objective: 'Deliver the letters and help resolve the past',
    npcs: ['The Letter Writer (now elderly)', 'The Intended Recipient (bitter from silence)', 'The Lighthouse Keeper (witnessed everything)'],
    hooks: ['The letters mention your family', 'Found them in inherited property', 'A ghost asked you to help'],
  },
  {
    id: 'dnd_006',
    title: 'The Carnival of Forgotten Souls',
    mode: 'group',
    vibe: 'dark',
    description: 'A mysterious carnival appears on the outskirts. Those who enter forget their past and join as performers.',
    setting: 'Eerie carnival between planes',
    objective: 'Free the trapped souls and destroy the carnival master',
    npcs: ['The Ringmaster (ancient fey lord)', 'The Bearded Lady (trapped adventurer)', 'The Fortune Teller (reluctant servant)'],
    hooks: ['A friend joined and never returned', 'The carnival took your memories once', 'You inherited a carnival ticket'],
  },
  {
    id: 'dnd_007',
    title: "The Baker's Midnight Dough",
    mode: 'duet',
    vibe: 'cozy',
    description: "A famous baker's secret ingredient is running out - moonlight flour from a hidden fairy grove.",
    setting: 'Enchanted forest glade under full moon',
    objective: 'Harvest moonlight flour and secure future access',
    npcs: ['Master Baker Thornberry', 'The Grove Guardian (protective sprite)', 'Moonpetal Fairies (playful but territorial)'],
    hooks: ["You're the baker's apprentice", 'The bakery saved your life', 'You made a fairy promise long ago'],
  },
  {
    id: 'dnd_008',
    title: 'Siege of the Starfall Citadel',
    mode: 'group',
    vibe: 'epic',
    description: 'An army of celestial-hunting fiends lays siege to the last bastion of fallen stars.',
    setting: 'Massive fortress on the plane of stars',
    objective: 'Defend the citadel and protect celestial secrets',
    npcs: ['Commander Seraphel (wounded deva)', 'The Defector (devil with intel)', 'The Star Child (key to everything)'],
    hooks: ["You carry a fallen star's blessing", 'A celestial patron calls for aid', 'The secrets could save your world'],
  },
  {
    id: 'dnd_009',
    title: 'The Inheritance Test',
    mode: 'solo',
    vibe: 'mystery',
    description: 'To claim your unexpected inheritance, solve three riddles left by an eccentric ancestor.',
    setting: "Eccentric wizard's puzzle mansion",
    objective: 'Solve all riddles before rival claimants',
    npcs: ['The Butler (bound to serve neutrally)', 'Cousin Mortimer (scheming rival)', "The Ancestor's Ghost (cryptic hints)"],
    hooks: ['You never knew this relative', 'The inheritance could save your village', 'Dark family secrets lurk within'],
  },
  {
    id: 'dnd_010',
    title: "The Merchant's Menagerie",
    mode: 'group',
    vibe: 'slice-of-life',
    description: "Help transport exotic (and magical) animals to a noble's private zoo. What could go wrong?",
    setting: 'Roads between cities, various biomes',
    objective: 'Safely deliver all creatures to destination',
    npcs: ['Merchant Safiya (stressed but kind)', 'Lord Pennywhistle (eccentric noble)', 'Pip the Pseudodragon (stowaway)'],
    hooks: ['One creature reminds you of a lost pet', 'You owe Safiya a favor', 'The noble promised a rare reward'],
  },
  {
    id: 'dnd_011',
    title: "The Grandmother's Garden",
    mode: 'duet',
    vibe: 'cozy',
    description: "An elderly witch's enchanted garden is dying. Gather memory blooms from places significant to her life.",
    setting: 'Magical cottage garden, flashback locations',
    objective: 'Gather memory blooms to restore the garden',
    npcs: ['Grandmother Willow (gentle witch)', 'The Garden Spirit (weakening)', 'Echo (cat familiar with sass)'],
    hooks: ["She's your actual grandmother", 'She saved your life as a child', 'Her garden holds a cure you need'],
  },
  {
    id: 'dnd_012',
    title: 'The Silent Orchestra',
    mode: 'group',
    vibe: 'mystery',
    description: 'A legendary concert hall has gone silent - literally. Ghost musicians demand their final performance.',
    setting: 'Grand opera house, frozen in spectral silence',
    objective: "Help the ghost orchestra perform their masterpiece",
    npcs: ['Maestro Blackwood (ghost conductor)', 'The Prima Donna (jealous ghost)', 'The Janitor (only living witness)'],
    hooks: ['An ancestor was in the orchestra', 'You need music to break a curse', 'The silence is spreading to the city'],
  },
  {
    id: 'dnd_013',
    title: 'Blood Moon Rising',
    mode: 'group',
    vibe: 'dark',
    description: "A blood moon rises and won't set. Each night, more villagers transform into lycanthropes.",
    setting: 'Isolated mountain village under perpetual blood moon',
    objective: 'Break the ancient curse before everyone transforms',
    npcs: ['The Village Elder (hiding the truth)', 'The First Werewolf (seeking redemption)', 'The Witch Hunter (making things worse)'],
    hooks: ['You were bitten and the clock is ticking', 'A family member is transforming', "You're descended from the betrayer"],
  },
  {
    id: 'dnd_014',
    title: 'The Last Library',
    mode: 'solo',
    vibe: 'epic',
    description: 'You are chosen as Keeper of a library outside time, containing every book ever written. Something is erasing entries.',
    setting: 'Infinite library between dimensions',
    objective: "Stop what's erasing knowledge from existence",
    npcs: ['The Previous Keeper (now a book)', 'The Librarians (living indexes)', 'The Eraser (mysterious antagonist)'],
    hooks: ['Your story is in danger of being erased', 'You wrote a book kept here', 'Prophecy marks you as savior'],
  },
  {
    id: 'dnd_015',
    title: 'The Tea Dragon Society',
    mode: 'duet',
    vibe: 'cozy',
    description: 'Tiny tea dragons are going missing. Help investigate while learning the peaceful art of dragon tea brewing.',
    setting: 'Pastoral tea farming village',
    objective: 'Find the missing tea dragons and protect the rest',
    npcs: ['Jasmine (young keeper)', 'Chamomile (elder dragon with wisdom)', 'The Collector (well-meaning but misguided noble)'],
    hooks: ['You bonded with a tea dragon', 'Tea dragons hold a family memory', 'You seek the calming tea for healing'],
  },
  {
    id: 'dnd_016',
    title: "The Titan's Tears",
    mode: 'group',
    vibe: 'epic',
    description: "An imprisoned titan weeps, and each tear becomes a gem granting immense power. Factions war over them.",
    setting: 'Mountains where a titan is chained',
    objective: "Decide the titan's fate and stop the faction war",
    npcs: ['The Chained Titan (ancient and weary)', 'The Gem Hunters (morally gray)', 'The Guardian Order (keepers of chains)'],
    hooks: ["You possess a titan's tear gem", 'The titan speaks in your dreams', 'Your homeland is threatened by war'],
  },
  {
    id: 'dnd_017',
    title: 'Haunted Honeymoon',
    mode: 'duet',
    vibe: 'slice-of-life',
    description: "Cleanse a couple's new home of ghosts before their wedding. The ghosts have opinions about the wedding.",
    setting: 'Charming haunted manor',
    objective: 'Negotiate peace between the living and dead',
    npcs: ['The Bride (stressed but determined)', 'The Ghost Groom (died before his wedding)', "The Ghost Bride (protective of 'her' home)"],
    hooks: ["You're the wedding planner", 'The ghosts are your ancestors', 'You promised to help as a favor'],
  },
  {
    id: 'dnd_018',
    title: "The Dream Eater's Bargain",
    mode: 'solo',
    vibe: 'dark',
    description: "You haven't dreamed for years - a creature ate them. Now it offers to return them in exchange for stealing others' dreams.",
    setting: 'Dream realm and waking world',
    objective: 'Reclaim your dreams without becoming a monster',
    npcs: ['The Dream Eater (cunning night hag)', 'The Dreamless Ones (others who lost dreams)', 'The Dream Guardian (potential ally)'],
    hooks: ['Your creativity died with your dreams', 'Someone you love is the next target', 'Your dreams held prophecy'],
  },
  {
    id: 'dnd_019',
    title: 'Festival of Masks',
    mode: 'group',
    vibe: 'mystery',
    description: 'During the annual masquerade, guests are being replaced by doppelgangers. Unmask them before midnight.',
    setting: 'Grand palace during elaborate masquerade',
    objective: 'Identify and stop the doppelgangers',
    npcs: ['The Host (may already be replaced)', 'The Paranoid Noble (sees threats everywhere)', 'The Entertainer (notices everything)'],
    hooks: ['A party member may have been replaced', 'Someone you love is attending', 'You were hired as security'],
  },
  {
    id: 'dnd_020',
    title: "The Lighthouse Keeper's Last Watch",
    mode: 'solo',
    vibe: 'cozy',
    description: "The elderly keeper is retiring. Stay for one last storm, learning the lighthouse's secrets and the ghosts it guides home.",
    setting: 'Remote lighthouse during gathering storm',
    objective: 'Keep the light burning and help lost souls find peace',
    npcs: ['Old Keeper Barnabas', 'The Ghost Fleet (seeking guidance)', 'The Storm Hag (tries to extinguish the light)'],
    hooks: ['A relative was lost at sea here', 'You seek solitude and purpose', 'The keeper knew your past'],
  },
];

const vibes = [
  { id: 'all', name: 'All Vibes', icon: Sparkles, color: '#d4af37' },
  { id: 'cozy', name: 'Cozy', icon: Coffee, color: '#22c55e', description: 'Low-stakes, comforting adventures' },
  { id: 'dark', name: 'Dark', icon: Skull, color: '#991b1b', description: 'Grimdark themes, moral ambiguity, horror' },
  { id: 'epic', name: 'Epic', icon: Sword, color: '#d4af37', description: 'High-stakes, world-saving adventures' },
  { id: 'mystery', name: 'Mystery', icon: HelpCircle, color: '#6366f1', description: 'Investigation, puzzles, hidden truths' },
  { id: 'slice-of-life', name: 'Slice of Life', icon: Flower2, color: '#ec4899', description: 'Character-driven personal stories' },
];

const modes = [
  { id: 'all', name: 'All Modes', icon: Users },
  { id: 'solo', name: 'Solo', icon: User },
  { id: 'duet', name: 'Duet', icon: Heart },
  { id: 'group', name: 'Group', icon: Users },
];

export const AdventureGenerator: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedAdventure, setSelectedAdventure] = useState<typeof adventures[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const filteredAdventures = useMemo(() => {
    return adventures.filter(adv => {
      const matchesSearch = adv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adv.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVibe = selectedVibe === 'all' || adv.vibe === selectedVibe;
      const matchesMode = selectedMode === 'all' || adv.mode === selectedMode;
      return matchesSearch && matchesVibe && matchesMode;
    });
  }, [searchQuery, selectedVibe, selectedMode]);

  const getVibeConfig = (vibe: string) => {
    return vibes.find(v => v.id === vibe) || vibes[0];
  };

  const getModeConfig = (mode: string) => {
    return modes.find(m => m.id === mode) || modes[0];
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const openDetail = (adventure: typeof adventures[0]) => {
    setSelectedAdventure(adventure);
    setDetailOpen(true);
  };

  const rollRandomAdventure = () => {
    setIsRolling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredAdventures.length);
      const randomAdventure = filteredAdventures[randomIndex];
      if (randomAdventure) {
        setSelectedAdventure(randomAdventure);
        setDetailOpen(true);
      }
      setIsRolling(false);
    }, 500);
  };

  const getVibeCount = (vibeId: string) => {
    if (vibeId === 'all') return adventures.length;
    return adventures.filter(a => a.vibe === vibeId).length;
  };

  return (
    <GeneratorContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <GothicTitle variant="h3">Adventure Generator</GothicTitle>
        <Typography sx={{ color: '#d4af37', fontSize: '1.1rem', mb: 3 }}>
          50 D&D Adventure Hooks Across 5 Vibes
        </Typography>

        <RandomButton
          onClick={rollRandomAdventure}
          startIcon={<Dice6 className={isRolling ? 'dice-icon' : ''} size={24} />}
          disabled={isRolling}
        >
          {isRolling ? 'Rolling...' : 'Roll Random Adventure'}
        </RandomButton>
      </Box>

      {/* Search */}
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search adventures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#d4af37" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '12px',
              color: '#f4d03f',
              '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
              '&:hover fieldset': { borderColor: '#d4af37' },
              '&.Mui-focused fieldset': { borderColor: '#f59e0b' },
            },
          }}
        />
      </Box>

      {/* Vibe Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 2 }}>
        {vibes.map((vibe) => {
          const VibeIcon = vibe.icon;
          return (
            <Tooltip key={vibe.id} title={vibe.description || ''}>
              <FilterChip
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VibeIcon size={14} />
                    {vibe.name} ({getVibeCount(vibe.id)})
                  </Box>
                }
                selected={selectedVibe === vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
              />
            </Tooltip>
          );
        })}
      </Box>

      {/* Mode Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
        {modes.map((mode) => {
          const ModeIcon = mode.icon;
          return (
            <Chip
              key={mode.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ModeIcon size={14} />
                  {mode.name}
                </Box>
              }
              onClick={() => setSelectedMode(mode.id)}
              sx={{
                background: selectedMode === mode.id
                  ? 'rgba(139, 92, 246, 0.3)'
                  : 'rgba(139, 92, 246, 0.1)',
                color: '#a78bfa',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                cursor: 'pointer',
                '&:hover': { background: 'rgba(139, 92, 246, 0.2)' },
              }}
            />
          );
        })}
      </Box>

      {/* Adventures Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: 3,
        position: 'relative',
        zIndex: 1,
      }}>
        {filteredAdventures.map((adventure) => {
          const vibeConfig = getVibeConfig(adventure.vibe);
          const modeConfig = getModeConfig(adventure.mode);
          const VibeIcon = vibeConfig.icon;
          const ModeIcon = modeConfig.icon;
          const isFavorite = favorites.includes(adventure.id);

          return (
            <Fade in key={adventure.id}>
              <AdventureCard vibe={adventure.vibe} onClick={() => openDetail(adventure)}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <VibeChip
                        vibetype={adventure.vibe}
                        icon={<VibeIcon size={14} />}
                        label={adventure.vibe}
                        size="small"
                      />
                      <ModeChip
                        modetype={adventure.mode}
                        icon={<ModeIcon size={14} />}
                        label={adventure.mode}
                        size="small"
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(adventure.id); }}
                    >
                      <Bookmark
                        size={18}
                        fill={isFavorite ? '#d4af37' : 'none'}
                        color={isFavorite ? '#d4af37' : '#8b5cf6'}
                      />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: '#f4d03f',
                      fontWeight: 600,
                      fontFamily: '"Cinzel", serif',
                      mb: 1,
                    }}
                  >
                    {adventure.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#d1d5db',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      mb: 2,
                    }}
                  >
                    {adventure.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#9ca3af', fontSize: '0.85rem' }}>
                    <MapPin size={14} />
                    <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      {adventure.setting}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      size="small"
                      endIcon={<ChevronRight size={16} />}
                      sx={{ color: vibeConfig.color }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </AdventureCard>
            </Fade>
          );
        })}
      </Box>

      {/* Stats */}
      <Box sx={{
        mt: 4,
        p: 3,
        background: 'rgba(212, 175, 55, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        textAlign: 'center',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 700 }}>
              {adventures.length}
            </Typography>
            <Typography sx={{ color: '#f4d03f', fontSize: '0.9rem' }}>
              Adventures
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 700 }}>
              {vibes.length - 1}
            </Typography>
            <Typography sx={{ color: '#f4d03f', fontSize: '0.9rem' }}>
              Vibes
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#6366f1', fontWeight: 700 }}>
              {favorites.length}
            </Typography>
            <Typography sx={{ color: '#f4d03f', fontSize: '0.9rem' }}>
              Bookmarked
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d1a 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
          },
        }}
      >
        {selectedAdventure && (() => {
          const vibeConfig = getVibeConfig(selectedAdventure.vibe);
          const VibeIcon = vibeConfig.icon;
          return (
            <>
              <DialogTitle sx={{
                background: `linear-gradient(135deg, ${vibeConfig.color}20 0%, ${vibeConfig.color}10 100%)`,
                borderBottom: `1px solid ${vibeConfig.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ background: `${vibeConfig.color}30`, border: `2px solid ${vibeConfig.color}` }}>
                    <VibeIcon size={24} color={vibeConfig.color} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: '#f4d03f', fontWeight: 600, fontFamily: '"Cinzel", serif', fontSize: '1.3rem' }}>
                      {selectedAdventure.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <VibeChip vibetype={selectedAdventure.vibe} label={selectedAdventure.vibe} size="small" />
                      <ModeChip modetype={selectedAdventure.mode} label={selectedAdventure.mode} size="small" />
                    </Box>
                  </Box>
                </Box>
                <IconButton onClick={() => setDetailOpen(false)}>
                  <X size={20} color="#d4af37" />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Typography sx={{ color: '#d1d5db', fontSize: '1.05rem', lineHeight: 1.6, mb: 3 }}>
                  {selectedAdventure.description}
                </Typography>

                <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.2)', my: 2 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <MapPin size={16} color="#d4af37" />
                      <Typography sx={{ color: '#d4af37', fontWeight: 600 }}>Setting</Typography>
                    </Box>
                    <Typography sx={{ color: '#d1d5db' }}>{selectedAdventure.setting}</Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Target size={16} color="#22c55e" />
                      <Typography sx={{ color: '#22c55e', fontWeight: 600 }}>Objective</Typography>
                    </Box>
                    <Typography sx={{ color: '#d1d5db' }}>{selectedAdventure.objective}</Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Users size={16} color="#ec4899" />
                    <Typography sx={{ color: '#ec4899', fontWeight: 600 }}>NPCs</Typography>
                  </Box>
                  {selectedAdventure.npcs.map((npc, idx) => (
                    <NPCBadge key={idx}>
                      <Typography sx={{ color: '#f4d03f' }}>{npc}</Typography>
                    </NPCBadge>
                  ))}
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Scroll size={16} color="#8b5cf6" />
                    <Typography sx={{ color: '#8b5cf6', fontWeight: 600 }}>Adventure Hooks</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {selectedAdventure.hooks.map((hook, idx) => (
                      <HookBadge key={idx}>
                        <Dice6 size={14} color="#a78bfa" />
                        <Typography sx={{ color: '#c4b5fd' }}>{hook}</Typography>
                      </HookBadge>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<Bookmark size={18} />}
                    sx={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
                      color: '#000',
                      '&:hover': { background: 'linear-gradient(135deg, #c9a227 0%, #d97706 100%)' },
                    }}
                  >
                    Save to Campaign
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share2 size={18} />}
                    sx={{
                      borderColor: '#8b5cf6',
                      color: '#a78bfa',
                      '&:hover': { borderColor: '#a855f7', background: 'rgba(139, 92, 246, 0.1)' },
                    }}
                  >
                    Share
                  </Button>
                </Box>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>
    </GeneratorContainer>
  );
};

export default AdventureGenerator;
