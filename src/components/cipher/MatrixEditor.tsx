/**
 * MatrixEditor — Premium Material Design 3 Matrix Interface
 */
import React from 'react';
import { useCipherStore } from '../../store/cipherStore';

import { MatrixPresets } from './MatrixPresets';

// Exported sub-components for use in other pages
export const MatrixCell: React.FC<any> = ({ value, row, col, onChange, readOnly }) => (
  <div style={{ position: 'relative' }}>
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange && onChange(parseInt(e.target.value) || 0)}
      style={{
        width: '100%', height: '64px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 800,
        background: readOnly ? '#F1F3F4' : '#FFFFFF', border: '2px solid #DADCE0', borderRadius: '16px',
        color: '#202124', outline: 'none', fontFamily: 'monospace'
      }}
    />
    <div style={{ position: 'absolute', top: '4px', left: '8px', fontSize: '0.65rem', fontWeight: 900, color: '#70757A' }}>
      {row}{col}
    </div>
  </div>
);

export const MatrixBracket: React.FC<any> = ({ children, size, color = '#202124' }) => {
  const height = size === 3 ? 180 : 120;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
      <div style={{ width: '12px', height: `${height}px`, border: `3px solid ${color}`, borderRight: 'none', borderRadius: '8px 0 0 8px' }} />
      {children}
      <div style={{ width: '12px', height: `${height}px`, border: `3px solid ${color}`, borderLeft: 'none', borderRadius: '0 8px 8px 0' }} />
    </div>
  );
};

export const MatrixEditor: React.FC = () => {
  const store = useCipherStore();
  
  if (!store) return <div>Store Error</div>;
  
  const { matrix, matrixSize, updateMatrixCell, determinant, isValidKey } = store;

  // Total safety
  if (!Array.isArray(matrix)) return <div>Matrix format error</div>;

  return (
    <section style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2rem', border: '1px solid #DADCE0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Key Matrix (K)</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
        <MatrixBracket size={matrixSize === 3 ? 3 : 2} color={isValidKey ? '#4285F4' : '#EA4335'}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${matrixSize || 2}, 64px)`, 
            gap: '12px',
          }}>
            {matrix.map((row, ri) => 
              Array.isArray(row) ? row.map((val, ci) => (
                <MatrixCell 
                  key={`c-${ri}-${ci}`} 
                  value={val ?? 0} 
                  row={ri} col={ci} 
                  onChange={(v: number) => updateMatrixCell(ri, ci, v)}
                />
              )) : null
            )}
          </div>
        </MatrixBracket>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', borderTop: '1px solid #F1F3F4', paddingTop: '1.5rem' }}>
        <MatrixPresets />
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#F8F9FA', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Determinant: <strong>{determinant}</strong></span>
        <span style={{ color: isValidKey ? '#34A853' : '#EA4335' }}>
          {isValidKey ? '✓ Valid' : '✕ Invalid'}
        </span>
      </div>
    </section>
  );
};
