/**
 * Cypress integration tests for type inference features
 */

import { 
  typeInferenceHelpers,
  fillInputByLabel,
  fillInputByType,
  selectDropdownByLabel,
  checkCheckboxByLabel,
  submitForm,
  expectValidationError,
  expectNoValidationErrors
} from '../helpers';

describe('Type Inference Features', () => {
  beforeEach(() => {
    cy.visit('/validation-demo');
  });

  describe('Auto-inferred Validation', () => {
    it('should validate email format automatically', () => {
      // Test valid email
      typeInferenceHelpers.testInferredValidation('Email', 'test@example.com', true);
      
      // Test invalid email
      typeInferenceHelpers.testInferredValidation('Email', 'invalid-email', false);
    });

    it('should validate phone format automatically', () => {
      // Test valid phone
      typeInferenceHelpers.testInferredValidation('Phone', '(123) 456-7890', true);
      
      // Test invalid phone
      typeInferenceHelpers.testInferredValidation('Phone', '123-456-7890', false);
    });

    it('should validate URL format automatically', () => {
      // Test valid URL
      typeInferenceHelpers.testInferredValidation('Website', 'https://example.com', true);
      
      // Test invalid URL
      typeInferenceHelpers.testInferredValidation('Website', 'not-a-url', false);
    });

    it('should validate password strength automatically', () => {
      // Test strong password
      typeInferenceHelpers.testInferredValidation('Password', 'StrongPass123!', true);
      
      // Test weak password
      typeInferenceHelpers.testInferredValidation('Password', 'weak', false);
    });

    it('should validate credit card format automatically', () => {
      // Test valid credit card
      typeInferenceHelpers.testInferredValidation('Credit Card', '1234 5678 9012 3456', true);
      
      // Test invalid credit card
      typeInferenceHelpers.testInferredValidation('Credit Card', '1234 5678 9012', false);
    });

    it('should validate SSN format automatically', () => {
      // Test valid SSN
      typeInferenceHelpers.testInferredValidation('SSN', '123-45-6789', true);
      
      // Test invalid SSN
      typeInferenceHelpers.testInferredValidation('SSN', '123456789', false);
    });

    it('should validate US zip code automatically', () => {
      // Test valid zip code
      typeInferenceHelpers.testInferredValidation('Zip Code', '12345', true);
      
      // Test invalid zip code
      typeInferenceHelpers.testInferredValidation('Zip Code', '1234', false);
    });

    it('should validate IP address automatically', () => {
      // Test valid IP
      typeInferenceHelpers.testInferredValidation('IP Address', '192.168.1.1', true);
      
      // Test invalid IP
      typeInferenceHelpers.testInferredValidation('IP Address', '256.256.256.256', false);
    });

    it('should validate UUID format automatically', () => {
      // Test valid UUID
      typeInferenceHelpers.testInferredValidation('UUID', '550e8400-e29b-41d4-a716-446655440000', true);
      
      // Test invalid UUID
      typeInferenceHelpers.testInferredValidation('UUID', '550e8400-e29b-41d4-a716', false);
    });
  });

  describe('Cross-field Validation', () => {
    it('should validate password confirmation', () => {
      // Test matching passwords
      typeInferenceHelpers.testPasswordConfirmation('password123', 'password123', true);
      
      // Test non-matching passwords
      typeInferenceHelpers.testPasswordConfirmation('password123', 'different123', false);
    });

    it('should validate date ranges', () => {
      // Test valid date range
      typeInferenceHelpers.testCrossFieldValidation('Start Date', '2023-01-01', 'End Date', '2023-12-31', true);
      
      // Test invalid date range
      typeInferenceHelpers.testCrossFieldValidation('Start Date', '2023-12-31', 'End Date', '2023-01-01', false);
    });

    it('should validate conditional required fields', () => {
      // Test required field when condition is met
      typeInferenceHelpers.testCrossFieldValidation('Has Phone', 'yes', 'Phone Number', '123-456-7890', true);
      
      // Test missing required field when condition is met
      typeInferenceHelpers.testCrossFieldValidation('Has Phone', 'yes', 'Phone Number', '', false);
    });

    it('should validate email confirmation', () => {
      // Test matching emails
      typeInferenceHelpers.testCrossFieldValidation('Email', 'test@example.com', 'Confirm Email', 'test@example.com', true);
      
      // Test non-matching emails
      typeInferenceHelpers.testCrossFieldValidation('Email', 'test@example.com', 'Confirm Email', 'different@example.com', false);
    });
  });

  describe('Validation Patterns', () => {
    it('should validate email patterns', () => {
      // Test various email patterns
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org'
      ];
      
      validEmails.forEach(email => {
        fillInputByLabel('Email', email);
        expectNoValidationErrors();
      });
      
      // Test invalid email patterns
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com'
      ];
      
      invalidEmails.forEach(email => {
        fillInputByLabel('Email', email);
        expectValidationError('email');
      });
    });

    it('should validate phone patterns', () => {
      // Test various phone patterns
      const validPhones = [
        '(123) 456-7890',
        '(555) 123-4567'
      ];
      
      validPhones.forEach(phone => {
        fillInputByLabel('Phone', phone);
        expectNoValidationErrors();
      });
      
      // Test invalid phone patterns
      const invalidPhones = [
        '123-456-7890',
        '1234567890',
        '(123) 456-789',
        '123-456-7890'
      ];
      
      invalidPhones.forEach(phone => {
        fillInputByLabel('Phone', phone);
        expectValidationError('phone');
      });
    });

    it('should validate URL patterns', () => {
      // Test various URL patterns
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://www.example.com/path',
        'https://subdomain.example.com'
      ];
      
      validUrls.forEach(url => {
        fillInputByLabel('Website', url);
        expectNoValidationErrors();
      });
      
      // Test invalid URL patterns
      const invalidUrls = [
        'example.com',
        'ftp://example.com',
        'not-a-url',
        'https://'
      ];
      
      invalidUrls.forEach(url => {
        fillInputByLabel('Website', url);
        expectValidationError('URL');
      });
    });

    it('should validate password patterns', () => {
      // Test strong password patterns
      const strongPasswords = [
        'Password123!',
        'MySecurePass1@',
        'StrongP@ssw0rd'
      ];
      
      strongPasswords.forEach(password => {
        fillInputByLabel('Password', password);
        expectNoValidationErrors();
      });
      
      // Test weak password patterns
      const weakPasswords = [
        'password', // No uppercase, numbers, or special chars
        'PASSWORD', // No lowercase, numbers, or special chars
        'Password', // No numbers or special chars
        'Password123', // No special chars
        'Pass1!' // Too short
      ];
      
      weakPasswords.forEach(password => {
        fillInputByLabel('Password', password);
        expectValidationError('password');
      });
    });

    it('should validate credit card patterns', () => {
      // Test various credit card patterns
      const validCards = [
        '1234 5678 9012 3456',
        '1234-5678-9012-3456',
        '1234567890123456'
      ];
      
      validCards.forEach(card => {
        fillInputByLabel('Credit Card', card);
        expectNoValidationErrors();
      });
      
      // Test invalid credit card patterns
      const invalidCards = [
        '1234 5678 9012', // Too short
        '1234-5678-9012-3456-7890', // Too long
        'abcd efgh ijkl mnop' // Non-numeric
      ];
      
      invalidCards.forEach(card => {
        fillInputByLabel('Credit Card', card);
        expectValidationError('credit card');
      });
    });

    it('should validate SSN patterns', () => {
      // Test various SSN patterns
      const validSSNs = [
        '123-45-6789',
        '000-00-0000'
      ];
      
      validSSNs.forEach(ssn => {
        fillInputByLabel('SSN', ssn);
        expectNoValidationErrors();
      });
      
      // Test invalid SSN patterns
      const invalidSSNs = [
        '123456789', // No dashes
        '123-45-678', // Too short
        '123-45-67890', // Too long
        'abc-de-fghi' // Non-numeric
      ];
      
      invalidSSNs.forEach(ssn => {
        fillInputByLabel('SSN', ssn);
        expectValidationError('SSN');
      });
    });

    it('should validate US zip code patterns', () => {
      // Test various zip code patterns
      const validZipCodes = [
        '12345',
        '12345-6789',
        '12345 6789'
      ];
      
      validZipCodes.forEach(zip => {
        fillInputByLabel('Zip Code', zip);
        expectNoValidationErrors();
      });
      
      // Test invalid zip code patterns
      const invalidZipCodes = [
        '1234', // Too short
        '123456', // Too long
        'abcde', // Non-numeric
        '12345-678' // Invalid format
      ];
      
      invalidZipCodes.forEach(zip => {
        fillInputByLabel('Zip Code', zip);
        expectValidationError('zip code');
      });
    });

    it('should validate IP address patterns', () => {
      // Test various IP address patterns
      const validIPs = [
        '192.168.1.1',
        '10.0.0.1',
        '255.255.255.255',
        '0.0.0.0'
      ];
      
      validIPs.forEach(ip => {
        fillInputByLabel('IP Address', ip);
        expectNoValidationErrors();
      });
      
      // Test invalid IP address patterns
      const invalidIPs = [
        '256.256.256.256', // Out of range
        '192.168.1', // Incomplete
        '192.168.1.1.1', // Too many octets
        '192.168.1.abc' // Non-numeric
      ];
      
      invalidIPs.forEach(ip => {
        fillInputByLabel('IP Address', ip);
        expectValidationError('IP address');
      });
    });

    it('should validate UUID patterns', () => {
      // Test various UUID patterns
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
      ];
      
      validUUIDs.forEach(uuid => {
        fillInputByLabel('UUID', uuid);
        expectNoValidationErrors();
      });
      
      // Test invalid UUID patterns
      const invalidUUIDs = [
        '550e8400-e29b-41d4-a716', // Too short
        '550e8400-e29b-41d4-a716-446655440000-extra', // Too long
        '550e8400-e29b-41d4-a716-44665544000g' // Invalid character
      ];
      
      invalidUUIDs.forEach(uuid => {
        fillInputByLabel('UUID', uuid);
        expectValidationError('UUID');
      });
    });
  });

  describe('Custom Validation Patterns', () => {
    it('should validate custom regex patterns', () => {
      // Test custom pattern validation
      fillInputByLabel('Custom Pattern', 'AB1234');
      expectNoValidationErrors();
      
      // Test invalid custom pattern
      fillInputByLabel('Custom Pattern', 'ab1234');
      expectValidationError('custom pattern');
    });

    it('should validate custom validation rules', () => {
      // Test custom validation rules
      fillInputByLabel('Custom Field', 'valid value');
      expectNoValidationErrors();
      
      // Test invalid custom validation
      fillInputByLabel('Custom Field', 'invalid');
      expectValidationError('custom validation');
    });
  });

  describe('Async Validation', () => {
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

  describe('Form Builder Integration', () => {
    it('should work with TypeInferredBuilder', () => {
      // Fill form fields
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Age', '25');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should work with AdvancedFormBuilder', () => {
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

    it('should work with BasicFormBuilder', () => {
      // Fill form fields
      fillInputByLabel('First Name', 'John');
      fillInputByLabel('Last Name', 'Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', () => {
      // Submit form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
      expectValidationError('email');
    });

    it('should handle network errors gracefully', () => {
      // Intercept API call to return error
      cy.intercept('POST', '/api/submit', { statusCode: 500, body: { error: 'Server error' } });
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify error state
      cy.contains('Error submitting form').should('be.visible');
    });

    it('should handle timeout errors gracefully', () => {
      // Intercept API call to timeout
      cy.intercept('POST', '/api/submit', { delay: 10000 });
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify loading state
      cy.contains('Submitting form...').should('be.visible');
    });
  });
});
