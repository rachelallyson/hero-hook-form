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
// Import Hero Hook Form Cypress helpers
// Using direct path due to package.json exports issue
import { registerHeroFormCommands } from "../../node_modules/@rachelallyson/hero-hook-form/dist/cypress/index.js";

import "./commands";

// Manually register the commands
registerHeroFormCommands();

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
      // Field Interaction Helpers
      fillInputByType(
        type: string,
        value: string,
        index?: number,
        options?: any,
      ): Chainable<Element>;
      fillInputByPlaceholder(
        placeholder: string,
        value: string,
        options?: any,
      ): Chainable<Element>;
      fillInputByLabel(
        label: string,
        value: string,
        options?: any,
      ): Chainable<Element>;
      fillTextarea(
        value: string,
        index?: number,
        options?: any,
      ): Chainable<Element>;
      selectDropdownOption(
        optionValue?: string,
        dropdownIndex?: number,
      ): Chainable<Element>;
      selectDropdownByLabel(
        label: string,
        optionValue: string,
      ): Chainable<Element>;
      checkCheckbox(index?: number): Chainable<Element>;
      checkCheckboxByLabel(label: string): Chainable<Element>;
      checkSwitch(index?: number): Chainable<Element>;
      uncheckCheckbox(index?: number): Chainable<Element>;
      uncheckSwitch(index?: number): Chainable<Element>;
      moveSlider(value: number, index?: number): Chainable<Element>;

      // Validation & Error Testing Helpers
      expectValidationError(message: string): Chainable<Element>;
      expectNoValidationErrors(): Chainable<Element>;
      expectFieldError(
        fieldLabel: string,
        errorMessage: string,
      ): Chainable<Element>;
      expectFieldValid(fieldLabel: string): Chainable<Element>;
      triggerValidation(submitButton?: boolean): Chainable<Element>;

      // Form Submission Helpers
      submitForm(): Chainable<Element>;
      submitAndExpectSuccess(successIndicator?: string): Chainable<Element>;
      submitAndExpectErrors(
        errorMessage?: string,
        formIndex?: number,
      ): Chainable<Element>;
      resetForm(): Chainable<Element>;
      interceptFormSubmission(
        method: string,
        url: string,
        alias: string,
      ): Chainable<Element>;

      // Form State Helpers
      verifyFormExists(): Chainable<Element>;
      verifyFieldExists(selector: string): Chainable<Element>;
      verifyFieldValue(
        type: string,
        value: string,
        index?: number,
      ): Chainable<Element>;
      verifyFieldCount(selector: string, count: number): Chainable<Element>;
      getFormData(): Chainable<any>;

      // Complex Form Flow Helpers
      fillCompleteForm(formData: any): Chainable<Element>;
      testFieldInteraction(
        fieldType: string,
        value: string,
      ): Chainable<Element>;
      testFormFlow(steps: any[]): Chainable<Element>;

      // Legacy commands (kept for backward compatibility)
      fillField(label: string, value: string): Chainable<Element>;
      selectOption(label: string, option: string): Chainable<Element>;
    }
  }
}
