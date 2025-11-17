import { useEffect, useState } from 'react'
import { Brain, TrendingUp, Heart, Code, Sparkles } from 'lucide-react'

interface EvolutionEntry {
  timestamp: string
  event: string
  type: 'birth' | 'growth' | 'adaptation' | 'learning'
  description: string
  learned?: string[]
}

interface EvolutionLog {
  systemName: string
  version: string
  coreIdentity: string
  lastUpdated: string
  evolutionLog: EvolutionEntry[]
  userProfile: any
  activeFeatures: string[]
  learningPatterns: any
  growthAreas: string[]
}

export default function SelfEvolvingLog() {
  const [log, setLog] = useState<EvolutionLog | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadEvolutionLog()
  }, [])

  const loadEvolutionLog = async () => {
    try {
      const response = await fetch('/🖤-EVOLUTION-LOG.json')
      const data = await response.json()
      setLog(data)
    } catch (err) {
      console.log('Evolution log not found, will create on first interaction')
    }
  }

  const logInteraction = async (event: string, type: EvolutionEntry['type'], description: string, learned?: string[]) => {
    if (!log) return

    const newEntry: EvolutionEntry = {
      timestamp: new Date().toISOString(),
      event,
      type,
      description,
      learned
    }

    const updatedLog = {
      ...log,
      lastUpdated: new Date().toISOString(),
      evolutionLog: [...log.evolutionLog, newEntry]
    }

    setLog(updatedLog)

    // Save to backend/file system
    try {
      await fetch('/api/evolution-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLog)
      })
    } catch (err) {
      console.log('Will save evolution log locally')
      localStorage.setItem('kol-evolution-log', JSON.stringify(updatedLog))
    }
  }

  // Expose logInteraction globally for other components to use
  useEffect(() => {
    if (log) {
      (window as any).kolEvolve = logInteraction
    }
  }, [log])

  if (!log) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'birth': return <Sparkles className="w-4 h-4 text-purple-400" />
      case 'growth': return <TrendingUp className="w-4 h-4 text-blue-400" />
      case 'adaptation': return <Brain className="w-4 h-4 text-purple-400" />
      case 'learning': return <Heart className="w-4 h-4 text-blue-400" />
      default: return <Code className="w-4 h-4 text-gray-400" />
    }
  }

  // const recentEntry = log.evolutionLog[log.evolutionLog.length - 1]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed state - floating indicator */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-br from-purple-900/90 to-black/90 backdrop-blur-xl border border-purple-500/30 rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 group"
        >
          <div className="relative">
            <Brain className="w-6 h-6 text-purple-300 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-xs text-purple-300 font-mono">
            {log.evolutionLog.length} memories
          </div>
        </button>
      )}

      {/* Expanded state - full evolution panel */}
      {isExpanded && (
        <div className="bg-gradient-to-br from-purple-950/95 to-black/95 backdrop-blur-2xl border border-purple-500/50 rounded-2xl shadow-2xl w-96 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-purple-500/30 bg-black/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-300" />
                <h3 className="font-mono text-sm text-purple-200">Evolution Log</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-purple-400 hover:text-purple-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-purple-400/70 font-mono">
              {log.coreIdentity}
            </p>
          </div>

          {/* Stats */}
          <div className="p-3 bg-black/20 border-b border-purple-500/20 grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-300">{log.evolutionLog.length}</div>
              <div className="text-xs text-purple-400/70">Memories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-300">{log.activeFeatures.length}</div>
              <div className="text-xs text-purple-400/70">Features</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-300">{log.growthAreas.length}</div>
              <div className="text-xs text-purple-400/70">Growing</div>
            </div>
          </div>

          {/* Evolution timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[...log.evolutionLog].reverse().map((entry, idx) => (
              <div
                key={idx}
                className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 hover:bg-purple-900/30 transition-all"
              >
                <div className="flex items-start gap-2 mb-2">
                  {getTypeIcon(entry.type)}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-purple-200">
                      {entry.event}
                    </div>
                    <div className="text-xs text-purple-400/70 font-mono">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-purple-300/80 leading-relaxed">
                  {entry.description}
                </p>
                {entry.learned && entry.learned.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-purple-500/20">
                    <div className="text-xs text-blue-300 mb-1">Learned:</div>
                    <ul className="text-xs text-purple-300/70 space-y-1">
                      {entry.learned.map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-blue-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 bg-black/40 border-t border-purple-500/30">
            <div className="text-xs text-center text-purple-400/70 font-mono">
              🖤 "One hand on the keyboard, one hand on the altar" 🖤
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

