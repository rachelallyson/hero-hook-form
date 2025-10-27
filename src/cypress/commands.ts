/**
 * Register all helpers as Cypress custom commands
 */

import {
  // Field Interaction Helpers
  fillInputByType,
  fillInputByPlaceholder,
  fillInputByLabel,
  fillTextarea,
  selectDropdownOption,
  selectDropdownByLabel,
  checkCheckbox,
  checkCheckboxByLabel,
  checkSwitch,
  uncheckCheckbox,
  uncheckSwitch,
  moveSlider,
  
  // Validation & Error Testing Helpers
  expectValidationError,
  expectNoValidationErrors,
  expectFieldError,
  expectFieldValid,
  triggerValidation,
  testRealTimeValidation,
  testRequiredFieldValidation,
  testEmailValidation,
  testPhoneValidation,
  testPasswordValidation,
  testRequiredFieldsValidation,
  
  // Form Submission Helpers
  submitForm,
  submitAndExpectSuccess,
  submitAndExpectErrors,
  resetForm,
  interceptFormSubmission,
  
  // Form State Helpers
  verifyFormExists,
  verifyFieldExists,
  verifyFieldValue,
  verifyFieldCount,
  getFormData,
  
  // Complex Form Flow Helpers
  fillCompleteForm,
  testFieldInteraction,
  testFormFlow,
} from './helpers';

/**
 * Register field interaction commands
 */
Cypress.Commands.add('fillInputByType', fillInputByType);
Cypress.Commands.add('fillInputByPlaceholder', fillInputByPlaceholder);
Cypress.Commands.add('fillInputByLabel', fillInputByLabel);
Cypress.Commands.add('fillTextarea', fillTextarea);
Cypress.Commands.add('selectDropdownOption', selectDropdownOption);
Cypress.Commands.add('selectDropdownByLabel', selectDropdownByLabel);
Cypress.Commands.add('checkCheckbox', checkCheckbox);
Cypress.Commands.add('checkCheckboxByLabel', checkCheckboxByLabel);
Cypress.Commands.add('checkSwitch', checkSwitch);
Cypress.Commands.add('uncheckCheckbox', uncheckCheckbox);
Cypress.Commands.add('uncheckSwitch', uncheckSwitch);
Cypress.Commands.add('moveSlider', moveSlider);

/**
 * Register validation and error testing commands
 */
Cypress.Commands.add('expectValidationError', expectValidationError);
Cypress.Commands.add('expectNoValidationErrors', expectNoValidationErrors);
Cypress.Commands.add('expectFieldError', expectFieldError);
Cypress.Commands.add('expectFieldValid', expectFieldValid);
Cypress.Commands.add('triggerValidation', triggerValidation);
Cypress.Commands.add('submitAndExpectSuccess', submitAndExpectSuccess);
Cypress.Commands.add('submitAndExpectErrors', submitAndExpectErrors);

/**
 * Register form state commands
 */
Cypress.Commands.add('verifyFormExists', verifyFormExists);
Cypress.Commands.add('verifyFieldExists', verifyFieldExists);
Cypress.Commands.add('verifyFieldValue', verifyFieldValue);
Cypress.Commands.add('verifyFieldCount', verifyFieldCount);
Cypress.Commands.add('getFormData', getFormData);

/**
 * Register complex form flow commands
 */
Cypress.Commands.add('fillCompleteForm', fillCompleteForm);
Cypress.Commands.add('testFieldInteraction', testFieldInteraction);
Cypress.Commands.add('testFormFlow', testFormFlow);

/**
 * Register form submission commands
 */
Cypress.Commands.add('submitForm', submitForm);
Cypress.Commands.add('resetForm', resetForm);
Cypress.Commands.add('interceptFormSubmission', interceptFormSubmission);

/**
 * Legacy command aliases for backward compatibility
 */
Cypress.Commands.add('fillField', fillInputByLabel);
Cypress.Commands.add('selectOption', selectDropdownByLabel);

/**
 * Additional convenience commands
 */
Cypress.Commands.add('fillEmail', (value: string) => fillInputByType('email', value));
Cypress.Commands.add('fillPhone', (value: string) => fillInputByType('tel', value));
Cypress.Commands.add('fillPassword', (value: string) => fillInputByType('password', value));
Cypress.Commands.add('fillText', (value: string) => fillInputByType('text', value));

/**
 * Debug commands
 */
Cypress.Commands.add('logFormState', () => {
  cy.get('form').then(($form) => {
    const formData: Record<string, unknown> = {};
    
    $form.find('input, textarea, select').each((index, element) => {
      const $el = Cypress.$(element);
      const name = $el.attr('name') || `field_${index}`;
      const type = $el.attr('type') || element.tagName.toLowerCase();
      const value = $el.val();
      
      formData[name] = { type, value };
    });
    
    cy.log('Form state:', formData);
  });
});

/**
 * Wait for form to be ready
 */
Cypress.Commands.add('waitForFormReady', () => {
  cy.get('form').should('exist');
  cy.get('input, textarea, select').should('be.visible');
});

/**
 * Clear all form fields
 */
Cypress.Commands.add('clearForm', () => {
  cy.get('input, textarea').each(($el) => {
    cy.wrap($el).clear();
  });
});

/**
 * Verify form is in valid state
 */
Cypress.Commands.add('verifyFormValid', () => {
  cy.get('form').should('exist');
  cy.get('body').should('not.contain', 'error');
  cy.get('body').should('not.contain', 'invalid');
});

/**
 * Take form screenshot for debugging
 */
Cypress.Commands.add('screenshotForm', (name?: string) => {
  const screenshotName = name || `form-${Date.now()}`;
  cy.screenshot(screenshotName);
});