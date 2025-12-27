// Social Service
// Handles all social features using localStorage for persistence

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinedAt: string;
  lastActiveAt: string;
  stats: {
    totalScore: number;
    gamesPlayed: number;
    friendCount: number;
    roomsShared: number;
    giftsGiven: number;
    giftsReceived: number;
    achievementCount: number;
  };
  preferences: {
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
    allowGifts: boolean;
    shareActivity: boolean;
  };
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastActiveAt: string;
  addedAt: string;
  roomPreview?: SharedRoomConfig;
  favoriteRoom?: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar: string;
  message?: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface VirtualGift {
  id: string;
  type: 'crystal' | 'candle' | 'potion' | 'tarot-card' | 'rune' | 'flower' | 'book' | 'star';
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
}

export interface GiftTransaction {
  id: string;
  giftId: string;
  gift: VirtualGift;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  message?: string;
  sentAt: string;
  isRead: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  gamesPlayed: number;
  achievedAt: string;
  isCurrentUser: boolean;
}

export interface GameScore {
  gameId: string;
  gameName: string;
  score: number;
  achievedAt: string;
  duration?: number;
}

export interface SharedRoomConfig {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
  roomId: string;
  roomName: string;
  customizations: {
    theme?: string;
    ambiance?: string;
    decorations?: string[];
    layout?: string;
    colors?: Record<string, string>;
  };
  stats: {
    views: number;
    imports: number;
    likes: number;
  };
  shareCode: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'achievement' | 'score' | 'friend' | 'room-share' | 'gift' | 'milestone';
  userId: string;
  username: string;
  avatar: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Available virtual gifts
export const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: 'crystal-amethyst', type: 'crystal', name: 'Amethyst Crystal', icon: '💎', rarity: 'common', description: 'A calming purple crystal' },
  { id: 'crystal-rose-quartz', type: 'crystal', name: 'Rose Quartz', icon: '💗', rarity: 'common', description: 'Crystal of love and healing' },
  { id: 'crystal-obsidian', type: 'crystal', name: 'Obsidian', icon: '🖤', rarity: 'uncommon', description: 'Protective volcanic glass' },
  { id: 'crystal-moonstone', type: 'crystal', name: 'Moonstone', icon: '🌙', rarity: 'rare', description: 'Captures lunar energy' },
  { id: 'candle-black', type: 'candle', name: 'Black Candle', icon: '🕯️', rarity: 'common', description: 'For protection rituals' },
  { id: 'candle-white', type: 'candle', name: 'White Candle', icon: '🕯️', rarity: 'common', description: 'Purification and clarity' },
  { id: 'candle-purple', type: 'candle', name: 'Purple Candle', icon: '🕯️', rarity: 'uncommon', description: 'Spiritual awareness' },
  { id: 'potion-luck', type: 'potion', name: 'Luck Potion', icon: '🧪', rarity: 'uncommon', description: 'Bottled fortune' },
  { id: 'potion-energy', type: 'potion', name: 'Energy Elixir', icon: '⚗️', rarity: 'uncommon', description: 'Restores spoons' },
  { id: 'potion-wisdom', type: 'potion', name: 'Wisdom Tonic', icon: '🧪', rarity: 'rare', description: 'Ancient knowledge' },
  { id: 'tarot-fool', type: 'tarot-card', name: 'The Fool Card', icon: '🃏', rarity: 'uncommon', description: 'New beginnings await' },
  { id: 'tarot-star', type: 'tarot-card', name: 'The Star Card', icon: '⭐', rarity: 'rare', description: 'Hope and inspiration' },
  { id: 'tarot-moon', type: 'tarot-card', name: 'The Moon Card', icon: '🌕', rarity: 'rare', description: 'Intuition and mystery' },
  { id: 'rune-fehu', type: 'rune', name: 'Fehu Rune', icon: '᛫', rarity: 'common', description: 'Wealth and abundance' },
  { id: 'rune-ansuz', type: 'rune', name: 'Ansuz Rune', icon: '᛭', rarity: 'uncommon', description: 'Divine communication' },
  { id: 'flower-rose', type: 'flower', name: 'Gothic Rose', icon: '🥀', rarity: 'common', description: 'Dark romantic beauty' },
  { id: 'flower-lily', type: 'flower', name: 'Moon Lily', icon: '🌸', rarity: 'uncommon', description: 'Blooms at midnight' },
  { id: 'book-spells', type: 'book', name: 'Spell Book', icon: '📖', rarity: 'rare', description: 'Ancient incantations' },
  { id: 'book-grimoire', type: 'book', name: 'Personal Grimoire', icon: '📕', rarity: 'legendary', description: 'A witch\'s companion' },
  { id: 'star-fallen', type: 'star', name: 'Fallen Star', icon: '✨', rarity: 'legendary', description: 'Captured starlight' },
];

const STORAGE_KEYS = {
  profile: 'gothic_social_profile',
  friends: 'gothic_social_friends',
  friendRequests: 'gothic_social_friend_requests',
  gifts: 'gothic_social_gifts',
  giftInventory: 'gothic_social_gift_inventory',
  scores: 'gothic_social_scores',
  sharedRooms: 'gothic_social_shared_rooms',
  importedRooms: 'gothic_social_imported_rooms',
  activityFeed: 'gothic_social_activity_feed',
  leaderboards: 'gothic_social_leaderboards',
};

// Generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate share code
const generateShareCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

class SocialService {
  // ==================== Profile Management ====================

  getProfile(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.profile);
    return data ? JSON.parse(data) : null;
  }

  createProfile(username: string, displayName: string): UserProfile {
    const profile: UserProfile = {
      id: generateId(),
      username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      displayName,
      avatar: '👤',
      bio: 'A mysterious wanderer of the Gothic Dollhouse...',
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      stats: {
        totalScore: 0,
        gamesPlayed: 0,
        friendCount: 0,
        roomsShared: 0,
        giftsGiven: 0,
        giftsReceived: 0,
        achievementCount: 0,
      },
      preferences: {
        showOnlineStatus: true,
        allowFriendRequests: true,
        allowGifts: true,
        shareActivity: true,
      },
    };
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    return profile;
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile | null {
    const profile = this.getProfile();
    if (!profile) return null;

    const updated = { ...profile, ...updates, lastActiveAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updated));
    return updated;
  }

  updateProfileStats(stats: Partial<UserProfile['stats']>): void {
    const profile = this.getProfile();
    if (!profile) return;

    profile.stats = { ...profile.stats, ...stats };
    profile.lastActiveAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }

  // ==================== Friend Management ====================

  getFriends(): Friend[] {
    const data = localStorage.getItem(STORAGE_KEYS.friends);
    return data ? JSON.parse(data) : [];
  }

  addFriend(friend: Omit<Friend, 'id' | 'addedAt'>): Friend {
    const friends = this.getFriends();
    const newFriend: Friend = {
      ...friend,
      id: generateId(),
      addedAt: new Date().toISOString(),
    };
    friends.push(newFriend);
    localStorage.setItem(STORAGE_KEYS.friends, JSON.stringify(friends));

    // Update friend count
    const profile = this.getProfile();
    if (profile) {
      this.updateProfileStats({ friendCount: friends.length });
    }

    // Add activity
    this.addActivityItem({
      type: 'friend',
      userId: newFriend.id,
      username: newFriend.username,
      avatar: newFriend.avatar,
      message: `You became friends with ${newFriend.displayName}`,
    });

    return newFriend;
  }

  removeFriend(friendId: string): void {
    const friends = this.getFriends().filter(f => f.id !== friendId);
    localStorage.setItem(STORAGE_KEYS.friends, JSON.stringify(friends));
    this.updateProfileStats({ friendCount: friends.length });
  }

  updateFriendStatus(friendId: string, status: Friend['status']): void {
    const friends = this.getFriends();
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      friend.status = status;
      friend.lastActiveAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.friends, JSON.stringify(friends));
    }
  }

  getFriendRequests(): FriendRequest[] {
    const data = localStorage.getItem(STORAGE_KEYS.friendRequests);
    return data ? JSON.parse(data) : [];
  }

  sendFriendRequest(toUsername: string, message?: string): FriendRequest | null {
    const profile = this.getProfile();
    if (!profile) return null;

    const request: FriendRequest = {
      id: generateId(),
      fromUserId: profile.id,
      fromUsername: profile.username,
      fromAvatar: profile.avatar,
      message,
      sentAt: new Date().toISOString(),
      status: 'pending',
    };

    const requests = this.getFriendRequests();
    requests.push(request);
    localStorage.setItem(STORAGE_KEYS.friendRequests, JSON.stringify(requests));
    return request;
  }

  // ==================== Gift System ====================

  getGiftInventory(): VirtualGift[] {
    const data = localStorage.getItem(STORAGE_KEYS.giftInventory);
    return data ? JSON.parse(data) : [];
  }

  addGiftToInventory(giftId: string): void {
    const gift = VIRTUAL_GIFTS.find(g => g.id === giftId);
    if (!gift) return;

    const inventory = this.getGiftInventory();
    inventory.push(gift);
    localStorage.setItem(STORAGE_KEYS.giftInventory, JSON.stringify(inventory));
  }

  getReceivedGifts(): GiftTransaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.gifts);
    return data ? JSON.parse(data) : [];
  }

  sendGift(toFriendId: string, giftId: string, message?: string): GiftTransaction | null {
    const profile = this.getProfile();
    const friends = this.getFriends();
    const friend = friends.find(f => f.id === toFriendId);
    const gift = VIRTUAL_GIFTS.find(g => g.id === giftId);

    if (!profile || !friend || !gift) return null;

    const transaction: GiftTransaction = {
      id: generateId(),
      giftId,
      gift,
      fromUserId: profile.id,
      fromUsername: profile.username,
      toUserId: friend.id,
      toUsername: friend.username,
      message,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    const gifts = this.getReceivedGifts();
    gifts.push(transaction);
    localStorage.setItem(STORAGE_KEYS.gifts, JSON.stringify(gifts));

    this.updateProfileStats({ giftsGiven: (profile.stats.giftsGiven || 0) + 1 });

    this.addActivityItem({
      type: 'gift',
      userId: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      message: `Sent a ${gift.name} to ${friend.displayName}`,
      details: { giftId, giftName: gift.name, giftIcon: gift.icon },
    });

    return transaction;
  }

  markGiftAsRead(transactionId: string): void {
    const gifts = this.getReceivedGifts();
    const gift = gifts.find(g => g.id === transactionId);
    if (gift) {
      gift.isRead = true;
      localStorage.setItem(STORAGE_KEYS.gifts, JSON.stringify(gifts));
    }
  }

  // ==================== Leaderboard System ====================

  getGameScores(): GameScore[] {
    const data = localStorage.getItem(STORAGE_KEYS.scores);
    return data ? JSON.parse(data) : [];
  }

  saveGameScore(gameId: string, gameName: string, score: number, duration?: number): GameScore {
    const newScore: GameScore = {
      gameId,
      gameName,
      score,
      achievedAt: new Date().toISOString(),
      duration,
    };

    const scores = this.getGameScores();
    scores.push(newScore);
    localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(scores));

    // Update profile stats
    const profile = this.getProfile();
    if (profile) {
      const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
      this.updateProfileStats({
        totalScore,
        gamesPlayed: scores.length,
      });
    }

    // Check for high score activity
    const gameScores = scores.filter(s => s.gameId === gameId);
    const isHighScore = gameScores.every(s => s.score <= score);
    if (isHighScore && profile) {
      this.addActivityItem({
        type: 'score',
        userId: profile.id,
        username: profile.username,
        avatar: profile.avatar,
        message: `Set a new high score of ${score.toLocaleString()} in ${gameName}!`,
        details: { gameId, gameName, score },
      });
    }

    return newScore;
  }

  getLeaderboard(gameId: string, timeFilter: 'weekly' | 'allTime' = 'allTime'): LeaderboardEntry[] {
    const profile = this.getProfile();
    const scores = this.getGameScores().filter(s => s.gameId === gameId);

    // Filter by time if weekly
    let filteredScores = scores;
    if (timeFilter === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredScores = scores.filter(s => new Date(s.achievedAt) >= weekAgo);
    }

    // Get best score per "user" (simulated with unique timestamps)
    const bestScores = new Map<string, GameScore>();
    filteredScores.forEach(score => {
      const existing = bestScores.get(score.achievedAt.split('T')[0]);
      if (!existing || score.score > existing.score) {
        bestScores.set(score.achievedAt.split('T')[0], score);
      }
    });

    // Create leaderboard entries
    const entries: LeaderboardEntry[] = Array.from(bestScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 100)
      .map((score, index) => ({
        rank: index + 1,
        userId: profile?.id || 'unknown',
        username: profile?.username || 'Player',
        avatar: profile?.avatar || '👤',
        score: score.score,
        gamesPlayed: filteredScores.filter(s =>
          s.achievedAt.split('T')[0] === score.achievedAt.split('T')[0]
        ).length,
        achievedAt: score.achievedAt,
        isCurrentUser: true,
      }));

    // Add simulated other players for demo purposes
    const simulatedPlayers = this.getSimulatedLeaderboard(gameId);
    const combined = [...entries, ...simulatedPlayers]
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, 100);

    return combined;
  }

  private getSimulatedLeaderboard(gameId: string): LeaderboardEntry[] {
    // Simulated players for demo - in real app this would come from server
    const simulatedData: Record<string, LeaderboardEntry[]> = {
      'memory-match': [
        { rank: 0, userId: 'sim1', username: 'MysticRaven', avatar: '🦇', score: 2450, gamesPlayed: 45, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim2', username: 'ShadowWitch', avatar: '🧙‍♀️', score: 2100, gamesPlayed: 38, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim3', username: 'MoonChild', avatar: '🌙', score: 1890, gamesPlayed: 52, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim4', username: 'CrystalSeer', avatar: '🔮', score: 1650, gamesPlayed: 29, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim5', username: 'NightOwl', avatar: '🦉', score: 1420, gamesPlayed: 67, achievedAt: new Date().toISOString(), isCurrentUser: false },
      ],
      'word-spell': [
        { rank: 0, userId: 'sim1', username: 'WordWizard', avatar: '📚', score: 3200, gamesPlayed: 89, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim2', username: 'SpellCaster', avatar: '✨', score: 2800, gamesPlayed: 76, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim3', username: 'RuneMaster', avatar: '᛭', score: 2450, gamesPlayed: 54, achievedAt: new Date().toISOString(), isCurrentUser: false },
      ],
      'tarot-solitaire': [
        { rank: 0, userId: 'sim1', username: 'TarotQueen', avatar: '👑', score: 5600, gamesPlayed: 123, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim2', username: 'CardShark', avatar: '🃏', score: 4900, gamesPlayed: 98, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim3', username: 'FateSeer', avatar: '🔮', score: 4200, gamesPlayed: 87, achievedAt: new Date().toISOString(), isCurrentUser: false },
      ],
      'crystal-match': [
        { rank: 0, userId: 'sim1', username: 'GemCollector', avatar: '💎', score: 8900, gamesPlayed: 156, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim2', username: 'CrystalMage', avatar: '🔮', score: 7600, gamesPlayed: 134, achievedAt: new Date().toISOString(), isCurrentUser: false },
        { rank: 0, userId: 'sim3', username: 'StoneKeeper', avatar: '🪨', score: 6800, gamesPlayed: 112, achievedAt: new Date().toISOString(), isCurrentUser: false },
      ],
    };
    return simulatedData[gameId] || [];
  }

  getPersonalBest(gameId: string): number {
    const scores = this.getGameScores().filter(s => s.gameId === gameId);
    if (scores.length === 0) return 0;
    return Math.max(...scores.map(s => s.score));
  }

  // ==================== Room Sharing ====================

  getSharedRooms(): SharedRoomConfig[] {
    const data = localStorage.getItem(STORAGE_KEYS.sharedRooms);
    return data ? JSON.parse(data) : [];
  }

  getImportedRooms(): SharedRoomConfig[] {
    const data = localStorage.getItem(STORAGE_KEYS.importedRooms);
    return data ? JSON.parse(data) : [];
  }

  shareRoom(roomId: string, roomName: string, name: string, description: string, customizations: SharedRoomConfig['customizations']): SharedRoomConfig | null {
    const profile = this.getProfile();
    if (!profile) return null;

    const sharedRoom: SharedRoomConfig = {
      id: generateId(),
      name,
      description,
      createdBy: profile.id,
      createdByUsername: profile.username,
      createdAt: new Date().toISOString(),
      roomId,
      roomName,
      customizations,
      stats: {
        views: 0,
        imports: 0,
        likes: 0,
      },
      shareCode: generateShareCode(),
    };

    const rooms = this.getSharedRooms();
    rooms.push(sharedRoom);
    localStorage.setItem(STORAGE_KEYS.sharedRooms, JSON.stringify(rooms));

    this.updateProfileStats({ roomsShared: rooms.length });

    this.addActivityItem({
      type: 'room-share',
      userId: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      message: `Shared their ${roomName} configuration: "${name}"`,
      details: { roomId, shareCode: sharedRoom.shareCode },
    });

    return sharedRoom;
  }

  importRoomByCode(shareCode: string): SharedRoomConfig | null {
    const rooms = this.getSharedRooms();
    const room = rooms.find(r => r.shareCode === shareCode.toUpperCase());

    if (!room) return null;

    // Update import stats
    room.stats.imports++;
    localStorage.setItem(STORAGE_KEYS.sharedRooms, JSON.stringify(rooms));

    // Add to imported rooms
    const imported = this.getImportedRooms();
    if (!imported.find(r => r.id === room.id)) {
      imported.push(room);
      localStorage.setItem(STORAGE_KEYS.importedRooms, JSON.stringify(imported));
    }

    return room;
  }

  exportRoomConfig(room: SharedRoomConfig): string {
    return btoa(JSON.stringify(room));
  }

  importRoomFromJson(jsonString: string): SharedRoomConfig | null {
    try {
      const room = JSON.parse(atob(jsonString)) as SharedRoomConfig;
      if (!room.id || !room.roomId || !room.customizations) {
        return null;
      }

      const imported = this.getImportedRooms();
      if (!imported.find(r => r.id === room.id)) {
        imported.push(room);
        localStorage.setItem(STORAGE_KEYS.importedRooms, JSON.stringify(imported));
      }

      return room;
    } catch {
      return null;
    }
  }

  deleteSharedRoom(roomId: string): void {
    const rooms = this.getSharedRooms().filter(r => r.id !== roomId);
    localStorage.setItem(STORAGE_KEYS.sharedRooms, JSON.stringify(rooms));
  }

  // ==================== Activity Feed ====================

  getActivityFeed(limit: number = 50): ActivityFeedItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.activityFeed);
    const items: ActivityFeedItem[] = data ? JSON.parse(data) : [];
    return items.slice(0, limit);
  }

  addActivityItem(item: Omit<ActivityFeedItem, 'id' | 'timestamp'>): ActivityFeedItem {
    const newItem: ActivityFeedItem = {
      ...item,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    const feed = this.getActivityFeed(100);
    feed.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.activityFeed, JSON.stringify(feed.slice(0, 100)));
    return newItem;
  }

  clearActivityFeed(): void {
    localStorage.setItem(STORAGE_KEYS.activityFeed, JSON.stringify([]));
  }

  // ==================== Demo Data ====================

  initializeDemoData(): void {
    // Create demo profile if none exists
    if (!this.getProfile()) {
      this.createProfile('gothic_wanderer', 'Gothic Wanderer');
    }

    // Add demo friends if none exist
    if (this.getFriends().length === 0) {
      const demoFriends: Omit<Friend, 'id' | 'addedAt'>[] = [
        { username: 'mystic_raven', displayName: 'Mystic Raven', avatar: '🦇', status: 'online', lastActiveAt: new Date().toISOString(), favoriteRoom: 'fortune-teller' },
        { username: 'shadow_witch', displayName: 'Shadow Witch', avatar: '🧙‍♀️', status: 'away', lastActiveAt: new Date(Date.now() - 3600000).toISOString(), favoriteRoom: 'apothecary' },
        { username: 'moon_child', displayName: 'Moon Child', avatar: '🌙', status: 'offline', lastActiveAt: new Date(Date.now() - 86400000).toISOString(), favoriteRoom: 'dream-archives' },
        { username: 'crystal_seer', displayName: 'Crystal Seer', avatar: '🔮', status: 'online', lastActiveAt: new Date().toISOString(), favoriteRoom: 'rooftop-observatory' },
        { username: 'night_owl', displayName: 'Night Owl', avatar: '🦉', status: 'busy', lastActiveAt: new Date(Date.now() - 1800000).toISOString(), favoriteRoom: 'library-study' },
      ];
      demoFriends.forEach(f => this.addFriend(f));
    }

    // Add demo gifts to inventory
    if (this.getGiftInventory().length === 0) {
      ['crystal-amethyst', 'crystal-rose-quartz', 'candle-black', 'flower-rose', 'rune-fehu'].forEach(id => {
        this.addGiftToInventory(id);
      });
    }

    // Add demo activity
    if (this.getActivityFeed().length === 0) {
      const profile = this.getProfile();
      if (profile) {
        this.addActivityItem({
          type: 'milestone',
          userId: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          message: 'Joined the Gothic Dollhouse community!',
        });
      }
    }
  }
}

export const socialService = new SocialService();
export default socialService;
