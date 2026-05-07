/**
 * MatrixCell — Material 3 Styled Cell Input
 */
import React, { useState } from 'react';

interface MatrixCellProps {
  value: number;
  row: number;
  col: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
}

export const MatrixCell: React.FC<MatrixCellProps> = ({ value, row, col, onChange, readOnly }) => {
  const [localValue, setLocalValue] = useState((value ?? 0).toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^-?\d*$/.test(val)) {
      setLocalValue(val);
      const num = parseInt(val);
      if (!isNaN(num) && onChange) {
        onChange(num);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={readOnly ? value : localValue}
        onChange={handleChange}
        readOnly={readOnly}
        style={{
          width: '100%',
          height: '64px',
          textAlign: 'center',
          fontSize: '1.25rem',
          fontWeight: 800,
          background: readOnly ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          border: '2px solid #DADCE0',
          borderRadius: '16px',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: readOnly ? 'default' : 'text',
          boxShadow: readOnly ? 'none' : 'inset 0 1px 2px rgba(0,0,0,0.05)',
          fontFamily: 'var(--font-mono)'
        }}
        onFocus={(e) => !readOnly && (e.target.style.borderColor = 'var(--google-blue)')}
        onBlur={(e) => !readOnly && (e.target.style.borderColor = '#DADCE0')}
      />
      <div style={{ 
        position: 'absolute', top: '4px', left: '8px', 
        fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)',
        pointerEvents: 'none'
      }}>
        {row}{col}
      </div>
    </div>
  );
};
