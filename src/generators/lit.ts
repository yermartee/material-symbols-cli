import type { Config } from "../types.js";
import { fileHeader, toKebab, SYMBOLS_VIEWBOX } from "./shared.js";

export const generateLit = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;
  const tagName = toKebab(componentName);

  if (config.header) {
    lines.push(fileHeader(config.header));
  }

  lines.push(`import { LitElement, html, svg } from "lit";`);
  lines.push(`import { customElement, property } from "lit/decorators.js";`);
  lines.push(``);
  lines.push(`@customElement("${tagName}")`);
  lines.push(`export class ${componentName} extends LitElement {`);
  lines.push(`  @property({ type: Number }) size = ${size};`);
  lines.push(`  @property() color = "${color}";`);
  lines.push(``);
  lines.push(`  override render() {`);
  lines.push(`    return html\``);
  lines.push(`      <svg`);
  lines.push(`        xmlns="http://www.w3.org/2000/svg"`);
  lines.push(`        viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`        width=\${this.size}`);
  lines.push(`        height=\${this.size}`);
  lines.push(`        fill=\${this.color}`);
  lines.push(`      >`);
  lines.push(`        ${pathData}`);
  lines.push(`      </svg>`);
  lines.push(`    \`;`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`declare global {`);
  lines.push(`  interface HTMLElementTagNameMap {`);
  lines.push(`    "${tagName}": ${componentName};`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
};
