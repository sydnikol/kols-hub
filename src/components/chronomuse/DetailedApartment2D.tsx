/**
 * DETAILED 2D APARTMENT - FULLY VISIBLE & INTERACTIVE
 * Every room, every object, every detail rendered beautifully
 */

import React, { useState } from 'react';
import { Home, Sofa, Utensils, Bed, Monitor, Bath, Sparkles, Sun, Moon, Coffee, Music, Book, Heart, Tv, ShoppingCart, Palette } from 'lucide-react';

interface RoomObject {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  color: string;
  icon?: any;
  interactive?: boolean;
  onClick?: () => void;
  details?: string;
}

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  wallColor: string;
  floorColor: string;
  objects: RoomObject[];
  mood?: string;
}

export const DetailedApartment2D: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');
  const [lighting, setLighting] = useState(100);

  // Define all rooms with exact measurements and details
  const rooms: Room[] = [
    {
      id: 'living-room',
      name: 'Living Room',
      x: 0,
      y: 0,
      width: 50,
      height: 60,
      color: '#1a1a2e',
      wallColor: '#2a2a3e',
      floorColor: '#3a2a2e',
      mood: 'cozy',
      objects: [
        {
          id: 'couch',
          name: 'Gothic Velvet Couch',
          x: 10,
          y: 20,
          width: 30,
          height: 15,
          color: '#6d28d9',
          icon: Sofa,
          interactive: true,
          details: 'Deep purple velvet couch with silver studs. Perfect for reading or resting.',
          onClick: () => alert('💜 Rest on the velvet couch?')
        },
        {
          id: 'coffee-table',
          name: 'Glass Coffee Table',
          x: 15,
          y: 40,
          width: 20,
          height: 10,
          color: '#4a5568',
          icon: Coffee,
          details: 'Sleek glass table with dark wood frame. Holds your favorite books and coffee mug.'
        },
        {
          id: 'tv',
          name: '65" Smart TV',
          x: 5,
          y: 5,
          width: 40,
          height: 8,
          color: '#1a1a1a',
          icon: Tv,
          interactive: true,
          details: 'Large smart TV for streaming shows and movies.',
          onClick: () => alert('🎬 What would you like to watch?')
        },
        {
          id: 'bookshelf',
          name: 'Floor-to-Ceiling Bookshelf',
          x: 2,
          y: 15,
          width: 6,
          height: 40,
          color: '#4a2511',
          icon: Book,
          interactive: true,
          details: 'Massive bookshelf filled with novels, art books, and journals.',
          onClick: () => alert('📚 Choose a book to read?')
        },
        {
          id: 'plant-1',
          name: 'Monstera Plant',
          x: 42,
          y: 50,
          width: 5,
          height: 8,
          color: '#2d5016',
          icon: Sparkles,
          details: 'Large monstera plant in a decorative pot.'
        },
        {
          id: 'rug',
          name: 'Persian Rug',
          x: 12,
          y: 18,
          width: 28,
          height: 35,
          color: '#4a1942',
          details: 'Vintage persian rug with intricate patterns in deep reds and purples.'
        }
      ]
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      x: 50,
      y: 0,
      width: 50,
      height: 35,
      color: '#2a2a3a',
      wallColor: '#3a3a4a',
      floorColor: '#e5e5e5',
      mood: 'functional',
      objects: [
        {
          id: 'stove',
          name: 'Gas Stove',
          x: 5,
          y: 5,
          width: 15,
          height: 10,
          color: '#1a1a1a',
          icon: Utensils,
          interactive: true,
          details: '4-burner gas stove. Ready for cooking!',
          onClick: () => alert('🍳 What would you like to cook?')
        },
        {
          id: 'fridge',
          name: 'Smart Refrigerator',
          x: 25,
          y: 5,
          width: 20,
          height: 15,
          color: '#e5e5e5',
          icon: ShoppingCart,
          interactive: true,
          details: 'Large smart fridge with touch screen. Shows grocery list and recipes.',
          onClick: () => alert('🧊 Check what\'s inside?')
        },
        {
          id: 'island',
          name: 'Kitchen Island',
          x: 10,
          y: 18,
          width: 30,
          height: 12,
          color: '#8b4513',
          icon: Coffee,
          interactive: true,
          details: 'Marble-top kitchen island with bar stools. Perfect for meal prep or working.',
          onClick: () => alert('☕ Make coffee here?')
        },
        {
          id: 'sink',
          name: 'Double Basin Sink',
          x: 48,
          y: 5,
          width: 15,
          height: 8,
          color: '#c0c0c0',
          details: 'Stainless steel double basin sink with modern faucet.'
        }
      ]
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      x: 50,
      y: 35,
      width: 50,
      height: 65,
      color: '#1a1a2e',
      wallColor: '#2a2040',
      floorColor: '#2a2a3e',
      mood: 'restful',
      objects: [
        {
          id: 'bed',
          name: 'King Size Bed',
          x: 10,
          y: 15,
          width: 35,
          height: 25,
          color: '#4a1942',
          icon: Bed,
          interactive: true,
          details: 'Luxurious king-size bed with velvet purple bedding and many pillows.',
          onClick: () => alert('😴 Time to rest?')
        },
        {
          id: 'nightstand-left',
          name: 'Left Nightstand',
          x: 5,
          y: 20,
          width: 8,
          height: 10,
          color: '#4a2511',
          icon: Moon,
          details: 'Dark wood nightstand with a lamp, book, and water glass.'
        },
        {
          id: 'nightstand-right',
          name: 'Right Nightstand',
          x: 42,
          y: 20,
          width: 8,
          height: 10,
          color: '#4a2511',
          icon: Heart,
          details: 'Matching nightstand with phone charger and essential oils.'
        },
        {
          id: 'desk',
          name: 'Work Desk',
          x: 5,
          y: 45,
          width: 40,
          height: 12,
          color: '#1a1a1a',
          icon: Monitor,
          interactive: true,
          details: 'Large L-shaped desk with dual monitors, keyboard, and RGB lighting.',
          onClick: () => alert('💻 Start working?')
        },
        {
          id: 'wardrobe',
          name: 'Walk-in Closet',
          x: 48,
          y: 45,
          width: 20,
          height: 30,
          color: '#3a2511',
          icon: Sparkles,
          interactive: true,
          details: 'Organized closet with all your clothes, shoes, and accessories.',
          onClick: () => alert('👗 Choose an outfit?')
        },
        {
          id: 'mirror',
          name: 'Full-Length Mirror',
          x: 48,
          y: 5,
          width: 12,
          height: 20,
          color: '#c0c0c0',
          details: 'Large mirror with LED lights around the frame.'
        },
        {
          id: 'art-wall',
          name: 'Gallery Wall',
          x: 2,
          y: 2,
          width: 30,
          height: 10,
          color: '#6d28d9',
          icon: Palette,
          interactive: true,
          details: 'Collection of your artwork and photos arranged beautifully.',
          onClick: () => alert('🎨 View your art collection?')
        }
      ]
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      x: 0,
      y: 60,
      width: 50,
      height: 40,
      color: '#1a2a3a',
      wallColor: '#e5f5f5',
      floorColor: '#c5d5d5',
      mood: 'spa-like',
      objects: [
        {
          id: 'bathtub',
          name: 'Soaking Tub',
          x: 10,
          y: 10,
          width: 30,
          height: 20,
          color: '#ffffff',
          icon: Bath,
          interactive: true,
          details: 'Deep soaking tub with jets. Perfect for relaxation.',
          onClick: () => alert('🛁 Run a bath?')
        },
        {
          id: 'shower',
          name: 'Rain Shower',
          x: 5,
          y: 32,
          width: 15,
          height: 15,
          color: '#e5e5e5',
          details: 'Walk-in shower with rainfall showerhead and body jets.'
        },
        {
          id: 'vanity',
          name: 'Double Vanity',
          x: 25,
          y: 32,
          width: 20,
          height: 10,
          color: '#8b4513',
          icon: Sparkles,
          details: 'Marble double vanity with plenty of storage for toiletries and skincare.'
        },
        {
          id: 'plants',
          name: 'Hanging Plants',
          x: 42,
          y: 5,
          width: 6,
          height: 8,
          color: '#2d5016',
          details: 'Collection of hanging plants creating a spa atmosphere.'
        }
      ]
    }
  ];

  // Lighting effects based on time of day
  const getLightingFilter = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'brightness(1.2) saturate(1.1) hue-rotate(-5deg)';
      case 'afternoon':
        return 'brightness(1) saturate(1)';
      case 'evening':
        return 'brightness(0.8) saturate(0.9) hue-rotate(10deg)';
      case 'night':
        return 'brightness(0.4) saturate(0.7) hue-rotate(20deg)';
      default:
        return 'brightness(1)';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-purple-900 p-4 overflow-auto">
      {/* Controls */}
      <div className="mb-4 flex gap-4 items-center flex-wrap bg-black/30 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setTimeOfDay('morning')}
            className={`p-2 rounded ${timeOfDay === 'morning' ? 'bg-yellow-500' : 'bg-gray-700'}`}
          >
            <Sun className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTimeOfDay('afternoon')}
            className={`p-2 rounded ${timeOfDay === 'afternoon' ? 'bg-orange-500' : 'bg-gray-700'}`}
          >
            <Sun className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTimeOfDay('evening')}
            className={`p-2 rounded ${timeOfDay === 'evening' ? 'bg-purple-500' : 'bg-gray-700'}`}
          >
            <Moon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`p-2 rounded ${timeOfDay === 'night' ? 'bg-indigo-900' : 'bg-gray-700'}`}
          >
            <Moon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Brightness:</span>
          <input
            type="range"
            min="20"
            max="150"
            value={lighting}
            onChange={(e) => setLighting(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-white text-sm">{lighting}%</span>
        </div>

        <div className="text-white font-bold">
          {selectedRoom ? `📍 ${rooms.find(r => r.id === selectedRoom)?.name}` : '🏠 KOL Apartment'}
        </div>
      </div>

      {/* Apartment Layout */}
      <div
        className="relative bg-gray-800 rounded-lg shadow-2xl"
        style={{
          width: '100%',
          height: '800px',
          filter: getLightingFilter(),
          opacity: lighting / 100
        }}
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            className="absolute border-2 border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer group"
            style={{
              left: `${room.x}%`,
              top: `${room.y}%`,
              width: `${room.width}%`,
              height: `${room.height}%`,
              backgroundColor: room.color,
              boxShadow: selectedRoom === room.id ? '0 0 30px rgba(168, 85, 247, 0.6)' : 'none'
            }}
            onClick={() => setSelectedRoom(room.id)}
          >
            {/* Room Name Label */}
            <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-xs font-bold backdrop-blur-sm">
              {room.name}
            </div>

            {/* Floor */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2 opacity-30"
              style={{ backgroundColor: room.floorColor }}
            />

            {/* Walls */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundColor: room.wallColor }}
            />

            {/* Objects in Room */}
            {room.objects.map((obj) => {
              const IconComponent = obj.icon;
              return (
                <div
                  key={obj.id}
                  className={`absolute flex items-center justify-center rounded shadow-lg hover:scale-105 transition-transform ${
                    obj.interactive ? 'cursor-pointer hover:ring-2 hover:ring-yellow-400' : ''
                  }`}
                  style={{
                    left: `${obj.x}%`,
                    top: `${obj.y}%`,
                    width: `${obj.width}%`,
                    height: `${obj.height}%`,
                    backgroundColor: obj.color,
                    boxShadow: selectedObject?.id === obj.id
                      ? '0 0 20px rgba(255, 215, 0, 0.8)'
                      : '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedObject(obj);
                    if (obj.onClick) obj.onClick();
                  }}
                  title={obj.name}
                >
                  {IconComponent && (
                    <IconComponent className="text-white opacity-70" size={obj.width > 15 ? 32 : 20} />
                  )}
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {obj.name}
                  </div>
                </div>
              );
            })}

            {/* Mood Indicator */}
            {room.mood && (
              <div className="absolute bottom-4 right-4 text-xs text-white/50">
                ✨ {room.mood}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Object Details Panel */}
      {selectedObject && (
        <div className="mt-4 bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-2">{selectedObject.name}</h3>
          {selectedObject.details && (
            <p className="text-purple-200 mb-4">{selectedObject.details}</p>
          )}
          <button
            onClick={() => setSelectedObject(null)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Room Info */}
      {selectedRoom && (
        <div className="mt-4 bg-black/50 p-6 rounded-lg backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-2">
            {rooms.find((r) => r.id === selectedRoom)?.name}
          </h3>
          <p className="text-purple-200 mb-4">
            {rooms.find((r) => r.id === selectedRoom)?.objects.length} objects in this room
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {rooms
              .find((r) => r.id === selectedRoom)
              ?.objects.map((obj) => (
                <button
                  key={obj.id}
                  className="bg-purple-800/50 hover:bg-purple-700/70 text-white px-3 py-2 rounded text-sm transition-colors"
                  onClick={() => setSelectedObject(obj)}
                >
                  {obj.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedApartment2D;
