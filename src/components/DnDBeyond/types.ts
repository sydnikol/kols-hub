/**
 * Shared D&D Beyond character types
 */

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  hp: { current: number; max: number; temp?: number };
  ac: number;
  speed: number;
  initiative: number;
  proficiencyBonus: number;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  savingThrows: {
    str: boolean;
    dex: boolean;
    con: boolean;
    int: boolean;
    wis: boolean;
    cha: boolean;
  };
  skills: {
    acrobatics: boolean;
    animalHandling: boolean;
    arcana: boolean;
    athletics: boolean;
    deception: boolean;
    history: boolean;
    insight: boolean;
    intimidation: boolean;
    investigation: boolean;
    medicine: boolean;
    nature: boolean;
    perception: boolean;
    performance: boolean;
    persuasion: boolean;
    religion: boolean;
    sleightOfHand: boolean;
    stealth: boolean;
    survival: boolean;
  };
  spells?: { level: number; name: string; prepared: boolean }[];
  equipment?: { name: string; quantity: number; equipped: boolean }[];
  features?: { name: string; description: string; source: string }[];
  notes?: string;
  avatar?: string;
  lastPlayed?: Date;
}
