# **SYSTEM DESIGN SPECIFICATION: HILL CIPHER STUDIO**

## **1\. ARCHITECTURAL OVERVIEW**

The system follows a strict Model-View-ViewModel (MVVM) inspired architecture adapted for React. The mathematical engine is completely isolated from the UI layer, connected via a centralized Zustand state manager.

* **View Layer:** React 18, Tailwind CSS, Framer Motion.  
* **State Layer:** Zustand (Synchronous, single source of truth).  
* **Domain Logic (Math Engine):** Pure TypeScript functions, 100% unit-testable.

## **2\. STATE MANAGEMENT SCHEMA (Zustand)**

The application relies on a global useCipherStore. Data flows unidirectionally. The store automatically computes derived properties (like matrix validity) whenever the matrix changes.

interface CipherState {  
  // \--- RAW INPUT \---  
  matrixSize: 2 | 3;  
  matrix: number\[\]\[\];       // Current grid values  
  message: string;          // Raw user input  
  mode: 'encrypt' | 'decrypt';  
  showSteps: boolean;

  // \--- DERIVED COMPUTATIONS (Auto-updated on matrix change) \---  
  determinant: number;      // det(K)  
  determinantMod26: number; // det(K) mod 26  
  gcdValue: number;         // gcd(detMod26, 26\)  
  isValidKey: boolean;      // gcdValue \=== 1  
  inverseMatrix: number\[\]\[\] | null; // K⁻¹ mod 26

  // \--- EXECUTION OUTPUT \---  
  processedMessage: string; // Sanitized, padded  
  output: string;           // Final cipher/plaintext  
  stepsData: StepDetail\[\];  // Breakdown for UI rendering  
    
  // \--- ACTIONS \---  
  setMatrixSize: (size: 2 | 3\) \=\> void;  
  updateMatrixCell: (row: number, col: number, val: number) \=\> void;  
  setMessage: (msg: string) \=\> void;  
  executeTransform: () \=\> void; // Triggers the math engine  
}

## **3\. MATHEMATICAL ENGINE CONTRACTS**

All functions in /src/math/ must be pure functions. They take primitives/arrays and return primitives/arrays. **No UI state or DOM manipulation is permitted here.**

### **3.1 Core Utilities (modular.ts)**

* mod(n: number, m: number): number \- Must handle negative numbers correctly: ((n % m) \+ m) % m.  
* gcd(a: number, b: number): number  
* modInverse(a: number, m: number): number | null

### **3.2 Matrix Operations (matrix.ts)**

* getDeterminant(matrix: number\[\]\[\]): number  
* getAdjugate(matrix: number\[\]\[\]): number\[\]\[\]  
* getInverseMod26(matrix: number\[\]\[\]): number\[\]\[\] | null \- Requires gcd(det(K) mod 26, 26\) \=== 1\.  
* multiplyMatrixVectorMod26(matrix: number\[\]\[\], vector: number\[\]): { result: number\[\], steps: CalculationStep }

### **3.3 Cipher Logic (hillCipher.ts)**

* sanitizeInput(text: string, blockSize: number): string \- Strips non-alpha, converts to uppercase, pads with 'X'.  
* transform(text: string, matrix: number\[\]\[\]): { result: string, steps: StepDetail\[\] }

## **4\. CRITICAL COMPONENT SPECIFICATIONS**

### **4.1 MatrixEditor Component**

**Role:** Handles user input for the cryptographic key and provides real-time validity feedback.

**Constraints:**

* Inputs are restricted to integers 0-25. Non-numeric keystrokes are intercepted and blocked at the onChange event level.  
* Validation runs synchronously. If isValidKey \=== false, the parent Encrypt button is disabled.  
* **Visual state:** Uses a CSS pseudo-element border system to draw matrix brackets dynamically based on matrixSize to avoid distorted typography.

### **4.2 StepPanel Component (The Educational Core)**

**Role:** Renders the execution trace (StepDetail\[\]) outputted by the Math Engine.

**Structure:**

* Uses react-katex for rendering equations.  
* **Animation Contract:** Uses framer-motion \<AnimatePresence\>. Each block is rendered as a list item with an initial { opacity: 0, y: 20 } and animate { opacity: 1, y: 0 }, staggered by blockIndex \* 0.15s.

// Data structure passed to the StepPanel  
interface StepDetail {  
  blockIndex: number;  
  plainText: string;        // e.g., "HE"  
  plainVector: number\[\];    // e.g., \[7, 4\]  
  cipherVector: number\[\];   // e.g., \[7, 8\]  
  cipherText: string;       // e.g., "HI"  
  operations: {  
    equation: string;       // KaTeX formatted string: "3 \\times 7 \+ 3 \\times 4"  
    sum: number;            // 33  
    modResult: number;      // 7  
  }\[\];  
}

## **5\. EDGE CASES & ERROR HANDLING**

1. **Empty Input Validation:** The math engine must return an empty string and empty steps if message length is 0\. The UI should intercept this before calling executeTransform and display a toast notification.  
2. **Degenerate Matrices (det \= 0):** modInverse will return null. The MatrixEditor must specifically catch this and display "Singular Matrix: Determinant is 0" rather than a generic invalid error.  
3. **Invalid GCD (det \!= 0, but gcd \!= 1):** The MatrixEditor must display "Matrix is not invertible mod 26 (Shares factors with 26)".  
4. **Performance:** Since the maximum practical input is a few paragraphs (this is an educational tool, not production bulk encryption), synchronous matrix multiplication on the main thread is acceptable. No Web Workers required.

## **6\. IMPLEMENTATION PHASING (Technical Execution)**

* **Phase 1: Math Engine Validation.** Implement /src/math/. Strict TDD approach. Write the 15 tests specified in the PRD *first*. Do not touch React until all math tests pass.  
* **Phase 2: State Wiring.** Scaffold the Zustand store. Hook up dummy React components to verify state transitions (changing matrix updates determinant live).  
* **Phase 3: Component Implementation.** Build MatrixEditor, MessageInput, and basic I/O.  
* **Phase 4: Educational UX.** Implement StepPanel with KaTeX and Framer Motion stagger animations.  
* **Phase 5: Learn Mode.** Build the static/interactive concept cards mapping to LA theories.