import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Palette, Heart, Eye, Home, Activity, Camera, User, Bed,
  Coffee, Sofa, Utensils, Sparkles, Bath, Music, Tv, DoorOpen, Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LuxuryApartmentEnhancedProps {
  currentRoom: string;
  onRoomChange: (room: string) => void;
  children: React.ReactNode;
  userPhotos?: string[];
  onPhotoUpload?: (photo: string) => void;
}

/**
 * 🏰 LUXURY APARTMENT - ENHANCED VERSION
 * Complete living space with:
 * - Observatory (Time Portal)
 * - Library (Learning Space)
 * - Studio (Creative Workshop)
 * - Sanctuary (Safe Space)
 * - Bedroom (Rest & Dreams)
 * - Kitchen (Cooking & Nutrition)
 * - Living Room (Social & Entertainment)
 * - Bathroom (Self-Care)
 *
 * + AI Twin Photo Upload System
 */
const LuxuryApartmentEnhanced: React.FC<LuxuryApartmentEnhancedProps> = ({
  currentRoom,
  onRoomChange,
  children,
  userPhotos = [],
  onPhotoUpload
}) => {
  const navigate = useNavigate();
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(userPhotos);

  const rooms = [
    {
      id: 'observatory',
      name: 'Observatory',
      icon: Eye,
      description: 'Time Portal & Era Explorer',
      color: '#4a5f7f',
      furniture: ['Telescope', 'Star Maps', 'Time Portal', 'Observatory Dome'],
      mood: 'Mystical & Futuristic'
    },
    {
      id: 'library',
      name: 'Library',
      icon: BookOpen,
      description: 'Learning & Research Space',
      color: '#5f7f4a',
      furniture: ['Mahogany Bookshelves', 'Leather Armchair', 'Reading Lamp', 'Fireplace'],
      mood: 'Scholarly & Warm'
    },
    {
      id: 'studio',
      name: 'Studio',
      icon: Palette,
      description: 'Creative Engine & Tools',
      color: '#7f4a6f',
      furniture: ['Easel', 'Digital Tablet', 'Music Station', 'Workbench'],
      mood: 'Artistic & Innovative'
    },
    {
      id: 'sanctuary',
      name: 'Sanctuary',
      icon: Heart,
      description: 'Emotional Safe Space',
      color: '#7f6f4a',
      furniture: ['Meditation Cushion', 'Aromatherapy Diffuser', 'Weighted Blanket', 'Crystal Collection'],
      mood: 'Peaceful & Healing'
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      icon: Bed,
      description: 'Rest & Dreams Chamber',
      color: '#6f4a7f',
      furniture: ['King Bed', 'Silk Sheets', 'Blackout Curtains', 'Smart Alarm', 'Dream Journal'],
      mood: 'Cozy & Restorative'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: Utensils,
      description: 'Culinary Laboratory',
      color: '#4a7f6f',
      furniture: ['Chef\'s Island', 'Smart Fridge', 'Espresso Machine', 'Herb Garden', 'Recipe Display'],
      mood: 'Gourmet & Organized'
    },
    {
      id: 'living-room',
      name: 'Living Room',
      icon: Sofa,
      description: 'Social & Entertainment Hub',
      color: '#7f5f4a',
      furniture: ['Velvet Sofa', '85" OLED TV', 'Gaming Setup', 'Sound System', 'Mini Bar'],
      mood: 'Luxurious & Social'
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      icon: Bath,
      description: 'Spa & Self-Care Sanctuary',
      color: '#4a6f7f',
      furniture: ['Rainfall Shower', 'Jacuzzi Tub', 'Smart Mirror', 'Heated Floors', 'Aromatherapy'],
      mood: 'Spa-Like & Refreshing'
    },
  ];

  const utilities = [
    { id: 'health', name: 'Health', icon: Activity, path: '/health' },
    { id: 'journal', name: 'Journal', icon: Camera, path: '/journaling' },
    { id: 'avatar', name: 'Avatar', icon: User, path: '/avatar/mobile' },
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const photoUrl = reader.result as string;
      setUploadedPhotos(prev => [...prev, photoUrl]);
      localStorage.setItem('ai_twin_photos', JSON.stringify([...uploadedPhotos, photoUrl]));

      if (onPhotoUpload) {
        onPhotoUpload(photoUrl);
      }

      toast.success('Photo uploaded! AI twin will use this to look like you!', {
        icon: '📸',
        duration: 4000
      });
      setShowPhotoUpload(false);
    };
    reader.readAsDataURL(file);
  };

  const currentRoomData = rooms.find(r => r.id === currentRoom);

  return (
    <div className="luxury-apartment-layout" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 30%, #0a1a1f 70%, #0a0a0a 100%)',
      color: '#c0c0c0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'rgba(10, 10, 10, 0.98)',
          backdropFilter: 'blur(15px)',
          borderBottom: '2px solid rgba(124, 58, 237, 0.3)',
          boxShadow: '0 4px 30px rgba(124, 58, 237, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          zIndex: 999,
        }}
      >
        {/* Logo & Current Room */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Home size={32} color="#7c3aed" strokeWidth={1.5} />
          </motion.div>

          <div>
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              fontFamily: 'serif',
              background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              KOL Luxury Apartment
            </h1>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: currentRoomData?.color || '#808080',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <DoorOpen size={14} />
              Currently in: {currentRoomData?.name || 'Lobby'}
            </p>
          </div>
        </div>

        {/* AI Twin Photo Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', marginRight: '12px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#808080' }}>AI Twin Photos</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#7c3aed', fontWeight: '600' }}>
              {uploadedPhotos.length} uploaded
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => photoInputRef.current?.click()}
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)'
            }}
          >
            <Camera size={18} />
            Upload My Photo
          </motion.button>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Utility Quick Access */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {utilities.map((util) => {
            const Icon = util.icon;
            return (
              <motion.button
                key={util.id}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(util.path)}
                style={{
                  background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon size={22} color="#808080" strokeWidth={1.5} />
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Room Selector Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        style={{
          position: 'fixed',
          left: 0,
          top: '80px',
          bottom: 0,
          width: '320px',
          background: 'rgba(15, 15, 15, 0.98)',
          backdropFilter: 'blur(15px)',
          borderRight: '2px solid rgba(124, 58, 237, 0.3)',
          padding: '30px 20px',
          overflowY: 'auto',
          zIndex: 998,
        }}
      >
        <h3 style={{
          color: '#7c3aed',
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '25px',
          fontWeight: '700',
        }}>
          Apartment Rooms
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {rooms.map((room) => {
            const Icon = room.icon;
            const isActive = currentRoom === room.id;

            return (
              <motion.button
                key={room.id}
                onClick={() => {
                  onRoomChange(room.id);
                  navigate(`/${room.id}`);
                }}
                whileHover={{ scale: 1.03, x: 8 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${room.color}44 0%, ${room.color}22 100%)`
                    : 'transparent',
                  border: `2px solid ${isActive ? room.color : '#2a2a2a'}`,
                  borderRadius: '14px',
                  padding: '18px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeRoom"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '5px',
                      height: '100%',
                      background: room.color,
                      boxShadow: `0 0 20px ${room.color}`,
                    }}
                  />
                )}

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Icon
                    size={28}
                    color={isActive ? room.color : '#808080'}
                    strokeWidth={1.5}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '700',
                      color: isActive ? '#c0c0c0' : '#808080',
                      marginBottom: '5px',
                    }}>
                      {room.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: '#606060',
                      lineHeight: '1.5',
                      marginBottom: '8px',
                    }}>
                      {room.description}
                    </p>

                    {/* Room Details */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                          borderTop: '1px solid #2a2a2a',
                          paddingTop: '8px',
                          marginTop: '8px',
                        }}
                      >
                        <p style={{ fontSize: '10px', color: room.color, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {room.mood}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {room.furniture.map((item, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '9px',
                                background: `${room.color}22`,
                                color: '#a0a0a0',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: `1px solid ${room.color}44`,
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Enhanced Stats */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 100%)',
          borderRadius: '14px',
          border: '2px solid #7c3aed44',
        }}>
          <p style={{
            color: '#7c3aed',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '16px',
            fontWeight: '700',
          }}>
            Today's Vitals
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#808080' }}>Energy</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '60px',
                  height: '6px',
                  background: '#1a1a1a',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '60%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #7c3aed 0%, #3b82f6 100%)',
                  }} />
                </div>
                <span style={{ fontSize: '13px', color: '#7c3aed', fontWeight: '600' }}>6/10</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#808080' }}>Medications</span>
              <span style={{ fontSize: '13px', color: '#5f7f4a', fontWeight: '600' }}>18/22</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#808080' }}>Hydration</span>
              <span style={{ fontSize: '13px', color: '#4a6f7f', fontWeight: '600' }}>1200ml</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#808080' }}>Sleep</span>
              <span style={{ fontSize: '13px', color: '#6f4a7f', fontWeight: '600' }}>7.5hrs</span>
            </div>
          </div>
        </div>

        {/* AI Twin Photos Preview */}
        {uploadedPhotos.length > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'linear-gradient(135deg, #1a0a1f 0%, #0a1a1f 100%)',
            borderRadius: '12px',
            border: '2px solid #3b82f644',
          }}>
            <p style={{
              color: '#3b82f6',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
              fontWeight: '600',
            }}>
              Your AI Twin Photos
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {uploadedPhotos.slice(0, 6).map((photo, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    background: `url(${photo}) center/cover`,
                    border: '2px solid #3b82f6',
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
                  }}
                />
              ))}
            </div>
            {uploadedPhotos.length > 6 && (
              <p style={{ marginTop: '8px', fontSize: '10px', color: '#808080', textAlign: 'center' }}>
                +{uploadedPhotos.length - 6} more photos
              </p>
            )}
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <main style={{
        marginLeft: '320px',
        marginTop: '80px',
        padding: '50px',
        minHeight: 'calc(100vh - 80px)',
      }}>
        {children}
      </main>
    </div>
  );
};

export default LuxuryApartmentEnhanced;
