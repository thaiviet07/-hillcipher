/**
 * InverseWalkthrough — High-fidelity wizard-style matrix inversion lesson
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath } from 'react-katex';
import { mod, gcd, modInverse } from '../../math/modular';
import { getDeterminant, getAdjugate, getInverseMod26 } from '../../math/matrix';
import { useCipherStore } from '../../store/cipherStore';

interface Step { id: string; label: string; math: string; note: string; detail: string; }

function buildSteps(matrix: number[][]): { steps: Step[]; valid: boolean } {
  const n = matrix.length;
  const det = getDeterminant(matrix);
  const detMod = mod(det, 26);
  const g = gcd(detMod, 26);
  const valid = g === 1;
  const detInv = valid ? modInverse(detMod, 26) : null;
  const adj = getAdjugate(matrix);
  const adjMod = adj.map(r => r.map(v => mod(v, 26)));
  const kinv = valid ? getInverseMod26(matrix) : null;

  if (n === 2) {
    const [[a, b], [c, d]] = matrix;
    return {
      steps: [
        { 
          id: 'det', label: 'Determinant (ad - bc)', 
          math: `\\det(K) = (${a} \\times ${d}) - (${b} \\times ${c}) = ${det}`, 
          note: 'The scale of the transformation.',
          detail: 'For a 2x2 matrix, the determinant is the difference between the products of its diagonals.'
        },
        { 
          id: 'mod', label: 'Modulo Reduction', 
          math: `${det} \\equiv ${detMod} \\pmod{26}`, 
          note: 'Reducing the scale to the alphabet range.',
          detail: 'Since we work in Modulo 26, any result outside 0-25 must be reduced.'
        },
        { 
          id: 'gcd', label: 'Check Invertibility', 
          math: `\\gcd(${detMod}, 26) = ${g}`, 
          note: valid ? 'Matrix is invertible!' : 'Matrix is NOT invertible.',
          detail: 'The determinant mod 26 must share no factors with 26. Since 26 = 2 × 13, the determinant cannot be even or a multiple of 13.'
        },
        ...(valid ? [
          { 
            id: 'inv', label: 'Determinant Inverse', 
            math: `${detMod}^{-1} \\equiv ${detInv} \\pmod{26}`, 
            note: 'The value that "undoes" the determinant scaling.',
            detail: 'We find a number x such that (det × x) ≡ 1 mod 26. This is the modular multiplicative inverse.'
          },
          { 
            id: 'adj', label: 'Adjugate Matrix', 
            math: `\\text{adj}(K) \\equiv \\begin{bmatrix}${adjMod[0][0]} & ${adjMod[0][1]} \\\\ ${adjMod[1][0]} & ${adjMod[1][1]}\\end{bmatrix} \\pmod{26}`, 
            note: 'Transposed cofactor matrix.',
            detail: 'In 2x2: Swap the main diagonal, and negate the off-diagonal elements.'
          },
          { 
            id: 'kinv', label: 'Final Inverse Key', 
            math: `K^{-1} \\equiv ${detInv} \\cdot \\begin{bmatrix}${adjMod[0][0]} & ${adjMod[0][1]} \\\\ ${adjMod[1][0]} & ${adjMod[1][1]}\\end{bmatrix} \\equiv \\begin{bmatrix}${kinv![0][0]} & ${kinv![0][1]} \\\\ ${kinv![1][0]} & ${kinv![1][1]}\\end{bmatrix}`, 
            note: 'The decryption key.',
            detail: 'Multiply every element of the adjugate matrix by the determinant inverse mod 26.'
          }
        ] : [])
      ],
      valid
    };
  }

  return {
    steps: [
      { id: 'det', label: 'Determinant Calculation', math: `\\det(K) = ${det}`, note: 'Expansion along the first row.', detail: '3x3 determinants involve calculating the cofactors of each element in the first row.' },
      { id: 'mod', label: 'Check Invertibility', math: `\\gcd(${detMod}, 26) = ${g}`, note: valid ? 'Invertible!' : 'Singular (Not invertible)', detail: 'If GCD is 1, the matrix can be used for decryption.' },
      ...(valid ? [{ id: 'kinv', label: 'Inverse Matrix', math: `K^{-1} = \\dots`, note: 'Detailed in advanced lectures.', detail: 'The 3x3 inversion follows the same det⁻¹ · adj(K) logic, but with more complex cofactor calculations.' }] : [])
    ],
    valid
  };
}

export const InverseWalkthrough: React.FC = () => {
  const { matrix: storeMatrix } = useCipherStore();
  const [useCurrentKey, setUseCurrentKey] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const workMatrix = useCurrentKey ? storeMatrix : [[3, 3], [2, 5]];
  const { steps } = buildSteps(workMatrix);
  const activeStep = steps[stepIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Key Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', background: '#F1F3F4', padding: '6px', borderRadius: '16px', border: '1px solid #DADCE0' }}>
          <button 
            onClick={() => { setUseCurrentKey(false); setStepIndex(0); }}
            style={{ padding: '8px 20px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700, border: 'none', background: !useCurrentKey ? 'var(--google-blue)' : 'transparent', color: !useCurrentKey ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Example Key
          </button>
          <button 
            onClick={() => { setUseCurrentKey(true); setStepIndex(0); }}
            style={{ padding: '8px 20px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700, border: 'none', background: useCurrentKey ? 'var(--google-blue)' : 'transparent', color: useCurrentKey ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            My Key
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {steps.map((_, i) => (
          <div 
            key={i} 
            style={{ 
              width: i === stepIndex ? 24 : 8, height: 8, borderRadius: '4px', 
              background: i <= stepIndex ? 'var(--google-blue)' : '#DADCE0',
              transition: 'all 0.3s'
            }} 
          />
        ))}
      </div>

      {/* Step Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${useCurrentKey}-${stepIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '24px', border: '2px solid #000000', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--google-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              STEP {stepIndex + 1} OF {steps.length}: {activeStep.label}
            </div>
          </div>

          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <BlockMath math={activeStep.math} />
          </div>

          <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DADCE0' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#202124', marginBottom: '8px' }}>{activeStep.note}</div>
            <div style={{ fontSize: '0.85rem', color: '#5F6368', lineHeight: 1.5 }}>{activeStep.detail}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={() => setStepIndex(s => Math.max(0, s - 1))}
          disabled={stepIndex === 0}
          style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #DADCE0', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer', opacity: stepIndex === 0 ? 0.3 : 1 }}
        >
          ← Back
        </button>
        <button 
          onClick={() => {
            if (stepIndex < steps.length - 1) setStepIndex(s => s + 1);
          }}
          style={{ 
            padding: '12px 32px', borderRadius: '12px', border: 'none', 
            background: stepIndex === steps.length - 1 ? 'var(--google-green)' : 'var(--google-blue)', 
            color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' 
          }}
        >
          {stepIndex === steps.length - 1 ? 'Algorithm Complete ✓' : 'Next Step →'}
        </button>
      </div>

    </div>
  );
};
