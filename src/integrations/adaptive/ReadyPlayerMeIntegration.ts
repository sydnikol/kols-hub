import axios from 'axios';

export class ReadyPlayerMeIntegration {
  private readonly subdomain: string;
  private userAvatars: Map<string, string>;

  constructor(subdomain: string = 'demo') {
    this.subdomain = subdomain;
    this.userAvatars = new Map();
  }

  getAvatarCreatorUrl(userId: string): string {
    // Generate Ready Player Me avatar creator URL
    return `https://${this.subdomain}.readyplayer.me/avatar?frameApi&userId=${userId}`;
  }

  async handleAvatarCreated(userId: string, avatarUrl: string): Promise<void> {
    // Validate the avatar URL
    if (!avatarUrl.includes('readyplayer.me')) {
      throw new Error('Invalid Ready Player Me avatar URL');
    }

    // Store the avatar URL for the user
    this.userAvatars.set(userId, avatarUrl);
  }

  async getAvatarGlb(userId: string, quality: 'low' | 'medium' | 'high' = 'medium'): Promise<string> {
    const avatarUrl = this.userAvatars.get(userId);
    if (!avatarUrl) {
      throw new Error('No avatar found for user');
    }

    // Return GLB model URL with quality parameter
    return `${avatarUrl}.glb?quality=${quality}`;
  }

  async getAvatarMetadata(userId: string): Promise<any> {
    const avatarUrl = this.userAvatars.get(userId);
    if (!avatarUrl) {
      throw new Error('No avatar found for user');
    }

    try {
      // Fetch avatar JSON metadata
      const response = await axios.get(`${avatarUrl}.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching avatar metadata:', error);
      throw new Error('Failed to fetch avatar metadata');
    }
  }

  async updateAvatar(userId: string, newAvatarUrl: string): Promise<void> {
    await this.handleAvatarCreated(userId, newAvatarUrl);
  }

  getUserAvatar(userId: string): string | undefined {
    return this.userAvatars.get(userId);
  }

  async deleteAvatar(userId: string): Promise<void> {
    this.userAvatars.delete(userId);
  }

  // Animation helpers
  getAnimationUrl(animationType: 'idle' | 'walking' | 'talking' | 'waving'): string {
    const animationMap = {
      idle: 'https://models.readyplayer.me/animations/idle.fbx',
      walking: 'https://models.readyplayer.me/animations/walking.fbx',
      talking: 'https://models.readyplayer.me/animations/talking.fbx',
      waving: 'https://models.readyplayer.me/animations/waving.fbx',
    };

    return animationMap[animationType];
  }
}
