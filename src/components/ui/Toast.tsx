/**
 * Toast — Google-style subtle notification
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  variant: 'error' | 'warning' | 'info' | 'success';
  onDismiss: () => void;
}

const VARIANT_MAP = {
  error:   { bg: '#C5221F', color: '#FFFFFF', icon: '✕' },
  warning: { bg: '#F9AB00', color: '#202124', icon: '⚠' },
  info:    { bg: '#1A73E8', color: '#FFFFFF', icon: 'ℹ' },
  success: { bg: '#1E8E3E', color: '#FFFFFF', icon: '✓' },
};

export const Toast: React.FC<ToastProps> = ({ message, variant, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const style = VARIANT_MAP[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        zIndex: 1000,
        background: style.bg,
        color: style.color,
        padding: '12px 24px',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '300px',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
    >
      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{style.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button 
        onClick={onDismiss}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7, padding: '4px' }}
      >
        ✕
      </button>
    </motion.div>
  );
};
