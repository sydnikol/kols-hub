/**
 * Ancestry.com Integration Service
 *
 * Note: Ancestry.com doesn't have a public API, so we'll use alternative methods:
 * 1. GEDCOM file import (standard genealogy format)
 * 2. Manual ancestor entry
 * 3. FamilySearch API (open alternative)
 */

export interface Ancestor {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  occupation?: string;
  relation: string; // e.g., "Great-grandmother", "3rd great-grandfather"
  generation: number; // 1 = parents, 2 = grandparents, etc.
  stories?: string[];
  personality?: string;
  culturalBackground?: string[];
  photoUrl?: string;
  documents?: AncestorDocument[];
  healthHistory?: HealthRecord[];
  recipes?: FamilyRecipe[];
  languages?: string[];
}

export interface AncestorDocument {
  id: string;
  type: 'birth_certificate' | 'marriage_certificate' | 'photo' | 'letter' | 'other';
  title: string;
  url?: string;
  description?: string;
  date?: string;
}

export interface HealthRecord {
  condition: string;
  notes?: string;
}

export interface FamilyRecipe {
  id: string;
  name: string;
  description: string;
  ingredients?: string[];
  culturalSignificance?: string;
}

export interface FamilyTree {
  userId: string;
  ancestors: Ancestor[];
  lastUpdated: Date;
}

class AncestryService {
  private readonly STORAGE_KEY = 'family_tree';

  /**
   * Import ancestors from a GEDCOM file
   */
  async importGEDCOM(file: File): Promise<Ancestor[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const gedcomText = e.target?.result as string;
          const ancestors = this.parseGEDCOM(gedcomText);
          this.saveAncestors(ancestors);
          resolve(ancestors);
        } catch (error) {
          reject(new Error('Failed to parse GEDCOM file: ' + error));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse GEDCOM format (basic parser)
   */
  private parseGEDCOM(gedcomText: string): Ancestor[] {
    const ancestors: Ancestor[] = [];
    const lines = gedcomText.split('\n');
    let currentPerson: Partial<Ancestor> | null = null;
    let personId = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Start of individual record
      if (line.includes('INDI')) {
        if (currentPerson && currentPerson.name) {
          ancestors.push(currentPerson as Ancestor);
        }
        currentPerson = {
          id: `ancestor_${++personId}`,
          generation: 1,
          relation: 'Ancestor',
        };
      }

      // Name
      if (line.includes('NAME') && currentPerson) {
        const name = line.split('NAME')[1]?.trim().replace(/\//g, '');
        if (name) currentPerson.name = name;
      }

      // Birth year
      if (line.includes('BIRT') && currentPerson) {
        // Look for date in next few lines
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const dateLine = lines[j];
          if (dateLine.includes('DATE')) {
            const yearMatch = dateLine.match(/\d{4}/);
            if (yearMatch) {
              currentPerson.birthYear = parseInt(yearMatch[0]);
            }
            break;
          }
        }
      }

      // Death year
      if (line.includes('DEAT') && currentPerson) {
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const dateLine = lines[j];
          if (dateLine.includes('DATE')) {
            const yearMatch = dateLine.match(/\d{4}/);
            if (yearMatch) {
              currentPerson.deathYear = parseInt(yearMatch[0]);
            }
            break;
          }
        }
      }

      // Birth place
      if (line.includes('PLAC') && currentPerson && !currentPerson.birthPlace) {
        const place = line.split('PLAC')[1]?.trim();
        if (place) currentPerson.birthPlace = place;
      }

      // Occupation
      if (line.includes('OCCU') && currentPerson) {
        const occupation = line.split('OCCU')[1]?.trim();
        if (occupation) currentPerson.occupation = occupation;
      }
    }

    // Add last person
    if (currentPerson && currentPerson.name) {
      ancestors.push(currentPerson as Ancestor);
    }

    return ancestors;
  }

  /**
   * Add a single ancestor manually
   */
  async addAncestor(ancestor: Omit<Ancestor, 'id'>): Promise<Ancestor> {
    const newAncestor: Ancestor = {
      ...ancestor,
      id: `ancestor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const ancestors = await this.getAncestors();
    ancestors.push(newAncestor);
    await this.saveAncestors(ancestors);

    return newAncestor;
  }

  /**
   * Get all ancestors
   */
  async getAncestors(): Promise<Ancestor[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const tree: FamilyTree = JSON.parse(stored);
      return tree.ancestors || [];
    } catch (error) {
      console.error('Failed to load ancestors:', error);
      return [];
    }
  }

  /**
   * Save ancestors to local storage
   */
  private async saveAncestors(ancestors: Ancestor[]): Promise<void> {
    const tree: FamilyTree = {
      userId: 'user_1', // TODO: Get from auth
      ancestors,
      lastUpdated: new Date(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tree));
  }

  /**
   * Generate ancestor personality based on their info
   */
  generatePersonality(ancestor: Ancestor): string {
    const traits: string[] = [];

    if (ancestor.occupation) {
      traits.push(`experienced ${ancestor.occupation}`);
    }

    if (ancestor.birthYear && ancestor.birthYear < 1900) {
      traits.push('wise from a bygone era');
    }

    if (ancestor.culturalBackground && ancestor.culturalBackground.length > 0) {
      traits.push(`rooted in ${ancestor.culturalBackground.join(' and ')} traditions`);
    }

    traits.push('connected to ancestral wisdom');
    traits.push('protective of family');

    return traits.join(', ');
  }

  /**
   * Get ancestors formatted for NPC summoner
   */
  async getAncestorsAsNPCs() {
    const ancestors = await this.getAncestors();

    return ancestors.map(ancestor => ({
      id: ancestor.id,
      name: ancestor.name,
      type: 'ancestral' as const,
      era: this.getEraFromYear(ancestor.birthYear),
      personality: ancestor.personality || this.generatePersonality(ancestor),
      category: 'Ancestor',
      metadata: {
        birthYear: ancestor.birthYear,
        deathYear: ancestor.deathYear,
        birthPlace: ancestor.birthPlace,
        occupation: ancestor.occupation,
        relation: ancestor.relation,
        generation: ancestor.generation,
      },
    }));
  }

  /**
   * Determine historical era from birth year
   */
  private getEraFromYear(year?: number): string | null {
    if (!year) return null;

    if (year >= 2000) return 'Contemporary';
    if (year >= 1990) return 'MillennialEra';
    if (year >= 1960) return 'CivilRightsEra';
    if (year >= 1920) return 'HarlemRenaissance1920';
    if (year >= 1900) return 'Victorian';
    if (year >= 1850) return 'Industrial';
    if (year >= 1800) return 'Colonial';
    return 'Historical';
  }

  /**
   * Search for ancestor by name
   */
  async searchAncestor(query: string): Promise<Ancestor[]> {
    const ancestors = await this.getAncestors();
    const lowercaseQuery = query.toLowerCase();

    return ancestors.filter(ancestor =>
      ancestor.name.toLowerCase().includes(lowercaseQuery) ||
      ancestor.occupation?.toLowerCase().includes(lowercaseQuery) ||
      ancestor.birthPlace?.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Delete an ancestor
   */
  async deleteAncestor(ancestorId: string): Promise<void> {
    const ancestors = await this.getAncestors();
    const filtered = ancestors.filter(a => a.id !== ancestorId);
    await this.saveAncestors(filtered);
  }

  /**
   * Update an ancestor
   */
  async updateAncestor(ancestorId: string, updates: Partial<Ancestor>): Promise<Ancestor | null> {
    const ancestors = await this.getAncestors();
    const index = ancestors.findIndex(a => a.id === ancestorId);

    if (index === -1) return null;

    ancestors[index] = { ...ancestors[index], ...updates };
    await this.saveAncestors(ancestors);

    return ancestors[index];
  }

  /**
   * Add a document to an ancestor
   */
  async addDocument(ancestorId: string, document: Omit<AncestorDocument, 'id'>): Promise<void> {
    const ancestor = await this.updateAncestor(ancestorId, {
      documents: [
        ...(await this.getAncestors()).find(a => a.id === ancestorId)?.documents || [],
        { ...document, id: `doc_${Date.now()}` }
      ]
    });
  }

  /**
   * Add a family recipe to an ancestor
   */
  async addRecipe(ancestorId: string, recipe: Omit<FamilyRecipe, 'id'>): Promise<void> {
    const ancestors = await this.getAncestors();
    const ancestor = ancestors.find(a => a.id === ancestorId);

    if (ancestor) {
      await this.updateAncestor(ancestorId, {
        recipes: [
          ...(ancestor.recipes || []),
          { ...recipe, id: `recipe_${Date.now()}` }
        ]
      });
    }
  }

  /**
   * Get all family recipes across all ancestors
   */
  async getAllFamilyRecipes(): Promise<Array<FamilyRecipe & { ancestorName: string }>> {
    const ancestors = await this.getAncestors();
    const recipes: Array<FamilyRecipe & { ancestorName: string }> = [];

    ancestors.forEach(ancestor => {
      if (ancestor.recipes) {
        ancestor.recipes.forEach(recipe => {
          recipes.push({ ...recipe, ancestorName: ancestor.name });
        });
      }
    });

    return recipes;
  }

  /**
   * Get family health history for health dashboard integration
   */
  async getFamilyHealthHistory(): Promise<Array<{ ancestor: string; conditions: HealthRecord[] }>> {
    const ancestors = await this.getAncestors();

    return ancestors
      .filter(a => a.healthHistory && a.healthHistory.length > 0)
      .map(a => ({
        ancestor: a.name,
        conditions: a.healthHistory!
      }));
  }

  /**
   * Get migration patterns based on birth places
   */
  async getMigrationPatterns(): Promise<Array<{ place: string; count: number; ancestors: string[] }>> {
    const ancestors = await this.getAncestors();
    const placeMap = new Map<string, string[]>();

    ancestors.forEach(ancestor => {
      if (ancestor.birthPlace) {
        const existing = placeMap.get(ancestor.birthPlace) || [];
        existing.push(ancestor.name);
        placeMap.set(ancestor.birthPlace, existing);
      }
    });

    return Array.from(placeMap.entries()).map(([place, names]) => ({
      place,
      count: names.length,
      ancestors: names
    }));
  }

  /**
   * Get cultural traditions summary
   */
  async getCulturalTraditions(): Promise<Map<string, string[]>> {
    const ancestors = await this.getAncestors();
    const traditions = new Map<string, string[]>();

    ancestors.forEach(ancestor => {
      if (ancestor.culturalBackground) {
        ancestor.culturalBackground.forEach(culture => {
          if (!traditions.has(culture)) {
            traditions.set(culture, []);
          }
          traditions.get(culture)!.push(ancestor.name);
        });
      }
    });

    return traditions;
  }

  /**
   * Export family tree to JSON
   */
  async exportToJSON(): Promise<string> {
    const tree = await this.getAncestors();
    return JSON.stringify(tree, null, 2);
  }

  /**
   * Import family tree from JSON
   */
  async importFromJSON(jsonData: string): Promise<void> {
    try {
      const ancestors = JSON.parse(jsonData) as Ancestor[];
      await this.saveAncestors(ancestors);
    } catch (error) {
      throw new Error('Failed to import JSON data: ' + error);
    }
  }

  /**
   * Get ancestors by generation
   */
  async getAncestorsByGeneration(generation: number): Promise<Ancestor[]> {
    const ancestors = await this.getAncestors();
    return ancestors.filter(a => a.generation === generation);
  }

  /**
   * Calculate family statistics
   */
  async getStatistics() {
    const ancestors = await this.getAncestors();

    const lifespans = ancestors
      .filter(a => a.birthYear && a.deathYear)
      .map(a => a.deathYear! - a.birthYear!);

    const cultures = new Set(
      ancestors.flatMap(a => a.culturalBackground || [])
    );

    const occupations = new Set(
      ancestors.map(a => a.occupation).filter(Boolean)
    );

    return {
      totalAncestors: ancestors.length,
      generations: Math.max(...ancestors.map(a => a.generation), 0),
      averageLifespan: lifespans.length > 0
        ? Math.round(lifespans.reduce((a, b) => a + b, 0) / lifespans.length)
        : 0,
      cultures: Array.from(cultures),
      occupations: Array.from(occupations),
      totalStories: ancestors.reduce((sum, a) => sum + (a.stories?.length || 0), 0),
      totalRecipes: ancestors.reduce((sum, a) => sum + (a.recipes?.length || 0), 0),
      totalDocuments: ancestors.reduce((sum, a) => sum + (a.documents?.length || 0), 0)
    };
  }

  /**
   * Download family tree as JSON file
   */
  async downloadAsJSON(filename: string = 'family-tree.json'): Promise<void> {
    const jsonData = await this.exportToJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    this.triggerDownload(blob, filename);
  }

  /**
   * Export family tree to CSV format
   */
  async exportToCSV(): Promise<string> {
    const ancestors = await this.getAncestors();

    // CSV Headers
    const headers = [
      'Name',
      'Birth Year',
      'Death Year',
      'Birth Place',
      'Relation',
      'Generation',
      'Occupation',
      'Cultural Background',
      'Languages',
      'Stories Count',
      'Recipes Count'
    ];

    // CSV Rows
    const rows = ancestors.map(a => [
      a.name,
      a.birthYear || '',
      a.deathYear || '',
      a.birthPlace || '',
      a.relation,
      a.generation,
      a.occupation || '',
      (a.culturalBackground || []).join('; '),
      (a.languages || []).join('; '),
      (a.stories || []).length,
      (a.recipes || []).length
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Download family tree as CSV file
   */
  async downloadAsCSV(filename: string = 'family-tree.csv'): Promise<void> {
    const csvData = await this.exportToCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    this.triggerDownload(blob, filename);
  }

  /**
   * Export family tree to GEDCOM format (simplified)
   */
  async exportToGEDCOM(): Promise<string> {
    const ancestors = await this.getAncestors();

    let gedcom = '0 HEAD\n';
    gedcom += '1 SOUR KOL Family Tree\n';
    gedcom += '1 GEDC\n';
    gedcom += '2 VERS 5.5.1\n';
    gedcom += '2 FORM LINEAGE-LINKED\n';
    gedcom += '1 CHAR UTF-8\n';

    // Add individuals
    ancestors.forEach((ancestor, index) => {
      const id = `@I${index + 1}@`;
      gedcom += `0 ${id} INDI\n`;
      gedcom += `1 NAME ${ancestor.name}\n`;

      if (ancestor.birthYear) {
        gedcom += '1 BIRT\n';
        gedcom += `2 DATE ${ancestor.birthYear}\n`;
        if (ancestor.birthPlace) {
          gedcom += `2 PLAC ${ancestor.birthPlace}\n`;
        }
      }

      if (ancestor.deathYear) {
        gedcom += '1 DEAT\n';
        gedcom += `2 DATE ${ancestor.deathYear}\n`;
      }

      if (ancestor.occupation) {
        gedcom += `1 OCCU ${ancestor.occupation}\n`;
      }

      // Add notes for stories
      if (ancestor.stories && ancestor.stories.length > 0) {
        ancestor.stories.forEach(story => {
          gedcom += `1 NOTE ${story}\n`;
        });
      }
    });

    gedcom += '0 TRLR\n';
    return gedcom;
  }

  /**
   * Download family tree as GEDCOM file
   */
  async downloadAsGEDCOM(filename: string = 'family-tree.ged'): Promise<void> {
    const gedcomData = await this.exportToGEDCOM();
    const blob = new Blob([gedcomData], { type: 'text/plain' });
    this.triggerDownload(blob, filename);
  }

  /**
   * Trigger browser download
   */
  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Load sample family data (Sydney Jones family)
   */
  async loadSydneyJonesFamily(): Promise<void> {
    try {
      const response = await fetch('/sydney_jones_family.json');
      const data = await response.json();
      await this.saveAncestors(data.ancestors);
    } catch (error) {
      console.error('Failed to load Sydney Jones family data:', error);
      throw error;
    }
  }
}

export const ancestryService = new AncestryService();
