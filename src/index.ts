export { defineConfig, resolveConfig, loadConfigFile } from "./config.js";
export { fetchMetadata, fetchSymbolNames, fetchIcons } from "./fetcher.js";
export { optimizeSvg, processRawSvg, extractInnerSvg } from "./optimizer.js";
export { getGenerator, generateBarrel } from "./generators/index.js";
export {
  toPascalCase,
  applyConvention,
  resolveComponentName,
  resolveFileName,
  variantSuffix,
  buildSvgFilename,
  styleToDirectory,
} from "./utils/naming.js";

export type {
  OutputFormat,
  SymbolStyle,
  SymbolFill,
  SymbolWeight,
  SymbolGrade,
  SymbolOpticalSize,
  SymbolVariant,
  NamingConvention,
  NamingConfig,
  MaterialSymbolsConfig,
  Config,
  SymbolMetadata,
  MetadataResponse,
  FetchedSvg,
  GeneratedFile,
} from "./types.js";
