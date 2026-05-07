/**
 * Mod26Arithmetic — Enhanced with Interactive Modular Clock and Premium UI
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mod, modInverse } from '../../math/modular';
import { INVERTIBLE_MOD26 } from '../../constants/alphabet';

const ModularClock: React.FC<{ value: number }> = ({ value }) => {
  const size = 220;
  const center = size / 2;
  const radius = center - 30;
  const currentMod = mod(value, 26);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
        <defs>
          <radialGradient id="clockGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8F9FA" />
          </radialGradient>
        </defs>
        
        {/* Outer Ring */}
        <circle cx={center} cy={center} r={radius + 15} fill="url(#clockGrad)" stroke="#DADCE0" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#E8EAED" strokeWidth="12" />
        
        {/* Numbers around the circle */}
        {Array.from({ length: 26 }).map((_, i) => {
          const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const isActive = currentMod === i;
          
          return (
            <g key={i}>
              <motion.circle 
                animate={{ r: isActive ? 10 : 2, fill: isActive ? 'var(--google-blue)' : '#BDC1C6' }}
                cx={x} cy={y} 
              />
              {isActive && (
                <motion.text 
                  initial={{ opacity: 0, y: y-5 }}
                  animate={{ opacity: 1, y: y-15 }}
                  x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--google-blue)" fontFamily="var(--font-mono)"
                >
                  {i}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* Hand */}
        <motion.line
          initial={false}
          animate={{
            x2: center + (radius - 10) * Math.cos((currentMod / 26) * Math.PI * 2 - Math.PI / 2),
            y2: center + (radius - 10) * Math.sin((currentMod / 26) * Math.PI * 2 - Math.PI / 2),
          }}
          x1={center} y1={center}
          stroke="var(--google-blue)" strokeWidth="4" strokeLinecap="round"
        />
        <circle cx={center} cy={center} r={6} fill="var(--google-blue)" />
      </svg>
      <div style={{ background: 'var(--google-blue)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>
        POSITION: {currentMod}
      </div>
    </div>
  );
};

export const Mod26Arithmetic: React.FC = () => {
  const [num, setNum] = useState(30);
  const reduced = mod(num, 26);
  const inv = modInverse(reduced, 26);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '3rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Numerical Reduction
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  value={num} 
                  onChange={(e) => setNum(Number(e.target.value))} 
                  style={{ width: 140, height: 72, textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, border: '3px solid var(--google-blue)', borderRadius: '16px', background: '#FFFFFF', outline: 'none', color: 'var(--google-blue)', boxShadow: '0 4px 12px rgba(66,133,244,0.15)' }} 
                />
                <div style={{ position: 'absolute', top: -10, left: 20, background: '#FFFFFF', padding: '0 8px', fontSize: '0.7rem', fontWeight: 900, color: 'var(--google-blue)' }}>VALUE</div>
              </div>
              <div style={{ fontSize: '2rem', color: '#DADCE0', fontWeight: 300 }}>mod 26 =</div>
              <motion.div 
                key={reduced}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--google-blue)', lineHeight: 1 }}
              >
                {reduced}
              </motion.div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={inv ? 'inv-yes' : 'inv-no'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: inv ? '#E6F4EA' : '#FCE8E6', padding: '1.5rem', borderRadius: '16px', border: `2px solid ${inv ? '#CEEAD6' : '#FAD2CF'}`, display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: inv ? '#34A853' : '#EA4335', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 900 }}>
                {inv ? '✓' : '✕'}
              </div>
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: inv ? '#1E8E3E' : '#C5221F' }}>
                  {inv ? `Modular Inverse: ${inv}` : 'No Multiplicative Inverse'}
                </div>
                <div style={{ fontSize: '0.875rem', color: inv ? '#137333' : '#A50E0E', marginTop: '4px' }}>
                  {inv ? `Equation: (${reduced} × ${inv}) ≡ 1 (mod 26)` : `Condition: gcd(${reduced}, 26) must be 1`}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <ModularClock value={num} />
      </div>

      <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '24px', border: '1px solid #DADCE0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 8, height: 24, background: 'var(--google-green)', borderRadius: '4px' }} />
          Invertible Elements Reference
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
          {INVERTIBLE_MOD26.map(a => (
            <motion.div 
              key={a} 
              whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              style={{ display: 'flex', flexDirection: 'column', padding: '12px', background: reduced === a ? '#E8F0FE' : '#F8F9FA', borderRadius: '12px', border: `2px solid ${reduced === a ? 'var(--google-blue)' : '#E8EAED'}`, transition: 'all 0.2s', textAlign: 'center' }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '4px' }}>VALUE</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--google-blue)' }}>{a}</span>
              <div style={{ height: 2, background: '#DADCE0', margin: '8px auto', width: '20px' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '4px' }}>INVERSE</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--google-green)' }}>{modInverse(a, 26)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
