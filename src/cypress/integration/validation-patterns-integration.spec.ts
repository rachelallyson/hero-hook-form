/**
 * Cypress integration tests for validation patterns integration
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

describe('Validation Patterns Integration', () => {
  describe('Email Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate email patterns with enhanced state', () => {
      // Test valid email
      fillInputByLabel('Email', 'test@example.com');
      expectNoValidationErrors();
      
      // Test invalid email
      fillInputByLabel('Email', 'invalid-email');
      expectValidationError('email');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      cy.contains('Error submitting form').should('be.visible');
    });

    it('should validate email patterns with real-time validation', () => {
      // Type invalid email
      fillInputByLabel('Email', 'invalid-email');
      
      // Trigger validation (blur event)
      cy.get('input[type="email"]').blur();
      
      // Verify validation error appears
      expectValidationError('email');
      
      // Type valid email
      fillInputByLabel('Email', 'test@example.com');
      
      // Trigger validation
      cy.get('input[type="email"]').blur();
      
      // Verify validation error is cleared
      expectNoValidationErrors();
    });
  });

  describe('Phone Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate US phone patterns', () => {
      // Test valid US phone
      fillInputByLabel('Phone', '(123) 456-7890');
      expectNoValidationErrors();
      
      // Test invalid US phone
      fillInputByLabel('Phone', '123-456-7890');
      expectValidationError('phone');
    });

    it('should validate international phone patterns', () => {
      // Test valid international phone
      fillInputByLabel('International Phone', '+1 234 567 8900');
      expectNoValidationErrors();
      
      // Test invalid international phone
      fillInputByLabel('International Phone', 'abc-def-ghij');
      expectValidationError('phone');
    });
  });

  describe('URL Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate URL patterns', () => {
      // Test valid URL
      fillInputByLabel('Website', 'https://example.com');
      expectNoValidationErrors();
      
      // Test invalid URL
      fillInputByLabel('Website', 'not-a-url');
      expectValidationError('URL');
    });
  });

  describe('Password Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate password strength', () => {
      // Test strong password
      fillInputByLabel('Password', 'StrongPass123!');
      expectNoValidationErrors();
      
      // Test weak password
      fillInputByLabel('Password', 'weak');
      expectValidationError('password');
    });

    it('should validate very strong passwords', () => {
      // Test very strong password
      fillInputByLabel('Strong Password', 'VeryStrongPassword123!');
      expectNoValidationErrors();
      
      // Test weak password for strong validation
      fillInputByLabel('Strong Password', 'Password123!');
      expectValidationError('password');
    });
  });

  describe('Credit Card Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate credit card patterns', () => {
      // Test valid credit card
      fillInputByLabel('Credit Card', '1234 5678 9012 3456');
      expectNoValidationErrors();
      
      // Test invalid credit card
      fillInputByLabel('Credit Card', '1234 5678 9012');
      expectValidationError('credit card');
    });
  });

  describe('SSN Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate SSN patterns', () => {
      // Test valid SSN
      fillInputByLabel('SSN', '123-45-6789');
      expectNoValidationErrors();
      
      // Test invalid SSN
      fillInputByLabel('SSN', '123456789');
      expectValidationError('SSN');
    });
  });

  describe('US Zip Code Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate US zip code patterns', () => {
      // Test valid zip code
      fillInputByLabel('Zip Code', '12345');
      expectNoValidationErrors();
      
      // Test invalid zip code
      fillInputByLabel('Zip Code', '1234');
      expectValidationError('zip code');
    });
  });

  describe('IP Address Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate IP address patterns', () => {
      // Test valid IP
      fillInputByLabel('IP Address', '192.168.1.1');
      expectNoValidationErrors();
      
      // Test invalid IP
      fillInputByLabel('IP Address', '256.256.256.256');
      expectValidationError('IP address');
    });
  });

  describe('UUID Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate UUID patterns', () => {
      // Test valid UUID
      fillInputByLabel('UUID', '550e8400-e29b-41d4-a716-446655440000');
      expectNoValidationErrors();
      
      // Test invalid UUID
      fillInputByLabel('UUID', '550e8400-e29b-41d4-a716');
      expectValidationError('UUID');
    });
  });

  describe('Custom Regex Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate custom regex patterns', () => {
      // Test valid custom pattern
      fillInputByLabel('Custom Pattern', 'AB1234');
      expectNoValidationErrors();
      
      // Test invalid custom pattern
      fillInputByLabel('Custom Pattern', 'ab1234');
      expectValidationError('custom pattern');
    });
  });

  describe('Cross-field Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate password confirmation', () => {
      // Test matching passwords
      fillInputByLabel('Password', 'password123');
      fillInputByLabel('Confirm Password', 'password123');
      expectNoValidationErrors();
      
      // Test non-matching passwords
      fillInputByLabel('Password', 'password123');
      fillInputByLabel('Confirm Password', 'different123');
      expectValidationError('match');
    });

    it('should validate date ranges', () => {
      // Test valid date range
      fillInputByLabel('Start Date', '2023-01-01');
      fillInputByLabel('End Date', '2023-12-31');
      expectNoValidationErrors();
      
      // Test invalid date range
      fillInputByLabel('Start Date', '2023-12-31');
      fillInputByLabel('End Date', '2023-01-01');
      expectValidationError('date range');
    });

    it('should validate conditional required fields', () => {
      // Test required field when condition is met
      fillInputByLabel('Has Phone', 'yes');
      fillInputByLabel('Phone Number', '123-456-7890');
      expectNoValidationErrors();
      
      // Test missing required field when condition is met
      fillInputByLabel('Has Phone', 'yes');
      fillInputByLabel('Phone Number', '');
      expectValidationError('required');
    });
  });

  describe('Async Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should handle async validation', () => {
      // Fill form with data that requires async validation
      fillInputByLabel('Username', 'testuser');
      
      // Wait for async validation
      cy.wait(1000);
      
      // Verify validation result
      cy.get('body').should('contain', 'error');
    });

    it('should handle async validation errors', () => {
      // Fill form with data that will fail async validation
      fillInputByLabel('Username', 'existinguser');
      
      // Wait for async validation
      cy.wait(1000);
      
      // Verify validation error
      expectValidationError('username');
    });

    it('should handle async validation success', () => {
      // Fill form with data that will pass async validation
      fillInputByLabel('Username', 'newuser');
      
      // Wait for async validation
      cy.wait(1000);
      
      // Verify no validation error
      expectNoValidationErrors();
    });
  });

  describe('Form Submission with Validation Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should submit form with valid data', () => {
      // Fill form with valid data
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Phone', '(123) 456-7890');
      fillInputByLabel('Website', 'https://example.com');
      fillInputByLabel('Password', 'StrongPass123!');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should prevent submission with invalid data', () => {
      // Fill form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      fillInputByLabel('Phone', '123-456-7890');
      fillInputByLabel('Website', 'not-a-url');
      fillInputByLabel('Password', 'weak');
      
      // Submit form
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
      expectValidationError('email');
      expectValidationError('phone');
      expectValidationError('URL');
      expectValidationError('password');
    });

    it('should show validation errors for specific fields', () => {
      // Fill form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      
      // Submit form
      submitForm();
      
      // Verify specific field errors
      cy.contains('label', 'Name').closest('div').should('contain', 'required');
      cy.contains('label', 'Email').closest('div').should('contain', 'email');
    });
  });

  describe('Real-time Validation with Patterns', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should validate fields in real-time', () => {
      // Type invalid email
      fillInputByLabel('Email', 'invalid-email');
      
      // Trigger validation (blur event)
      cy.get('input[type="email"]').blur();
      
      // Verify validation error appears
      expectValidationError('email');
    });

    it('should clear validation errors when field becomes valid', () => {
      // Type invalid email
      fillInputByLabel('Email', 'invalid-email');
      
      // Trigger validation
      cy.get('input[type="email"]').blur();
      
      // Verify validation error appears
      expectValidationError('email');
      
      // Type valid email
      fillInputByLabel('Email', 'test@example.com');
      
      // Trigger validation
      cy.get('input[type="email"]').blur();
      
      // Verify validation error is cleared
      expectNoValidationErrors();
    });

    it('should validate multiple fields in real-time', () => {
      // Type invalid data in multiple fields
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      fillInputByLabel('Phone', '123-456-7890');
      
      // Trigger validation for all fields
      cy.get('input').each(($input) => {
        cy.wrap($input).blur();
      });
      
      // Verify validation errors for all fields
      expectValidationError('required');
      expectValidationError('email');
      expectValidationError('phone');
    });
  });

  describe('Validation Patterns with Enhanced State', () => {
    beforeEach(() => {
      cy.visit('/enhanced-state-demo');
    });

    it('should handle validation patterns with enhanced state', () => {
      // Fill form with valid data
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should handle validation errors with enhanced state', () => {
      // Submit form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      submitForm();
      
      // Verify enhanced error state
      cy.contains('Error submitting form').should('be.visible');
    });
  });

  describe('Validation Patterns with Dynamic Forms', () => {
    beforeEach(() => {
      cy.visit('/dynamic-form-demo');
    });

    it('should handle validation patterns with conditional fields', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears
      cy.contains('label', 'Premium Features').should('be.visible');
      
      // Fill conditional field
      fillInputByLabel('Premium Features', 'Advanced features enabled');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should handle validation patterns with field arrays', () => {
      // Add field array item
      cy.get('button').contains('Add Item').click();
      
      // Fill field array item
      fillInputByLabel('Name', 'Item 1');
      fillInputByLabel('Email', 'item1@example.com');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should handle validation patterns with dynamic sections', () => {
      // Set trigger value
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Verify section appears
      cy.contains('Additional Information').should('be.visible');
      
      // Fill section fields
      fillInputByLabel('Additional Notes', 'Some additional notes');
      selectDropdownByLabel('Priority Level', 'High');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Validation Patterns with Performance Optimizations', () => {
    beforeEach(() => {
      cy.visit('/performance-demo');
    });

    it('should handle validation patterns with debounced validation', () => {
      // Type value quickly
      fillInputByLabel('Search', 'test query');
      
      // Wait for debounce delay
      cy.wait(300);
      
      // Verify validation was triggered
      cy.get('body').should('contain', 'error');
    });

    it('should handle validation patterns with form performance', () => {
      // Fill many fields
      for (let i = 0; i < 10; i++) {
        fillInputByType('text', `value${i}`);
      }
      
      // Verify form is still responsive
      cy.get('input').first().should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should handle validation patterns with memoization', () => {
      // Fill form fields
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Change unrelated field
      fillInputByLabel('Notes', 'Some notes');
      
      // Verify name and email fields didn't re-render
      cy.get('input[name="name"]').should('have.value', 'John Doe');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
    });
  });
});
