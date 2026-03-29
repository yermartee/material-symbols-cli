import type { Config } from "../types.js";
import { SYMBOLS_VIEWBOX } from "./shared.js";

export const generateSvelte = (_componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;

  if (config.header) {
    lines.push(`<!-- ${config.header} -->`);
  }

  lines.push(`<script lang="ts">`);
  lines.push(`  interface Props {`);
  lines.push(`    size?: number | string;`);
  lines.push(`    color?: string;`);
  lines.push(`    [key: string]: unknown;`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  let { size = ${size}, color = "${color}", ...rest }: Props = $props();`);
  lines.push(`</script>`);
  lines.push(``);
  lines.push(`<svg`);
  lines.push(`  xmlns="http://www.w3.org/2000/svg"`);
  lines.push(`  width={size}`);
  lines.push(`  height={size}`);
  lines.push(`  fill={color}`);
  lines.push(`  viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`  {...rest}`);
  lines.push(`>`);
  lines.push(`  ${pathData}`);
  lines.push(`</svg>`);
  lines.push(``);

  return lines.join("\n");
};
