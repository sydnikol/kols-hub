/**
 * App Integration Plugin System
 * Connects with popular phone apps to automate data sync and workflows
 */

export interface AppPlugin {
  id: string;
  name: string;
  category: 'productivity' | 'finance' | 'health' | 'entertainment' | 'communication' | 'transportation' | 'food';
  icon: string;
  connected: boolean;
  autoSync: boolean;
  syncFrequency: 'realtime' | '5min' | '15min' | 'hourly' | 'daily' | 'manual';
  permissions: string[];
  lastSync?: string;
  syncCount: number;
  dataMapping: DataMapping[];
}

export interface DataMapping {
  sourceField: string;
  targetFeature: string;
  targetField: string;
  transformation?: (data: any) => any;
  bidirectional: boolean;
}

export interface PluginAction {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  trigger: 'manual' | 'schedule' | 'event';
  schedule?: string; // cron expression
  eventType?: string;
  action: (data?: any) => Promise<any>;
}

export class AppIntegrationPluginSystem {
  private static instance: AppIntegrationPluginSystem;
  private plugins: Map<string, AppPlugin> = new Map();
  private actions: Map<string, PluginAction> = new Map();
  private isRunning: boolean = false;

  static getInstance(): AppIntegrationPluginSystem {
    if (!AppIntegrationPluginSystem.instance) {
      AppIntegrationPluginSystem.instance = new AppIntegrationPluginSystem();
    }
    return AppIntegrationPluginSystem.instance;
  }

  constructor() {
    this.initializePlugins();
    this.initializeActions();
  }

  private initializePlugins() {
    const defaultPlugins: AppPlugin[] = [
      // Google Ecosystem
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        category: 'productivity',
        icon: '📅',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['calendar.read', 'calendar.write'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'events',
            targetFeature: 'time-management',
            targetField: 'timeBlocks',
            bidirectional: true
          },
          {
            sourceField: 'tasks',
            targetFeature: 'goals',
            targetField: 'tasks',
            bidirectional: true
          }
        ]
      },
      {
        id: 'gmail',
        name: 'Gmail',
        category: 'communication',
        icon: '📧',
        connected: false,
        autoSync: true,
        syncFrequency: '5min',
        permissions: ['gmail.read', 'gmail.send'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'emails',
            targetFeature: 'journaling',
            targetField: 'entries',
            transformation: (email) => ({
              id: email.id,
              title: `Email: ${email.subject}`,
              content: email.snippet,
              date: email.date,
              category: 'communication'
            }),
            bidirectional: false
          }
        ]
      },
      {
        id: 'google-drive',
        name: 'Google Drive',
        category: 'productivity',
        icon: '☁️',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['drive.file'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'documents',
            targetFeature: 'education',
            targetField: 'resources',
            bidirectional: true
          }
        ]
      },
      {
        id: 'google-fit',
        name: 'Google Fit',
        category: 'health',
        icon: '💪',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['fitness.activity.read', 'fitness.body.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'activities',
            targetFeature: 'fitness',
            targetField: 'workouts',
            bidirectional: false
          },
          {
            sourceField: 'steps',
            targetFeature: 'wellness',
            targetField: 'dailySteps',
            bidirectional: false
          },
          {
            sourceField: 'heartRate',
            targetFeature: 'health',
            targetField: 'vitals',
            bidirectional: false
          }
        ]
      },
      {
        id: 'google-photos',
        name: 'Google Photos',
        category: 'entertainment',
        icon: '📷',
        connected: false,
        autoSync: true,
        syncFrequency: 'daily',
        permissions: ['photos.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'photos',
            targetFeature: 'memories',
            targetField: 'memories',
            transformation: (photo) => ({
              id: photo.id,
              title: photo.filename,
              date: photo.creationTime,
              category: 'personal',
              description: photo.description || '',
              location: photo.location,
              emotions: [],
              significance: 3,
              favorite: photo.starred,
              tags: []
            }),
            bidirectional: false
          }
        ]
      },

      // Music & Entertainment
      {
        id: 'spotify',
        name: 'Spotify',
        category: 'entertainment',
        icon: '🎵',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['user-read-playback-state', 'user-read-recently-played'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'currentlyPlaying',
            targetFeature: 'wellness',
            targetField: 'moodMusic',
            bidirectional: false
          },
          {
            sourceField: 'playlists',
            targetFeature: 'entertainment',
            targetField: 'musicLibrary',
            bidirectional: true
          }
        ]
      },
      {
        id: 'youtube-music',
        name: 'YouTube Music',
        category: 'entertainment',
        icon: '🎧',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['youtube.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'history',
            targetFeature: 'entertainment',
            targetField: 'watchHistory',
            bidirectional: false
          }
        ]
      },

      // Finance
      {
        id: 'google-pay',
        name: 'Google Pay',
        category: 'finance',
        icon: '💳',
        connected: false,
        autoSync: true,
        syncFrequency: '5min',
        permissions: ['payments.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'transactions',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            transformation: (txn) => ({
              id: txn.id,
              description: txn.merchant,
              amount: txn.amount,
              category: this.categorizeMerchant(txn.merchant),
              date: txn.date,
              paymentMethod: 'digital',
              receipt: txn.receipt,
              recurring: false,
              tags: [txn.category]
            }),
            bidirectional: false
          },
          {
            sourceField: 'transactions',
            targetFeature: 'budgeting',
            targetField: 'transactions',
            bidirectional: false
          }
        ]
      },

      // Transportation
      {
        id: 'uber',
        name: 'Uber',
        category: 'transportation',
        icon: '🚗',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['rides.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'rides',
            targetFeature: 'transportation',
            targetField: 'trips',
            bidirectional: false
          },
          {
            sourceField: 'rides',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            transformation: (ride) => ({
              id: ride.id,
              description: `Uber: ${ride.origin} → ${ride.destination}`,
              amount: ride.fare,
              category: 'transportation',
              date: ride.date,
              paymentMethod: 'digital',
              recurring: false,
              tags: ['uber', 'transportation']
            }),
            bidirectional: false
          }
        ]
      },
      {
        id: 'lyft',
        name: 'Lyft',
        category: 'transportation',
        icon: '🚕',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['rides.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'rides',
            targetFeature: 'transportation',
            targetField: 'trips',
            bidirectional: false
          },
          {
            sourceField: 'rides',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            transformation: (ride) => ({
              id: ride.id,
              description: `Lyft: ${ride.origin} → ${ride.destination}`,
              amount: ride.price,
              category: 'transportation',
              date: ride.timestamp,
              paymentMethod: 'digital',
              recurring: false,
              tags: ['lyft', 'transportation']
            }),
            bidirectional: false
          }
        ]
      },

      // Food & Delivery
      {
        id: 'uber-eats',
        name: 'Uber Eats',
        category: 'food',
        icon: '🍔',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['orders.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'orders',
            targetFeature: 'food',
            targetField: 'meals',
            bidirectional: false
          },
          {
            sourceField: 'orders',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            transformation: (order) => ({
              id: order.id,
              description: `Uber Eats: ${order.restaurant}`,
              amount: order.total,
              category: 'food',
              date: order.date,
              paymentMethod: 'digital',
              recurring: false,
              tags: ['food', 'delivery']
            }),
            bidirectional: false
          }
        ]
      },
      {
        id: 'doordash',
        name: 'DoorDash',
        category: 'food',
        icon: '🥡',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['orders.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'orders',
            targetFeature: 'food',
            targetField: 'meals',
            bidirectional: false
          },
          {
            sourceField: 'orders',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            transformation: (order) => ({
              id: order.id,
              description: `DoorDash: ${order.restaurant}`,
              amount: order.subtotal + order.deliveryFee + order.tip,
              category: 'food',
              date: order.createdAt,
              paymentMethod: 'digital',
              recurring: false,
              tags: ['food', 'delivery', 'doordash']
            }),
            bidirectional: false
          }
        ]
      },

      // Shopping
      {
        id: 'amazon',
        name: 'Amazon',
        category: 'finance',
        icon: '📦',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['orders.read', 'wishlist.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'orders',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            transformation: (order) => ({
              id: order.orderId,
              description: `Amazon: ${order.items.map((i: any) => i.title).join(', ')}`,
              amount: order.total,
              category: 'shopping',
              date: order.orderDate,
              paymentMethod: 'digital',
              receipt: order.invoiceUrl,
              recurring: false,
              tags: ['amazon', 'shopping', 'online']
            }),
            bidirectional: false
          },
          {
            sourceField: 'subscriptions',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            transformation: (sub) => ({
              id: sub.subscriptionId,
              description: `Amazon: ${sub.productName} (Subscription)`,
              amount: sub.price,
              category: 'subscription',
              date: new Date().toISOString().split('T')[0],
              paymentMethod: 'digital',
              recurring: true,
              tags: ['amazon', 'subscription']
            }),
            bidirectional: false
          }
        ]
      },

      // Communication
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        category: 'communication',
        icon: '💬',
        connected: false,
        autoSync: false, // Privacy-sensitive
        syncFrequency: 'manual',
        permissions: ['messages.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'contacts',
            targetFeature: 'social',
            targetField: 'contacts',
            bidirectional: false
          }
        ]
      },

      // Health Apps
      {
        id: 'myfitnesspal',
        name: 'MyFitnessPal',
        category: 'health',
        icon: '🥗',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['nutrition.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'meals',
            targetFeature: 'nutrition',
            targetField: 'meals',
            bidirectional: false
          },
          {
            sourceField: 'calories',
            targetFeature: 'health',
            targetField: 'nutrition',
            bidirectional: false
          }
        ]
      },

      // Productivity
      {
        id: 'todoist',
        name: 'Todoist',
        category: 'productivity',
        icon: '✅',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['tasks.read', 'tasks.write'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'tasks',
            targetFeature: 'goals',
            targetField: 'tasks',
            bidirectional: true
          },
          {
            sourceField: 'projects',
            targetFeature: 'goals',
            targetField: 'goals',
            bidirectional: true
          }
        ]
      },
      {
        id: 'notion',
        name: 'Notion',
        category: 'productivity',
        icon: '📝',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['content.read', 'content.write'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'pages',
            targetFeature: 'journaling',
            targetField: 'entries',
            bidirectional: true
          },
          {
            sourceField: 'databases',
            targetFeature: 'ideas',
            targetField: 'ideas',
            bidirectional: true
          }
        ]
      },

      // MORE PRODUCTIVITY APPS
      {
        id: 'trello',
        name: 'Trello',
        category: 'productivity',
        icon: '📋',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['boards.read', 'cards.write'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'cards',
            targetFeature: 'goals',
            targetField: 'tasks',
            bidirectional: true
          }
        ]
      },
      {
        id: 'asana',
        name: 'Asana',
        category: 'productivity',
        icon: '🎯',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['tasks.read', 'projects.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'tasks',
            targetFeature: 'goals',
            targetField: 'tasks',
            bidirectional: true
          }
        ]
      },
      {
        id: 'slack',
        name: 'Slack',
        category: 'communication',
        icon: '💼',
        connected: false,
        autoSync: false,
        syncFrequency: 'manual',
        permissions: ['messages.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'messages',
            targetFeature: 'journaling',
            targetField: 'entries',
            bidirectional: false
          }
        ]
      },
      {
        id: 'microsoft-outlook',
        name: 'Microsoft Outlook',
        category: 'productivity',
        icon: '📧',
        connected: false,
        autoSync: true,
        syncFrequency: '5min',
        permissions: ['mail.read', 'calendar.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'emails',
            targetFeature: 'journaling',
            targetField: 'entries',
            bidirectional: false
          },
          {
            sourceField: 'calendar',
            targetFeature: 'time-management',
            targetField: 'timeBlocks',
            bidirectional: true
          }
        ]
      },
      {
        id: 'microsoft-teams',
        name: 'Microsoft Teams',
        category: 'communication',
        icon: '👥',
        connected: false,
        autoSync: false,
        syncFrequency: 'manual',
        permissions: ['messages.read', 'meetings.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'meetings',
            targetFeature: 'time-management',
            targetField: 'timeBlocks',
            bidirectional: false
          }
        ]
      },
      {
        id: 'zoom',
        name: 'Zoom',
        category: 'communication',
        icon: '🎥',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['meetings.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'meetings',
            targetFeature: 'time-management',
            targetField: 'timeBlocks',
            bidirectional: false
          }
        ]
      },

      // MULTIPLE EMAIL ACCOUNTS
      {
        id: 'gmail-personal',
        name: 'Gmail (Personal)',
        category: 'communication',
        icon: '📧',
        connected: false,
        autoSync: true,
        syncFrequency: '5min',
        permissions: ['gmail.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'emails',
            targetFeature: 'journaling',
            targetField: 'entries',
            bidirectional: false
          }
        ]
      },
      {
        id: 'gmail-work',
        name: 'Gmail (Work)',
        category: 'communication',
        icon: '💼',
        connected: false,
        autoSync: true,
        syncFrequency: '5min',
        permissions: ['gmail.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'emails',
            targetFeature: 'journaling',
            targetField: 'entries',
            bidirectional: false
          }
        ]
      },
      {
        id: 'gmail-school',
        name: 'Gmail (School)',
        category: 'communication',
        icon: '🎓',
        connected: false,
        autoSync: true,
        syncFrequency: '5min',
        permissions: ['gmail.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'emails',
            targetFeature: 'education',
            targetField: 'courses',
            bidirectional: false
          }
        ]
      },

      // MORE HEALTH & FITNESS
      {
        id: 'strava',
        name: 'Strava',
        category: 'health',
        icon: '🏃',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['activities.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'activities',
            targetFeature: 'fitness',
            targetField: 'workouts',
            bidirectional: false
          }
        ]
      },
      {
        id: 'peloton',
        name: 'Peloton',
        category: 'health',
        icon: '🚴',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['workouts.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'workouts',
            targetFeature: 'fitness',
            targetField: 'workouts',
            bidirectional: false
          }
        ]
      },
      {
        id: 'apple-health',
        name: 'Apple Health',
        category: 'health',
        icon: '❤️',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['health.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'steps',
            targetFeature: 'fitness',
            targetField: 'dailySteps',
            bidirectional: false
          }
        ]
      },
      {
        id: 'fitbit',
        name: 'Fitbit',
        category: 'health',
        icon: '⌚',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['activity.read', 'sleep.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'activities',
            targetFeature: 'fitness',
            targetField: 'workouts',
            bidirectional: false
          }
        ]
      },

      // MORE FINANCE APPS
      {
        id: 'paypal',
        name: 'PayPal',
        category: 'finance',
        icon: '💰',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['transactions.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'transactions',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'venmo',
        name: 'Venmo',
        category: 'finance',
        icon: '💸',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['transactions.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'payments',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'cashapp',
        name: 'Cash App',
        category: 'finance',
        icon: '💵',
        connected: false,
        autoSync: true,
        syncFrequency: '15min',
        permissions: ['transactions.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'transactions',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'mint',
        name: 'Mint',
        category: 'finance',
        icon: '🌿',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['accounts.read', 'transactions.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'transactions',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'robinhood',
        name: 'Robinhood',
        category: 'finance',
        icon: '📈',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['portfolio.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'holdings',
            targetFeature: 'investments',
            targetField: 'investments',
            bidirectional: false
          }
        ]
      },

      // MORE FOOD & DELIVERY
      {
        id: 'grubhub',
        name: 'GrubHub',
        category: 'food',
        icon: '🍕',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['orders.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'orders',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'instacart',
        name: 'Instacart',
        category: 'food',
        icon: '🛒',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['orders.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'orders',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },

      // SHOPPING
      {
        id: 'walmart',
        name: 'Walmart',
        category: 'finance',
        icon: '🏪',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['purchases.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'purchases',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'target',
        name: 'Target',
        category: 'finance',
        icon: '🎯',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['purchases.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'purchases',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'etsy',
        name: 'Etsy',
        category: 'finance',
        icon: '🎨',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['purchases.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'purchases',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'ebay',
        name: 'eBay',
        category: 'finance',
        icon: '🔨',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['purchases.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'purchases',
            targetFeature: 'expense-tracking',
            targetField: 'expenses',
            bidirectional: false
          }
        ]
      },

      // TRAVEL
      {
        id: 'airbnb',
        name: 'Airbnb',
        category: 'transportation',
        icon: '🏠',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['bookings.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'reservations',
            targetFeature: 'travel',
            targetField: 'trips',
            bidirectional: false
          }
        ]
      },
      {
        id: 'booking',
        name: 'Booking.com',
        category: 'transportation',
        icon: '🏨',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['bookings.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'bookings',
            targetFeature: 'travel',
            targetField: 'trips',
            bidirectional: false
          }
        ]
      },

      // ENTERTAINMENT & SOCIAL
      {
        id: 'netflix',
        name: 'Netflix',
        category: 'entertainment',
        icon: '🎬',
        connected: false,
        autoSync: true,
        syncFrequency: 'daily',
        permissions: ['viewing-activity.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'watchHistory',
            targetFeature: 'streaming',
            targetField: 'watched',
            bidirectional: false
          }
        ]
      },
      {
        id: 'hulu',
        name: 'Hulu',
        category: 'entertainment',
        icon: '📺',
        connected: false,
        autoSync: true,
        syncFrequency: 'daily',
        permissions: ['watch-history.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'watchlist',
            targetFeature: 'streaming',
            targetField: 'watchlist',
            bidirectional: false
          }
        ]
      },
      {
        id: 'disney-plus',
        name: 'Disney+',
        category: 'entertainment',
        icon: '🏰',
        connected: false,
        autoSync: true,
        syncFrequency: 'daily',
        permissions: ['watchlist.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'watchlist',
            targetFeature: 'streaming',
            targetField: 'watchlist',
            bidirectional: false
          }
        ]
      },
      {
        id: 'twitch',
        name: 'Twitch',
        category: 'entertainment',
        icon: '🎮',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['following.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'following',
            targetFeature: 'entertainment',
            targetField: 'favorites',
            bidirectional: false
          }
        ]
      },
      {
        id: 'steam',
        name: 'Steam',
        category: 'entertainment',
        icon: '🎮',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['library.read', 'playtime.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'games',
            targetFeature: 'gaming',
            targetField: 'library',
            bidirectional: false
          }
        ]
      },
      {
        id: 'discord',
        name: 'Discord',
        category: 'communication',
        icon: '💬',
        connected: false,
        autoSync: false,
        syncFrequency: 'manual',
        permissions: ['messages.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'servers',
            targetFeature: 'social',
            targetField: 'communities',
            bidirectional: false
          }
        ]
      },

      // CLOUD STORAGE
      {
        id: 'dropbox',
        name: 'Dropbox',
        category: 'productivity',
        icon: '📦',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['files.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'files',
            targetFeature: 'education',
            targetField: 'resources',
            bidirectional: true
          }
        ]
      },
      {
        id: 'onedrive',
        name: 'OneDrive',
        category: 'productivity',
        icon: '☁️',
        connected: false,
        autoSync: true,
        syncFrequency: 'hourly',
        permissions: ['files.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'files',
            targetFeature: 'education',
            targetField: 'resources',
            bidirectional: true
          }
        ]
      },

      // SOCIAL MEDIA (Privacy-conscious, manual only)
      {
        id: 'twitter',
        name: 'Twitter/X',
        category: 'communication',
        icon: '🐦',
        connected: false,
        autoSync: false,
        syncFrequency: 'manual',
        permissions: ['tweets.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'tweets',
            targetFeature: 'journaling',
            targetField: 'entries',
            bidirectional: false
          }
        ]
      },
      {
        id: 'instagram',
        name: 'Instagram',
        category: 'entertainment',
        icon: '📸',
        connected: false,
        autoSync: false,
        syncFrequency: 'manual',
        permissions: ['media.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'posts',
            targetFeature: 'memories',
            targetField: 'memories',
            bidirectional: false
          }
        ]
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        category: 'productivity',
        icon: '💼',
        connected: false,
        autoSync: false,
        syncFrequency: 'manual',
        permissions: ['profile.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'connections',
            targetFeature: 'networking',
            targetField: 'connections',
            bidirectional: false
          }
        ]
      },

      // LEARNING PLATFORMS
      {
        id: 'coursera',
        name: 'Coursera',
        category: 'productivity',
        icon: '🎓',
        connected: false,
        autoSync: true,
        syncFrequency: 'daily',
        permissions: ['courses.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'enrollments',
            targetFeature: 'course-management',
            targetField: 'courses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'udemy',
        name: 'Udemy',
        category: 'productivity',
        icon: '📚',
        connected: false,
        autoSync: true,
        syncFrequency: 'daily',
        permissions: ['courses.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'courses',
            targetFeature: 'course-management',
            targetField: 'courses',
            bidirectional: false
          }
        ]
      },
      {
        id: 'duolingo',
        name: 'Duolingo',
        category: 'productivity',
        icon: '🦉',
        connected: false,
        autoSync: true,
        syncFrequency: 'daily',
        permissions: ['progress.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'lessons',
            targetFeature: 'skills-development',
            targetField: 'skills',
            bidirectional: false
          }
        ]
      },

      // SMART HOME
      {
        id: 'smartthings',
        name: 'Samsung SmartThings',
        category: 'productivity',
        icon: '🏠',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['devices.read', 'devices.control', 'scenes.read', 'automations.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'devices',
            targetFeature: 'home-automation',
            targetField: 'devices',
            bidirectional: true
          },
          {
            sourceField: 'scenes',
            targetFeature: 'automations',
            targetField: 'actions',
            bidirectional: true
          },
          {
            sourceField: 'energy',
            targetFeature: 'expense-tracking',
            targetField: 'utilities',
            bidirectional: false
          },
          {
            sourceField: 'presence',
            targetFeature: 'wellness',
            targetField: 'location',
            bidirectional: false
          }
        ]
      },
      {
        id: 'google-home',
        name: 'Google Home',
        category: 'productivity',
        icon: '🎙️',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['devices.read', 'devices.control', 'routines.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'devices',
            targetFeature: 'home-automation',
            targetField: 'devices',
            bidirectional: true
          },
          {
            sourceField: 'routines',
            targetFeature: 'automations',
            targetField: 'actions',
            bidirectional: true
          }
        ]
      },
      {
        id: 'alexa',
        name: 'Amazon Alexa',
        category: 'productivity',
        icon: '🗣️',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['devices.read', 'skills.read', 'routines.read'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'devices',
            targetFeature: 'home-automation',
            targetField: 'devices',
            bidirectional: true
          },
          {
            sourceField: 'shopping-list',
            targetFeature: 'food',
            targetField: 'groceryList',
            bidirectional: true
          }
        ]
      },
      {
        id: 'philips-hue',
        name: 'Philips Hue',
        category: 'productivity',
        icon: '💡',
        connected: false,
        autoSync: true,
        syncFrequency: 'realtime',
        permissions: ['lights.read', 'lights.control'],
        syncCount: 0,
        dataMapping: [
          {
            sourceField: 'lights',
            targetFeature: 'home-automation',
            targetField: 'devices',
            bidirectional: true
          },
          {
            sourceField: 'scenes',
            targetFeature: 'wellness',
            targetField: 'ambience',
            bidirectional: false
          }
        ]
      }
    ];

    defaultPlugins.forEach(plugin => {
      this.plugins.set(plugin.id, plugin);
    });
  }

  private initializeActions() {
    const defaultActions: PluginAction[] = [
      {
        id: 'sync-calendar-to-timeblocks',
        pluginId: 'google-calendar',
        name: 'Sync Calendar to Time Blocks',
        description: 'Automatically convert Google Calendar events to time management blocks',
        trigger: 'schedule',
        schedule: '*/15 * * * *', // Every 15 minutes
        action: async () => {
          // Simulate calendar sync
          const events = this.mockCalendarEvents();
          const timeBlocks = events.map(event => ({
            id: event.id,
            title: event.title,
            category: this.categorizeEvent(event),
            startTime: event.start,
            endTime: event.end,
            duration: this.calculateDuration(event.start, event.end),
            date: event.start.split('T')[0],
            completed: false,
            productive: true,
            notes: event.description || ''
          }));

          // Save to localStorage
          const existing = JSON.parse(localStorage.getItem('timeBlocks') || '[]');
          const merged = [...existing, ...timeBlocks.filter(tb =>
            !existing.find((e: any) => e.id === tb.id)
          )];
          localStorage.setItem('timeBlocks', JSON.stringify(merged));

          this.updateSyncCount('google-calendar');
          return { synced: timeBlocks.length };
        }
      },
      {
        id: 'sync-google-pay-expenses',
        pluginId: 'google-pay',
        name: 'Sync Google Pay Transactions',
        description: 'Automatically log Google Pay transactions as expenses',
        trigger: 'schedule',
        schedule: '*/5 * * * *', // Every 5 minutes
        action: async () => {
          const transactions = this.mockGooglePayTransactions();
          const expenses = transactions.map(txn => ({
            id: txn.id,
            description: txn.merchant,
            amount: txn.amount,
            category: this.categorizeMerchant(txn.merchant),
            date: txn.date,
            paymentMethod: 'digital' as const,
            receipt: '',
            recurring: false,
            tags: [txn.category, 'auto-synced']
          }));

          const existing = JSON.parse(localStorage.getItem('expenses') || '[]');
          const merged = [...existing, ...expenses.filter(e =>
            !existing.find((ex: any) => ex.id === e.id)
          )];
          localStorage.setItem('expenses', JSON.stringify(merged));

          this.updateSyncCount('google-pay');
          return { synced: expenses.length };
        }
      },
      {
        id: 'sync-google-fit-workouts',
        pluginId: 'google-fit',
        name: 'Sync Google Fit Workouts',
        description: 'Import fitness activities from Google Fit',
        trigger: 'schedule',
        schedule: '0 * * * *', // Every hour
        action: async () => {
          const activities = this.mockGoogleFitActivities();
          const workouts = activities.map(activity => ({
            id: activity.id,
            name: activity.name,
            type: activity.type,
            duration: activity.duration,
            distance: activity.distance,
            calories: activity.calories,
            date: activity.date,
            intensity: activity.intensity,
            notes: 'Auto-synced from Google Fit'
          }));

          const existing = JSON.parse(localStorage.getItem('workouts') || '[]');
          const merged = [...existing, ...workouts.filter(w =>
            !existing.find((ex: any) => ex.id === w.id)
          )];
          localStorage.setItem('workouts', JSON.stringify(merged));

          this.updateSyncCount('google-fit');
          return { synced: workouts.length };
        }
      },
      {
        id: 'sync-photos-to-memories',
        pluginId: 'google-photos',
        name: 'Sync Photos to Memories',
        description: 'Create memory entries from Google Photos',
        trigger: 'schedule',
        schedule: '0 0 * * *', // Daily
        action: async () => {
          const photos = this.mockGooglePhotos();
          const memories = photos.map(photo => ({
            id: photo.id,
            title: photo.filename || 'Memory',
            date: photo.creationTime,
            category: 'personal' as const,
            description: photo.description || 'Auto-synced from Google Photos',
            location: photo.location,
            people: [],
            emotions: [],
            significance: photo.starred ? 5 : 3,
            favorite: photo.starred,
            tags: ['google-photos', 'auto-synced']
          }));

          const existing = JSON.parse(localStorage.getItem('memories') || '[]');
          const merged = [...existing, ...memories.filter(m =>
            !existing.find((ex: any) => ex.id === m.id)
          )];
          localStorage.setItem('memories', JSON.stringify(merged));

          this.updateSyncCount('google-photos');
          return { synced: memories.length };
        }
      },
      {
        id: 'sync-spotify-mood',
        pluginId: 'spotify',
        name: 'Sync Spotify to Mood Tracking',
        description: 'Analyze music listening to track mood patterns',
        trigger: 'schedule',
        schedule: '*/30 * * * *', // Every 30 minutes
        action: async () => {
          const recentTracks = this.mockSpotifyTracks();
          const moodData = {
            timestamp: new Date().toISOString(),
            tracks: recentTracks,
            inferredMood: this.inferMoodFromMusic(recentTracks),
            energy: this.calculateMusicEnergy(recentTracks),
            valence: this.calculateMusicValence(recentTracks)
          };

          const existing = JSON.parse(localStorage.getItem('musicMoodData') || '[]');
          existing.push(moodData);
          localStorage.setItem('musicMoodData', JSON.stringify(existing.slice(-100))); // Keep last 100

          this.updateSyncCount('spotify');
          return moodData;
        }
      }
    ];

    defaultActions.forEach(action => {
      this.actions.set(action.id, action);
    });
  }

  // Mock data generators (in real implementation, these would call actual APIs)
  private mockCalendarEvents() {
    return [
      {
        id: `cal-${Date.now()}-1`,
        title: 'Team Meeting',
        start: new Date(Date.now() + 3600000).toISOString(),
        end: new Date(Date.now() + 7200000).toISOString(),
        description: 'Weekly sync with the team'
      }
    ];
  }

  private mockGooglePayTransactions() {
    return [
      {
        id: `gpay-${Date.now()}`,
        merchant: 'Starbucks',
        amount: 5.75,
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      }
    ];
  }

  private mockGoogleFitActivities() {
    return [
      {
        id: `fit-${Date.now()}`,
        name: 'Morning Run',
        type: 'running' as const,
        duration: 30,
        distance: 5,
        calories: 300,
        date: new Date().toISOString().split('T')[0],
        intensity: 'moderate' as const
      }
    ];
  }

  private mockGooglePhotos() {
    return [
      {
        id: `photo-${Date.now()}`,
        filename: 'IMG_001.jpg',
        creationTime: new Date().toISOString().split('T')[0],
        description: '',
        location: '',
        starred: false
      }
    ];
  }

  private mockSpotifyTracks() {
    return [
      { name: 'Upbeat Track', artist: 'Artist 1', energy: 0.8, valence: 0.7 },
      { name: 'Calm Song', artist: 'Artist 2', energy: 0.3, valence: 0.5 }
    ];
  }

  // Helper methods
  private categorizeEvent(event: any): 'work' | 'study' | 'exercise' | 'personal' | 'family' | 'social' | 'rest' | 'other' {
    const title = event.title.toLowerCase();
    if (title.includes('meeting') || title.includes('work')) return 'work';
    if (title.includes('study') || title.includes('class')) return 'study';
    if (title.includes('gym') || title.includes('workout')) return 'exercise';
    if (title.includes('family')) return 'family';
    if (title.includes('friend')) return 'social';
    return 'other';
  }

  private categorizeMerchant(merchant: string): string {
    const m = merchant.toLowerCase();
    if (m.includes('starbucks') || m.includes('coffee') || m.includes('restaurant')) return 'food';
    if (m.includes('uber') || m.includes('lyft') || m.includes('gas')) return 'transportation';
    if (m.includes('amazon') || m.includes('store')) return 'shopping';
    if (m.includes('gym') || m.includes('fitness')) return 'health';
    return 'other';
  }

  private calculateDuration(start: string, end: string): number {
    return (new Date(end).getTime() - new Date(start).getTime()) / 60000; // minutes
  }

  private inferMoodFromMusic(tracks: any[]): string {
    const avgEnergy = tracks.reduce((sum, t) => sum + t.energy, 0) / tracks.length;
    const avgValence = tracks.reduce((sum, t) => sum + t.valence, 0) / tracks.length;

    if (avgEnergy > 0.6 && avgValence > 0.6) return 'energetic-happy';
    if (avgEnergy > 0.6 && avgValence < 0.4) return 'energetic-angry';
    if (avgEnergy < 0.4 && avgValence > 0.6) return 'calm-happy';
    if (avgEnergy < 0.4 && avgValence < 0.4) return 'calm-sad';
    return 'neutral';
  }

  private calculateMusicEnergy(tracks: any[]): number {
    return tracks.reduce((sum, t) => sum + t.energy, 0) / tracks.length;
  }

  private calculateMusicValence(tracks: any[]): number {
    return tracks.reduce((sum, t) => sum + t.valence, 0) / tracks.length;
  }

  private updateSyncCount(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.syncCount++;
      plugin.lastSync = new Date().toISOString();
    }
  }

  // Public API
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Start all scheduled actions
    this.actions.forEach(action => {
      if (action.trigger === 'schedule' && action.schedule) {
        // In a real implementation, use cron or setInterval based on schedule
        // For now, run actions periodically
        const interval = this.parseSchedule(action.schedule);
        setInterval(() => {
          const plugin = this.plugins.get(action.pluginId);
          if (plugin?.connected && plugin.autoSync) {
            action.action().catch(console.error);
          }
        }, interval);
      }
    });

    console.log('✅ App Integration Plugin System started');
  }

  stop() {
    this.isRunning = false;
    console.log('⏹️ App Integration Plugin System stopped');
  }

  private parseSchedule(cron: string): number {
    // Simple cron parser - convert to milliseconds
    // */5 * * * * = every 5 minutes = 300000ms
    // */15 * * * * = every 15 minutes = 900000ms
    // 0 * * * * = every hour = 3600000ms
    if (cron.includes('*/5')) return 5 * 60 * 1000;
    if (cron.includes('*/15')) return 15 * 60 * 1000;
    if (cron.includes('*/30')) return 30 * 60 * 1000;
    if (cron.includes('0 *')) return 60 * 60 * 1000;
    if (cron.includes('0 0')) return 24 * 60 * 60 * 1000;
    return 60 * 60 * 1000; // default 1 hour
  }

  getAllPlugins(): AppPlugin[] {
    return Array.from(this.plugins.values());
  }

  getPlugin(id: string): AppPlugin | undefined {
    return this.plugins.get(id);
  }

  connectPlugin(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.connected = true;
      console.log(`✅ Connected to ${plugin.name}`);
      return true;
    }
    return false;
  }

  disconnectPlugin(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.connected = false;
      console.log(`⛔ Disconnected from ${plugin.name}`);
      return true;
    }
    return false;
  }

  toggleAutoSync(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.autoSync = !plugin.autoSync;
      return plugin.autoSync;
    }
    return false;
  }

  runAction(actionId: string): Promise<any> {
    const action = this.actions.get(actionId);
    if (action) {
      const plugin = this.plugins.get(action.pluginId);
      if (plugin?.connected) {
        return action.action();
      }
      return Promise.reject('Plugin not connected');
    }
    return Promise.reject('Action not found');
  }

  getPluginsByCategory(category: string): AppPlugin[] {
    return Array.from(this.plugins.values()).filter(p => p.category === category);
  }

  getSyncStats() {
    const plugins = Array.from(this.plugins.values());
    return {
      totalPlugins: plugins.length,
      connectedPlugins: plugins.filter(p => p.connected).length,
      autoSyncEnabled: plugins.filter(p => p.autoSync).length,
      totalSyncs: plugins.reduce((sum, p) => sum + p.syncCount, 0),
      lastSync: plugins
        .filter(p => p.lastSync)
        .sort((a, b) => (b.lastSync! > a.lastSync! ? 1 : -1))[0]?.lastSync
    };
  }
}

// Initialize and start the system
export const appPluginSystem = AppIntegrationPluginSystem.getInstance();
