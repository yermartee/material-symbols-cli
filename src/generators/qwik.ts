import type { Config } from "../types.js";
import { fileHeader, SYMBOLS_VIEWBOX } from "./shared.js";

export const generateQwik = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;

  if (config.header) {
    lines.push(fileHeader(config.header));
  }

  lines.push(`import { component$ } from "@builder.io/qwik";`);
  lines.push(``);
  lines.push(`interface ${componentName}Props {`);
  lines.push(`  size?: number | string;`);
  lines.push(`  color?: string;`);
  lines.push(`  class?: string;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const ${componentName} = component$<${componentName}Props>((`);
  lines.push(`  { size = ${size}, color = "${color}", ...props }`);
  lines.push(`) => {`);
  lines.push(`  return (`);
  lines.push(`    <svg`);
  lines.push(`      xmlns="http://www.w3.org/2000/svg"`);
  lines.push(`      viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`      width={size}`);
  lines.push(`      height={size}`);
  lines.push(`      fill={color}`);
  lines.push(`      {...props}`);
  lines.push(`    >`);
  lines.push(`      ${pathData}`);
  lines.push(`    </svg>`);
  lines.push(`  );`);
  lines.push(`});`);
  lines.push(``);

  return lines.join("\n");
};
