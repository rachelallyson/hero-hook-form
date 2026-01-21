import { defineConfig, globalIgnores } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import nextConfig from "eslint-config-next";

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

  // Next.js recommended config (includes React, import, and jsx-a11y rules)
  ...nextConfig,

  // Additional configuration for TypeScript files
  {
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
      prettier: fixupPluginRules(prettier),
      "unused-imports": unusedImports,
    },

    rules: {
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
      "no-console": "off", // Allow console statements in demo files for educational purposes
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
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
      "react-hooks/exhaustive-deps": "error",
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
