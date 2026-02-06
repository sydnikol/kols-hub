import { CommunityPost } from '../types';

export class CommunityService {
  private posts: Map<string, CommunityPost>;
  private userPosts: Map<string, string[]>;
  private likes: Map<string, Set<string>>;
  private comments: Map<string, any[]>;

  constructor() {
    this.posts = new Map();
    this.userPosts = new Map();
    this.likes = new Map();
    this.comments = new Map();
  }

  async createPost(
    userId: string,
    content: string,
    type: 'text' | 'image' | 'video' | 'poll',
    options?: {
      tags?: string[];
      isAnonymous?: boolean;
      mediaUrl?: string;
      pollOptions?: string[];
    }
  ): Promise<CommunityPost> {
    const postId = `post-${Date.now()}-${userId}`;

    const post: CommunityPost = {
      id: postId,
      userId: options?.isAnonymous ? 'anonymous' : userId,
      content,
      type,
      tags: options?.tags || [],
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      isAnonymous: options?.isAnonymous || false,
    };

    this.posts.set(postId, post);

    const userPostsList = this.userPosts.get(userId) || [];
    userPostsList.push(postId);
    this.userPosts.set(userId, userPostsList);

    return post;
  }

  async getFeed(userId: string, filters?: { tags?: string[]; type?: string }): Promise<CommunityPost[]> {
    let allPosts = Array.from(this.posts.values());

    // Apply filters
    if (filters?.tags && filters.tags.length > 0) {
      allPosts = allPosts.filter((post) =>
        post.tags?.some((tag) => filters.tags?.includes(tag))
      );
    }

    if (filters?.type) {
      allPosts = allPosts.filter((post) => post.type === filters.type);
    }

    // Sort by most recent
    allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return allPosts;
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const postLikes = this.likes.get(postId) || new Set();

    if (postLikes.has(userId)) {
      // Unlike
      postLikes.delete(userId);
      post.likes--;
    } else {
      // Like
      postLikes.add(userId);
      post.likes++;
    }

    this.likes.set(postId, postLikes);
    this.posts.set(postId, post);
  }

  async addComment(
    postId: string,
    userId: string,
    content: string,
    isAnonymous: boolean = false
  ): Promise<void> {
    const post = this.posts.get(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const comment = {
      id: `comment-${Date.now()}`,
      userId: isAnonymous ? 'anonymous' : userId,
      content,
      createdAt: new Date(),
      isAnonymous,
    };

    const postComments = this.comments.get(postId) || [];
    postComments.push(comment);
    this.comments.set(postId, postComments);

    post.comments++;
    this.posts.set(postId, post);
  }

  async getComments(postId: string): Promise<any[]> {
    return this.comments.get(postId) || [];
  }

  async getUserPosts(userId: string): Promise<CommunityPost[]> {
    const postIds = this.userPosts.get(userId) || [];
    return postIds.map((id) => this.posts.get(id)).filter((p) => p !== undefined) as CommunityPost[];
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.userId !== userId && !post.isAnonymous) {
      throw new Error('Unauthorized to delete this post');
    }

    this.posts.delete(postId);
    this.likes.delete(postId);
    this.comments.delete(postId);

    const userPostsList = this.userPosts.get(userId) || [];
    const index = userPostsList.indexOf(postId);
    if (index > -1) {
      userPostsList.splice(index, 1);
      this.userPosts.set(userId, userPostsList);
    }
  }

  async searchPosts(query: string): Promise<CommunityPost[]> {
    const lowerQuery = query.toLowerCase();
    const allPosts = Array.from(this.posts.values());

    return allPosts.filter(
      (post) =>
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getTrendingTags(): Promise<{ tag: string; count: number }[]> {
    const tagCounts = new Map<string, number>();

    for (const post of this.posts.values()) {
      for (const tag of post.tags || []) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
