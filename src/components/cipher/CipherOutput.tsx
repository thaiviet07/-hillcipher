/**
 * CipherOutput — Google-style output panel
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCipherStore } from '../../store/cipherStore';
import { BLOCK_COLORS } from '../../constants/alphabet';

export const CipherOutput: React.FC = () => {
  const { output, mode, matrixSize, hoveredBlockIndex, setHoveredBlockIndex } = useCipherStore();

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #DADCE0',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 1px 2px 0 rgba(60,64,67,.3)',
        minHeight: 140,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 500 }}>
          {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'} Result
        </h2>
        {output && (
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid #DADCE0',
              background: '#FFFFFF',
              color: 'var(--google-blue)',
            }}
          >
            Copy Text
          </button>
        )}
      </div>

      <div style={{ minHeight: '3rem' }}>
        <AnimatePresence mode="wait">
          {output ? (
            <motion.div
              key={output}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                wordBreak: 'break-all',
              }}
            >
              {output.split('').map((ch, i) => (
                <motion.span
                  key={`${i}-${ch}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  style={{
                    color: BLOCK_COLORS[Math.floor(i / matrixSize) % BLOCK_COLORS.length],
                    display: 'inline-block',
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>
              The processed message will appear here.
            </div>
          )}
        </AnimatePresence>
      </div>

      {output && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid #F1F3F4', paddingTop: '1rem' }}>
          {Array.from({ length: Math.ceil(output.length / matrixSize) }, (_, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredBlockIndex(i)}
              onMouseLeave={() => setHoveredBlockIndex(null)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                opacity: hoveredBlockIndex === null || hoveredBlockIndex === i ? 1 : 0.3,
                transition: 'opacity 0.2s'
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '2px', background: BLOCK_COLORS[i % BLOCK_COLORS.length] }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>BLOCK {i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
