/**
 * Internal utilities for Cypress form testing helpers
 */

import type { FormTestConfig, HeroUISelectors, FieldInteractionOptions } from './types';

/**
 * Default HeroUI selectors based on the testing guide patterns
 */
export const HERO_UI_SELECTORS: HeroUISelectors = {
  inputs: {
    text: 'input[type="text"]',
    email: 'input[type="email"]',
    tel: 'input[type="tel"]',
    password: 'input[type="password"]',
    number: 'input[type="number"]',
    url: 'input[type="url"]',
    search: 'input[type="search"]',
  },
  textarea: 'textarea',
  dropdown: {
    trigger: 'button[aria-haspopup="listbox"]',
    option: '[role="option"]',
  },
  checkbox: {
    input: 'input[type="checkbox"]',
    role: '[role="checkbox"]',
  },
  switch: {
    input: 'input[role="switch"]',
    role: '[role="switch"]',
  },
  radio: {
    input: 'input[type="radio"]',
    group: '[role="radiogroup"]',
  },
  slider: 'input[type="range"]',
  button: {
    submit: 'button[type="submit"]',
    reset: 'button[type="reset"]',
    generic: 'button',
  },
};

/**
 * Default configuration for form testing
 */
export const DEFAULT_CONFIG: Required<FormTestConfig> = {
  strict: false,
  timeout: 4000,
  retry: true,
  maxRetries: 3,
  retryDelay: 100,
};

/**
 * Retry logic for flaky interactions
 */
export function withRetry<T>(
  operation: () => Cypress.Chainable<T>,
  config: Required<FormTestConfig> = DEFAULT_CONFIG
): Cypress.Chainable<T> {
  if (!config.retry) {
    return operation();
  }

  // Cypress already has built-in retry logic, so we just execute the operation
  // The retry configuration is mainly for documentation/logging purposes
  return operation();
}

/**
 * Smart field detection algorithm
 */
export function findFieldByLabel(label: string): string {
  return `label:contains("${label}")`;
}

export function findFieldByPlaceholder(placeholder: string): string {
  return `input[placeholder*="${placeholder}"], textarea[placeholder*="${placeholder}"]`;
}

export function findFieldByType(type: string): string {
  return HERO_UI_SELECTORS.inputs[type as keyof typeof HERO_UI_SELECTORS.inputs] || `input[type="${type}"]`;
}

/**
 * Build HeroUI-specific selectors
 */
export function buildHeroUISelector(
  type: 'input' | 'textarea' | 'dropdown' | 'checkbox' | 'switch' | 'radio' | 'slider' | 'button',
  subtype?: string
): string {
  switch (type) {
    case 'input':
      return subtype ? HERO_UI_SELECTORS.inputs[subtype as keyof typeof HERO_UI_SELECTORS.inputs] : 'input';
    case 'textarea':
      return HERO_UI_SELECTORS.textarea;
    case 'dropdown':
      return subtype === 'trigger' ? HERO_UI_SELECTORS.dropdown.trigger : HERO_UI_SELECTORS.dropdown.option;
    case 'checkbox':
      return subtype === 'role' ? HERO_UI_SELECTORS.checkbox.role : HERO_UI_SELECTORS.checkbox.input;
    case 'switch':
      return subtype === 'role' ? HERO_UI_SELECTORS.switch.role : HERO_UI_SELECTORS.switch.input;
    case 'radio':
      return subtype === 'group' ? HERO_UI_SELECTORS.radio.group : HERO_UI_SELECTORS.radio.input;
    case 'slider':
      return HERO_UI_SELECTORS.slider;
    case 'button':
      return subtype ? HERO_UI_SELECTORS.button[subtype as keyof typeof HERO_UI_SELECTORS.button] : HERO_UI_SELECTORS.button.generic;
    default:
      return 'input';
  }
}

/**
 * Wait for element to be stable (useful for HeroUI components)
 */
export function waitForStable(selector: string, timeout: number = 1000) {
  return cy.get(selector, { timeout }).should('be.visible');
}

/**
 * Force click with retry (for HeroUI dropdowns)
 */
export function forceClickWithRetry(selector: string, config: Required<FormTestConfig> = DEFAULT_CONFIG) {
  return withRetry(() => {
    return cy.get(selector).click({ force: true });
  }, config);
}

/**
 * Type with clear and retry
 */
export function typeWithClear(selector: string, value: string, options: FieldInteractionOptions = {}) {
  const element = cy.get(selector);
  
  if (options.clear !== false) {
    element.clear({ force: true });
  }
  
  return element.type(value, { force: true });
}

/**
 * Debug utilities
 */
export function logFormState(): void {
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
}

/**
 * Extract form data as object
 */
export function extractFormData(): Cypress.Chainable<Record<string, unknown>> {
  return cy.get('form').then(($form) => {
    const formData: Record<string, unknown> = {};
    
    $form.find('input, textarea, select').each((index, element) => {
      const $el = Cypress.$(element);
      const name = $el.attr('name') || `field_${index}`;
      const value = $el.val();
      
      if (value !== undefined && value !== '') {
        formData[name] = value;
      }
    });
    
    return formData;
  });
}

/**
 * Check if element exists without failing
 */
export function elementExists(selector: string): Cypress.Chainable<boolean> {
  return cy.get('body').then(($body) => {
    return $body.find(selector).length > 0;
  });
}

/**
 * Smart field detection for form data
 */
export function detectFieldType(value: unknown): 'text' | 'email' | 'tel' | 'password' | 'number' | 'checkbox' | 'select' {
  if (typeof value === 'boolean') return 'checkbox';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    if (value.includes('@')) return 'email';
    if (/^\d{3}-\d{3}-\d{4}$/.test(value)) return 'tel';
    if (value.toLowerCase().includes('password')) return 'password';
  }
  return 'text';
}

/**
 * Wait for form to be ready (all fields rendered and interactive)
 * This is useful before interacting with form fields
 */
export function waitForFormReady(timeout: number = 5000): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get('form', { timeout }).should('exist').then(($form) => {
    // Wait for at least one input to be visible/interactive
    cy.get('form input, form textarea, form button', { timeout: 2000 })
      .first()
      .should('exist');
    return cy.wrap($form);
  });
}

/**
 * Wait for React to finish rendering by checking for stable DOM
 * This replaces fixed cy.wait() calls with state-based waiting
 */
export function waitForReactUpdate(timeout: number = 2000): Cypress.Chainable<void> {
  // Wait for any pending React updates by checking if form is stable
  return cy.get('form', { timeout }).should('exist').then(() => {
    // Small wait for React to finish any batched updates
    // In the future, this could check for specific React state indicators
    return cy.wait(100);
  });
}

/**
 * Wait for element to be in a specific state (visible, hidden, enabled, etc.)
 * More reliable than fixed waits
 */
export function waitForElementState(
  selector: string,
  state: 'visible' | 'hidden' | 'enabled' | 'disabled' | 'exist',
  timeout: number = 4000
): Cypress.Chainable<JQuery<HTMLElement>> {
  const element = cy.get(selector, { timeout });
  
  switch (state) {
    case 'visible':
      return element.should('be.visible');
    case 'hidden':
      return element.should('be.hidden');
    case 'enabled':
      return element.should('not.be.disabled');
    case 'disabled':
      return element.should('be.disabled');
    case 'exist':
      return element.should('exist');
    default:
      return element;
  }
}

/**
 * Wait for dropdown to open by checking for dialog/options
 * More reliable than fixed waits
 */
export function waitForDropdownOpen(timeout: number = 5000): Cypress.Chainable<JQuery<HTMLElement>> {
  // Wait for dialog to appear
  cy.get('[role="dialog"]', { timeout }).should('exist');
  // Wait for options to be available
  cy.get('[role="option"]', { timeout }).should('exist');
  return cy.get('[role="dialog"]');
}

/**
 * Wait for dropdown to close by checking aria-expanded
 */
export function waitForDropdownClose(
  buttonSelector: string = 'button[aria-haspopup="listbox"]',
  timeout: number = 3000
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get(buttonSelector, { timeout })
    .first()
    .should('have.attr', 'aria-expanded', 'false');
}

/**
 * Get FormData value by field name
 * Useful for verifying form values, especially for components that don't update input values directly
 */
export function getFormDataValue(fieldName: string): Cypress.Chainable<string | File | null> {
  return cy.get('form').then(($form) => {
    // Type guard: ensure element is HTMLFormElement
    const formElement = $form[0];
    if (!(formElement instanceof HTMLFormElement)) {
      throw new Error('Expected HTMLFormElement');
    }
    const formData = new FormData(formElement);
    return formData.get(fieldName);
  });
}

/**
 * Verify FormData contains expected value
 * More reliable than checking input values for controlled components
 */
export function verifyFormDataValue(
  fieldName: string,
  expectedValue: string | number,
  timeout: number = 3000
): Cypress.Chainable<void> {
  return getFormDataValue(fieldName).should('equal', String(expectedValue));
}

/**
 * Find button near a label (for dropdowns and other components)
 * Tries multiple strategies to find the button
 */
export function findButtonNearLabel(
  labelText: string,
  buttonSelector: string = 'button[aria-haspopup="listbox"]'
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.contains('label', labelText).then(($label) => {
    const $container = $label.closest('div');
    let $button = $container.find(buttonSelector);
    
    if ($button.length > 0) {
      return cy.wrap($button.first());
    }
    
    // Try parent container
    const $parent = $container.parent();
    $button = $parent.find(buttonSelector);
    
    if ($button.length > 0) {
      return cy.wrap($button.first());
    }
    
    // Fallback to first matching button
    return cy.get(buttonSelector).first();
  });
}

/**
 * Wait for validation errors to appear or disappear
 */
export function waitForValidation(
  shouldHaveErrors: boolean = true,
  timeout: number = 3000
): Cypress.Chainable<void> {
  if (shouldHaveErrors) {
    // Wait for error indicators to appear
    return cy.get('body', { timeout }).then(($body) => {
      const hasErrors = $body.find('[class*="error"], [class*="danger"], [class*="invalid"]').length > 0;
      if (!hasErrors) {
        // Wait a bit more for React to render errors
        cy.wait(500);
      }
    });
  } else {
    // Wait for errors to disappear
    return cy.get('[class*="error"], [class*="danger"], [class*="invalid"]', { timeout })
      .should('not.exist');
  }
}

/**
 * Get FormData array values by field name (for checkbox groups, etc.)
 */
export function getFormDataArray(fieldName: string): Cypress.Chainable<string[]> {
  return cy.get('form').then(($form) => {
    // Type guard: ensure element is HTMLFormElement
    const formElement = $form[0];
    if (!(formElement instanceof HTMLFormElement)) {
      throw new Error('Expected HTMLFormElement');
    }
    const formData = new FormData(formElement);
    return Array.from(formData.getAll(fieldName)) as string[];
  });
}

/**
 * Verify FormData contains array with expected values
 */
export function verifyFormDataArray(
  fieldName: string,
  expectedValues: string[],
  exactMatch: boolean = false
): Cypress.Chainable<void> {
  return getFormDataArray(fieldName).then((values) => {
    if (exactMatch) {
      expect(values).to.deep.equal(expectedValues);
    } else {
      // Verify all expected values are present
      expectedValues.forEach((expected) => {
        expect(values).to.include(expected);
      });
      // Verify minimum count
      expect(values.length).to.be.at.least(expectedValues.length);
    }
  });
}

/**
 * Verify FormData field exists (name attribute is set)
 * Useful for components where name may not be on DOM element directly
 */
export function verifyFormDataFieldExists(fieldName: string): Cypress.Chainable<void> {
  return cy.get('form').then(($form) => {
    // Type guard: ensure element is HTMLFormElement
    const formElement = $form[0];
    if (!(formElement instanceof HTMLFormElement)) {
      throw new Error('Expected HTMLFormElement');
    }
    const formData = new FormData(formElement);
    expect(formData.has(fieldName)).to.be.true;
  });
}

/**
 * Verify name attribute exists on element (either on element or via FormData)
 */
export function verifyNameAttribute(
  fieldName: string,
  selector?: string
): Cypress.Chainable<void> {
  if (selector) {
    // Try to verify name attribute on element directly
    return cy.get(selector).then(($el) => {
      const hasName = $el.attr('name') === fieldName;
      if (hasName) {
        cy.wrap($el).should('have.attr', 'name', fieldName);
      } else {
        // Fallback: verify via FormData (name may be on component wrapper)
        return verifyFormDataFieldExists(fieldName);
      }
    });
  } else {
    // Just verify via FormData
    return verifyFormDataFieldExists(fieldName);
  }
}

/**
 * Verify complete form data structure matches expected values
 */
export function verifyFormDataStructure(
  expectedData: Record<string, string | number | string[]>
): Cypress.Chainable<void> {
  return cy.get('form').then(($form) => {
    // Type guard: ensure element is HTMLFormElement
    const formElement = $form[0];
    if (!(formElement instanceof HTMLFormElement)) {
      throw new Error('Expected HTMLFormElement');
    }
    const formData = new FormData(formElement);

    Object.entries(expectedData).forEach(([fieldName, expectedValue]) => {
      if (Array.isArray(expectedValue)) {
        // Array field (checkbox groups)
        const actualValues = Array.from(formData.getAll(fieldName)) as string[];
        expectedValue.forEach((val) => {
          expect(actualValues).to.include(val);
        });
        expect(actualValues.length).to.be.at.least(expectedValue.length);
      } else {
        // Single value field
        const actualValue = formData.get(fieldName);
        if (typeof expectedValue === 'string' && expectedValue.includes('*')) {
          // Support partial matching with wildcard
          const pattern = expectedValue.replace(/\*/g, '.*');
          expect(String(actualValue)).to.match(new RegExp(pattern));
        } else {
          expect(String(actualValue)).to.equal(String(expectedValue));
        }
      }
    });
  });
}

/**
 * Verify form is cleared (all specified fields are empty)
 */
export function verifyFormCleared(fieldNames: string[]): Cypress.Chainable<void> {
  return cy.get('form').then(($form) => {
    // Type guard: ensure element is HTMLFormElement
    const formElement = $form[0];
    if (!(formElement instanceof HTMLFormElement)) {
      throw new Error('Expected HTMLFormElement');
    }
    const formData = new FormData(formElement);

    fieldNames.forEach((fieldName) => {
      const value = formData.get(fieldName);
      // Value should be empty string, null, or undefined
      expect(value === '' || value === null || value === undefined).to.be.true;
    });
  });
}

/**
 * Verify dropdown name attribute (checks button or FormData)
 */
export function verifyDropdownNameAttribute(
  fieldName: string,
  labelText?: string
): Cypress.Chainable<void> {
  if (labelText) {
    // Try to find button near label and check name attribute
    return findButtonNearLabel(labelText).then(($button) => {
      const hasName = $button.attr('name') === fieldName;
      if (hasName) {
        cy.wrap($button).should('have.attr', 'name', fieldName);
      } else {
        // Fallback: verify via FormData
        return verifyFormDataFieldExists(fieldName);
      }
    });
  } else {
    // Just verify via FormData
    return verifyFormDataFieldExists(fieldName);
  }
}
