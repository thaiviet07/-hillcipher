/**
 * StepPanel — Google-style breakdown
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InlineMath } from 'react-katex';
import { useCipherStore } from '../../store/cipherStore';
import { BLOCK_COLORS } from '../../constants/alphabet';
import 'katex/dist/katex.min.css';

export const StepPanel: React.FC = () => {
  const { showSteps, stepsData, lectureMode, lectureStep } = useCipherStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lectureMode && activeStepRef.current) {
      activeStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [lectureStep, lectureMode]);

  useEffect(() => {
    if (!showSteps) {
      setIsPlaying(false);
      setVisibleCount(0);
    } else {
      setVisibleCount(stepsData.length);
    }
  }, [showSteps, stepsData.length]);

  const handlePlay = () => {
    setIsPlaying(true);
    setVisibleCount(0);
  };

  useEffect(() => {
    if (isPlaying) {
      if (visibleCount < stepsData.length) {
        timerRef.current = setTimeout(() => {
          setVisibleCount((v) => v + 1);
        }, 1000);
      } else {
        setIsPlaying(false);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, visibleCount, stepsData.length]);

  if (!showSteps || stepsData.length === 0) return null;

  const visibleSteps = isPlaying ? stepsData.slice(0, visibleCount) : stepsData;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500 }}>
          Transformation Steps
        </h2>
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          style={{
            padding: '6px 16px',
            borderRadius: '24px',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: isPlaying ? 'default' : 'pointer',
            border: '1px solid #DADCE0',
            background: isPlaying ? '#F8F9FA' : '#FFFFFF',
            color: 'var(--google-blue)',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,.3)',
          }}
        >
          {isPlaying ? '▶ Auto-playing...' : '🎬 Play All Steps'}
        </button>
      </div>

      <AnimatePresence>
        {visibleSteps.map((step, idx) => {
          const color = BLOCK_COLORS[idx % BLOCK_COLORS.length];
          const isLectureActive = lectureMode && lectureStep === idx;
          return (
            <motion.div
              key={step.blockIndex}
              ref={isLectureActive ? activeStepRef : null}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: isLectureActive ? 1.02 : 1,
                borderColor: isLectureActive ? 'var(--google-blue)' : '#DADCE0',
                boxShadow: isLectureActive ? '0 8px 24px rgba(66, 133, 244, 0.2)' : '0 1px 2px 0 rgba(60,64,67,.3)',
              }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #DADCE0',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                borderLeft: `8px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color, background: `${color}10`, padding: '2px 8px', borderRadius: '4px' }}>
                  BLOCK {step.blockIndex + 1}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  "{step.plainText}" → [{step.plainVector.join(', ')}]
                </span>
              </div>

              <div style={{ background: '#F8F9FA', padding: '1rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {step.operations.map((op, oi) => (
                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)', width: 50 }}>Row {oi + 1}:</span>
                    <span style={{ color: '#202124' }}><InlineMath math={op.equation} /></span>
                    <span style={{ color: 'var(--text-muted)' }}>=</span>
                    <span style={{ fontWeight: 600 }}>{op.sum}</span>
                    <span style={{ color: 'var(--text-muted)' }}>mod 26 →</span>
                    <span style={{ color, fontWeight: 700, fontSize: '1rem' }}>{op.modResult}</span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span style={{ color, fontWeight: 700, fontSize: '1.125rem' }}>{String.fromCharCode(65 + op.modResult)}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span>Final Result for Block:</span>
                <span style={{ color, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.1em' }}>{step.cipherText}</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
};
