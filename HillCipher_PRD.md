# 🔐 HILL CIPHER STUDIO
## Product Requirements Document (PRD) — v1.0
### Linear Algebra Final Project · Full-Stack Interactive Application

---

## 0. EXECUTIVE SUMMARY

**Product Name:** Hill Cipher Studio  
**Tagline:** *"Where Matrix Mathematics Meets Secret Messages"*  
**Type:** Single-page interactive web application (React + TypeScript)  
**Target Users:** Linear algebra students, cryptography enthusiasts, educators, curious learners  
**Core Value Proposition:** Hill Cipher Studio is the first beautifully-designed, mathematically transparent implementation of the Hill Cipher — it doesn't just encrypt/decrypt, it *teaches* you exactly how every matrix operation works, step by step, in real time.

---

## 1. PRODUCT VISION & REAL-WORLD APPLICATION

### 1.1 Why This Product Exists

The Hill Cipher sits at the intersection of two worlds most people never connect: **the abstract beauty of linear algebra** and **the urgent practical need for data security**. Every time you send a message, your device performs mathematical transformations on your data. The Hill Cipher, invented in 1929 by Lester Hill, was one of the first systems to prove that *matrices could be the engine of secrecy*.

Hill Cipher Studio makes this idea **visible, tangible, and interactive**. Users don't just get encrypted text — they watch a matrix transform their words into ciphertext, operation by operation, number by number.

### 1.2 Real-World Use Cases

| Scenario | User | How They Use It |
|---|---|---|
| **Classroom demo** | Professor | Projects the app, types a message live, shows how changing one matrix entry changes every ciphertext block |
| **Self-study** | LA student | Practices computing K⁻¹ mod 26 by hand, then verifies against the app's step-by-step breakdown |
| **Final project showcase** | Student (you) | Demonstrates a working cryptographic product powered entirely by linear algebra concepts from the course |
| **Curiosity exploration** | General user | Types their name, encrypts it, explores what "invertible matrix" means intuitively |
| **Cybersecurity education** | High school teacher | Shows the known-plaintext attack demo to explain *why* modern ciphers are more complex |

### 1.3 How It Connects to Linear Algebra Coursework

Every feature of this app maps to a specific LA concept:

```
User types message          →  String → Numerical Vector (basis of vector spaces)
Matrix key entry            →  User defines an invertible matrix K
Encrypt button              →  c = K · p  (mod 26)  [Matrix × Vector multiplication]
Inverse matrix display      →  K⁻¹ computed via Gaussian elimination (mod 26)
Decrypt button              →  p = K⁻¹ · c  (mod 26)
Validity checker            →  gcd(det(K), 26) = 1  [Determinant + GCD condition]
Step-by-step mode           →  Shows each row operation, each modular reduction
Known-plaintext demo        →  Solve K from K · P = C  [System of linear equations]
```

---

## 2. CORE MATHEMATICAL ENGINE

> This section is the **single source of truth** for all math the coder must implement. Every formula here must be implemented exactly.

### 2.1 Letter-Number Mapping

```
A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9,
K=10, L=11, M=12, N=13, O=14, P=15, Q=16, R=17, S=18,
T=19, U=20, V=21, W=22, X=23, Y=24, Z=25
```

- Only uppercase letters A–Z are valid plaintext characters.
- Spaces, numbers, punctuation must be **stripped** from the plaintext before processing (UI must warn user).
- If the message length is not a multiple of the block size n, **pad with 'X' (=23)** at the end.

### 2.2 Block Size (n) and Matrix Size

The user selects the cipher block size n ∈ {2, 3}:
- **n = 2**: Key is a 2×2 matrix. Plaintext is split into 2-letter blocks. Vectors are 2×1.
- **n = 3**: Key is a 3×3 matrix. Plaintext is split into 3-letter blocks. Vectors are 3×1.

### 2.3 Encryption Algorithm

**Input:** Plaintext string P, key matrix K (n×n), block size n  
**Output:** Ciphertext string C

```
Step 1: Convert P to number array:  [p₁, p₂, p₃, ..., pₘ]  where pᵢ ∈ {0..25}
Step 2: Pad so length is multiple of n (append 23='X' as needed)
Step 3: Split into column vectors of length n:
        v₁ = [p₁, p₂, ..., pₙ]ᵀ
        v₂ = [pₙ₊₁, ..., p₂ₙ]ᵀ
        ...
Step 4: For each vector vᵢ:
        cᵢ = (K · vᵢ) mod 26
        Each entry: cᵢⱼ = (Σₖ Kⱼₖ · vᵢₖ) mod 26
Step 5: Flatten all cᵢ back into a single number array
Step 6: Convert numbers to letters → Ciphertext C
```

**Example (2×2):**
```
K = [[3, 3], [2, 5]]
Plaintext: "HE" → [7, 4]
v = [7, 4]ᵀ

K · v = [3·7 + 3·4,  2·7 + 5·4]
      = [21 + 12,    14 + 20]
      = [33, 34]

mod 26: [33 mod 26, 34 mod 26] = [7, 8] → "HI"
```

### 2.4 Matrix Inversion (mod 26)

**For 2×2 matrix K = [[a, b], [c, d]]:**

```
det(K) = a·d - b·c

det_mod = ((a·d - b·c) mod 26 + 26) mod 26   // ensure positive

// Check validity:
gcd(det_mod, 26) must equal 1

// Find modular inverse of determinant:
det_inv = modInverse(det_mod, 26)  // Extended Euclidean Algorithm

// Adjugate matrix (cofactor transposed):
adj(K) = [[d, -b], [-c, a]]

// All entries mod 26 (ensure positive):
adj_mod = [[d mod 26, (-b mod 26 + 26) mod 26],
           [(-c mod 26 + 26) mod 26, a mod 26]]

// K⁻¹ mod 26:
K⁻¹ = (det_inv · adj_mod) mod 26
```

**For 3×3 matrix K:**

```
det(K) = a(ei−fh) − b(di−fg) + c(dh−eg)   // standard cofactor expansion

det_mod = ((det(K)) mod 26 + 26) mod 26

// Must have gcd(det_mod, 26) = 1

// Compute cofactor matrix C where:
Cᵢⱼ = (−1)^(i+j) · Mᵢⱼ
where Mᵢⱼ = determinant of the 2×2 submatrix obtained by deleting row i, col j

// Adjugate = transpose of cofactor matrix
adj(K) = Cᵀ

// All entries reduced mod 26 (positive)

// K⁻¹ mod 26 = det_inv · adj(K) mod 26
```

### 2.5 Modular Inverse (Extended Euclidean Algorithm)

```
function modInverse(a, m):
    // Returns x such that (a · x) ≡ 1 (mod m)
    // Returns null if inverse does not exist (gcd(a,m) ≠ 1)
    
    a = ((a % m) + m) % m
    for x in 1..m-1:
        if (a * x) % m === 1: return x
    return null  // No inverse exists

// For m=26, valid inverses exist for:
// {1,3,5,7,9,11,15,17,19,21,23,25}
// Inverse pairs: 1↔1, 3↔9, 5↔21, 7↔15, 11↔19, 17↔23, 25↔25
```

### 2.6 GCD Calculation

```
function gcd(a, b):
    while b ≠ 0:
        [a, b] = [b, a mod b]
    return a

// Key validity condition:
isValidKey(K) = gcd(det(K) mod 26, 26) === 1
```

### 2.7 Decryption Algorithm

**Identical to encryption, but replace K with K⁻¹:**

```
p = (K⁻¹ · c) mod 26
```

### 2.8 Known-Plaintext Attack

Given one plaintext-ciphertext pair (P, C) where both are n blocks long:

```
// Form matrix P_mat from plaintext column vectors [v₁ | v₂ | ... | vₙ]
// Form matrix C_mat from ciphertext column vectors [c₁ | c₂ | ... | cₙ]
// Since C_mat = K · P_mat
// Then K = C_mat · P_mat⁻¹  (mod 26)
// (requires P_mat to be invertible mod 26)
```

This is demonstrated in the "Security Analysis" panel to show how the cipher can be broken.

---

## 3. APPLICATION ARCHITECTURE

### 3.1 Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| **Framework** | React 18 + TypeScript | Type safety for math operations; component architecture |
| **Styling** | Tailwind CSS + custom CSS variables | Utility-first + custom design tokens |
| **Animations** | Framer Motion | Smooth matrix morphing, step transitions |
| **Math rendering** | KaTeX (via react-katex) | Render LaTeX formulas inline |
| **State management** | Zustand | Lightweight, perfect for cipher state |
| **Build tool** | Vite | Fast HMR during development |
| **Testing** | Vitest | Unit tests for all math functions |

### 3.2 File Structure

```
hill-cipher-studio/
├── src/
│   ├── math/
│   │   ├── modular.ts         # GCD, modInverse, mod operations
│   │   ├── matrix.ts          # Matrix multiply, det, inverse (2x2 and 3x3)
│   │   ├── hillCipher.ts      # Encrypt, decrypt, validate key, attack
│   │   └── __tests__/         # Unit tests for every math function
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx   # Overall layout wrapper
│   │   │   └── NavBar.tsx     # Top nav with mode switcher
│   │   ├── cipher/
│   │   │   ├── MessageInput.tsx      # Plaintext/ciphertext input
│   │   │   ├── MatrixEditor.tsx      # Interactive key matrix editor
│   │   │   ├── MatrixDisplay.tsx     # Read-only matrix display (K, K⁻¹)
│   │   │   ├── EncryptButton.tsx     # Triggers encryption + animation
│   │   │   ├── CipherOutput.tsx      # Shows ciphertext result
│   │   │   └── BlockTracker.tsx      # Maps each letter to its block/vector
│   │   ├── steps/
│   │   │   ├── StepPanel.tsx         # Expandable step-by-step breakdown
│   │   │   ├── VectorStep.tsx        # Shows one K·v = c computation
│   │   │   └── ModStep.tsx           # Shows mod 26 reduction
│   │   ├── learn/
│   │   │   ├── ConceptCard.tsx       # Floating LA concept explainer
│   │   │   ├── InvertibilityViz.tsx  # Visual: valid vs invalid key
│   │   │   └── AttackDemo.tsx        # Known-plaintext attack walkthrough
│   │   └── ui/
│   │       ├── MatrixCell.tsx        # Single editable cell in matrix
│   │       ├── FormulaBlock.tsx      # KaTeX rendered formula
│   │       ├── Badge.tsx             # Valid/Invalid key badge
│   │       └── Toast.tsx             # Error/success notifications
│   ├── store/
│   │   └── cipherStore.ts     # Global state: message, key, mode, steps
│   ├── hooks/
│   │   ├── useHillCipher.ts   # Main cipher hook
│   │   └── useMatrixEditor.ts # Matrix input validation hook
│   ├── constants/
│   │   └── alphabet.ts        # A–Z mapping, preset keys, examples
│   └── App.tsx
```

---

## 4. USER INTERFACE — SCREENS & FLOWS

### 4.1 Overall Layout

The app has **one main page** with a **persistent left sidebar** (navigation) and a **dynamic main workspace** divided into panels. No page reloads — everything transitions in-place.

```
┌─────────────────────────────────────────────────────────────┐
│  [HILL CIPHER STUDIO]           [2×2] [3×3]   [?] About    │  ← Top Nav
├──────────┬──────────────────────────────────────────────────┤
│          │                                                    │
│ SIDEBAR  │              MAIN WORKSPACE                        │
│          │                                                    │
│ • Cipher │  ┌─────────────────┐   ┌────────────────────┐   │
│ • Learn  │  │  INPUT PANEL    │   │  KEY MATRIX PANEL  │   │
│ • Attack │  │                 │   │                    │   │
│ • About  │  │ [Plaintext]     │   │  [ 3  3 ]          │   │
│          │  │                 │   │  [ 2  5 ]          │   │
│          │  │ [ENCRYPT ▶]     │   │                    │   │
│          │  │                 │   │  det = 9           │   │
│          │  │ [DECRYPT ◀]     │   │  gcd(9,26)=1 ✓     │   │
│          │  └─────────────────┘   └────────────────────┘   │
│          │                                                    │
│          │  ┌──────────────────────────────────────────┐    │
│          │  │  STEP-BY-STEP PANEL (expandable)         │    │
│          │  │  Block 1: [H,E] → [7,4] → K·v → [7,8]  │    │
│          │  │  Block 2: [L,L] → ...                    │    │
│          │  └──────────────────────────────────────────┘    │
│          │                                                    │
│          │  ┌──────────────────────────────────────────┐    │
│          │  │  OUTPUT: "HELLO" → "HIJKLM..."            │    │
│          │  └──────────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────┘
```

### 4.2 Screen 1: Cipher Workspace (Main)

**Purpose:** Core encrypt/decrypt functionality.

#### Panel A — Message Input

- Large monospace `<textarea>` labeled **"Your Message"**
- Real-time character counter: "12 characters → 6 blocks of 2"
- Live warning if message contains non-alpha characters: *"Spaces and punctuation will be removed"* (yellow banner)
- Padding indicator: *"Message padded with 'X' to complete final block"* (if applicable)
- Two large buttons:
  - `[🔒 ENCRYPT]` — primary color, prominent
  - `[🔓 DECRYPT]` — secondary color
- Toggle: **"Show Step-by-Step"** (default OFF; when ON, Step Panel expands)

#### Panel B — Key Matrix Editor

- Grid of `n × n` input cells (n = 2 or 3, switchable via top nav)
- Each cell: number input, range 0–25, integer only
- Real-time validation on every keystroke:
  - Compute `det(K)` → display "det = {value}"
  - Compute `det mod 26` → display "det mod 26 = {value}"
  - Compute `gcd(det mod 26, 26)` → display "gcd = {value}"
  - Show **green badge "✓ VALID KEY"** or **red badge "✗ INVALID KEY"**
- Button: **"Load Preset Key"** → dropdown with 5 verified valid keys (with names like "Classic Hill", "Course Example")
- Button: **"Random Valid Key"** → generates a random valid key
- Animated inverse matrix display: below the key matrix, shows K⁻¹ (mod 26) with a label, updates live

#### Panel C — Step-by-Step Breakdown (Collapsible)

Only visible when "Show Step-by-Step" is toggled ON. After encryption/decryption is run:

For each plaintext block i:

```
┌──────────────────────────────────────────────────────┐
│  BLOCK 1 of 4                                        │
│                                                      │
│  Letters: H, E                                       │
│  Numbers: 7, 4                                       │
│                                                      │
│  Matrix Multiplication:                              │
│  [ 3  3 ] × [ 7 ]  =  [ 3×7 + 3×4 ]  =  [ 33 ]    │
│  [ 2  5 ]   [ 4 ]     [ 2×7 + 5×4 ]     [ 34 ]    │
│                                                      │
│  Mod 26 Reduction:                                   │
│  33 mod 26 = 7  →  H                                │
│  34 mod 26 = 8  →  I                                │
│                                                      │
│  Plaintext Block: HE  →  Ciphertext Block: HI       │
└──────────────────────────────────────────────────────┘
```

Blocks are shown as animated cards that slide in one by one with a 150ms delay between each.

#### Panel D — Output Display

- Large styled output showing the encrypted/decrypted text
- Character-by-character reveal animation (each letter fades in with a stagger)
- Copy-to-clipboard button
- Color coding: each original block and its ciphertext counterpart share a color (Block 1 = blue, Block 2 = orange, etc.) so users can visually trace which blocks mapped where

---

### 4.3 Screen 2: Learn Mode

**Purpose:** Interactive linear algebra explainer. Each concept is a card that expands when clicked.

#### Card 1: "What is a Vector in the Hill Cipher?"

- Animated diagram: letters of the alphabet → numbers → column vector notation
- Interactive: user types any 2-letter combination, sees it become a vector in real time
- LaTeX formula: `\mathbf{v} = \begin{bmatrix} p_1 \\ p_2 \end{bmatrix}`

#### Card 2: "Matrix Multiplication = Encryption"

- Interactive 2×2 × 2×1 multiplication diagram
- Color-coded entries: row 1 of K highlighted in blue, v entries highlighted in orange, resulting dot product shown step by step
- Formula: `\mathbf{c} = K \cdot \mathbf{v} \pmod{26}`
- User can change individual matrix/vector entries and see the multiplication update live

#### Card 3: "Why Must the Key Matrix Be Invertible?"

- Two-scenario visualizer:
  - Left: valid key (gcd = 1) → each plaintext maps to a unique ciphertext (bijection diagram)
  - Right: invalid key (gcd ≠ 1) → two different plaintexts map to the same ciphertext (shows collision)
- Interactive slider: change det mod 26 value, see which GCDs are valid
- Formula: `\gcd(\det(K),\; 26) = 1`

#### Card 4: "Computing K⁻¹ mod 26 — Step by Step"

- Gaussian elimination walk-through for the default key matrix
- Each row operation shown as a numbered step
- Then: adjugate → determinant inverse → final K⁻¹
- Formula boxes rendered with KaTeX
- Button: "Apply to my current key" → runs the same walk-through for the user's own key

#### Card 5: "Mod 26 Arithmetic"

- Visual number line 0–25 showing the "wrap-around" behavior
- Interactive: type any number, see what it reduces to mod 26
- Shows the 12 numbers that have inverses mod 26 (highlighted in green), and the 13 that don't
- Table of all `(a, a⁻¹ mod 26)` pairs

#### Card 6: "The Encryption is a Linear Transformation"

- Visual: shows that `K(αu + βv) = αKu + βKv` holds (linearity proof for the encryption function)
- Animated: two vectors morphed by the key matrix, showing linearity preserved

---

### 4.4 Screen 3: Security Analysis (Attack Demo)

**Purpose:** Show the known-plaintext attack, demonstrating why the Hill Cipher is insecure by modern standards. This is an educational demonstration of the cipher's weakness.

#### Demo Flow (Guided, Step-by-Step)

```
Step 1 of 4: The Attacker's Scenario
"Imagine an attacker intercepts a message and also happens to know
what 4 letters of plaintext correspond to (e.g., standard headers)."

Step 2 of 4: Setup
Known plaintext:  "HELP"  →  vectors P₁=[7,4]ᵀ,  P₂=[11,15]ᵀ
Known ciphertext: "HQXK"  →  vectors C₁=[7,16]ᵀ, C₂=[23,10]ᵀ

Form: P_mat = [P₁ | P₂],  C_mat = [C₁ | C₂]

Step 3 of 4: Solve for K
Since C_mat = K · P_mat
→  K = C_mat · P_mat⁻¹  (mod 26)
[Shows the full matrix arithmetic step by step]

Step 4 of 4: Key Recovered!
K = [[3,3],[2,5]]  ← The attacker now has the key!
"With this key, every future message encrypted with the same key is compromised."
```

- Each step is a full-width animated card
- Mathematical operations are shown with color-coded matrix algebra
- "Why this matters" section at the end: brief comparison with modern ciphers (AES, RSA) in 2 sentences each

---

### 4.5 Screen 4: About / Mathematical Reference

- Brief product description (1 paragraph)
- Quick-reference formula card (printable PDF layout):
  - Encryption: `c = Kp \pmod{26}`
  - Decryption: `p = K^{-1}c \pmod{26}`
  - Validity: `\gcd(\det(K), 26) = 1`
  - 2×2 inverse: `K^{-1} = \det(K)^{-1} \cdot \text{adj}(K) \pmod{26}`
- Credits section mentioning Lester Hill (1929) and the mathematical concepts

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 MatrixEditor Component

```typescript
interface MatrixEditorProps {
  size: 2 | 3;
  value: number[][];          // Current matrix values
  onChange: (matrix: number[][]) => void;
  showValidation: boolean;    // Show gcd/det overlay
  readOnly?: boolean;         // For K⁻¹ display
}

// Validation state computed from value:
interface MatrixValidation {
  det: number;
  detMod26: number;
  gcd: number;
  isValid: boolean;
  inverse: number[][] | null;  // null if not valid
  detInverse: number | null;   // modular inverse of det
}
```

**Visual behavior:**
- Each cell: white background, monospace font, 48×48px minimum touch target
- On focus: subtle cyan glow border
- Invalid cells (if value outside 0–25): red border, shake animation
- When `isValid = false`: entire matrix grid gets a subtle red tint overlay
- When `isValid = true`: subtle green checkmark appears in top-right corner

### 5.2 StepPanel Component

```typescript
interface EncryptionStep {
  blockIndex: number;
  blockColor: string;             // Hex color for this block
  plainLetters: string[];         // e.g., ["H", "E"]
  plainNumbers: number[];         // e.g., [7, 4]
  multiplicationRows: {           // Each row of K·v
    rowCoefficients: number[];    // K row entries
    vectorEntries: number[];      // v entries
    products: number[];           // element-wise products
    rowSum: number;               // sum before mod
    resultMod: number;            // after mod 26
    resultLetter: string;         // converted back
  }[];
  cipherNumbers: number[];
  cipherLetters: string[];
}
```

### 5.3 Preset Keys

```typescript
const PRESET_KEYS = {
  "Classic Hill (2×2)": [[3, 3], [2, 5]],        // det=9, gcd(9,26)=1 ✓
  "Course Example (2×2)": [[6, 24], [1, 13]],     // det=78-24=54, 54 mod 26=2 ✗ INVALID
  "Strong 2×2": [[1, 2], [3, 5]],                 // det=5-6=-1≡25, gcd(25,26)=1 ✓
  "Classic 3×3": [[6,24,1],[13,16,10],[20,17,15]], // Hill's original example
  "Simple 3×3": [[1,2,3],[0,1,4],[5,6,0]],        // det=-1≡25, gcd(25,26)=1 ✓
}
```

---

## 6. UX/UI DESIGN SYSTEM

### 6.1 Visual Identity

**Aesthetic Direction:** *Cryptographic Terminal meets Modern Academic* — think classified document aesthetic with clean Swiss typography. Dark mode primary, with bright accent colors that feel like terminal output.

**Mood:** Sophisticated, mathematically rigorous, slightly mysterious — like you're working with classified intelligence tools, but with the clarity of a great textbook.

### 6.2 Color Palette

```css
:root {
  /* Background */
  --bg-primary:    #0A0E1A;    /* Deep navy black */
  --bg-secondary:  #111827;    /* Dark navy */
  --bg-surface:    #1C2333;    /* Card backgrounds */
  --bg-elevated:   #252D3F;    /* Hover/active states */

  /* Typography */
  --text-primary:  #E8EDF7;    /* Near-white */
  --text-secondary: #8B9DC3;   /* Muted blue-gray */
  --text-muted:    #4A5568;    /* Subtle labels */

  /* Accent — Cipher Green (matrix terminal aesthetic) */
  --accent-green:  #00FF9C;    /* Primary CTA, valid state */
  --accent-green-dim: #00CC7D; /* Hover */
  --accent-green-glow: rgba(0, 255, 156, 0.15); /* Glow effects */

  /* Accent — Cipher Gold (math formulas, highlights) */
  --accent-gold:   #FFD700;    /* LaTeX formulas, det values */
  --accent-gold-dim: #CCA600;

  /* State Colors */
  --state-valid:   #00FF9C;    /* Valid key */
  --state-invalid: #FF4757;    /* Invalid key */
  --state-warning: #FFA502;    /* Padding warning */
  --state-info:    #2F80ED;    /* Info, step numbers */

  /* Block Colors (for block tracking) */
  --block-1: #7C3AED;   /* Violet */
  --block-2: #2563EB;   /* Blue */
  --block-3: #059669;   /* Emerald */
  --block-4: #D97706;   /* Amber */
  --block-5: #DC2626;   /* Red */
  --block-6: #7C3AED;   /* Cycles */

  /* Matrix */
  --matrix-bracket: #8B9DC3;
  --matrix-cell-bg: #1C2333;
  --matrix-cell-focus: #252D3F;
  --matrix-cell-border: #2D3748;
}
```

### 6.3 Typography

```css
/* Display: Dramatic headers, product name */
--font-display: 'Syne', sans-serif;  /* Google Fonts: geometric, bold */

/* Body: Readable academic text */
--font-body: 'IBM Plex Sans', sans-serif;  /* Slightly technical feel */

/* Monospace: Matrix cells, ciphertext output, code */
--font-mono: 'JetBrains Mono', monospace;  /* Clean, distinct 0/O disambiguation */

/* Math: Inline formula labels (supplement KaTeX) */
--font-math: 'Computer Modern', serif;  /* Academic math feel */

/* Scale */
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  2rem;
--text-4xl:  2.5rem;
```

### 6.4 Matrix Component Visual Spec

```
┌──────────────────────────────────┐
│   K  (Key Matrix)          [✓]   │  ← Card header with validity badge
│                                  │
│   ┌           ┐                  │
│   │  [3]  [3] │                  │  ← Matrix bracket (CSS pseudo-elements)
│   │  [2]  [5] │                  │
│   └           ┘                  │
│                                  │
│   det(K) = 9                     │  ← Computed values in --accent-gold
│   9 mod 26 = 9                   │
│   gcd(9, 26) = 1  ← valid ✓      │
│                                  │
│   ─────── K⁻¹ (mod 26) ──────   │  ← Divider
│                                  │
│   ┌              ┐               │
│   │  [15]  [17]  │               │  ← K⁻¹ in read-only cells
│   │  [20]  [9]   │               │
│   └              ┘               │
│                                  │
│  [Load Preset ▾] [Random Valid]  │
└──────────────────────────────────┘
```

Matrix brackets are drawn using CSS `::before`/`::after` pseudo-elements with borders — NOT using actual bracket characters, for proper scaling.

### 6.5 Animations

| Interaction | Animation | Duration | Easing |
|---|---|---|---|
| Page load | Staggered fade-in of panels (top→bottom) | 400ms total | easeOut |
| Encrypt button click | Button scale 0.95→1, then output reveals | 200ms + 800ms | spring |
| Ciphertext reveal | Letters appear left-to-right with 40ms stagger per letter | Variable | easeInOut |
| Step cards appear | Slide up from below, staggered 150ms apart | 300ms each | easeOut |
| Matrix cell edit → validation update | Smooth number count-up for det value | 200ms | linear |
| Valid→Invalid transition | Matrix border color transition, badge fade | 300ms | easeInOut |
| Block color highlight | Background flash on corresponding input/output letters | 400ms | easeOut |
| Preset key load | Matrix cells individually animate to new values | 600ms total, staggered | easeInOut |

---

## 7. FUNCTIONAL REQUIREMENTS

### 7.1 Must Have (MVP)

- [ ] **F01** — Encrypt any uppercase alphabetic message using a user-defined 2×2 key matrix
- [ ] **F02** — Decrypt any Hill-ciphertext using the same 2×2 key matrix
- [ ] **F03** — Real-time key validation (gcd, det, valid/invalid display)
- [ ] **F04** — Step-by-step breakdown panel showing every arithmetic operation
- [ ] **F05** — Automatic message padding with 'X' when needed
- [ ] **F06** — Preset key loader with 3+ valid presets
- [ ] **F07** — K⁻¹ (mod 26) computation and display
- [ ] **F08** — Copy-to-clipboard for output
- [ ] **F09** — Error handling: clear messages for invalid key, empty input, non-alpha characters

### 7.2 Should Have (v1.0)

- [ ] **F10** — 3×3 matrix support with toggle
- [ ] **F11** — Block-color tracking (visual correspondence between input/output blocks)
- [ ] **F12** — Learn Mode with interactive LA concept cards
- [ ] **F13** — Random valid key generator
- [ ] **F14** — Invertibility condition visualizer (Learn Mode Card 3)
- [ ] **F15** — Mod 26 arithmetic reference table (Learn Mode Card 5)
- [ ] **F16** — KaTeX formula rendering throughout

### 7.3 Nice to Have (v1.1+)

- [ ] **F17** — Security Analysis / Known-Plaintext Attack Demo
- [ ] **F18** — Export step-by-step breakdown as PDF
- [ ] **F19** — Interactive Gaussian elimination walkthrough for K⁻¹
- [ ] **F20** — Animated "Matrix Transformation" visualization (show how K transforms the vector space)
- [ ] **F21** — History of last 10 encryptions (session storage)
- [ ] **F22** — Side-by-side compare: simple substitution cipher vs. Hill Cipher (frequency analysis)

---

## 8. ERROR HANDLING & EDGE CASES

| Scenario | Behavior |
|---|---|
| User submits empty message | Toast: "Please enter a message to encrypt" |
| Message has only spaces/punctuation | Toast: "No valid letters found. Enter A–Z characters." |
| Key matrix not yet valid | Encrypt/Decrypt buttons disabled; show red badge on matrix |
| User types letter in matrix cell | Reject input; keep previous value; subtle shake on cell |
| User types number > 25 in matrix cell | Allow but show warning; validation updates immediately |
| det(K) mod 26 = 0 | Invalid badge; specific message: "Determinant is 0 mod 26 — matrix is singular" |
| gcd(det, 26) ≠ 1 but det ≠ 0 | Invalid badge; message: "det = {n} shares factor {f} with 26 — not invertible mod 26" |
| Message length not multiple of n after stripping | Silently pad with X; show info banner: "Padded with X to complete final block" |
| 3×3 key computation fails | Extremely rare; show error with debug det value |

---

## 9. MATHEMATICAL VALIDATION TEST CASES

The coder must pass all these test cases before the app is considered complete.

```typescript
// 2×2 tests
test("Classic Hill 2x2 encrypt", () => {
  K = [[3,3],[2,5]]
  encrypt("HE") === "HI"
  encrypt("HELP") === "HIBR"
  encrypt("LINEARALGEBRA") === padded and encrypted correctly
})

test("Classic Hill 2x2 decrypt", () => {
  K = [[3,3],[2,5]]
  decrypt(encrypt("HELLO")) === "HELLO"
  decrypt(encrypt("LINEARALGEBRA")) === "LINEARALGEBRA"  // X padding stripped?
})

test("K⁻¹ computation 2x2", () => {
  K = [[3,3],[2,5]]
  // det = 15-6 = 9
  // 9⁻¹ mod 26 = 3 (since 9×3=27≡1 mod 26)
  // adj = [[5,-3],[-2,3]]
  // K⁻¹ = 3 × [[5,23],[24,3]] mod 26 = [[15,17],[20,9]]
  inverse([[3,3],[2,5]]) deep equals [[15,17],[20,9]]
})

test("Validity check", () => {
  isValid([[3,3],[2,5]]) === true     // det=9, gcd(9,26)=1
  isValid([[2,4],[6,8]]) === false    // det=-8, gcd(8,26)=2
  isValid([[1,0],[0,1]]) === true     // identity, det=1
  isValid([[13,0],[0,2]]) === false   // det=26, gcd(26,26)=26
})

test("Mod 26 wrap-around", () => {
  modInverse(9, 26)  === 3
  modInverse(3, 26)  === 9
  modInverse(5, 26)  === 21
  modInverse(2, 26)  === null  // gcd(2,26)=2, no inverse
  modInverse(13, 26) === null  // gcd(13,26)=13
})

// 3×3 test
test("Classic 3x3 encrypt", () => {
  K = [[6,24,1],[13,16,10],[20,17,15]]
  // Hill's original 1929 example
  encrypt("ACT") === "POH"
})
```

---

## 10. PRESENTATION-READY FEATURES

Since this is a **final project**, the app should impress when presented. These features make it demo-friendly:

### 10.1 "Live Lecture Mode"

- Toggle in top-right: **[📽 Lecture Mode]**
- When active:
  - Font sizes increase by 1.5×
  - All panels adjust to fit a 1920×1080 projection
  - Step-by-step auto-plays with a 2-second delay between steps
  - Color scheme softens (reduce contrast for projector readability)

### 10.2 "Exam Example" Quick-Load

- Button: **[📋 Load Course Example]**
- Instantly loads:
  - Message: "HELLO"
  - Key: [[3,3],[2,5]]
  - Step-by-step mode: ON
  - Learn mode: shows Result 1 (Decryption Correctness proof)

### 10.3 Mathematical Proof Panel

- Accessible from sidebar: **[∑ Proofs]**
- Three expandable proof cards matching the paper's Section 5:

  **Proof 1 — Decryption Correctness**
  ```
  K⁻¹(Kp) ≡ (K⁻¹K)p ≡ Ip ≡ p  (mod 26)
  ```
  
  **Proof 2 — Invertibility Condition**
  ```
  K invertible mod 26  ⟺  ∃ (det K)⁻¹ mod 26  ⟺  gcd(det K, 26) = 1
  ```
  
  **Proof 3 — Non-Injective Counterexample**
  ```
  K = [[2,4],[6,8]], det = -8 ≡ 18 (mod 26), gcd(18,26) = 2 ≠ 1
  → Two distinct plaintexts map to the same ciphertext (shown with example)
  ```

---

## 11. IMPLEMENTATION TIMELINE

| Phase | Tasks | Days |
|---|---|---|
| **Phase 1: Math Engine** | Implement and test all functions in `/math/`. Pass all 15+ unit tests. | Days 1–2 |
| **Phase 2: Core UI** | MatrixEditor, MessageInput, basic encrypt/decrypt flow working. | Days 3–4 |
| **Phase 3: Steps & Polish** | StepPanel, block colors, animations, validation UI. | Days 5–6 |
| **Phase 4: Learn Mode** | All 6 concept cards, KaTeX formulas, interactive elements. | Days 7–8 |
| **Phase 5: Attack + Proofs** | Security analysis screen, proof panel, lecture mode. | Days 9–10 |
| **Phase 6: QA + Polish** | Cross-browser testing, mobile responsiveness, final design pass. | Days 11–12 |

---

## 12. DELIVERABLES CHECKLIST

For the final project submission:

- [ ] Working deployed URL (Vercel/Netlify)
- [ ] GitHub repository with clean commit history
- [ ] All 15+ math unit tests passing
- [ ] README with mathematical explanation of each core function
- [ ] Short demo video (2–3 minutes): show encrypt, decrypt, steps, learn mode
- [ ] Poster slide using app screenshots (if poster presentation required)

---

## APPENDIX A: Full Letter-Number Reference Table

| # | Letter | # | Letter | # | Letter |
|---|---|---|---|---|---|
| 0 | A | 9 | J | 18 | S |
| 1 | B | 10 | K | 19 | T |
| 2 | C | 11 | L | 20 | U |
| 3 | D | 12 | M | 21 | V |
| 4 | E | 13 | N | 22 | W |
| 5 | F | 14 | O | 23 | X |
| 6 | G | 15 | P | 24 | Y |
| 7 | H | 16 | Q | 25 | Z |
| 8 | I | 17 | R | | |

## APPENDIX B: Invertible Elements mod 26

| a | a⁻¹ mod 26 | | a | a⁻¹ mod 26 |
|---|---|---|---|---|
| 1 | 1 | | 15 | 7 |
| 3 | 9 | | 17 | 23 |
| 5 | 21 | | 19 | 11 |
| 7 | 15 | | 21 | 5 |
| 9 | 3 | | 23 | 17 |
| 11 | 19 | | 25 | 25 |

*Non-invertible mod 26: {2, 4, 6, 8, 10, 12, 13, 14, 16, 18, 20, 22, 24, 0}*

---

*Document prepared for Hill Cipher Studio · Linear Algebra Final Project · v1.0*
