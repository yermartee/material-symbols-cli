---
name: material-symbols-cli-usage
description: "Use when installing or integrating material-symbols-cli in an app, creating material-symbols.config.mts, choosing an output format, generating icons, or troubleshooting generated Material Symbols components."
---

# Material Symbols CLI Usage

## Use This Skill For

- Installing `@hianali/material-symbols-cli` in an application.
- Creating or editing `material-symbols.config.mts`.
- Choosing between `mui`, `react`, `react-native`, `vue`, `angular`, `svelte`, `solid`, `preact`, `qwik`, `lit`, `web-component`, `flutter`, and `svg` outputs.
- Generating icons with `msym init`, `msym sync`, `msym list`, `msym add`, or `msym remove`.
- Troubleshooting naming output, variants, or generated file layout.

## Install

```bash
pnpm add -D @hianali/material-symbols-cli
```

## Minimal Config

```ts
import { defineConfig } from "@hianali/material-symbols-cli/config";

export default defineConfig({
  icons: ["home", "search"],
});
```

## Useful Commands

```bash
msym init
msym sync
msym list --search arrow
msym add home search
msym remove home
```

## Format Selection

- Use `mui` when the target app already uses Material UI.
- Use `react` for framework-agnostic React projects.
- Use `react-native` for native mobile apps built with React Native.
- Use `vue`, `angular`, `svelte`, `solid`, `preact`, or `qwik` for native framework output.
- Use `lit` or `web-component` when the icons need to ship as custom elements.
- Use `flutter` for Dart and Flutter projects.
- Use `svg` when only raw optimized assets are needed.

## Troubleshooting

- If names look wrong, check naming overrides, prefix, suffix, and convention settings.
- If output is too large, verify the icon list and variants instead of generating everything.
- If framework code needs client directives, confirm `useClientDirective` matches the chosen format.
- If generated files need easier imports, enable `barrel` output.