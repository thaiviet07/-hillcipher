/**
 * SecurityAnalysis — Interactive KPA Solver with Step-by-Step "Cracker" (PRD §4.4)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { solveKey2x2, KPAResult } from '../../math/attack';
import { MatrixBracket } from '../cipher/MatrixEditor';
import { MatrixCell } from '../ui/MatrixCell';
import { Badge } from '../ui/Badge';
import { CryptanalysisDashboard } from './CryptanalysisDashboard';

export const SecurityAnalysis: React.FC = () => {
  const [p1, setP1] = useState(['H', 'E']);
  const [c1, setC1] = useState(['I', 'F']);
  const [p2, setP2] = useState(['L', 'P']);
  const [c2, setC2] = useState(['W', 'Z']);
  
  const [crackStep, setCrackStep] = useState(0); // 0: idle, 1: setup, 2: det, 3: inv, 4: final
  const [crackResult, setCrackResult] = useState<KPAResult | null>(null);

  const charToNum = (c: string) => c.toUpperCase().charCodeAt(0) - 65;

  const handleStartCrack = () => {
    const p1_v = p1.map(charToNum);
    const c1_v = c1.map(charToNum);
    const p2_v = p2.map(charToNum);
    const c2_v = c2.map(charToNum);
    
    const res = solveKey2x2(p1_v, c1_v, p2_v, c2_v);
    setCrackResult(res);
    setCrackStep(1);
  };

  const nextStep = () => setCrackStep(s => Math.min(4, s + 1));
  const prevStep = () => setCrackStep(s => Math.max(1, s - 1));
  const resetCrack = () => { setCrackStep(0); setCrackResult(null); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* 1. Interactive Step-by-Step Cracker */}
      <section style={{ background: '#FFFFFF', borderRadius: '32px', border: '2px solid #000000', padding: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <Badge variant="warning">EXPLOIT SIMULATION</Badge>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>Known-Plaintext Cracker</h2>
          <p style={{ color: '#5F6368', marginTop: '0.75rem', fontSize: '1.2rem', maxWidth: '800px' }}>
            Linearity is the Hill Cipher's fatal flaw. Watch how an attacker recovers your key matrix from just two character pairs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '4rem' }}>
          
          {/* Left: Input Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[1, 2].map(i => (
              <div key={i} style={{ padding: '1.5rem', background: '#F8F9FA', borderRadius: '24px', border: '1px solid #DADCE0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--google-blue)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Pair #{i}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(i === 1 ? p1 : p2).map((c, idx) => (
                      <input key={idx} maxLength={1} value={c} 
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          if (i === 1) { const n = [...p1]; n[idx] = val; setP1(n); }
                          else { const n = [...p2]; n[idx] = val; setP2(n); }
                          setCrackStep(0);
                        }} 
                        style={{ width: 44, height: 44, textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, borderRadius: '12px', border: '2px solid #DADCE0' }} 
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#BDC1C6' }}>→</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(i === 1 ? c1 : c2).map((c, idx) => (
                      <input key={idx} maxLength={1} value={c} 
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          if (i === 1) { const n = [...c1]; n[idx] = val; setC1(n); }
                          else { const n = [...c2]; n[idx] = val; setC2(n); }
                          setCrackStep(0);
                        }} 
                        style={{ width: 44, height: 44, textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, borderRadius: '12px', border: '2px solid #DADCE0' }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {crackStep === 0 ? (
              <button onClick={handleStartCrack} style={{ padding: '20px', borderRadius: '16px', background: 'var(--google-red)', color: '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(217, 48, 37, 0.3)' }}>
                🚀 INITIALIZE ATTACK
              </button>
            ) : (
              <button onClick={resetCrack} style={{ padding: '16px', borderRadius: '16px', background: '#F1F3F4', color: '#3C4043', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                ↺ Reset Simulation
              </button>
            )}
          </div>

          {/* Right: Walkthrough Area */}
          <div style={{ minHeight: '450px', background: '#FBFBFC', borderRadius: '32px', border: '2px dashed #DADCE0', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {crackStep === 0 && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#BDC1C6' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
                  <div style={{ fontWeight: 600 }}>System Idle. Waiting for input pairs...</div>
                </motion.div>
              )}

              {crackStep === 1 && crackResult && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <Badge variant="info">STEP 1: MATRIX FORMATION</Badge>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>Arrange Pairs into Matrices</h4>
                    <p style={{ color: '#5F6368', marginTop: '0.5rem' }}>We place the numerical vectors into columns to form our Plaintext (P) and Ciphertext (C) matrices.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem' }}>PLAINTEXT P</div>
                      <MatrixBracket size={2}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 50px)', gap: '10px' }}>{crackResult.P.map((r, ri) => r.map((v, ci) => <MatrixCell key={`${ri}-${ci}`} value={v} row={ri} col={ci} readOnly />))}</div></MatrixBracket>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem' }}>CIPHERTEXT C</div>
                      <MatrixBracket size={2}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 50px)', gap: '10px' }}>{crackResult.C.map((r, ri) => r.map((v, ci) => <MatrixCell key={`${ri}-${ci}`} value={v} row={ri} col={ci} readOnly />))}</div></MatrixBracket>
                    </div>
                  </div>
                </motion.div>
              )}

              {crackStep === 2 && crackResult && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <Badge variant="info">STEP 2: INVERTIBILITY CHECK</Badge>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>Verify Determinant of P</h4>
                    <p style={{ color: '#5F6368', marginTop: '0.5rem' }}>For the attack to work, P must have a modular inverse. We check the GCD of its determinant.</p>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '24px', border: '1px solid #DADCE0', textAlign: 'center' }}>
                    <BlockMath math={`\\det(P) = ${crackResult.detP} \\equiv ${crackResult.detPMod26} \\pmod{26}`} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: crackResult.gcdValue === 1 ? 'var(--google-green)' : 'var(--google-red)', marginTop: '1rem' }}>
                      <InlineMath math={`\\gcd(${crackResult.detPMod26}, 26) = ${crackResult.gcdValue}`} />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#5F6368', marginTop: '0.5rem' }}>
                      {crackResult.gcdValue === 1 ? '✓ Matrix is invertible' : '✕ Pairs are linearly dependent'}
                    </div>
                  </div>
                </motion.div>
              )}

              {crackStep === 3 && crackResult && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <Badge variant="info">STEP 3: CALCULATE P⁻¹</Badge>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>Invert the Plaintext Matrix</h4>
                    <p style={{ color: '#5F6368', marginTop: '0.5rem' }}>We find the modular multiplicative inverse of P using its determinant inverse and adjugate.</p>
                  </div>
                  {crackResult.inverseP ? (
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem' }}>{crackResult.detInverseP} · adj(P) = </div>
                      <MatrixBracket size={2}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 50px)', gap: '10px' }}>{crackResult.inverseP.map((r, ri) => r.map((v, ci) => <MatrixCell key={`${ri}-${ci}`} value={v} row={ri} col={ci} readOnly />))}</div></MatrixBracket>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--google-red)', fontWeight: 800, textAlign: 'center' }}>ERROR: INVERSION FAILED</div>
                  )}
                </motion.div>
              )}

              {crackStep === 4 && crackResult && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Badge variant="valid">SUCCESS: KEY RECOVERED</Badge>
                    <h4 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.5rem', color: 'var(--google-green)' }}>Matrix K Isolated</h4>
                    <p style={{ color: '#5F6368', marginTop: '0.5rem' }}>By multiplying the Ciphertext matrix by the inverse of Plaintext, the secret key is revealed.</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem', color: '#1E8E3E' }}>
                      <BlockMath math="K = C \cdot P^{-1} \pmod{26}" />
                    </div>
                    {crackResult.key && (
                      <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem' }}>RECOVERED KEY K</div>
                          <MatrixBracket size={2}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 60px)', gap: '12px' }}>{crackResult.key.map((r: number[], ri: number) => r.map((v: number, ci: number) => <MatrixCell key={`${ri}-${ci}`} value={v} row={ri} col={ci} readOnly />))}</div></MatrixBracket>
                        </div>
                        <div style={{ fontSize: '1.5rem', color: '#BDC1C6' }}>→</div>
                        <div style={{ textAlign: 'center', background: '#F8F9FA', padding: '1.5rem', borderRadius: '16px', border: '1px solid #DADCE0' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem', color: '#BDC1C6' }}>PROOF</div>
                          <div style={{ fontWeight: 800, color: '#137333' }}>
                            <InlineMath math={`K \\begin{bmatrix}p_{1,1}\\\\p_{2,1}\\end{bmatrix} = \\begin{bmatrix}${c1[0]}\\\\${c1[1]}\\end{bmatrix}`} />
                          </div>
                          <div style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--google-green)' }}>MATCH CONFIRMED ✓</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ background: '#E6F4EA', padding: '1.5rem', borderRadius: '16px', border: '1px solid #34A853', color: '#137333', fontSize: '0.9rem', width: '100%' }}>
                    <strong>Conclusion:</strong> The attacker now has your key. This is why you should <strong>never reuse a key matrix</strong> for multiple long messages.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Buttons */}
            {crackStep > 0 && crackResult && (
              <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={prevStep} disabled={crackStep === 1} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #DADCE0', background: '#FFFFFF', fontWeight: 700, cursor: 'pointer', opacity: crackStep === 1 ? 0.3 : 1 }}>Back</button>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '4px', background: i === crackStep ? 'var(--google-blue)' : (i < crackStep ? 'var(--google-green)' : '#DADCE0'), transition: 'all 0.3s' }} />)}
                </div>
                <button onClick={nextStep} disabled={crackStep === 4 || (crackStep === 2 && crackResult.gcdValue !== 1)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'var(--google-blue)', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer', opacity: (crackStep === 4 || (crackStep === 2 && crackResult.gcdValue !== 1)) ? 0.3 : 1 }}>
                  {crackStep === 4 ? 'Crack Complete' : 'Next Step →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Security Comparison Module */}
      <section style={{ background: '#FFFFFF', borderRadius: '32px', border: '1px solid #DADCE0', padding: '3rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Badge variant="info">COMPARATIVE ANALYSIS</Badge>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>Security Comparison: Hill vs. Others</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F9FA' }}>
                <th style={{ padding: '20px', textAlign: 'left', borderBottom: '2px solid #DADCE0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Feature</th>
                <th style={{ padding: '20px', textAlign: 'left', borderBottom: '2px solid #DADCE0', color: 'var(--google-red)' }}>Simple Substitution</th>
                <th style={{ padding: '20px', textAlign: 'left', borderBottom: '2px solid #DADCE0', color: 'var(--google-blue)' }}>Hill Cipher (n=2)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4', fontWeight: 800 }}>Frequency Analysis</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4', color: '#C5221F', fontWeight: 600 }}>Highly Vulnerable</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4', color: '#1E8E3E', fontWeight: 600 }}>Resistant (Polygraphic)</td>
              </tr>
              <tr>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4', fontWeight: 800 }}>Character Mapping</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4' }}>1-to-1 (Fixed)</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4' }}>n-to-n (Block-based)</td>
              </tr>
              <tr>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4', fontWeight: 800 }}>Primary Weakness</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4' }}>Statistical Patterns</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4', color: 'var(--google-red)', fontWeight: 700 }}>Linearity</td>
              </tr>
              <tr>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4', fontWeight: 800 }}>Vulnerability</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4' }}>Ciphertext-Only</td>
                <td style={{ padding: '20px', borderBottom: '1px solid #F1F3F4' }}>Known-Plaintext</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Live Cryptanalysis Dashboard */}
      <section>
        <div style={{ marginBottom: '2rem' }}>
          <Badge variant="info">LIVE ANALYTICS</Badge>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>Cryptographic Strength Dashboard</h2>
          <p style={{ color: '#5F6368', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Real-time evaluation of the current ciphertext's resistance to statistical and brute-force attacks.
          </p>
        </div>
        <CryptanalysisDashboard />
      </section>

    </div>
  );
};
