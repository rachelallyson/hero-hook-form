/**
 * TypeScript types for Cypress form testing helpers
 */

export interface FormFieldData {
  [key: string]: string | number | boolean | string[] | FileList | null;
}

export interface FormTestConfig {
  /** Whether to use strict mode (fail fast on missing fields) */
  strict?: boolean;
  /** Timeout for field interactions in milliseconds */
  timeout?: number;
  /** Whether to retry failed interactions */
  retry?: boolean;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Delay between retries in milliseconds */
  retryDelay?: number;
}

export interface ValidationTestConfig {
  /** Expected error messages */
  expectedErrors?: string[];
  /** Whether to check for specific field errors */
  fieldErrors?: Record<string, string>;
  /** Whether to verify no errors exist */
  expectNoErrors?: boolean;
}

export interface FormFlowStep {
  /** Type of interaction */
  type: 'fill' | 'select' | 'check' | 'uncheck' | 'submit' | 'wait';
  /** Field identifier (label, type, placeholder, etc.) */
  field?: string;
  /** Value to set or option to select */
  value?: string | number | boolean;
  /** Expected result after step */
  expect?: string | boolean;
  /** Wait time in milliseconds */
  waitTime?: number;
}

export interface HeroUISelectors {
  /** Input selectors by type */
  inputs: {
    text: string;
    email: string;
    tel: string;
    password: string;
    number: string;
    url: string;
    search: string;
  };
  /** Textarea selector */
  textarea: string;
  /** Dropdown selectors */
  dropdown: {
    trigger: string;
    option: string;
  };
  /** Checkbox selectors */
  checkbox: {
    input: string;
    role: string;
  };
  /** Switch selectors */
  switch: {
    input: string;
    role: string;
  };
  /** Radio button selectors */
  radio: {
    input: string;
    group: string;
  };
  /** Slider selectors */
  slider: string;
  /** Button selectors */
  button: {
    submit: string;
    reset: string;
    generic: string;
  };
}

export interface FieldInteractionOptions {
  /** Whether to clear field before typing */
  clear?: boolean;
  /** Whether to use force click for dropdowns */
  force?: boolean;
  /** Whether to wait for field to be visible */
  waitForVisible?: boolean;
  /** Custom timeout for this interaction */
  timeout?: number;
}

export interface FormSubmissionOptions {
  /** Whether to wait for network requests */
  waitForNetwork?: boolean;
  /** Expected success indicators */
  successIndicators?: string[];
  /** Expected error indicators */
  errorIndicators?: string[];
  /** Whether to intercept form submission */
  intercept?: {
    method: string;
    url: string;
    alias: string;
  };
}

export interface CypressFormHelpers {
  // Field Interaction Helpers - Name-based (recommended, most reliable)
  fillInputByName: (name: string, value: string, options?: FieldInteractionOptions) => Cypress.Chainable<Element>;
  fillTextareaByName: (name: string, value: string, options?: FieldInteractionOptions) => Cypress.Chainable<Element>;
  selectDropdownByName: (name: string, optionValue: string) => Cypress.Chainable<Element>;
  checkCheckboxByName: (name: string) => Cypress.Chainable<Element>;
  checkSwitchByName: (name: string) => Cypress.Chainable<Element>;
  uncheckCheckboxByName: (name: string) => Cypress.Chainable<Element>;
  uncheckSwitchByName: (name: string) => Cypress.Chainable<Element>;
  moveSliderByName: (name: string, value: number) => Cypress.Chainable<Element>;
  selectRadioByName: (name: string, value: string) => Cypress.Chainable<Element>;
  checkCheckboxInGroupByName: (name: string, index?: number) => Cypress.Chainable<Element>;
  selectAutocompleteByName: (name: string, optionValue: string) => Cypress.Chainable<Element>;
  fillDateInputByName: (name: string) => Cypress.Chainable<Element>;
  selectFileByName: (name: string, filePath: string) => Cypress.Chainable<Element>;
  
  // Field Interaction Helpers - Legacy methods (still supported)
  fillInputByType: (type: string, value: string, index?: number, options?: FieldInteractionOptions) => Cypress.Chainable<Element>;
  fillInputByPlaceholder: (placeholder: string, value: string, options?: FieldInteractionOptions) => Cypress.Chainable<Element>;
  fillInputByLabel: (label: string, value: string, options?: FieldInteractionOptions) => Cypress.Chainable<Element>;
  fillTextarea: (value: string, index?: number, options?: FieldInteractionOptions) => Cypress.Chainable<Element>;
  selectDropdownOption: (optionValue: string, dropdownIndex?: number) => Cypress.Chainable<Element>;
  selectDropdownByLabel: (label: string, optionValue: string) => Cypress.Chainable<Element>;
  checkCheckbox: (index?: number) => Cypress.Chainable<Element>;
  checkCheckboxByLabel: (label: string) => Cypress.Chainable<Element>;
  checkSwitch: (index?: number) => Cypress.Chainable<Element>;
  uncheckCheckbox: (index?: number) => Cypress.Chainable<Element>;
  uncheckSwitch: (index?: number) => Cypress.Chainable<Element>;
  moveSlider: (value: number, index?: number) => Cypress.Chainable<Element>;
  
  // Validation & Error Testing Helpers
  expectValidationError: (message: string) => Cypress.Chainable<Element>;
  expectNoValidationErrors: () => Cypress.Chainable<Element>;
  expectFieldError: (fieldLabel: string, errorMessage: string) => Cypress.Chainable<Element>;
  expectFieldValid: (fieldLabel: string) => Cypress.Chainable<Element>;
  triggerValidation: (submitButton?: boolean) => Cypress.Chainable<Element>;
  
  // Form Submission Helpers
  submitForm: () => Cypress.Chainable<Element>;
  submitAndExpectSuccess: (successIndicator?: string) => Cypress.Chainable<Element>;
  submitAndExpectErrors: (errorMessage?: string, formIndex?: number) => Cypress.Chainable<Element>;
  resetForm: () => Cypress.Chainable<Element>;
  interceptFormSubmission: (method: string, url: string, alias: string) => Cypress.Chainable<Element>;
  
  // Form State Helpers
  verifyFormExists: () => Cypress.Chainable<Element>;
  verifyFieldExists: (selector: string) => Cypress.Chainable<Element>;
  verifyFieldValueByName: (name: string, value: string) => Cypress.Chainable<Element>;
  verifyFieldValue: (type: string, value: string, index?: number) => Cypress.Chainable<Element>;
  verifyFieldCount: (selector: string, count: number) => Cypress.Chainable<Element>;
  getFormData: () => Cypress.Chainable<FormFieldData>;
  
  // Complex Form Flow Helpers
  fillCompleteForm: (formData: FormFieldData) => Cypress.Chainable<Element>;
  testFieldInteraction: (fieldType: string, value: string) => Cypress.Chainable<Element>;
  testFormFlow: (steps: FormFlowStep[]) => Cypress.Chainable<Element>;
  
  // Utility Helpers (for better form testing)
  waitForFormReady: (timeout?: number) => Cypress.Chainable<JQuery<HTMLElement>>;
  waitForReactUpdate: (timeout?: number) => Cypress.Chainable<void>;
  waitForElementState: (selector: string, state: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'exist', timeout?: number) => Cypress.Chainable<JQuery<HTMLElement>>;
  waitForDropdownOpen: (timeout?: number) => Cypress.Chainable<JQuery<HTMLElement>>;
  waitForDropdownClose: (buttonSelector?: string, timeout?: number) => Cypress.Chainable<JQuery<HTMLElement>>;
  getFormDataValue: (fieldName: string) => Cypress.Chainable<string | File | null>;
  verifyFormDataValue: (fieldName: string, expectedValue: string | number, timeout?: number) => Cypress.Chainable<void>;
  waitForValidation: (shouldHaveErrors?: boolean, timeout?: number) => Cypress.Chainable<void>;
  getFormDataArray: (fieldName: string) => Cypress.Chainable<string[]>;
  verifyFormDataArray: (fieldName: string, expectedValues: string[], exactMatch?: boolean) => Cypress.Chainable<void>;
  verifyFormDataFieldExists: (fieldName: string) => Cypress.Chainable<void>;
  verifyNameAttribute: (fieldName: string, selector?: string) => Cypress.Chainable<void>;
  verifyFormDataStructure: (expectedData: Record<string, string | number | string[]>) => Cypress.Chainable<void>;
  verifyFormCleared: (fieldNames: string[]) => Cypress.Chainable<void>;
  verifyDropdownNameAttribute: (fieldName: string, labelText?: string) => Cypress.Chainable<void>;
}

// Extend Cypress namespace with our custom commands
declare global {
  namespace Cypress {
    interface Chainable extends CypressFormHelpers {}
  }
}
