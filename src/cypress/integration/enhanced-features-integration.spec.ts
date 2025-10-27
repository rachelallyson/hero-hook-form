/**
 * Cypress integration tests for enhanced features integration
 */

import { 
  formSubmissionHelpers,
  dynamicFormHelpers,
  performanceHelpers,
  typeInferenceHelpers,
  fillInputByLabel,
  fillInputByType,
  selectDropdownByLabel,
  checkCheckboxByLabel,
  submitForm,
  expectValidationError,
  expectNoValidationErrors
} from '../helpers';

describe('Enhanced Features Integration', () => {
  describe('Dynamic Forms with Enhanced State', () => {
    beforeEach(() => {
      cy.visit('/dynamic-form-demo');
    });

    it('should handle conditional fields with enhanced state', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears
      dynamicFormHelpers.testConditionalField('User Type', 'premium', 'Premium Features');
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Premium Features', 'Advanced features enabled');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle field arrays with enhanced state', () => {
      // Add field array item
      dynamicFormHelpers.addFieldArrayItem();
      
      // Fill field array item
      fillInputByLabel('Name', 'Item 1');
      fillInputByLabel('Email', 'item1@example.com');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle dynamic sections with enhanced state', () => {
      // Set trigger value
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Verify section appears
      dynamicFormHelpers.testDynamicSection('Include Additional Info', 'yes', 'Additional Information');
      
      // Fill section fields
      fillInputByLabel('Additional Notes', 'Some additional notes');
      selectDropdownByLabel('Priority Level', 'High');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });
  });

  describe('Performance with Enhanced State', () => {
    beforeEach(() => {
      cy.visit('/performance-demo');
    });

    it('should handle debounced validation with enhanced state', () => {
      // Type value quickly
      fillInputByLabel('Search', 'test query');
      
      // Test debounced validation
      performanceHelpers.testDebouncedValidation('Search', 'test query', 300);
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle form performance with enhanced state', () => {
      // Test form performance
      performanceHelpers.testFormPerformance(10);
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle memoization with enhanced state', () => {
      // Test memoization
      performanceHelpers.testMemoization('FormField');
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });
  });

  describe('Type Inference with Enhanced State', () => {
    beforeEach(() => {
      cy.visit('/validation-demo');
    });

    it('should handle auto-inferred validation with enhanced state', () => {
      // Test valid email
      typeInferenceHelpers.testInferredValidation('Email', 'test@example.com', true);
      
      // Test invalid email
      typeInferenceHelpers.testInferredValidation('Email', 'invalid-email', false);
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('error');
    });

    it('should handle cross-field validation with enhanced state', () => {
      // Test matching passwords
      typeInferenceHelpers.testCrossFieldValidation('Password', 'password123', 'Confirm Password', 'password123', true);
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle password confirmation with enhanced state', () => {
      // Test matching passwords
      typeInferenceHelpers.testPasswordConfirmation('password123', 'password123', true);
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });
  });

  describe('Form Builders with Enhanced Features', () => {
    it('should work with BasicFormBuilder and enhanced state', () => {
      cy.visit('/basic-form-demo');
      
      // Fill form
      fillInputByLabel('First Name', 'John');
      fillInputByLabel('Last Name', 'Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Phone', '(123) 456-7890');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should work with AdvancedFormBuilder and enhanced state', () => {
      cy.visit('/advanced-form-demo');
      
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      selectDropdownByLabel('Country', 'United States');
      checkCheckboxByLabel('Subscribe to newsletter');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should work with TypeInferredBuilder and enhanced state', () => {
      cy.visit('/type-inferred-demo');
      
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Age', '25');
      checkCheckboxByLabel('Active');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });
  });

  describe('Complex Enhanced Features Integration', () => {
    it('should handle dynamic forms with performance optimizations', () => {
      cy.visit('/dynamic-form-demo');
      
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears
      dynamicFormHelpers.testConditionalField('User Type', 'premium', 'Premium Features');
      
      // Add field array item
      dynamicFormHelpers.addFieldArrayItem();
      
      // Fill field array item
      fillInputByLabel('Name', 'Item 1');
      fillInputByLabel('Email', 'item1@example.com');
      
      // Set trigger value for dynamic section
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Verify section appears
      dynamicFormHelpers.testDynamicSection('Include Additional Info', 'yes', 'Additional Information');
      
      // Fill section fields
      fillInputByLabel('Additional Notes', 'Some additional notes');
      selectDropdownByLabel('Priority Level', 'High');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle performance optimizations with enhanced state', () => {
      cy.visit('/performance-demo');
      
      // Test debounced validation
      performanceHelpers.testDebouncedValidation('Search', 'test query', 300);
      
      // Test form performance
      performanceHelpers.testFormPerformance(10);
      
      // Test memoization
      performanceHelpers.testMemoization('FormField');
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle type inference with enhanced state', () => {
      cy.visit('/validation-demo');
      
      // Test auto-inferred validation
      typeInferenceHelpers.testInferredValidation('Email', 'test@example.com', true);
      
      // Test cross-field validation
      typeInferenceHelpers.testCrossFieldValidation('Password', 'password123', 'Confirm Password', 'password123', true);
      
      // Test password confirmation
      typeInferenceHelpers.testPasswordConfirmation('password123', 'password123', true);
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });
  });

  describe('Error Handling with Enhanced Features', () => {
    it('should handle network errors with enhanced state', () => {
      // Intercept API call to return error
      cy.intercept('POST', '/api/submit', { statusCode: 500, body: { error: 'Server error' } });
      
      cy.visit('/enhanced-state-demo');
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify enhanced error state
      formSubmissionHelpers.waitForFormStatus('error');
    });

    it('should handle validation errors with enhanced state', () => {
      cy.visit('/enhanced-state-demo');
      
      // Submit form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      submitForm();
      
      // Verify enhanced error state
      formSubmissionHelpers.waitForFormStatus('error');
    });

    it('should handle timeout errors with enhanced state', () => {
      // Intercept API call to timeout
      cy.intercept('POST', '/api/submit', { delay: 10000 });
      
      cy.visit('/enhanced-state-demo');
      
      // Fill and submit form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify enhanced loading state
      formSubmissionHelpers.waitForFormStatus('loading');
    });
  });

  describe('Form State Persistence with Enhanced Features', () => {
    it('should persist form state across page refreshes', () => {
      cy.visit('/enhanced-state-demo');
      
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
      cy.visit('/enhanced-state-demo');
      
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

  describe('Enhanced Features Performance', () => {
    it('should handle rapid state changes efficiently', () => {
      cy.visit('/dynamic-form-demo');
      
      // Rapidly change trigger values
      for (let i = 0; i < 10; i++) {
        fillInputByLabel('User Type', i % 2 === 0 ? 'premium' : 'basic');
        cy.wait(100);
      }
      
      // Verify form is still functional
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle many field array items efficiently', () => {
      cy.visit('/dynamic-form-demo');
      
      // Add many items
      for (let i = 0; i < 10; i++) {
        dynamicFormHelpers.addFieldArrayItem();
      }
      
      // Fill all fields
      for (let i = 1; i <= 10; i++) {
        fillInputByLabel('Name', `Item ${i}`);
        fillInputByLabel('Email', `item${i}@example.com`);
      }
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });

    it('should handle complex form interactions efficiently', () => {
      cy.visit('/enhanced-state-demo');
      
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Rapidly change values
      for (let i = 0; i < 5; i++) {
        fillInputByLabel('Name', `Test ${i}`);
        cy.get('input[name="name"]').clear();
      }
      
      // Fill final values
      fillInputByLabel('Name', 'Final Test');
      fillInputByLabel('Email', 'final@example.com');
      
      // Submit form
      submitForm();
      
      // Verify enhanced form state
      formSubmissionHelpers.waitForFormStatus('success');
    });
  });
});
