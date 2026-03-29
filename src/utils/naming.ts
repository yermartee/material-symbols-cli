import type { NamingConvention, Naming, SymbolVariant } from "../types.js";

export const toPascalCase = (snakeName: string) =>
  snakeName
    .split(/[_\-\s]+/)
    .map((part) => {
      const withWords = replaceLeadingDigits(part);
      return withWords.charAt(0).toUpperCase() + withWords.slice(1);
    })
    .join("");

const DIGIT_WORDS: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
};

const NUMBER_WORDS: Record<string, string> = {
  "10": "Ten",
  "11": "Eleven",
  "12": "Twelve",
  "13": "Thirteen",
  "14": "Fourteen",
  "15": "Fifteen",
  "16": "Sixteen",
  "17": "Seventeen",
  "18": "Eighteen",
  "19": "Nineteen",
  "20": "Twenty",
  "21": "TwentyOne",
  "22": "TwentyTwo",
  "23": "TwentyThree",
  "24": "TwentyFour",
  "30": "Thirty",
  "40": "Forty",
  "48": "FortyEight",
  "50": "Fifty",
  "60": "Sixty",
  "100": "OneHundred",
  "123": "OneTwoThree",
  "200": "TwoHundred",
  "300": "ThreeHundred",
  "360": "ThreeSixty",
  "500": "FiveHundred",
  "600": "SixHundred",
  "700": "SevenHundred",
};

const replaceLeadingDigits = (segment: string) => {
  if (NUMBER_WORDS[segment]) {
    return NUMBER_WORDS[segment];
  }

  const match = /^(\d+)(.*)$/.exec(segment);
  if (!match) {
    return segment;
  }

  const [, digits = "", rest = ""] = match;
  if (NUMBER_WORDS[digits]) {
    return NUMBER_WORDS[digits] + rest;
  }

  const spelledDigits = [...digits].map((digit) => DIGIT_WORDS[digit]).join("");
  return spelledDigits + rest;
};

const toCamelCase = (name: string) => {
  const pascal = toPascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toKebabCase = (name: string) =>
  toPascalCase(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

const toSnakeCase = (name: string) =>
  toPascalCase(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();

export const applyConvention = (snakeName: string, convention: NamingConvention) => {
  switch (convention) {
    case "PascalCase":
      return toPascalCase(snakeName);
    case "camelCase":
      return toCamelCase(snakeName);
    case "kebab-case":
      return toKebabCase(snakeName);
    case "snake_case":
      return toSnakeCase(snakeName);
  }
};

export const resolveComponentName = (iconSnakeName: string, naming: Naming, variantSuffix: string) => {
  const overridden = naming.overrides[iconSnakeName];
  const baseName = overridden ?? applyConvention(iconSnakeName, naming.convention);
  return `${naming.prefix}${baseName}${variantSuffix}${naming.suffix}`;
};

export const resolveFileName = (iconSnakeName: string, naming: Naming, variantSuffix: string) => {
  const componentName = resolveComponentName(iconSnakeName, naming, variantSuffix);

  if (naming.convention === "kebab-case") {
    return componentName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
  if (naming.convention === "snake_case") {
    return componentName.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  }

  return componentName;
};

export const variantSuffix = (variant: SymbolVariant) => {
  const parts: string[] = [];

  if (variant.fill === 1) {
    parts.push("Filled");
  }
  if (variant.weight !== undefined && variant.weight !== 400) {
    parts.push(`Weight${variant.weight}`);
  }
  if (variant.grade !== undefined && variant.grade !== 0) {
    const gradeLabel = variant.grade < 0 ? `N${Math.abs(variant.grade)}` : `${variant.grade}`;
    parts.push(`Grade${gradeLabel}`);
  }
  if (variant.opticalSize !== undefined && variant.opticalSize !== 24) {
    parts.push(`Size${variant.opticalSize}`);
  }

  return parts.join("");
};

export const buildSvgFilename = (iconName: string, variant: SymbolVariant) => {
  const opticalSize = variant.opticalSize ?? 24;
  const modifiers: string[] = [];

  if (variant.weight !== undefined && variant.weight !== 400) {
    modifiers.push(`wght${variant.weight}`);
  }
  if (variant.grade !== undefined && variant.grade !== 0) {
    const gradeLabel = variant.grade < 0 ? `N${Math.abs(variant.grade)}` : `${variant.grade}`;
    modifiers.push(`grad${gradeLabel}`);
  }
  if (variant.fill === 1) {
    modifiers.push("fill1");
  }

  const modifierSegment = modifiers.length > 0 ? `_${modifiers.join("")}` : "";
  return `${iconName}${modifierSegment}_${opticalSize}px.svg`;
};

export const styleToDirectory = (style: "outlined" | "rounded" | "sharp") => {
  const map = {
    outlined: "materialsymbolsoutlined",
    rounded: "materialsymbolsrounded",
    sharp: "materialsymbolssharp",
  } as const;
  return map[style];
};
