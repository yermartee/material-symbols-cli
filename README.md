<p align="center">
  <img src="assets/logo.svg" width="120" alt="material-symbols-cli logo" />
</p>

<h1 align="center">material-symbols-cli</h1>

<p align="center">
  <strong>Fetch Google Material Symbols and generate tree-shakable, framework-native icon components.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@hianali/material-symbols-cli"><img src="https://img.shields.io/npm/v/%40hianali%2Fmaterial-symbols-cli.svg?style=flat-square&color=0078d4" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@hianali/material-symbols-cli"><img src="https://img.shields.io/npm/dm/%40hianali%2Fmaterial-symbols-cli.svg?style=flat-square&color=4caf50" alt="npm downloads" /></a>
  <a href="https://bundlephobia.com/package/%40hianali%2Fmaterial-symbols-cli"><img src="https://img.shields.io/bundlephobia/minzip/%40hianali%2Fmaterial-symbols-cli?style=flat-square&color=ff9800" alt="bundle size" /></a>
  <a href="https://github.com/hianali/material-symbols-cli/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/%40hianali%2Fmaterial-symbols-cli.svg?style=flat-square&color=607d8b" alt="license" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D20-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#why-msym">Why msym?</a> ·
  <a href="#output-formats">13 Formats</a> ·
  <a href="#configuration">Config</a> ·
  <a href="#cli-commands">CLI</a> ·
  <a href="#programmatic-api">API</a>
</p>

---

## Why msym?

Existing Material Symbols packages ship **every icon upfront** — fonts, CSS bundles, or massive SVG dumps. You install 12 MB, configure webpack loaders, and still don't get framework-native components.

**msym takes a different approach:** you declare exactly which icons you need, and it generates optimized, tree-shakable, framework-native components on demand.

| Feature | msym | `material-symbols` | `@material-symbols/svg-*` | `react-material-symbols` |
|---------|------|---------------------|--------------------------|--------------------------|
| **Install size** | ~120 KB (CLI only) | 12.7 MB | 12.8 MB (23K files) | 1.2 MB |
| **Icons shipped** | Only what you use | All 3000+ | All 3000+ | All (font) |
| **Formats** | 13 (MUI, React, React Native, Vue, Angular, Svelte, Solid, Preact, Qwik, Lit, WC, Flutter, SVG) | CSS only | Raw SVG (needs @svgr) | React only |
| **Tree-shakable** | Yes (individual files) | No (font/CSS) | Manual | No (font) |
| **Component generation** | Native per-framework | No | No | No |
| **Variable axes** | Fill, weight, grade, optical size | CSS `font-variation-settings` | Fill only | Font settings |
| **SVGO optimization** | Built-in | No | Yes | No |
| **Config file** | TypeScript with autocomplete | No | No | No |
| **Naming customization** | 4 conventions + prefix/suffix/overrides | No | No | No |
| **Programmatic API** | Full | No | No | No |
| **Generated output deps** | Target framework only | Font files | SVG files | Font files |

## Quick Start

```bash
# Install
pnpm add -D @hianali/material-symbols-cli    # or npm / yarn / bun

# Create config
msym init

# Generate icons
msym sync
```

That's it. Three commands.

The package exposes two executable names: `msym` and `material-symbols`. The examples below use `msym`.

## Install

```bash
# pnpm (recommended)
pnpm add -D @hianali/material-symbols-cli

# npm
npm install -D @hianali/material-symbols-cli

# yarn
yarn add -D @hianali/material-symbols-cli

# bun
bun add -D @hianali/material-symbols-cli
```

## Configuration

Create `material-symbols.config.mts` in your project root:

```ts
import { defineConfig } from "@hianali/material-symbols-cli/config";

export default defineConfig({
  icons: ["home", "search", "menu", "close", "settings", "arrow_back"],
  format: "mui",
  style: "outlined",
  outputDir: "src/icons",

  variants: [
    { fill: 0, weight: 400, grade: 0, opticalSize: 24 },
    { fill: 1 },
  ],

  naming: {
    convention: "PascalCase",
    prefix: "",
    suffix: "",
    overrides: {
      "3d_rotation": "Rotate3D",
    },
  },

  defaultProps: {
    size: 24,
    color: "currentColor",
  },

  optimize: true,
  useClientDirective: true,
  barrel: true,
  concurrency: 25,
});
```

All options have sensible defaults. The minimal config is:

```ts
export default defineConfig({
  icons: ["home", "search"],
});
```

<details>
<summary><strong>Full configuration reference</strong></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `icons` | `"all" \| string[]` | — | Icons to generate. `"all"` for every available symbol (3000+). |
| `format` | `OutputFormat` | `"mui"` | Output framework format. |
| `style` | `"outlined" \| "rounded" \| "sharp"` | `"outlined"` | Google Material Symbols style family. |
| `outputDir` | `string` | `"src/icons"` | Output directory for generated files. |
| `variants` | `SymbolVariant[]` | `[{ fill: 0, weight: 400 }]` | Axis variants to generate per icon. |
| `naming` | `NamingConfig` | `{ convention: "PascalCase" }` | Naming conventions for files and exports. |
| `defaultProps` | `object` | `{ size: 24, color: "currentColor" }` | Default props for generated components. |
| `optimize` | `boolean` | `true` | SVGO optimization. |
| `useClientDirective` | `boolean` | `true` | `"use client"` directive for Next.js App Router. |
| `barrel` | `boolean` | `true` | Generate barrel `index.ts` file. |
| `extension` | `string` | Auto-detected | Override file extension. |
| `declarations` | `boolean` | `false` | Generate `.d.ts` alongside components. |
| `concurrency` | `number` | `25` | Parallel download limit. |
| `header` | `string \| false` | `"Auto-generated…"` | Header comment in generated files. |

</details>

## CLI Commands

### `msym init`

Alias: `material-symbols init`

Create a starter config file with TypeScript autocompletion.

```bash
msym init
msym init --format vue
```

### `msym sync`

Alias: `material-symbols sync`

Fetch icons from Google and generate components based on your config.

```bash
msym sync
msym sync --format react --output src/components/icons
msym sync --icons home,search,menu --style rounded
```

Alias: `msym generate`

### `msym list`

Alias: `material-symbols list`

List all 3000+ available Material Symbol names.

```bash
msym list
msym list --search arrow
msym list --json
```

### `msym add <icons...>`

Alias: `material-symbols add <icons...>`

Add specific icons to your output directory without touching existing ones.

```bash
msym add favorite star bookmark
```

### `msym remove <icons...>`

Alias: `material-symbols remove <icons...>`

Remove specific icons from your output directory.

```bash
msym remove favorite star
```

## Output Formats

| Format | Extension | Framework | Generated Code |
|--------|-----------|-----------|----------------|
| `mui` | `.tsx` | React + MUI | `createSvgIcon` wrapper |
| `react` | `.tsx` | React 18/19 | Standalone SVG component with props |
| `react-native` | `.tsx` | React Native | `react-native-svg` component |
| `vue` | `.vue` | Vue 3 | SFC with `<script setup>` |
| `angular` | `.ts` | Angular 17+ | Standalone component |
| `svelte` | `.svelte` | Svelte 5 | Component with `$props()` |
| `solid` | `.tsx` | SolidJS | Function component |
| `preact` | `.tsx` | Preact | Function component |
| `qwik` | `.tsx` | Qwik | `component$()` |
| `lit` | `.ts` | Lit 3 | `LitElement` custom element |
| `web-component` | `.ts` | Vanilla | Custom Element with Shadow DOM |
| `flutter` | `.dart` | Flutter | `flutter_svg` widget |
| `svg` | `.svg` | Any | Raw optimized SVG |

## Framework Examples

### React + MUI

```tsx
import HomeIcon from "./icons/Home";
import SearchIcon from "./icons/Search";

function App() {
  return (
    <>
      <HomeIcon sx={{ fontSize: 32 }} />
      <SearchIcon color="primary" />
    </>
  );
}
```

### React (Standalone)

```tsx
import Home from "./icons/Home";

<Home size={32} color="#333" className="nav-icon" />
```

### React Native

```tsx
import Home from "./icons/Home";

<Home size={32} color="#333" />
```

### Vue 3

```vue
<script setup>
import Home from "./icons/Home.vue";
</script>

<template>
  <Home :size="32" color="#333" />
</template>
```

### Angular

```ts
import { HomeComponent } from "./icons/Home";

@Component({
  imports: [HomeComponent],
  template: `<home [size]="32" color="#333" />`
})
export class AppComponent {}
```

### Svelte 5

```svelte
<script>
  import Home from "./icons/Home.svelte";
</script>

<Home size={32} color="#333" />
```

### SolidJS

```tsx
import Home from "./icons/Home";

<Home size={32} color="#333" />
```

### Preact

```tsx
import Home from "./icons/Home";

<Home size={32} color="#333" />
```

### Qwik

```tsx
import { Home } from "./icons/Home";

export default component$(() => (
  <Home size={32} color="#333" />
));
```

### Lit

```ts
import "./icons/Home";

html`<home-icon size="32" color="#333"></home-icon>`;
```

### Web Component (Vanilla)

```html
<script type="module" src="./icons/Home.js"></script>
<home-icon size="32" color="#333"></home-icon>
```

### Flutter

```dart
import 'icons/home.dart';

const Home(size: 32, color: Color(0xFF333333));
```

## Naming Conventions

| Convention | Input | Component | Filename |
|-----------|-------|-----------|----------|
| `PascalCase` | `arrow_back` | `ArrowBack` | `ArrowBack.tsx` |
| `camelCase` | `arrow_back` | `arrowBack` | `arrowBack.tsx` |
| `kebab-case` | `arrow_back` | `arrow-back` | `arrow-back.tsx` |
| `snake_case` | `arrow_back` | `arrow_back` | `arrow_back.tsx` |

With prefix `"Icon"` and suffix `"Symbol"`:

```
arrow_back → IconArrowBackSymbol / IconArrowBackSymbol.tsx
```

Leading digits are automatically converted to words:

```
3d_rotation → ThreeDRotation
10k         → TenK
```

## Programmatic API

Use the full pipeline programmatically in build scripts or custom tooling:

```ts
import {
  defineConfig,
  resolveConfig,
  fetchSymbolNames,
  fetchIcons,
  getGenerator,
  processRawSvg,
  generateBarrel,
  resolveComponentName,
  resolveFileName,
  variantSuffix,
} from "@hianali/material-symbols-cli";

const config = resolveConfig({
  icons: ["home", "search"],
  format: "react",
});

const names = await fetchSymbolNames();
const svgs = await fetchIcons(["home"], config, (done, total) => {
  console.log(`${done}/${total}`);
});

const generator = getGenerator(config.format);
for (const svg of svgs) {
  const { pathData } = processRawSvg(svg.svgContent);
  const code = generator("Home", pathData, config);
}
```

## Tree-Shaking

Generated code is tree-shakable by design:

- **One file per icon** — bundlers eliminate unused icons at build time
- **Named re-exports** — barrel files use `export { X } from "./X"` syntax
- **`"sideEffects": false`** — declared in generated `package.json` context
- **Format-specific imports only** — generated files only import what their target framework requires

## Integration Tips

### Next.js App Router

`useClientDirective: true` (default) adds `"use client"` to React/MUI/Solid/Preact components, making them compatible with Next.js App Router server components.

### Monorepo

Place your config at the repo root and set `outputDir` to the target package:

```ts
export default defineConfig({
  icons: ["home"],
  outputDir: "packages/ui/src/icons",
});
```

### CI/CD

Add `msym sync` to your CI pipeline to keep icons in sync:

```yaml
- run: npx msym sync
- run: git diff --exit-code src/icons/
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

## License

[Apache-2.0](LICENSE) — the same license Google uses for Material Symbols.

Generated icon SVGs are sourced from Google's [material-design-icons](https://github.com/google/material-design-icons) repository and are also Apache-2.0 licensed. You are free to use, modify, and redistribute the generated components in any project.

---
