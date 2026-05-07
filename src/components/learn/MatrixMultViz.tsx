/**
 * MatrixMultViz — Card 2 interactive visualization
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { mod } from '../../math/modular';

const ROW_COLORS = ['#4285F4', '#EA4335'];

function matVecMult(K: number[][], v: number[]): { sums: number[]; mods: number[] } {
  const sums = K.map((row) => row.reduce((acc, k, i) => acc + k * v[i], 0));
  const mods = sums.map((s) => mod(s, 26));
  return { sums, mods };
}

export const MatrixMultViz: React.FC = () => {
  const [K, setK] = useState([[3, 3], [2, 5]]);
  const [v, setV] = useState([7, 4]);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const { sums, mods } = matVecMult(K, v);

  const updateK = (r: number, c: number, val: number) => {
    setK((prev) => prev.map((row, ri) => row.map((cell, ci) => ri === r && ci === c ? val : cell)));
  };

  const updateV = (i: number, val: number) => {
    setV((prev) => prev.map((x, idx) => idx === i ? val : x));
  };

  const cellStyle = (highlight: boolean, color: string): React.CSSProperties => ({
    width: 44, height: 44,
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '1rem',
    fontWeight: 700,
    background: highlight ? `${color}10` : '#FFFFFF',
    color: highlight ? color : '#202124',
    border: `1px solid ${highlight ? color : '#DADCE0'}`,
    borderRadius: '4px',
    outline: 'none',
    transition: 'all 0.1s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', background: '#F8F9FA', padding: '2rem', borderRadius: '8px', border: '1px solid #DADCE0' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ borderLeft: '2px solid #DADCE0', borderRight: '2px solid #DADCE0', padding: '4px 10px' }}>
            {K.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: '6px', marginBottom: ri === 0 ? '6px' : 0 }} onMouseEnter={() => setActiveRow(ri)} onMouseLeave={() => setActiveRow(null)}>
                {row.map((cell, ci) => (
                  <input key={ci} type="number" value={cell} onChange={(e) => updateK(ri, ci, Number(e.target.value))} style={cellStyle(activeRow === ri, ROW_COLORS[ri])} />
                ))}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '1.5rem', color: '#DADCE0' }}>×</span>
          <div style={{ borderLeft: '2px solid #DADCE0', borderRight: '2px solid #DADCE0', padding: '4px 10px' }}>
            {v.map((val, i) => (
              <div key={i} style={{ marginBottom: i === 0 ? '6px' : 0 }}>
                <input type="number" value={val} onChange={(e) => updateV(i, Number(e.target.value))} style={cellStyle(activeRow !== null, activeRow !== null ? '#FBBC05' : '#202124')} />
              </div>
            ))}
          </div>
          <span style={{ fontSize: '1.5rem', color: '#DADCE0' }}>=</span>
          <div style={{ borderLeft: '2px solid #DADCE0', borderRight: '2px solid #DADCE0', padding: '4px 10px' }}>
            {mods.map((m, i) => (
              <div key={i} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: i === 0 ? '6px' : 0, background: `${ROW_COLORS[i]}15`, border: `1px solid ${ROW_COLORS[i]}`, borderRadius: '4px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: ROW_COLORS[i] }}>
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {K.map((row, ri) => (
          <div key={ri} style={{ background: activeRow === ri ? '#F1F3F4' : '#FFFFFF', padding: '1rem', border: '1px solid #DADCE0', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'background 0.2s' }}>
            <span style={{ fontWeight: 600, color: ROW_COLORS[ri], width: 60 }}>Row {ri + 1}:</span>
            <span style={{ fontSize: '0.875rem' }}><InlineMath math={row.map((k, i) => `${k} \\times ${v[i]}`).join(' + ')} /></span>
            <span style={{ color: 'var(--text-muted)' }}>=</span>
            <span style={{ fontWeight: 600 }}>{sums[ri]}</span>
            <span style={{ color: 'var(--text-muted)' }}>≡</span>
            <span style={{ fontWeight: 700, color: ROW_COLORS[ri], fontSize: '1.125rem' }}>{mods[ri]}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(mod 26)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
