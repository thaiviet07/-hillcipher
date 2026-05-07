/**
 * Unit Tests — Hill Cipher Logic (hillCipher.ts)
 *
 * Tests: sanitizeInput, isValidKey, encrypt, decrypt, knownPlaintextAttack
 * Reference: PRD §9 — ALL mandatory test cases from the PRD are here.
 */
import { describe, test, expect } from 'vitest';
import {
  sanitizeInput,
  isValidKey,
  encrypt,
  decrypt,
  knownPlaintextAttack,
} from '../hillCipher';

// ─── sanitizeInput() ────────────────────────────────────────────────

describe('sanitizeInput()', () => {
  test('converts to uppercase', () => {
    expect(sanitizeInput('hello', 2)).toBe('HELLO' + 'X'); // 5 chars → pad to 6
  });

  test('strips non-alpha characters', () => {
    expect(sanitizeInput('H E L L O!', 2)).toBe('HELLOX');
  });

  test('pads with X to complete final block (n=2)', () => {
    expect(sanitizeInput('HEL', 2)).toBe('HELX');     // 3 → 4
    expect(sanitizeInput('HELL', 2)).toBe('HELL');     // 4 → no pad
    expect(sanitizeInput('HELLO', 2)).toBe('HELLOX');  // 5 → 6
  });

  test('pads with X to complete final block (n=3)', () => {
    expect(sanitizeInput('HE', 3)).toBe('HEX');        // 2 → 3
    expect(sanitizeInput('HELL', 3)).toBe('HELLXX');   // 4 → 6
    expect(sanitizeInput('ACT', 3)).toBe('ACT');       // 3 → no pad
  });

  test('returns empty string for empty input', () => {
    expect(sanitizeInput('', 2)).toBe('');
    expect(sanitizeInput('   123 !@#', 2)).toBe('');
  });
});

// ─── isValidKey() ───────────────────────────────────────────────────

describe('isValidKey()', () => {
  test('PRD §9: Validity check', () => {
    expect(isValidKey([[3, 3], [2, 5]])).toBe(true);    // det=9,  gcd(9,26)=1
    expect(isValidKey([[2, 4], [6, 8]])).toBe(false);   // det=−8, 18 mod 26, gcd(18,26)=2
    expect(isValidKey([[1, 0], [0, 1]])).toBe(true);    // identity, det=1
    expect(isValidKey([[13, 0], [0, 2]])).toBe(false);  // det=26, gcd(0,26)=26
  });

  test('3×3 key validity', () => {
    expect(isValidKey([[6, 24, 1], [13, 16, 10], [20, 17, 15]])).toBe(true);
    expect(isValidKey([[1, 2, 3], [0, 1, 4], [5, 6, 0]])).toBe(true);
  });
});

// ─── encrypt() ──────────────────────────────────────────────────────

describe('encrypt()', () => {
  const K = [[3, 3], [2, 5]];

  test('PRD §9: Classic Hill 2×2 — "HE" → "HI"', () => {
    const { result } = encrypt('HE', K);
    expect(result).toBe('HI');
  });

  test('PRD §9: Classic Hill 2×2 — "HELP" → "HIAT"', () => {
    // Verified: HE=[7,4]→[33,34]mod26=[7,8]→HI; LP=[11,15]→[78,97]mod26=[0,19]→AT
    const { result } = encrypt('HELP', K);
    expect(result).toBe('HIAT');
  });

  test('PRD §9: encrypt returns step details', () => {
    const { steps } = encrypt('HE', K);
    expect(steps).toHaveLength(1);
    expect(steps[0].blockIndex).toBe(0);
    expect(steps[0].plainText).toBe('HE');
    expect(steps[0].plainVector).toEqual([7, 4]);
    expect(steps[0].cipherVector).toEqual([7, 8]);
    expect(steps[0].cipherText).toBe('HI');
  });

  test('multi-block encryption preserves order', () => {
    const { result, steps } = encrypt('HELP', K);
    expect(steps).toHaveLength(2);
    expect(steps[0].cipherText).toBe('HI');
    expect(steps[1].plainText).toBe('LP');
    expect(result).toBe('HIAT');
  });

  test('auto-pads odd-length messages', () => {
    // "HELLO" → "HELLOX" (padded) → 3 blocks of 2
    const { result, steps } = encrypt('HELLO', K);
    expect(steps).toHaveLength(3);
    // Verify the last block included the padding X
    expect(steps[2].plainText).toBe('OX');
  });
});

// ─── decrypt() ──────────────────────────────────────────────────────

describe('decrypt()', () => {
  const K = [[3, 3], [2, 5]];

  test('PRD §9: decrypt(encrypt("HELLO")) roundtrip', () => {
    const encrypted = encrypt('HELLO', K);
    const decrypted = decrypt(encrypted.result, K);
    expect(decrypted).not.toBeNull();
    // "HELLO" was padded to "HELLOX", so roundtrip recovers "HELLOX"
    expect(decrypted!.result).toBe('HELLOX');
  });

  test('PRD §9: decrypt(encrypt("HELP")) exact roundtrip', () => {
    const encrypted = encrypt('HELP', K);
    const decrypted = decrypt(encrypted.result, K);
    expect(decrypted).not.toBeNull();
    expect(decrypted!.result).toBe('HELP');
  });

  test('returns null for invalid key', () => {
    const result = decrypt('ABCD', [[2, 4], [6, 8]]);
    expect(result).toBeNull();
  });

  test('decrypt provides step details', () => {
    const encrypted = encrypt('HE', K);
    const decrypted = decrypt(encrypted.result, K);
    expect(decrypted!.steps).toHaveLength(1);
    expect(decrypted!.steps[0].cipherText).toBe('HE');
  });
});

// ─── 3×3 encryption ────────────────────────────────────────────────

describe('3×3 encryption', () => {
  test('PRD §9: Hill\'s original 1929 example — "ACT" → "POH"', () => {
    const K = [[6, 24, 1], [13, 16, 10], [20, 17, 15]];
    const { result } = encrypt('ACT', K);
    expect(result).toBe('POH');
  });

  test('3×3 encrypt-decrypt roundtrip', () => {
    const K = [[6, 24, 1], [13, 16, 10], [20, 17, 15]];
    const { result: cipher } = encrypt('ACT', K);
    const decrypted = decrypt(cipher, K);
    expect(decrypted).not.toBeNull();
    expect(decrypted!.result).toBe('ACT');
  });
});

// ─── knownPlaintextAttack() ─────────────────────────────────────────

describe('knownPlaintextAttack()', () => {
  test('PRD §4.4: recover K from known plaintext-ciphertext pair', () => {
    // The attacker knows:  plaintext "HELP" ↔ ciphertext encrypted with K=[[3,3],[2,5]]
    const K = [[3, 3], [2, 5]];
    const { result: cipher } = encrypt('HELP', K);

    const recovered = knownPlaintextAttack('HELP', cipher, 2);
    expect(recovered).not.toBeNull();
    expect(recovered).toEqual(K);
  });

  test('returns null when plaintext matrix is not invertible', () => {
    // "AAAA" → P_mat = [[0,0],[0,0]], singular
    const result = knownPlaintextAttack('AAAA', 'ABCD', 2);
    expect(result).toBeNull();
  });
});
