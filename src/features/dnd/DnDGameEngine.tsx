/**
 * D&D GAME ENGINE
 * Complete D&D 5e implementation with AI DM for solo/multiplayer play
 * No human DM needed - fully automated storytelling and game management
 */

import React, { useState, useEffect } from 'react';
import { Shield, Sword, Dice6, Users, Bot, Map, Book, Backpack, Sparkles } from 'lucide-react';
import { DnDCharacter, DnDCampaign, DnDCombatEncounter, DnDQuest } from './types';
import { DiceRollerComponent as DiceRoller } from './DiceRoller';
import { CombatTracker } from './CombatTracker';
import { CharacterSheet } from './CharacterSheet';
import { AIDungeonMaster } from './AIDungeonMaster';
import { InventoryManager } from './InventoryManager';
import { QuestLog } from './QuestLog';
import { MultiplayerManager } from './MultiplayerManager';

export type GameMode = 'solo' | 'multiplayer';
export type GamePhase = 'character-creation' | 'exploration' | 'combat' | 'rest' | 'shopping';

export interface DnDGameState {
  mode: GameMode;
  phase: GamePhase;
  campaign: DnDCampaign;
  characters: DnDCharacter[];
  currentLocation: string;
  activeQuests: DnDQuest[];
  completedQuests: DnDQuest[];
  combatEncounter: DnDCombatEncounter | null;
  sessionHistory: GameEvent[];
  isAIDMActive: boolean;
}

export interface GameEvent {
  id: string;
  timestamp: string;
  type: 'combat' | 'dialogue' | 'exploration' | 'quest' | 'level-up' | 'item-found' | 'story';
  description: string;
  location: string;
  participants: string[];
}

export const DnDGameEngine: React.FC = () => {
  const [gameState, setGameState] = useState<DnDGameState>({
    mode: 'solo',
    phase: 'character-creation',
    campaign: {
      id: crypto.randomUUID(),
      name: 'The Chronicles of Kolhub',
      description: 'An epic adventure awaits...',
      level: 1,
      difficulty: 'normal',
      currentChapter: 1,
      totalChapters: 10,
      startedAt: new Date().toISOString()
    },
    characters: [],
    currentLocation: 'Tavern of the Wandering Moon',
    activeQuests: [],
    completedQuests: [],
    combatEncounter: null,
    sessionHistory: [],
    isAIDMActive: true
  });

  const [selectedView, setSelectedView] = useState<'game' | 'character' | 'inventory' | 'quests' | 'combat' | 'settings'>('game');
  const [aiDMResponse, setAIDMResponse] = useState<string>('');
  const [playerAction, setPlayerAction] = useState<string>('');

  // Initialize AI DM
  const aiDM = new AIDungeonMaster();

  useEffect(() => {
    // Load saved game if exists
    const savedGame = localStorage.getItem('dnd_game_state');
    if (savedGame) {
      setGameState(JSON.parse(savedGame));
    }
  }, []);

  useEffect(() => {
    // Auto-save game state
    localStorage.setItem('dnd_game_state', JSON.stringify(gameState));
  }, [gameState]);

  const handlePlayerAction = async (action: string) => {
    setPlayerAction(action);

    // Add to session history
    const event: GameEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: 'dialogue',
      description: `Player: ${action}`,
      location: gameState.currentLocation,
      participants: gameState.characters.map(c => c.name)
    };

    setGameState(prev => ({
      ...prev,
      sessionHistory: [...prev.sessionHistory, event]
    }));

    // Get AI DM response
    if (gameState.isAIDMActive) {
      const response = await aiDM.processPlayerAction(
        action,
        gameState,
        gameState.characters[0] // Main character
      );

      setAIDMResponse(response.narration);

      // Update game state based on AI response
      if (response.stateChanges) {
        setGameState(prev => ({
          ...prev,
          ...response.stateChanges
        }));
      }

      // Check for combat trigger
      if (response.triggerCombat) {
        setGameState(prev => ({
          ...prev,
          phase: 'combat',
          combatEncounter: response.combatEncounter
        }));
      }

      // Check for quest updates
      if (response.questUpdates) {
        setGameState(prev => ({
          ...prev,
          activeQuests: response.questUpdates.active,
          completedQuests: response.questUpdates.completed
        }));
      }
    }
  };

  const handleCombatAction = async (characterId: string, actionType: string, targetId?: string) => {
    if (!gameState.combatEncounter) return;

    const character = gameState.characters.find(c => c.id === characterId);
    if (!character) return;

    // Process combat action
    const result = await processCombatAction(character, actionType, targetId, gameState.combatEncounter);

    // Update combat state
    setGameState(prev => ({
      ...prev,
      combatEncounter: result.updatedEncounter
    }));

    // Get AI DM narration of combat
    const narration = await aiDM.narrateCombatAction(result);
    setAIDMResponse(narration);

    // Check if combat ended
    if (result.combatEnded) {
      setGameState(prev => ({
        ...prev,
        phase: 'exploration',
        combatEncounter: null
      }));

      // Award XP and loot
      const rewards = await aiDM.generateCombatRewards(result);
      applyRewards(rewards);
    }
  };

  const processCombatAction = async (
    character: DnDCharacter,
    actionType: string,
    targetId: string | undefined,
    encounter: DnDCombatEncounter
  ) => {
    // Implementation for combat actions
    const diceRoller = new DiceRoller();

    switch (actionType) {
      case 'attack':
        const attackRoll = diceRoller.roll('1d20');
        const damageRoll = diceRoller.roll(character.weapon?.damage || '1d8');

        const hitResult = attackRoll.total + character.attackBonus;
        const target = encounter.enemies.find(e => e.id === targetId);

        if (target && hitResult >= target.armorClass) {
          // Hit!
          target.currentHP -= damageRoll.total;
          return {
            success: true,
            attackRoll: hitResult,
            damage: damageRoll.total,
            targetName: target.name,
            updatedEncounter: encounter,
            combatEnded: encounter.enemies.every(e => e.currentHP <= 0)
          };
        } else {
          // Miss
          return {
            success: false,
            attackRoll: hitResult,
            targetName: target?.name || 'Unknown',
            updatedEncounter: encounter,
            combatEnded: false
          };
        }

      case 'cast-spell':
        // Spell casting logic
        return { updatedEncounter: encounter, combatEnded: false };

      case 'use-item':
        // Item usage logic
        return { updatedEncounter: encounter, combatEnded: false };

      default:
        return { updatedEncounter: encounter, combatEnded: false };
    }
  };

  const applyRewards = (rewards: any) => {
    setGameState(prev => ({
      ...prev,
      characters: prev.characters.map(char => ({
        ...char,
        experience: char.experience + rewards.xp,
        gold: char.gold + rewards.gold,
        inventory: [...char.inventory, ...rewards.items]
      }))
    }));
  };

  const startNewGame = (mode: GameMode) => {
    setGameState(prev => ({
      ...prev,
      mode,
      phase: 'character-creation'
    }));
  };

  const addCharacter = (character: DnDCharacter) => {
    setGameState(prev => ({
      ...prev,
      characters: [...prev.characters, character],
      phase: prev.mode === 'solo' ? 'exploration' : prev.phase
    }));

    // AI DM welcomes new character
    if (gameState.isAIDMActive) {
      aiDM.welcomeCharacter(character).then(welcome => {
        setAIDMResponse(welcome);
      });
    }
  };

  return (
    <div className="dnd-game-engine min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-6 bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Dice6 className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {gameState.campaign.name}
              </h1>
              <p className="text-sm text-gray-400">
                Chapter {gameState.campaign.currentChapter} • {gameState.currentLocation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Mode:</span>
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm">
              {gameState.mode === 'solo' ? '🎮 Solo' : '👥 Multiplayer'}
            </span>
            {gameState.isAIDMActive && (
              <span className="px-3 py-1 bg-green-500/20 rounded-full text-sm flex items-center gap-1">
                <Bot className="w-4 h-4" />
                AI DM Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {[
          { id: 'game', icon: Map, label: 'Adventure' },
          { id: 'character', icon: Shield, label: 'Character' },
          { id: 'inventory', icon: Backpack, label: 'Inventory' },
          { id: 'quests', icon: Book, label: 'Quests' },
          { id: 'combat', icon: Sword, label: 'Combat' },
          { id: 'settings', icon: Sparkles, label: 'Settings' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setSelectedView(id as any)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedView === id
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Game View */}
        <div className="lg:col-span-2 space-y-4">
          {selectedView === 'game' && gameState.phase === 'character-creation' && (
            <CharacterSheet
              onCharacterCreated={addCharacter}
              campaignLevel={gameState.campaign.level}
            />
          )}

          {selectedView === 'game' && gameState.phase === 'exploration' && (
            <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Map className="w-6 h-6 text-purple-400" />
                Exploration
              </h2>

              {/* AI DM Narration */}
              <div className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                <div className="flex items-start gap-3">
                  <Bot className="w-6 h-6 text-purple-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-300 mb-2">Dungeon Master</p>
                    <p className="text-gray-200 leading-relaxed">
                      {aiDMResponse || 'You find yourself in the Tavern of the Wandering Moon, a cozy establishment filled with the sounds of laughter and the smell of roasted meat. What would you like to do?'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Player Actions */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-300">What do you do?</label>
                <textarea
                  value={playerAction}
                  onChange={(e) => setPlayerAction(e.target.value)}
                  placeholder="Describe your action... (e.g., 'I approach the bartender and ask about rumors')"
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
                <button
                  onClick={() => handlePlayerAction(playerAction)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Take Action
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  'Look around',
                  'Talk to someone',
                  'Search for treasure',
                  'Rest',
                  'Check inventory',
                  'Use skill'
                ].map(action => (
                  <button
                    key={action}
                    onClick={() => handlePlayerAction(action)}
                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm transition-all"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'game' && gameState.phase === 'combat' && gameState.combatEncounter && (
            <CombatTracker
              encounter={gameState.combatEncounter}
              characters={gameState.characters}
              onCombatAction={handleCombatAction}
              aiDM={aiDM}
            />
          )}

          {selectedView === 'character' && (
            <div className="space-y-4">
              {gameState.characters.map(character => (
                <CharacterSheet
                  key={character.id}
                  character={character}
                  readonly={true}
                />
              ))}
            </div>
          )}

          {selectedView === 'inventory' && (
            <InventoryManager characters={gameState.characters} />
          )}

          {selectedView === 'quests' && (
            <QuestLog
              activeQuests={gameState.activeQuests}
              completedQuests={gameState.completedQuests}
            />
          )}

          {selectedView === 'combat' && (
            <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-bold mb-4">Combat Training</h2>
              <p className="text-gray-400">No active combat. Explore to find encounters!</p>
            </div>
          )}

          {selectedView === 'settings' && (
            <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30 space-y-4">
              <h2 className="text-xl font-bold mb-4">Game Settings</h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">AI Dungeon Master</span>
                  <input
                    type="checkbox"
                    checked={gameState.isAIDMActive}
                    onChange={(e) => setGameState(prev => ({ ...prev, isAIDMActive: e.target.checked }))}
                    className="w-5 h-5"
                  />
                </label>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                  <select
                    value={gameState.campaign.difficulty}
                    onChange={(e) => setGameState(prev => ({
                      ...prev,
                      campaign: { ...prev.campaign, difficulty: e.target.value as any }
                    }))}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-2 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                    <option value="deadly">Deadly</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Start a new game? Current progress will be saved.')) {
                      startNewGame('solo');
                    }
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
                >
                  New Game
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem('dnd_game_state');
                    window.location.reload();
                  }}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 rounded-lg border border-red-500/30"
                >
                  Reset All Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Quick Info */}
        <div className="space-y-4">
          {/* Party Overview */}
          <div className="bg-black/40 backdrop-blur-lg rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Party
            </h3>
            {gameState.characters.length === 0 ? (
              <p className="text-gray-400 text-sm">No characters yet</p>
            ) : (
              <div className="space-y-2">
                {gameState.characters.map(char => (
                  <div key={char.id} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{char.name}</span>
                      <span className="text-xs text-purple-400">Lv {char.level}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {char.race} {char.class}
                    </div>
                    {/* HP Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${(char.currentHP / char.maxHP) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {char.currentHP}/{char.maxHP} HP
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Quests Summary */}
          <div className="bg-black/40 backdrop-blur-lg rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Book className="w-5 h-5 text-purple-400" />
              Active Quests
            </h3>
            {gameState.activeQuests.length === 0 ? (
              <p className="text-gray-400 text-sm">No active quests</p>
            ) : (
              <div className="space-y-2">
                {gameState.activeQuests.slice(0, 3).map(quest => (
                  <div key={quest.id} className="bg-white/5 rounded-lg p-2">
                    <p className="text-sm font-semibold">{quest.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{quest.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dice Roller */}
          <DiceRoller />
        </div>
      </div>
    </div>
  );
};

export default DnDGameEngine;
