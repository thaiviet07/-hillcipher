/**
 * AttackDemo — High-fidelity interactive known-plaintext attack walkthrough
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath } from 'react-katex';

const TERMINAL_GREEN = '#34A853';

export const AttackDemo: React.FC = () => {
  const [step, setStep] = useState(0);

  const STEPS = [
    {
      title: 'Scenario: Intercepted Communications',
      icon: '📡',
      color: 'var(--google-blue)',
    },
    {
      title: 'Phase 1: Vector Extraction',
      icon: '🔍',
      color: 'var(--google-yellow)',
    },
    {
      title: 'Phase 2: Matrix Solving',
      icon: '⚙️',
      color: '#EA4335',
    },
    {
      title: 'Phase 3: Key Recovery & Breach',
      icon: '🔓',
      color: TERMINAL_GREEN,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 900, margin: '0 auto' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Known-Plaintext Attack (KPA)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Demonstrating how the Hill Cipher's linearity leads to total compromise.
          </p>
        </div>
        <div style={{ padding: '8px 16px', background: '#F1F3F4', borderRadius: '24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', border: '1px solid #DADCE0' }}>
          LEVEL: CRITICAL VULNERABILITY
        </div>
      </div>

      {/* Progress Stepper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 1rem' }}>
        <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '2px', background: '#E8EAED', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '20px', left: '10%', width: `${(step / (STEPS.length - 1)) * 80}%`, height: '2px', background: 'var(--google-blue)', zIndex: 0, transition: 'width 0.3s' }} />
        
        {STEPS.map((s, i) => (
          <div key={i} style={{ zIndex: 1, textAlign: 'center', cursor: 'pointer' }} onClick={() => setStep(i)}>
            <div style={{ 
              width: 40, height: 40, borderRadius: '50%', background: step >= i ? (step === i ? s.color : 'var(--google-blue)') : '#FFFFFF', 
              border: `2px solid ${step >= i ? 'transparent' : '#DADCE0'}`, color: step >= i ? '#FFFFFF' : '#DADCE0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', transition: 'all 0.3s'
            }}>
              {step > i ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, marginTop: '8px', color: step === i ? s.color : 'var(--text-muted)', textTransform: 'uppercase' }}>
              {s.title.split(':')[0]}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ 
            background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(60,64,67,0.08), 0 1px 2px rgba(60,64,67,0.15)',
            minHeight: 450, display: 'flex', flexDirection: 'column'
          }}
        >
          {/* Card Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #F1F3F4', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{STEPS[step].icon}</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#202124' }}>{STEPS[step].title}</h2>
          </div>

          {/* Card Body */}
          <div style={{ padding: '2rem', flex: 1 }}>
            
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.125rem' }}>
                  An attacker intercepts an encrypted message (Ciphertext). They also manage to figure out what the first few words are (Plaintext). 
                </p>
                <div style={{ background: '#202124', padding: '1.5rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', color: '#FFFFFF', position: 'relative' }}>
                  <div style={{ fontSize: '0.65rem', color: '#80868B', marginBottom: '8px', textTransform: 'uppercase' }}>Intercepted Stream</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ color: TERMINAL_GREEN }}>[RECV] 10:42:01 {" >> "} HQXK... (ENCRYPTED)</div>
                    <div style={{ color: '#FBBC05' }}>[INTEL] Known Start: "HELP"</div>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, background: '#EA4335', borderRadius: '50%' }} />
                </div>
                <div style={{ padding: '1rem', background: '#E8F0FE', borderRadius: '8px', borderLeft: '4px solid var(--google-blue)', color: '#1967D2', fontSize: '0.875rem' }}>
                  <strong>Goal:</strong> Find the secret key matrix $K$ that transformed "HELP" into "HQXK".
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  We convert the known pairs into matrices. For a $2 \times 2$ cipher, we need at least 2 blocks (4 letters).
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--google-blue)', marginBottom: '1rem' }}>PLAINTEXT "HELP"</div>
                    <div style={{ background: '#F8F9FA', padding: '1rem', borderRadius: '8px', border: '1px solid #DADCE0' }}>
                      <BlockMath math={String.raw`P = \begin{bmatrix} 7 & 11 \\ 4 & 15 \end{bmatrix}`} />
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px' }}>H=7, E=4 | L=11, P=15</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EA4335', marginBottom: '1rem' }}>CIPHERTEXT "HQXK"</div>
                    <div style={{ background: '#F8F9FA', padding: '1rem', borderRadius: '8px', border: '1px solid #DADCE0' }}>
                      <BlockMath math={String.raw`C = \begin{bmatrix} 7 & 23 \\ 16 & 10 \end{bmatrix}`} />
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px' }}>H=7, Q=16 | X=23, K=10</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Because matrix multiplication is a linear transformation, the relationship is simply $C = K \cdot P$. Using basic algebra, we solve for $K$:
                </p>
                <div style={{ background: '#F8F9FA', padding: '2rem', borderRadius: '8px', border: '1px solid #DADCE0', textAlign: 'center' }}>
                  <BlockMath math={String.raw`K = C \cdot P^{-1} \pmod{26}`} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.875rem', display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}>
                    <span>1.</span> <span>Find $P^{-1}$ mod 26 (using the Adjugate method).</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}>
                    <span>2.</span> <span>Multiply $C$ by $P^{-1}$.</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}>
                    <span>3.</span> <span>Reduce the result modulo 26.</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center', padding: '2rem', background: '#E6F4EA', border: '2px solid #34A853', borderRadius: '12px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1E8E3E', marginBottom: '1rem' }}>SECRET KEY RECOVERED</div>
                  <BlockMath math={String.raw`K = \begin{bmatrix} 3 & 3 \\ 2 & 5 \end{bmatrix}`} />
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  The attacker has now compromised the entire communication system. They can decrypt all future messages instantly. 
                </p>
                <div style={{ borderTop: '1px solid #F1F3F4', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#202124', marginBottom: '1rem' }}>Modern Security Comparisons</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                      { name: 'Hill Cipher', status: 'Insecure', desc: 'Linear, vulnerable to KPA', color: '#EA4335' },
                      { name: 'AES-256', status: 'Secure', desc: 'Non-linear layers, KPA resistant', color: '#34A853' },
                      { name: 'RSA', status: 'Secure', desc: 'Asymmetric, factoring difficulty', color: '#4285F4' },
                    ].map(alg => (
                      <div key={alg.name} style={{ padding: '0.75rem', background: '#F8F9FA', borderRadius: '4px', borderTop: `3px solid ${alg.color}` }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{alg.name}</div>
                        <div style={{ fontSize: '0.6rem', color: alg.color, fontWeight: 700 }}>{alg.status}</div>
                        <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '4px' }}>{alg.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid #F1F3F4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              disabled={step === 0} 
              onClick={() => setStep(s => s - 1)}
              style={{ padding: '10px 24px', borderRadius: '4px', border: '1px solid #DADCE0', background: '#FFFFFF', fontWeight: 500, cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.5 : 1 }}
            >
              Back
            </button>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Step {step + 1} of {STEPS.length}
            </div>
            <button 
              disabled={step === STEPS.length - 1} 
              onClick={() => setStep(s => s + 1)}
              style={{ padding: '10px 32px', borderRadius: '4px', border: 'none', background: 'var(--google-blue)', color: '#FFFFFF', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer', opacity: step === STEPS.length - 1 ? 0.5 : 1, boxShadow: step === STEPS.length - 1 ? 'none' : '0 1px 2px rgba(66,133,244,0.3)' }}
            >
              {step === STEPS.length - 1 ? 'Complete' : 'Next Phase'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
