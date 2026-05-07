/**
 * MessageInput — Material 3 Input Section
 */
import React from 'react';
import { useCipherStore } from '../../store/cipherStore';

interface MessageInputProps {
  onToast: (msg: string, variant: 'error' | 'warning' | 'info') => void;
}

export const MessageInput: React.FC<MessageInputProps> = () => {
  const { message, setMessage, setMode, mode } = useCipherStore();

  const handleTextChange = (val: string) => {
    // Only allow A-Z and spaces
    const clean = val.toUpperCase().replace(/[^A-Z\s]/g, '');
    setMessage(clean);
  };

  return (
    <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Message</h2>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
          {(['encrypt', 'decrypt'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '6px 20px', borderRadius: 'var(--radius-full)', border: 'none',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                background: mode === m ? 'var(--bg-surface)' : 'transparent',
                color: mode === m ? 'var(--google-blue)' : 'var(--text-secondary)',
                boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <label style={{ 
          position: 'absolute', top: '-10px', left: '16px', 
          background: 'var(--bg-surface)', padding: '0 8px',
          fontSize: '0.75rem', fontWeight: 700, color: 'var(--google-blue)'
        }}>
          INPUT TEXT
        </label>
        <textarea
          value={message}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="TYPE YOUR SECRET MESSAGE HERE..."
          style={{
            width: '100%', height: '140px', padding: '1.5rem',
            borderRadius: 'var(--radius-sm)', border: '2px solid var(--google-blue)',
            fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)',
            background: 'transparent', resize: 'none', outline: 'none',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.05em'
          }}
        />
        <div style={{ 
          position: 'absolute', bottom: '12px', right: '12px',
          fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)'
        }}>
          {message.length} CHARACTERS
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {['THE QUICK BROWN FOX', 'HELLO WORLD', 'SECRET MISSION'].map(preset => (
          <button
            key={preset}
            onClick={() => setMessage(preset)}
            style={{
              padding: '6px 12px', borderRadius: '8px', border: '1px solid #DADCE0',
              background: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            {preset}
          </button>
        ))}
      </div>
    </section>
  );
};
