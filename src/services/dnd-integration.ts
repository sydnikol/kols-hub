/**
 * D&D INTEGRATION WITH ENTERTAINMENT & AUTOMATION
 * Connects D&D gameplay with other app modules
 */

import { moduleOrchestrator } from './module-orchestrator';
import { multiRoleAI } from './ai-multi-role-assistant';
import { smartThingsConnector, spotifyConnector } from './all-services-connector';
import { DnDCharacter, DnDCombatEncounter, DnDQuest } from '../features/dnd/types';

export class DnDIntegration {
  private static instance: DnDIntegration;

  static getInstance(): DnDIntegration {
    if (!DnDIntegration.instance) {
      DnDIntegration.instance = new DnDIntegration();
    }
    return DnDIntegration.instance;
  }

  /**
   * Initialize all D&D integrations with other modules
   */
  initialize() {
    this.setupEntertainmentIntegration();
    this.setupAutomationIntegration();
    this.setupSmartHomeIntegration();
    this.setupMusicIntegration();
    this.setupWellnessIntegration();
  }

  /**
   * ENTERTAINMENT MODULE INTEGRATION
   */
  private setupEntertainmentIntegration() {
    // Track D&D sessions as entertainment activity
    moduleOrchestrator.on('dnd:session-started', async (payload) => {
      console.log('🎲 D&D Session Started:', payload);

      // Log entertainment activity
      const activities = JSON.parse(localStorage.getItem('entertainment_activities') || '[]');
      activities.push({
        id: crypto.randomUUID(),
        type: 'gaming',
        name: 'D&D Session',
        duration: 0, // Will update on end
        startedAt: new Date().toISOString(),
        metadata: {
          campaign: payload.campaignName,
          characters: payload.characterCount,
          mode: payload.mode // 'solo' or 'multiplayer'
        }
      });
      localStorage.setItem('entertainment_activities', JSON.stringify(activities));

      // Switch AI to Cheerleader mode for encouragement
      if (payload.mode === 'solo') {
        await multiRoleAI.switchRole('cheerleader');
        await multiRoleAI.chat('I\'m starting a D&D adventure!');
      }
    });

    // Track session completion
    moduleOrchestrator.on('dnd:session-ended', async (payload) => {
      console.log('🎲 D&D Session Ended:', payload);

      const activities = JSON.parse(localStorage.getItem('entertainment_activities') || '[]');
      const sessionIndex = activities.findIndex((a: any) =>
        a.type === 'gaming' &&
        a.name === 'D&D Session' &&
        !a.endedAt
      );

      if (sessionIndex !== -1) {
        const session = activities[sessionIndex];
        const endTime = new Date();
        const startTime = new Date(session.startedAt);
        const duration = (endTime.getTime() - startTime.getTime()) / 1000 / 60; // minutes

        activities[sessionIndex] = {
          ...session,
          duration,
          endedAt: endTime.toISOString(),
          achievements: payload.achievements || []
        };

        localStorage.setItem('entertainment_activities', JSON.stringify(activities));

        // Celebrate completion
        if (payload.questsCompleted > 0) {
          await multiRoleAI.switchRole('cheerleader');
          await multiRoleAI.chat(`I completed ${payload.questsCompleted} quests in my D&D session!`);
        }
      }
    });

    // Track gaming achievements
    moduleOrchestrator.on('dnd:achievement-unlocked', (payload) => {
      console.log('🏆 Achievement Unlocked:', payload);

      const achievements = JSON.parse(localStorage.getItem('gaming_achievements') || '[]');
      achievements.push({
        id: crypto.randomUUID(),
        game: 'D&D',
        achievement: payload.name,
        description: payload.description,
        rarity: payload.rarity,
        unlockedAt: new Date().toISOString()
      });
      localStorage.setItem('gaming_achievements', JSON.stringify(achievements));

      // Show celebration
      moduleOrchestrator.emit('wellness:celebration', {
        message: `Achievement Unlocked: ${payload.name}!`,
        type: 'gaming'
      });
    });
  }

  /**
   * AUTOMATION MODULE INTEGRATION
   */
  private setupAutomationIntegration() {
    // Auto-backup characters
    moduleOrchestrator.on('dnd:character-created', async (payload) => {
      console.log('✨ New D&D Character Created:', payload.character.name);

      // Create automated backup
      const backups = JSON.parse(localStorage.getItem('dnd_character_backups') || '[]');
      backups.push({
        character: payload.character,
        backedUpAt: new Date().toISOString(),
        autoBackup: true
      });
      localStorage.setItem('dnd_character_backups', JSON.stringify(backups));

      // Emit success
      moduleOrchestrator.emit('automation:backup-created', {
        type: 'dnd-character',
        name: payload.character.name
      });
    });

    // Auto-save campaign progress every 5 minutes
    setInterval(() => {
      const gameState = localStorage.getItem('dnd_game_state');
      if (gameState) {
        const backups = JSON.parse(localStorage.getItem('dnd_campaign_backups') || '[]');
        backups.push({
          state: JSON.parse(gameState),
          backedUpAt: new Date().toISOString(),
          autoBackup: true
        });

        // Keep only last 10 backups
        const recentBackups = backups.slice(-10);
        localStorage.setItem('dnd_campaign_backups', JSON.stringify(recentBackups));
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    // Schedule session reminders
    moduleOrchestrator.on('dnd:session-scheduled', async (payload) => {
      console.log('📅 D&D Session Scheduled:', payload);

      // Create calendar event
      const events = JSON.parse(localStorage.getItem('scheduled_events') || '[]');
      events.push({
        id: crypto.randomUUID(),
        type: 'dnd-session',
        title: `D&D: ${payload.campaignName}`,
        startTime: payload.scheduledTime,
        participants: payload.players,
        reminder: true,
        reminderTime: 30 // 30 minutes before
      });
      localStorage.setItem('scheduled_events', JSON.stringify(events));
    });

    // Export session logs
    moduleOrchestrator.on('dnd:export-session-log', async (payload) => {
      const sessionHistory = payload.sessionHistory;

      // Format as markdown
      let markdown = `# D&D Session Log\n\n`;
      markdown += `**Campaign**: ${payload.campaignName}\n`;
      markdown += `**Date**: ${new Date().toLocaleDateString()}\n`;
      markdown += `**Characters**: ${payload.characters.map((c: DnDCharacter) => c.name).join(', ')}\n\n`;
      markdown += `## Adventure Log\n\n`;

      sessionHistory.forEach((event: any, index: number) => {
        markdown += `${index + 1}. ${event.description}\n`;
      });

      // Save to file system (would need Capacitor Filesystem API)
      localStorage.setItem(`dnd_session_log_${payload.sessionId}`, markdown);

      console.log('📝 Session log exported');
    });
  }

  /**
   * SMART HOME INTEGRATION
   */
  private setupSmartHomeIntegration() {
    // Combat atmosphere - dim lights to red
    moduleOrchestrator.on('dnd:combat-started', async (payload: { encounter: DnDCombatEncounter }) => {
      console.log('⚔️ Combat Started - Setting atmosphere');

      try {
        // Dim lights and set to red
        if (smartThingsConnector) {
          await smartThingsConnector.controlDevice(
            'light-living-room',
            'switch',
            'on',
            { level: 30, color: { hue: 0, saturation: 100 } } // Red
          );
        }
      } catch (error) {
        console.error('Failed to control lights:', error);
      }
    });

    // Combat ended - restore normal lighting
    moduleOrchestrator.on('dnd:combat-ended', async (payload) => {
      console.log('✅ Combat Ended - Restoring lighting');

      try {
        if (smartThingsConnector) {
          await smartThingsConnector.controlDevice(
            'light-living-room',
            'switch',
            'on',
            { level: 70, color: { hue: 30, saturation: 30 } } // Warm white
          );
        }
      } catch (error) {
        console.error('Failed to control lights:', error);
      }
    });

    // Tavern atmosphere
    moduleOrchestrator.on('dnd:location-changed', async (payload) => {
      if (payload.location.toLowerCase().includes('tavern')) {
        console.log('🍺 Entering tavern - Cozy atmosphere');

        try {
          if (smartThingsConnector) {
            // Warm, dim lighting
            await smartThingsConnector.controlDevice(
              'light-living-room',
              'switch',
              'on',
              { level: 50, color: { hue: 25, saturation: 60 } }
            );
          }
        } catch (error) {
          console.error('Failed to control lights:', error);
        }
      }
    });

    // Character death - dramatic effect
    moduleOrchestrator.on('dnd:character-died', async (payload) => {
      console.log('💀 Character Died - Dramatic effect');

      try {
        if (smartThingsConnector) {
          // Flash lights red, then dim
          await smartThingsConnector.controlDevice(
            'light-living-room',
            'switch',
            'on',
            { level: 100, color: { hue: 0, saturation: 100 } }
          );

          setTimeout(async () => {
            await smartThingsConnector.controlDevice(
              'light-living-room',
              'switch',
              'on',
              { level: 20, color: { hue: 0, saturation: 80 } }
            );
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to control lights:', error);
      }
    });
  }

  /**
   * MUSIC INTEGRATION
   */
  private setupMusicIntegration() {
    // Combat music
    moduleOrchestrator.on('dnd:combat-started', async (payload) => {
      console.log('🎵 Playing combat music');

      try {
        if (spotifyConnector) {
          // Search for epic battle music
          const results = await spotifyConnector.search('epic battle music', ['playlist']);
          if (results.playlists?.items?.length > 0) {
            const playlistUri = results.playlists.items[0].uri;
            await spotifyConnector.play({ context_uri: playlistUri });
          }
        }
      } catch (error) {
        console.error('Failed to play music:', error);
      }
    });

    // Tavern music
    moduleOrchestrator.on('dnd:location-changed', async (payload) => {
      if (payload.location.toLowerCase().includes('tavern')) {
        console.log('🎵 Playing tavern music');

        try {
          if (spotifyConnector) {
            const results = await spotifyConnector.search('medieval tavern music', ['playlist']);
            if (results.playlists?.items?.length > 0) {
              const playlistUri = results.playlists.items[0].uri;
              await spotifyConnector.play({ context_uri: playlistUri });
            }
          }
        } catch (error) {
          console.error('Failed to play music:', error);
        }
      }
    });

    // Exploration/ambient music
    moduleOrchestrator.on('dnd:exploration-started', async (payload) => {
      console.log('🎵 Playing exploration music');

      try {
        if (spotifyConnector) {
          const results = await spotifyConnector.search('ambient fantasy music', ['playlist']);
          if (results.playlists?.items?.length > 0) {
            const playlistUri = results.playlists.items[0].uri;
            await spotifyConnector.play({ context_uri: playlistUri });
          }
        }
      } catch (error) {
        console.error('Failed to play music:', error);
      }
    });

    // Victory music
    moduleOrchestrator.on('dnd:quest-completed', async (payload) => {
      console.log('🎵 Playing victory music');

      try {
        if (spotifyConnector) {
          const results = await spotifyConnector.search('epic victory music', ['playlist']);
          if (results.playlists?.items?.length > 0) {
            const playlistUri = results.playlists.items[0].uri;
            await spotifyConnector.play({ context_uri: playlistUri });
          }
        }
      } catch (error) {
        console.error('Failed to play music:', error);
      }
    });
  }

  /**
   * WELLNESS INTEGRATION
   */
  private setupWellnessIntegration() {
    // Encourage breaks during long sessions
    let sessionStartTime: number | null = null;

    moduleOrchestrator.on('dnd:session-started', () => {
      sessionStartTime = Date.now();

      // Remind to take breaks every 90 minutes
      const breakReminder = setInterval(() => {
        if (sessionStartTime) {
          const elapsed = Date.now() - sessionStartTime;
          if (elapsed >= 90 * 60 * 1000) { // 90 minutes
            moduleOrchestrator.emit('wellness:rest-recommended', {
              reason: 'Long D&D session - time for a break!',
              suggestion: 'Stand up, stretch, and hydrate. Your adventure will be here when you return! 💜'
            });
          }
        }
      }, 90 * 60 * 1000);

      // Clear on session end
      moduleOrchestrator.on('dnd:session-ended', () => {
        clearInterval(breakReminder);
        sessionStartTime = null;
      });
    });

    // Celebrate quest completions
    moduleOrchestrator.on('dnd:quest-completed', async (payload: { quest: DnDQuest }) => {
      moduleOrchestrator.emit('wellness:celebration', {
        message: `Quest Completed: ${payload.quest.name}! 🎉`,
        type: 'achievement',
        rewards: {
          xp: payload.quest.rewards.xp,
          gold: payload.quest.rewards.gold
        }
      });
    });

    // Character level up celebration
    moduleOrchestrator.on('dnd:level-up', async (payload: { character: DnDCharacter; newLevel: number }) => {
      moduleOrchestrator.emit('wellness:celebration', {
        message: `${payload.character.name} reached Level ${payload.newLevel}! ⭐`,
        type: 'level-up'
      });

      // Switch AI to cheerleader
      await multiRoleAI.switchRole('cheerleader');
      await multiRoleAI.chat(`My D&D character just leveled up to level ${payload.newLevel}!`);
    });

    // Support during character death
    moduleOrchestrator.on('dnd:character-died', async (payload: { character: DnDCharacter }) => {
      // Switch AI to therapist for support
      await multiRoleAI.switchRole('therapist');
      await multiRoleAI.chat('My D&D character just died. I\'m feeling sad about it.');
    });
  }

  /**
   * Trigger session start
   */
  startSession(campaignName: string, characters: DnDCharacter[], mode: 'solo' | 'multiplayer') {
    moduleOrchestrator.emit('dnd:session-started', {
      campaignName,
      characterCount: characters.length,
      mode
    });
  }

  /**
   * Trigger session end
   */
  endSession(achievements: string[], questsCompleted: number) {
    moduleOrchestrator.emit('dnd:session-ended', {
      achievements,
      questsCompleted
    });
  }

  /**
   * Trigger combat start
   */
  startCombat(encounter: DnDCombatEncounter) {
    moduleOrchestrator.emit('dnd:combat-started', { encounter });
  }

  /**
   * Trigger combat end
   */
  endCombat(victory: boolean, xpGained: number) {
    moduleOrchestrator.emit('dnd:combat-ended', { victory, xpGained });
  }

  /**
   * Trigger quest completion
   */
  completeQuest(quest: DnDQuest) {
    moduleOrchestrator.emit('dnd:quest-completed', { quest });
  }

  /**
   * Trigger achievement
   */
  unlockAchievement(name: string, description: string, rarity: 'common' | 'rare' | 'legendary') {
    moduleOrchestrator.emit('dnd:achievement-unlocked', {
      name,
      description,
      rarity
    });
  }

  /**
   * Trigger location change
   */
  changeLocation(location: string) {
    moduleOrchestrator.emit('dnd:location-changed', { location });
  }

  /**
   * Trigger level up
   */
  levelUp(character: DnDCharacter, newLevel: number) {
    moduleOrchestrator.emit('dnd:level-up', { character, newLevel });
  }

  /**
   * Trigger character death
   */
  characterDied(character: DnDCharacter) {
    moduleOrchestrator.emit('dnd:character-died', { character });
  }
}

// Export singleton
export const dndIntegration = DnDIntegration.getInstance();

// Helper functions
export const startDnDSession = (campaignName: string, characters: DnDCharacter[], mode: 'solo' | 'multiplayer') =>
  dndIntegration.startSession(campaignName, characters, mode);

export const endDnDSession = (achievements: string[], questsCompleted: number) =>
  dndIntegration.endSession(achievements, questsCompleted);

export const startDnDCombat = (encounter: DnDCombatEncounter) =>
  dndIntegration.startCombat(encounter);

export const endDnDCombat = (victory: boolean, xpGained: number) =>
  dndIntegration.endCombat(victory, xpGained);

export const completeDnDQuest = (quest: DnDQuest) =>
  dndIntegration.completeQuest(quest);

export const unlockDnDAchievement = (name: string, description: string, rarity: 'common' | 'rare' | 'legendary') =>
  dndIntegration.unlockAchievement(name, description, rarity);
