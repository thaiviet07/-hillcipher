/**
 * MatrixPresets — Pre-configured valid matrices for the Hill Cipher
 */
import React from 'react';
import { useCipherStore } from '../../store/cipherStore';

const PRESETS_2X2 = [
  { name: 'Identity', matrix: [[1, 0], [0, 1]] },
  { name: 'Shifted', matrix: [[3, 3], [2, 5]] },
  { name: 'Standard', matrix: [[6, 24], [1, 13]] },
  { name: 'Classic', matrix: [[3, 2], [5, 7]] },
];

const PRESETS_3X3 = [
  { name: 'Identity', matrix: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
  { name: 'Hill Classic', matrix: [[1, 2, 3], [4, 5, 6], [11, 9, 8]] },
  { name: 'Secure-3', matrix: [[6, 24, 1], [13, 16, 10], [20, 17, 15]] },
];

export const MatrixPresets: React.FC = () => {
  const { matrixSize, setFullMatrix, generateRandomMatrix } = useCipherStore();

  const presets = matrixSize === 2 ? PRESETS_2X2 : PRESETS_3X3;

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button
        onClick={() => generateRandomMatrix()}
        style={{
          padding: '6px 14px',
          borderRadius: '8px',
          border: '1px solid var(--google-blue)',
          background: 'var(--bg-subtle)',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--google-blue)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        🎲 RANDOM
      </button>

      {presets.map((p) => (
        <button
          key={p.name}
          onClick={() => setFullMatrix(p.matrix)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #DADCE0',
            background: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--google-blue)';
            e.currentTarget.style.color = 'var(--google-blue)';
            e.currentTarget.style.background = 'var(--bg-subtle)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#DADCE0';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
};
