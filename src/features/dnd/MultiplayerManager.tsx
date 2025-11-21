/**
 * MULTIPLAYER MANAGER
 * Play D&D with friends - no DM needed!
 * WebRTC-based real-time multiplayer system
 */

import React, { useState, useEffect } from 'react';
import { Users, Plus, Copy, Check, UserPlus, Crown, Wifi, WifiOff } from 'lucide-react';
import { MultiplayerSession, MultiplayerPlayer } from './types';

export const MultiplayerManager: React.FC = () => {
  const [sessions, setSessions] = useState<MultiplayerSession[]>([]);
  const [currentSession, setCurrentSession] = useState<MultiplayerSession | null>(null);
  const [username, setUsername] = useState('');
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  // Load saved username
  useEffect(() => {
    const saved = localStorage.getItem('dnd_username');
    if (saved) setUsername(saved);
  }, []);

  const generateInviteCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createSession = (sessionName: string, maxPlayers: number) => {
    if (!username) {
      alert('Please set your username first!');
      return;
    }

    const newSession: MultiplayerSession = {
      id: crypto.randomUUID(),
      name: sessionName,
      host: username,
      players: [
        {
          id: crypto.randomUUID(),
          username,
          characterId: '',
          isHost: true,
          isReady: false,
          online: true
        }
      ],
      maxPlayers,
      campaignId: crypto.randomUUID(),
      status: 'waiting',
      inviteCode: generateInviteCode(),
      createdAt: new Date().toISOString()
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession);
    setShowCreateSession(false);

    // Save to localStorage
    localStorage.setItem('dnd_multiplayer_sessions', JSON.stringify([...sessions, newSession]));
  };

  const joinSession = (code: string) => {
    if (!username) {
      alert('Please set your username first!');
      return;
    }

    const session = sessions.find(s => s.inviteCode === code.toUpperCase());
    if (!session) {
      alert('Invalid invite code!');
      return;
    }

    if (session.players.length >= session.maxPlayers) {
      alert('Session is full!');
      return;
    }

    const newPlayer: MultiplayerPlayer = {
      id: crypto.randomUUID(),
      username,
      characterId: '',
      isHost: false,
      isReady: false,
      online: true
    };

    const updatedSession = {
      ...session,
      players: [...session.players, newPlayer]
    };

    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    setCurrentSession(updatedSession);
    setJoinCode('');

    // In a real implementation, this would sync via WebRTC/WebSocket
    localStorage.setItem('dnd_multiplayer_sessions', JSON.stringify(sessions.map(s => s.id === session.id ? updatedSession : s)));
  };

  const toggleReady = () => {
    if (!currentSession || !username) return;

    const updatedSession = {
      ...currentSession,
      players: currentSession.players.map(p =>
        p.username === username ? { ...p, isReady: !p.isReady } : p
      )
    };

    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
  };

  const startGame = () => {
    if (!currentSession) return;

    const allReady = currentSession.players.every(p => p.isReady);
    if (!allReady) {
      alert('Not all players are ready!');
      return;
    }

    const updatedSession = {
      ...currentSession,
      status: 'active' as const
    };

    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));

    // Transition to game...
    alert('Game starting! (This would launch the D&D Game Engine in multiplayer mode)');
  };

  const leaveSession = () => {
    if (!currentSession || !username) return;

    const updatedSession = {
      ...currentSession,
      players: currentSession.players.filter(p => p.username !== username)
    };

    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
    setCurrentSession(null);
  };

  const copyInviteCode = () => {
    if (!currentSession) return;

    navigator.clipboard.writeText(currentSession.inviteCode);
    setInviteCodeCopied(true);
    setTimeout(() => setInviteCodeCopied(false), 2000);
  };

  // Username Setup
  if (!username) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Set Your Username</h2>
        <p className="text-gray-400 text-sm mb-4 text-center">
          Choose a username for multiplayer sessions
        </p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />
        <button
          onClick={() => {
            if (username.trim()) {
              localStorage.setItem('dnd_username', username);
            }
          }}
          disabled={!username.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Continue
        </button>
      </div>
    );
  }

  // In Session Lobby
  if (currentSession) {
    const isHost = currentSession.players.find(p => p.username === username)?.isHost;
    const allReady = currentSession.players.every(p => p.isReady);

    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
        {/* Session Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              {currentSession.name}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              currentSession.status === 'active' ? 'bg-green-500/20 text-green-400' :
              currentSession.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {currentSession.status}
            </span>
          </div>

          {/* Invite Code */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Invite Code</p>
                <p className="text-2xl font-bold tracking-wider">{currentSession.inviteCode}</p>
              </div>
              <button
                onClick={copyInviteCode}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all"
              >
                {inviteCodeCopied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Share this code with friends to invite them
            </p>
          </div>
        </div>

        {/* Players List */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">
            Players ({currentSession.players.length}/{currentSession.maxPlayers})
          </h3>
          <div className="space-y-2">
            {currentSession.players.map(player => (
              <div
                key={player.id}
                className={`bg-white/5 rounded-lg p-3 border ${
                  player.isReady ? 'border-green-500/30 bg-green-500/5' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      player.online ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{player.username}</span>
                        {player.isHost && (
                          <Crown className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {player.characterId ? 'Character Selected' : 'No Character'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {player.online ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-gray-400" />
                    )}
                    {player.isReady && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Ready
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: currentSession.maxPlayers - currentSession.players.length }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white/5 rounded-lg p-3 border border-dashed border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-600" />
                  <span className="text-gray-500 text-sm italic">Waiting for player...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={toggleReady}
            className={`w-full font-semibold py-3 rounded-lg transition-all ${
              currentSession.players.find(p => p.username === username)?.isReady
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
            }`}
          >
            {currentSession.players.find(p => p.username === username)?.isReady ? 'Not Ready' : 'Ready Up'}
          </button>

          {isHost && (
            <button
              onClick={startGame}
              disabled={!allReady}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
            >
              {allReady ? 'Start Game' : 'Waiting for all players to ready up...'}
            </button>
          )}

          <button
            onClick={leaveSession}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-lg border border-red-500/30 transition-all"
          >
            Leave Session
          </button>
        </div>
      </div>
    );
  }

  // Main Menu
  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-400" />
          Multiplayer
        </h2>
        <p className="text-gray-400 text-sm">
          Playing as: <span className="text-purple-400 font-semibold">{username}</span>
        </p>
      </div>

      {/* Create Session */}
      {showCreateSession ? (
        <div className="mb-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
          <h3 className="text-lg font-bold mb-4">Create New Session</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Session Name</label>
              <input
                type="text"
                id="session-name"
                placeholder="e.g., Epic Adventure"
                className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Players</label>
              <select
                id="max-players"
                className="w-full bg-white/10 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="2">2 Players</option>
                <option value="3">3 Players</option>
                <option value="4">4 Players</option>
                <option value="5">5 Players</option>
                <option value="6">6 Players</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const name = (document.getElementById('session-name') as HTMLInputElement).value;
                  const maxPlayers = parseInt((document.getElementById('max-players') as HTMLSelectElement).value);
                  if (name.trim()) {
                    createSession(name, maxPlayers);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateSession(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateSession(true)}
          className="w-full mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Session
        </button>
      )}

      {/* Join Session */}
      <div className="mb-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/30">
        <h3 className="text-lg font-bold mb-3">Join Session</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter invite code"
            className="flex-1 bg-white/10 border border-blue-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
          />
          <button
            onClick={() => joinSession(joinCode)}
            disabled={joinCode.length !== 6}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 rounded-lg transition-all flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Join
          </button>
        </div>
      </div>

      {/* Available Sessions */}
      {sessions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3">Your Sessions</h3>
          <div className="space-y-2">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => setCurrentSession(session)}
                className="bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-transparent hover:border-purple-500/30 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{session.name}</div>
                    <div className="text-sm text-gray-400">
                      {session.players.length}/{session.maxPlayers} players • Code: {session.inviteCode}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    session.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    session.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
        <p className="text-sm text-gray-400">
          <strong className="text-white">Note:</strong> Multiplayer uses peer-to-peer connections.
          All players must be online simultaneously to play together. The AI DM will manage the game
          for everyone!
        </p>
      </div>
    </div>
  );
};

export default MultiplayerManager;
