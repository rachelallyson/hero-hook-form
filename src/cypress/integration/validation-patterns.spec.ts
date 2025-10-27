/**
 * Cypress integration tests for validation patterns
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

describe('Validation Patterns', () => {
  beforeEach(() => {
    cy.visit('/validation-demo');
  });

  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org'
      ];

      validEmails.forEach(email => {
        fillInputByLabel('Email', email);
        expectNoValidationErrors();
      });
    });

    it('should reject invalid email formats', () => {
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
  });

  describe('Phone Validation', () => {
    it('should validate US phone number format', () => {
      const validPhones = [
        '(123) 456-7890',
        '(555) 123-4567'
      ];

      validPhones.forEach(phone => {
        fillInputByLabel('Phone', phone);
        expectNoValidationErrors();
      });
    });

    it('should reject invalid US phone number formats', () => {
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

    it('should validate international phone number format', () => {
      const validPhones = [
        '+1 234 567 8900',
        '+44 20 7946 0958',
        '123-456-7890',
        '(123) 456-7890'
      ];

      validPhones.forEach(phone => {
        fillInputByLabel('International Phone', phone);
        expectNoValidationErrors();
      });
    });

    it('should reject invalid phone number formats', () => {
      const invalidPhones = [
        'abc-def-ghij',
        '123-abc-7890',
        '1234567890abc'
      ];

      invalidPhones.forEach(phone => {
        fillInputByLabel('International Phone', phone);
        expectValidationError('phone');
      });
    });
  });

  describe('URL Validation', () => {
    it('should validate correct URL formats', () => {
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
    });

    it('should reject invalid URL formats', () => {
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
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MySecurePass1@',
        'StrongP@ssw0rd'
      ];

      strongPasswords.forEach(password => {
        fillInputByLabel('Password', password);
        expectNoValidationErrors();
      });
    });

    it('should reject weak passwords', () => {
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

    it('should validate very strong passwords', () => {
      const veryStrongPasswords = [
        'VeryStrongPassword123!',
        'MySuperSecurePass1@',
        'UltraStrongP@ssw0rd'
      ];

      veryStrongPasswords.forEach(password => {
        fillInputByLabel('Strong Password', password);
        expectNoValidationErrors();
      });
    });

    it('should reject passwords that don\'t meet strong requirements', () => {
      const weakPasswords = [
        'Password123!', // Too short
        'VeryStrongPassword!', // No numbers
        'VeryStrongPassword123' // No special chars
      ];

      weakPasswords.forEach(password => {
        fillInputByLabel('Strong Password', password);
        expectValidationError('password');
      });
    });
  });

  describe('Credit Card Validation', () => {
    it('should validate credit card formats', () => {
      const validCards = [
        '1234 5678 9012 3456',
        '1234-5678-9012-3456',
        '1234567890123456'
      ];

      validCards.forEach(card => {
        fillInputByLabel('Credit Card', card);
        expectNoValidationErrors();
      });
    });

    it('should reject invalid credit card formats', () => {
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
  });

  describe('SSN Validation', () => {
    it('should validate SSN format', () => {
      const validSSNs = [
        '123-45-6789',
        '000-00-0000'
      ];

      validSSNs.forEach(ssn => {
        fillInputByLabel('SSN', ssn);
        expectNoValidationErrors();
      });
    });

    it('should reject invalid SSN formats', () => {
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
  });

  describe('US Zip Code Validation', () => {
    it('should validate US zip code formats', () => {
      const validZipCodes = [
        '12345',
        '12345-6789',
        '12345 6789'
      ];

      validZipCodes.forEach(zip => {
        fillInputByLabel('Zip Code', zip);
        expectNoValidationErrors();
      });
    });

    it('should reject invalid US zip code formats', () => {
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
  });

  describe('IP Address Validation', () => {
    it('should validate IP address formats', () => {
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
    });

    it('should reject invalid IP address formats', () => {
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
  });

  describe('UUID Validation', () => {
    it('should validate UUID formats', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
      ];

      validUUIDs.forEach(uuid => {
        fillInputByLabel('UUID', uuid);
        expectNoValidationErrors();
      });
    });

    it('should reject invalid UUID formats', () => {
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

  describe('Custom Regex Validation', () => {
    it('should validate custom regex patterns', () => {
      // Test custom pattern validation
      fillInputByLabel('Custom Pattern', 'AB1234');
      expectNoValidationErrors();
    });

    it('should reject invalid custom regex patterns', () => {
      // Test invalid custom pattern
      fillInputByLabel('Custom Pattern', 'ab1234');
      expectValidationError('custom pattern');
    });
  });

  describe('Cross-field Validation', () => {
    it('should validate password confirmation', () => {
      // Test matching passwords
      fillInputByLabel('Password', 'password123');
      fillInputByLabel('Confirm Password', 'password123');
      expectNoValidationErrors();
    });

    it('should reject non-matching passwords', () => {
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
    });

    it('should reject invalid date ranges', () => {
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
    });

    it('should reject missing required fields when condition is met', () => {
      // Test missing required field when condition is met
      fillInputByLabel('Has Phone', 'yes');
      fillInputByLabel('Phone Number', '');
      expectValidationError('required');
    });

    it('should allow empty fields when condition is not met', () => {
      // Test empty field when condition is not met
      fillInputByLabel('Has Phone', 'no');
      fillInputByLabel('Phone Number', '');
      expectNoValidationErrors();
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

  describe('Form Submission with Validation', () => {
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

  describe('Real-time Validation', () => {
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
});
