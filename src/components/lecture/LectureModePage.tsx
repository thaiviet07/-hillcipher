/**
 * LectureModePage — Dedicated immersive presentation view
 */
import React from 'react';
import { motion } from 'framer-motion';
import { BlockMath } from 'react-katex';
import { useCipherStore } from '../../store/cipherStore';
import { BLOCK_COLORS } from '../../constants/alphabet';
import { MatrixBracket } from '../cipher/MatrixEditor';
import { MatrixCell } from '../ui/MatrixCell';

export const LectureModePage: React.FC = () => {
  const { 
    matrix, matrixSize, stepsData, lectureStep, processedMessage, output 
  } = useCipherStore();

  const activeBlockIdx = Math.floor(lectureStep / matrixSize);
  const activeRowIdx = lectureStep % matrixSize;
  const currentStep = stepsData[activeBlockIdx];
  const currentOp = currentStep?.operations[activeRowIdx];

  // Derive the result letter for the current step
  const currentLetter = output[lectureStep] || '?';

  // Colors for visualization
  const blockColor = BLOCK_COLORS[activeBlockIdx % BLOCK_COLORS.length];

  if (!currentStep) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
        No transformation data. Enter a message first.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '4rem', minHeight: '65vh', alignItems: 'flex-start', paddingBottom: '120px' }}>
      
      {/* LEFT SIDE: Mathematical Transformation (Step Detail) */}
      <motion.div 
        key={`op-${lectureStep}`}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ 
          background: '#FFFFFF', padding: '2.5rem', borderRadius: '24px', 
          border: '4px solid #000000', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '100px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: blockColor, color: '#FFFFFF', padding: '4px 16px', borderRadius: '8px', fontWeight: 900, fontSize: '0.8rem' }}>
              BLOCK {activeBlockIdx + 1}
            </div>
            <div style={{ color: 'var(--google-blue)', fontWeight: 800, fontSize: '0.8rem' }}>
              ROW {activeRowIdx + 1}
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5F6368' }}>
            ALGORITHM TRACE
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontSize: '2.25rem', marginBottom: '2rem' }}>
            <BlockMath math={currentOp?.equation || ''} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', alignItems: 'center', background: '#F8F9FA', padding: '2rem', borderRadius: '16px', border: '2px solid #000000' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SUM</div>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>{currentOp?.sum}</div>
            </div>
            <div style={{ fontSize: '2rem', color: '#DADCE0' }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--google-blue)', marginBottom: '0.5rem' }}>MOD 26</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--google-blue)' }}>{currentOp?.modResult}</div>
            </div>
            <div style={{ fontSize: '2rem', color: '#DADCE0' }}>=</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--google-red)', marginBottom: '0.5rem' }}>LETTER</div>
              <motion.div 
                key={currentLetter}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--google-red)', lineHeight: 1 }}
              >
                {currentLetter}
              </motion.div>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.25rem', background: '#E8F0FE', borderRadius: '12px', borderLeft: `8px solid var(--google-blue)`, fontSize: '1.1rem', fontWeight: 500, color: '#1967D2' }}>
           The numerical result <strong>{currentOp?.modResult}</strong> maps to the character <strong>{currentLetter}</strong> in the alphabet.
        </div>
      </motion.div>

      {/* RIGHT SIDE: Context (Matrix, Input, Output) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Matrix Context */}
        <section>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--google-blue)' }} />
            Key Matrix (K) Focus
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DADCE0' }}>
            <MatrixBracket size={matrixSize}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${matrixSize}, 64px)`, gap: '12px' }}>
                {Array.isArray(matrix) && matrix.map((row, ri) =>
                  Array.isArray(row) && row.map((cell, ci) => (
                    <MatrixCell 
                      key={`${ri}-${ci}`} 
                      value={typeof cell === 'number' ? cell : 0} 
                      row={ri} col={ci} 
                      readOnly 
                    />
                  ))
                )}
              </div>
            </MatrixBracket>
          </div>
        </section>

        {/* Input Context */}
        <section>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--google-yellow)' }} />
            Sanitized Input (v)
          </h3>
          <div style={{ 
            background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '3px solid #000000',
            fontFamily: 'var(--font-mono)', fontSize: '1.5rem', letterSpacing: '0.15em', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'
          }}>
            {processedMessage.split('').map((char, i) => {
              const bIdx = Math.floor(i / matrixSize);
              const isActive = bIdx === activeBlockIdx;
              return (
                <span 
                  key={i} 
                  style={{ 
                    padding: '2px 8px', borderRadius: '4px',
                    background: isActive ? 'var(--google-yellow)' : 'transparent',
                    border: isActive ? '2px solid #000000' : '2px solid transparent',
                    fontWeight: isActive ? 900 : 400,
                    transition: 'all 0.3s'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </section>

        {/* Output Progress */}
        <section>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--google-red)' }} />
            Cumulative Output
          </h3>
          <div style={{ 
            background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '3px solid #000000',
            fontFamily: 'var(--font-mono)', fontSize: '2rem', letterSpacing: '0.2em', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '4.5rem'
          }}>
            {output.split('').map((char, i) => {
              const isPast = i < lectureStep;
              const isCurrent = i === lectureStep;
              return (
                <motion.span 
                  key={i}
                  initial={isCurrent ? { scale: 0, opacity: 0 } : {}}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ 
                    padding: '2px 8px', borderRadius: '4px',
                    background: isCurrent ? 'var(--google-red)' : 'transparent',
                    color: isCurrent ? '#FFFFFF' : (isPast ? 'var(--text-primary)' : 'transparent'),
                    fontWeight: 900,
                    transition: 'all 0.3s'
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#5F6368', fontStyle: 'italic', textAlign: 'right' }}>
            The result string is built character-by-character.
          </div>
        </section>

      </div>

    </div>
  );
};
