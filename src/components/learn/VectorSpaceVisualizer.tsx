/**
 * VectorSpaceVisualizer — Premium Geometric Visualization with Dragging and Live Math
 */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCipherStore } from '../../store/cipherStore';
import { mod } from '../../math/modular';
import { InlineMath } from 'react-katex';

export const VectorSpaceVisualizer: React.FC = () => {
  const { matrix, matrixSize } = useCipherStore();
  
  const [u, setU] = useState<[number, number]>([5, 8]);
  const [v, setV] = useState<[number, number]>([12, 4]);
  const [showLinearity, setShowLinearity] = useState(false);
  const [activeDrag, setActiveDrag] = useState<'u' | 'v' | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Coordinate scaling
  const SVG_SIZE = 500;
  const GRID_SIZE = 26;
  const PAD = 40;
  const scale = (SVG_SIZE - 2 * PAD) / GRID_SIZE;

  const toScreen = (val: number) => PAD + val * scale;
  const fromScreen = (coord: number) => {
    const val = Math.round((coord - PAD) / scale);
    return Math.max(0, Math.min(25, val));
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!activeDrag || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = fromScreen(e.clientX - rect.left);
    const y = fromScreen(e.clientY - rect.top);

    if (activeDrag === 'u') setU([x, y]);
    if (activeDrag === 'v') setV([x, y]);
  };

  useEffect(() => {
    if (activeDrag) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', () => setActiveDrag(null));
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', () => setActiveDrag(null));
    };
  }, [activeDrag]);

  // Transformations
  const transform = (vec: [number, number], m: number[][], useMod = true): [number, number] => {
    const x = m[0][0] * vec[0] + m[0][1] * vec[1];
    const y = m[1][0] * vec[0] + m[1][1] * vec[1];
    return useMod ? [mod(x, 26), mod(y, 26)] : [x, y];
  };

  const Ku = useMemo(() => transform(u, matrix), [u, matrix]);
  const Kv = useMemo(() => transform(v, matrix), [v, matrix]);
  const uPlusV: [number, number] = [mod(u[0] + v[0], 26), mod(u[1] + v[1], 26)];
  const K_uPlusV = useMemo(() => transform(uPlusV, matrix), [uPlusV, matrix]);

  // Grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= GRID_SIZE; i++) {
      lines.push({ x1: 0, y1: i, x2: GRID_SIZE, y2: i }); // Horizontal
      lines.push({ x1: i, y1: 0, x2: i, y2: GRID_SIZE }); // Vertical
    }
    return lines;
  }, []);

  if (matrixSize !== 2) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', background: '#F8F9FA', borderRadius: '24px', border: '1px solid #DADCE0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📐</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#202124' }}>2D Geometry Engine</h3>
        <p style={{ color: '#5F6368', marginTop: '0.5rem' }}>Switch to a 2x2 matrix to visualize linear transformations in the alphabet space.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
        
        {/* SVG Visualization */}
        <div style={{ position: 'relative', background: '#FFFFFF', borderRadius: '32px', border: '2px solid #000000', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <svg 
            ref={svgRef}
            width="100%" height="auto" viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} 
            style={{ display: 'block', overflow: 'visible', cursor: activeDrag ? 'grabbing' : 'default' }}
          >
            {/* Background Grid (Static) */}
            <g stroke="#F1F3F4" strokeWidth="1">
              {gridLines.map((l, i) => (
                <line key={i} x1={toScreen(l.x1)} y1={toScreen(l.y1)} x2={toScreen(l.x2)} y2={toScreen(l.y2)} />
              ))}
            </g>

            {/* Transformed Grid (Light blue) - Subtle background of transformation */}
            <g stroke="rgba(66, 133, 244, 0.08)" strokeWidth="1.5">
              {gridLines.map((l, i) => {
                const p1 = transform([l.x1, l.y1], matrix, false);
                const p2 = transform([l.x2, l.y2], matrix, false);
                return <line key={`t-${i}`} x1={toScreen(p1[0])} y1={toScreen(p1[1])} x2={toScreen(p2[0])} y2={toScreen(p2[1])} />;
              })}
            </g>

            {/* Axes */}
            <line x1={toScreen(0)} y1={toScreen(0)} x2={toScreen(GRID_SIZE)} y2={toScreen(0)} stroke="#202124" strokeWidth="3" strokeLinecap="round" />
            <line x1={toScreen(0)} y1={toScreen(0)} x2={toScreen(0)} y2={toScreen(GRID_SIZE)} stroke="#202124" strokeWidth="3" strokeLinecap="round" />

            {/* Vectors and Markers */}
            <defs>
              <marker id="head-u" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="var(--google-blue)" />
              </marker>
              <marker id="head-v" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="var(--google-red)" />
              </marker>
              <marker id="head-res" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="var(--google-green)" />
              </marker>
            </defs>

            {/* u and Ku */}
            <line x1={toScreen(0)} y1={toScreen(0)} x2={toScreen(u[0])} y2={toScreen(u[1])} stroke="var(--google-blue)" strokeWidth="3" markerEnd="url(#head-u)" strokeLinecap="round" />
            <motion.line animate={{ x2: toScreen(Ku[0]), y2: toScreen(Ku[1]) }} x1={toScreen(0)} y1={toScreen(0)} stroke="var(--google-blue)" strokeWidth="3" strokeDasharray="8 4" markerEnd="url(#head-u)" strokeLinecap="round" />

            {/* v and Kv */}
            <line x1={toScreen(0)} y1={toScreen(0)} x2={toScreen(v[0])} y2={toScreen(v[1])} stroke="var(--google-red)" strokeWidth="3" markerEnd="url(#head-v)" strokeLinecap="round" />
            <motion.line animate={{ x2: toScreen(Kv[0]), y2: toScreen(Kv[1]) }} x1={toScreen(0)} y1={toScreen(0)} stroke="var(--google-red)" strokeWidth="3" strokeDasharray="8 4" markerEnd="url(#head-v)" strokeLinecap="round" />

            {showLinearity && (
              <>
                <line x1={toScreen(0)} y1={toScreen(0)} x2={toScreen(uPlusV[0])} y2={toScreen(uPlusV[1])} stroke="var(--google-green)" strokeWidth="3" markerEnd="url(#head-res)" strokeLinecap="round" />
                <motion.line animate={{ x2: toScreen(K_uPlusV[0]), y2: toScreen(K_uPlusV[1]) }} x1={toScreen(0)} y1={toScreen(0)} stroke="var(--google-green)" strokeWidth="3" strokeDasharray="8 4" markerEnd="url(#head-res)" strokeLinecap="round" />
              </>
            )}

            {/* Interactive Handles */}
            <circle cx={toScreen(u[0])} cy={toScreen(u[1])} r={14} fill="rgba(66, 133, 244, 0.1)" stroke="var(--google-blue)" strokeWidth="2" strokeDasharray="4 2" style={{ cursor: 'grab' }} onMouseDown={() => setActiveDrag('u')} />
            <circle cx={toScreen(v[0])} cy={toScreen(v[1])} r={14} fill="rgba(234, 67, 53, 0.1)" stroke="var(--google-red)" strokeWidth="2" strokeDasharray="4 2" style={{ cursor: 'grab' }} onMouseDown={() => setActiveDrag('v')} />

            {/* Labels */}
            <text x={toScreen(u[0])} y={toScreen(u[1]) - 20} textAnchor="middle" fontSize="16" fontWeight="900" fill="var(--google-blue)" fontFamily="var(--font-mono)">u</text>
            <text x={toScreen(v[0])} y={toScreen(v[1]) - 20} textAnchor="middle" fontSize="16" fontWeight="900" fill="var(--google-red)" fontFamily="var(--font-mono)">v</text>
          </svg>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
              <div style={{ width: 20, height: 2, background: '#202124' }} /> Original
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
              <div style={{ width: 20, height: 2, background: '#202124', borderBottom: '2px dashed #202124' }} /> Transformed
            </div>
          </div>
        </div>

        {/* Info & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#202124', letterSpacing: '-0.02em' }}>Geometric Intuition</h3>
            <p style={{ color: '#5F6368', marginTop: '0.75rem', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Drag the vectors on the grid to observe how the matrix <InlineMath math="K" /> transforms them in real-time. 
              The <strong>solid lines</strong> are your inputs, while 
              <strong> dashed lines</strong> represent the output (Ciphertext) wrapped within the modulo-26 coordinate space.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '24px', border: '2px solid #000000', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Live Vector Results</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--google-blue)' }}>K u (mod 26) =</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.25rem' }}><InlineMath math={`(${Ku[0]}, ${Ku[1]})`} /></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--google-red)' }}>K v (mod 26) =</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.25rem' }}><InlineMath math={`(${Kv[0]}, ${Kv[1]})`} /></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', background: '#FFFFFF', padding: '1.5rem', borderRadius: '24px', border: '2px solid #000000', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
              <input type="checkbox" checked={showLinearity} onChange={e => setShowLinearity(e.target.checked)} style={{ width: 24, height: 24, accentColor: 'var(--google-green)' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Linearity Visualization</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Verify <InlineMath math="K(u+v) \equiv Ku + Kv \pmod{26}" />
                </div>
              </div>
            </label>

            <AnimatePresence>
              {showLinearity && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '1.5rem', background: '#E6F4EA', borderRadius: '20px', border: '2px solid #34A853', boxShadow: '0 8px 24px rgba(52,168,83,0.1)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#137333', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linearity Proof (mod 26)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '1rem', color: '#137333', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Sum <InlineMath math="u+v" />:</span>
                        <span style={{ fontWeight: 800 }}><InlineMath math={`(${uPlusV[0]}, ${uPlusV[1]})`} /></span>
                      </div>
                      <div style={{ height: '1px', background: 'rgba(52,168,83,0.2)', margin: '4px 0' }} />
                      <div style={{ fontSize: '1.1rem', color: '#137333', fontWeight: 900, display: 'flex', justifyContent: 'space-between' }}>
                        <span><InlineMath math="K(u+v)" /> Result:</span>
                        <span><InlineMath math={`(${K_uPlusV[0]}, ${K_uPlusV[1]})`} /></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ background: '#E8F0FE', padding: '2rem', borderRadius: '24px', border: '1px solid var(--google-blue)', color: '#1967D2', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '4rem', opacity: 0.1 }}>💡</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Block Cipher Logic</div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
              Because Hill Cipher treats groups of letters as vectors, the key matrix "skews" the entire alphabet space. 
              This polygraphic transformation ensures that the relationship between letters is completely obscured through linear geometry.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
