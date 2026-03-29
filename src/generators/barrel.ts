import type { IconEntry, OutputFormat, Config } from "../types.js";

export const generateBarrel = (icons: IconEntry[], config: Config) => {
  const lines: string[] = [];

  if (config.header) {
    lines.push(`// ${config.header}`);
  }

  const isDefaultExport = usesDefaultExport(config.format);
  const importSuffix = importExtension(config.extension);

  if (config.format === "flutter") {
    for (const { fileName } of icons) {
      lines.push(`export '${fileName}.dart';`);
    }
  } else {
    for (const { componentName, fileName } of icons) {
      if (isDefaultExport) {
        lines.push(`export { default as ${componentName} } from "./${fileName}${importSuffix}";`);
      } else {
        lines.push(`export { ${componentName} } from "./${fileName}${importSuffix}";`);
      }
    }
  }

  lines.push(``);
  return lines.join("\n");
};

const usesDefaultExport = (format: OutputFormat) => {
  switch (format) {
    case "mui":
    case "react":
    case "react-native":
    case "preact":
    case "solid":
      return true;
    case "angular":
    case "qwik":
    case "lit":
    case "web-component":
      return false;
    case "flutter":
      return false;
    case "vue":
    case "svelte":
    case "svg":
      return true;
    default:
      return true;
  }
};

const importExtension = (ext: string) => {
  if (ext === "vue" || ext === "svelte" || ext === "svg") {
    return `.${ext}`;
  }
  return "";
};
