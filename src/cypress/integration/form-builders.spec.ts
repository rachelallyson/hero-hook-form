/**
 * Cypress integration tests for form builder integration
 */

import { 
  fillInputByLabel,
  fillInputByType,
  selectDropdownByLabel,
  checkCheckboxByLabel,
  submitForm,
  expectValidationError,
  expectNoValidationErrors
} from '../helpers';

describe('Form Builder Integration', () => {
  describe('BasicFormBuilder', () => {
    beforeEach(() => {
      cy.visit('/basic-form-demo');
    });

    it('should render basic form fields', () => {
      // Verify form fields exist
      cy.get('input[name="firstName"]').should('exist');
      cy.get('input[name="lastName"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="phone"]').should('exist');
    });

    it('should fill and submit basic form', () => {
      // Fill form fields
      fillInputByLabel('First Name', 'John');
      fillInputByLabel('Last Name', 'Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Phone', '(123) 456-7890');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should validate required fields', () => {
      // Submit empty form
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
    });

    it('should validate email format', () => {
      // Fill form with invalid email
      fillInputByLabel('First Name', 'John');
      fillInputByLabel('Last Name', 'Doe');
      fillInputByLabel('Email', 'invalid-email');
      fillInputByLabel('Phone', '(123) 456-7890');
      
      // Submit form
      submitForm();
      
      // Verify email validation error
      expectValidationError('email');
    });
  });

  describe('AdvancedFormBuilder', () => {
    beforeEach(() => {
      cy.visit('/advanced-form-demo');
    });

    it('should render advanced form fields', () => {
      // Verify form fields exist
      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('select[name="country"]').should('exist');
      cy.get('input[name="newsletter"]').should('exist');
    });

    it('should fill and submit advanced form', () => {
      // Fill form fields
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      selectDropdownByLabel('Country', 'United States');
      checkCheckboxByLabel('Subscribe to newsletter');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should validate required fields', () => {
      // Submit empty form
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
    });

    it('should validate email format', () => {
      // Fill form with invalid email
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'invalid-email');
      selectDropdownByLabel('Country', 'United States');
      
      // Submit form
      submitForm();
      
      // Verify email validation error
      expectValidationError('email');
    });

    it('should handle conditional fields', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears
      cy.contains('label', 'Premium Features').should('be.visible');
    });

    it('should handle field arrays', () => {
      // Add field array item
      cy.get('button').contains('Add Item').click();
      
      // Verify item was added
      cy.contains('Item 1').should('be.visible');
    });

    it('should handle dynamic sections', () => {
      // Set trigger value
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Verify section appears
      cy.contains('Additional Information').should('be.visible');
    });
  });

  describe('TypeInferredBuilder', () => {
    beforeEach(() => {
      cy.visit('/type-inferred-demo');
    });

    it('should render type-inferred form fields', () => {
      // Verify form fields exist
      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="age"]').should('exist');
      cy.get('input[name="active"]').should('exist');
    });

    it('should fill and submit type-inferred form', () => {
      // Fill form fields
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Age', '25');
      checkCheckboxByLabel('Active');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should validate required fields', () => {
      // Submit empty form
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
    });

    it('should validate email format', () => {
      // Fill form with invalid email
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'invalid-email');
      fillInputByLabel('Age', '25');
      
      // Submit form
      submitForm();
      
      // Verify email validation error
      expectValidationError('email');
    });

    it('should validate number fields', () => {
      // Fill form with invalid age
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Age', 'invalid-age');
      
      // Submit form
      submitForm();
      
      // Verify number validation error
      expectValidationError('number');
    });

    it('should validate boolean fields', () => {
      // Fill form without checking required checkbox
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Age', '25');
      
      // Submit form
      submitForm();
      
      // Verify boolean validation error
      expectValidationError('required');
    });
  });

  describe('Form Builder Comparison', () => {
    it('should compare BasicFormBuilder vs AdvancedFormBuilder', () => {
      // Visit basic form
      cy.visit('/basic-form-demo');
      
      // Verify basic form fields
      cy.get('input[name="firstName"]').should('exist');
      cy.get('input[name="lastName"]').should('exist');
      
      // Visit advanced form
      cy.visit('/advanced-form-demo');
      
      // Verify advanced form fields
      cy.get('input[name="name"]').should('exist');
      cy.get('select[name="country"]').should('exist');
    });

    it('should compare AdvancedFormBuilder vs TypeInferredBuilder', () => {
      // Visit advanced form
      cy.visit('/advanced-form-demo');
      
      // Verify advanced form fields
      cy.get('input[name="name"]').should('exist');
      cy.get('select[name="country"]').should('exist');
      
      // Visit type-inferred form
      cy.visit('/type-inferred-demo');
      
      // Verify type-inferred form fields
      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="age"]').should('exist');
    });

    it('should compare all form builders', () => {
      // Visit basic form
      cy.visit('/basic-form-demo');
      cy.get('form').should('exist');
      
      // Visit advanced form
      cy.visit('/advanced-form-demo');
      cy.get('form').should('exist');
      
      // Visit type-inferred form
      cy.visit('/type-inferred-demo');
      cy.get('form').should('exist');
    });
  });

  describe('Form Builder Features', () => {
    it('should handle form field types', () => {
      cy.visit('/advanced-form-demo');
      
      // Test text input
      fillInputByLabel('Name', 'John Doe');
      
      // Test email input
      fillInputByLabel('Email', 'john@example.com');
      
      // Test select dropdown
      selectDropdownByLabel('Country', 'United States');
      
      // Test checkbox
      checkCheckboxByLabel('Subscribe to newsletter');
    });

    it('should handle form validation', () => {
      cy.visit('/advanced-form-demo');
      
      // Submit empty form
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
    });

    it('should handle form submission', () => {
      cy.visit('/advanced-form-demo');
      
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      selectDropdownByLabel('Country', 'United States');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should handle form reset', () => {
      cy.visit('/advanced-form-demo');
      
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Reset form
      cy.get('button[type="button"]').contains('Reset').click();
      
      // Verify form is reset
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
    });
  });

  describe('Form Builder Performance', () => {
    it('should handle forms with many fields efficiently', () => {
      cy.visit('/performance-demo');
      
      // Fill many fields
      for (let i = 0; i < 10; i++) {
        fillInputByType('text', `value${i}`);
      }
      
      // Verify form is still responsive
      cy.get('input').first().should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should handle rapid form interactions', () => {
      cy.visit('/performance-demo');
      
      // Rapidly fill and clear fields
      for (let i = 0; i < 5; i++) {
        fillInputByLabel('Name', `Test ${i}`);
        cy.get('input[name="name"]').clear();
      }
      
      // Verify form is still functional
      fillInputByLabel('Name', 'Final Test');
      fillInputByLabel('Email', 'test@example.com');
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Form Builder Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API call to return error
      cy.intercept('POST', '/api/submit', { statusCode: 500, body: { error: 'Server error' } });
      
      cy.visit('/advanced-form-demo');
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify error state
      cy.contains('Error submitting form').should('be.visible');
    });

    it('should handle validation errors gracefully', () => {
      cy.visit('/advanced-form-demo');
      
      // Submit form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
      expectValidationError('email');
    });

    it('should handle timeout errors', () => {
      // Intercept API call to timeout
      cy.intercept('POST', '/api/submit', { delay: 10000 });
      
      cy.visit('/advanced-form-demo');
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify loading state
      cy.contains('Submitting form...').should('be.visible');
    });
  });

  describe('Form Builder Integration', () => {
    it('should work with React Hook Form', () => {
      cy.visit('/advanced-form-demo');
      
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Verify form state
      cy.get('input[name="name"]').should('have.value', 'John Doe');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
    });

    it('should work with Zod validation', () => {
      cy.visit('/advanced-form-demo');
      
      // Fill form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      
      // Submit form
      submitForm();
      
      // Verify Zod validation errors
      expectValidationError('required');
      expectValidationError('email');
    });

    it('should work with HeroUI components', () => {
      cy.visit('/advanced-form-demo');
      
      // Verify HeroUI components are rendered
      cy.get('input[type="text"]').should('exist');
      cy.get('input[type="email"]').should('exist');
      cy.get('button[aria-haspopup="listbox"]').should('exist');
      cy.get('input[type="checkbox"]').should('exist');
    });

    it('should work with enhanced form state', () => {
      cy.visit('/enhanced-state-demo');
      
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });
});
