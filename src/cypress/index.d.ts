/**
 * TypeScript declarations for Cypress form testing helpers
 */

import type { FormFieldData, FormFlowStep, FieldInteractionOptions, FormSubmissionOptions } from './types';

declare global {
  namespace Cypress {
    interface Chainable {
      // Field Interaction Helpers
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
      submitAndExpectErrors(): Chainable<Element>;
      resetForm(): Chainable<Element>;
      interceptFormSubmission(method: string, url: string, alias: string): Chainable<Element>;
      
      // Form State Helpers
      verifyFormExists(): Chainable<Element>;
      verifyFieldExists(selector: string): Chainable<Element>;
      verifyFieldValue(selector: string, value: string): Chainable<Element>;
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
      waitForFormReady(): Chainable<Element>;
      clearForm(): Chainable<Element>;
      verifyFormValid(): Chainable<Element>;
      screenshotForm(name?: string): Chainable<Element>;
    }
  }
}
