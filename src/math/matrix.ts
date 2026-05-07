/**
 * Matrix Operations for Hill Cipher
 *
 * Pure functions for determinant, adjugate, inverse (mod 26),
 * and matrix-vector multiplication.  Supports 2×2 and 3×3 matrices.
 */

import { mod, gcd, modInverse } from './modular';
import type { CalculationStep, MultiplyResult } from './types';

// ─── Helpers ────────────────────────────────────────────────────────

/** Convert a number to its corresponding uppercase letter (0→A, 25→Z). */
function numToLetter(n: number): string {
  return String.fromCharCode(65 + n);
}

// ─── Determinant ────────────────────────────────────────────────────

/**
 * Compute the determinant of a square matrix (2×2 or 3×3).
 * Uses the standard formulas — cofactor expansion along the first row for 3×3.
 */
export function getDeterminant(matrix: number[][]): number {
  const n = matrix.length;

  if (n === 2) {
    // ad - bc
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  if (n === 3) {
    const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
    // a(ei − fh) − b(di − fg) + c(dh − eg)
    return (
      a * (e * i - f * h) -
      b * (d * i - f * g) +
      c * (d * h - e * g)
    );
  }

  throw new Error(`Unsupported matrix size: ${n}×${n}`);
}

// ─── Adjugate ───────────────────────────────────────────────────────

/**
 * Compute the adjugate (classical adjoint) of a 2×2 or 3×3 matrix.
 * adjugate = transpose of the cofactor matrix.
 *
 * For 2×2: adj([[a,b],[c,d]]) = [[d, -b], [-c, a]]
 * For 3×3: full cofactor computation then transpose.
 */
export function getAdjugate(matrix: number[][]): number[][] {
  const n = matrix.length;

  if (n === 2) {
    const [[a, b], [c, d]] = matrix;
    return [
      [d, -b || 0],
      [-c || 0, a],
    ];
  }

  if (n === 3) {
    const [[a, b, c], [d, e, f], [g, h, i]] = matrix;

    // Cofactor matrix C where C_ij = (-1)^(i+j) * M_ij
    // M_ij = det of 2×2 submatrix obtained by deleting row i, col j
    const cofactors: number[][] = [
      [
        +(e * i - f * h), // C00
        -(d * i - f * g), // C01
        +(d * h - e * g), // C02
      ],
      [
        -(b * i - c * h), // C10
        +(a * i - c * g), // C11
        -(a * h - b * g), // C12
      ],
      [
        +(b * f - c * e), // C20
        -(a * f - c * d), // C21
        +(a * e - b * d), // C22
      ],
    ];

    // Adjugate = transpose of cofactors
    return [
      [cofactors[0][0], cofactors[1][0], cofactors[2][0]],
      [cofactors[0][1], cofactors[1][1], cofactors[2][1]],
      [cofactors[0][2], cofactors[1][2], cofactors[2][2]],
    ];
  }

  throw new Error(`Unsupported matrix size: ${n}×${n}`);
}

// ─── Inverse mod 26 ────────────────────────────────────────────────

/**
 * Compute K⁻¹ mod 26.
 *
 * Algorithm:
 *   1. det(K) mod 26  (positive)
 *   2. Verify gcd(det mod 26, 26) === 1
 *   3. det_inv = modInverse(det mod 26, 26)
 *   4. adj(K)  with every entry reduced mod 26
 *   5. K⁻¹ = (det_inv · adj(K)) mod 26
 *
 * Returns null if the matrix is not invertible mod 26.
 */
export function getInverseMod26(matrix: number[][]): number[][] | null {
  const det = getDeterminant(matrix);
  const detMod = mod(det, 26);

  if (gcd(detMod, 26) !== 1) {
    return null; // not invertible mod 26
  }

  const detInv = modInverse(detMod, 26);
  if (detInv === null) return null;

  const adj = getAdjugate(matrix);
  const n = matrix.length;

  const inverse: number[][] = [];
  for (let r = 0; r < n; r++) {
    const row: number[] = [];
    for (let c = 0; c < n; c++) {
      row.push(mod(detInv * adj[r][c], 26));
    }
    inverse.push(row);
  }

  return inverse;
}

// ─── Matrix × Vector (mod 26) with step trace ──────────────────────

/**
 * Multiply an n×n matrix by an n×1 column vector, reducing mod 26.
 * Returns both the result vector and the full calculation trace
 * (needed for the step-by-step UI panel).
 */
export function multiplyMatrixVectorMod26(
  matrix: number[][],
  vector: number[],
): MultiplyResult {
  const n = matrix.length;
  const result: number[] = [];
  const steps: CalculationStep[] = [];

  for (let r = 0; r < n; r++) {
    const rowCoefficients = matrix[r];
    const products = rowCoefficients.map((k, idx) => k * vector[idx]);
    const rowSum = products.reduce((sum, v) => sum + v, 0);
    const modResult = mod(rowSum, 26);
    const resultLetter = numToLetter(modResult);

    result.push(modResult);
    steps.push({
      rowCoefficients: [...rowCoefficients],
      vectorEntries: [...vector],
      products: [...products],
      rowSum,
      modResult,
      resultLetter,
    });
  }

  return { result, steps };
}

/**
 * Multiply two n×n matrices A and B, reducing each entry mod 26.
 * (A * B)_ij = sum_k (A_ik * B_kj) mod 26
 */
export function multiplyMatricesMod26(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const result: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = mod(sum, 26);
    }
  }

  return result;
}
