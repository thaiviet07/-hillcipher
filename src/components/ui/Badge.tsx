/**
 * Badge — Material 3 Styled Tag
 */
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'valid' | 'danger' | 'google';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'google': return { bg: 'var(--google-blue)', text: '#FFFFFF' };
      case 'valid': return { bg: '#E6F4EA', text: '#137333' };
      case 'warning': return { bg: '#FEF7E0', text: '#B06000' };
      case 'danger': return { bg: '#FCE8E6', text: '#C5221F' };
      default: return { bg: 'var(--bg-subtle)', text: 'var(--google-blue)' };
    }
  };

  const { bg, text } = getStyles();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.7rem',
      fontWeight: 900,
      background: bg,
      color: text,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap'
    }}>
      {children}
    </span>
  );
};
