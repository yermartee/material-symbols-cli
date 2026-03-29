export const fileHeader = (header: string) => `// ${header}`;

export const SYMBOLS_VIEWBOX = "0 -960 960 960";

export const toKebab = (pascal: string) => pascal.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
