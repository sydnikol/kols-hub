import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Palette, Heart, Telescope, Home, Activity, Camera, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LuxuryApartmentProps {
  currentRoom: string;
  onRoomChange: (room: 'library' | 'studio' | 'sanctuary' | 'observatory') => void;
  children: React.ReactNode;
}

const LuxuryApartment: React.FC<LuxuryApartmentProps> = ({ currentRoom, onRoomChange, children }) => {
  const navigate = useNavigate();

  const rooms = [
    { 
      id: 'observatory', 
      name: 'Observatory', 
      icon: Telescope, 
      description: 'Time Portal & Era Explorer',
      color: '#4a5f7f',
    },
    { 
      id: 'library', 
      name: 'Library', 
      icon: BookOpen, 
      description: 'Learning & Research Space',
      color: '#5f7f4a',
    },
    { 
      id: 'studio', 
      name: 'Studio', 
      icon: Palette, 
      description: 'Creative Engine & Tools',
      color: '#7f4a6f',
    },
    { 
      id: 'sanctuary', 
      name: 'Sanctuary', 
      icon: Heart, 
      description: 'Emotional Safe Space',
      color: '#7f6f4a',
    },
  ];

  const utilities = [
    { id: 'health', name: 'Health', icon: Activity, path: '/health/medications' },
    { id: 'journal', name: 'Journal', icon: Camera, path: '/journal' },
    { id: 'avatar', name: 'Avatar', icon: User, path: '/avatar' },
  ];

  return (
    <div className="luxury-apartment-layout" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
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
          height: '70px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          zIndex: 999,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Home size={28} color="#4a5f7f" strokeWidth={1.5} />
          </motion.div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '600',
              fontFamily: 'serif',
              color: '#c0c0c0',
            }}>
              KOL ChronoMuse
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '11px', 
              color: '#808080',
              fontStyle: 'italic',
            }}>
              Your Self-Evolving Personal OS
            </p>
          </div>
        </div>

        {/* Utility Quick Access */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {utilities.map((util) => {
            const Icon = util.icon;
            return (
              <motion.button
                key={util.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(util.path)}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid #2a2a2a',
                  borderRadius: '8px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon size={20} color="#808080" strokeWidth={1.5} />
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
          top: '70px',
          bottom: 0,
          width: '280px',
          background: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid #2a2a2a',
          padding: '30px 20px',
          overflowY: 'auto',
          zIndex: 998,
        }}
      >
        <h3 style={{
          color: '#808080',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '20px',
          fontWeight: '600',
        }}>
          Apartment Rooms
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rooms.map((room) => {
            const Icon = room.icon;
            const isActive = currentRoom === room.id;

            return (
              <motion.button
                key={room.id}
                onClick={() => {
                  onRoomChange(room.id as any);
                  navigate(`/${room.id}`);
                }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${room.color}33 0%, ${room.color}11 100%)`
                    : 'transparent',
                  border: `1px solid ${isActive ? room.color : '#2a2a2a'}`,
                  borderRadius: '12px',
                  padding: '16px',
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
                      width: '4px',
                      height: '100%',
                      background: room.color,
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Icon 
                    size={24} 
                    color={isActive ? room.color : '#808080'} 
                    strokeWidth={1.5}
                  />
                  <div>
                    <p style={{
                      margin: 0,
                      fontSize: '15px',
                      fontWeight: '600',
                      color: isActive ? '#c0c0c0' : '#808080',
                      marginBottom: '4px',
                    }}>
                      {room.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: '#606060',
                      lineHeight: '1.4',
                    }}>
                      {room.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div style={{
          marginTop: '30px',
          padding: '16px',
          background: '#0a0a0a',
          borderRadius: '12px',
          border: '1px solid #2a2a2a',
        }}>
          <p style={{
            color: '#808080',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Today's Stats
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#606060' }}>Energy</span>
              <span style={{ fontSize: '12px', color: '#4a5f7f' }}>6/10 spoons</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#606060' }}>Meds</span>
              <span style={{ fontSize: '12px', color: '#5f7f4a' }}>18/22 taken</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#606060' }}>Hydration</span>
              <span style={{ fontSize: '12px', color: '#7f4a6f' }}>1200ml</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{
        marginLeft: '280px',
        marginTop: '70px',
        padding: '40px',
        minHeight: 'calc(100vh - 70px)',
      }}>
        {children}
      </main>
    </div>
  );
};

export default LuxuryApartment;
