import { useState } from 'react'
import { TrendingUp, Users, Lightbulb, Heart } from 'lucide-react'

export default function AdaptiveSupportHub() {
  const [offendLevel, setOffendLevel] = useState(5)
  const [interactions, setInteractions] = useState<Array<{level: number, note: string, time: Date}>>([])

  const logInteraction = (level: number, note: string) => {
    setInteractions([{ level, note, time: new Date() }, ...interactions.slice(0, 9)])
  }

  const quickButtons = [
    { level: 1, label: '😊 Great', color: 'bg-green-500' },
    { level: 3, label: '😐 Okay', color: 'bg-blue-500' },
    { level: 5, label: '😕 Meh', color: 'bg-indigo-500' },
    { level: 7, label: '😠 Bad', color: 'bg-orange-500' },
    { level: 10, label: '🤬 Worst', color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">🧠 Adaptive Support Hub</h2>
        <p className="text-purple-100">Your personal growth companion that learns with you</p>
      </div>

      {/* Offend-O-Meter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Offend-O-Meter
        </h3>
        
        {/* Circular Gauge */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke={offendLevel <= 3 ? '#10b981' : offendLevel <= 7 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={502.4}
                strokeDashoffset={502.4 - (502.4 * offendLevel) / 10}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">{offendLevel}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ 10</span>
            </div>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {quickButtons.map((btn) => (
            <button
              key={btn.level}
              onClick={() => {
                setOffendLevel(btn.level)
                logInteraction(btn.level, btn.label)
              }}
              className={`${btn.color} text-white py-3 px-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Manual Input */}
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min="1"
            max="10"
            value={offendLevel}
            onChange={(e) => setOffendLevel(parseInt(e.target.value))}
            className="flex-1"
          />
          <button
            onClick={() => logInteraction(offendLevel, `Level ${offendLevel}`)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Log
          </button>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recent Interactions</h3>
        {interactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No interactions logged yet</p>
        ) : (
          <div className="space-y-2">
            {interactions.map((int, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl">{int.level <= 3 ? '😊' : int.level <= 7 ? '😕' : '😠'}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">{int.note}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{int.time.toLocaleTimeString()}</p>
                </div>
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{int.level}/10</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* D&D Idea Deck */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          D&D Idea Deck
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">900+ creative ideas ready to explore!</p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full">
          Draw Random Idea
        </button>
      </div>

      {/* Community Show-Up Board */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Community Show-Up Board
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <p className="font-medium text-gray-800 dark:text-white">Weekly Challenge: Share your wins!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">23 people participating</p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full">
            Join Community
          </button>
        </div>
      </div>

      {/* Growth Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Growth Journey
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{interactions.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Interactions</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">7</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Days Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
