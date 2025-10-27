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

  let attempts = 0;
  const maxAttempts = config.maxRetries + 1;

  const retryOperation = (): Cypress.Chainable<T> => {
    attempts++;
    
    return operation().then(
      (result: any) => {
        return result;
      },
      (error: any) => {
        if (attempts < maxAttempts) {
          cy.log(`Retry attempt ${attempts}/${maxAttempts} for operation`);
          cy.wait(config.retryDelay);
          return retryOperation();
        }
        throw error;
      }
    );
  };

  return retryOperation();
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
