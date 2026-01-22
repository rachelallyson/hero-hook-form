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

    // Memory management optimizations for field array tests
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 1, // Keep only 1 test in memory to reduce heap usage

    // Additional memory settings for field array performance
    video: false, // Disable video recording to save memory
    screenshotOnRunFailure: false, // Disable screenshots to save memory

    // Timeout adjustments for memory-intensive tests
    defaultCommandTimeout: 10000,
    execTimeout: 60000,
    taskTimeout: 60000,
    responseTimeout: 30000,
    requestTimeout: 30000,
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },
});
