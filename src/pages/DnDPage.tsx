import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sword,
  Shield,
  Sparkles,
  Dices,
  User,
  Users,
  BookOpen,
  Skull,
  Heart,
  Zap,
  Target,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Play,
  Save,
  X,
  Wand2,
  ScrollText,
  Crown,
  Flame,
  Droplet,
  Wind,
  Mountain,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  dndService,
  Character,
  Campaign,
  CharacterClass,
  CharacterRace,
  CharacterStats,
  DiceType,
  StoryEntry,
  Enemy,
} from '../services/dndService';

type ViewMode = 'home' | 'character-creation' | 'character-list' | 'campaign-list' | 'active-game' | 'character-detail';

interface DiceAnimation {
  id: string;
  dice: DiceType;
  result: number;
  x: number;
  y: number;
}

const DnDPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [diceAnimations, setDiceAnimations] = useState<DiceAnimation[]>([]);
  const [playerAction, setPlayerAction] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const storyLogRef = useRef<HTMLDivElement>(null);

  // Character Creation State
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    race: 'Human' as CharacterRace,
    class: 'Fighter' as CharacterClass,
    stats: null as CharacterStats | null,
    background: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (storyLogRef.current) {
      storyLogRef.current.scrollTop = storyLogRef.current.scrollHeight;
    }
  }, [selectedCampaign?.storyLog]);

  const loadData = async () => {
    const chars = await dndService.getCharacters();
    const camps = await dndService.getCampaigns();
    setCharacters(chars);
    setCampaigns(camps);
  };

  // Roll dice with animation
  const rollDice = (type: DiceType, count: number = 1, modifier: number = 0) => {
    const result = dndService.rollDice(type, count, modifier);

    // Create dice animations
    const newAnimations: DiceAnimation[] = result.results.map((val, idx) => ({
      id: `${Date.now()}_${idx}`,
      dice: type,
      result: val,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    setDiceAnimations(newAnimations);
    setTimeout(() => setDiceAnimations([]), 2000);

    return result;
  };

  const handleCreateCharacter = async () => {
    if (!newCharacter.name || !newCharacter.stats) {
      toast.error('Please complete all fields');
      return;
    }

    const character = dndService.createCharacter({
      name: newCharacter.name,
      race: newCharacter.race,
      class: newCharacter.class,
      stats: newCharacter.stats,
      background: newCharacter.background,
    });

    await dndService.saveCharacter(character);
    await loadData();
    toast.success('Character created!');
    setViewMode('character-list');
    setNewCharacter({
      name: '',
      race: 'Human',
      class: 'Fighter',
      stats: null,
      background: '',
    });
  };

  const handleCreateCampaign = async (isAIDM: boolean) => {
    if (characters.length === 0) {
      toast.error('Create a character first!');
      return;
    }

    const campaign = await dndService.createCampaign({
      name: isAIDM ? 'Solo Adventure' : 'Multiplayer Campaign',
      description: 'A new adventure begins...',
      isAIDM,
      characterIds: [characters[0].id],
      setting: 'Forgotten Realms',
    });

    await loadData();
    setSelectedCampaign(campaign);
    setSelectedCharacter(characters[0]);
    setViewMode('active-game');
    toast.success('Campaign created!');
  };

  const handlePlayerAction = async () => {
    if (!selectedCampaign || !playerAction.trim()) return;

    // Add player action to story log
    await dndService.addStoryEntry(selectedCampaign.id, {
      type: 'action',
      speaker: selectedCharacter?.name || 'Player',
      content: playerAction,
    });

    setIsAIThinking(true);

    // Get AI DM response
    const response = await dndService.getAIDMResponse(selectedCampaign.id, playerAction);

    setTimeout(async () => {
      await dndService.addStoryEntry(selectedCampaign.id, {
        type: 'narration',
        speaker: 'DM',
        content: response,
      });

      const updatedCampaign = await dndService.getCampaign(selectedCampaign.id);
      setSelectedCampaign(updatedCampaign);
      setIsAIThinking(false);
      setPlayerAction('');
    }, 1500);

    const updatedCampaign = await dndService.getCampaign(selectedCampaign.id);
    setSelectedCampaign(updatedCampaign);
  };

  const handleQuickRoll = (type: DiceType) => {
    const result = rollDice(type);
    if (selectedCampaign) {
      dndService.addStoryEntry(selectedCampaign.id, {
        type: 'dice_roll',
        speaker: selectedCharacter?.name || 'Player',
        content: `Rolled ${type}`,
        diceRoll: result,
      });
      dndService.getCampaign(selectedCampaign.id).then(setSelectedCampaign);
    }
    toast.success(`Rolled ${result.finalTotal}!`, {
      icon: result.criticalHit ? '🎉' : result.criticalFail ? '💀' : '🎲',
    });
  };

  const deleteCharacter = async (id: string) => {
    await dndService.deleteCharacter(id);
    await loadData();
    toast.success('Character deleted');
  };

  const deleteCampaign = async (id: string) => {
    await dndService.deleteCampaign(id);
    await loadData();
    toast.success('Campaign deleted');
  };

  // RENDER FUNCTIONS

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-block"
          >
            <Dices className="w-20 h-20 mx-auto mb-4 text-purple-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
            Dungeons & Dragons
          </h1>
          <p className="text-purple-300 text-lg">Your adventure awaits...</p>
        </motion.div>
      </div>

      {/* Main Menu */}
      <div className="p-6 space-y-4">
        <MenuCard
          icon={User}
          title="Create Character"
          description="Begin your journey by creating a new hero"
          gradient="from-blue-600 to-purple-600"
          onClick={() => setViewMode('character-creation')}
        />
        <MenuCard
          icon={Users}
          title="My Characters"
          description={`${characters.length} characters ready for adventure`}
          gradient="from-purple-600 to-pink-600"
          onClick={() => setViewMode('character-list')}
        />
        <MenuCard
          icon={Sword}
          title="Solo Adventure (AI DM)"
          description="Embark on a single-player campaign"
          gradient="from-pink-600 to-red-600"
          onClick={() => handleCreateCampaign(true)}
        />
        <MenuCard
          icon={Crown}
          title="My Campaigns"
          description={`${campaigns.length} active campaigns`}
          gradient="from-red-600 to-orange-600"
          onClick={() => setViewMode('campaign-list')}
        />
        <MenuCard
          icon={BookOpen}
          title="Campaign Guide"
          description="Learn the rules and mechanics"
          gradient="from-orange-600 to-yellow-600"
          onClick={() => toast('Coming soon!', { icon: '📖' })}
        />
      </div>

      {/* Dice Animations */}
      <AnimatePresence>
        {diceAnimations.map((anim) => (
          <motion.div
            key={anim.id}
            initial={{ opacity: 0, scale: 0, x: anim.x + '%', y: anim.y + '%' }}
            animate={{ opacity: 1, scale: 1.5, rotate: 360 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed z-50 pointer-events-none"
          >
            <div className="bg-purple-600 text-white rounded-lg p-4 shadow-2xl border-2 border-purple-400">
              <div className="text-3xl font-bold">{anim.result}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const renderCharacterCreation = () => {
    const classes: CharacterClass[] = [
      'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
      'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
    ];
    const races: CharacterRace[] = [
      'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn',
      'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling'
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
          <button onClick={() => setViewMode('home')} className="mb-4 text-white/80 hover:text-white">
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Create Character</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <label className="block text-purple-300 mb-2 font-semibold">Character Name</label>
            <input
              type="text"
              value={newCharacter.name}
              onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
              className="w-full bg-black/50 text-white border-2 border-purple-500/50 rounded-lg px-4 py-3 focus:border-purple-400 focus:outline-none"
              placeholder="Enter your hero's name..."
            />
          </motion.div>

          {/* Race Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <label className="block text-purple-300 mb-3 font-semibold">Race</label>
            <div className="grid grid-cols-3 gap-2">
              {races.map((race) => (
                <button
                  key={race}
                  onClick={() => setNewCharacter({ ...newCharacter, race })}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    newCharacter.race === race
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-black/50 text-purple-300 border border-purple-500/30 hover:border-purple-400'
                  }`}
                >
                  {race}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Class Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <label className="block text-purple-300 mb-3 font-semibold">Class</label>
            <div className="grid grid-cols-3 gap-2">
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setNewCharacter({ ...newCharacter, class: cls })}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    newCharacter.class === cls
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/50'
                      : 'bg-black/50 text-purple-300 border border-purple-500/30 hover:border-purple-400'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats Rolling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <label className="block text-purple-300 mb-3 font-semibold">Ability Scores</label>
            {!newCharacter.stats ? (
              <button
                onClick={() => setNewCharacter({ ...newCharacter, stats: dndService.generateStats() })}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                <Dices className="inline w-6 h-6 mr-2" />
                Roll Stats (4d6 drop lowest)
              </button>
            ) : (
              <div className="space-y-3">
                {Object.entries(newCharacter.stats).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between items-center bg-black/50 p-3 rounded-lg border border-purple-500/30">
                    <span className="text-purple-300 font-semibold capitalize">{stat}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-white">{value}</span>
                      <span className="text-purple-400 text-sm">
                        ({dndService.calculateModifier(value) >= 0 ? '+' : ''}
                        {dndService.calculateModifier(value)})
                      </span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setNewCharacter({ ...newCharacter, stats: dndService.generateStats() })}
                  className="w-full bg-purple-600/50 text-white py-2 rounded-lg hover:bg-purple-600 transition-all"
                >
                  Reroll Stats
                </button>
              </div>
            )}
          </motion.div>

          {/* Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
          >
            <label className="block text-purple-300 mb-2 font-semibold">Background (Optional)</label>
            <textarea
              value={newCharacter.background}
              onChange={(e) => setNewCharacter({ ...newCharacter, background: e.target.value })}
              className="w-full bg-black/50 text-white border-2 border-purple-500/50 rounded-lg px-4 py-3 focus:border-purple-400 focus:outline-none"
              placeholder="Describe your character's backstory..."
              rows={3}
            />
          </motion.div>

          {/* Create Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleCreateCharacter}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-4 rounded-lg font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
          >
            <Sparkles className="inline w-6 h-6 mr-2" />
            Create Character
          </motion.button>
        </div>
      </div>
    );
  };

  const renderCharacterList = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <button onClick={() => setViewMode('home')} className="mb-4 text-white/80 hover:text-white">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">My Characters</h1>
        <p className="text-purple-100">{characters.length} heroes ready for adventure</p>
      </div>

      <div className="p-6 space-y-4">
        {characters.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-purple-500/50" />
            <p className="text-purple-300">No characters yet</p>
            <button
              onClick={() => setViewMode('character-creation')}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Create Your First Character
            </button>
          </div>
        ) : (
          characters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onClick={() => {
                setSelectedCharacter(char);
                setViewMode('character-detail');
              }}
              onDelete={() => deleteCharacter(char.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderCampaignList = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <button onClick={() => setViewMode('home')} className="mb-4 text-white/80 hover:text-white">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <p className="text-purple-100">{campaigns.length} active campaigns</p>
      </div>

      <div className="p-6 space-y-4">
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Crown className="w-16 h-16 mx-auto mb-4 text-purple-500/50" />
            <p className="text-purple-300">No campaigns yet</p>
            <button
              onClick={() => setViewMode('home')}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Start a New Campaign
            </button>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClick={async () => {
                setSelectedCampaign(campaign);
                const char = await dndService.getCharacter(campaign.players[0]);
                setSelectedCharacter(char);
                setViewMode('active-game');
              }}
              onDelete={() => deleteCampaign(campaign.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderActiveGame = () => {
    if (!selectedCampaign || !selectedCharacter) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black pb-32">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg sticky top-0 z-20">
          <button onClick={() => setViewMode('campaign-list')} className="mb-2 text-white/80 hover:text-white">
            ← Back to Campaigns
          </button>
          <h1 className="text-xl font-bold">{selectedCampaign.name}</h1>
          <p className="text-sm text-purple-100">{selectedCampaign.setting} • {selectedCampaign.difficulty}</p>
        </div>

        {/* Character Quick Stats */}
        <div className="bg-black/50 border-b border-purple-500/30 p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <Heart className="w-4 h-4 mx-auto mb-1 text-red-400" />
              <div className="text-white font-bold">{selectedCharacter.hp}/{selectedCharacter.maxHp}</div>
              <div className="text-xs text-purple-300">HP</div>
            </div>
            <div>
              <Shield className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <div className="text-white font-bold">{selectedCharacter.ac}</div>
              <div className="text-xs text-purple-300">AC</div>
            </div>
            <div>
              <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
              <div className="text-white font-bold">Lv{selectedCharacter.level}</div>
              <div className="text-xs text-purple-300">Level</div>
            </div>
            <div>
              <Target className="w-4 h-4 mx-auto mb-1 text-green-400" />
              <div className="text-white font-bold">+{selectedCharacter.initiative}</div>
              <div className="text-xs text-purple-300">Init</div>
            </div>
          </div>
        </div>

        {/* Story Log */}
        <div
          ref={storyLogRef}
          className="p-4 space-y-3 max-h-[50vh] overflow-y-auto"
        >
          {selectedCampaign.storyLog.length === 0 ? (
            <div className="text-center py-8 text-purple-400">
              <ScrollText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Your adventure begins here...</p>
            </div>
          ) : (
            selectedCampaign.storyLog.map((entry, idx) => (
              <StoryLogEntry key={entry.id || idx} entry={entry} />
            ))
          )}
          {isAIThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </motion.div>
                <span className="text-purple-300">The DM is thinking...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Dice Roller Bar */}
        <div className="fixed bottom-24 left-0 right-0 bg-black/90 border-t border-purple-500/30 p-3">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {(['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as DiceType[]).map((dice) => (
              <button
                key={dice}
                onClick={() => handleQuickRoll(dice)}
                className="flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {dice}
              </button>
            ))}
          </div>
        </div>

        {/* Action Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-purple-900/50 to-transparent p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={playerAction}
              onChange={(e) => setPlayerAction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePlayerAction()}
              placeholder="What do you do?"
              className="flex-1 bg-black/70 text-white border-2 border-purple-500/50 rounded-lg px-4 py-3 focus:border-purple-400 focus:outline-none"
            />
            <button
              onClick={handlePlayerAction}
              disabled={!playerAction.trim() || isAIThinking}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCharacterDetail = () => {
    if (!selectedCharacter) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
          <button onClick={() => setViewMode('character-list')} className="mb-4 text-white/80 hover:text-white">
            ← Back
          </button>
          <h1 className="text-2xl font-bold">{selectedCharacter.name}</h1>
          <p className="text-purple-100">
            Level {selectedCharacter.level} {selectedCharacter.race} {selectedCharacter.class}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-purple-300 font-bold mb-4 text-lg">Ability Scores</h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(selectedCharacter.stats).map(([stat, value]) => (
                <div key={stat} className="bg-black/50 p-4 rounded-lg text-center border border-purple-500/30">
                  <div className="text-purple-300 text-xs uppercase mb-1">{stat.slice(0, 3)}</div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-purple-400 text-sm">
                    {dndService.calculateModifier(value) >= 0 ? '+' : ''}
                    {dndService.calculateModifier(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-purple-300 font-bold mb-4 text-lg">Combat Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded-lg border border-red-500/30">
                <Heart className="w-6 h-6 text-red-400 mb-2" />
                <div className="text-white font-bold text-xl">{selectedCharacter.hp} / {selectedCharacter.maxHp}</div>
                <div className="text-purple-300 text-sm">Hit Points</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-blue-500/30">
                <Shield className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-white font-bold text-xl">{selectedCharacter.ac}</div>
                <div className="text-purple-300 text-sm">Armor Class</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-yellow-500/30">
                <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="text-white font-bold text-xl">+{selectedCharacter.initiative}</div>
                <div className="text-purple-300 text-sm">Initiative</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-green-500/30">
                <Target className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-white font-bold text-xl">+{selectedCharacter.proficiencyBonus}</div>
                <div className="text-purple-300 text-sm">Proficiency</div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-purple-300 font-bold mb-4 text-lg">Skills</h2>
            <div className="space-y-2">
              {selectedCharacter.skills.map((skill) => (
                <div key={skill.name} className="flex justify-between items-center bg-black/50 p-3 rounded-lg border border-purple-500/30">
                  <span className={`font-medium ${skill.proficient ? 'text-yellow-400' : 'text-purple-300'}`}>
                    {skill.proficient && '★ '}{skill.name}
                  </span>
                  <span className="text-white font-bold">
                    {skill.modifier >= 0 ? '+' : ''}{skill.modifier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-purple-300 font-bold mb-4 text-lg">Inventory</h2>
            <div className="space-y-2">
              {selectedCharacter.inventory.map((item) => (
                <div key={item.id} className="bg-black/50 p-3 rounded-lg border border-purple-500/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-medium ${item.magical ? 'text-purple-400' : 'text-white'}`}>
                        {item.magical && <Sparkles className="inline w-4 h-4 mr-1" />}
                        {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                      </div>
                      <div className="text-purple-300 text-sm">{item.description}</div>
                      {item.damage && <div className="text-red-400 text-sm">Damage: {item.damage}</div>}
                      {item.armorClass && <div className="text-blue-400 text-sm">AC: +{item.armorClass}</div>}
                    </div>
                    <div className="text-yellow-400 text-sm">{item.value}gp</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spells */}
          {selectedCharacter.spells.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-purple-300 font-bold mb-4 text-lg">Spells</h2>
              <div className="space-y-3">
                {selectedCharacter.spells.map((spell) => (
                  <div key={spell.id} className="bg-black/50 p-4 rounded-lg border border-purple-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-purple-400 font-bold">{spell.name}</div>
                        <div className="text-purple-300 text-sm">Level {spell.level} {spell.school}</div>
                      </div>
                      <Wand2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-white text-sm mb-2">{spell.description}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-purple-300">
                      <div>Cast: {spell.castingTime}</div>
                      <div>Range: {spell.range}</div>
                      <div>Duration: {spell.duration}</div>
                      {spell.damage && <div className="text-red-400">Damage: {spell.damage}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Background */}
          {selectedCharacter.background && (
            <div className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h2 className="text-purple-300 font-bold mb-4 text-lg">Background</h2>
              <p className="text-white">{selectedCharacter.background}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // MAIN RENDER
  switch (viewMode) {
    case 'character-creation':
      return renderCharacterCreation();
    case 'character-list':
      return renderCharacterList();
    case 'campaign-list':
      return renderCampaignList();
    case 'active-game':
      return renderActiveGame();
    case 'character-detail':
      return renderCharacterDetail();
    default:
      return renderHome();
  }
};

// COMPONENT: Menu Card
const MenuCard: React.FC<{
  icon: any;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}> = ({ icon: Icon, title, description, gradient, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full bg-gradient-to-r ${gradient} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left`}
  >
    <div className="flex items-start space-x-4">
      <div className="bg-white/20 p-3 rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
      <ChevronRight className="w-6 h-6 opacity-50" />
    </div>
  </motion.button>
);

// COMPONENT: Character Card
const CharacterCard: React.FC<{
  character: Character;
  onClick: () => void;
  onDelete: () => void;
}> = ({ character, onClick, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30 shadow-lg"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1" onClick={onClick}>
        <h3 className="text-xl font-bold text-white mb-1">{character.name}</h3>
        <p className="text-purple-300">
          Level {character.level} {character.race} {character.class}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-red-400 hover:text-red-300 p-2"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
    <div className="grid grid-cols-4 gap-2 mb-4">
      <StatBubble icon={Heart} value={`${character.hp}/${character.maxHp}`} label="HP" color="red" />
      <StatBubble icon={Shield} value={character.ac} label="AC" color="blue" />
      <StatBubble icon={Zap} value={`+${character.initiative}`} label="Init" color="yellow" />
      <StatBubble icon={Target} value={`+${character.proficiencyBonus}`} label="Prof" color="green" />
    </div>
    <button
      onClick={onClick}
      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
    >
      View Details
    </button>
  </motion.div>
);

// COMPONENT: Campaign Card
const CampaignCard: React.FC<{
  campaign: Campaign;
  onClick: () => void;
  onDelete: () => void;
}> = ({ campaign, onClick, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30 shadow-lg"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-1">{campaign.name}</h3>
        <p className="text-purple-300 text-sm">{campaign.description}</p>
        <div className="flex items-center space-x-2 mt-2">
          {campaign.isAIDM && (
            <span className="bg-purple-600/50 text-purple-200 text-xs px-2 py-1 rounded">AI DM</span>
          )}
          <span className="bg-black/50 text-purple-200 text-xs px-2 py-1 rounded">{campaign.setting}</span>
          <span className="bg-black/50 text-purple-200 text-xs px-2 py-1 rounded">{campaign.difficulty}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-red-400 hover:text-red-300 p-2"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={onClick}
        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
      >
        <Play className="inline w-4 h-4 mr-1" />
        Continue Adventure
      </button>
    </div>
  </motion.div>
);

// COMPONENT: Stat Bubble
const StatBubble: React.FC<{
  icon: any;
  value: string | number;
  label: string;
  color: string;
}> = ({ icon: Icon, value, label, color }) => {
  const colorMap: Record<string, string> = {
    red: 'text-red-400 border-red-500/30',
    blue: 'text-blue-400 border-blue-500/30',
    yellow: 'text-yellow-400 border-yellow-500/30',
    green: 'text-green-400 border-green-500/30',
    purple: 'text-purple-400 border-purple-500/30',
  };

  return (
    <div className={`bg-black/50 p-2 rounded-lg text-center border ${colorMap[color]}`}>
      <Icon className={`w-4 h-4 mx-auto mb-1 ${colorMap[color].split(' ')[0]}`} />
      <div className="text-white font-bold text-sm">{value}</div>
      <div className="text-purple-300 text-xs">{label}</div>
    </div>
  );
};

// COMPONENT: Story Log Entry
const StoryLogEntry: React.FC<{ entry: StoryEntry }> = ({ entry }) => {
  const getEntryStyle = () => {
    switch (entry.type) {
      case 'narration':
        return 'bg-purple-900/30 border-purple-500/30';
      case 'dialogue':
        return 'bg-blue-900/30 border-blue-500/30';
      case 'action':
        return 'bg-green-900/30 border-green-500/30';
      case 'combat':
        return 'bg-red-900/30 border-red-500/30';
      case 'dice_roll':
        return 'bg-yellow-900/30 border-yellow-500/30';
      default:
        return 'bg-gray-900/30 border-gray-500/30';
    }
  };

  const getIcon = () => {
    switch (entry.type) {
      case 'narration':
        return <BookOpen className="w-4 h-4" />;
      case 'dialogue':
        return <Users className="w-4 h-4" />;
      case 'action':
        return <Sword className="w-4 h-4" />;
      case 'combat':
        return <Skull className="w-4 h-4" />;
      case 'dice_roll':
        return <Dices className="w-4 h-4" />;
      default:
        return <ScrollText className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-lg p-4 border ${getEntryStyle()}`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-purple-400 mt-1">{getIcon()}</div>
        <div className="flex-1">
          {entry.speaker && (
            <div className="text-purple-400 font-semibold text-sm mb-1">{entry.speaker}</div>
          )}
          <div className="text-white">{entry.content}</div>
          {entry.diceRoll && (
            <div className="mt-2 bg-black/50 p-2 rounded border border-purple-500/30">
              <div className="flex items-center space-x-2">
                <Dices className="w-4 h-4 text-yellow-400" />
                <span className="text-purple-300 text-sm">
                  {entry.diceRoll.count}{entry.diceRoll.dice}
                  {entry.diceRoll.modifier !== 0 && ` ${entry.diceRoll.modifier >= 0 ? '+' : ''}${entry.diceRoll.modifier}`}
                </span>
                <span className="text-white font-bold">= {entry.diceRoll.finalTotal}</span>
                {entry.diceRoll.criticalHit && <span className="text-yellow-400">CRITICAL!</span>}
                {entry.diceRoll.criticalFail && <span className="text-red-400">FUMBLE!</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DnDPage;
