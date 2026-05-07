/**
 * Unit Tests — Modular Arithmetic (modular.ts)
 *
 * Tests: mod, gcd, modInverse
 * Reference: PRD §2.5, §2.6, §9 (test "Mod 26 wrap-around")
 */
import { describe, test, expect } from 'vitest';
import { mod, gcd, modInverse } from '../modular';

// ─── mod() ──────────────────────────────────────────────────────────

describe('mod()', () => {
  test('positive values pass through unchanged', () => {
    expect(mod(7, 26)).toBe(7);
    expect(mod(0, 26)).toBe(0);
    expect(mod(25, 26)).toBe(25);
  });

  test('handles values ≥ m', () => {
    expect(mod(26, 26)).toBe(0);
    expect(mod(33, 26)).toBe(7);
    expect(mod(52, 26)).toBe(0);
  });

  test('handles negative values correctly', () => {
    // This is the critical correctness requirement — JS % is wrong for negatives
    expect(mod(-1, 26)).toBe(25);
    expect(mod(-8, 26)).toBe(18);
    expect(mod(-26, 26)).toBe(0);
    expect(mod(-27, 26)).toBe(25);
  });
});

// ─── gcd() ──────────────────────────────────────────────────────────

describe('gcd()', () => {
  test('standard GCD computations', () => {
    expect(gcd(9, 26)).toBe(1);
    expect(gcd(26, 9)).toBe(1);   // order shouldn't matter
    expect(gcd(8, 26)).toBe(2);
    expect(gcd(13, 26)).toBe(13);
    expect(gcd(26, 26)).toBe(26);
    expect(gcd(1, 26)).toBe(1);
  });

  test('gcd with zero', () => {
    expect(gcd(0, 26)).toBe(26);
    expect(gcd(26, 0)).toBe(26);
  });

  test('handles negative inputs', () => {
    expect(gcd(-8, 26)).toBe(2);
    expect(gcd(8, -26)).toBe(2);
  });
});

// ─── modInverse() ───────────────────────────────────────────────────

describe('modInverse()', () => {
  test('PRD §9: Mod 26 wrap-around test cases', () => {
    expect(modInverse(9, 26)).toBe(3);    // 9×3 = 27 ≡ 1 mod 26
    expect(modInverse(3, 26)).toBe(9);    // symmetric pair
    expect(modInverse(5, 26)).toBe(21);   // 5×21 = 105 ≡ 1 mod 26
    expect(modInverse(2, 26)).toBeNull(); // gcd(2,26)=2, no inverse
    expect(modInverse(13, 26)).toBeNull();// gcd(13,26)=13
  });

  test('all invertible elements mod 26', () => {
    // From PRD Appendix B
    const pairs: [number, number][] = [
      [1, 1], [3, 9], [5, 21], [7, 15], [9, 3], [11, 19],
      [15, 7], [17, 23], [19, 11], [21, 5], [23, 17], [25, 25],
    ];
    for (const [a, expected] of pairs) {
      expect(modInverse(a, 26)).toBe(expected);
    }
  });

  test('non-invertible elements mod 26 return null', () => {
    const nonInvertible = [0, 2, 4, 6, 8, 10, 12, 13, 14, 16, 18, 20, 22, 24];
    for (const a of nonInvertible) {
      expect(modInverse(a, 26)).toBeNull();
    }
  });
});
