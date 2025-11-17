import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Bookmark, Clock } from 'lucide-react';

const Library: React.FC = () => {
  return (
    <div className="library-room">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <BookOpen size={64} color="#5f7f4a" strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '300', fontFamily: 'serif', color: '#c0c0c0', margin: '0 0 12px 0' }}>
            The Library
          </h1>
          <p style={{ fontSize: '16px', color: '#808080', fontStyle: 'italic' }}>
            Dim velvet reading room with floating shelves of knowledge
          </p>
        </div>

        {/* Floating Bookshelves */}
        <div style={{ background: 'rgba(10, 10, 10, 0.8)', borderRadius: '20px', padding: '40px', border: '1px solid #2a2a2a' }}>
          <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px' }}>
            Browse Collections
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {['History & Culture', 'Philosophy & Theory', 'Activism & Liberation', 'Science & Nature'].map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                style={{ background: '#0f0f0f', padding: '20px', borderRadius: '12px', border: '1px solid #5f7f4a', cursor: 'pointer' }}
              >
                <h3 style={{ color: '#5f7f4a', fontSize: '16px', marginBottom: '8px' }}>{category}</h3>
                <p style={{ color: '#808080', fontSize: '13px' }}>Explore {category.toLowerCase()}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Library;
