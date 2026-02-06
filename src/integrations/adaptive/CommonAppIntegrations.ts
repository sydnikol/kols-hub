// Integration hub for common apps that users might have

export interface AppIntegration {
  name: string;
  category: string;
  supported: boolean;
  features: string[];
}

export class CommonAppIntegrations {
  getAvailableIntegrations(): AppIntegration[] {
    return [
      // Music & Media
      {
        name: 'Spotify',
        category: 'Music',
        supported: true,
        features: ['Play music', 'Create mood playlists', 'Track listening habits'],
      },
      {
        name: 'Apple Music',
        category: 'Music',
        supported: true,
        features: ['Play music', 'Sync library', 'Create playlists'],
      },
      {
        name: 'YouTube Music',
        category: 'Music',
        supported: true,
        features: ['Play videos', 'Music streaming', 'Playlists'],
      },

      // Health & Fitness
      {
        name: 'Fitbit',
        category: 'Health',
        supported: true,
        features: ['Sync steps', 'Heart rate', 'Sleep data', 'Activity logs'],
      },
      {
        name: 'Apple Health',
        category: 'Health',
        supported: true,
        features: ['HealthKit data', 'Vitals', 'Medications', 'Sleep'],
      },
      {
        name: 'Google Fit',
        category: 'Health',
        supported: true,
        features: ['Activity tracking', 'Heart rate', 'Step counter'],
      },
      {
        name: 'MyFitnessPal',
        category: 'Nutrition',
        supported: true,
        features: ['Calorie tracking', 'Nutrition data', 'Meal logging'],
      },
      {
        name: 'WaterMinder',
        category: 'Health',
        supported: true,
        features: ['Hydration tracking', 'Reminders'],
      },

      // Productivity
      {
        name: 'Google Calendar',
        category: 'Productivity',
        supported: true,
        features: ['Event creation', 'Reminders', 'Medication schedules'],
      },
      {
        name: 'Todoist',
        category: 'Productivity',
        supported: true,
        features: ['Task management', 'Chore tracking', 'Reminders'],
      },
      {
        name: 'Notion',
        category: 'Productivity',
        supported: true,
        features: ['Note taking', 'Database sync', 'Handbooks'],
      },
      {
        name: 'Evernote',
        category: 'Notes',
        supported: true,
        features: ['Note sync', 'Document storage'],
      },

      // Communication
      {
        name: 'Discord',
        category: 'Communication',
        supported: true,
        features: ['Community chat', 'Voice channels', 'Notifications'],
      },
      {
        name: 'Slack',
        category: 'Communication',
        supported: true,
        features: ['Team communication', 'Bot integration'],
      },
      {
        name: 'WhatsApp',
        category: 'Messaging',
        supported: true,
        features: ['Message contacts', 'Emergency alerts'],
      },

      // Meditation & Wellness
      {
        name: 'Calm',
        category: 'Wellness',
        supported: true,
        features: ['Meditation sessions', 'Sleep stories', 'Breathwork'],
      },
      {
        name: 'Headspace',
        category: 'Wellness',
        supported: true,
        features: ['Guided meditation', 'Mindfulness', 'Sleep sounds'],
      },
      {
        name: 'Insight Timer',
        category: 'Wellness',
        supported: true,
        features: ['Meditation timer', 'Guided sessions'],
      },

      // Shopping & Organization
      {
        name: 'Amazon',
        category: 'Shopping',
        supported: true,
        features: ['Medication reorder', 'Pantry items', 'Subscribe & Save'],
      },
      {
        name: 'Instacart',
        category: 'Shopping',
        supported: true,
        features: ['Grocery delivery', 'List sync', 'Favorites'],
      },

      // Weather & Environment
      {
        name: 'Weather.com',
        category: 'Weather',
        supported: true,
        features: ['Outfit suggestions', 'POTS alerts', 'Barometric pressure'],
      },

      // Sleep
      {
        name: 'Sleep Cycle',
        category: 'Health',
        supported: true,
        features: ['Sleep tracking', 'Smart alarm', 'Sleep analysis'],
      },

      // Period/Cycle Tracking
      {
        name: 'Clue',
        category: 'Health',
        supported: true,
        features: ['Cycle tracking', 'Symptom logging', 'Predictions'],
      },
      {
        name: 'Flo',
        category: 'Health',
        supported: true,
        features: ['Period tracking', 'Health insights'],
      },

      // Transportation
      {
        name: 'Uber',
        category: 'Transportation',
        supported: true,
        features: ['Request rides', 'Medical appointments', 'Accessibility'],
      },
      {
        name: 'Lyft',
        category: 'Transportation',
        supported: true,
        features: ['Ride requests', 'Appointment rides'],
      },

      // Telemedicine
      {
        name: 'Teladoc',
        category: 'Healthcare',
        supported: true,
        features: ['Virtual visits', 'Doctor chat', 'Prescriptions'],
      },
      {
        name: 'Doctor On Demand',
        category: 'Healthcare',
        supported: true,
        features: ['Video appointments', 'Urgent care'],
      },

      // Pharmacy
      {
        name: 'CVS',
        category: 'Pharmacy',
        supported: true,
        features: ['Refill prescriptions', 'Delivery', 'Reminders'],
      },
      {
        name: 'Walgreens',
        category: 'Pharmacy',
        supported: true,
        features: ['Prescription management', 'Photo sync'],
      },
    ];
  }

  getIntegrationsByCategory(category: string): AppIntegration[] {
    return this.getAvailableIntegrations().filter(
      (app) => app.category.toLowerCase() === category.toLowerCase()
    );
  }

  searchIntegrations(query: string): AppIntegration[] {
    const lowerQuery = query.toLowerCase();
    return this.getAvailableIntegrations().filter(
      (app) =>
        app.name.toLowerCase().includes(lowerQuery) ||
        app.category.toLowerCase().includes(lowerQuery) ||
        app.features.some((f) => f.toLowerCase().includes(lowerQuery))
    );
  }

  getRecommendedForUser(userConditions: string[]): AppIntegration[] {
    const recommendations: AppIntegration[] = [];
    const allApps = this.getAvailableIntegrations();

    // POTS-specific recommendations
    if (userConditions.includes('POTS')) {
      recommendations.push(
        ...allApps.filter((app) =>
          ['Fitbit', 'Apple Health', 'Google Fit', 'WaterMinder', 'Weather.com'].includes(
            app.name
          )
        )
      );
    }

    // EDS-specific recommendations
    if (userConditions.includes('EDS')) {
      recommendations.push(
        ...allApps.filter((app) =>
          ['Calm', 'Headspace', 'Sleep Cycle'].includes(app.name)
        )
      );
    }

    // General wellness
    recommendations.push(
      ...allApps.filter((app) =>
        ['Spotify', 'Google Calendar', 'Notion'].includes(app.name)
      )
    );

    return [...new Set(recommendations)]; // Remove duplicates
  }
}
