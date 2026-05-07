/**
 * InvertibilityViz — Enhanced interactive invertibility condition lesson
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { gcd, mod } from '../../math/modular';

export const InvertibilityViz: React.FC = () => {
  const [detInput, setDetInput] = useState(15);
  const detMod = mod(detInput, 26);
  const g = gcd(detMod, 26);
  const valid = g === 1;

  const slots = Array.from({ length: 26 }, (_, i) => ({ val: i, inv: gcd(i, 26) === 1 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Educational Hero */}
      <div style={{ background: '#E8F0FE', padding: '2rem', borderRadius: '24px', border: '1px solid #DADCE0', textAlign: 'center', boxShadow: '0 4px 20px rgba(66,133,244,0.05)' }}>
        <p style={{ color: '#1967D2', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          For a matrix to be <strong>decryptable</strong>, it must have a modular inverse.
        </p>
        <div style={{ transform: 'scale(1.2)' }}>
          <BlockMath math={String.raw`\gcd(\det(K) \pmod{26},\; 26) = 1`} />
        </div>
        <p style={{ color: '#5F6368', fontSize: '0.875rem', marginTop: '1.5rem' }}>
          This means the determinant must not share any factors with 26 (other than 1).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Interactive Tester */}
        <section style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '24px', border: '2px solid #000000', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            Interactive Determinant Tester
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={detInput} 
                  onChange={(e) => setDetInput(Number(e.target.value))} 
                  style={{ width: 100, height: 60, textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, border: '3px solid #DADCE0', borderRadius: '12px', outline: 'none', transition: 'border-color 0.2s' }} 
                  onFocus={(e) => e.target.style.borderColor = 'var(--google-blue)'}
                  onBlur={(e) => e.target.style.borderColor = '#DADCE0'}
                />
                <div style={{ position: 'absolute', top: -8, left: 12, background: '#FFFFFF', padding: '0 4px', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)' }}>DET(K)</div>
              </div>
              <div style={{ fontSize: '2rem', color: '#DADCE0', fontWeight: 300 }}>→</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <motion.div 
                  key={detMod}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--google-blue)' }}
                >
                  {detMod} <span style={{ fontSize: '1rem', color: '#BDC1C6', fontWeight: 400 }}>mod 26</span>
                </motion.div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={valid ? 'v' : 'i'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  padding: '1.5rem', borderRadius: '16px', 
                  background: valid ? '#E6F4EA' : '#FCE8E6',
                  border: `2px solid ${valid ? '#34A853' : '#EA4335'}`,
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: valid ? '#1E8E3E' : '#C5221F', marginBottom: '4px' }}>
                  {valid ? 'INVERTIBLE' : 'SINGULAR'}
                </div>
                <div style={{ fontSize: '0.875rem', color: valid ? '#137333' : '#A50E0E' }}>
                  <InlineMath math={`\\gcd(${detMod}, 26) = ${g}`} />
                  {valid ? ' (Success!)' : ' (Invalid Key)'}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Remainder Table */}
        <section style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '24px', border: '1px solid #DADCE0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            Valid Determinant Remainders
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: '6px' }}>
            {slots.map(({ val, inv }) => (
              <motion.div 
                key={val} 
                whileHover={{ scale: 1.1, zIndex: 1 }}
                onClick={() => setDetInput(val)} 
                style={{ 
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '0.75rem', fontWeight: 800, borderRadius: '8px', 
                  background: detMod === val ? 'var(--google-blue)' : (inv ? '#E6F4EA' : '#F1F3F4'), 
                  color: detMod === val ? '#FFFFFF' : (inv ? '#1E8E3E' : '#9AA0A6'), 
                  border: `2px solid ${detMod === val ? 'var(--google-blue)' : (inv ? '#CEEAD6' : 'transparent')}`, 
                  cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                {val}
              </motion.div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#5F6368', fontStyle: 'italic' }}>
            Click a number above to test it as a determinant.
          </p>
        </section>

      </div>
    </div>
  );
};
