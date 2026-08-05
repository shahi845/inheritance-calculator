# Testing Framework & Quality Assurance (`src/tests/`)

The **Farā'iḍ Calculator** features an automated testing framework designed to prevent regressions, verify multi-school compliance, evaluate performance, and validate edge cases.

---

## 🏃 Running Tests

### 1. Node.js Command Line Interface
```bash
# Run all unit tests and rule coverage checks
npm test

# Run single category suite (e.g. stress, awl, radd, blocking, fixedShares)
npm run test:stress

# Run performance speed benchmarks
npm run test:benchmark

# Run munasakhat tests
npm run test:munasakhat
```

### 2. Interactive Browser Test Suite
Launch the Vite dev server (`npm run dev`) and open the application in your browser. Click the floating **🧪 Run Tests** button in the bottom right corner or press **[T]** to open the interactive test results overlay panel.

---

## 🏗️ Architecture & Component Boundaries

```text
src/tests/
├── runNode.js            # Node CLI entry point
├── runBrowser.js         # Browser DOM overlay entry point
├── runBenchmark.js       # Execution speed benchmark runner
├── runner/
│   ├── runAllTests.js    # Suite orchestrator & aggregator
│   ├── runCategory.js   # Single category isolator
│   ├── testContext.js    # Engine dispatch & key normaliser
│   ├── benchmarkRunner.js# Speed benchmarking engine
│   └── coverageCalculator.js # Rule & category coverage calculator
├── validators/
│   ├── validateEstate.js   # Estate sum ≤ 1 check
│   ├── validateShares.js   # Fraction reduction & status check
│   ├── validateBlocking.js # Blocked zero-share check
│   ├── validateAwl.js      # ʿAwl flags & exact unit sum check
│   ├── validateRadd.js     # Radd redistribution check
│   └── validateResults.js  # Master validator
├── generators/
│   ├── randomCaseGenerator.js # Seeded PRNG case generator
│   ├── validCaseGenerator.js  # Baseline coverage generator
│   └── edgeCaseGenerator.js   # Programmatic edge families
├── reports/
│   ├── consoleReporter.js # Terminal output with progress bars
│   ├── htmlReporter.js    # Browser overlay panel & test-report.html
│   └── jsonReporter.js    # LocalStorage & test-results.json writer
└── categories/            # 10 domain test suites
```

---

## 📊 Automated Rule Coverage Engine

The test framework evaluates test pass rates across 9 core jurisprudence domains:

| Category | Domain Tested |
|---|---|
| **Fixed Shares** | Spouses, Parents, Grandparents, Daughters, Sisters, Maternal Siblings |
| **Blocking (Ḥajb)** | Total exclusion (*Ḥajb Ḥirmān*) & Partial reduction (*Ḥajb Nuqṣān*) |
| **ʿAwl** | Proportional reduction when sum > 1 (base 6, 12, 24) |
| **Radd** | Redistribution to blood sharers when sum < 1 |
| **Grandfather** | Paternal Grandfather competing with siblings (*Muqāsama*) |
| **Dhawū al-Arḥām** | Distant kindred inheritance classes & Tanzīl |
| **Munāsakhāt** | Multi-generational sequential deaths |
| **Cross-Madhhab** | Divergence detection across Shāfiʿī, Ḥanafī, Mālikī, Ḥanbalī |
| **Golden Regression** | Hand-verified historical golden snapshots |

---

## ⚡ Execution Speed Benchmarking

The benchmark runner measures engine throughput over 100, 1,000, and 10,000 randomized and edge-case calculations:

```text
 ⚡    100 cases :     3.8 ms | 0.0382 ms/case |   26,155 ops/sec
 ⚡  1,000 cases :    32.3 ms | 0.0323 ms/case |   30,999 ops/sec
 ⚡ 10,000 cases :   250.5 ms | 0.0251 ms/case |   39,918 ops/sec

 Performance Rating : Exceptional
```

---

## 🤖 Continuous Integration (GitHub Actions)

The repository includes a GitHub Actions workflow (`.github/workflows/test.yml`) that runs on every `push` and `pull_request`:
- Installs Node.js & dependencies.
- Executes `node src/tests/runNode.js`.
- Uploads `test-report.html` and `test-results.json` build artifacts.
- Runs `node src/tests/runBenchmark.js`.
