import { describe, expect, it } from "vitest";
import { optimizeSvg, extractInnerSvg, cleanPathData, processRawSvg } from "../optimizer.js";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>`;

describe("optimizeSvg", () => {
  it("returns a valid SVG string", () => {
    const result = optimizeSvg(SAMPLE_SVG);
    expect(result).toContain("<svg");
    expect(result).toContain("</svg>");
  });

  it("removes xmlns attribute", () => {
    const result = optimizeSvg(SAMPLE_SVG);
    expect(result).not.toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("removes explicit width/height dimensions", () => {
    const result = optimizeSvg(SAMPLE_SVG);
    expect(result).not.toMatch(/\swidth="\d+"/);
    expect(result).not.toMatch(/\sheight="\d+"/);
  });

  it("preserves the path data", () => {
    const result = optimizeSvg(SAMPLE_SVG);
    expect(result).toContain("<path");
    expect(result).toContain("d=");
  });
});

describe("extractInnerSvg", () => {
  it("strips the outer svg tags", () => {
    const inner = extractInnerSvg('<svg viewBox="0 0 24 24"><path d="M10 20"/></svg>');
    expect(inner).toBe('<path d="M10 20"/>');
    expect(inner).not.toContain("<svg");
    expect(inner).not.toContain("</svg>");
  });

  it("handles complex SVG attributes", () => {
    const inner = extractInnerSvg('<svg viewBox="0 0 24 24" class="icon"><path d="M5 5"/></svg>');
    expect(inner).toBe('<path d="M5 5"/>');
  });

  it("handles multiple child elements", () => {
    const inner = extractInnerSvg('<svg viewBox="0 0 24 24"><path d="M1"/><path d="M2"/></svg>');
    expect(inner).toContain('<path d="M1"/>');
    expect(inner).toContain('<path d="M2"/>');
  });
});

describe("cleanPathData", () => {
  it("removes empty fill=none rect elements", () => {
    const result = cleanPathData('<rect fill="none" height="24" width="24"/><path d="M10 20"/>');
    expect(result).toBe('<path d="M10 20"/>');
  });

  it("removes empty path elements", () => {
    const result = cleanPathData('<path d="" /><path d="M10 20"/>');
    expect(result).toBe('<path d="M10 20"/>');
  });

  it("preserves valid path data", () => {
    const data = '<path d="M240-200h120v-240h240v240h120"/>';
    expect(cleanPathData(data)).toBe(data);
  });
});

describe("processRawSvg", () => {
  it("returns optimized SVG and cleaned path data", () => {
    const result = processRawSvg(SAMPLE_SVG);

    expect(result.optimizedSvg).toContain("<svg");
    expect(result.pathData).toContain("<path");
    expect(result.pathData).not.toContain("<svg");
  });

  it("applies SVGO optimization", () => {
    const result = processRawSvg(SAMPLE_SVG);
    expect(result.optimizedSvg).not.toMatch(/\swidth="\d+"/);
  });
});
