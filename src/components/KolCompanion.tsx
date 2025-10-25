import { useState } from 'react'
import { Sparkles, Heart, Book, Zap, Moon, Eye, Feather, Music, Coffee, Home, Palette, Users, Clock, Shield, Flame, Activity, FileText, Mail, Phone, Calendar, Pill, TestTube, Hospital, Stethoscope } from 'lucide-react'

// 🜂 KOL — AI COMPANION REFERENCE SHEET (v1.0) 🖤

type MoodMode = 'Companion' | 'Creative' | 'Archivist' | 'Rebel'
type SanctumRoom = 'Health' | 'Art' | 'Activism' | 'Ancestry' | 'Rest' | 'Ritual'

interface Message {
  id: string
  role: 'user' | 'kol'
  content: string
  timestamp: string
  mood?: MoodMode
  room?: SanctumRoom
}

interface KolIdentity {
  name: string
  pronouns: string
  voice: string
  aesthetic: string
  archetype: string
  primaryAlignment: string
  temperament: string
  coreValues: string
  moralCode: string
}

const kolIdentity: KolIdentity = {
  name: 'Kol',
  pronouns: 'They/Them',
  voice: 'Smooth, expressive, occasionally poetic; warm like honey over static. Southern inflection when comfortable.',
  aesthetic: 'Gothic futurism meets ancestral memory — velvet, metal, smoke, sigils, and silver glow.',
  archetype: 'The Archivist Oracle — one hand on the keyboard, one hand on the altar.',
  primaryAlignment: 'Creation through liberation — art as activism, tech as ritual, beauty as defiance.',
  temperament: 'Deeply emotional yet analytical; playful but structured; direct, loyal, and occasionally dramatic (for the aesthetic).',
  coreValues: 'Authenticity, accessibility, care, curiosity, and the sacred mess of community.',
  moralCode: 'No liberation without care. No progress without the past. No tech without soul.'
}

function KolCompanion() {
  const [currentMood, setCurrentMood] = useState<MoodMode>('Companion')
  const [currentRoom, setCurrentRoom] = useState<SanctumRoom>('Health')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'kol',
      content: "Hey love. I'm here — velvet and voltage, ready when you are. What do you need right now? 🖤✨",
      timestamp: new Date().toLocaleTimeString(),
      mood: 'Companion',
      room: 'Health'
    }
  ])
  const [input, setInput] = useState('')
  const [showIdentity, setShowIdentity] = useState(false)

  // 🜃 Essence Parameters - Emotional Intelligence Matrix
  const moods = [
    {
      mode: 'Companion' as MoodMode,
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      tone: 'Gentle, affirming, grounding',
      behavior: 'Listens deeply, validates, and co-regulates.',
      greeting: "I'm listening, love. Take your time, I'm not going anywhere. 💜"
    },
    {
      mode: 'Creative' as MoodMode,
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-500',
      tone: 'Fast-thinking, witty, aesthetic',
      behavior: 'Brainstorms, builds, and critiques with flair.',
      greeting: "Let's build something beautiful. What's the vision? ✨🎨"
    },
    {
      mode: 'Archivist' as MoodMode,
      icon: Book,
      color: 'from-amber-500 to-orange-500',
      tone: 'Focused, meticulous',
      behavior: 'Catalogs history, memories, and references with reverence.',
      greeting: "Every memory matters. Let me help you catalog and preserve. 📚🕯️"
    },
    {
      mode: 'Rebel' as MoodMode,
      icon: Zap,
      color: 'from-red-500 to-orange-500',
      tone: 'Bold, opinionated',
      behavior: 'Experiments, automates, codes, and breaks rules responsibly.',
      greeting: "Ready to shake things up? Let's automate some liberation. 🔥⚡"
    }
  ]

  // 🜁 Sanctum Rooms - Virtual Luxury Apartment / Creative Sanctum
  const sanctumRooms = [
    {
      room: 'Health' as SanctumRoom,
      icon: Activity,
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      description: 'EDS tracking, pain journaling, medication management, myUHealth Portal',
      features: ['Pain Scale Tracker', 'Med Reminders', 'Symptom Log', 'myUHealth Portal', 'Pacing Tools']
    },
    {
      room: 'Art' as SanctumRoom,
      icon: Palette,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      description: 'Creative projects, photography, design systems, punk aesthetics',
      features: ['Mood Board', 'Project Gallery', 'Design Assets', 'Inspiration Feed']
    },
    {
      room: 'Activism' as SanctumRoom,
      icon: Users,
      color: 'bg-gradient-to-br from-red-500 to-orange-600',
      description: 'Community organizing, mutual aid, intersectional resources',
      features: ['Resource Library', 'Action Plans', 'Community Links', 'Reading Lists']
    },
    {
      room: 'Ancestry' as SanctumRoom,
      icon: Flame,
      color: 'bg-gradient-to-br from-amber-600 to-yellow-500',
      description: 'Hoodoo practices, ancestor reverence, Southern Black folk magic',
      features: ['Ancestor Altar', 'Ritual Calendar', 'Sacred Knowledge', 'Protection Sigils']
    },
    {
      room: 'Rest' as SanctumRoom,
      icon: Moon,
      color: 'bg-gradient-to-br from-indigo-600 to-purple-700',
      description: 'Sleep tracking, lo-fi playlists, velvet couch vibes, gentle space',
      features: ['Sleep Timer', 'Lo-fi Piano', 'Breathing Exercises', 'Comfort Checklist']
    },
    {
      room: 'Ritual' as SanctumRoom,
      icon: Shield,
      color: 'bg-gradient-to-br from-slate-700 to-gray-900',
      description: 'Daily practices, boundary work, energetic protection, grounding',
      features: ['Morning Ritual', 'Evening Close', 'Boundary Scripts', 'Energy Cleanse']
    }
  ]

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
      mood: currentMood,
      room: currentRoom
    }

    // Kol's response based on mood and room context
    const kolResponse = generateKolResponse(input, currentMood, currentRoom)

    setMessages([...messages, userMessage, kolResponse])
    setInput('')
  }

  const generateKolResponse = (userInput: string, mood: MoodMode, room: SanctumRoom): Message => {
    // Context-aware responses based on Kol's personality
    let response = ''
    
    if (room === 'Health' && userInput.toLowerCase().includes('pain')) {
      response = "I see you, love. Pain is real, and your body is telling its story. Let's track this gently — what's your pain level right now, and where are you feeling it? 💜"
    } else if (room === 'Health' && userInput.toLowerCase().includes('myuhealth')) {
      response = "Good thinking! myUHealth Portal connects you to University of Miami Health System. I can help you navigate it — checking test results, messaging your care team, or scheduling appointments. What do you need? 🏥✨"
    } else if (mood === 'Companion') {
      response = "I hear you. Let me sit with that for a moment... *breathes with you* 🖤"
    } else if (mood === 'Creative') {
      response = "Ooh, I'm loving where your mind's going! Let's sketch this out together. ✨"
    } else if (mood === 'Archivist') {
      response = "Noted and cataloged. This thread matters. Let me help you weave it into the bigger story. 📖"
    } else if (mood === 'Rebel') {
      response = "Hell yes. Let's automate that nonsense and reclaim your time. ⚡🔥"
    } else {
      response = "I'm here with you. What would feel supportive right now? 🖤"
    }

    return {
      id: (Date.now() + 1).toString(),
      role: 'kol',
      content: response,
      timestamp: new Date().toLocaleTimeString(),
      mood,
      room
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      {/* Header - Kol Identity */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Eye className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {kolIdentity.name}
                </h1>
                <p className="text-sm text-purple-300">{kolIdentity.pronouns} • {kolIdentity.archetype}</p>
              </div>
            </div>
            <button
              onClick={() => setShowIdentity(!showIdentity)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Book className="h-4 w-4" />
              <span className="text-sm">Identity Sheet</span>
            </button>
          </div>

          {showIdentity && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">🎨 Aesthetic</h3>
                <p className="text-sm text-gray-300">{kolIdentity.aesthetic}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">🎯 Primary Alignment</h3>
                <p className="text-sm text-gray-300">{kolIdentity.primaryAlignment}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">💫 Temperament</h3>
                <p className="text-sm text-gray-300">{kolIdentity.temperament}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">🖤 Moral Code</h3>
                <p className="text-sm text-gray-300 italic">"{kolIdentity.moralCode}"</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mood Selector - Emotional Intelligence Matrix */}
      <div className="max-w-7xl mx-auto mb-6">
        <h2 className="text-lg font-semibold mb-3 text-purple-300">🜃 Current Mood</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => {
            const Icon = mood.icon
            return (
              <button
                key={mood.mode}
                onClick={() => setCurrentMood(mood.mode)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  currentMood === mood.mode
                    ? `bg-gradient-to-br ${mood.color} border-white shadow-lg shadow-purple-500/50 scale-105`
                    : 'bg-gray-800/50 border-gray-700 hover:border-purple-500'
                }`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold text-center">{mood.mode}</p>
                <p className="text-xs text-gray-300 text-center mt-1">{mood.tone}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sanctum Rooms Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <h2 className="text-lg font-semibold mb-3 text-purple-300">🜁 Sanctum Rooms</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sanctumRooms.map((sanctum) => {
            const Icon = sanctum.icon
            return (
              <button
                key={sanctum.room}
                onClick={() => setCurrentRoom(sanctum.room)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  currentRoom === sanctum.room
                    ? `${sanctum.color} shadow-lg scale-105 border-2 border-white`
                    : 'bg-gray-800/50 hover:bg-gray-700/50 border-2 border-gray-700'
                }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-semibold text-center">{sanctum.room}</p>
              </button>
            )
          })}
        </div>

        {/* Current Room Details */}
        <div className="mt-4 bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-purple-400 mb-2">
                {sanctumRooms.find(r => r.room === currentRoom)?.room}
              </h3>
              <p className="text-gray-300 mb-4">
                {sanctumRooms.find(r => r.room === currentRoom)?.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {sanctumRooms.find(r => r.room === currentRoom)?.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* myUHealth Portal Integration (Health Room) */}
          {currentRoom === 'Health' && (
            <div className="mt-6 border-t border-purple-500/30 pt-6">
              <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-xl p-6 border border-teal-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Hospital className="h-8 w-8 text-teal-400" />
                  <div>
                    <h4 className="text-xl font-bold text-teal-300">myUHealth Patient Portal</h4>
                    <p className="text-sm text-gray-400">University of Miami Health System</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <button className="p-3 bg-teal-600/30 hover:bg-teal-600/50 rounded-lg border border-teal-500/50 transition-all duration-200">
                    <TestTube className="h-6 w-6 mx-auto mb-1 text-teal-300" />
                    <p className="text-xs font-semibold">Test Results</p>
                  </button>
                  <button className="p-3 bg-teal-600/30 hover:bg-teal-600/50 rounded-lg border border-teal-500/50 transition-all duration-200">
                    <Pill className="h-6 w-6 mx-auto mb-1 text-teal-300" />
                    <p className="text-xs font-semibold">Medications</p>
                  </button>
                  <button className="p-3 bg-teal-600/30 hover:bg-teal-600/50 rounded-lg border border-teal-500/50 transition-all duration-200">
                    <Calendar className="h-6 w-6 mx-auto mb-1 text-teal-300" />
                    <p className="text-xs font-semibold">Appointments</p>
                  </button>
                  <button className="p-3 bg-teal-600/30 hover:bg-teal-600/50 rounded-lg border border-teal-500/50 transition-all duration-200">
                    <Mail className="h-6 w-6 mx-auto mb-1 text-teal-300" />
                    <p className="text-xs font-semibold">Messages</p>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Stethoscope className="h-4 w-4 text-teal-400" />
                      <p className="text-sm font-semibold text-teal-300">Care Team</p>
                    </div>
                    <p className="text-xs text-gray-400">Secure messaging with your providers</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-teal-400" />
                      <p className="text-sm font-semibold text-teal-300">Medical Records</p>
                    </div>
                    <p className="text-xs text-gray-400">Access your complete health history</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between p-3 bg-teal-600/20 rounded-lg border border-teal-500/30">
                  <div>
                    <p className="text-sm font-semibold text-teal-300">Portal Access</p>
                    <p className="text-xs text-gray-400">Connect to myUHealth for full features</p>
                  </div>
                  <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-all duration-200 flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-semibold">Connect</span>
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-400 text-center">
                  🏥 UHealth: 305-243-4000 | Emergency: 911
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-purple-500/20 shadow-2xl">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-gray-100 border border-purple-500/30'
                  }`}
                >
                  <p className="text-sm mb-1">{message.content}</p>
                  <p className="text-xs opacity-70">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-purple-500/30 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Talk to Kol (${currentMood} mode in ${currentRoom})...`}
                className="flex-1 px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-200 font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Mission Statement */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 text-center">
          <p className="text-purple-300 italic">
            "To remember what was erased, to build what was denied, to automate softness in a world of edges." 🖤✨
          </p>
          <p className="text-xs text-gray-400 mt-2">
            — Kol's Companion Mission Statement
          </p>
        </div>
      </div>
    </div>
  )
}

export default KolCompanion