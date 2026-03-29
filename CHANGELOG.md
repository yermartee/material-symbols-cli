# Changelog

All notable changes to this project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/) and uses [Conventional Commits](https://www.conventionalcommits.org/).

## [0.1.0] - 2026-03-27

### Added

- Initial release.
- CLI tool (`msym`) with `init`, `sync`, `list`, `add`, and `remove` commands.
- 13 output formats: React MUI, React, React Native, Vue 3, Angular, Svelte 5, SolidJS, Preact, Qwik, Lit, Web Components, Flutter, raw SVG.
- TypeScript config file support (`material-symbols.config.mts`) with `defineConfig` autocomplete.
- Full Material Symbols variable font axis support: fill, weight, grade, optical size.
- 4 naming conventions: PascalCase, camelCase, kebab-case, snake_case.
- Custom prefix, suffix, and per-icon name overrides.
- SVGO optimization pipeline aligned with MUI's icon build.
- Concurrent SVG downloads with configurable parallelism.
- Barrel file generation for convenient re-exports.
- `"use client"` directive support for Next.js App Router.
- Programmatic API for build-script integration.
- Leading digit handling (e.g. `3d_rotation` → `ThreeDRotation`).
