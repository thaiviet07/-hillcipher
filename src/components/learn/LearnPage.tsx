/**
 * LearnPage — Google-style immersive curriculum dashboard with Progress Tracking and Graduation
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCipherStore } from '../../store/cipherStore';
import { VectorBuilder } from './VectorBuilder';
import { MatrixMultViz } from './MatrixMultViz';
import { InvertibilityViz } from './InvertibilityViz';
import { InverseWalkthrough } from './InverseWalkthrough';
import { Mod26Arithmetic } from './Mod26Arithmetic';
import { LinearTransformation } from './LinearTransformation';
import { VectorSpaceVisualizer } from './VectorSpaceVisualizer';
import { CryptanalysisDashboard } from './CryptanalysisDashboard';
import { Badge } from '../ui/Badge';

const MODULES = [
  { id: 'vector', title: '1. Vector Mapping', subtitle: 'From text to numerical vectors', component: <VectorBuilder />, color: '#4285F4', icon: '📐' },
  { id: 'matrix', title: '2. Matrix Multiplication', subtitle: 'The encryption engine', component: <MatrixMultViz />, color: '#EA4335', icon: '✖️' },
  { id: 'invert', title: '3. Invertibility', subtitle: 'Determinants and modular keys', component: <InvertibilityViz />, color: '#FBBC05', icon: '🔑' },
  { id: 'inverse', title: '4. Matrix Inversion', subtitle: 'Finding the decryption key', component: <InverseWalkthrough />, color: '#34A853', icon: '🔄' },
  { id: 'mod', title: '5. Modular Arithmetic', subtitle: 'The clock arithmetic (Mod 26)', component: <Mod26Arithmetic />, color: '#4285F4', icon: '⏰' },
  { id: 'linear', title: '6. Linear Properties', subtitle: 'Understanding vulnerabilities', component: <LinearTransformation />, color: '#EA4335', icon: '📊' },
  { id: 'geometry', title: '7. Vector Geometry', subtitle: 'Visualizing shear and rotation', component: <VectorSpaceVisualizer />, color: '#4285F4', icon: '🌍' },
  { id: 'security', title: '8. Cryptanalysis', subtitle: 'Evaluating cryptographic strength', component: <CryptanalysisDashboard />, color: '#EA4335', icon: '🛡️' },
];

export const LearnPage: React.FC = () => {
  const { completedModules, toggleModuleCompletion } = useCipherStore();
  const [activeModuleId, setActiveModuleId] = useState(MODULES[0].id);
  
  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];
  const progressPercent = (completedModules.length / MODULES.length) * 100;
  const isGraduated = completedModules.length === MODULES.length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem', minHeight: '80vh', position: 'relative' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ borderRight: '1px solid #DADCE0', paddingRight: '2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem', color: '#202124' }}>Academy</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              <span>COURSE PROGRESS</span>
              <span>{completedModules.length}/{MODULES.length}</span>
            </div>
            <div style={{ height: '6px', background: '#F1F3F4', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                style={{ height: '100%', background: isGraduated ? 'var(--google-green)' : 'var(--google-blue)' }} 
              />
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {MODULES.map((m) => {
            const isActive = m.id === activeModuleId;
            const isCompleted = completedModules.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => setActiveModuleId(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem', borderRadius: '16px', border: 'none',
                  background: isActive ? `${m.color}12` : 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  width: 32, height: 32, borderRadius: '8px', background: isCompleted ? 'var(--google-green)' : (isActive ? m.color : '#F1F3F4'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#FFFFFF', transition: 'all 0.3s'
                }}>
                  {isCompleted ? '✓' : m.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isActive ? m.color : '#3C4043' }}>{m.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.subtitle}</div>
                </div>
                {isActive && <motion.div layoutId="active-pill" style={{ position: 'absolute', left: -32, width: 4, height: 32, background: m.color, borderRadius: '0 4px 4px 0' }} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main>
        <AnimatePresence mode="wait">
          {isGraduated && activeModuleId === 'finish' ? (
            <motion.div 
              key="graduated"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '32px', border: '2px solid #000000', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
            >
              <div style={{ fontSize: '6rem', marginBottom: '2rem' }}>🎓</div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#202124', letterSpacing: '-0.03em' }}>Academy Graduate</h2>
              <p style={{ fontSize: '1.25rem', color: '#5F6368', maxWidth: '600px', margin: '1rem auto 3rem' }}>
                Congratulations! You have mastered the linear algebra, modular arithmetic, and cryptanalytic foundations of the Hill Cipher.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => window.location.hash = '#/'} 
                  style={{ padding: '16px 32px', borderRadius: '32px', background: 'var(--google-blue)', color: '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Return to Cipher Studio
                </button>
                <button 
                  onClick={() => setActiveModuleId(MODULES[0].id)}
                  style={{ padding: '16px 32px', borderRadius: '32px', background: '#FFFFFF', color: '#000000', fontWeight: 800, border: '2px solid #000000', cursor: 'pointer' }}
                >
                  Review Curriculum
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeModuleId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Badge variant="info">LESSON {MODULES.findIndex(m => m.id === activeModuleId) + 1}</Badge>
                    {completedModules.includes(activeModuleId) && <Badge variant="valid">COMPLETED</Badge>}
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#202124', letterSpacing: '-0.02em' }}>{activeModule.title.split('. ')[1]}</h2>
                  <p style={{ fontSize: '1.25rem', color: '#5F6368', marginTop: '0.5rem' }}>{activeModule.subtitle}</p>
                </div>
                <button 
                  onClick={() => toggleModuleCompletion(activeModuleId)}
                  style={{ 
                    padding: '12px 24px', borderRadius: '24px', border: '2px solid #000000', 
                    background: completedModules.includes(activeModuleId) ? 'var(--google-green)' : '#FFFFFF',
                    color: completedModules.includes(activeModuleId) ? '#FFFFFF' : '#000000',
                    fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                    borderColor: completedModules.includes(activeModuleId) ? 'var(--google-green)' : '#000000'
                  }}
                >
                  {completedModules.includes(activeModuleId) ? '✓ Completed' : 'Mark as Done'}
                </button>
              </div>

              <div style={{ 
                background: '#FFFFFF', padding: '3rem', borderRadius: '32px', 
                border: '2px solid #000000', boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                minHeight: '500px'
              }}>
                {activeModule.component}
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => {
                    const idx = MODULES.findIndex(m => m.id === activeModuleId);
                    if (idx > 0) setActiveModuleId(MODULES[idx - 1].id);
                  }}
                  disabled={activeModuleId === MODULES[0].id}
                  style={{ padding: '14px 28px', borderRadius: '16px', border: '1px solid #DADCE0', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer', opacity: activeModuleId === MODULES[0].id ? 0.3 : 1, transition: 'all 0.2s' }}
                >
                  ← Previous Module
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {MODULES.findIndex(m => m.id === activeModuleId) + 1} of {MODULES.length}
                </div>
                <button 
                  onClick={() => {
                    const idx = MODULES.findIndex(m => m.id === activeModuleId);
                    if (idx < MODULES.length - 1) {
                      if (!completedModules.includes(activeModuleId)) toggleModuleCompletion(activeModuleId);
                      setActiveModuleId(MODULES[idx + 1].id);
                    } else if (idx === MODULES.length - 1) {
                      if (!completedModules.includes(activeModuleId)) toggleModuleCompletion(activeModuleId);
                      setActiveModuleId('finish');
                    }
                  }}
                  style={{ 
                    padding: '14px 40px', borderRadius: '16px', border: 'none', 
                    background: activeModule.color, color: '#FFFFFF', fontWeight: 800, 
                    cursor: 'pointer', boxShadow: `0 8px 20px ${activeModule.color}40`,
                    transition: 'all 0.2s'
                  }}
                >
                  {activeModuleId === MODULES[MODULES.length - 1].id ? 'Finish Academy 🎉' : 'Next Module →'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
};
