import type { Config } from "../types.js";
import { fileHeader, toKebab, SYMBOLS_VIEWBOX } from "./shared.js";

export const generateAngular = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;
  const selector = toKebab(componentName);

  if (config.header) {
    lines.push(fileHeader(config.header));
  }

  lines.push(`import { Component, input } from "@angular/core";`);
  lines.push(``);
  lines.push(`@Component({`);
  lines.push(`  selector: "${selector}",`);
  lines.push(`  standalone: true,`);
  lines.push(`  changeDetection: 0,`);
  lines.push(`  template: \``);
  lines.push(`    <svg`);
  lines.push(`      xmlns="http://www.w3.org/2000/svg"`);
  lines.push(`      [attr.width]="size()"`);
  lines.push(`      [attr.height]="size()"`);
  lines.push(`      [attr.fill]="color()"`);
  lines.push(`      viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`    >`);
  lines.push(`      ${pathData}`);
  lines.push(`    </svg>`);
  lines.push(`  \`,`);
  lines.push(`})`);
  lines.push(`export class ${componentName}Component {`);
  lines.push(`  size = input<number | string>(${size});`);
  lines.push(`  color = input<string>("${color}");`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
};
