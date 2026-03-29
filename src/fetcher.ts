import type { FetchTask, FetchedSvg, MetadataResponse, Config, SymbolVariant } from "./types.js";
import { buildSvgFilename, styleToDirectory } from "./utils/naming.js";

const METADATA_URL = "https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true";

const RAW_BASE = "https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web";

export const fetchMetadata = async () => {
  const response = await fetch(METADATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch icon metadata: ${response.status} ${response.statusText}`);
  }

  let text = await response.text();

  if (text.startsWith(")]}'")) {
    text = text.slice(text.indexOf("\n") + 1);
  }

  const data = JSON.parse(text) as MetadataResponse;
  return data.icons;
};

export const fetchSymbolNames = async () => {
  const icons = await fetchMetadata();
  return icons
    .filter((icon) => !icon.unsupported_families.includes("Material Symbols Outlined"))
    .map((icon) => icon.name);
};

const svgUrl = (iconName: string, style: string, variant: SymbolVariant) => {
  const dir = styleToDirectory(style as "outlined" | "rounded" | "sharp");
  const filename = buildSvgFilename(iconName, variant);
  return `${RAW_BASE}/${iconName}/${dir}/${filename}`;
};

const downloadSvg = async (url: string) => {
  const response = await fetch(url);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  return response.text();
};

export const extractPathData = (svgContent: string): string =>
  svgContent
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .trim();

export const fetchIcons = async (
  iconNames: string[],
  config: Config,
  onProgress?: (completed: number, total: number, name: string) => void,
) => {
  const results: FetchedSvg[] = [];
  const tasks: FetchTask[] = [];

  for (const iconName of iconNames) {
    for (const variant of config.variants) {
      tasks.push({ iconName, variant });
    }
  }

  const total = tasks.length;
  let completed = 0;

  const executing = new Set<Promise<void>>();

  for (const task of tasks) {
    const run = async () => {
      const url = svgUrl(task.iconName, config.style, task.variant);
      const svg = await downloadSvg(url);

      if (svg) {
        const pathData = extractPathData(svg);
        results.push({
          iconName: task.iconName,
          variant: task.variant,
          svgContent: svg,
          pathData,
        });
      }

      completed++;
      onProgress?.(completed, total, task.iconName);
    };

    const promise = run().then(() => {
      executing.delete(promise);
    });
    executing.add(promise);

    if (executing.size >= config.concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
};
