---
name: typescript-best-practices
description: "Use when reading or writing TypeScript or JavaScript in this repository. Covers type-first development, exhaustive handling, runtime validation boundaries, and clean module design."
---

# TypeScript Best Practices

## Use This Skill For

- Editing `.ts`, `.tsx`, `.js`, or config files.
- Designing data models, function signatures, and module boundaries.
- Refactoring logic toward stronger types and clearer state handling.

## Rules

- Define types and interfaces before implementing complex logic.
- Prefer data shapes that make illegal states unrepresentable.
- Use discriminated unions for state machines and mutually exclusive branches.
- Make edge cases explicit instead of relying on optional chaining everywhere.
- Use exhaustive handling for unions.
- Keep modules focused and prefer pure functions for business logic.

## Repo-Specific Fit

- Keep config resolution typed and separated from user input.
- Keep generators predictable and side-effect free.
- Prefer shared utilities over duplicated naming or emission logic.
- Use tests to lock down naming, config, optimizer, and generator behavior.