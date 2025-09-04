import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import globals from "globals";
import tsEslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { fixupPluginRules } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const patchedNextPlugin = fixupPluginRules(nextPlugin);

export default [
  // Base ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "example/.next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "old/**",
      "cypress/**",
      "src/**/*.cy.{ts,tsx}",
      "src/utils/applyServerErrors.cy.tsx",
    ],
  },
  {
    ignores: [
      ".history",
      "node_modules",
      ".next",
      "@OnArkTypes/sdk.d.ts",
      "graphql/generated/*",
      "example/next-env.d.ts",
      "example/next.config.js",
      "example/postcss.config.js",
      "example/tailwind.config.js",
    ],
  },

  // Base ESLint configuration
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,

  // Base configuration with globals and basic rules
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "sort-destructure-keys": sortDestructureKeys,
      "sort-keys-fix": sortKeysFix,
    },
    rules: {
      "no-unused-vars": "off",
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", next: "return", prev: "*" },
        { blankLine: "always", next: "*", prev: ["const", "let", "var"] },
        {
          blankLine: "any",
          next: ["const", "let", "var"],
          prev: ["const", "let", "var"],
        },
      ],
      "prefer-template": "error",
      "sort-destructure-keys/sort-destructure-keys": 2,
      "sort-keys-fix/sort-keys-fix": [
        "error",
        "asc",
        { caseSensitive: false, natural: true },
      ],
    },
  },

  // TypeScript configuration for src and react directories (with type checking)
  ...tsEslint.config(
    ...tsEslint.configs.recommendedTypeChecked,
    ...tsEslint.configs.stylisticTypeChecked,
    {
      files: ["src/**/*.{ts,tsx}", "react/**/*.{ts,tsx}"],
      ignores: ["src/**/*.cy.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          project: resolve(__dirname, "./tsconfig.json"),
          tsconfigRootDir: __dirname,
        },
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "after-used",
            argsIgnorePattern: "^_.*?$",
            ignoreRestSiblings: false,
          },
        ],
      },
    },
  ),

  // TypeScript configuration for example directory (without type checking)
  ...tsEslint.config(
    ...tsEslint.configs.recommended,
    ...tsEslint.configs.stylistic,
    {
      files: ["example/**/*.{ts,tsx}"],
      languageOptions: {
        parserOptions: {
          project: resolve(__dirname, "./example/tsconfig.json"),
          tsconfigRootDir: __dirname,
        },
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "after-used",
            argsIgnorePattern: "^_.*?$",
            ignoreRestSiblings: false,
          },
        ],
      },
    },
  ),

  // TypeScript configuration for root-level files (without type checking)
  {
    files: ["*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_.*?$",
          ignoreRestSiblings: false,
        },
      ],
    },
    ...tsEslint.configs.disableTypeChecked,
  },

  // Disable type checking for other file types
  ...tsEslint.config({
    files: ["**/*.{js,cjs,mjs,js,graphql}"],
    ...tsEslint.configs.disableTypeChecked,
  }),

  // Import configuration
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "import/no-unused-modules": "error",
      "import/order": "off",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Style imports.
            ["^.+\\.s?css$", "^.+\\.[Ss]tyled$"],
            // Packages. `react` related packages come first.
            ["^react$"],
            // Next.js packages
            ["^next"],
            // node_module packages
            ["^@?\\w", "^\\u0000"],
            // App imports
            ["^@App"],
            // Parent imports. Put `..` last.
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Other relative imports. Put same-folder imports and `.` last.
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ],
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // React configuration
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "@next/next": patchedNextPlugin,
      "jsx-a11y": jsxA11y,
      react: reactPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
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
    },
  },

  // Global rules
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "no-sparse-arrays": "off",
    },
  },
];
