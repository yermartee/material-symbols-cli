import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { Command } from "commander";
import ora from "ora";
import pc from "picocolors";
import { loadConfigFile, resolveConfig } from "./config.js";
import { fetchIcons, fetchSymbolNames } from "./fetcher.js";
import { processRawSvg } from "./optimizer.js";
import { generateBarrel, getGenerator } from "./generators/index.js";
import { resolveComponentName, resolveFileName, variantSuffix } from "./utils/naming.js";
import type { ConfigModule, IconEntry, MaterialSymbolsConfig } from "./types.js";

interface PackageJson {
  version: string;
}

interface InitOptions {
  format: string;
}

interface ListOptions {
  search?: string;
  json?: boolean;
}

interface ConfigPathOptions {
  config?: string;
}

const { version } = createRequire(import.meta.url)("../package.json") as PackageJson;

const program = new Command();

program
  .name("msym")
  .description("Fetch Google Material Symbols and generate framework-compatible icon components")
  .version(version);

const loadConfig = async (configPath?: string) => {
  if (configPath) {
    const { pathToFileURL } = await import("node:url");
    const module = (await import(pathToFileURL(path.resolve(configPath)).href)) as ConfigModule;
    return module.default ?? null;
  }
  return loadConfigFile(process.cwd());
};

const handleError = (spinner: ReturnType<typeof ora>, error: unknown) => {
  spinner.fail(`Failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
};

program
  .command("init")
  .description("Create a material-symbols.config.mts config file")
  .option("-f, --format <format>", "Output format", "mui")
  .action(async (options: InitOptions) => {
    const configPath = path.resolve(process.cwd(), "material-symbols.config.mts");

    if (existsSync(configPath)) {
      console.log(pc.yellow("Config file already exists: material-symbols.config.mts"));
      return;
    }

    const content = `import { defineConfig } from "@hianali/material-symbols-cli/config";

export default defineConfig({
  icons: ["home", "search", "menu", "close", "settings"],
  format: "${options.format}",
  style: "outlined",
  outputDir: "src/icons",
});
`;

    writeFileSync(configPath, content, "utf-8");
    console.log(`${pc.green("✓")} Created material-symbols.config.mts`);
    console.log(`  Edit the config file, then run ${pc.cyan("msym sync")} to generate icons.`);
  });

interface SyncOptions {
  config?: string;
  format?: string;
  style?: string;
  output?: string;
  icons?: string;
}

program
  .command("sync")
  .alias("generate")
  .description("Fetch icons from Google and generate components")
  .option("-c, --config <path>", "Path to config file")
  .option("--format <format>", "Override output format")
  .option("--style <style>", "Override symbol style")
  .option("-o, --output <dir>", "Override output directory")
  .option("--icons <names>", "Comma-separated icon names (overrides config)")
  .action(async (options: SyncOptions) => {
    const spinner = ora("Loading configuration…").start();

    try {
      const userConfig = await loadConfig(options.config);

      if (!userConfig) {
        spinner.fail(`No config file found. Run ${pc.cyan("msym init")} first.`);
        process.exit(1);
      }

      if (options.format) {
        userConfig.format = options.format as MaterialSymbolsConfig["format"];
      }
      if (options.style) {
        userConfig.style = options.style as MaterialSymbolsConfig["style"];
      }
      if (options.output) {
        userConfig.outputDir = options.output;
      }
      if (options.icons) {
        userConfig.icons = options.icons.split(",").map((icon) => icon.trim());
      }

      const config = resolveConfig(userConfig);

      spinner.text = "Fetching icon catalog…";
      let iconNames: string[];

      if (config.icons === "all") {
        iconNames = await fetchSymbolNames();
        spinner.text = `Found ${iconNames.length} icons. Downloading…`;
      } else {
        iconNames = config.icons;
        spinner.text = `Downloading ${iconNames.length} icon(s)…`;
      }

      const fetched = await fetchIcons(iconNames, config, (done, total, name) => {
        spinner.text = `Downloading… ${done}/${total} (${name})`;
      });

      spinner.text = "Generating components…";

      const generator = getGenerator(config.format);
      const outputDirectory = path.resolve(process.cwd(), config.outputDir);
      mkdirSync(outputDirectory, { recursive: true });

      const generatedIcons: IconEntry[] = [];
      let generatedCount = 0;

      for (const svg of fetched) {
        const { pathData } = config.optimize ? processRawSvg(svg.svgContent) : { pathData: svg.pathData };

        const suffix = variantSuffix(svg.variant);
        const componentName = resolveComponentName(svg.iconName, config.naming, suffix);
        const fileName = resolveFileName(svg.iconName, config.naming, suffix);

        const content = generator(componentName, pathData, config);
        const filePath = path.join(outputDirectory, `${fileName}.${config.extension}`);
        writeFileSync(filePath, content, "utf-8");

        generatedIcons.push({ componentName, fileName });
        generatedCount++;
      }

      if (config.barrel && generatedIcons.length > 0) {
        const barrelContent = generateBarrel(generatedIcons, config);
        const barrelExtension =
          config.format === "svg" ? "ts" : config.format === "flutter" ? "dart" : config.extension;
        const barrelPath = path.join(outputDirectory, `index.${barrelExtension}`);
        writeFileSync(barrelPath, barrelContent, "utf-8");
      }

      spinner.succeed(`Generated ${pc.bold(String(generatedCount))} icon(s) → ${pc.cyan(config.outputDir)}`);
    } catch (error) {
      handleError(spinner, error);
    }
  });

program
  .command("list")
  .description("List all available Material Symbol icon names")
  .option("-s, --search <query>", "Filter icons by name")
  .option("--json", "Output as JSON")
  .action(async (options: ListOptions) => {
    const spinner = ora("Fetching icon catalog…").start();

    try {
      let names = await fetchSymbolNames();

      if (options.search) {
        const query = options.search.toLowerCase();
        names = names.filter((name) => name.includes(query));
      }

      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(names, null, 2));
      } else {
        console.log(pc.bold(`${names.length} icons available:\n`));
        const columns = Math.min(4, Math.floor((process.stdout.columns || 80) / 30));
        for (let index = 0; index < names.length; index += columns) {
          const row = names
            .slice(index, index + columns)
            .map((name) => name.padEnd(28))
            .join("  ");
          console.log(`  ${row}`);
        }
      }
    } catch (error) {
      handleError(spinner, error);
    }
  });

program
  .command("add <icons...>")
  .description("Add specific icons to the output directory")
  .option("-c, --config <path>", "Path to config file")
  .action(async (icons: string[], options: ConfigPathOptions) => {
    const spinner = ora("Loading configuration…").start();

    try {
      const userConfig = await loadConfig(options.config);

      if (!userConfig) {
        spinner.fail(`No config file found. Run ${pc.cyan("msym init")} first.`);
        process.exit(1);
      }

      userConfig.icons = icons;
      const config = resolveConfig(userConfig);

      spinner.text = `Downloading ${icons.length} icon(s)…`;

      const fetched = await fetchIcons(icons, config);
      const generator = getGenerator(config.format);
      const outputDirectory = path.resolve(process.cwd(), config.outputDir);
      mkdirSync(outputDirectory, { recursive: true });

      let generatedCount = 0;
      for (const svg of fetched) {
        const { pathData } = config.optimize ? processRawSvg(svg.svgContent) : { pathData: svg.pathData };

        const suffix = variantSuffix(svg.variant);
        const componentName = resolveComponentName(svg.iconName, config.naming, suffix);
        const fileName = resolveFileName(svg.iconName, config.naming, suffix);

        const content = generator(componentName, pathData, config);
        const filePath = path.join(outputDirectory, `${fileName}.${config.extension}`);
        writeFileSync(filePath, content, "utf-8");
        generatedCount++;
      }

      spinner.succeed(`Added ${pc.bold(String(generatedCount))} icon(s) → ${pc.cyan(config.outputDir)}`);
    } catch (error) {
      handleError(spinner, error);
    }
  });

program
  .command("remove <icons...>")
  .description("Remove specific icons from the output directory")
  .option("-c, --config <path>", "Path to config file")
  .action(async (icons: string[], options: ConfigPathOptions) => {
    const { unlinkSync } = await import("node:fs");

    const userConfig = await loadConfig(options.config);

    if (!userConfig) {
      console.log(pc.red("No config file found."));
      process.exit(1);
    }

    const config = resolveConfig(userConfig);
    const outputDirectory = path.resolve(process.cwd(), config.outputDir);
    let removedCount = 0;

    for (const iconName of icons) {
      for (const variant of config.variants) {
        const suffix = variantSuffix(variant);
        const fileName = resolveFileName(iconName, config.naming, suffix);
        const filePath = path.join(outputDirectory, `${fileName}.${config.extension}`);

        if (existsSync(filePath)) {
          unlinkSync(filePath);
          removedCount++;
          console.log(`  ${pc.red("✕")} ${fileName}.${config.extension}`);
        }
      }
    }

    console.log(`\nRemoved ${pc.bold(String(removedCount))} file(s).`);
  });

program.parse();
