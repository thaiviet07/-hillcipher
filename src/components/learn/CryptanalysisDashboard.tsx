/**
 * CryptanalysisDashboard — Frequency Analysis, Key Space, and Entropy (PRD §4.4)
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCipherStore } from '../../store/cipherStore';
import { getMonogramFrequency, calculateEntropy, getKeySpaceSize } from '../../math/cryptanalysis';
import { Badge } from '../ui/Badge';
import { InlineMath } from 'react-katex';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const CryptanalysisDashboard: React.FC = () => {
  const { message, output, matrixSize } = useCipherStore();

  const plainFreq = useMemo(() => getMonogramFrequency(message || 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG'), [message]);
  const cipherFreq = useMemo(() => getMonogramFrequency(output || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), [output]);
  
  // Simulate Caesar (Shifted plaintext freq)
  const caesarFreq = useMemo(() => {
    const shifted: Record<string, number> = {};
    ALPHABET.forEach((char, i) => {
      shifted[char] = plainFreq[ALPHABET[(i + 3) % 26]];
    });
    return shifted;
  }, [plainFreq]);

  const plainEntropy = useMemo(() => calculateEntropy(message), [message]);
  const cipherEntropy = useMemo(() => calculateEntropy(output), [output]);
  const keySpace = useMemo(() => getKeySpaceSize(matrixSize), [matrixSize]);

  const maxFreq = Math.max(...Object.values(plainFreq), ...Object.values(cipherFreq), 0.1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* 1. Frequency Analysis Chart */}
      <section style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #DADCE0', padding: '2.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Badge variant="info">STATISTICAL ATTACK</Badge>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>Frequency Distribution</h3>
          <p style={{ color: '#5F6368', marginTop: '0.5rem' }}>
            Observe how the Hill Cipher flattens the character distribution compared to simple substitution ciphers.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Chart Legend */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
              <div style={{ width: 12, height: 12, background: '#DADCE0', borderRadius: '2px' }} /> Plaintext
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
              <div style={{ width: 12, height: 12, background: 'var(--google-blue)', borderRadius: '2px' }} /> Hill Cipher
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
              <div style={{ width: 12, height: 12, background: 'var(--google-red)', borderRadius: '2px', opacity: 0.5 }} /> Caesar (Shift)
            </div>
          </div>

          {/* Custom Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '4px', borderBottom: '2px solid #DADCE0', paddingBottom: '8px' }}>
            {ALPHABET.map(char => (
              <div key={char} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '1px', alignItems: 'flex-end', width: '100%', height: '100%' }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(plainFreq[char] / maxFreq) * 100}%` }} style={{ flex: 1, background: '#DADCE0', minWidth: '4px' }} />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(cipherFreq[char] / maxFreq) * 100}%` }} style={{ flex: 1, background: 'var(--google-blue)', minWidth: '4px' }} />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(caesarFreq[char] / maxFreq) * 100}%` }} style={{ flex: 1, background: 'var(--google-red)', opacity: 0.3, minWidth: '4px' }} />
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, marginTop: '4px' }}>{char}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', background: '#F8F9FA', padding: '1.25rem', borderRadius: '12px', fontSize: '0.9rem', color: '#5F6368', borderLeft: '4px solid var(--google-blue)' }}>
          <strong>Insight:</strong> In a Caesar cipher, the "shape" of the language is preserved but shifted. The Hill Cipher spreads the frequency of each letter across a block, creating a much flatter profile that resists monogram frequency analysis.
        </div>
      </section>

      {/* 2. Key Space & Complexity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <section style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #DADCE0', padding: '2rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Brute-Force Complexity</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#202124' }}>
            {keySpace.toLocaleString()}
          </div>
          <div style={{ color: 'var(--google-green)', fontWeight: 800, fontSize: '0.8rem', marginTop: '4px' }}>VALID {matrixSize}x{matrixSize} MATRICES IN Z₂₆</div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#5F6368', lineHeight: 1.6 }}>
            The total number of keys is determined by the size of the <strong>General Linear Group</strong> <InlineMath math="GL(n, \mathbb{Z}_{26})" />. 
            Unlike substitution ciphers with <InlineMath math="26!" /> keys, Hill Cipher's key space is much smaller but mathematically structured.
          </p>
        </section>

        <section style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #DADCE0', padding: '2rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Entropy Analysis</h4>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>{cipherEntropy.toFixed(3)}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>CIPHERTEXT ENTROPY</div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid #DADCE0', paddingLeft: '1.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#DADCE0' }}>{plainEntropy.toFixed(3)}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#BDC1C6' }}>PLAINTEXT ENTROPY</div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', height: '8px', background: '#F1F3F4', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(cipherEntropy / 4.7) * 100}%` }} style={{ height: '100%', background: 'var(--google-blue)' }} />
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#5F6368' }}>
            Ideal random text in a 26-letter alphabet has an entropy of <InlineMath math="\approx 4.7" /> bits/char. Higher entropy indicates better confusion.
          </p>
        </section>
      </div>

    </div>
  );
};
