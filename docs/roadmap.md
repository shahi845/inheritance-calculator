# Product & Architecture Roadmap

This roadmap outlines the planned evolution of the **Farā'iḍ Calculator & Educational Platform** from v1.0 through v2.0.

---

## 🎯 Release Milestones Overview

```text
v1.0 (Core Engine & Test Platform)
  ↓
v1.1 (Rule Trace & Explanation Engine)
  ↓
v1.2 (Interactive Comparison & Visualizations)
  ↓
v2.0 (Public API, Internationalization & Analytics)
```

---

## 🚩 Version 1.0 — Core Engine & Platform Stabilization (Current)

- [x] Complete 6-phase inheritance pipeline supporting Shāfiʿī, Ḥanafī, Mālikī, Ḥanbalī, and Jumhūr.
- [x] Automated test framework with 785+ passing tests and 100% rule coverage.
- [x] Exact fraction arithmetic engine eliminating floating-point errors.
- [x] Performance benchmark suite achieving ~40,000 operations/second.
- [x] GitHub Actions CI pipeline for automated testing on push and PR.
- [x] Comprehensive architectural documentation (`docs/`).

---

## 🚩 Version 1.1 — Rule Trace & Educational Explanations (Next Phase)

### 1. Step-by-Step Rule Trace UI
- Display the calculation flow step-by-step:
  `Input` $\to$ `Validation` $\to$ `Blocking` $\to$ `Fixed Shares` $\to$ `Awl` $\to$ `Radd` $\to$ `Residue` $\to$ `Final Shares`.
- Allow users to click on any step to see intermediate numerators/denominators.

### 2. Heir Explanation Cards
- Every heir entry will display an expandable explanation accordion:
  - **Why did this heir inherit?** (e.g. "Daughter is a primary Quranic sharer").
  - **Why this fraction?** (e.g. "Single daughter receives 1/2 pursuant to Surah An-Nisa 4:11").
  - **Which Madhhab rule was applied?** (e.g. "Shāfiʿī modern fallback mode returned remainder by Radd").

### 3. Categorized Sample Cases Library
- Group practice cases into intuitive educational topics:
  - *Parents*, *Children*, *Siblings*, *Grandfather with Siblings*, *ʿAwl Cases*, *Radd Cases*, *Munāsakhāt*, *Blocking*, *Mixed Classical Cases*.

---

## 🚩 Version 1.2 — Visual Family Tree & Interactive Comparison

### 1. Color-Coded Family Tree Visualizer
- Enhance family tree node rendering:
  - 🟩 **Green badge**: Inheriting fixed-share heir (*Aṣḥāb al-Furūḍ*)
  - 🟦 **Blue badge**: Inheriting agnatic residuary (*ʿAṣabah*)
  - 🟥 **Red badge / Strikethrough**: Blocked heir (*Maḥjūb*)
  - 🟨 **Yellow badge**: Distant kindred (*Dhawū al-Arḥām*)

### 2. Side-by-Side Madhhab Comparison View
- Select one case and compare results across **all 4 Sunni schools + Jumhūr simultaneously** in a side-by-side table highlighting jurisprudential divergences.

### 3. PDF Export & Printable Reports
- Generate clean, formal inheritance division reports (PDF/Print) suitable for legal or estate planning review.

---

## 🚩 Version 2.0 — Public API & Global Platform

### 1. Public REST / NPM Engine API
- Package `faraid-engine` as a standalone zero-dependency ESM package on npm.

### 2. Multi-Language Internationalization (i18n)
- Full Arabic, English, Bahasa Indonesia, Urdu, and French localized UI & evidence terms.

### 3. Advanced Munāsakhāt Graph Visualizer
- Interactive node graph visualization for multi-generational sequential estate calculations.
