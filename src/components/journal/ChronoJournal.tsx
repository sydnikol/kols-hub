import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Book, Clock, Tag } from 'lucide-react';

const ChronoJournal: React.FC = () => {
  const [entries] = useState([
    { id: 1, date: 'Nov 14, 2025', room: 'Observatory', mood: 'curious', screenshot: true },
    { id: 2, date: 'Nov 13, 2025', room: 'Sanctuary', mood: 'calm', screenshot: false },
    { id: 3, date: 'Nov 12, 2025', room: 'Library', mood: 'focused', screenshot: true },
  ]);

  return (
    <div className="chrono-journal">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <Book size={64} color="#7f6f4a" strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '300', fontFamily: 'serif', color: '#c0c0c0', margin: '0 0 12px 0' }}>
            ChronoJournal
          </h1>
          <p style={{ fontSize: '16px', color: '#808080', fontStyle: 'italic' }}>
            Your auto-logged timeline of every moment
          </p>
        </div>

        {/* Journal Entries */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '16px', padding: '30px', border: '1px solid #2a2a2a' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={24} color="#7f6f4a" />
            Recent Entries
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                whileHover={{ scale: 1.02 }}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {entry.screenshot && <Camera size={20} color="#7f6f4a" />}
                  <div>
                    <p style={{ color: '#c0c0c0', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                      {entry.room} Session
                    </p>
                    <p style={{ color: '#808080', fontSize: '13px', margin: 0 }}>
                      {entry.date} • Mood: {entry.mood}
                    </p>
                  </div>
                </div>
                <Tag size={16} color="#808080" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChronoJournal;
