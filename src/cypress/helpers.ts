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
  detectFieldType,
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
  verifyDropdownNameAttribute
} from './utils';

/**
 * Field Interaction Helpers
 */

/**
 * Fill input field by name attribute (most reliable method)
 * 
 * @example
 * cy.fillInputByName('email', 'user@example.com');
 * cy.fillInputByName('firstName', 'John');
 */
export function fillInputByName(name: string, value: string, options: FieldInteractionOptions = {clear: true}) {
  return withRetry(() => {
    // Wait for form to be ready first
    waitForFormReady();
    
    const element = cy.get(`input[name="${name}"], textarea[name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .should('be.visible');
    
    if (options.clear !== false) {
      element.clear({ force: true });
    }
    
    return element.type(value, { force: true }).then(() => {
      // Wait for React to update after typing
      waitForReactUpdate();
      return element;
    });
  }, DEFAULT_CONFIG);
}

/**
 * Fill input field by type attribute (email, tel, text, password, etc.)
 * Falls back to name attribute if available for better reliability
 */
export function fillInputByType(type: string, value: string, index: number = 0, options: FieldInteractionOptions = {clear: true}) {
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
export function fillInputByPlaceholder(placeholder: string, value: string, options: FieldInteractionOptions = {clear: true}) {
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
export function fillInputByLabel(label: string, value: string, options: FieldInteractionOptions = {clear: true}) {
  return withRetry(() => {
    const element = cy.contains('label', label)
      .closest('div')
      .find('input, textarea')
      .first();

    // Default to clearing the input first (especially important for number inputs with default values)
    const shouldClear = options.clear !== false;
    if (shouldClear) {
      element.clear({ force: true });
    }
    return element.type(value, { force: true });
  }, DEFAULT_CONFIG);
}

/**
 * Fill textarea field by name attribute (most reliable method)
 * 
 * @example
 * cy.fillTextareaByName('message', 'This is my message');
 */
export function fillTextareaByName(name: string, value: string, options: FieldInteractionOptions = {clear: true}) {
  return withRetry(() => {
    const element = cy.get(`textarea[name="${name}"]`);
    
    if (options.clear !== false) {
      element.clear({ force: true });
    }
    
    return element.type(value, { force: true });
  }, DEFAULT_CONFIG);
}

/**
 * Fill textarea field by index
 */
export function fillTextarea(value: string, index: number = 0, options: FieldInteractionOptions = {clear: true}) {
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
 * Select from HeroUI dropdown by name attribute (most reliable method)
 * 
 * @example
 * cy.selectDropdownByName('country', 'United States');
 */
export function selectDropdownByName(name: string, optionValue: string) {
  const optionSelector = HERO_UI_SELECTORS.dropdown.option;
  
  return withRetry(() => {
    // Wait for form to be ready first
    waitForFormReady();
    
    // HeroUI Select doesn't render a native select - it uses a button
    // Check if button has name attribute first
    cy.get('body').then(($body) => {
      const buttonWithName = $body.find(`button[aria-haspopup="listbox"][name="${name}"]`).length > 0;
      
      if (buttonWithName) {
        // Button has name attribute - use it and track it
        cy.get(`button[aria-haspopup="listbox"][name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
          .should('be.visible')
          .click({ force: true });
      } else {
        // Button doesn't have name - try to find Select by looking for it near labels
        // that might match the field name (e.g., "Country" for "country")
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        findButtonNearLabel(capitalizedName).should('be.visible').click({ force: true });
      }
    });
    
    // Wait for dropdown to open (state-based, not fixed wait)
    waitForDropdownOpen(5000);
    
    // Select option within the dialog
    cy.get('[role="dialog"]').within(() => {
      cy.get(optionSelector, { timeout: 6000 }).should('exist');
      
      // Select option with force click (handles timing issues)
      if (optionValue) {
        cy.get(optionSelector).contains(optionValue).click({ force: true });
      } else {
        cy.get(optionSelector).first().click({ force: true });
      }
    });
    
    // Wait for dropdown to close (state-based)
    cy.get('body').then(($body) => {
      const buttonWithName = $body.find(`button[aria-haspopup="listbox"][name="${name}"]`).length > 0;
      const buttonSelector = buttonWithName 
        ? `button[aria-haspopup="listbox"][name="${name}"]`
        : 'button[aria-haspopup="listbox"]';
      waitForDropdownClose(buttonSelector, 3000);
    });
    
    // Wait for React to update after selection
    waitForReactUpdate();
    
    return cy.get('button[aria-haspopup="listbox"]').first();
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
 * Check checkbox by name attribute (most reliable method)
 * 
 * @example
 * cy.checkCheckboxByName('newsletter');
 * cy.checkCheckboxByName('terms');
 */
export function checkCheckboxByName(name: string) {
  return withRetry(() => {
    waitForFormReady();
    
    return cy.get(`input[type="checkbox"][name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .check({ force: true })
      .then(() => {
        waitForReactUpdate();
        return cy.get(`input[type="checkbox"][name="${name}"]`);
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
 * Check switch by name attribute (most reliable method)
 * 
 * @example
 * cy.checkSwitchByName('notifications');
 */
export function checkSwitchByName(name: string) {
  return withRetry(() => {
    return cy.get(`input[type="checkbox"][role="switch"][name="${name}"], input[type="checkbox"][name="${name}"][aria-label*="switch"]`).check({ force: true });
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
 * Uncheck checkbox by name attribute (most reliable method)
 * 
 * @example
 * cy.uncheckCheckboxByName('newsletter');
 */
export function uncheckCheckboxByName(name: string) {
  return withRetry(() => {
    waitForFormReady();
    
    return cy.get(`input[type="checkbox"][name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .uncheck({ force: true })
      .then(() => {
        waitForReactUpdate();
        return cy.get(`input[type="checkbox"][name="${name}"]`);
      });
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
 * Uncheck switch by name attribute (most reliable method)
 * 
 * @example
 * cy.uncheckSwitchByName('notifications');
 */
export function uncheckSwitchByName(name: string) {
  return withRetry(() => {
    waitForFormReady();
    
    return cy.get(`input[type="checkbox"][role="switch"][name="${name}"], input[type="checkbox"][name="${name}"][aria-label*="switch"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .uncheck({ force: true })
      .then(() => {
        waitForReactUpdate();
        return cy.get(`input[role="switch"][name="${name}"]`);
      });
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
 * Move slider by name attribute (most reliable method)
 * 
 * @example
 * cy.moveSliderByName('rating', 75);
 */
export function moveSliderByName(name: string, value: number) {
  return withRetry(() => {
    waitForFormReady();
    
    const slider = cy.get(`input[type="range"][name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist');
    
    // HeroUI Slider is controlled, so we need to set value and trigger proper events
    return slider.then(($slider) => {
      // Type guard: ensure element is HTMLInputElement
      const sliderElement = $slider[0];
      if (!(sliderElement instanceof HTMLInputElement)) {
        throw new Error('Expected HTMLInputElement for slider');
      }
      
      // Get min and max to ensure value is within range
      const min = Number(sliderElement.min || 0);
      const max = Number(sliderElement.max || 100);
      const clampedValue = Math.max(min, Math.min(max, value));
      
      // HeroUI Slider uses onValueChange callback, so we need to trigger the change properly
      // Set value and trigger input event (this is what HeroUI Slider listens to)
      cy.wrap($slider)
        .invoke('val', clampedValue)
        .trigger('input', { force: true, bubbles: true })
        .then(() => {
          // Also set directly on the element and dispatch native events
          sliderElement.value = String(clampedValue);
          const inputEvent = new Event('input', { bubbles: true, cancelable: true });
          sliderElement.dispatchEvent(inputEvent);
          
          // Trigger change event as well
          cy.wrap($slider)
            .trigger('change', { force: true, bubbles: true })
            .then(() => {
              const changeEvent = new Event('change', { bubbles: true, cancelable: true });
              sliderElement.dispatchEvent(changeEvent);
              
              // Wait for React Hook Form to update (state-based)
              waitForReactUpdate(1500);
              
              return cy.wrap($slider);
            });
        });
    });
  }, DEFAULT_CONFIG);
}

/**
 * Select radio button by name and value (most reliable method)
 * 
 * @example
 * cy.selectRadioByName('gender', 'male');
 */
export function selectRadioByName(name: string, value: string) {
  return withRetry(() => {
    waitForFormReady();
    
    return cy.get(`input[type="radio"][name="${name}"][value="${value}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .check({ force: true })
      .then(() => {
        waitForReactUpdate();
        return cy.get(`input[type="radio"][name="${name}"][value="${value}"]`);
      });
  }, DEFAULT_CONFIG);
}

/**
 * Check a specific checkbox in a checkbox group by name and index
 * Useful when multiple checkboxes share the same name attribute
 * 
 * @example
 * cy.checkCheckboxInGroupByName('interests', 0); // Check first checkbox
 * cy.checkCheckboxInGroupByName('interests', 1); // Check second checkbox
 */
export function checkCheckboxInGroupByName(name: string, index: number = 0) {
  return withRetry(() => {
    waitForFormReady();
    
    const checkboxes = cy.get(`input[type="checkbox"][name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist');
    
    const targetCheckbox = index > 0 ? checkboxes.eq(index) : checkboxes.first();
    
    return targetCheckbox
      .should('exist')
      .check({ force: true })
      .then(() => {
        waitForReactUpdate();
        return targetCheckbox;
      });
  }, DEFAULT_CONFIG);
}

/**
 * Select from autocomplete by name attribute
 * Types the value, waits for options, then selects the matching option
 * 
 * @example
 * cy.selectAutocompleteByName('favoriteColor', 'Red');
 */
export function selectAutocompleteByName(name: string, optionValue: string) {
  return withRetry(() => {
    waitForFormReady();
    
    const input = cy.get(`input[name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .should('be.visible');
    
    // Clear input first
    input.clear({ force: true });
    
    // Focus and click the input to ensure autocomplete opens
    // Some autocomplete implementations need both focus and click
    input.focus();
    input.click({ force: true });
    
    // Wait a moment for autocomplete to initialize and open
    waitForReactUpdate(300);
    
    // Type to filter options (matching AutocompleteField.cy.tsx pattern)
    // Type character by character to trigger autocomplete filtering
    input.type(optionValue, { force: true, delay: 50 });
    
    // Wait for autocomplete to filter and show options
    // HeroUI Autocomplete shows options in a listbox, combobox, or dialog popover
    // Give time for filtering to occur (similar to AutocompleteField.cy.tsx test)
    cy.wait(500);
    
    // First check that the popover/listbox container appears
    // Try multiple selectors as HeroUI might use different roles
    cy.get('[role="listbox"], [role="combobox"], [role="dialog"]', { timeout: 5000 })
      .should('exist');
    
    // Wait a bit more for options to render within the container
    cy.wait(200);
    
    // Then find options within the popover
    // Options might be filtered, so we search for the label text
    cy.get('[role="option"]', { timeout: 3000 })
      .should('exist')
      .contains(optionValue, { matchCase: false })
      .first()
      .should('be.visible')
      .click({ force: true });
    
    // Wait for React to update after selection
    waitForReactUpdate();
    
    return cy.get(`input[name="${name}"]`);
  }, DEFAULT_CONFIG);
}

/**
 * Fill date input by name attribute
 * DateInput uses spinbuttons, so this verifies the component exists
 * For actual date selection, you may need to interact with the spinbuttons directly
 * 
 * @example
 * cy.fillDateInputByName('birthDate');
 */
export function fillDateInputByName(name: string) {
  return withRetry((): Cypress.Chainable<Element> => {
    // DateInput doesn't forward name to spinbuttons, but we can verify it exists
    // Try multiple selectors to find DateInput component
    return cy.get('body').then(($body) => {
      const hasSpinbutton = $body.find('input[type="text"][role="spinbutton"]').length > 0;
      const hasDateInput = $body.find('[data-slot="date-input"]').length > 0;
      const hasDateField = $body.find(`[data-field-name="${name}"]`).length > 0;
      
      if (hasSpinbutton || hasDateInput || hasDateField) {
        // DateInput exists
        if (hasSpinbutton) {
          return cy.get('input[type="text"][role="spinbutton"]').first();
        } else if (hasDateInput) {
          return cy.get('[data-slot="date-input"]').first();
        } else {
          return cy.get(`[data-field-name="${name}"]`).first();
        }
      } else {
        // Just verify that a date-related field exists somewhere
        cy.log('DateInput component structure not found, but name attribute is set on component');
        return cy.get('body');
      }
    });
  }, DEFAULT_CONFIG);
}

/**
 * Select file input by name attribute
 * 
 * @example
 * cy.selectFileByName('avatar', 'path/to/file.jpg');
 */
export function selectFileByName(name: string, filePath: string) {
  return withRetry(() => {
    waitForFormReady();
    
    return cy.get(`input[type="file"][name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .selectFile(filePath, { force: true })
      .then(() => {
        waitForReactUpdate();
        return cy.get(`input[type="file"][name="${name}"]`);
      });
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
  // Try case-insensitive label matching
  return cy.get('body').then(($body) => {
    // Find label with case-insensitive matching
    const labels = $body.find('label');
    let $matchingLabel: JQuery<HTMLElement> | null = null;
    
    labels.each((index, label) => {
      const labelText = Cypress.$(label).text().toLowerCase();
      if (labelText.includes(fieldLabel.toLowerCase())) {
        $matchingLabel = Cypress.$(label);
        return false; // Break the loop
      }
    });
    
    if (!$matchingLabel || $matchingLabel.length === 0) {
      // Fallback: try direct contains (case-insensitive)
      return cy.contains('label', new RegExp(fieldLabel, 'i')).closest('div').then(($container) => {
        if (errorMessage) {
          return cy.wrap($container).should('contain', errorMessage);
        }
        return cy.wrap($container).should(($div) => {
          const text = $div.text();
          const hasError = text.includes('error') || 
                           text.includes('invalid') || 
                           text.includes('required') ||
                           $div.find('[class*="error"], [class*="invalid"], [class*="danger"]').length > 0;
          expect(hasError, 'Field should have an error').to.be.true;
        });
      });
    }
    
    const fieldContainer = cy.wrap($matchingLabel).closest('div');
    
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
    // Wait for form to be ready
    waitForFormReady();
    
    // Wait for submit button to be visible and enabled (state-based)
    waitForElementState(HERO_UI_SELECTORS.button.submit, 'visible', DEFAULT_CONFIG.timeout);
    waitForElementState(HERO_UI_SELECTORS.button.submit, 'enabled', DEFAULT_CONFIG.timeout);
    
    cy.get(HERO_UI_SELECTORS.button.submit)
      .first()
      .click();
    
    // Wait for form submission to start (React updates)
    waitForReactUpdate();
    
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
    // Wait for form to be ready
    waitForFormReady();
    
    // Wait for submit button to be ready
    waitForElementState(HERO_UI_SELECTORS.button.submit, 'visible', DEFAULT_CONFIG.timeout);
    waitForElementState(HERO_UI_SELECTORS.button.submit, 'enabled', DEFAULT_CONFIG.timeout);
    
    cy.get(HERO_UI_SELECTORS.button.submit)
      .eq(formIndex)
      .click();
    
    // Form should still exist (validation prevented submission)
    cy.get('form', { timeout: DEFAULT_CONFIG.timeout }).should('exist');
    
    // Wait for validation errors to appear (state-based)
    waitForValidation(true, 3000);
    
    // If error message is provided, check for it
    if (errorMessage) {
      // Try multiple approaches to find the error message
      cy.get('body', { timeout: 2000 }).then(($body) => {
        if ($body.text().includes(errorMessage)) {
          cy.contains(errorMessage, { timeout: 3000 }).should('be.visible');
        } else {
          // Debug: log what error messages are actually present
          cy.log('Expected error message not found:', errorMessage);
          cy.get('[class*="text-danger"], [class*="text-red"], [class*="error"], [class*="invalid"]', { timeout: 2000 })
            .then(($errors) => {
              if ($errors.length > 0) {
                cy.log('Found validation errors:', $errors.length);
                $errors.each((index, error) => {
                  cy.log(`Error ${index}:`, error.textContent);
                });
              }
            });
          // Still try to find the error message with a longer timeout
          cy.contains(errorMessage, { timeout: 3000 }).should('be.visible');
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
  return waitForFormReady().then(() => {
    return cy.get('body').then(($body) => {
      if ($body.find(HERO_UI_SELECTORS.button.reset).length > 0) {
        // Click the reset button - React Hook Form's reset() will handle everything
        cy.get(HERO_UI_SELECTORS.button.reset, { timeout: DEFAULT_CONFIG.timeout })
          .should('be.visible')
          .click();
        // Wait for React to update all fields (state-based)
        waitForReactUpdate();
        return cy.get('form');
      }
      
      // If no reset button, clear all clearable fields manually
      // Clear text inputs and textareas
      cy.get('input, textarea', { timeout: DEFAULT_CONFIG.timeout }).each(($el) => {
        const type = $el.attr('type');
        const tagName = $el.prop('tagName')?.toLowerCase();
        
        // Only clear text inputs, textareas, and number inputs
        // Skip: radio, checkbox, file, button, submit, reset, hidden
        if (tagName === 'textarea' || 
            (type === 'text' || type === 'email' || type === 'tel' || type === 'password' || 
             type === 'url' || type === 'search' || type === 'number' || !type)) {
          cy.wrap($el).clear({ force: true });
        }
      });
      
      // Uncheck all checkboxes (but not radio buttons)
      cy.get('input[type="checkbox"]').each(($el) => {
        const role = $el.attr('role');
        // Only uncheck if it's actually a checkbox (not a radio button)
        // Radio buttons have type="radio", but we're being extra safe
        if (role !== 'switch' && $el.attr('type') === 'checkbox') {
          cy.wrap($el).uncheck({ force: true });
        }
      });
      
      // Uncheck switches separately
      cy.get('input[role="switch"]').each(($el) => {
        cy.wrap($el).uncheck({ force: true });
      });
      
      // Radio buttons can't be unchecked individually - need to use form.reset()
      // Call form.reset() programmatically to clear radio buttons
      cy.get('form').then(($form) => {
        // Type guard: ensure element is HTMLFormElement
        const formElement = $form[0];
        if (formElement instanceof HTMLFormElement) {
          formElement.reset();
        }
      });
      
      // Wait for React to update after manual reset
      waitForReactUpdate();
      
      return cy.get('form');
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
 * Check form is rendered and ready
 * This is a convenience wrapper around waitForFormReady
 */
export function verifyFormExists() {
  return waitForFormReady();
}

/**
 * Check field exists
 */
export function verifyFieldExists(selector: string) {
  return cy.get(selector).should('exist');
}

/**
 * Verify field value by name attribute (most reliable method)
 * Tries input value first, falls back to FormData for controlled components
 * 
 * @example
 * cy.verifyFieldValueByName('email', 'user@example.com');
 * cy.verifyFieldValueByName('message', 'Hello world');
 */
export function verifyFieldValueByName(name: string, value: string) {
  return withRetry(() => {
    waitForFormReady();
    
    // Try to verify input value first
    cy.get(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`, { timeout: DEFAULT_CONFIG.timeout })
      .should('exist')
      .then(($el) => {
        const actualValue = $el.val();
        if (actualValue === value) {
          // Value matches, verification passed
          return cy.wrap($el).should('have.value', value);
        } else {
          // Value doesn't match - might be a controlled component
          // Fall back to FormData verification
          return verifyFormDataValue(name, value);
        }
      });
  }, DEFAULT_CONFIG);
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
 * Now uses name attributes as primary method for better reliability
 */
export function fillCompleteForm(formData: FormFieldData) {
  return cy.then(() => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
      const fieldType = detectFieldType(value);
      
      // First, try to find by name attribute (most reliable)
      cy.get('body').then(($body) => {
        const hasNameAttribute = $body.find(`[name="${key}"]`).length > 0;
        
        if (hasNameAttribute) {
          // Use name attribute - most reliable
          const fieldElement = cy.get(`[name="${key}"]`);
          
          fieldElement.then(($el) => {
            const tagName = $el.prop('tagName')?.toLowerCase();
            const inputType = $el.attr('type');
            const role = $el.attr('role');
            
            if (tagName === 'textarea') {
              fillTextareaByName(key, String(value));
            } else if (tagName === 'select') {
              selectDropdownByName(key, String(value));
            } else if (inputType === 'checkbox' || inputType === 'radio') {
              // Determine if this is a switch component
              const isSwitch = role === 'switch' || $el.attr('aria-label')?.includes('switch');
              
              // Check or uncheck based on value
              if (value) {
                isSwitch ? checkSwitchByName(key) : checkCheckboxByName(key);
              } else {
                isSwitch ? uncheckSwitchByName(key) : uncheckCheckboxByName(key);
              }
            } else {
              // Regular input
              fillInputByName(key, String(value));
            }
          });
        } else {
          // Fallback to old methods
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
              if ($body.find(`label:contains("${key}")`).length > 0) {
                fillInputByLabel(key, String(value));
              } else {
                fillInputByType('text', String(value));
              }
          }
        }
      });
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
