# Material Symbols CLI — Agent Guide

_Freshness anchor: March 2026._

## Scope

- This repository is a Node.js and TypeScript CLI package.
- Use `pnpm` only.
- Prefer small, focused changes over broad refactors.

## Core Coding Rules

- Use `const` arrow functions by default.
- Let TypeScript infer return types unless `never` is required.
- Prefer `satisfies` over `as` for type validation.
- Use `??` instead of `||` for defaulting.
- Keep comments rare and focused on why.
- Remove dead code instead of leaving it behind.
- Use `.js` extensions in relative TypeScript imports.

## Validation Rules

- Run `pnpm typecheck` after code changes.
- Run `pnpm test` after code changes.
- Run `pnpm build` for release-facing or package-shape changes.
- Never leave lockfile or dependency drift unresolved.

## Testing Rules

- Unit tests live in `src/__tests__/`.
- Mock network calls in tests.
- Keep tests focused on one concept each.
- When changing generators, cover output changes with tests when practical.

## Generator Rules

When changing files in `src/generators/`, verify:

- Header inclusion and omission rules.
- Correct framework imports.
- Correct component naming.
- Correct output extension behavior in barrel files.
- Correct `"use client"` behavior for applicable formats.

## Important Project Areas

- `src/cli.ts`: command surface.
- `src/config.ts`: config loading and resolution.
- `src/fetcher.ts`: metadata and SVG fetch flow.
- `src/optimizer.ts`: SVGO optimization.
- `src/utils/naming.ts`: naming pipeline.
- `src/generators/`: framework emitters and shared helpers.
- `src/__tests__/`: unit tests.

## Recommended Skills

- Use `material-symbols-cli-development` for package work.
- Use `material-symbols-cli-usage` for installation and integration questions.
- Use `typescript-best-practices` for any TypeScript or JavaScript change.
- Use `vercel-react-best-practices` only when changing React-family generator output such as `mui`, `react`, `preact`, `solid`, or `qwik`.