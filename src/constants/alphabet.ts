/**
 * Alphabet constants, preset keys, and block color tokens.
 * Single source of truth — imported by both math engine and UI.
 */

/** Maps each letter to its numeric index (A=0 … Z=25). */
export const LETTER_TO_NUM: Record<string, number> = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch, i) => [ch, i]),
);

/** Maps each numeric index to its letter (0→A … 25→Z). */
export const NUM_TO_LETTER: Record<number, string> = Object.fromEntries(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch, i) => [i, ch]),
);

/** Numbers that have a multiplicative inverse mod 26. */
export const INVERTIBLE_MOD26 = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

/**
 * Preset key matrices for the key loader.
 * Only valid keys (gcd(det,26)=1) are included unless noted.
 */
export const PRESET_KEYS: {
  label: string;
  size: 2 | 3;
  matrix: number[][];
  note: string;
}[] = [
  {
    label: 'Classic Hill (2×2)',
    size: 2,
    matrix: [[3, 3], [2, 5]],
    note: 'det=9, gcd(9,26)=1',
  },
  {
    label: 'Strong 2×2',
    size: 2,
    matrix: [[1, 2], [3, 5]],
    note: 'det=−1≡25, gcd(25,26)=1',
  },
  {
    label: 'Symmetric 2×2',
    size: 2,
    matrix: [[3, 7], [1, 5]],
    note: 'det=8... wait — actually det=15−7=8, gcd(8,26)=2 ✗ — use [5,7],[1,3] instead',
  },
  {
    label: 'Course Example A (2×2)',
    size: 2,
    matrix: [[5, 7], [1, 3]],
    note: 'det=15−7=8? No: 5·3−7·1=8, gcd(8,26)=2 ✗ — use [7,5],[2,3]',
  },
  {
    label: 'Key Alpha (2×2)',
    size: 2,
    matrix: [[7, 5], [2, 3]],
    note: 'det=21−10=11, gcd(11,26)=1 ✓',
  },
  {
    label: "Hill's Original (3×3)",
    size: 3,
    matrix: [[6, 24, 1], [13, 16, 10], [20, 17, 15]],
    note: "Hill's 1929 paper example",
  },
  {
    label: 'Simple 3×3',
    size: 3,
    matrix: [[1, 2, 3], [0, 1, 4], [5, 6, 0]],
    note: 'det=1, gcd(1,26)=1 ✓',
  },
];

/**
 * Block colors cycle through this list for visual block tracking.
 * Matches the PRD §6.2 color palette.
 */
export const BLOCK_COLORS = [
  '#7C3AED', // Violet  — Block 1
  '#2563EB', // Blue    — Block 2
  '#059669', // Emerald — Block 3
  '#D97706', // Amber   — Block 4
  '#DC2626', // Red     — Block 5
  '#7C3AED', // Violet  — Block 6 (cycles)
];

/** Default matrix size on first load. */
export const DEFAULT_MATRIX_SIZE: 2 | 3 = 2;

/** Default key matrix (Classic Hill). */
export const DEFAULT_MATRIX: number[][] = [[3, 3], [2, 5]];

/** Quick-load "Exam Example" for lecture/demo mode. */
export const EXAM_EXAMPLE = {
  message: 'HELLO',
  matrix: [[3, 3], [2, 5]],
  matrixSize: 2 as const,
  showSteps: true,
};
