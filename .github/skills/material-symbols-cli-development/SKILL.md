---
name: material-symbols-cli-development
description: "Use when working on material-symbols-cli itself: adding or fixing generators, CLI commands, config resolution, naming logic, fetch pipeline, optimizer behavior, tests, package metadata, or release readiness."
---

# Material Symbols CLI Development

## Use This Skill For

- Modifying generator output for React, React Native, Vue, Angular, Svelte, Solid, Preact, Qwik, Lit, Web Components, Flutter, SVG, or MUI.
- Changing config loading, defaults, naming rules, icon fetching, or SVG optimization.
- Updating CLI commands, package metadata, release behavior, or contributor workflow.
- Adding or fixing unit tests for naming, config, fetcher, optimizer, or generators.

## Project Rules

- Use `pnpm` only.
- Prefer `const` arrow functions.
- Let TypeScript infer return types unless `never` is required.
- Use `.js` extensions in relative TypeScript imports.
- Use `??` instead of `||` for defaults.
- Keep generator signatures aligned with `(componentName, pathData, config) => string`.

## Architecture Map

- `src/cli.ts`: Commander-based CLI entry.
- `src/config.ts`: user config loading and resolution into fully required config.
- `src/fetcher.ts`: Google metadata fetch and SVG download flow.
- `src/optimizer.ts`: SVGO pipeline aligned with MUI output.
- `src/utils/naming.ts`: naming conversion and override handling.
- `src/generators/`: framework-specific emitters plus shared helpers and barrel generation.
- `src/__tests__/`: unit tests for pure logic and generator output.

## Working Checklist

- Keep changes focused and reuse shared generator helpers instead of duplicating logic.
- When touching generators, verify header behavior, import shape, naming, output extension handling, and any `use client` rules.
- When touching fetching, preserve the Google XSSI prefix stripping behavior.
- When touching naming, cover leading digits, overrides, prefixes, suffixes, and naming convention variants.
- When touching config, keep the two-phase flow: user config in, resolved config out.

## Validation

- Run `pnpm install` if dependencies or lockfile drift.
- Run `pnpm typecheck` after code changes.
- Run `pnpm test` after code changes.
- Run `pnpm build` before release-oriented changes are considered complete.