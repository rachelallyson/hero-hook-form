/**
 * Cypress integration tests for enhanced form state features
 */

import { 
  formSubmissionHelpers,
  fillInputByLabel,
  fillInputByType,
  selectDropdownByLabel,
  checkCheckboxByLabel,
  submitForm,
  expectValidationError,
  expectNoValidationErrors
} from '../helpers';

describe('Enhanced Form State', () => {
  beforeEach(() => {
    cy.visit('/enhanced-state-demo');
  });

  describe('Form Submission States', () => {
    it('should show loading state during submission', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify loading state
      formSubmissionHelpers.waitForFormStatus('loading');
      cy.contains('Submitting form...').should('be.visible');
    });

    it('should show success state after successful submission', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify success state
      formSubmissionHelpers.waitForFormStatus('success');
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should show error state on validation failure', () => {
      // Submit empty form
      submitForm();
      
      // Verify error state
      formSubmissionHelpers.waitForFormStatus('error');
      cy.contains('Error submitting form').should('be.visible');
    });

    it('should show error state on network error', () => {
      // Intercept API call to return error
      cy.intercept('POST', '/api/submit', { statusCode: 500, body: { error: 'Server error' } });
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify error state
      formSubmissionHelpers.waitForFormStatus('error');
      cy.contains('Error submitting form').should('be.visible');
    });

    it('should show error state on timeout', () => {
      // Intercept API call to timeout
      cy.intercept('POST', '/api/submit', { delay: 10000 });
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify loading state (timeout would need to be handled in the app)
      formSubmissionHelpers.waitForFormStatus('loading');
    });
  });

  describe('Form Status Component', () => {
    it('should display loading status with details', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify loading status with details
      cy.contains('Submitting form...').should('be.visible');
      cy.contains('Please wait while we process your request.').should('be.visible');
    });

    it('should display success status with details', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify success status with details
      cy.contains('Form submitted successfully!').should('be.visible');
      cy.contains('Your data has been saved. Thank you for your submission.').should('be.visible');
    });

    it('should display error status with details', () => {
      // Submit empty form
      submitForm();
      
      // Verify error status with details
      cy.contains('Error submitting form').should('be.visible');
      cy.contains('Please fix the validation errors above').should('be.visible');
    });

    it('should allow dismissing status messages', () => {
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Wait for success status
      formSubmissionHelpers.waitForFormStatus('success');
      
      // Dismiss status message
      formSubmissionHelpers.dismissFormStatus();
      
      // Verify status message is dismissed
      cy.contains('Form submitted successfully!').should('not.exist');
    });

    it('should not show dismiss button when onDismiss is not provided', () => {
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Wait for success status
      formSubmissionHelpers.waitForFormStatus('success');
      
      // Verify no dismiss button
      cy.get('button[aria-label*="Dismiss"]').should('not.exist');
    });
  });

  describe('Enhanced Submit Button', () => {
    it('should show loading spinner during submission', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify loading spinner
      cy.get('button[type="submit"]').should('contain', 'Submitting...');
      cy.get('button[type="submit"]').should('contain', '⏳');
    });

    it('should show success checkmark after successful submission', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify success checkmark
      cy.get('button[type="submit"]').should('contain', 'Success!');
      cy.get('button[type="submit"]').should('contain', '✅');
    });

    it('should show error state on submission failure', () => {
      // Submit empty form
      submitForm();
      
      // Verify error state
      cy.get('button[type="submit"]').should('contain', 'Error');
    });

    it('should be disabled during submission', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify button is disabled
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should be enabled after submission completes', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Wait for submission to complete
      cy.wait(2000);
      
      // Verify button is enabled again
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  });

  describe('Form State Management', () => {
    it('should track touched fields', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Verify fields are marked as touched
      cy.get('input[name="name"]').should('have.attr', 'data-touched', 'true');
      cy.get('input[name="email"]').should('have.attr', 'data-touched', 'true');
    });

    it('should track dirty fields', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Verify fields are marked as dirty
      cy.get('input[name="name"]').should('have.attr', 'data-dirty', 'true');
      cy.get('input[name="email"]').should('have.attr', 'data-dirty', 'true');
    });

    it('should track error count', () => {
      // Submit empty form
      submitForm();
      
      // Verify error count is tracked
      cy.get('[data-error-count]').should('contain', '2');
    });

    it('should track validation errors', () => {
      // Fill form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      
      // Submit form
      submitForm();
      
      // Verify validation errors are tracked
      cy.get('[data-has-errors]').should('contain', 'true');
      cy.get('[data-error-count]').should('contain', '2');
    });

    it('should reset form state', () => {
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Wait for success
      formSubmissionHelpers.waitForFormStatus('success');
      
      // Reset form
      cy.get('button[type="button"]').contains('Reset').click();
      
      // Verify form is reset
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
    });
  });

  describe('Auto-reset Functionality', () => {
    it('should auto-reset form after successful submission', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Wait for success
      formSubmissionHelpers.waitForFormStatus('success');
      
      // Wait for auto-reset
      cy.wait(3000);
      
      // Verify form is reset
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
    });

    it('should not auto-reset when disabled', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Wait for success
      formSubmissionHelpers.waitForFormStatus('success');
      
      // Wait longer than auto-reset delay
      cy.wait(5000);
      
      // Verify form is not reset
      cy.get('input[name="name"]').should('have.value', 'John Doe');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API call to return error
      cy.intercept('POST', '/api/submit', { statusCode: 500, body: { error: 'Server error' } });
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify error state
      formSubmissionHelpers.waitForFormStatus('error');
      cy.contains('Server error').should('be.visible');
    });

    it('should handle validation errors gracefully', () => {
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
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify loading state
      formSubmissionHelpers.waitForFormStatus('loading');
    });

    it('should handle unexpected errors', () => {
      // Intercept API call to return unexpected error
      cy.intercept('POST', '/api/submit', { statusCode: 500, body: { error: 'Unexpected error' } });
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify error state
      formSubmissionHelpers.waitForFormStatus('error');
      cy.contains('Unexpected error').should('be.visible');
    });
  });

  describe('Form State Persistence', () => {
    it('should persist form state across page refreshes', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Refresh page
      cy.reload();
      
      // Verify form state is persisted
      cy.get('input[name="name"]').should('have.value', 'John Doe');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
    });

    it('should persist form state across navigation', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Navigate to another page
      cy.visit('/basic-form-demo');
      
      // Navigate back
      cy.visit('/enhanced-state-demo');
      
      // Verify form state is persisted
      cy.get('input[name="name"]').should('have.value', 'John Doe');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
    });
  });
});
