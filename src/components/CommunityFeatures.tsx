import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MessageSquare, Heart, UserPlus, Settings, Bell, Search, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  isMember: boolean;
  avatar?: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'online' | 'in-person' | 'hybrid';
  groupId: string;
  attendees: number;
  isAttending: boolean;
}

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  groupId?: string;
  isLiked: boolean;
}

export const CommunityFeatures: React.FC = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'groups' | 'events' | 'feed'>('groups');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    // Sample data
    const sampleGroups: CommunityGroup[] = [
      {
        id: 'g1',
        name: 'Chronic Illness Warriors',
        description: 'Support group for people living with chronic illness',
        memberCount: 1234,
        category: 'Health Support',
        isPrivate: false,
        isMember: true
      },
      {
        id: 'g2',
        name: 'Gothic Aesthetics & Art',
        description: 'Share and discuss gothic art, fashion, and culture',
        memberCount: 567,
        category: 'Creative',
        isPrivate: false,
        isMember: true
      },
      {
        id: 'g3',
        name: 'Spoon Theory Support',
        description: 'Energy management and spoon theory discussions',
        memberCount: 890,
        category: 'Health Support',
        isPrivate: false,
        isMember: false
      },
      {
        id: 'g4',
        name: 'Disability Advocacy',
        description: 'Activism and advocacy for disability rights',
        memberCount: 2345,
        category: 'Advocacy',
        isPrivate: false,
        isMember: true
      }
    ];

    const sampleEvents: CommunityEvent[] = [
      {
        id: 'e1',
        title: 'Virtual Support Circle',
        description: 'Weekly support group meeting',
        date: '2025-11-20',
        time: '19:00',
        type: 'online',
        groupId: 'g1',
        attendees: 25,
        isAttending: true
      },
      {
        id: 'e2',
        title: 'Art Share Session',
        description: 'Share your gothic-inspired artwork',
        date: '2025-11-22',
        time: '18:00',
        type: 'online',
        groupId: 'g2',
        attendees: 15,
        isAttending: false
      }
    ];

    const samplePosts: Post[] = [
      {
        id: 'p1',
        author: 'ShadowMoon',
        content: 'Just finished my medication tracking for the week. The visual progress really helps me stay consistent! 💜',
        likes: 12,
        comments: 3,
        timestamp: new Date().toISOString(),
        groupId: 'g1',
        isLiked: false
      },
      {
        id: 'p2',
        author: 'GothicRose',
        content: 'Working on a new digital art piece with dark forest vibes. The creative process is so therapeutic!',
        likes: 24,
        comments: 7,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        groupId: 'g2',
        isLiked: true
      }
    ];

    setGroups(sampleGroups);
    setEvents(sampleEvents);
    setPosts(samplePosts);
  };

  const joinGroup = (groupId: string) => {
    setGroups(groups.map(g =>
      g.id === groupId ? { ...g, isMember: true, memberCount: g.memberCount + 1 } : g
    ));
    toast.success('Joined group!');
  };

  const leaveGroup = (groupId: string) => {
    setGroups(groups.map(g =>
      g.id === groupId ? { ...g, isMember: false, memberCount: g.memberCount - 1 } : g
    ));
    toast.success('Left group');
  };

  const attendEvent = (eventId: string) => {
    setEvents(events.map(e =>
      e.id === eventId ? { ...e, isAttending: true, attendees: e.attendees + 1 } : e
    ));
    toast.success('You\'re attending!');
  };

  const likePost = (postId: string) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Community</h1>
              <p className="text-gray-400 mt-1">Connect with others who understand your journey</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite Friends
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {(['groups', 'events', 'feed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'groups' && <Users className="w-4 h-4 inline mr-2" />}
              {tab === 'events' && <Calendar className="w-4 h-4 inline mr-2" />}
              {tab === 'feed' && <MessageSquare className="w-4 h-4 inline mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        {activeTab === 'groups' && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded">
                    {group.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{group.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group.memberCount} members
                  </span>
                  {group.isPrivate && (
                    <span className="text-indigo-400 text-xs">Private</span>
                  )}
                </div>

                {group.isMember ? (
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">
                      View Group
                    </button>
                    <button
                      onClick={() => leaveGroup(group.id)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      Leave
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => joinGroup(group.id)}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                  >
                    Join Group
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">{event.title}</h3>
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>🕐 {event.time}</span>
                      <span>👥 {event.attendees} attending</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {event.isAttending ? (
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm">
                        Attending ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => attendEvent(event.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                      >
                        Attend
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Create Post */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                <textarea
                  placeholder="Share something with the community..."
                  className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded">
                    Post
                  </button>
                </div>
              </div>

              {/* Posts Feed */}
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{post.author[0]}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{post.author}</h4>
                      <p className="text-gray-400 text-xs">
                        {new Date(post.timestamp).toRelativeTime()}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-200 mb-4">{post.content}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-1 hover:text-red-400 ${
                        post.isLiked ? 'text-red-400' : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {['#ChronicIllness', '#GothicAesthetic', '#SpoonTheory', '#DisabilityRights'].map(tag => (
                    <button key={tag} className="block w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-purple-300 text-sm">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Groups</h3>
                <div className="space-y-2">
                  {groups.filter(g => g.isMember).map(group => (
                    <div key={group.id} className="text-sm">
                      <p className="text-white font-semibold">{group.name}</p>
                      <p className="text-gray-400 text-xs">{group.memberCount} members</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Utility extension for relative time
declare global {
  interface Date {
    toRelativeTime(): string;
  }
}

Date.prototype.toRelativeTime = function() {
  const seconds = Math.floor((new Date().getTime() - this.getTime()) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};
