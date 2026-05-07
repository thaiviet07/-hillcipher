/**
 * LinearTransformation — Interactive linearity proof module
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { mod } from '../../math/modular';
import { useCipherStore } from '../../store/cipherStore';

function multiply(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row => mod(row.reduce((sum, k, i) => sum + k * vector[i], 0), 26));
}

export const LinearTransformation: React.FC = () => {
  const { matrix } = useCipherStore();
  
  // State for interactivity
  const [u] = useState([1, 2]);
  const [v] = useState([3, 4]);
  const [alpha, setAlpha] = useState(2);
  const [beta, setBeta] = useState(1);

  const Ku = multiply(matrix, u);
  const Kv = multiply(matrix, v);
  
  const linearComboUV = u.map((val, i) => mod(alpha * val + beta * v[i], 26));
  const K_linearCombo = multiply(matrix, linearComboUV);
  const alphaKu_betaKv = Ku.map((val, i) => mod(alpha * val + beta * Kv[i], 26));

  const isEqual = K_linearCombo.every((val, i) => val === alphaKu_betaKv[i]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <div style={{ background: '#F8F9FA', padding: '2rem', borderRadius: '24px', border: '1px solid #DADCE0' }}>
        <p style={{ color: '#202124', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
          The Principle of Superposition: Why Hill Cipher is Mathematically "Transparent"
        </p>
        <div style={{ transform: 'scale(1.1)', display: 'flex', justifyContent: 'center' }}>
          <BlockMath math={String.raw`K(\alpha\mathbf{u} + \beta\mathbf{v}) \equiv \alpha K\mathbf{u} + \beta K\mathbf{v} \pmod{26}`} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Scalar & Vector Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '16px', border: '2px solid #000000', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Scalars & Vectors</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 800, width: 20 }}>α</span>
                <input type="range" min="1" max="10" value={alpha} onChange={e => setAlpha(parseInt(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontWeight: 800, color: 'var(--google-blue)' }}>{alpha}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 800, width: 20 }}>β</span>
                <input type="range" min="1" max="10" value={beta} onChange={e => setBeta(parseInt(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontWeight: 800, color: 'var(--google-red)' }}>{beta}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: '#E8F0FE', borderRadius: '16px', border: '1px solid var(--google-blue)', color: '#1967D2', fontSize: '0.9rem', lineHeight: 1.5 }}>
            <strong>The weakness:</strong> Because this property holds, if an attacker knows a few $(P, C)$ pairs, they can use linear algebra (KPA) to solve for $K$ without brute-forcing.
          </div>
        </div>

        {/* Calculation Trace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <motion.div layout style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '20px', border: '1px solid #DADCE0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--google-blue)', marginBottom: '1rem' }}>LHS: K(αu + βv)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                <InlineMath math={`\\begin{bmatrix}${K_linearCombo[0]}\\\\${K_linearCombo[1]}\\end{bmatrix}`} />
              </div>
            </motion.div>
            
            <motion.div layout style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '20px', border: '1px solid #DADCE0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--google-green)', marginBottom: '1rem' }}>RHS: αKu + βKv</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                <InlineMath math={`\\begin{bmatrix}${alphaKu_betaKv[0]}\\\\${alphaKu_betaKv[1]}\\end{bmatrix}`} />
              </div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={isEqual ? 'equal' : 'notequal'}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ 
                padding: '1.5rem', borderRadius: '16px', 
                background: isEqual ? '#E6F4EA' : '#FCE8E6',
                border: `2px solid ${isEqual ? '#34A853' : '#EA4335'}`,
                textAlign: 'center', fontWeight: 800, fontSize: '1.25rem',
                color: isEqual ? '#1E8E3E' : '#C5221F'
              }}
            >
              {isEqual ? 'LHS ≡ RHS (Property Confirmed! ✓)' : 'Linearity Error! ✕'}
            </motion.div>
          </AnimatePresence>

          <div style={{ padding: '1rem', background: '#F8F9FA', borderRadius: '12px', fontSize: '0.8rem', color: '#5F6368' }}>
            <div style={{ fontWeight: 800, marginBottom: '4px' }}>Mathematical breakdown:</div>
            <div style={{ fontFamily: 'var(--font-mono)' }}>
              $u = [${u.join(', ')}], v = [${v.join(', ')}]$<br/>
              $Ku = [${Ku.join(', ')}], Kv = [${Kv.join(', ')}]$
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
