import { describe, expect, it } from "vitest";
import {
  toPascalCase,
  applyConvention,
  resolveComponentName,
  resolveFileName,
  variantSuffix,
  buildSvgFilename,
  styleToDirectory,
} from "../utils/naming.js";

describe("toPascalCase", () => {
  it("converts simple snake_case", () => {
    expect(toPascalCase("arrow_back")).toBe("ArrowBack");
  });

  it("converts single word", () => {
    expect(toPascalCase("home")).toBe("Home");
  });

  it("handles multi-segment names", () => {
    expect(toPascalCase("arrow_back_ios_new")).toBe("ArrowBackIosNew");
  });

  it("replaces leading single digit with word", () => {
    expect(toPascalCase("3d_rotation")).toBe("ThreedRotation");
  });

  it("replaces known multi-digit number with word", () => {
    expect(toPascalCase("10k")).toBe("Tenk");
    expect(toPascalCase("360")).toBe("ThreeSixty");
    expect(toPascalCase("123")).toBe("OneTwoThree");
  });

  it("handles unknown multi-digit by expanding each digit", () => {
    expect(toPascalCase("99")).toBe("NineNine");
  });

  it("handles leading digits followed by text", () => {
    expect(toPascalCase("1x_mobiledata")).toBe("OnexMobiledata");
  });

  it("handles hyphen-separated segments", () => {
    expect(toPascalCase("arrow-back")).toBe("ArrowBack");
  });

  it("handles space-separated segments", () => {
    expect(toPascalCase("arrow back")).toBe("ArrowBack");
  });

  it("handles empty string", () => {
    expect(toPascalCase("")).toBe("");
  });
});

describe("applyConvention", () => {
  it("applies PascalCase", () => {
    expect(applyConvention("arrow_back", "PascalCase")).toBe("ArrowBack");
  });

  it("applies camelCase", () => {
    expect(applyConvention("arrow_back", "camelCase")).toBe("arrowBack");
  });

  it("applies kebab-case", () => {
    expect(applyConvention("arrow_back", "kebab-case")).toBe("arrow-back");
  });

  it("applies snake_case", () => {
    expect(applyConvention("arrow_back_ios", "snake_case")).toBe("arrow_back_ios");
  });

  it("handles digit names in camelCase", () => {
    expect(applyConvention("3d_rotation", "camelCase")).toBe("threedRotation");
  });

  it("handles digit names in kebab-case", () => {
    expect(applyConvention("3d_rotation", "kebab-case")).toBe("threed-rotation");
  });
});

describe("resolveComponentName", () => {
  const defaultNaming = {
    convention: "PascalCase" as const,
    prefix: "",
    suffix: "",
    overrides: {} as Record<string, string>,
  };

  it("resolves a simple name with no prefix/suffix", () => {
    expect(resolveComponentName("home", defaultNaming, "")).toBe("Home");
  });

  it("applies prefix and suffix", () => {
    const naming = { ...defaultNaming, prefix: "Icon", suffix: "Sharp" };
    expect(resolveComponentName("home", naming, "")).toBe("IconHomeSharp");
  });

  it("uses override when provided", () => {
    const naming = {
      ...defaultNaming,
      overrides: { "3d_rotation": "Rotate3D" },
    };
    expect(resolveComponentName("3d_rotation", naming, "")).toBe("Rotate3D");
  });

  it("appends variant suffix", () => {
    expect(resolveComponentName("home", defaultNaming, "Filled")).toBe("HomeFilled");
  });

  it("combines override with variant suffix and prefix", () => {
    const naming = {
      ...defaultNaming,
      prefix: "Msym",
      overrides: { home: "House" },
    };
    expect(resolveComponentName("home", naming, "Filled")).toBe("MsymHouseFilled");
  });
});

describe("resolveFileName", () => {
  const defaultNaming = {
    convention: "PascalCase" as const,
    prefix: "",
    suffix: "",
    overrides: {} as Record<string, string>,
  };

  it("returns PascalCase file name by default", () => {
    expect(resolveFileName("arrow_back", defaultNaming, "")).toBe("ArrowBack");
  });

  it("returns kebab-case file name", () => {
    const naming = { ...defaultNaming, convention: "kebab-case" as const };
    expect(resolveFileName("arrow_back", naming, "")).toBe("arrow-back");
  });

  it("returns snake_case file name", () => {
    const naming = { ...defaultNaming, convention: "snake_case" as const };
    expect(resolveFileName("arrow_back", naming, "")).toBe("arrow_back");
  });

  it("passes through PascalCase as-is for camelCase convention", () => {
    const naming = { ...defaultNaming, convention: "camelCase" as const };
    expect(resolveFileName("arrow_back", naming, "")).toBe("arrowBack");
  });
});

describe("variantSuffix", () => {
  it("returns empty string for default variant", () => {
    expect(variantSuffix({ fill: 0, weight: 400, grade: 0, opticalSize: 24 })).toBe("");
  });

  it("adds Filled for fill=1", () => {
    expect(variantSuffix({ fill: 1 })).toBe("Filled");
  });

  it("adds Weight for non-400 weight", () => {
    expect(variantSuffix({ weight: 700 })).toBe("Weight700");
  });

  it("adds negative grade with N prefix", () => {
    expect(variantSuffix({ grade: -25 })).toBe("GradeN25");
  });

  it("adds positive grade", () => {
    expect(variantSuffix({ grade: 200 })).toBe("Grade200");
  });

  it("adds Size for non-24 opticalSize", () => {
    expect(variantSuffix({ opticalSize: 48 })).toBe("Size48");
  });

  it("combines multiple variant parts", () => {
    expect(variantSuffix({ fill: 1, weight: 700, grade: -25, opticalSize: 48 })).toBe("FilledWeight700GradeN25Size48");
  });

  it("returns empty string for empty variant", () => {
    expect(variantSuffix({})).toBe("");
  });
});

describe("buildSvgFilename", () => {
  it("builds default variant filename", () => {
    expect(
      buildSvgFilename("home", {
        fill: 0,
        weight: 400,
        grade: 0,
        opticalSize: 24,
      }),
    ).toBe("home_24px.svg");
  });

  it("includes weight modifier", () => {
    expect(buildSvgFilename("home", { weight: 700, opticalSize: 24 })).toBe("home_wght700_24px.svg");
  });

  it("includes fill modifier", () => {
    expect(buildSvgFilename("home", { fill: 1, opticalSize: 24 })).toBe("home_fill1_24px.svg");
  });

  it("includes negative grade modifier", () => {
    expect(buildSvgFilename("home", { grade: -25, opticalSize: 24 })).toBe("home_gradN25_24px.svg");
  });

  it("combines all modifiers in correct order", () => {
    expect(
      buildSvgFilename("home", {
        fill: 1,
        weight: 700,
        grade: 200,
        opticalSize: 48,
      }),
    ).toBe("home_wght700grad200fill1_48px.svg");
  });

  it("defaults opticalSize to 24 when not specified", () => {
    expect(buildSvgFilename("search", {})).toBe("search_24px.svg");
  });
});

describe("styleToDirectory", () => {
  it("maps outlined to correct directory name", () => {
    expect(styleToDirectory("outlined")).toBe("materialsymbolsoutlined");
  });

  it("maps rounded to correct directory name", () => {
    expect(styleToDirectory("rounded")).toBe("materialsymbolsrounded");
  });

  it("maps sharp to correct directory name", () => {
    expect(styleToDirectory("sharp")).toBe("materialsymbolssharp");
  });
});
