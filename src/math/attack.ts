/**
 * Hill Cipher Attack Logic — Known-Plaintext Attack (KPA)
 * Given C = K * P mod 26, then K = C * P^-1 mod 26
 */
import { mod, gcd, modInverse } from './modular';
import { getDeterminant, getInverseMod26, multiplyMatricesMod26, getAdjugate } from './matrix';

export interface KPAResult {
  key: number[][] | null;
  P: number[][];
  C: number[][];
  detP: number;
  detPMod26: number;
  gcdValue: number;
  detInverseP: number | null;
  adjP: number[][];
  inverseP: number[][] | null;
  error?: string;
}

/**
 * Solve for the Key Matrix K given two pairs of (Plaintext, Ciphertext).
 * Each pair is a 2D vector (for 2x2 matrix).
 */
export function solveKey2x2(
  p1: number[], c1: number[], 
  p2: number[], c2: number[]
): KPAResult {
  // Construct P and C matrices (vectors as columns)
  const P = [
    [p1[0], p2[0]],
    [p1[1], p2[1]]
  ];
  
  const C = [
    [c1[0], c2[0]],
    [c1[1], c2[1]]
  ];

  const det = getDeterminant(P);
  const detMod = mod(det, 26);
  const g = gcd(detMod, 26);
  const detInv = g === 1 ? modInverse(detMod, 26) : null;
  const adj = getAdjugate(P);
  const inverseP = getInverseMod26(P);
  
  let key = null;
  let error = undefined;

  if (!inverseP) {
    error = "Matrix P is not invertible mod 26 (gcd(det, 26) != 1). Try different plaintext pairs.";
  } else {
    key = multiplyMatricesMod26(C, inverseP);
  }

  return {
    key,
    P,
    C,
    detP: det,
    detPMod26: detMod,
    gcdValue: g,
    detInverseP: detInv,
    adjP: adj,
    inverseP,
    error
  };
}
