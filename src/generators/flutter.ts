import type { Config } from "../types.js";
import { fileHeader, SYMBOLS_VIEWBOX } from "./shared.js";

export const generateFlutter = (componentName: string, pathData: string, config: Config) => {
  const lines: string[] = [];
  const { size, color } = config.defaultProps;

  if (config.header) {
    lines.push(fileHeader(config.header));
  }

  lines.push(`import 'package:flutter/widgets.dart';`);
  lines.push(`import 'package:flutter_svg/flutter_svg.dart';`);
  lines.push(``);

  lines.push(`class ${componentName} extends StatelessWidget {`);
  lines.push(`  final double size;`);
  lines.push(`  final Color color;`);
  lines.push(``);
  lines.push(`  const ${componentName}({`);
  lines.push(`    super.key,`);
  lines.push(`    this.size = ${size},`);
  lines.push(`    this.color = const Color(0xFF${flutterColor(color)}),`);
  lines.push(`  });`);
  lines.push(``);

  const svgString = buildInlineSvg(pathData, color);

  lines.push(`  @override`);
  lines.push(`  Widget build(BuildContext context) {`);
  lines.push(`    return SvgPicture.string(`);
  lines.push(`      '${svgString}',`);
  lines.push(`      width: size,`);
  lines.push(`      height: size,`);
  lines.push(`      colorFilter: ColorFilter.mode(color, BlendMode.srcIn),`);
  lines.push(`    );`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
};

const buildInlineSvg = (pathData: string, color: string) => {
  const fill = color === "currentColor" ? "#000000" : color;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SYMBOLS_VIEWBOX}" fill="${fill}">${pathData}</svg>`;
};

const flutterColor = (cssColor: string) => {
  if (cssColor === "currentColor") {
    return "000000";
  }
  if (cssColor.startsWith("#")) {
    return cssColor.slice(1).padStart(6, "0");
  }
  return "000000";
};
