import type { Config } from "../types.js";
import { fileHeader } from "./shared.js";

export const generateMui = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];

  if (config.header) {
    lines.push(fileHeader(config.header));
  }
  if (config.useClientDirective) {
    lines.push(`"use client";`);
  }

  lines.push(`import createSymbolIcon from "./utils/createSymbolIcon";`);
  lines.push(``);

  const isSinglePath = /^<path\s[^>]*\/>$/.test(pathData.trim());
  const dMatch = isSinglePath ? /d="([^"]*)"/.exec(pathData) : null;
  const children = dMatch ? `<path d="${dMatch[1]}" />` : `<>${pathData}</>`;

  lines.push(`export default createSymbolIcon(`, `  ${children},`, `  "${componentName}",`, `);`);

  lines.push(``);
  return lines.join("\n");
};
