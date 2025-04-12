import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const stylisticRules = {
  ...stylistic.configs.customize({
    indent: 2,
    quotes: "single",
    semi: true,
    jsx: true,
  }).rules,
  "@stylistic/arrow-parens": ["error", "always"],
  "@stylistic/object-curly-spacing": ["error", "always"],
  "@stylistic/comma-dangle": ["error", "always-multiline"],
  "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
  "@stylistic/max-len": ["error", { code: 100, ignoreUrls: true }],
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "dist/**",
      "build/**",
      "**/*.d.ts",
      "**/*.config.js",
      "**/*.config.ts",
    ],
    plugins: {
      "@stylistic": stylistic,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...stylisticRules,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];

export default eslintConfig;
