import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import _import from "eslint-plugin-import";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  globalIgnores([
    ".now/*",
    "**/*.css",
    "**/.changeset",
    "**/dist",
    "esm/*",
    "public/*",
    "tests/*",
    "scripts/*",
    "**/*.config.js",
    "**/.DS_Store",
    "**/node_modules",
    "**/coverage",
    "**/.next",
    "**/build",
    "!**/.commitlintrc.cjs",
    "!**/.lintstagedrc.cjs",
    "!**/jest.config.js",
    "!**/plopfile.js",
    "!**/react-shim.js",
    "!**/tsup.config.ts",
  ]),
  {
    extends: fixupConfigRules(
      compat.extends(
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@next/next/recommended",
      ),
    ),

    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      ecmaVersion: 2022,

      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, "off"]),
        ),
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      sourceType: "module",
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: fixupPluginRules(_import),
      "jsx-a11y": fixupPluginRules(jsxA11Y),
      prettier: fixupPluginRules(prettier),
      react: fixupPluginRules(react),
      "unused-imports": unusedImports,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_.*?$",
          ignoreRestSiblings: false,
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "external",
              pattern: "~/**",
              position: "after",
            },
          ],
        },
      ],
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
      "no-console": "warn",
      "no-unused-vars": "off",
      "padding-line-between-statements": [
        "warn",
        {
          blankLine: "always",
          next: "return",
          prev: "*",
        },
        {
          blankLine: "always",
          next: "*",
          prev: ["const", "let", "var"],
        },
        {
          blankLine: "any",
          next: ["const", "let", "var"],
          prev: ["const", "let", "var"],
        },
      ],
      "prettier/prettier": "warn",
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          noSortAlphabetically: false,
          reservedFirst: true,
          shorthandFirst: true,
        },
      ],
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",

      "react/react-in-jsx-scope": "off",

      "react/self-closing-comp": "warn",

      "react-hooks/exhaustive-deps": "off",

      "unused-imports/no-unused-imports": "warn",

      "unused-imports/no-unused-vars": "off",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
