/**
 * Modular Arithmetic Utilities
 *
 * Pure functions for modular arithmetic used throughout the Hill Cipher.
 * No UI state or DOM manipulation — 100% unit-testable.
 */

/**
 * True mathematical modulo that always returns a non-negative result.
 * JavaScript's `%` operator returns negative values for negative dividends;
 * this corrects for that: ((n % m) + m) % m.
 */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * Greatest Common Divisor via the Euclidean algorithm.
 * Works on absolute values so negative inputs are handled correctly.
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Modular multiplicative inverse using brute-force search.
 * Returns x such that (a · x) ≡ 1 (mod m), or null if no inverse exists.
 *
 * For m = 26 the valid invertible elements are:
 * {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}
 */
export function modInverse(a: number, m: number): number | null {
  a = mod(a, m);
  if (a === 0) return null;

  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return null;
}
