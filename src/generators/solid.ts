import type { Config } from "../types.js";
import { fileHeader, SYMBOLS_VIEWBOX } from "./shared.js";

export const generateSolid = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;

  if (config.header) {
    lines.push(fileHeader(config.header));
  }
  if (config.useClientDirective) {
    lines.push(`"use client";`);
  }

  lines.push(`import type { JSX } from "solid-js";`);
  lines.push(``);
  lines.push(`interface ${componentName}Props extends JSX.SvgSVGAttributes<SVGSVGElement> {`);
  lines.push(`  size?: number | string;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export default function ${componentName}(props: ${componentName}Props) {`);
  lines.push(`  return (`);
  lines.push(`    <svg`);
  lines.push(`      xmlns="http://www.w3.org/2000/svg"`);
  lines.push(`      viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`      width={props.size ?? ${size}}`);
  lines.push(`      height={props.size ?? ${size}}`);
  lines.push(`      fill={props.color ?? "${color}"}`);
  lines.push(`      {...props}`);
  lines.push(`    >`);
  lines.push(`      ${pathData}`);
  lines.push(`    </svg>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
};
