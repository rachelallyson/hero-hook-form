/**
 * TypeScript declarations for Cypress form testing helpers
 */

import type { FormFieldData, FormFlowStep, FieldInteractionOptions } from './types';

// Re-export types and helpers
export * from './types';
export * from './utils';
export * from './helpers';

// Export the main registration function
export function registerHeroFormCommands(): void;

// Export constants
export const SETUP_INSTRUCTIONS: {
  installation: string;
  import: string;
  usage: string;
};

export const COMMANDS_REFERENCE: {
  fieldInteractions: string[];
  validation: string[];
  submission: string[];
  state: string[];
  complex: string[];
  convenience: string[];
  debug: string[];
};

// Global type augmentations for Cypress
declare global {
  namespace Cypress {
    interface Chainable {
      // Field Interaction Helpers - Name-based (recommended, most reliable)
      fillInputByName(name: string, value: string, options?: FieldInteractionOptions): Chainable<Element>;
      fillTextareaByName(name: string, value: string, options?: FieldInteractionOptions): Chainable<Element>;
      selectDropdownByName(name: string, optionValue: string): Chainable<Element>;
      checkCheckboxByName(name: string): Chainable<Element>;
      checkSwitchByName(name: string): Chainable<Element>;
      uncheckCheckboxByName(name: string): Chainable<Element>;
      uncheckSwitchByName(name: string): Chainable<Element>;
      
      // Field Interaction Helpers - Legacy methods (still supported)
      fillInputByType(type: string, value: string, index?: number, options?: FieldInteractionOptions): Chainable<Element>;
      fillInputByPlaceholder(placeholder: string, value: string, options?: FieldInteractionOptions): Chainable<Element>;
      fillInputByLabel(label: string, value: string, options?: FieldInteractionOptions): Chainable<Element>;
      fillTextarea(value: string, index?: number, options?: FieldInteractionOptions): Chainable<Element>;
      selectDropdownOption(optionValue: string, dropdownIndex?: number): Chainable<Element>;
      selectDropdownByLabel(label: string, optionValue: string): Chainable<Element>;
      checkCheckbox(index?: number): Chainable<Element>;
      checkCheckboxByLabel(label: string): Chainable<Element>;
      checkSwitch(index?: number): Chainable<Element>;
      uncheckCheckbox(index?: number): Chainable<Element>;
      uncheckSwitch(index?: number): Chainable<Element>;
      moveSlider(value: number, index?: number): Chainable<Element>;
      moveSliderByName(name: string, value: number): Chainable<Element>;
      selectRadioByName(name: string, value: string): Chainable<Element>;
      checkCheckboxInGroupByName(name: string, index?: number): Chainable<Element>;
      selectAutocompleteByName(name: string, optionValue: string): Chainable<Element>;
      fillDateInputByName(name: string): Chainable<Element>;
      selectFileByName(name: string, filePath: string): Chainable<Element>;
      
      // Validation & Error Testing Helpers
      expectValidationError(message: string): Chainable<Element>;
      expectNoValidationErrors(): Chainable<Element>;
      expectFieldError(fieldLabel: string, errorMessage?: string): Chainable<Element>;
      expectFieldValid(fieldLabel: string): Chainable<Element>;
      triggerValidation(submitButton?: string): Chainable<Element>;
      testRealTimeValidation(fieldLabel: string, invalidValue: string, expectedError?: string): Chainable<Element>;
      testRequiredFieldValidation(fieldLabel: string, expectedError?: string): Chainable<Element>;
      testEmailValidation(email: string, shouldBeValid: boolean): Chainable<Element>;
      testPhoneValidation(phone: string, shouldBeValid: boolean): Chainable<Element>;
      testPasswordValidation(password: string, shouldBeValid: boolean): Chainable<Element>;
      testRequiredFieldsValidation(): Chainable<Element>;
      
      // Form Submission Helpers
      submitForm(): Chainable<Element>;
      submitAndExpectSuccess(successIndicator?: string): Chainable<Element>;
      submitAndExpectErrors(errorMessage?: string, formIndex?: number): Chainable<Element>;
      resetForm(): Chainable<Element>;
      interceptFormSubmission(method: string, url: string, alias: string): Chainable<Element>;
      
      // Form State Helpers
      verifyFormExists(): Chainable<Element>;
      verifyFieldExists(selector: string): Chainable<Element>;
      verifyFieldValueByName(name: string, value: string): Chainable<Element>;
      verifyFieldValue(type: string, value: string, index?: number): Chainable<Element>;
      verifyFieldCount(selector: string, count: number): Chainable<Element>;
      getFormData(): Chainable<FormFieldData>;
      
      // Complex Form Flow Helpers
      fillCompleteForm(formData: FormFieldData): Chainable<Element>;
      testFieldInteraction(fieldType: string, value: string): Chainable<Element>;
      testFormFlow(steps: FormFlowStep[]): Chainable<Element>;
      
      // Legacy commands (backward compatibility)
      fillField(label: string, value: string): Chainable<Element>;
      selectOption(label: string, option: string): Chainable<Element>;
      
      // Convenience commands
      fillEmail(value: string): Chainable<Element>;
      fillPhone(value: string): Chainable<Element>;
      fillPassword(value: string): Chainable<Element>;
      fillText(value: string): Chainable<Element>;
      
      // Debug commands
      logFormState(): Chainable<Element>;
      waitForFormReady(timeout?: number): Chainable<JQuery<HTMLElement>>;
      clearForm(): Chainable<Element>;
      verifyFormValid(): Chainable<Element>;
      screenshotForm(name?: string): Chainable<Element>;
      
      // Utility Helpers (for better form testing)
      waitForReactUpdate(timeout?: number): Chainable<void>;
      waitForElementState(selector: string, state: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'exist', timeout?: number): Chainable<JQuery<HTMLElement>>;
      waitForDropdownOpen(timeout?: number): Chainable<JQuery<HTMLElement>>;
      waitForDropdownClose(buttonSelector?: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
      getFormDataValue(fieldName: string): Chainable<string | File | null>;
      verifyFormDataValue(fieldName: string, expectedValue: string | number, timeout?: number): Chainable<void>;
      waitForValidation(shouldHaveErrors?: boolean, timeout?: number): Chainable<void>;
      getFormDataArray(fieldName: string): Chainable<string[]>;
      verifyFormDataArray(fieldName: string, expectedValues: string[], exactMatch?: boolean): Chainable<void>;
      verifyFormDataFieldExists(fieldName: string): Chainable<void>;
      verifyNameAttribute(fieldName: string, selector?: string): Chainable<void>;
      verifyFormDataStructure(expectedData: Record<string, string | number | string[]>): Chainable<void>;
      verifyFormCleared(fieldNames: string[]): Chainable<void>;
      verifyDropdownNameAttribute(fieldName: string, labelText?: string): Chainable<void>;
    }
  }
}
