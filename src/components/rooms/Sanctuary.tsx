import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Droplets, Moon } from 'lucide-react';

const Sanctuary: React.FC = () => {
  return (
    <div className="sanctuary-room">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <Heart size={64} color="#7f6f4a" strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '300', fontFamily: 'serif', color: '#c0c0c0', margin: '0 0 12px 0' }}>
            The Sanctuary
          </h1>
          <p style={{ fontSize: '16px', color: '#808080', fontStyle: 'italic' }}>
            Your emotional safe space for rest and grounding
          </p>
        </div>

        {/* Grounding Tools */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '20px', padding: '40px', border: '1px solid #2a2a2a' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px' }}>
            Grounding Tools
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              { icon: Wind, name: 'Breath Matching', description: 'Sync with gentle rhythms' },
              { icon: Droplets, name: 'Sensory Reset', description: 'Calm overstimulation' },
              { icon: Moon, name: 'Rest Mode', description: 'Lower lights & sounds' },
              { icon: Heart, name: 'Journal Space', description: 'Process emotions safely' },
            ].map((tool) => (
              <motion.div
                key={tool.name}
                whileHover={{ scale: 1.05 }}
                style={{ background: '#0f0f0f', padding: '24px', borderRadius: '12px', border: '1px solid #7f6f4a', cursor: 'pointer' }}
              >
                <tool.icon size={28} color="#7f6f4a" style={{ marginBottom: '12px' }} />
                <h3 style={{ color: '#c0c0c0', fontSize: '16px', marginBottom: '6px' }}>{tool.name}</h3>
                <p style={{ color: '#808080', fontSize: '13px', margin: 0 }}>{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sanctuary;
