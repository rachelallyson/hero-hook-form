/**
 * Main export for Cypress form testing helpers
 * 
 * This module provides comprehensive Cypress testing helpers for forms built with
 * HeroUI components and React Hook Form. The helpers are designed to work with
 * the specific DOM patterns that HeroUI components create.
 * 
 * @example
 * ```typescript
 * // In your cypress/support/e2e.ts or commands.ts
 * import '@rachelallyson/hero-hook-form/cypress';
 * 
 * // Or register manually
 * import { registerHeroFormCommands } from '@rachelallyson/hero-hook-form/cypress';
 * registerHeroFormCommands();
 * ```
 */

// Export all types
export * from './types';

// Export utilities for advanced usage
export * from './utils';

// Export helper functions for direct usage
export * from './helpers';

/**
 * Register all HeroUI form testing commands with Cypress
 * 
 * This function registers all the custom commands with Cypress.
 * You can call this manually if you prefer to control when commands are registered.
 * 
 * @example
 * ```typescript
 * import { registerHeroFormCommands } from '@rachelallyson/hero-hook-form/cypress';
 * 
 * // Register commands
 * registerHeroFormCommands();
 * ```
 */
export function registerHeroFormCommands(): void {
  // Import and execute the commands registration
  require('./commands');
}

/**
 * Setup instructions for using the Cypress helpers
 * 
 * @example
 * ```typescript
 * // 1. Install the package
 * // npm install @rachelallyson/hero-hook-form
 * 
 * // 2. Import in your cypress/support/e2e.ts
 * import '@rachelallyson/hero-hook-form/cypress';
 * 
 * // 3. Use in your tests
 * cy.fillInputByType('email', 'test@example.com');
 * cy.selectDropdownByLabel('Country', 'United States');
 * cy.submitForm();
 * ```
 */
export const SETUP_INSTRUCTIONS = {
  installation: 'npm install @rachelallyson/hero-hook-form',
  import: "import '@rachelallyson/hero-hook-form/cypress';",
  usage: `
    // Basic field interactions
    cy.fillInputByType('email', 'test@example.com');
    cy.fillInputByLabel('First Name', 'John');
    cy.selectDropdownByLabel('Country', 'United States');
    cy.checkCheckboxByLabel('Terms and Conditions');
    
    // Form submission
    cy.submitForm();
    cy.submitAndExpectSuccess('Thank you for your submission');
    
    // Validation testing
    cy.expectValidationError('This field is required');
    cy.expectNoValidationErrors();
    
    // Complex form flows
    cy.fillCompleteForm({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      country: 'United States',
      agreeToTerms: true
    });
  `,
};

/**
 * Available commands reference
 */
export const COMMANDS_REFERENCE = {
  fieldInteractions: [
    'fillInputByType(type, value, index?, options?)',
    'fillInputByPlaceholder(placeholder, value, options?)',
    'fillInputByLabel(label, value, options?)',
    'fillTextarea(value, index?, options?)',
    'selectDropdownOption(optionValue, dropdownIndex?)',
    'selectDropdownByLabel(label, optionValue)',
    'checkCheckbox(index?)',
    'checkCheckboxByLabel(label)',
    'checkSwitch(index?)',
    'uncheckCheckbox(index?)',
    'uncheckSwitch(index?)',
    'moveSlider(value, index?)',
  ],
  validation: [
    'expectValidationError(message)',
    'expectNoValidationErrors()',
    'expectFieldError(fieldLabel, errorMessage)',
    'expectFieldValid(fieldLabel)',
    'triggerValidation(submitButton?)',
  ],
  submission: [
    'submitForm()',
    'submitAndExpectSuccess(successIndicator?)',
    'submitAndExpectErrors()',
    'resetForm()',
    'interceptFormSubmission(method, url, alias)',
  ],
  state: [
    'verifyFormExists()',
    'verifyFieldExists(selector)',
    'verifyFieldValue(selector, value)',
    'verifyFieldCount(selector, count)',
    'getFormData()',
  ],
  complex: [
    'fillCompleteForm(formData)',
    'testFieldInteraction(fieldType, value)',
    'testFormFlow(steps)',
  ],
  convenience: [
    'fillEmail(value)',
    'fillPhone(value)',
    'fillPassword(value)',
    'fillText(value)',
  ],
  debug: [
    'logFormState()',
    'waitForFormReady()',
    'clearForm()',
    'verifyFormValid()',
    'screenshotForm(name?)',
  ],
};

// Auto-register commands when this module is imported
// This allows users to simply import the module and start using commands
if (typeof Cypress !== 'undefined') {
  registerHeroFormCommands();
}
