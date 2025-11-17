import React, { useState, useEffect } from 'react';
import { User, Plus, Star, Trash2, Download, Upload, Edit3, Check, X, Camera, Sparkles } from 'lucide-react';
import { useKolHubStore } from '../store/kolhub-store';
import { ReadyPlayerMeAvatar } from '../types/avatar';
import { getAvatarThumbnailUrl, getAvatarUrl, createAvatarObject, getDefaultAvatarConfig } from '../utils/avatar-utils';
import AvatarCreator from './AvatarCreator';
import Avatar3D from './ReadyPlayerMeAvatar';
import toast from 'react-hot-toast';

/**
 * 🎮 AVATAR PROFILE MANAGER
 * =========================
 * Complete avatar management system:
 * - Multiple avatar profiles
 * - 3D preview
 * - Favorite management
 * - Import/Export
 * - Custom naming and tags
 */
const AvatarProfileManager: React.FC = () => {
  const { avatars, currentAvatar, addAvatar, removeAvatar, setCurrentAvatar, updateAvatar } = useKolHubStore();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<ReadyPlayerMeAvatar | null>(null);
  const [editingAvatar, setEditingAvatar] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPreview, setShowPreview] = useState(false);
  const config = getDefaultAvatarConfig();

  // Set default avatar on mount if none selected
  useEffect(() => {
    if (!currentAvatar && avatars.length > 0) {
      setCurrentAvatar(avatars[0]);
    }
  }, [avatars, currentAvatar]);

  const handleCreateNew = () => {
    setShowCreator(true);
  };

  const handleAvatarCreated = (avatarId: string) => {
    console.log('✅ New avatar created:', avatarId);
    toast.success('Avatar added to your collection!');
  };

  const handleSelectAvatar = (avatar: ReadyPlayerMeAvatar) => {
    setCurrentAvatar(avatar);
    setSelectedAvatar(avatar);
    toast.success(`Switched to ${avatar.name}!`);
  };

  const handleToggleFavorite = (avatar: ReadyPlayerMeAvatar) => {
    updateAvatar(avatar.id, { ...avatar, isFavorite: !avatar.isFavorite });
    toast.success(avatar.isFavorite ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleDeleteAvatar = (avatar: ReadyPlayerMeAvatar) => {
    if (confirm(`Delete "${avatar.name}"? This cannot be undone.`)) {
      removeAvatar(avatar.id);
      if (currentAvatar?.id === avatar.id) {
        const remaining = avatars.filter(a => a.id !== avatar.id);
        if (remaining.length > 0) {
          setCurrentAvatar(remaining[0]);
        }
      }
      toast.success('Avatar deleted');
    }
  };

  const handleStartEdit = (avatar: ReadyPlayerMeAvatar) => {
    setEditingAvatar(avatar.id);
    setEditName(avatar.name);
  };

  const handleSaveEdit = (avatar: ReadyPlayerMeAvatar) => {
    if (editName.trim()) {
      updateAvatar(avatar.id, { ...avatar, name: editName.trim() });
      toast.success('Name updated!');
    }
    setEditingAvatar(null);
  };

  const handleCancelEdit = () => {
    setEditingAvatar(null);
    setEditName('');
  };

  const handleExportAvatar = (avatar: ReadyPlayerMeAvatar) => {
    const data = JSON.stringify(avatar, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kol-avatar-${avatar.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Avatar exported!');
  };

  const handleImportAvatar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text) as ReadyPlayerMeAvatar;
          addAvatar(data);
          toast.success('Avatar imported successfully!');
        } catch (error) {
          toast.error('Invalid avatar file');
        }
      }
    };
    input.click();
  };

  const handlePreviewAvatar = (avatar: ReadyPlayerMeAvatar) => {
    setSelectedAvatar(avatar);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <User size={28} className="text-purple-400" />
                </div>
                Avatar Manager
              </h1>
              <p className="text-gray-400">Manage your Ready Player Me avatars</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleImportAvatar}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Upload size={18} />
                <span>Import</span>
              </button>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                <Plus size={20} />
                <span className="font-semibold">Create New Avatar</span>
              </button>
            </div>
          </div>

          {/* Current Avatar Display */}
          {currentAvatar && (
            <div className="bg-gradient-to-br from-gray-800/50 to-purple-900/20 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-xl bg-gray-900 border-2 border-purple-500/30 overflow-hidden flex-shrink-0">
                  <img
                    src={getAvatarThumbnailUrl(currentAvatar.id)}
                    alt={currentAvatar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23374151" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" font-size="48" text-anchor="middle" dy=".3em" fill="%239333ea"%3E👤%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-white">{currentAvatar.name}</h3>
                        {currentAvatar.isFavorite && (
                          <Star size={20} className="text-indigo-400 fill-indigo-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        Created: {new Date(currentAvatar.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-xs font-mono">ID: {currentAvatar.id}</p>
                    </div>
                    <button
                      onClick={() => handlePreviewAvatar(currentAvatar)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
                    >
                      <Camera size={18} />
                      <span>3D Preview</span>
                    </button>
                  </div>
                  {currentAvatar.tags && currentAvatar.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {currentAvatar.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Avatars</p>
                <p className="text-3xl font-bold text-white">{avatars.length}</p>
              </div>
              <User size={32} className="text-purple-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Favorites</p>
                <p className="text-3xl font-bold text-white">
                  {avatars.filter(a => a.isFavorite).length}
                </p>
              </div>
              <Star size={32} className="text-indigo-400" />
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Avatar</p>
                <p className="text-lg font-bold text-white truncate">
                  {currentAvatar?.name || 'None'}
                </p>
              </div>
              <Sparkles size={32} className="text-purple-400" />
            </div>
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Avatars</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {avatars.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center mx-auto mb-6">
                <User size={48} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Avatars Yet</h3>
              <p className="text-gray-400 mb-6">Create your first avatar to get started!</p>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mx-auto"
              >
                <Plus size={20} />
                <span>Create Avatar</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`group relative bg-gray-900/50 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    currentAvatar?.id === avatar.id
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 hover:border-purple-500/50'
                  }`}
                >
                  {/* Avatar Image */}
                  <div className="aspect-square bg-gray-800 relative overflow-hidden">
                    <img
                      src={getAvatarThumbnailUrl(avatar.id)}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="64" text-anchor="middle" dy=".3em" fill="%239333ea"%3E👤%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    
                    {/* Active Badge */}
                    {currentAvatar?.id === avatar.id && (
                      <div className="absolute top-2 right-2 px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Check size={12} />
                        Active
                      </div>
                    )}

                    {/* Favorite Badge */}
                    {avatar.isFavorite && (
                      <div className="absolute top-2 left-2">
                        <Star size={20} className="text-indigo-400 fill-indigo-400" />
                      </div>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleSelectAvatar(avatar)}
                        className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                        title="Set as active"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handlePreviewAvatar(avatar)}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
                        title="3D Preview"
                      >
                        <Camera size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleFavorite(avatar)}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
                        title="Toggle favorite"
                      >
                        <Star size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Avatar Info */}
                  <div className="p-4">
                    {editingAvatar === avatar.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(avatar)}
                          className="p-1 text-green-400 hover:text-green-300"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white truncate flex-1">{avatar.name}</h3>
                        <button
                          onClick={() => handleStartEdit(avatar)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(avatar.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExportAvatar(avatar)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors"
                      >
                        <Download size={14} />
                        Export
                      </button>
                      <button
                        onClick={() => handleDeleteAvatar(avatar)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Avatar Creator Modal */}
      {showCreator && (
        <AvatarCreator
          onClose={() => setShowCreator(false)}
          onAvatarCreated={handleAvatarCreated}
        />
      )}

      {/* 3D Preview Modal */}
      {showPreview && selectedAvatar && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col border border-purple-500/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h3 className="text-2xl font-bold text-purple-400">{selectedAvatar.name}</h3>
                <p className="text-sm text-gray-400">3D Avatar Preview</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 relative">
              <Avatar3D
                avatarUrl={getAvatarUrl(selectedAvatar.id)}
                quality="high"
                enableRotation={true}
                enableZoom={true}
                mood="neutral"
                showControls={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarProfileManager;
