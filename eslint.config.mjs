import globals from "globals";
import eslintConfigNode from "@rachelallyson/eslint-config-node";

export default [
  // Project-specific ignores
  // Files not in tsconfig.json that shouldn't be type-checked
  {
    ignores: [
      ".next/**",
      "example/.next/**",
      "out/**",
      "build/**",
      "old/**",
      "cypress/**",
      "example/cypress/**",
      "docs/cypress/**",
      "src/**/*.cy.{ts,tsx}",
      "src/utils/applyServerErrors.cy.tsx",
      "src/cypress/**",
      ".history",
      "@OnArkTypes/sdk.d.ts",
      "graphql/generated/*",
      "example/next-env.d.ts",
      "example/next.config.js",
      "example/postcss.config.js",
      "example/tailwind.config.js",
      "example/eslint.config.mjs",
      "docs/.next/**",
      "docs/out/**",
      "docs/**/*.js",
      "docs/**/*.mjs",
      "docs/**/*.tsx",
      "example/**/*.tsx",
      "*.config.{js,mjs,ts}",
      "cypress.config.mjs",
      "vite.config.ts",
    ],
  },

  // Browser globals and JSX support (required for React project)
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
  },

  // All rules from @rachelallyson/eslint-config-node
  ...eslintConfigNode,
];
