# Contributing to Inowio D2d

Thanks for helping improve D2d! This guide keeps contribution steps short and
consistent.

## Quick Start

```bash
git clone https://github.com/inowio/D2d.git
cd D2d
npm install
npm run tauri dev
```

Prerequisites: Node.js 20.19+ (or 22.12+), Rust stable toolchain, Git, and a
code editor (VS Code with the Tauri, rust-analyzer, ESLint, and Prettier
extensions is recommended). See the [README](README.md#getting-started) for
the full setup.

## Workflow

1. Fork the repo and branch off `main` using `feature/<topic>` or
   `fix/<topic>`.
2. Follow [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `docs:`, `test:`, `chore:`…).
3. Keep pull requests focused, include tests, and add screenshots for UI
   changes.
4. Open the PR against `main`, reference any related issues, and await
   review.

## Coding Standards

- React + TypeScript only; prefer the `export default function Component()`
  style used across `src/`.
- Keep conversion logic pure and dependency-free in
  [`src/utils/conversions.ts`](src/utils/conversions.ts) so it stays easy to
  test.
- Throw explicit, human-readable `Error` messages for invalid input — the UI
  surfaces them directly to the user.
- Rust changes in `src-tauri/` must pass `cargo fmt`; most contributions are
  frontend-only.
- Update docs or in-app explanations whenever behavior changes.

## Adding a New Conversion

The conversion catalog is designed to grow. To add one:

1. **Define the option.** Add a `ConversionOption` entry to
   `conversionOptions` in [`src/utils/conversions.ts`](src/utils/conversions.ts)
   with a unique `id`, a `title`, a `description`, and the `from`/`to` format
   keys.
2. **Implement the function.** Write the conversion in the same file and add
   a matching `case` to the `convert()` switch so it is dispatched correctly.
3. **Add an explanation** *(encouraged)*. Add a matching entry to
   `conversionExplanations` in
   [`src/utils/conversionExplanations.ts`](src/utils/conversionExplanations.ts)
   so the converter page renders the step-by-step guide and example table.
4. **Cover it with tests.** Add cases to
   [`src/utils/conversions.test.ts`](src/utils/conversions.test.ts), including
   edge cases and invalid input.
5. **Register a new format, if needed.** If your `from`/`to` introduces a
   format not already listed, add it to the `groupOrder` and `groupLabels`
   maps in `src/pages/Home.tsx` and `src/components/Sidebar.tsx` so it appears
   in the catalog and sidebar.

## Testing & Checks

```bash
npm run build    # Type-check + production build
npm run test     # Unit tests (Vitest)
cargo fmt        # Rust formatting (only if you touched src-tauri/)
```

Please add or update tests alongside new features and bug fixes. See
[TESTING.md](TESTING.md) for conventions.

## Releasing

Maintainers cut releases with `npm run release -- X.Y.Z`, which bumps every
version field and dates the changelog, followed by committing and pushing the
`vX.Y.Z` tag. Pushing the tag triggers the GitHub Actions workflow that
builds the desktop installers and publishes a draft release. The full
runbook — updater keypair setup, CI secrets, the release loop, pre-releases,
and failure recovery — is in [docs/RELEASING.md](docs/RELEASING.md).

## Reporting Issues & Requests

- **Bug reports** — include OS, app version, Node/Rust versions, reproduction
  steps, expected vs. actual results, and logs or screenshots if possible.
- **Feature ideas** — describe the use case, the desired outcome, and any
  alternatives you considered. New conversion requests are very welcome.

## Community Expectations

Be respectful, inclusive, and helpful. Use GitHub Issues for bugs and feature
requests, and Discussions for questions or ideas.

---

Thank you for contributing! 🚀
