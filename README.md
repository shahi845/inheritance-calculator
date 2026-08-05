# Fara'id (Islamic Inheritance Calculator)

An advanced, highly transparent, and educational Fara'id Rule Engine and Calculator. This project goes beyond basic calculation by tracking every decision, verifying results via a robust rules engine, and explaining the scholarly reasoning behind each share.

## Features

- **Verification Center**: A built-in validation engine ensuring 100% confidence in calculations (checks awl, radd, fractions, and internal consistency).
- **Transparent Decisions**: Every heir's share is accompanied by its reason, evidence (Qur'an/Hadith), Rule ID, and scholarly reference.
- **Execution Timeline**: Step-by-step breakdown of how the estate is distributed.
- **Rule Inspector (Developer Mode)**: View all executed and skipped rules during calculation.
- **Interactive Family Tree**: Visual representation of the deceased's heirs, color-coded by their inheritance status.
- **Estate Flow Diagram**: Visualize the breakdown of the estate (Funeral -> Debt -> Will -> Remaining -> Shares).
- **Extensive Case Explorer**: Hundreds of built-in examples ranging from basic to rare cases (Munasakhat, Akdariyyah, Mushtaraka).
- **Learning Mode**: Contextual quizzes at the end of calculations to test your knowledge of Fara'id.

## Architecture

The project is structured as a robust Rule Engine, cleanly separating state, logic, and presentation.

### Folder Structure

```text
src/
├── app/          # Application routing and initialization
├── core/         # Core engine interfaces and context builder
├── data/         # Madhhab rules, case library, evidences, and heir definitions
├── engine/       # The core calculation logic and Verification Engine
├── features/     # Feature modules (e.g., Munasakhat, Learning Mode)
├── madhahib/     # Specific implementations for all 4 Madhhabs
├── math/         # Fractional math and numeric utilities
├── styles/       # CSS stylesheets
├── tests/        # Automated test suites
├── ui/           # Visual components (Family Tree, Rule Inspector, Estate Flow)
└── utils/        # Shared utilities
```

### Calculation Flow

The calculation is orchestrated by `calculateInheritance.js` through a strict execution timeline:
1. **Normalize Input**: Sanitize and format legacy inputs.
2. **Validate**: Check for mutually exclusive or invalid combinations.
3. **Determine Heirs**: Evaluate the presence of all heirs.
4. **Apply Blocking (Ḥajb)**: Determine which heirs are excluded by closer relatives.
5. **Assign Fixed Shares**: Allocate Qur'anic shares to eligible heirs.
6. **ʿAwl (Overflow)**: Proportionally reduce shares if the sum exceeds 1.
7. **ʿAṣabah (Residuaries)**: Allocate remaining estate to residuary heirs.
8. **Radd (Return)**: Return surplus to sharers if no residuaries exist.
9. **Madhhab Adjustments**: Apply specific rules (e.g., grandfather with siblings).
10. **Final Distribution & Verification**: The Verification Engine asserts consistency.

## Supported Madhhabs

Currently focused on the **Shafi'i** and **Jumhur (Majority)** rules. Future releases will include deep support for Hanafi, Maliki, and Hanbali variances.

## Supported Heirs

The engine evaluates over 35 distinct heirs, including distant kindred (Dhawu al-Arham) and complex multi-generational configurations.

## Testing

The engine is heavily tested against hundreds of classical Fara'id problems.

```bash
# Run the entire test suite
npm run test:all

# Run specific categories
npm run test:categories
```

## Contributing

We welcome contributions! Please check the `docs/` folder for architecture deep-dives and testing guidelines before submitting a Pull Request. Make sure all tests pass and coverage is maintained.

## License

MIT License. See `LICENSE` for details.
