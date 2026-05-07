/**
 * Cryptanalysis Math Helpers — Frequency, Entropy, and Key Space
 */

/** Calculate monogram frequency from a string (A-Z only) */
export function getMonogramFrequency(text: string): Record<string, number> {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  const counts: Record<string, number> = {};
  for (const char of clean) {
    counts[char] = (counts[char] || 0) + 1;
  }
  const freq: Record<string, number> = {};
  for (const char of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    freq[char] = (counts[char] || 0) / (clean.length || 1);
  }
  return freq;
}

/** Calculate digram frequency (pairs of characters) */
export function getDigramFrequency(text: string): Record<string, number> {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  const counts: Record<string, number> = {};
  for (let i = 0; i < clean.length - 1; i += 2) {
    const pair = clean[i] + clean[i + 1];
    counts[pair] = (counts[pair] || 0) + 1;
  }
  const total = (clean.length / 2) || 1;
  const freq: Record<string, number> = {};
  for (const pair in counts) {
    freq[pair] = counts[pair] / total;
  }
  return freq;
}

/** Calculate Shannon Entropy: H(X) = -sum p(x) * log2(p(x)) */
export function calculateEntropy(text: string): number {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length === 0) return 0;
  
  const counts: Record<string, number> = {};
  for (const char of clean) {
    counts[char] = (counts[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (const char in counts) {
    const p = counts[char] / clean.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/** 
 * Calculate size of General Linear Group GL(n, Z_26)
 * |GL(n, Z_26)| = |GL(n, Z_2)| * |GL(n, Z_13)|
 * |GL(n, Z_p)| = p^(n^2) * product_{i=0}^{n-1} (1 - p^(i-n))
 */
export function getKeySpaceSize(n: number): number {
  const gl_p = (p: number, dim: number) => {
    let size = Math.pow(p, dim * dim);
    let prod = 1;
    for (let i = 1; i <= dim; i++) {
      prod *= (1 - Math.pow(p, -i));
    }
    return Math.round(size * prod);
  };

  if (n === 2) return gl_p(2, 2) * gl_p(13, 2); // 6 * 2028 = 157248
  if (n === 3) return gl_p(2, 3) * gl_p(13, 3); // 168 * 9750000...
  
  return 0;
}
