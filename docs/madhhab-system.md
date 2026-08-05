# Multi-Madhhab Inheritance System Specification (`src/madhahib/`)

Islamic jurisprudence contains well-documented jurisprudential variations (*Ikhtilāf*) among the four major Sunni schools of thought (Shāfiʿī, Ḥanafī, Mālikī, Ḥanbalī) and the majority consensus (*Jumhūr*).

This document details how the calculator models school-specific rules.

---

## 🏛️ Overview of School Engines

| Feature / Issue | Shāfiʿī (`shafii/`) | Ḥanafī (`hanafi/`) | Mālikī (`maliki/`) | Ḥanbalī (`hanbali/`) | Jumhūr (`jumhur/`) |
|---|---|---|---|---|---|
| **Radd (Redistribution)** | Classically Bayt al-Māl; Modern fallback to blood heirs | Applies to all blood sharers | Classically Bayt al-Māl | Applies to all blood sharers | User selectable |
| **Grandfather vs Siblings** | Shared inheritance (*Muqāsama*) | Grandfather blocks all siblings | Shared inheritance (*Muqāsama*) | Shared inheritance (*Muqāsama*) | Configurable sub-mode |
| **Dhawū al-Arḥām** | Classically no inheritance; fallback mode enabled | Classically inherit by Class order | Classically no inheritance | Inherit by *Tanzīl* (representation) | Configurable sub-mode |
| **Al-Gharrawiyyatayn** | Mother takes $1/3$ of remainder | Mother takes $1/3$ of remainder | Mother takes $1/3$ of remainder | Mother takes $1/3$ of remainder | Mother takes $1/3$ of remainder |
| **Al-Mushtarakah** | Full brothers share $1/3$ with maternal siblings | Full brothers receive $0$ (residuary exhausted) | Full brothers share $1/3$ with maternal siblings | Full brothers receive $0$ (residuary exhausted) | Configurable |

---

## 🔍 School-by-School Rule Matrix

### 1. Shāfiʿī School (`src/madhahib/shafii/`)
- **Strict Classical Mode**: Surplus estate goes to *Bayt al-Māl* (Public Treasury) if well-administered.
- **Modern Fallback Mode**: If *Bayt al-Māl* is absent, Radd and Dhawū al-Arḥām modes are enabled (`dhawuAlArhamMode: 'enabledWhenNoBaytulMal'`).
- **Grandfather with Siblings**: Grandfather gets the maximum of:
  1. $1/6$ of total estate
  2. *Muqāsama* (sharing as a brother)
  3. $1/3$ of remainder (when fixed sharers exist)
- **Al-Mushtarakah (Al-Ḥimāriyyah)**: Accepted — Full brothers share the maternal $1/3$ equally with maternal siblings when estate is exhausted by Husband ($1/2$) + Mother ($1/6$) + Maternal Siblings ($1/3$).

### 2. Ḥanafī School (`src/madhahib/hanafi/`)
- **Radd**: Always applied to blood sharers (Spouse excluded from Radd unless no blood heirs or treasury exist).
- **Grandfather with Siblings**: Paternal Grandfather **totally blocks** all brothers and sisters (treats Grandfather as Father in blocking power).
- **Dhawū al-Arḥām**: Classified into 4 strict hierarchical classes:
  1. Class 1: Descendants of deceased (Daughter's children)
  2. Class 2: Ascendants of deceased (Maternal Grandfather)
  3. Class 3: Descendants of parents (Sister's children, Brother's daughters)
  4. Class 4: Descendants of grandparents (Maternal Uncles, Aunts, Paternal Aunts)
- **Al-Mushtarakah**: Rejected — Full brother remains a pure residuary; receives $0$ because fixed shares equal $1$.

### 3. Mālikī School (`src/madhahib/maliki/`)
- **Radd & Treasury**: Estate surplus strictly defaults to Public Treasury (*Bayt al-Māl*).
- **Grandfather with Siblings**: *Muqāsama* applies, with specific rules on female siblings and *Al-Akdariyya*.
- **Al-Mushtarakah**: Accepted.

### 4. Ḥanbalī School (`src/madhahib/hanbali/`)
- **Radd**: Applies Radd to blood sharers.
- **Dhawū al-Arḥām**: Uses the principle of **Tanzīl** (Representation): each distant relative steps into the shoes of the link heir through whom they connect to the deceased (e.g. Daughter's son inherits as Daughter).
- **Grandfather with Siblings**: *Muqāsama* applies with *Tanzīl* rules.
- **Al-Mushtarakah**: Rejected.

---

## 🛠️ Configuring School Overrides in Code

Options can be passed directly to `calculateInheritance`:

```javascript
import { calculateInheritance } from 'src/madhahib/shafii/index.js';

const result = calculateInheritance(
    { wife: 1, daughter: 1 },
    {
        raddMode: 'returnToHeirs',               // 'baytulMal' | 'returnToHeirs'
        dhawuAlArhamMode: 'enabledWhenNoBaytulMal' // 'disabled' | 'enabledWhenNoBaytulMal'
    }
);
```
