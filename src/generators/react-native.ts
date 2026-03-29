import type { Config } from "../types.js";
import { fileHeader, SYMBOLS_VIEWBOX } from "./shared.js";

export const generateReactNative = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;

  if (config.header) {
    lines.push(fileHeader(config.header));
  }

  lines.push(`import type { SvgProps } from "react-native-svg";`);
  lines.push(`import Svg, { Path } from "react-native-svg";`);
  lines.push(``);

  lines.push(`interface ${componentName}Props extends SvgProps {`);
  lines.push(`  size?: number;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`const ${componentName} = ({`);
  lines.push(`  size = ${size},`);
  lines.push(`  color = "${color}",`);
  lines.push(`  ...props`);
  lines.push(`}: ${componentName}Props) => (`);
  lines.push(`  <Svg`);
  lines.push(`    width={size}`);
  lines.push(`    height={size}`);
  lines.push(`    viewBox="${SYMBOLS_VIEWBOX}"`);
  lines.push(`    fill={color}`);
  lines.push(`    {...props}`);
  lines.push(`  >`);

  const paths = extractAllPaths(pathData);
  for (const path of paths) {
    lines.push(`    <Path d="${path}" />`);
  }

  lines.push(`  </Svg>`);
  lines.push(`);`);
  lines.push(``);
  lines.push(`export default ${componentName};`);
  lines.push(``);

  return lines.join("\n");
};

const extractAllPaths = (pathData: string) => {
  const paths: string[] = [];
  const regex = /d="([^"]*)"/g;
  let match = regex.exec(pathData);

  while (match) {
    if (match[1]) {
      paths.push(match[1]);
    }
    match = regex.exec(pathData);
  }

  if (paths.length === 0) {
    paths.push(pathData);
  }
  return paths;
};
