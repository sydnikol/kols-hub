import { useState, useEffect } from 'react'
import { Home, Shirt, Plane, BookOpen, Heart, Mail, Volume2, VolumeX } from 'lucide-react'

interface Room {
  name: string
  icon: any
  color: string
  gradient: string
  ambient: string
  description: string
}

const ROOMS: Room[] = [
  {
    name: 'Lounge',
    icon: Home,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    ambient: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112e87f.mp3',
    description: 'Relax, play games, and connect with your support system'
  },
  {
    name: 'Wardrobe',
    icon: Shirt,
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    ambient: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c9c5d0c638.mp3',
    description: 'Style yourself, try on outfits, and express your aesthetic'
  },
  {
    name: 'Health',
    icon: Heart,
    color: 'red',
    gradient: 'from-red-500 to-pink-500',
    ambient: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112e87f.mp3',
    description: 'Track medications, monitor vitals, and manage your health'
  },
  {
    name: 'Communications',
    icon: Mail,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    ambient: 'https://cdn.pixabay.com/audio/2022/03/15/audio_5e8a0d4461.mp3',
    description: 'Email, contacts, and MyChart - all in one place'
  },
  {
    name: 'Travel',
    icon: Plane,
    color: 'cyan',
    gradient: 'from-cyan-500 to-teal-500',
    ambient: 'https://cdn.pixabay.com/audio/2022/03/15/audio_5e8a0d4461.mp3',
    description: 'Plan adventures, explore destinations, and dream of places'
  },
  {
    name: 'Study',
    icon: BookOpen,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    ambient: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    description: 'Focus on work, manage projects, and boost productivity'
  }
]

interface RoomNavigationProps {
  currentRoom: string
  onEnterRoom: (roomName: string) => void
}

function RoomNavigation({ currentRoom, onEnterRoom }: RoomNavigationProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // Initialize audio on component mount
  useEffect(() => {
    const currentRoomData = ROOMS.find(r => r.name === currentRoom)
    if (currentRoomData) {
      const newAudio = new Audio(currentRoomData.ambient)
      newAudio.loop = true
      newAudio.volume = 0.3
      setAudio(newAudio)

      return () => {
        newAudio.pause()
        newAudio.src = ''
      }
    }
  }, [currentRoom])

  // Play/pause based on mute state
  useEffect(() => {
    if (audio) {
      if (!isMuted) {
        audio.play().catch(err => console.log('Audio play failed:', err))
      } else {
        audio.pause()
      }
    }
  }, [isMuted, audio])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleEnterRoom = (roomName: string) => {
    onEnterRoom(roomName)
    // Audio will be handled by useEffect when currentRoom changes
  }

  return (
    <div className="space-y-6">
      {/* Audio Control */}
      <div className="flex justify-end">
        <button
          onClick={toggleMute}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Volume2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isMuted ? 'Unmute Ambient' : 'Mute Ambient'}
          </span>
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROOMS.map((room) => {
          const Icon = room.icon
          const isActive = currentRoom === room.name

          return (
            <button
              key={room.name}
              onClick={() => handleEnterRoom(room.name)}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                isActive
                  ? 'ring-4 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-900 shadow-2xl scale-105'
                  : 'hover:scale-105 hover:shadow-xl shadow-lg'
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${room.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-8 w-8" />
                  {isActive && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
                <p className="text-sm text-white/90 leading-relaxed">{room.description}</p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </button>
          )
        })}
      </div>

      {/* Current Room Indicator */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-700 dark:text-gray-300">
          Currently in:{' '}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {currentRoom}
          </span>
        </p>
      </div>
    </div>
  )
}

export default RoomNavigation
