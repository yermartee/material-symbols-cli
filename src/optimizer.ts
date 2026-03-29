import { type Config, optimize } from "svgo";

const SVGO_CONFIG: Config = {
  floatPrecision: 4,
  plugins: [
    "cleanupAttrs",
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeTitle",
    "removeDesc",
    "removeUselessDefs",
    "removeEditorsNSData",
    "removeEmptyAttrs",
    "removeHiddenElems",
    "removeEmptyText",
    "removeEmptyContainers",
    "cleanupEnableBackground",
    "minifyStyles",
    "convertStyleToAttrs",
    "convertColors",
    "convertPathData",
    "convertTransform",
    "removeUnknownsAndDefaults",
    "removeNonInheritableGroupAttrs",
    "removeUselessStrokeAndFill",
    "removeUnusedNS",
    "cleanupNumericValues",
    "cleanupListOfValues",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    "collapseGroups",
    "mergePaths",
    "convertShapeToPath",
    "sortDefsChildren",
    "removeDimensions",
    {
      name: "removeAttrs",
      params: { attrs: ["class", "xmlns"] },
    },
  ],
};

export const optimizeSvg = (svgString: string) => {
  const result = optimize(svgString, SVGO_CONFIG);
  return result.data;
};

export const extractInnerSvg = (optimizedSvg: string): string =>
  optimizedSvg
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();

export const cleanPathData = (pathData: string): string =>
  pathData
    .replace(/<rect[^/]*fill="none"[^/]*\/>/g, "")
    .replace(/<path\s+d=""\s*\/>/g, "")
    .trim();

export const processRawSvg = (rawSvg: string) => {
  const optimizedSvg = optimizeSvg(rawSvg);
  const inner = extractInnerSvg(optimizedSvg);
  const pathData = cleanPathData(inner);
  return { optimizedSvg, pathData };
};
