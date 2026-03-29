import type { Config } from "../types.js";
import { SYMBOLS_VIEWBOX } from "./shared.js";

export const generateVue = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;

  if (config.header) {
    lines.push(`<!-- ${config.header} -->`);
  }

  lines.push(`<template>`);
  lines.push(`  <svg`);
  lines.push(`    xmlns="http://www.w3.org/2000/svg"`);
  lines.push(`    :width="size"`);
  lines.push(`    :height="size"`);
  lines.push(`    :fill="color"`);
  lines.push(`    viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`    v-bind="$attrs"`);
  lines.push(`  >`);
  lines.push(`    ${pathData}`);
  lines.push(`  </svg>`);
  lines.push(`</template>`);
  lines.push(``);
  lines.push(`<script setup lang="ts">`);
  lines.push(`defineOptions({ name: "${componentName}", inheritAttrs: false });`);
  lines.push(``);
  lines.push(`withDefaults(`);
  lines.push(`  defineProps<{`);
  lines.push(`    size?: number | string;`);
  lines.push(`    color?: string;`);
  lines.push(`  }>(),`);
  lines.push(`  { size: ${size}, color: "${color}" },`);
  lines.push(`);`);
  lines.push(`</script>`);
  lines.push(``);

  return lines.join("\n");
};
