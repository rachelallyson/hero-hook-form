import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      bundler: "vite",
      framework: "react",
    },
    specPattern: "src/**/*.cy.{js,jsx,tsx}",
    supportFile: "cypress/support/component.ts",
    indexHtmlFile: "cypress/support/component-index.html",
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },
});
