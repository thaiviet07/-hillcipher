/**
 * App.tsx — Minimal Shell for Debugging
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar } from './components/layout/NavBar';
import { MatrixEditor } from './components/cipher/MatrixEditor';
import { MessageInput } from './components/cipher/MessageInput';
import { CipherOutput } from './components/cipher/CipherOutput';
import { StepPanel } from './components/steps/StepPanel';
import { LearnPage } from './components/learn/LearnPage';
import { AttackDemo } from './components/learn/AttackDemo';
import { AboutPage } from './components/layout/AboutPage';
import { SecurityAnalysis } from './components/learn/SecurityAnalysis';
import { LectureModePage } from './components/lecture/LectureModePage';
import { LectureControlBar } from './components/layout/LectureControlBar';
import { Toast } from './components/ui/Toast';
import { useCipherStore } from './store/cipherStore';
import 'katex/dist/katex.min.css';

interface ToastState { id: number; msg: string; variant: 'error' | 'warning' | 'info' | 'success'; }
type Page = 'cipher' | 'learn' | 'attack' | 'about' | 'security';

function CipherPage({ onToast }: { onToast: (msg: string, v: 'error' | 'warning' | 'info') => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <MessageInput onToast={onToast} />
        <MatrixEditor />
      </div>
      <CipherOutput />
      <StepPanel />
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('cipher');
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const store = useCipherStore();
  const { lectureMode, message, matrix, mode, executeTransform } = store;
  const toastId = React.useRef(0);

  // Live Transformation Sync
  React.useEffect(() => {
    executeTransform();
  }, [message, matrix, mode, executeTransform]);

  const addToast = useCallback((msg: string, variant: 'error' | 'warning' | 'info') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, variant }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  if (!store) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Critical Error: Store failed to initialize.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <NavBar activePage={page} onNavigate={setPage} />
      
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 2rem' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={lectureMode ? 'lecture-mode' : page} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {lectureMode ? (
              <LectureModePage />
            ) : (
              <React.Fragment>
                {page === 'cipher' && <CipherPage onToast={addToast} />}
                {page === 'learn' && <LearnPage />}
                {page === 'attack' && <AttackDemo />}
                {page === 'security' && <SecurityAnalysis />}
                {page === 'about' && <AboutPage />}
              </React.Fragment>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.msg} variant={t.variant} onDismiss={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>

      <LectureControlBar />
    </div>
  );
}
