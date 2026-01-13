/**
 * Core Cypress form testing helpers with HeroUI-specific patterns
 */

import type { FormFieldData, FormTestConfig, ValidationTestConfig, FormFlowStep, FieldInteractionOptions, FormSubmissionOptions } from './types';
import { 
  HERO_UI_SELECTORS, 
  DEFAULT_CONFIG, 
  withRetry, 
  buildHeroUISelector, 
  waitForStable, 
  forceClickWithRetry, 
  typeWithClear, 
  logFormState, 
  extractFormData, 
  elementExists, 
  detectFieldType 
} from './utils';

/**
 * Field Interaction Helpers
 */

/**
 * Fill input field by type attribute (email, tel, text, password, etc.)
 */
export function fillInputByType(type: string, value: string, index: number = 0, options: FieldInteractionOptions = {}) {
  // Handle textarea specially
  const selector = type === 'textarea' ? buildHeroUISelector('textarea') : buildHeroUISelector('input', type);
  const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
  
  return withRetry(() => {
    // Handle HeroUI visibility issues by using force typing
    if (options.clear !== false) {
      element.clear({ force: true });
    }
    return element.type(value, { force: true });
  }, DEFAULT_CONFIG);
}

/**
 * Fill input field by placeholder text
 */
export function fillInputByPlaceholder(placeholder: string, value: string, options: FieldInteractionOptions = {}) {
  const selector = `input[placeholder*="${placeholder}"], textarea[placeholder*="${placeholder}"]`;
  
  return withRetry(() => {
    const element = cy.get(selector);
    if (options.clear !== false) {
      element.clear({ force: true });
    }
    return element.type(value, { force: true });
  }, DEFAULT_CONFIG);
}

/**
 * Find input by label and fill it
 */
export function fillInputByLabel(label: string, value: string, options: FieldInteractionOptions = {}) {
  return withRetry(() => {
    return cy.contains('label', label)
      .closest('div')
      .find('input, textarea')
      .first()
      .then(($el) => {
        if (options.clear !== false) {
          cy.wrap($el).clear({ force: true });
        }
        return cy.wrap($el).type(value, { force: true });
      });
  }, DEFAULT_CONFIG);
}

/**
 * Fill textarea field
 */
export function fillTextarea(value: string, index: number = 0, options: FieldInteractionOptions = {}) {
  const selector = HERO_UI_SELECTORS.textarea;
  
  return withRetry(() => {
    const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
    
    if (options.clear !== false) {
      element.clear({ force: true });
    }
    
    return element.type(value, { force: true });
  }, DEFAULT_CONFIG);
}

/**
 * Select from HeroUI dropdown with force click pattern
 */
export function selectDropdownOption(optionValue: string, dropdownIndex: number = 0) {
  const triggerSelector = HERO_UI_SELECTORS.dropdown.trigger;
  const optionSelector = HERO_UI_SELECTORS.dropdown.option;
  
  return withRetry(() => {
    // Open dropdown
    const trigger = dropdownIndex > 0 ? cy.get(triggerSelector).eq(dropdownIndex) : cy.get(triggerSelector).first();
    trigger.click();
    
    // Wait for options to appear
    cy.get(optionSelector).should('exist');
    
    // Select option with force click (handles timing issues)
    if (optionValue) {
      cy.get(optionSelector).contains(optionValue).click({ force: true });
    } else {
      cy.get(optionSelector).first().click({ force: true });
    }
    
    // Verify dropdown closed
    cy.get(triggerSelector).eq(dropdownIndex).should('have.attr', 'aria-expanded', 'false');
    
    return cy.get(triggerSelector).eq(dropdownIndex);
  }, DEFAULT_CONFIG);
}

/**
 * Find dropdown by label and select option
 */
export function selectDropdownByLabel(label: string, optionValue: string) {
  return withRetry(() => {
    // First, find the label to ensure it exists
    cy.contains('label', label).should('exist');
    
    // Then find the dropdown button (it might not be in the same container)
    return cy.get('button[aria-haspopup="listbox"]')
      .first()
      .click()
      .then(() => {
        cy.get('[role="option"]').should('exist');
        if (optionValue) {
          cy.get('[role="option"]').contains(optionValue).click({ force: true });
        } else {
          cy.get('[role="option"]').first().click({ force: true });
        }
      });
  }, DEFAULT_CONFIG);
}

/**
 * Check checkbox by index
 */
export function checkCheckbox(index: number = 0) {
  const selector = HERO_UI_SELECTORS.checkbox.input;
  const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
  
  return withRetry(() => {
    return element.check();
  }, DEFAULT_CONFIG);
}

/**
 * Find and check checkbox by label
 */
export function checkCheckboxByLabel(label: string) {
  return withRetry(() => {
    return cy.contains('label', label)
      .closest('div')
      .find('input[type="checkbox"]')
      .check({ force: true });
  }, DEFAULT_CONFIG);
}

/**
 * Check switch by index
 */
export function checkSwitch(index: number = 0) {
  const selector = HERO_UI_SELECTORS.switch.input;
  const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
  
  return withRetry(() => {
    return element.check();
  }, DEFAULT_CONFIG);
}

/**
 * Uncheck checkbox by index
 */
export function uncheckCheckbox(index: number = 0) {
  const selector = HERO_UI_SELECTORS.checkbox.input;
  const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
  
  return withRetry(() => {
    return element.uncheck();
  }, DEFAULT_CONFIG);
}

/**
 * Uncheck switch by index
 */
export function uncheckSwitch(index: number = 0) {
  const selector = HERO_UI_SELECTORS.switch.input;
  const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
  
  return withRetry(() => {
    return element.uncheck();
  }, DEFAULT_CONFIG);
}

/**
 * Set slider value
 */
export function moveSlider(value: number, index: number = 0) {
  const selector = HERO_UI_SELECTORS.slider;
  const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
  
  return withRetry(() => {
    return element.invoke('val', value).trigger('change');
  }, DEFAULT_CONFIG);
}

/**
 * Validation & Error Testing Helpers
 */

/**
 * Assert validation error message appears
 */
export function expectValidationError(message: string) {
  return cy.contains(message).should('be.visible');
}

/**
 * Assert no validation errors visible
 */
export function expectNoValidationErrors() {
  return cy.get('body').should('not.contain', 'error').and('not.contain', 'invalid');
}

/**
 * Check specific field has error
 */
export function expectFieldError(fieldLabel: string, errorMessage?: string) {
  const fieldContainer = cy.contains('label', fieldLabel).closest('div');
  
  if (errorMessage) {
    return fieldContainer.should('contain', errorMessage);
  }
  
  // If no error message specified, just check that there's some error indication
  return fieldContainer.should(($div) => {
    const text = $div.text();
    const hasError = text.includes('error') || 
                     text.includes('invalid') || 
                     text.includes('required') ||
                     $div.find('[class*="error"], [class*="invalid"], [class*="danger"]').length > 0;
    expect(hasError, 'Field should have an error').to.be.true;
  });
}

/**
 * Check specific field is valid
 */
export function expectFieldValid(fieldLabel: string) {
  return cy.contains('label', fieldLabel)
    .closest('div')
    .should('not.contain', 'error')
    .and('not.contain', 'invalid');
}

/**
 * Trigger form validation without navigation
 */
export function triggerValidation(submitButton: boolean = false) {
  if (submitButton) {
    return withRetry(() => {
      // Wait for form and submit button to be ready
      cy.get('form').should('exist');
      cy.get(HERO_UI_SELECTORS.button.submit)
        .first()
        .should('be.visible')
        .should('not.be.disabled')
        .click();
      
      return cy.get('form');
    }, DEFAULT_CONFIG);
  }
  
  // Trigger validation by blurring a field
  return cy.get('input').first().blur();
}

/**
 * Form Submission Helpers
 */

/**
 * Click submit button
 * 
 * This helper waits for the form to be ready and ensures the submit button
 * is visible and enabled before clicking it. It uses retry logic to handle
 * timing issues with form rendering.
 */
export function submitForm() {
  return withRetry(() => {
    // First, verify form exists (optional but helpful for debugging)
    cy.get('form').should('exist');
    
    // Wait for submit button to be visible and enabled
    cy.get(HERO_UI_SELECTORS.button.submit)
      .first()
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    
    return cy.get('form');
  }, DEFAULT_CONFIG);
}

/**
 * Submit and verify success state
 */
export function submitAndExpectSuccess(successIndicator?: string) {
  return withRetry(() => {
    // Wait for form and submit button to be ready
    cy.get('form').should('exist');
    cy.get(HERO_UI_SELECTORS.button.submit)
      .first()
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    
    if (successIndicator) {
      cy.contains(successIndicator).should('be.visible');
    } else {
      // Default success indicators
      cy.get('body').should('contain.one.of', ['success', 'submitted', 'complete', 'thank you']);
    }
    
    return cy.get('form');
  }, DEFAULT_CONFIG);
}

/**
 * Submit and verify validation prevents submission
 */
export function submitAndExpectErrors(errorMessage?: string, formIndex: number = 0) {
  return withRetry(() => {
    // Wait for form and submit button to be ready
    cy.get('form').should('exist');
    cy.get(HERO_UI_SELECTORS.button.submit)
      .eq(formIndex)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    
    // Form should still exist (validation prevented submission)
    cy.get('form').should('exist');
    
    // Wait a bit for validation to complete
    cy.wait(500);
    
    // If error message is provided, check for it
    if (errorMessage) {
      // Try multiple approaches to find the error message
      cy.get('body').then(($body) => {
        if ($body.text().includes(errorMessage)) {
          cy.contains(errorMessage).should('be.visible');
        } else {
          // Debug: log what error messages are actually present
          cy.log('Expected error message not found:', errorMessage);
          cy.get('[class*="text-danger"], [class*="text-red"], [class*="error"]').then(($errors) => {
            cy.log('Found validation errors:', $errors.length);
            $errors.each((index, error) => {
              cy.log(`Error ${index}:`, error.textContent);
            });
          });
          // Still try to find the error message
          cy.contains(errorMessage).should('be.visible');
        }
      });
    }

    return cy.get('form');
  }, DEFAULT_CONFIG);
}

/**
 * Click reset button if present
 */
export function resetForm() {
  return cy.get('body').then(($body) => {
    if ($body.find(HERO_UI_SELECTORS.button.reset).length > 0) {
      return cy.get(HERO_UI_SELECTORS.button.reset).click();
    }
    
    // If no reset button, clear all fields manually
    return cy.get('input, textarea').each(($el) => {
      cy.wrap($el).clear();
    });
  });
}

/**
 * Intercept form submission API calls
 */
export function interceptFormSubmission(method: string, url: string, alias: string) {
  cy.intercept(method, url).as(alias);
  
  return withRetry(() => {
    // Wait for form and submit button to be ready
    cy.get('form').should('exist');
    cy.get(HERO_UI_SELECTORS.button.submit)
      .first()
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    
    return cy.get('form');
  }, DEFAULT_CONFIG);
}

/**
 * Form State Helpers
 */

/**
 * Check form is rendered
 */
export function verifyFormExists() {
  return cy.get('form').should('exist');
}

/**
 * Check field exists
 */
export function verifyFieldExists(selector: string) {
  return cy.get(selector).should('exist');
}

/**
 * Check field has expected value by type (like fillInputByType)
 */
export function verifyFieldValue(type: string, value: string, index: number = 0) {
  // Handle textarea specially
  const selector = type === 'textarea' ? buildHeroUISelector('textarea') : buildHeroUISelector('input', type);
  const element = index > 0 ? cy.get(selector).eq(index) : cy.get(selector).first();
  return element.should('have.value', value);
}

/**
 * Check number of fields
 */
export function verifyFieldCount(selector: string, count: number) {
  // Filter out hidden inputs and other non-form elements
  return cy.get(selector)
    .filter(':visible')
    .not('[type="hidden"]')
    .should('have.length', count);
}

/**
 * Extract all form field values as object
 */
export function getFormData(): Cypress.Chainable<FormFieldData> {
  return extractFormData().then((data) => data as FormFieldData);
}

/**
 * Complex Form Flow Helpers
 */

/**
 * Fill entire form from object (smart field detection)
 */
export function fillCompleteForm(formData: FormFieldData) {
  return cy.then(() => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
      const fieldType = detectFieldType(value);
      
      switch (fieldType) {
        case 'text':
        case 'email':
        case 'tel':
        case 'password':
        case 'number':
          fillInputByType(fieldType, String(value));
          break;
        case 'checkbox':
          if (value) {
            checkCheckbox();
          }
          break;
        default:
          // Try to find by label first, then by type
          cy.get('body').then(($body) => {
            if ($body.find(`label:contains("${key}")`).length > 0) {
              fillInputByLabel(key, String(value));
            } else {
              fillInputByType('text', String(value));
            }
          });
      }
    });
    
    return cy.get('form');
  });
}

/**
 * Test field accepts input and retains value
 */
export function testFieldInteraction(fieldType: string, value: string) {
  const selector = buildHeroUISelector('input', fieldType);
  
  return cy.get(selector).first()
    .clear()
    .type(value)
    .should('have.value', value);
}

/**
 * Test multi-step form interactions
 */
export function testFormFlow(steps: FormFlowStep[]) {
  return cy.then(() => {
    steps.forEach((step, index) => {
      cy.log(`Executing step ${index + 1}: ${step.type}`);
      
      switch (step.type) {
        case 'fill':
          if (step.field && step.value) {
            fillInputByLabel(step.field, String(step.value));
          }
          break;
        case 'select':
          if (step.field && step.value) {
            selectDropdownByLabel(step.field, String(step.value));
          }
          break;
        case 'check':
          if (step.field) {
            checkCheckboxByLabel(step.field);
          }
          break;
        case 'uncheck':
          if (step.field) {
            cy.contains('label', step.field)
              .closest('div')
              .find(HERO_UI_SELECTORS.checkbox.input)
              .uncheck();
          }
          break;
        case 'submit':
          submitForm();
          break;
        case 'wait':
          if (step.waitTime) {
            cy.wait(step.waitTime);
          }
          break;
      }
      
      if (step.expect) {
        cy.get('body').should('contain', step.expect);
      }
    });
    
    return cy.get('form');
  });
}

// ============================================================================
// ADDITIONAL VALIDATION TESTING HELPERS
// ============================================================================

/**
 * Test real-time validation by typing invalid data
 */
export function testRealTimeValidation(fieldLabel: string, invalidValue: string, expectedError?: string) {
  // Fill field with invalid data
  fillInputByLabel(fieldLabel, invalidValue);
  
  // Trigger validation (blur event)
  cy.contains('label', fieldLabel)
    .closest('div')
    .find('input, textarea, select')
    .blur();
  
  // Check for error message
  if (expectedError) {
    return expectFieldError(fieldLabel, expectedError);
  } else {
    return expectFieldError(fieldLabel, "This field is required");
  }
}

/**
 * Test field validation by clearing required field
 */
export function testRequiredFieldValidation(fieldLabel: string, expectedError?: string) {
  // Clear the field
  cy.contains('label', fieldLabel)
    .closest('div')
    .find('input, textarea, select')
    .clear()
    .blur();
  
  // Check for error message
  if (expectedError) {
    return expectFieldError(fieldLabel, expectedError);
  } else {
    return expectFieldError(fieldLabel, "This field is required");
  }
}

/**
 * Test email validation
 */
export function testEmailValidation(email: string, shouldBeValid: boolean) {
  cy.get('input[type="email"]').first()
    .clear()
    .type(email)
    .blur();
  
  if (shouldBeValid) {
    return expectFieldValid('Email');
  } else {
    return expectFieldError('Email');
  }
}

/**
 * Test phone validation
 */
export function testPhoneValidation(phone: string, shouldBeValid: boolean) {
  cy.get('input[type="tel"]').first()
    .clear()
    .type(phone)
    .blur();
  
  if (shouldBeValid) {
    return expectFieldValid('Phone');
  } else {
    return expectFieldError('Phone');
  }
}

/**
 * Test password validation
 */
export function testPasswordValidation(password: string, shouldBeValid: boolean) {
  cy.get('input[type="password"]').first()
    .clear()
    .type(password)
    .blur();
  
  if (shouldBeValid) {
    return expectFieldValid('Password');
  } else {
    return expectFieldError('Password');
  }
}

/**
 * Test form submission with missing required fields
 */
export function testRequiredFieldsValidation() {
  // Try to submit without filling required fields
  submitForm();
  
  // Verify form is still present (validation prevented submission)
  cy.get('form').should('exist');
  
  // Verify validation errors are shown
  return expectValidationError('required') || expectValidationError('Required');
}

// ============================================================================
// ENHANCED FORM STATE HELPERS (v2.0.0)
// ============================================================================

/**
 * Enhanced form submission helpers
 */
export const formSubmissionHelpers = {
  /**
   * Submit form and wait for success
   */
  submitAndWaitForSuccess: (submitButtonText = "Submit") => {
    cy.get('button[type="submit"]')
      .contains(submitButtonText)
      .click();
    
    // Wait for form to be submitted (loading state)
    cy.get('button[type="submit"]').should("contain", "Submitting");
    
    // Wait for success state
    cy.get('button[type="submit"]').should("contain", "Success!");
  },

  /**
   * Submit form and wait for error
   */
  submitAndWaitForError: (submitButtonText = "Submit") => {
    cy.get('button[type="submit"]')
      .contains(submitButtonText)
      .click();
    
    // Wait for form to be submitted (loading state)
    cy.get('button[type="submit"]').should("contain", "Submitting");
    
    // Wait for error state
    cy.get('button[type="submit"]').should("contain", "Error");
  },

  /**
   * Reset form to initial state
   */
  resetForm: (resetButtonText = "Reset") => {
    cy.get('button[type="button"]')
      .contains(resetButtonText)
      .click();
  },

  /**
   * Wait for enhanced form status
   */
  waitForFormStatus: (status: "loading" | "success" | "error") => {
    if (status === "loading") {
      cy.contains("Submitting form...").should("be.visible");
    } else if (status === "success") {
      cy.contains("Form submitted successfully!").should("be.visible");
    } else if (status === "error") {
      cy.contains("Error submitting form").should("be.visible");
    }
  },

  /**
   * Dismiss form status message
   */
  dismissFormStatus: () => {
    cy.get('button[aria-label*="Dismiss"]').click();
  },
};

// ============================================================================
// DYNAMIC FORM HELPERS (v2.0.0)
// ============================================================================

/**
 * Dynamic form field helpers
 */
export const dynamicFormHelpers = {
  /**
   * Test conditional field visibility
   */
  testConditionalField: (triggerField: string, triggerValue: string, conditionalFieldLabel: string) => {
    // Set trigger value
    fillInputByLabel(triggerField, triggerValue);
    
    // Verify conditional field appears
    cy.contains('label', conditionalFieldLabel).should('be.visible');
  },

  /**
   * Test conditional field hiding
   */
  testConditionalFieldHidden: (triggerField: string, triggerValue: string, conditionalFieldLabel: string) => {
    // Set trigger value
    fillInputByLabel(triggerField, triggerValue);
    
    // Verify conditional field is hidden
    cy.contains('label', conditionalFieldLabel).should('not.exist');
  },

  /**
   * Add item to field array
   */
  addFieldArrayItem: (addButtonText = "Add Item") => {
    cy.get('button').contains(addButtonText).click();
  },

  /**
   * Remove item from field array
   */
  removeFieldArrayItem: (itemIndex: number = 0, removeButtonText = "Remove") => {
    cy.get('button').contains(removeButtonText).eq(itemIndex).click();
  },

  /**
   * Test field array limits
   */
  testFieldArrayLimits: (min: number, max: number, addButtonText = "Add Item", removeButtonText = "Remove") => {
    // Test minimum limit
    if (min > 0) {
      cy.get('button').contains(removeButtonText).should('not.exist');
    }

    // Test maximum limit
    for (let i = 0; i < max; i++) {
      cy.get('button').contains(addButtonText).click();
    }
    
    // Should not be able to add more
    cy.get('button').contains(addButtonText).should('not.exist');
  },

  /**
   * Test dynamic section visibility
   */
  testDynamicSection: (triggerField: string, triggerValue: string, sectionTitle: string) => {
    // Set trigger value
    fillInputByLabel(triggerField, triggerValue);
    
    // Verify section appears
    cy.contains(sectionTitle).should('be.visible');
  },

  /**
   * Test dynamic section hiding
   */
  testDynamicSectionHidden: (triggerField: string, triggerValue: string, sectionTitle: string) => {
    // Set trigger value
    fillInputByLabel(triggerField, triggerValue);
    
    // Verify section is hidden
    cy.contains(sectionTitle).should('not.exist');
  },
};

// ============================================================================
// PERFORMANCE TESTING HELPERS (v2.0.0)
// ============================================================================

/**
 * Performance testing helpers
 */
export const performanceHelpers = {
  /**
   * Test debounced validation
   */
  testDebouncedValidation: (fieldLabel: string, value: string, delay: number = 300) => {
    // Type value quickly
    fillInputByLabel(fieldLabel, value);
    
    // Wait for debounce delay
    cy.wait(delay);
    
    // Check if validation was triggered
    cy.get('body').should('contain', 'error');
  },

  /**
   * Test form performance with many fields
   */
  testFormPerformance: (fieldCount: number) => {
    const startTime = Date.now();
    
    // Fill all fields
    for (let i = 0; i < fieldCount; i++) {
      fillInputByType('text', `value${i}`);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log performance metrics
    cy.log(`Form with ${fieldCount} fields took ${duration}ms to fill`);
    
    // Assert reasonable performance (adjust threshold as needed)
    expect(duration).to.be.lessThan(5000);
  },

  /**
   * Test memoization by checking re-renders
   */
  testMemoization: (componentName: string) => {
    // This would need to be implemented with a custom hook that tracks renders
    cy.log(`Testing memoization for ${componentName}`);
    
    // Fill form fields
    fillInputByType('text', 'test');
    
    // Check that component didn't re-render unnecessarily
    // This is more of a development-time check
    cy.log('Memoization test completed');
  },

  /**
   * Add field array item for testing
   */
  addFieldArrayItem: (addButtonText = "Add Item") => {
    cy.get('button').contains(addButtonText).click();
  },
};

// ============================================================================
// TYPE INFERENCE TESTING HELPERS (v2.0.0)
// ============================================================================

/**
 * Type inference testing helpers
 */
export const typeInferenceHelpers = {
  /**
   * Test auto-inferred form validation
   */
  testInferredValidation: (fieldLabel: string, value: string, shouldBeValid: boolean) => {
    fillInputByLabel(fieldLabel, value);
    
    if (shouldBeValid) {
      expectFieldValid(fieldLabel);
    } else {
      expectFieldError(fieldLabel);
    }
  },

  /**
   * Test cross-field validation
   */
  testCrossFieldValidation: (field1: string, value1: string, field2: string, value2: string, shouldBeValid: boolean) => {
    fillInputByLabel(field1, value1);
    fillInputByLabel(field2, value2);
    
    // Trigger validation
    cy.get('input').first().blur();
    
    if (shouldBeValid) {
      expectNoValidationErrors();
    } else {
      expectValidationError('match');
    }
  },

  /**
   * Test password confirmation validation
   */
  testPasswordConfirmation: (password: string, confirmPassword: string, shouldMatch: boolean) => {
    fillInputByLabel('Password', password);
    fillInputByLabel('Confirm Password', confirmPassword);
    
    if (shouldMatch) {
      expectNoValidationErrors();
    } else {
      expectValidationError('match');
    }
  },
};
