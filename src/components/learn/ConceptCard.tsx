/**
 * ConceptCard — Google-style expandable card
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConceptCardProps {
  number: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  number, title, subtitle, children, defaultOpen = false, accentColor = 'var(--google-blue)',
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #DADCE0',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: open ? '0 4px 6px rgba(60,64,67,.15), 0 1px 3px rgba(60,64,67,.3)' : '0 1px 2px rgba(60,64,67,.3)',
        transition: 'all 0.2s ease',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1.25rem 1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          borderBottom: open ? '1px solid #F1F3F4' : 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#F8F9FA')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
      >
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem',
          background: open ? accentColor : '#F1F3F4',
          color: open ? '#FFFFFF' : 'var(--text-secondary)',
          transition: 'all 0.2s',
        }}>
          {number}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {subtitle}
            </div>
          )}
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          style={{ color: 'var(--text-muted)', fontSize: '1rem' }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div style={{ padding: '1.5rem' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
