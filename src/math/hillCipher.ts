/**
 * Hill Cipher — Encrypt / Decrypt / Validate / Attack
 *
 * High-level cipher operations built on top of modular.ts and matrix.ts.
 * Pure functions only — no UI state or side-effects.
 */

import { mod, gcd } from './modular';
import { getDeterminant, getInverseMod26, multiplyMatrixVectorMod26 } from './matrix';
import type { StepDetail, TransformResult } from './types';

// ─── Alphabet helpers ───────────────────────────────────────────────

function letterToNum(ch: string): number {
  return ch.charCodeAt(0) - 65; // A=0 … Z=25
}

function numToLetter(n: number): string {
  return String.fromCharCode(65 + mod(n, 26));
}

// ─── Input sanitisation ─────────────────────────────────────────────

/**
 * Sanitise user input for the Hill Cipher:
 *   1. Convert to uppercase
 *   2. Strip everything that isn't A-Z
 *   3. Pad with 'X' (=23) so length is a multiple of blockSize
 */
export function sanitizeInput(text: string, blockSize: number): string {
  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleaned.length === 0) return '';

  const remainder = cleaned.length % blockSize;
  if (remainder === 0) return cleaned;

  return cleaned + 'X'.repeat(blockSize - remainder);
}

// ─── Key validation ─────────────────────────────────────────────────

/**
 * Check whether a matrix is a valid Hill Cipher key (mod 26).
 * Condition: gcd(det(K) mod 26, 26) === 1
 */
export function isValidKey(matrix: number[][]): boolean {
  const det = getDeterminant(matrix);
  const detMod = mod(det, 26);
  return gcd(detMod, 26) === 1;
}

// ─── Core transform (encrypt or decrypt) ────────────────────────────

/**
 * Run the Hill Cipher transform on a sanitised text string.
 *
 * This function is used for *both* encryption and decryption:
 *   - Encrypt: pass the key matrix K
 *   - Decrypt: pass K⁻¹ (mod 26) as the matrix
 *
 * Returns the result string and a detailed step trace for the UI.
 */
export function transform(
  text: string,
  matrix: number[][],
): TransformResult {
  const n = matrix.length;

  if (text.length === 0) {
    return { result: '', steps: [] };
  }

  const numbers = Array.from(text).map(letterToNum);
  const steps: StepDetail[] = [];
  let resultStr = '';

  for (let i = 0; i < numbers.length; i += n) {
    const blockIndex = i / n;
    const vector = numbers.slice(i, i + n);
    const plainText = vector.map(numToLetter).join('');

    const { result, steps: calcSteps } = multiplyMatrixVectorMod26(matrix, vector);

    const cipherText = result.map(numToLetter).join('');
    resultStr += cipherText;

    // Build the KaTeX-formatted operation strings
    const operations = calcSteps.map((cs) => {
      const terms = cs.rowCoefficients.map(
        (coeff, idx) => `${coeff} \\times ${cs.vectorEntries[idx]}`,
      );
      return {
        equation: terms.join(' + '),
        sum: cs.rowSum,
        modResult: cs.modResult,
      };
    });

    steps.push({
      blockIndex,
      plainText,
      plainVector: [...vector],
      cipherVector: [...result],
      cipherText,
      operations,
    });
  }

  return { result: resultStr, steps };
}

// ─── High-level encrypt / decrypt ───────────────────────────────────

/**
 * Encrypt a raw plaintext message with key matrix K.
 * Sanitises input automatically.
 */
export function encrypt(
  plaintext: string,
  matrix: number[][],
): TransformResult {
  const sanitized = sanitizeInput(plaintext, matrix.length);
  return transform(sanitized, matrix);
}

/**
 * Decrypt a ciphertext message with key matrix K.
 * Computes K⁻¹ (mod 26) internally.
 * Returns null if the key is not invertible.
 */
export function decrypt(
  ciphertext: string,
  matrix: number[][],
): TransformResult | null {
  const inverse = getInverseMod26(matrix);
  if (!inverse) return null;

  const sanitized = sanitizeInput(ciphertext, matrix.length);
  return transform(sanitized, inverse);
}

// ─── Known-Plaintext Attack ─────────────────────────────────────────

/**
 * Recover the key matrix K given a known plaintext-ciphertext pair.
 *
 * For an n×n cipher, requires exactly n blocks of known correspondence.
 *
 * Algorithm:
 *   P_mat = [p₁ | p₂ | … | pₙ]   (plaintext column vectors → n×n matrix)
 *   C_mat = [c₁ | c₂ | … | cₙ]   (ciphertext column vectors → n×n matrix)
 *   K = C_mat · P_mat⁻¹  (mod 26)
 *
 * Returns null if P_mat is not invertible mod 26.
 */
export function knownPlaintextAttack(
  knownPlain: string,
  knownCipher: string,
  blockSize: number,
): number[][] | null {
  const pNums = Array.from(knownPlain.toUpperCase().replace(/[^A-Z]/g, '')).map(letterToNum);
  const cNums = Array.from(knownCipher.toUpperCase().replace(/[^A-Z]/g, '')).map(letterToNum);

  const n = blockSize;

  // Need exactly n blocks (n² characters) for an n×n key recovery
  if (pNums.length < n * n || cNums.length < n * n) return null;

  // Build n×n matrices from column vectors
  // P_mat columns are the plaintext block vectors
  const pMat: number[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => pNums[c * n + r]),
  );
  const cMat: number[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => cNums[c * n + r]),
  );

  // K = C_mat · P_mat⁻¹ (mod 26)
  const pInv = getInverseMod26(pMat);
  if (!pInv) return null;

  // Matrix multiplication: C_mat × P_mat⁻¹  (mod 26)
  const K: number[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += cMat[r][k] * pInv[k][c];
      }
      return mod(sum, 26);
    }),
  );

  return K;
}
