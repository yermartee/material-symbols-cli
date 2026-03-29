import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      config: "src/config.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    minify: true,
    splitting: true,
    treeshake: true,
    sourcemap: true,
  },
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    banner: { js: "#!/usr/bin/env node" },
    clean: false,
    minify: true,
    splitting: false,
    treeshake: true,
  },
]);
