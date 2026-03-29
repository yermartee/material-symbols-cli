---
name: vercel-react-best-practices
description: "Use when changing React-family generator output in this repository, especially `mui`, `react`, `preact`, `solid`, or `qwik`, to keep generated components lean and aligned with modern React performance practices."
---

# Vercel React Best Practices

## Use This Skill For

- Editing React-oriented generators.
- Reviewing generated component APIs for unnecessary runtime cost.
- Keeping generated output small, direct, and tree-shakable.

## Rules

- Avoid unnecessary abstractions in generated components.
- Avoid adding memoization by default.
- Keep imports direct and minimal.
- Keep generated props simple and serializable.
- Avoid work in render paths that can be expressed statically.
- Preserve explicit client-boundary behavior when a format needs `"use client"`.

## Repo-Specific Fit

- Apply this only to React-family generators, not the entire CLI.
- Favor static output that is easy for bundlers to tree-shake.
- If an optimization changes public generator output, cover it with tests.