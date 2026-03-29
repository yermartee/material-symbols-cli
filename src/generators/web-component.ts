import type { Config } from "../types.js";
import { fileHeader, toKebab, SYMBOLS_VIEWBOX } from "./shared.js";

export const generateWebComponent = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;
  const tagName = toKebab(componentName);

  if (config.header) {
    lines.push(fileHeader(config.header));
  }

  lines.push(`const template = document.createElement("template");`);
  lines.push(`template.innerHTML = \``);
  lines.push(`  <svg`);
  lines.push(`    xmlns="http://www.w3.org/2000/svg"`);
  lines.push(`    viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`    width="${size}"`);
  lines.push(`    height="${size}"`);
  lines.push(`    fill="${color}"`);
  lines.push(`  >`);
  lines.push(`    ${pathData}`);
  lines.push(`  </svg>`);
  lines.push(`\`;`);
  lines.push(``);
  lines.push(`export class ${componentName} extends HTMLElement {`);
  lines.push(`  static observedAttributes = ["size", "color"];`);
  lines.push(``);
  lines.push(`  constructor() {`);
  lines.push(`    super();`);
  lines.push(`    this.attachShadow({ mode: "open" });`);
  lines.push(`    this.shadowRoot!.appendChild(template.content.cloneNode(true));`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  attributeChangedCallback(name: string, _old: string, value: string) {`);
  lines.push(`    const svg = this.shadowRoot!.querySelector("svg");`);
  lines.push(`    if (!svg) return;`);
  lines.push(`    if (name === "size") {`);
  lines.push(`      svg.setAttribute("width", value);`);
  lines.push(`      svg.setAttribute("height", value);`);
  lines.push(`    } else if (name === "color") {`);
  lines.push(`      svg.setAttribute("fill", value);`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`customElements.define("${tagName}", ${componentName});`);
  lines.push(``);
  lines.push(`declare global {`);
  lines.push(`  interface HTMLElementTagNameMap {`);
  lines.push(`    "${tagName}": ${componentName};`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
};
