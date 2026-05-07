/**
 * CipherStore — Core State Management for Hill Cipher Studio
 */
import { create } from 'zustand';
import { mod, gcd } from '../math/modular';
import { getDeterminant, getInverseMod26 } from '../math/matrix';
import { encrypt, decrypt, sanitizeInput } from '../math/hillCipher';
import type { CipherState } from '../math/types';

const computeMatrixDerived = (matrix: number[][]) => {
  const det = getDeterminant(matrix);
  const detMod = mod(det, 26);
  const g = gcd(detMod, 26);
  return {
    determinant: det,
    determinantMod26: detMod,
    gcdValue: g,
    isValidKey: g === 1,
    inverseMatrix: getInverseMod26(matrix),
  };
};

export const useCipherStore = create<CipherState>((set, get) => ({
  // --- Initial State ---
  matrixSize: 2,
  matrix: [[3, 3], [2, 5]],
  determinant: 9,
  determinantMod26: 9,
  gcdValue: 1,
  isValidKey: true,
  inverseMatrix: [[15, 17], [20, 9]],
  
  message: 'HELLOPROFESSOR',
  mode: 'encrypt',
  output: '',
  stepsData: [],
  processedMessage: '',

  hoveredBlockIndex: null,
  showSteps: true,
  
  lectureMode: false,
  lectureStep: 0,
  completedModules: [],

  // --- Actions ---
  setMatrixSize: (size) => {
    const newMatrix = size === 2 ? [[3, 3], [2, 5]] : [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const derived = computeMatrixDerived(newMatrix);
    set({ 
      matrixSize: size, 
      matrix: newMatrix, 
      ...derived,
      output: '',
      stepsData: [],
      processedMessage: '',
      lectureStep: 0
    });
  },

  updateMatrixCell: (row, col, val) => {
    const current = get().matrix;
    const next = current.map((r, ri) =>
      r.map((v, ci) => (ri === row && ci === col ? val : v)),
    );
    const derived = computeMatrixDerived(next);
    set({ matrix: next, ...derived, output: '', stepsData: [], processedMessage: '', lectureStep: 0 });
  },

  setFullMatrix: (matrix) => {
    const derived = computeMatrixDerived(matrix);
    set({ matrix, ...derived, output: '', stepsData: [], processedMessage: '', lectureStep: 0 });
  },

  setMessage: (message) => set({ message, output: '', stepsData: [], processedMessage: '', lectureStep: 0 }),
  
  setMode: (mode) => set({ mode, output: '', stepsData: [], processedMessage: '', lectureStep: 0 }),
  
  toggleSteps: () => set((state) => ({ showSteps: !state.showSteps })),

  setHoveredBlockIndex: (hoveredBlockIndex) => set({ hoveredBlockIndex }),

  toggleLectureMode: () => set((state) => ({ 
    lectureMode: !state.lectureMode, 
    lectureStep: 0,
    showSteps: true // Always show steps in lecture mode
  })),
  
  setLectureStep: (lectureStep) => set({ lectureStep }),

  toggleModuleCompletion: (id) => set((state) => ({
    completedModules: state.completedModules.includes(id)
      ? state.completedModules.filter(m => m !== id)
      : [...state.completedModules, id]
  })),

  generateRandomMatrix: () => {
    const { matrixSize } = get();
    let newMatrix: number[][] = [];
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < 100) {
      newMatrix = Array.from({ length: matrixSize }, () =>
        Array.from({ length: matrixSize }, () => Math.floor(Math.random() * 26))
      );
      const det = getDeterminant(newMatrix);
      if (gcd(mod(det, 26), 26) === 1) {
        isValid = true;
      }
      attempts++;
    }

    const derived = computeMatrixDerived(newMatrix);
    set({ matrix: newMatrix, ...derived, output: '', stepsData: [], processedMessage: '', lectureStep: 0 });
  },

  executeTransform: () => {
    const { message, matrix, mode, matrixSize } = get();
    const processed = sanitizeInput(message, matrixSize);
    
    if (mode === 'encrypt') {
      const { result, steps } = encrypt(message, matrix);
      set({ output: result, stepsData: steps, processedMessage: processed, lectureStep: 0 });
    } else {
      const decryptResult = decrypt(message, matrix);
      if (!decryptResult) {
        set({ output: '', stepsData: [], processedMessage: processed, lectureStep: 0 });
        return;
      }
      const { result, steps } = decryptResult;
      set({ output: result, stepsData: steps, processedMessage: processed, lectureStep: 0 });
    }
  },
}));
