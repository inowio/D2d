# Changelog

All notable changes to this project are tracked here following
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_No changes yet._

## [0.1.0] - 2026-05-22

### Added

- Initial open-source release of Inowio D2d — Data Conversion Toolkit.
- 26 data-conversion tools across 8 categories: ASCII, Hexadecimal, Decimal,
  Binary, Octal, Gray code, BCD, and advanced number systems.
- Multi-Format converter that updates every format from a single edited
  field, with a running byte count.
- Step-by-step explanations, worked examples, and reference tables for
  conversions.
- Conversion direction swap, clipboard copy for inputs and outputs, and a
  searchable conversion catalog on the home screen.
- Advanced numerics: signed/unsigned conversions (8/16/32/64-bit), Base-N
  conversions (bases 2–36), and IEEE 754 single/double precision.
- Arbitrary-precision integer conversions via BigInt.
- In-app auto-updater for desktop builds — a silent startup check that
  prompts when a newer release is available, plus a manual "Check for
  updates" button on the About page. Mobile builds update through their app
  stores instead.
- Dark/light theming and a mobile-responsive layout.
- Cross-platform builds for Windows, macOS, Linux, and Android via Tauri.
- GitHub Actions release workflow that builds Windows, macOS, and Linux
  installers on every `v*` tag and publishes a draft release with signed
  update artifacts.
- `npm run release` version-bump script and `docs/RELEASING.md` maintainer
  runbook.
- 100+ unit tests covering the conversion engine and release tooling.
