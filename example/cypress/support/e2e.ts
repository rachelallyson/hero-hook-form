// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";

installLogsCollector({
  // add back in 'cy:command' if you want more
  collectTypes: [
    "cons:log",
    "cons:info",
    "cons:error",
    "cy:log",
    "cy:xhr",
    "cy:intercept",
    "cy:command",
  ],
});

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for form testing
declare global {
  namespace Cypress {
    interface Chainable {
      // New commands that work with HeroUI
      fillFieldByLabel(labelText: string, value: string): Chainable<Element>;
      fillFieldByType(inputType: string, value: string): Chainable<Element>;
      selectOptionByLabel(
        labelText: string,
        option: string,
      ): Chainable<Element>;
      testFormSubmission(): Chainable<Element>;
      testFieldInteraction(
        inputType: string,
        testValue: string,
      ): Chainable<Element>;

      // Legacy commands (kept for backward compatibility)
      fillField(label: string, value: string): Chainable<Element>;
      selectOption(label: string, option: string): Chainable<Element>;
      submitForm(): Chainable<Element>;
    }
  }
}
