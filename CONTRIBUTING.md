# Contributing to material-symbols-cli

## Development Setup

```bash
# Clone the repo
git clone https://github.com/hianali/material-symbols-cli.git
cd material-symbols-cli

# Install dependencies (pnpm required)
pnpm install

# Build
pnpm run build

# Type-check without emitting
pnpm run typecheck

# Run the CLI locally
node dist/cli.js --help
```

## Project Structure

```
src/
├── cli.ts              # CLI entry point (commander)
├── index.ts            # Public API barrel export
├── config.ts           # Config loading and resolution
├── fetcher.ts          # Google metadata + SVG download
├── optimizer.ts        # SVGO pipeline
├── types.ts            # All TypeScript types
├── utils/
│   └── naming.ts       # Icon name → component name conversion
└── generators/
    ├── index.ts        # Generator registry
    ├── shared.ts       # Shared utilities (file header)
    ├── barrel.ts       # Barrel index file generator
    ├── mui.ts          # React + MUI (createSvgIcon)
    ├── react.ts        # Standalone React
    ├── react-native.ts # React Native
    ├── vue.ts          # Vue 3 SFC
    ├── angular.ts      # Angular standalone
    ├── svelte.ts       # Svelte 5
    ├── solid.ts        # SolidJS
    ├── preact.ts       # Preact
    ├── qwik.ts         # Qwik
    ├── lit.ts          # Lit Element
    ├── web-component.ts # Vanilla Custom Element
    ├── flutter.ts      # Flutter
    └── svg.ts          # Raw SVG
```

## Making Changes

1. **Fork and branch** — Create a feature branch from `main`.
2. **Make your changes** — Keep commits focused and atomic.
3. **Type-check** — Run `pnpm run typecheck` to ensure no TypeScript errors.
4. **Lint** — Run `pnpm run lint` to check code style.
5. **Build** — Run `pnpm run build` to verify the full build succeeds.
6. **Test the CLI** — Run `node dist/cli.js --help` and test your changes manually.

## Code Style

- **TypeScript strict mode** — All code must pass strict type checking.
- **Biome** — We use Biome for linting and formatting. Run `pnpm run format` before committing.
- **Meaningful names** — Use descriptive variable and function names. No single-character variables.
- **Thoughtful comments** — Comments should explain *why*, not *what*. If the code needs explaining, rename things to be clearer.
- **No dead code** — Remove unused imports, variables, and functions immediately.

## Adding a New Framework Generator

1. Create `src/generators/{framework}.ts` exporting a `generate{Framework}` function.
2. The function signature must match `GeneratorFn` from `src/generators/index.ts`.
3. Register it in `src/generators/index.ts` in the `GENERATORS` map.
4. Add the format to `OutputFormat` in `src/types.ts`.
5. Add the file extension to `extensionForFormat` in `src/config.ts`.
6. Update barrel export logic in `src/generators/barrel.ts` if needed.
7. Add a usage example to README.md.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Remix framework generator
fix: handle leading digits in icon names
docs: update Vue example in README
chore: bump svgo to 3.4.0
```

## Pull Request Process

1. Ensure your PR has a clear title and description.
2. Link any related issues.
3. All CI checks must pass (typecheck, lint, build).
4. One approval required for merge.

## Reporting Issues

- Use the [GitHub issue tracker](https://github.com/hianali/material-symbols-cli/issues).
- Include your Node.js version, OS, and the full error output.
- For feature requests, describe the use case and expected behavior.

## License

By contributing, you agree that your contributions will be licensed under the [Apache-2.0 License](LICENSE).
