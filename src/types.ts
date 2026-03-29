export type SymbolStyle = "outlined" | "rounded" | "sharp";

export type SymbolFill = 0 | 1;

export type SymbolWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700;

export type SymbolGrade = -25 | 0 | 200;

export type SymbolOpticalSize = 20 | 24 | 40 | 48;

export type OutputFormat =
  | "mui"
  | "react"
  | "react-native"
  | "vue"
  | "angular"
  | "svelte"
  | "solid"
  | "preact"
  | "qwik"
  | "lit"
  | "web-component"
  | "flutter"
  | "svg";

export type NamingConvention = "PascalCase" | "camelCase" | "kebab-case" | "snake_case";

export interface SymbolVariant {
  fill?: SymbolFill;
  weight?: SymbolWeight;
  grade?: SymbolGrade;
  opticalSize?: SymbolOpticalSize;
}

export interface NamingConfig {
  convention?: NamingConvention;
  prefix?: string;
  suffix?: string;
  overrides?: Record<string, string>;
}

export type Naming = Required<Omit<NamingConfig, "overrides">> & {
  overrides: Record<string, string>;
};

export interface DefaultProps {
  size?: number;
  color?: string;
  className?: string;
}

export interface Defaults {
  size: number;
  color: string;
  className: string;
}

export interface IconEntry {
  componentName: string;
  fileName: string;
}

export interface FetchTask {
  iconName: string;
  variant: SymbolVariant;
}

export interface ConfigModule {
  default?: MaterialSymbolsConfig;
}

export interface MaterialSymbolsConfig {
  icons: "all" | string[];
  outputDir?: string;
  style?: SymbolStyle;
  format?: OutputFormat;
  variants?: SymbolVariant[];
  naming?: NamingConfig;
  defaultProps?: DefaultProps;
  optimize?: boolean;
  useClientDirective?: boolean;
  barrel?: boolean;
  extension?: string;
  declarations?: boolean;
  concurrency?: number;
  header?: string | false;
}

export interface Config {
  icons: "all" | string[];
  outputDir: string;
  style: SymbolStyle;
  format: OutputFormat;
  variants: SymbolVariant[];
  naming: Naming;
  defaultProps: Defaults;
  optimize: boolean;
  useClientDirective: boolean;
  barrel: boolean;
  extension: string;
  declarations: boolean;
  concurrency: number;
  header: string | false;
}

export interface SymbolMetadata {
  name: string;
  version: number;
  popularity: number;
  codepoint: number;
  unsupported_families: string[];
  categories: string[];
  tags: string[];
  sizes_px: number[];
}

export interface MetadataResponse {
  host: string;
  asset_url_pattern: string;
  families: string[];
  icons: SymbolMetadata[];
}

export interface FetchedSvg {
  iconName: string;
  variant: SymbolVariant;
  svgContent: string;
  pathData: string;
}

export interface GeneratedFile {
  filePath: string;
  componentName: string;
  content: string;
}
