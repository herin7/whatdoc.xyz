export const demoProjects = {

    // =========================================================
    // TWILIO STYLE — ENTERPRISE API DOCUMENTATION
    // =========================================================
    'twilio-demo': {
        repoName: 'scipy/scipy',
        techstack: 'Python • Numerical Computing • Research',
        updatedAt: new Date(),
        template: 'aerolatex',

        generatedDocs: `

## Introduction

SciPy is a fundamental library for scientific computing in Python.

Domains supported:

- Numerical optimization
- Signal analysis
- Sparse matrices
- Linear algebra
- Statistical modeling

---

## Linear Algebra

LU decomposition:

$A = PLU$

\`\`\`python
from scipy import linalg
import numpy as np

A = np.array([[1,2],[3,4]])
P,L,U = linalg.lu(A)
\`\`\`

### Complexity Table

| Algorithm | Complexity |
| --- | --- |
| LU | O(n^3) |
| QR | O(n^3) |
| SVD | O(n^3) |

---

## Eigenvalue Analysis

\`\`\`python
vals, vecs = linalg.eig(A)
\`\`\`

Applications:

- PCA
- Stability systems
- Quantum physics
- Control theory

---

## Sparse Matrix Ecosystem

\`\`\`python
from scipy.sparse import csr_matrix
A = csr_matrix([[0,0,5],[1,0,0]])
\`\`\`

| Format | Advantage |
| --- | --- |
| CSR | Fast arithmetic |
| CSC | Efficient slicing |
| COO | Easy construction |

---

## Optimization

\`\`\`python
from scipy.optimize import minimize

f = lambda x: (x-2)**2
res = minimize(f, x0=10)
\`\`\`

Algorithms:

- BFGS
- CG
- Newton-CG
- Nelder-Mead

---

## Signal Processing

\`\`\`python
from scipy.fft import fft
fft([1,2,3,4])
\`\`\`

Use cases:

- Voice analysis
- Spectrum detection
- Wireless communication

---

## Numerical Stability

Guidelines:

- Prefer decomposition over inversion.
- Normalize data.
- Use float64 precision.

\`\`\`python
x = linalg.solve(A,b)
\`\`\`

---

## Performance Engineering

Tips:

- Vectorize operations
- Minimize allocations
- Use BLAS-accelerated builds

\`\`\`python
import numexpr as ne
ne.evaluate("a*b + c")
\`\`\`

---

## Scientific Workflows

Typical pipeline:

\`\`\`txt
Raw Data
   ↓
Normalization
   ↓
Matrix Operations
   ↓
Optimization
   ↓
Visualization
\`\`\`

---

## Real-World Impact

SciPy powers:

- Space simulations
- MRI processing
- Financial derivatives
- AI preprocessing
- Fluid dynamics

---

## Research-Grade Practices

- Reproducible experiments
- Deterministic seeds
- Version pinning
- Numerical validation

`
    }
    ,
    // =========================================================
    // AERO LATEX — ACADEMIC / SCIENTIFIC STYLE
    // =========================================================
    'aerolatex-demo': {
        repoName: 'scipy/scipy',
        techstack: 'Python • Numerical Computing • Research',
        updatedAt: new Date(),
        template: 'aerolatex',
        generatedDocs: `

## Introduction

SciPy is a fundamental library for scientific computing in Python.

Domains supported:

- Numerical optimization
- Signal analysis
- Sparse matrices
- Linear algebra
- Statistical modeling

---

## Linear Algebra

LU decomposition:

$A = PLU$

\`\`\`python
from scipy import linalg
import numpy as np

A = np.array([[1,2],[3,4]])
P,L,U = linalg.lu(A)
\`\`\`

### Complexity Table

| Algorithm | Complexity |
| --- | --- |
| LU | O(n^3) |
| QR | O(n^3) |
| SVD | O(n^3) |

---

## Eigenvalue Analysis

\`\`\`python
vals, vecs = linalg.eig(A)
\`\`\`

Applications:

- PCA
- Stability systems
- Quantum physics
- Control theory

---

## Sparse Matrix Ecosystem

\`\`\`python
from scipy.sparse import csr_matrix
A = csr_matrix([[0,0,5],[1,0,0]])
\`\`\`

| Format | Advantage |
| --- | --- |
| CSR | Fast arithmetic |
| CSC | Efficient slicing |
| COO | Easy construction |

---

## Optimization

\`\`\`python
from scipy.optimize import minimize

f = lambda x: (x-2)**2
res = minimize(f, x0=10)
\`\`\`

Algorithms:

- BFGS
- CG
- Newton-CG
- Nelder-Mead

---

## Signal Processing

\`\`\`python
from scipy.fft import fft
fft([1,2,3,4])
\`\`\`

Use cases:

- Voice analysis
- Spectrum detection
- Wireless communication

---

## Numerical Stability

Guidelines:

- Prefer decomposition over inversion.
- Normalize data.
- Use float64 precision.

\`\`\`python
x = linalg.solve(A,b)
\`\`\`

---

## Performance Engineering

Tips:

- Vectorize operations
- Minimize allocations
- Use BLAS-accelerated builds

\`\`\`python
import numexpr as ne
ne.evaluate("a*b + c")
\`\`\`

---

## Scientific Workflows

Typical pipeline:

\`\`\`txt
Raw Data
   ↓
Normalization
   ↓
Matrix Operations
   ↓
Optimization
   ↓
Visualization
\`\`\`

---

## Real-World Impact

SciPy powers:

- Space simulations
- MRI processing
- Financial derivatives
- AI preprocessing
- Fluid dynamics

---

## Research-Grade Practices

- Reproducible experiments
- Deterministic seeds
- Version pinning
- Numerical validation

`
    },
    'modern-demo': {
        repoName: 'scipy/scipy',
        techstack: 'Python • Numerical Computing • Research',
        updatedAt: new Date(),
        template: 'aerolatex',

        generatedDocs: `

## Introduction

SciPy is a fundamental library for scientific computing in Python.

Domains supported:

- Numerical optimization
- Signal analysis
- Sparse matrices
- Linear algebra
- Statistical modeling

---

## Linear Algebra

LU decomposition:

$A = PLU$

\`\`\`python
from scipy import linalg
import numpy as np

A = np.array([[1,2],[3,4]])
P,L,U = linalg.lu(A)
\`\`\`

### Complexity Table

| Algorithm | Complexity |
| --- | --- |
| LU | O(n^3) |
| QR | O(n^3) |
| SVD | O(n^3) |

---

## Eigenvalue Analysis

\`\`\`python
vals, vecs = linalg.eig(A)
\`\`\`

Applications:

- PCA
- Stability systems
- Quantum physics
- Control theory

---

## Sparse Matrix Ecosystem

\`\`\`python
from scipy.sparse import csr_matrix
A = csr_matrix([[0,0,5],[1,0,0]])
\`\`\`

| Format | Advantage |
| --- | --- |
| CSR | Fast arithmetic |
| CSC | Efficient slicing |
| COO | Easy construction |

---

## Optimization

\`\`\`python
from scipy.optimize import minimize

f = lambda x: (x-2)**2
res = minimize(f, x0=10)
\`\`\`

Algorithms:

- BFGS
- CG
- Newton-CG
- Nelder-Mead

---

## Signal Processing

\`\`\`python
from scipy.fft import fft
fft([1,2,3,4])
\`\`\`

Use cases:

- Voice analysis
- Spectrum detection
- Wireless communication

---

## Numerical Stability

Guidelines:

- Prefer decomposition over inversion.
- Normalize data.
- Use float64 precision.

\`\`\`python
x = linalg.solve(A,b)
\`\`\`

---

## Performance Engineering

Tips:

- Vectorize operations
- Minimize allocations
- Use BLAS-accelerated builds

\`\`\`python
import numexpr as ne
ne.evaluate("a*b + c")
\`\`\`

---

## Scientific Workflows

Typical pipeline:

\`\`\`txt
Raw Data
   ↓
Normalization
   ↓
Matrix Operations
   ↓
Optimization
   ↓
Visualization
\`\`\`

---

## Real-World Impact

SciPy powers:

- Space simulations
- MRI processing
- Financial derivatives
- AI preprocessing
- Fluid dynamics

---

## Research-Grade Practices

- Reproducible experiments
- Deterministic seeds
- Version pinning
- Numerical validation

`
    },
    'minimal-demo': {
        repoName: 'scipy/scipy',
        techstack: 'Python • Numerical Computing • Research',
        updatedAt: new Date(),
        template: 'aerolatex',

        generatedDocs: `

## Introduction

SciPy is a fundamental library for scientific computing in Python.

Domains supported:

- Numerical optimization
- Signal analysis
- Sparse matrices
- Linear algebra
- Statistical modeling

---

## Linear Algebra

LU decomposition:

$A = PLU$

\`\`\`python
from scipy import linalg
import numpy as np

A = np.array([[1,2],[3,4]])
P,L,U = linalg.lu(A)
\`\`\`

### Complexity Table

| Algorithm | Complexity |
| --- | --- |
| LU | O(n^3) |
| QR | O(n^3) |
| SVD | O(n^3) |

---

## Eigenvalue Analysis

\`\`\`python
vals, vecs = linalg.eig(A)
\`\`\`

Applications:

- PCA
- Stability systems
- Quantum physics
- Control theory

---

## Sparse Matrix Ecosystem

\`\`\`python
from scipy.sparse import csr_matrix
A = csr_matrix([[0,0,5],[1,0,0]])
\`\`\`

| Format | Advantage |
| --- | --- |
| CSR | Fast arithmetic |
| CSC | Efficient slicing |
| COO | Easy construction |

---

## Optimization

\`\`\`python
from scipy.optimize import minimize

f = lambda x: (x-2)**2
res = minimize(f, x0=10)
\`\`\`

Algorithms:

- BFGS
- CG
- Newton-CG
- Nelder-Mead

---

## Signal Processing

\`\`\`python
from scipy.fft import fft
fft([1,2,3,4])
\`\`\`

Use cases:

- Voice analysis
- Spectrum detection
- Wireless communication

---

## Numerical Stability

Guidelines:

- Prefer decomposition over inversion.
- Normalize data.
- Use float64 precision.

\`\`\`python
x = linalg.solve(A,b)
\`\`\`

---

## Performance Engineering

Tips:

- Vectorize operations
- Minimize allocations
- Use BLAS-accelerated builds

\`\`\`python
import numexpr as ne
ne.evaluate("a*b + c")
\`\`\`

---

## Scientific Workflows

Typical pipeline:

\`\`\`txt
Raw Data
   ↓
Normalization
   ↓
Matrix Operations
   ↓
Optimization
   ↓
Visualization
\`\`\`

---

## Real-World Impact

SciPy powers:

- Space simulations
- MRI processing
- Financial derivatives
- AI preprocessing
- Fluid dynamics

---

## Research-Grade Practices

- Reproducible experiments
- Deterministic seeds
- Version pinning
- Numerical validation

`
    }
    ,
    'django-demo': {
        repoName: 'scipy/scipy',
        techstack: 'Python • Numerical Computing • Research',
        updatedAt: new Date(),
        template: 'aerolatex',

        generatedDocs: `

## Introduction

SciPy is a fundamental library for scientific computing in Python.

Domains supported:

- Numerical optimization
- Signal analysis
- Sparse matrices
- Linear algebra
- Statistical modeling

---

## Linear Algebra

LU decomposition:

$A = PLU$

\`\`\`python
from scipy import linalg
import numpy as np

A = np.array([[1,2],[3,4]])
P,L,U = linalg.lu(A)
\`\`\`

### Complexity Table

| Algorithm | Complexity |
| --- | --- |
| LU | O(n^3) |
| QR | O(n^3) |
| SVD | O(n^3) |

---

## Eigenvalue Analysis

\`\`\`python
vals, vecs = linalg.eig(A)
\`\`\`

Applications:

- PCA
- Stability systems
- Quantum physics
- Control theory

---

## Sparse Matrix Ecosystem

\`\`\`python
from scipy.sparse import csr_matrix
A = csr_matrix([[0,0,5],[1,0,0]])
\`\`\`

| Format | Advantage |
| --- | --- |
| CSR | Fast arithmetic |
| CSC | Efficient slicing |
| COO | Easy construction |

---

## Optimization

\`\`\`python
from scipy.optimize import minimize

f = lambda x: (x-2)**2
res = minimize(f, x0=10)
\`\`\`

Algorithms:

- BFGS
- CG
- Newton-CG
- Nelder-Mead

---

## Signal Processing

\`\`\`python
from scipy.fft import fft
fft([1,2,3,4])
\`\`\`

Use cases:

- Voice analysis
- Spectrum detection
- Wireless communication

---

## Numerical Stability

Guidelines:

- Prefer decomposition over inversion.
- Normalize data.
- Use float64 precision.

\`\`\`python
x = linalg.solve(A,b)
\`\`\`

---

## Performance Engineering

Tips:

- Vectorize operations
- Minimize allocations
- Use BLAS-accelerated builds

\`\`\`python
import numexpr as ne
ne.evaluate("a*b + c")
\`\`\`

---

## Scientific Workflows

Typical pipeline:

\`\`\`txt
Raw Data
   ↓
Normalization
   ↓
Matrix Operations
   ↓
Optimization
   ↓
Visualization
\`\`\`

---

## Real-World Impact

SciPy powers:

- Space simulations
- MRI processing
- Financial derivatives
- AI preprocessing
- Fluid dynamics

---

## Research-Grade Practices

- Reproducible experiments
- Deterministic seeds
- Version pinning
- Numerical validation

`
    },
    'mdn-demo': {
        repoName: 'scipy/scipy',
        techstack: 'Python • Numerical Computing • Research',
        updatedAt: new Date(),
        template: 'aerolatex',

        generatedDocs: `

## Introduction

SciPy is a fundamental library for scientific computing in Python.

Domains supported:

- Numerical optimization
- Signal analysis
- Sparse matrices
- Linear algebra
- Statistical modeling

---

## Linear Algebra

LU decomposition:

$A = PLU$

\`\`\`python
from scipy import linalg
import numpy as np

A = np.array([[1,2],[3,4]])
P,L,U = linalg.lu(A)
\`\`\`

### Complexity Table

| Algorithm | Complexity |
| --- | --- |
| LU | O(n^3) |
| QR | O(n^3) |
| SVD | O(n^3) |

---

## Eigenvalue Analysis

\`\`\`python
vals, vecs = linalg.eig(A)
\`\`\`

Applications:

- PCA
- Stability systems
- Quantum physics
- Control theory

---

## Sparse Matrix Ecosystem

\`\`\`python
from scipy.sparse import csr_matrix
A = csr_matrix([[0,0,5],[1,0,0]])
\`\`\`

| Format | Advantage |
| --- | --- |
| CSR | Fast arithmetic |
| CSC | Efficient slicing |
| COO | Easy construction |

---

## Optimization

\`\`\`python
from scipy.optimize import minimize

f = lambda x: (x-2)**2
res = minimize(f, x0=10)
\`\`\`

Algorithms:

- BFGS
- CG
- Newton-CG
- Nelder-Mead

---

## Signal Processing

\`\`\`python
from scipy.fft import fft
fft([1,2,3,4])
\`\`\`

Use cases:

- Voice analysis
- Spectrum detection
- Wireless communication

---

## Numerical Stability

Guidelines:

- Prefer decomposition over inversion.
- Normalize data.
- Use float64 precision.

\`\`\`python
x = linalg.solve(A,b)
\`\`\`

---

## Performance Engineering

Tips:

- Vectorize operations
- Minimize allocations
- Use BLAS-accelerated builds

\`\`\`python
import numexpr as ne
ne.evaluate("a*b + c")
\`\`\`

---

## Scientific Workflows

Typical pipeline:

\`\`\`txt
Raw Data
   ↓
Normalization
   ↓
Matrix Operations
   ↓
Optimization
   ↓
Visualization
\`\`\`

---

## Real-World Impact

SciPy powers:

- Space simulations
- MRI processing
- Financial derivatives
- AI preprocessing
- Fluid dynamics

---

## Research-Grade Practices

- Reproducible experiments
- Deterministic seeds
- Version pinning
- Numerical validation

`
    }

};