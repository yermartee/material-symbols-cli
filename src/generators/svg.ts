import type { Config } from "../types.js";
import { SYMBOLS_VIEWBOX } from "./shared.js";

export const generateSvg = (_componentName: string, pathData: string, config: Config) => {
  const { size, color } = config.defaultProps;
  const lines: string[] = [];

  if (config.header) {
    lines.push(`<!-- ${config.header} -->`);
  }

  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SYMBOLS_VIEWBOX}" width="${size}" height="${size}" fill="${color}">`,
  );
  lines.push(`  ${pathData}`);
  lines.push(`</svg>`);
  lines.push(``);

  return lines.join("\n");
};
