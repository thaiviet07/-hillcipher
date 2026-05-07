/**
 * Hill Cipher Studio — Shared Type Definitions
 *
 * All interfaces that cross the boundary between the math engine,
 * Zustand store, and React components are defined here.
 */

/** Real-time validation state computed from the key matrix. */
export interface MatrixValidation {
  det: number;
  detMod26: number;
  gcd: number;
  isValid: boolean;
  inverse: number[][] | null;   // null when key is invalid
  detInverse: number | null;    // modular inverse of det mod 26
}

/** Intermediate calculation detail for one row of a K·v multiplication. */
export interface CalculationStep {
  rowCoefficients: number[];    // K row entries
  vectorEntries: number[];      // v entries
  products: number[];           // element-wise products
  rowSum: number;               // sum before mod
  modResult: number;            // after mod 26
  resultLetter: string;         // converted back to letter
}

/** Full step-by-step detail for one plaintext block. */
export interface StepDetail {
  blockIndex: number;
  plainText: string;            // e.g., "HE"
  plainVector: number[];        // e.g., [7, 4]
  cipherVector: number[];       // e.g., [7, 8]
  cipherText: string;           // e.g., "HI"
  operations: {
    equation: string;           // KaTeX formatted string
    sum: number;                // pre-mod value
    modResult: number;          // post-mod value
  }[];
}

/** Transform result returned by the cipher engine. */
export interface TransformResult {
  result: string;
  steps: StepDetail[];
}

/** Matrix-vector multiplication result with calculation trace. */
export interface MultiplyResult {
  result: number[];
  steps: CalculationStep[];
}

/** Supported matrix sizes */
export type MatrixSize = 2 | 3;

/** Cipher operation modes */
export type CipherMode = 'encrypt' | 'decrypt';

/** Application-level cipher state (Zustand). */
export interface CipherState {
  // --- RAW INPUT ---
  matrixSize: MatrixSize;
  matrix: number[][];
  message: string;
  mode: CipherMode;
  showSteps: boolean;
  hoveredBlockIndex: number | null;
  lectureMode: boolean;
  lectureStep: number;

  // --- DERIVED COMPUTATIONS ---
  determinant: number;
  determinantMod26: number;
  gcdValue: number;
  isValidKey: boolean;
  inverseMatrix: number[][] | null;

  // --- EXECUTION OUTPUT ---
  processedMessage: string;
  output: string;
  stepsData: StepDetail[];

  // --- ACTIONS ---
  setMatrixSize: (size: MatrixSize) => void;
  updateMatrixCell: (row: number, col: number, val: number) => void;
  setMessage: (msg: string) => void;
  setMode: (mode: CipherMode) => void;
  toggleSteps: () => void;
  executeTransform: () => void;
  setHoveredBlockIndex: (index: number | null) => void;
  toggleLectureMode: () => void;
  setLectureStep: (step: number) => void;
  setFullMatrix: (matrix: number[][]) => void;
  generateRandomMatrix: () => void;
  completedModules: string[];
  toggleModuleCompletion: (id: string) => void;
}
