/**
 * Register all helpers as Cypress custom commands
 */

import {
  // Field Interaction Helpers
  fillInputByName,
  fillInputByType,
  fillInputByPlaceholder,
  fillInputByLabel,
  fillTextareaByName,
  fillTextarea,
  selectDropdownByName,
  selectDropdownOption,
  selectDropdownByLabel,
  checkCheckboxByName,
  checkCheckbox,
  checkCheckboxByLabel,
  checkSwitchByName,
  checkSwitch,
  uncheckCheckboxByName,
  uncheckCheckbox,
  uncheckSwitchByName,
  uncheckSwitch,
  moveSlider,
  moveSliderByName,
  selectRadioByName,
  checkCheckboxInGroupByName,
  selectAutocompleteByName,
  fillDateInputByName,
  selectFileByName,
  
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
  verifyFieldValueByName,
  verifyFieldValue,
  verifyFieldCount,
  getFormData,
  
  // Complex Form Flow Helpers
  fillCompleteForm,
  testFieldInteraction,
  testFormFlow,
} from './helpers';

import {
  waitForFormReady,
  waitForReactUpdate,
  waitForElementState,
  waitForDropdownOpen,
  waitForDropdownClose,
  getFormDataValue,
  verifyFormDataValue,
  findButtonNearLabel,
  waitForValidation,
  getFormDataArray,
  verifyFormDataArray,
  verifyFormDataFieldExists,
  verifyNameAttribute,
  verifyFormDataStructure,
  verifyFormCleared,
  verifyDropdownNameAttribute,
} from './utils';

/**
 * Register field interaction commands
 * New name-based helpers (recommended - most reliable)
 */
Cypress.Commands.add('fillInputByName', fillInputByName);
Cypress.Commands.add('fillTextareaByName', fillTextareaByName);
Cypress.Commands.add('selectDropdownByName', selectDropdownByName);
Cypress.Commands.add('checkCheckboxByName', checkCheckboxByName);
Cypress.Commands.add('checkSwitchByName', checkSwitchByName);
Cypress.Commands.add('uncheckCheckboxByName', uncheckCheckboxByName);
Cypress.Commands.add('uncheckSwitchByName', uncheckSwitchByName);
Cypress.Commands.add('moveSliderByName', moveSliderByName);
Cypress.Commands.add('selectRadioByName', selectRadioByName);
Cypress.Commands.add('checkCheckboxInGroupByName', checkCheckboxInGroupByName);
Cypress.Commands.add('selectAutocompleteByName', selectAutocompleteByName);
Cypress.Commands.add('fillDateInputByName', fillDateInputByName);
Cypress.Commands.add('selectFileByName', selectFileByName);

/**
 * Legacy field interaction commands (still supported)
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
Cypress.Commands.add('verifyFieldValueByName', verifyFieldValueByName);
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
 * Wait for form to be ready (uses improved utility)
 */
Cypress.Commands.add('waitForFormReady', (timeout?: number) => {
  return waitForFormReady(timeout);
});

/**
 * Wait for React to finish rendering updates
 */
Cypress.Commands.add('waitForReactUpdate', (timeout?: number) => {
  return waitForReactUpdate(timeout);
});

/**
 * Wait for element to be in a specific state
 */
Cypress.Commands.add('waitForElementState', (selector: string, state: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'exist', timeout?: number) => {
  return waitForElementState(selector, state, timeout);
});

/**
 * Wait for dropdown to open
 */
Cypress.Commands.add('waitForDropdownOpen', (timeout?: number) => {
  return waitForDropdownOpen(timeout);
});

/**
 * Wait for dropdown to close
 */
Cypress.Commands.add('waitForDropdownClose', (buttonSelector?: string, timeout?: number) => {
  return waitForDropdownClose(buttonSelector, timeout);
});

/**
 * Get FormData value by field name
 */
Cypress.Commands.add('getFormDataValue', (fieldName: string) => {
  return getFormDataValue(fieldName);
});

/**
 * Verify FormData contains expected value
 */
Cypress.Commands.add('verifyFormDataValue', (fieldName: string, expectedValue: string | number, timeout?: number) => {
  return verifyFormDataValue(fieldName, expectedValue, timeout);
});

/**
 * Wait for validation errors to appear or disappear
 */
Cypress.Commands.add('waitForValidation', (shouldHaveErrors?: boolean, timeout?: number) => {
  return waitForValidation(shouldHaveErrors, timeout);
});

/**
 * Get FormData array values by field name
 */
Cypress.Commands.add('getFormDataArray', (fieldName: string) => {
  return getFormDataArray(fieldName);
});

/**
 * Verify FormData contains array with expected values
 */
Cypress.Commands.add('verifyFormDataArray', (fieldName: string, expectedValues: string[], exactMatch?: boolean) => {
  return verifyFormDataArray(fieldName, expectedValues, exactMatch);
});

/**
 * Verify FormData field exists (name attribute is set)
 */
Cypress.Commands.add('verifyFormDataFieldExists', (fieldName: string) => {
  return verifyFormDataFieldExists(fieldName);
});

/**
 * Verify name attribute exists on element (either on element or via FormData)
 */
Cypress.Commands.add('verifyNameAttribute', (fieldName: string, selector?: string) => {
  return verifyNameAttribute(fieldName, selector);
});

/**
 * Verify complete form data structure matches expected values
 */
Cypress.Commands.add('verifyFormDataStructure', (expectedData: Record<string, string | number | string[]>) => {
  return verifyFormDataStructure(expectedData);
});

/**
 * Verify form is cleared (all specified fields are empty)
 */
Cypress.Commands.add('verifyFormCleared', (fieldNames: string[]) => {
  return verifyFormCleared(fieldNames);
});

/**
 * Verify dropdown name attribute (checks button or FormData)
 */
Cypress.Commands.add('verifyDropdownNameAttribute', (fieldName: string, labelText?: string) => {
  return verifyDropdownNameAttribute(fieldName, labelText);
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