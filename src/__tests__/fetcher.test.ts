import { describe, expect, it } from "vitest";
import { extractPathData } from "../fetcher.js";

describe("extractPathData", () => {
  it("strips outer svg tags and returns inner content", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10 20"/></svg>';
    const result = extractPathData(svg);
    expect(result).toBe('<path d="M10 20"/>');
  });

  it("handles svg with multiple attributes", () => {
    const svg = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10"/></svg>';
    const result = extractPathData(svg);
    expect(result).toBe('<circle cx="12" cy="12" r="10"/>');
  });

  it("handles multi-line SVG content", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
  <path d="M240-200h120"/>
  <path d="M480-740"/>
</svg>`;
    const result = extractPathData(svg);
    expect(result).toContain('<path d="M240-200h120"/>');
    expect(result).toContain('<path d="M480-740"/>');
  });

  it("handles empty SVG", () => {
    expect(extractPathData("<svg></svg>")).toBe("");
  });
});
