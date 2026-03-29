import type { OutputFormat, Config } from "../types.js";
import { generateAngular } from "./angular.js";
import { generateBarrel } from "./barrel.js";
import { generateFlutter } from "./flutter.js";
import { generateLit } from "./lit.js";
import { generatePreact } from "./preact.js";
import { generateQwik } from "./qwik.js";
import { generateReact } from "./react.js";
import { generateReactNative } from "./react-native.js";
import { generateMui } from "./mui.js";
import { generateSolid } from "./solid.js";
import { generateSvg } from "./svg.js";
import { generateSvelte } from "./svelte.js";
import { generateVue } from "./vue.js";
import { generateWebComponent } from "./web-component.js";

export type GeneratorFn = (componentName: string, pathData: string, config: Config) => string;

const GENERATORS: Record<OutputFormat, GeneratorFn> = {
  mui: generateMui,
  react: generateReact,
  "react-native": generateReactNative,
  vue: generateVue,
  angular: generateAngular,
  svelte: generateSvelte,
  solid: generateSolid,
  preact: generatePreact,
  qwik: generateQwik,
  lit: generateLit,
  "web-component": generateWebComponent,
  flutter: generateFlutter,
  svg: generateSvg,
};

export const getGenerator = (format: OutputFormat) => GENERATORS[format];

export { generateBarrel };
