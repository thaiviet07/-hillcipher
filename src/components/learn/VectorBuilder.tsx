/**
 * VectorBuilder — Premium character-to-number mapping visualization
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath } from 'react-katex';
import { useCipherStore } from '../../store/cipherStore';

function letterToNum(ch: string): number {
  return ch.charCodeAt(0) - 65;
}

export const VectorBuilder: React.FC = () => {
  const { matrixSize } = useCipherStore();
  const [input, setInput] = useState(matrixSize === 2 ? 'HE' : 'ACT');

  const clean = input.toUpperCase().replace(/[^A-Z]/g, '').slice(0, matrixSize);
  const nums = clean.split('').map(letterToNum);
  const paddedNums = Array.from({ length: matrixSize }, (_, i) => nums[i] !== undefined ? nums[i] : '?');

  const handleRandom = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rand = Array.from({ length: matrixSize }, () => letters[Math.floor(Math.random() * 26)]).join('');
    setInput(rand);
  };

  const vecLatex = `\\mathbf{v} = \\begin{bmatrix} ${paddedNums.map((v) => v === '?' ? '\\text{?}' : v).join(' \\\\ ')} \\end{bmatrix}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Text Segment Input
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  value={input}
                  maxLength={matrixSize}
                  onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, matrixSize))}
                  style={{
                    width: '100%', height: 72, textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800,
                    background: '#FFFFFF', border: '3px solid var(--google-blue)',
                    borderRadius: '16px', color: 'var(--google-blue)', outline: 'none',
                    boxShadow: '0 4px 12px rgba(66,133,244,0.1)'
                  }}
                />
                <div style={{ position: 'absolute', top: -10, left: 20, background: '#FFFFFF', padding: '0 8px', fontSize: '0.7rem', fontWeight: 900, color: 'var(--google-blue)' }}>CHARS</div>
              </div>
              <button 
                onClick={handleRandom}
                style={{ width: 72, height: 72, borderRadius: '16px', border: '1px solid #DADCE0', background: '#FFFFFF', cursor: 'pointer', fontSize: '1.5rem', transition: 'all 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F8F9FA')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                title="Randomize characters"
              >
                🎲
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mapping: Letter → Position
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {Array.from({ length: matrixSize }, (_, i) => {
                const char = clean[i] || '';
                const num = char ? letterToNum(char) : '?';
                return (
                  <motion.div 
                    key={i}
                    layout
                    style={{ flex: 1, textAlign: 'center', background: char ? '#E8F0FE' : '#F8F9FA', borderRadius: '16px', padding: '1.5rem', border: `2px solid ${char ? 'var(--google-blue)' : '#DADCE0'}`, boxShadow: char ? '0 4px 12px rgba(66,133,244,0.1)' : 'none' }}
                  >
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: char ? 'var(--google-blue)' : '#BDC1C6', marginBottom: '8px' }}>
                      {char || '—'}
                    </div>
                    <div style={{ height: '2px', background: '#DADCE0', margin: '12px auto', width: '20px' }} />
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={num}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ fontSize: '2rem', fontWeight: 900, color: char ? 'var(--google-red)' : '#BDC1C6' }}
                      >
                        {num}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ background: '#F8F9FA', borderRadius: '24px', padding: '3rem', border: '1px solid #DADCE0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem' }}>
            Column Vector Construction
          </div>
          <div style={{ transform: 'scale(2)', transition: 'all 0.3s' }}>
            <BlockMath math={vecLatex} />
          </div>
        </div>

      </div>

      <div style={{ padding: '1.5rem', background: '#E8F0FE', borderRadius: '16px', borderLeft: '8px solid var(--google-blue)', color: '#1967D2', fontSize: '1.05rem', lineHeight: 1.6 }}>
        <strong>Visual Insight:</strong> In Hill Cipher, text is not just a sequence of characters; it's a series of points in an $n$-dimensional space. By mapping letters to numbers, we can apply geometric transformations like rotation and shearing through matrix multiplication.
      </div>
    </div>
  );
};
