import { defineConfig } from "cypress";
import installLogsPrinter from "cypress-terminal-report/src/installLogsPrinter";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      installLogsPrinter(on, {
        commandTrimLength: 50000,
        defaultTrimLength: 50000,
        printLogsToConsole: "always",
      });

      return config;
    },
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    video: false,
  },
});
