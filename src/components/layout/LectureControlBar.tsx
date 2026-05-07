/**
 * LectureControlBar — Presentation controls for Lecture Mode (PRD §10.1)
 */
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCipherStore } from '../../store/cipherStore';

export const LectureControlBar: React.FC = () => {
  const { 
    lectureMode, lectureStep, toggleLectureMode, setLectureStep, stepsData, 
    showSteps, toggleSteps, matrixSize 
  } = useCipherStore();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Total presentation steps = blocks * rows per block
  const totalSteps = stepsData.length * matrixSize;

  // Sync body class for CSS scaling
  useEffect(() => {
    if (lectureMode) {
      document.body.classList.add('lecture-mode');
      if (!showSteps) toggleSteps();
    } else {
      document.body.classList.remove('lecture-mode');
      setIsPlaying(false);
    }
  }, [lectureMode, showSteps, toggleSteps]);

  // Sequencer Logic
  useEffect(() => {
    if (isPlaying && lectureMode && totalSteps > 0) {
      if (lectureStep < totalSteps - 1) {
        timerRef.current = setTimeout(() => {
          setLectureStep(lectureStep + 1);
        }, 2000); // 2 second delay per PRD
      } else {
        setIsPlaying(false);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, lectureStep, totalSteps, lectureMode, setLectureStep]);

  if (!lectureMode) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '100px', background: '#FFFFFF',
        borderTop: '4px solid #000000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '3rem', zIndex: 1001,
        boxShadow: '0 -8px 24px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => setLectureStep(Math.max(0, lectureStep - 1))}
          style={{ padding: '12px 24px', borderRadius: '8px', border: '3px solid #000000', background: '#FFFFFF', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem' }}
        >
          BACK
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ 
            padding: '16px 48px', borderRadius: '48px', border: 'none', 
            background: isPlaying ? 'var(--google-red)' : 'var(--google-green)', 
            color: '#FFFFFF', fontWeight: 900, cursor: 'pointer',
            minWidth: 200, fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </button>

        <button 
          onClick={() => setLectureStep(Math.min(totalSteps - 1, lectureStep + 1))}
          style={{ padding: '12px 24px', borderRadius: '8px', border: '3px solid #000000', background: '#FFFFFF', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem' }}
        >
          NEXT
        </button>
      </div>

      <div style={{ height: '60px', width: '2px', background: '#DADCE0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '1.75rem', color: '#000000' }}>
          STEP {lectureStep + 1} / {totalSteps || 0}
        </div>
        <button 
          onClick={toggleLectureMode}
          style={{ padding: '10px 24px', borderRadius: '12px', border: '2px solid #DADCE0', background: '#FFFFFF', color: '#5F6368', cursor: 'pointer', fontSize: '1rem', fontWeight: 700 }}
        >
          EXIT
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ position: 'absolute', top: -8, left: 0, right: 0, height: 8, background: '#F1F3F4' }}>
        <motion.div 
          style={{ height: '100%', background: 'var(--google-blue)' }}
          animate={{ width: `${totalSteps > 0 ? ((lectureStep + 1) / totalSteps) * 100 : 0}%` }}
        />
      </div>
    </motion.div>
  );
};
