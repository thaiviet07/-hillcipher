/**
 * Unit Tests — Matrix Operations (matrix.ts)
 *
 * Tests: getDeterminant, getAdjugate, getInverseMod26, multiplyMatrixVectorMod26
 * Reference: PRD §2.3, §2.4, §9 (test "K⁻¹ computation 2x2")
 */
import { describe, test, expect } from 'vitest';
import {
  getDeterminant,
  getAdjugate,
  getInverseMod26,
  multiplyMatrixVectorMod26,
} from '../matrix';

// ─── getDeterminant() ───────────────────────────────────────────────

describe('getDeterminant()', () => {
  test('2×2 determinant: Classic Hill key', () => {
    // K = [[3,3],[2,5]], det = 3·5 − 3·2 = 15 − 6 = 9
    expect(getDeterminant([[3, 3], [2, 5]])).toBe(9);
  });

  test('2×2 determinant: identity matrix', () => {
    expect(getDeterminant([[1, 0], [0, 1]])).toBe(1);
  });

  test('2×2 determinant: negative result', () => {
    // [[2,4],[6,8]]: det = 16 − 24 = −8
    expect(getDeterminant([[2, 4], [6, 8]])).toBe(-8);
  });

  test('2×2 determinant: singular key [[13,0],[0,2]]', () => {
    // det = 26
    expect(getDeterminant([[13, 0], [0, 2]])).toBe(26);
  });

  test('3×3 determinant: Hill\'s original 1929 key', () => {
    // K = [[6,24,1],[13,16,10],[20,17,15]]
    // det = 6(240−170) − 24(195−200) + 1(221−320)
    //     = 6·70 − 24·(−5) + 1·(−99) = 420 + 120 − 99 = 441
    expect(getDeterminant([[6, 24, 1], [13, 16, 10], [20, 17, 15]])).toBe(441);
  });

  test('3×3 determinant: Simple 3×3 key', () => {
    // [[1,2,3],[0,1,4],[5,6,0]], det = 1(0−24)−2(0−20)+3(0−5) = −24+40−15 = 1
    expect(getDeterminant([[1, 2, 3], [0, 1, 4], [5, 6, 0]])).toBe(1);
  });
});

// ─── getAdjugate() ──────────────────────────────────────────────────

describe('getAdjugate()', () => {
  test('2×2 adjugate of Classic Hill key', () => {
    // adj([[3,3],[2,5]]) = [[5,-3],[-2,3]]
    expect(getAdjugate([[3, 3], [2, 5]])).toEqual([
      [5, -3],
      [-2, 3],
    ]);
  });

  test('2×2 adjugate of identity', () => {
    expect(getAdjugate([[1, 0], [0, 1]])).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
});

// ─── getInverseMod26() ──────────────────────────────────────────────

describe('getInverseMod26()', () => {
  test('PRD §9: K⁻¹ computation for Classic Hill 2×2', () => {
    // K = [[3,3],[2,5]]
    // det = 9, 9⁻¹ mod 26 = 3
    // adj = [[5,-3],[-2,3]] → mod 26 → [[5,23],[24,3]]
    // K⁻¹ = 3 × [[5,23],[24,3]] mod 26 = [[15,69 mod 26],[72 mod 26, 9]]
    //      = [[15,17],[20,9]]
    expect(getInverseMod26([[3, 3], [2, 5]])).toEqual([
      [15, 17],
      [20, 9],
    ]);
  });

  test('identity matrix is its own inverse', () => {
    expect(getInverseMod26([[1, 0], [0, 1]])).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });

  test('returns null for invalid key (gcd ≠ 1)', () => {
    // [[2,4],[6,8]]: det = −8, mod 26 = 18, gcd(18,26) = 2 ≠ 1
    expect(getInverseMod26([[2, 4], [6, 8]])).toBeNull();
  });

  test('returns null for singular matrix (det = 0 mod 26)', () => {
    // [[13,0],[0,2]]: det = 26, mod 26 = 0
    expect(getInverseMod26([[13, 0], [0, 2]])).toBeNull();
  });

  test('K · K⁻¹ ≡ I (mod 26) — roundtrip verification', () => {
    const K = [[3, 3], [2, 5]];
    const Kinv = getInverseMod26(K)!;

    // Multiply K × Kinv, check ≡ identity mod 26
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        let sum = 0;
        for (let k = 0; k < 2; k++) {
          sum += K[r][k] * Kinv[k][c];
        }
        const expected = r === c ? 1 : 0;
        expect(((sum % 26) + 26) % 26).toBe(expected);
      }
    }
  });

  test('3×3 inverse exists for Hill\'s original key', () => {
    const K = [[6, 24, 1], [13, 16, 10], [20, 17, 15]];
    const Kinv = getInverseMod26(K);
    expect(Kinv).not.toBeNull();

    // Verify K · K⁻¹ ≡ I (mod 26)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += K[r][k] * Kinv![k][c];
        }
        const expected = r === c ? 1 : 0;
        expect(((sum % 26) + 26) % 26).toBe(expected);
      }
    }
  });
});

// ─── multiplyMatrixVectorMod26() ────────────────────────────────────

describe('multiplyMatrixVectorMod26()', () => {
  test('PRD §2.3 example: K·[7,4] = [7,8]', () => {
    // K = [[3,3],[2,5]], v = [7,4] (HE)
    // row0: 3·7 + 3·4 = 33, mod 26 = 7 → H
    // row1: 2·7 + 5·4 = 34, mod 26 = 8 → I
    const { result, steps } = multiplyMatrixVectorMod26(
      [[3, 3], [2, 5]],
      [7, 4],
    );
    expect(result).toEqual([7, 8]);
    expect(steps).toHaveLength(2);
    expect(steps[0].rowSum).toBe(33);
    expect(steps[0].modResult).toBe(7);
    expect(steps[1].rowSum).toBe(34);
    expect(steps[1].modResult).toBe(8);
  });
});
