import { useState, useEffect } from 'react'
import { Shirt, Camera, Save, User, Palette } from 'lucide-react'

// Clothing Library Data
const CLOTHING_LIBRARY = {
  tops: [
    { id: 't1', name: 'White T-Shirt', color: '#7f1d1d', type: 'casual' },
    { id: 't2', name: 'Black Blouse', color: '#000000', type: 'formal' },
    { id: 't3', name: 'Pink Sweater', color: '#7f1d1d', type: 'casual' },
    { id: 't4', name: 'Blue Button-Up', color: '#4169E1', type: 'formal' },
  ],
  bottoms: [
    { id: 'b1', name: 'Blue Jeans', color: '#1E3A8A', type: 'casual' },
    { id: 'b2', name: 'Black Pants', color: '#000000', type: 'formal' },
    { id: 'b3', name: 'Khaki Skirt', color: '#C3B091', type: 'casual' },
    { id: 'b4', name: 'Gray Trousers', color: '#6B7280', type: 'formal' },
  ],
  shoes: [
    { id: 's1', name: 'White Sneakers', color: '#7f1d1d', type: 'casual' },
    { id: 's2', name: 'Black Heels', color: '#000000', type: 'formal' },
    { id: 's3', name: 'Brown Boots', color: '#8B4513', type: 'casual' },
  ],
}

interface Outfit {
  top?: any
  bottom?: any
  shoes?: any
  name?: string
}

export default function AIStylist() {
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>({})
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([])
  const [outfitName, setOutfitName] = useState('')

  // Initialize: Load clothing library and saved outfits
  useEffect(() => {
    loadClothingLibrary()
  }, [])

  function loadClothingLibrary() {
    const saved = localStorage.getItem('savedOutfits')
    if (saved) {
      setSavedOutfits(JSON.parse(saved))
    }
  }

  // Update avatar appearance when user selects outfit
  function onUserSelectOutfit(outfit: Outfit) {
    setCurrentOutfit(outfit)
  }

  // Save to user profile
  function saveToUserProfile() {
    if (!currentOutfit.top && !currentOutfit.bottom && !currentOutfit.shoes) {
      alert('Please select at least one clothing item!')
      return
    }
    
    const newOutfit = {
      ...currentOutfit,
      name: outfitName || `Outfit ${savedOutfits.length + 1}`,
      savedAt: new Date().toISOString()
    }
    
    const updated = [...savedOutfits, newOutfit]
    setSavedOutfits(updated)
    localStorage.setItem('savedOutfits', JSON.stringify(updated))
    setOutfitName('')
    alert('✅ Outfit saved!')
  }

  function updateAvatarAppearance(item: any, type: string) {
    setCurrentOutfit(prev => ({
      ...prev,
      [type]: item
    }))
  }

  function deleteOutfit(index: number) {
    const updated = savedOutfits.filter((_, i) => i !== index)
    setSavedOutfits(updated)
    localStorage.setItem('savedOutfits', JSON.stringify(updated))
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">👗 AI Personal Stylist</h2>
        <p className="text-purple-100">Your virtual wardrobe and style companion</p>
      </div>

      {/* Avatar Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          Your Avatar
        </h3>
        <div className="flex justify-center mb-4">
          <div className="relative w-64 h-96 bg-gradient-to-b from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-lg border-4 border-purple-300 dark:border-purple-700">
            {/* Avatar Character Model */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Head */}
              <div className="w-20 h-20 bg-indigo-200 rounded-full mb-2" />
              
              {/* Top */}
              <div 
                className="w-32 h-32 rounded-lg mb-2 flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: currentOutfit.top?.color || '#E5E7EB' }}
              >
                {currentOutfit.top?.name || 'Select Top'}
              </div>
              
              {/* Bottom */}
              <div 
                className="w-28 h-32 rounded-lg mb-2 flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: currentOutfit.bottom?.color || '#E5E7EB' }}
              >
                {currentOutfit.bottom?.name || 'Select Bottom'}
              </div>
              
              {/* Shoes */}
              <div className="flex gap-2">
                <div 
                  className="w-12 h-8 rounded-lg flex items-center justify-center text-xs"
                  style={{ backgroundColor: currentOutfit.shoes?.color || '#E5E7EB' }}
                />
                <div 
                  className="w-12 h-8 rounded-lg flex items-center justify-center text-xs"
                  style={{ backgroundColor: currentOutfit.shoes?.color || '#E5E7EB' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Outfit Section */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name this outfit..."
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
          <button 
            onClick={saveToUserProfile}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Current Outfit
          </button>
        </div>
      </div>

      {/* Clothing Library - Tops */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Shirt className="w-5 h-5" />
          Tops
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {CLOTHING_LIBRARY.tops.map((item) => (
            <button
              key={item.id}
              onClick={() => updateAvatarAppearance(item, 'top')}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentOutfit.top?.id === item.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              <div 
                className="w-full h-20 rounded mb-2"
                style={{ backgroundColor: item.color }}
              />
              <p className="font-medium text-sm text-gray-800 dark:text-white">{item.name}</p>
              <p className="text-xs text-gray-500">{item.type}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Clothing Library - Bottoms */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Bottoms
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {CLOTHING_LIBRARY.bottoms.map((item) => (
            <button
              key={item.id}
              onClick={() => updateAvatarAppearance(item, 'bottom')}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentOutfit.bottom?.id === item.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              <div 
                className="w-full h-20 rounded mb-2"
                style={{ backgroundColor: item.color }}
              />
              <p className="font-medium text-sm text-gray-800 dark:text-white">{item.name}</p>
              <p className="text-xs text-gray-500">{item.type}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Clothing Library - Shoes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Shoes
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {CLOTHING_LIBRARY.shoes.map((item) => (
            <button
              key={item.id}
              onClick={() => updateAvatarAppearance(item, 'shoes')}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentOutfit.shoes?.id === item.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              <div 
                className="w-full h-16 rounded mb-2"
                style={{ backgroundColor: item.color }}
              />
              <p className="font-medium text-sm text-gray-800 dark:text-white">{item.name}</p>
              <p className="text-xs text-gray-500">{item.type}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Outfits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Save className="w-5 h-5" />
          Saved Outfits ({savedOutfits.length})
        </h3>
        {savedOutfits.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No saved outfits yet. Create and save your first outfit above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedOutfits.map((outfit, index) => (
              <div key={index} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3">{outfit.name}</h4>
                <div className="space-y-2 mb-3">
                  {outfit.top && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: outfit.top.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{outfit.top.name}</span>
                    </div>
                  )}
                  {outfit.bottom && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: outfit.bottom.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{outfit.bottom.name}</span>
                    </div>
                  )}
                  {outfit.shoes && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: outfit.shoes.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{outfit.shoes.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUserSelectOutfit(outfit)}
                    className="flex-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-2 rounded text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    Wear This
                  </button>
                  <button
                    onClick={() => deleteOutfit(index)}
                    className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-2 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
