import { useState } from 'react'
import { Plane, MapPin, Calendar, DollarSign, Heart, Search } from 'lucide-react'

interface Destination {
  name: string
  country: string
  description: string
  bestTime: string
  budget: string
  saved: boolean
}

const DESTINATIONS: Destination[] = [
  { name: 'Paris', country: 'France', description: 'City of lights and romance', bestTime: 'Apr-Oct', budget: '$$$', saved: false },
  { name: 'Tokyo', country: 'Japan', description: 'Modern meets traditional', bestTime: 'Mar-May', budget: '$$$', saved: false },
  { name: 'Bali', country: 'Indonesia', description: 'Tropical paradise', bestTime: 'Apr-Oct', budget: '$$', saved: false },
  { name: 'Iceland', country: 'Iceland', description: 'Land of fire and ice', bestTime: 'Jun-Aug', budget: '$$$$', saved: false },
  { name: 'Barcelona', country: 'Spain', description: 'Art, architecture, beaches', bestTime: 'May-Sep', budget: '$$', saved: false },
  { name: 'New Zealand', country: 'New Zealand', description: 'Adventure capital', bestTime: 'Dec-Feb', budget: '$$$', saved: false },
]

export default function Travel() {
  const [destinations, setDestinations] = useState(DESTINATIONS)
  const [searchQuery, setSearchQuery] = useState('')

  function toggleSaved(index: number) {
    const updated = [...destinations]
    updated[index].saved = !updated[index].saved
    setDestinations(updated)
  }

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const savedDestinations = destinations.filter(d => d.saved)

  return (
    <div className="space-y-6 pb-20">
      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Saved Destinations */}
      {savedDestinations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-500 fill-purple-500" />
            Saved Destinations ({savedDestinations.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {savedDestinations.map((dest, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-800 dark:text-white border border-purple-300 dark:border-purple-700">
                {dest.name}, {dest.country}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDestinations.map((dest, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-400 to-blue-400 h-32 flex items-center justify-center">
              <Plane className="w-12 h-12 text-white" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white">{dest.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {dest.country}
                  </p>
                </div>
                <button
                  onClick={() => toggleSaved(index)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${dest.saved ? 'fill-purple-500 text-purple-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{dest.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {dest.bestTime}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {dest.budget}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
