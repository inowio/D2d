# Testing

## Coverage Summary

- **Conversion engine (Vitest)** — 100+ unit tests in
  [`src/utils/conversions.test.ts`](src/utils/conversions.test.ts) cover every
  function exported from
  [`src/utils/conversions.ts`](src/utils/conversions.ts):
  - Base conversions — binary, hexadecimal, decimal, octal (all directions).
  - Encodings — ASCII ⇄ hex/binary, BCD, Gray code.
  - Advanced numerics — signed/unsigned (8/16/32/64-bit), Base-N (2–36), and
    IEEE 754 single/double precision.
  - Edge cases — empty input, whitespace handling, `0x` prefixes,
    arbitrary-precision values, and invalid-input error messages.

## Commands

```bash
npm run test     # Run the full suite once (vitest run)
```

To watch files while developing, run Vitest directly:

```bash
npx vitest       # Re-run affected tests on change
```

## Conventions

- Tests run on the default Vitest Node environment — the conversion engine is
  pure TypeScript with no DOM dependency, so no jsdom is needed.
- Add new tests next to the code they cover, as `*.test.ts` files under
  `src/`.
- When you add a conversion, add cases for valid input, edge cases, and
  invalid input that should throw — see
  [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-new-conversion).
- Prefer deterministic assertions; avoid relying on time or randomness.
