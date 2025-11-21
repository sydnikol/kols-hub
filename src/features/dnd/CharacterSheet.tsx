/**
 * CHARACTER SHEET
 * Complete D&D 5e character creation and display
 */

import React, { useState } from 'react';
import { Shield, Heart, Zap, Book, Sword, Coins } from 'lucide-react';
import { DnDCharacter, CharacterClass, CharacterRace, Alignment, AbilityScore } from './types';
import { DiceRoller } from './DiceRoller';

interface CharacterSheetProps {
  character?: DnDCharacter;
  readonly?: boolean;
  onCharacterCreated?: (character: DnDCharacter) => void;
  campaignLevel?: number;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  readonly = false,
  onCharacterCreated,
  campaignLevel = 1
}) => {
  const [formData, setFormData] = useState<Partial<DnDCharacter>>({
    name: '',
    class: 'Fighter',
    race: 'Human',
    level: campaignLevel,
    alignment: 'NG',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    background: 'Folk Hero',
    personality: '',
    ideals: '',
    bonds: '',
    flaws: '',
    backstory: ''
  });

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  const calculateHP = (constitutionScore: number, characterClass: CharacterClass, level: number): number => {
    const hitDice: Record<CharacterClass, number> = {
      Barbarian: 12,
      Bard: 8,
      Cleric: 8,
      Druid: 8,
      Fighter: 10,
      Monk: 8,
      Paladin: 10,
      Ranger: 10,
      Rogue: 8,
      Sorcerer: 6,
      Warlock: 8,
      Wizard: 6
    };

    const conModifier = calculateModifier(constitutionScore);
    const hitDie = hitDice[characterClass];

    // First level: max hit die + con modifier
    // Additional levels: average of hit die + con modifier
    const firstLevelHP = hitDie + conModifier;
    const additionalLevelsHP = (level - 1) * (Math.floor(hitDie / 2) + 1 + conModifier);

    return Math.max(1, firstLevelHP + additionalLevelsHP);
  };

  const calculateAC = (dexterityScore: number, armorType: string = 'none'): number => {
    const dexModifier = calculateModifier(dexterityScore);

    const baseAC: Record<string, number> = {
      none: 10 + dexModifier,
      light: 11 + dexModifier,
      medium: 14 + Math.min(dexModifier, 2),
      heavy: 18
    };

    return baseAC[armorType] || (10 + dexModifier);
  };

  const rollAbilityScores = () => {
    const diceRoller = new DiceRoller();
    const rollStat = () => {
      // Roll 4d6, drop lowest
      const rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    };

    setFormData(prev => ({
      ...prev,
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    }));
  };

  const useStandardArray = () => {
    // Standard array: 15, 14, 13, 12, 10, 8
    setFormData(prev => ({
      ...prev,
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    }));
  };

  const createCharacter = () => {
    const constitutionScore = formData.constitution || 10;
    const dexterityScore = formData.dexterity || 10;
    const level = formData.level || 1;

    const newCharacter: DnDCharacter = {
      id: crypto.randomUUID(),
      name: formData.name || 'Unnamed Hero',
      class: formData.class || 'Fighter',
      race: formData.race || 'Human',
      level: level,
      alignment: formData.alignment || 'NG',

      // Ability Scores
      strength: formData.strength || 10,
      dexterity: dexterityScore,
      constitution: constitutionScore,
      intelligence: formData.intelligence || 10,
      wisdom: formData.wisdom || 10,
      charisma: formData.charisma || 10,

      // Combat Stats
      maxHP: calculateHP(constitutionScore, formData.class || 'Fighter', level),
      currentHP: calculateHP(constitutionScore, formData.class || 'Fighter', level),
      armorClass: calculateAC(dexterityScore),
      initiative: calculateModifier(dexterityScore),
      speed: 30,
      attackBonus: calculateModifier(formData.strength || 10) + Math.ceil(level / 4) + 1,

      // Resources
      hitDice: '1d8',
      spellSlots: {
        level1: { max: 0, current: 0 },
        level2: { max: 0, current: 0 },
        level3: { max: 0, current: 0 },
        level4: { max: 0, current: 0 },
        level5: { max: 0, current: 0 },
        level6: { max: 0, current: 0 },
        level7: { max: 0, current: 0 },
        level8: { max: 0, current: 0 },
        level9: { max: 0, current: 0 }
      },

      // Skills & Proficiencies
      skills: [],
      savingThrows: ['strength', 'constitution'],
      proficiencies: ['All armor', 'Shields', 'Simple weapons', 'Martial weapons'],
      languages: ['Common'],

      // Equipment
      inventory: [],
      gold: 50,

      // Progression
      experience: 0,
      proficiencyBonus: Math.ceil(level / 4) + 1,

      // Spells
      knownSpells: [],
      preparedSpells: [],

      // Background
      background: formData.background || 'Folk Hero',
      personality: formData.personality || '',
      ideals: formData.ideals || '',
      bonds: formData.bonds || '',
      flaws: formData.flaws || '',
      backstory: formData.backstory || '',

      // Status
      conditions: [],
      inspiration: false,

      createdAt: new Date().toISOString()
    };

    if (onCharacterCreated) {
      onCharacterCreated(newCharacter);
    }
  };

  // If showing existing character (readonly)
  if (readonly && character) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
        {/* Character Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{character.name}</h2>
          <p className="text-gray-400">
            Level {character.level} {character.race} {character.class} • {character.alignment}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* HP */}
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Hit Points</span>
            </div>
            <div className="text-2xl font-bold">{character.currentHP}/{character.maxHP}</div>
          </div>

          {/* AC */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Armor Class</span>
            </div>
            <div className="text-2xl font-bold">{character.armorClass}</div>
          </div>

          {/* Initiative */}
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Initiative</span>
            </div>
            <div className="text-2xl font-bold">+{character.initiative}</div>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">Ability Scores</h3>
          <div className="grid grid-cols-6 gap-2">
            {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as AbilityScore[]).map(ability => (
              <div key={ability} className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400 uppercase mb-1">{ability.slice(0, 3)}</div>
                <div className="text-xl font-bold">{character[ability]}</div>
                <div className="text-sm text-purple-400">
                  {calculateModifier(character[ability]) >= 0 ? '+' : ''}
                  {calculateModifier(character[ability])}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Sword className="w-5 h-5 text-purple-400" />
            Equipment
          </h3>
          <div className="space-y-2">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Gold</span>
                <span className="flex items-center gap-1 font-bold">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  {character.gold}
                </span>
              </div>
            </div>
            {character.inventory.length === 0 ? (
              <p className="text-gray-500 text-sm">No items</p>
            ) : (
              character.inventory.map(item => (
                <div key={item.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                    <div className="text-sm text-gray-400">x{item.quantity}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Background */}
        {character.backstory && (
          <div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Book className="w-5 h-5 text-purple-400" />
              Backstory
            </h3>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{character.backstory}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Character Creation Form
  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold mb-4">Create Your Character</h2>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`w-full h-2 rounded-full mx-1 ${
                s <= step ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400 text-center">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Character Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your hero's name"
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Race</label>
              <select
                value={formData.race}
                onChange={(e) => setFormData(prev => ({ ...prev, race: e.target.value as CharacterRace }))}
                className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Human">Human</option>
                <option value="Elf">Elf</option>
                <option value="Dwarf">Dwarf</option>
                <option value="Halfling">Halfling</option>
                <option value="Dragonborn">Dragonborn</option>
                <option value="Gnome">Gnome</option>
                <option value="Half-Elf">Half-Elf</option>
                <option value="Half-Orc">Half-Orc</option>
                <option value="Tiefling">Tiefling</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Class</label>
              <select
                value={formData.class}
                onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value as CharacterClass }))}
                className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Barbarian">Barbarian</option>
                <option value="Bard">Bard</option>
                <option value="Cleric">Cleric</option>
                <option value="Druid">Druid</option>
                <option value="Fighter">Fighter</option>
                <option value="Monk">Monk</option>
                <option value="Paladin">Paladin</option>
                <option value="Ranger">Ranger</option>
                <option value="Rogue">Rogue</option>
                <option value="Sorcerer">Sorcerer</option>
                <option value="Warlock">Warlock</option>
                <option value="Wizard">Wizard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Alignment</label>
            <select
              value={formData.alignment}
              onChange={(e) => setFormData(prev => ({ ...prev, alignment: e.target.value as Alignment }))}
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="LG">Lawful Good</option>
              <option value="NG">Neutral Good</option>
              <option value="CG">Chaotic Good</option>
              <option value="LN">Lawful Neutral</option>
              <option value="TN">True Neutral</option>
              <option value="CN">Chaotic Neutral</option>
              <option value="LE">Lawful Evil</option>
              <option value="NE">Neutral Evil</option>
              <option value="CE">Chaotic Evil</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Ability Scores */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={rollAbilityScores}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Roll 4d6 (Drop Lowest)
            </button>
            <button
              onClick={useStandardArray}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Standard Array
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as AbilityScore[]).map(ability => (
              <div key={ability}>
                <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">
                  {ability}
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={formData[ability]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [ability]: parseInt(e.target.value) || 10 }))}
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-purple-400 mt-1">
                  Modifier: {calculateModifier(formData[ability] || 10) >= 0 ? '+' : ''}
                  {calculateModifier(formData[ability] || 10)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Background */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Background</label>
            <select
              value={formData.background}
              onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Acolyte">Acolyte</option>
              <option value="Criminal">Criminal</option>
              <option value="Folk Hero">Folk Hero</option>
              <option value="Noble">Noble</option>
              <option value="Sage">Sage</option>
              <option value="Soldier">Soldier</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Personality Traits</label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              placeholder="What makes your character unique?"
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Ideals</label>
            <textarea
              value={formData.ideals}
              onChange={(e) => setFormData(prev => ({ ...prev, ideals: e.target.value }))}
              placeholder="What do they believe in?"
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Bonds</label>
            <textarea
              value={formData.bonds}
              onChange={(e) => setFormData(prev => ({ ...prev, bonds: e.target.value }))}
              placeholder="Who or what matters to them?"
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Flaws</label>
            <textarea
              value={formData.flaws}
              onChange={(e) => setFormData(prev => ({ ...prev, flaws: e.target.value }))}
              placeholder="What are their weaknesses?"
              className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Step 4: Backstory */}
      {step === 4 && (
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Backstory</label>
          <textarea
            value={formData.backstory}
            onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
            placeholder="Tell your character's story..."
            className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={8}
          />
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">{formData.name || 'Unnamed Hero'}</h3>
            <p className="text-gray-300">
              Level {formData.level} {formData.race} {formData.class}
            </p>
            <p className="text-sm text-gray-400 mt-1">{formData.alignment} • {formData.background}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">HP</div>
              <div className="text-2xl font-bold">
                {calculateHP(formData.constitution || 10, formData.class || 'Fighter', formData.level || 1)}
              </div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">AC</div>
              <div className="text-2xl font-bold">
                {calculateAC(formData.dexterity || 10)}
              </div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Initiative</div>
              <div className="text-2xl font-bold">
                +{calculateModifier(formData.dexterity || 10)}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Ability Scores</h4>
            <div className="grid grid-cols-6 gap-2">
              {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as AbilityScore[]).map(ability => (
                <div key={ability} className="text-center">
                  <div className="text-xs text-gray-400 uppercase">{ability.slice(0, 3)}</div>
                  <div className="text-lg font-bold">{formData[ability]}</div>
                  <div className="text-xs text-purple-400">
                    {calculateModifier(formData[ability] || 10) >= 0 ? '+' : ''}
                    {calculateModifier(formData[ability] || 10)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {formData.backstory && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Backstory</h4>
              <p className="text-sm text-gray-300">{formData.backstory}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Back
          </button>
        )}
        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Next
          </button>
        ) : (
          <button
            onClick={createCharacter}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Create Character
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;
