import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Pen, Camera, Music } from 'lucide-react';

const Studio: React.FC = () => {
  return (
    <div className="studio-room">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <Palette size={64} color="#7f4a6f" strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '300', fontFamily: 'serif', color: '#c0c0c0', margin: '0 0 12px 0' }}>
            The Studio
          </h1>
          <p style={{ fontSize: '16px', color: '#808080', fontStyle: 'italic' }}>
            Creative engine with AI-guided tools and moodboards
          </p>
        </div>

        {/* Creative Tools */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '20px', padding: '40px', border: '1px solid #2a2a2a' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px' }}>
            Creative Tools
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              { icon: Pen, name: 'Writing & Poetry', color: '#7f4a6f' },
              { icon: Camera, name: 'Visual Arts', color: '#7f4a6f' },
              { icon: Music, name: 'Music & Audio', color: '#7f4a6f' },
              { icon: Palette, name: 'Design & Layout', color: '#7f4a6f' },
            ].map((tool) => (
              <motion.div
                key={tool.name}
                whileHover={{ scale: 1.05 }}
                style={{ background: '#0f0f0f', padding: '24px', borderRadius: '12px', border: `1px solid ${tool.color}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <tool.icon size={32} color={tool.color} />
                <span style={{ color: '#c0c0c0', fontSize: '16px' }}>{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Studio;
