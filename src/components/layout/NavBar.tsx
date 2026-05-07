/**
 * NavBar — Google-style navigation with Material 3 refinements
 */
import React from 'react';
import { useCipherStore } from '../../store/cipherStore';

interface NavBarProps {
  activePage: 'cipher' | 'learn' | 'attack' | 'about' | 'security';
  onNavigate: (page: 'cipher' | 'learn' | 'attack' | 'about' | 'security') => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activePage, onNavigate }) => {
  const { lectureMode, matrixSize, setMatrixSize, toggleLectureMode } = useCipherStore();

  const NAV_LINKS = [
    { id: 'cipher', label: 'Cipher' },
    { id: 'learn', label: 'Academy' },
    { id: 'attack', label: 'Attack' },
    { id: 'security', label: 'Security' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav style={{
      height: '72px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #DADCE0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div 
        onClick={() => !lectureMode && onNavigate('cipher')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: lectureMode ? 'default' : 'pointer' }}
      >
        <div style={{ 
          width: 32, height: 32, background: 'var(--google-blue)', borderRadius: '8px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 900, fontSize: '1.25rem'
        }}>
          H
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Hill <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Studio</span>
        </span>
      </div>

      {/* Nav Links — Hidden in Lecture Mode */}
      {!lectureMode && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {NAV_LINKS.map(link => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id as any)}
                style={{
                  background: isActive ? 'var(--bg-subtle)' : 'transparent', 
                  border: 'none', padding: '8px 20px', borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem', fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--google-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Action Area */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {!lectureMode && (
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', padding: '4px' }}>
            {([2, 3] as const).map((s) => (
              <button
                key={s}
                onClick={() => setMatrixSize(s)}
                style={{
                  padding: '4px 16px', borderRadius: 'var(--radius-full)', border: 'none',
                  fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                  background: matrixSize === s ? 'var(--bg-surface)' : 'transparent',
                  color: matrixSize === s ? 'var(--google-blue)' : 'var(--text-secondary)',
                  boxShadow: matrixSize === s ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {s}×{s}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => toggleLectureMode()}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 24px', borderRadius: 'var(--radius-full)', 
            background: lectureMode ? 'var(--google-blue)' : 'var(--bg-surface)',
            border: `1px solid ${lectureMode ? 'var(--google-blue)' : '#DADCE0'}`,
            color: lectureMode ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
            boxShadow: lectureMode ? '0 8px 16px rgba(66, 133, 244, 0.2)' : 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          <span>{lectureMode ? '📖' : '👨‍🏫'}</span>
          {lectureMode ? 'EXIT LECTURE' : 'LECTURE MODE'}
        </button>
      </div>
    </nav>
  );
};
