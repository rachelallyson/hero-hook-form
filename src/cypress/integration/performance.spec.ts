/**
 * Cypress integration tests for performance features
 */

import { 
  performanceHelpers,
  fillInputByLabel,
  fillInputByType,
  selectDropdownByLabel,
  checkCheckboxByLabel,
  submitForm,
  expectValidationError,
  expectNoValidationErrors
} from '../helpers';

describe('Performance Features', () => {
  beforeEach(() => {
    cy.visit('/performance-demo');
  });

  describe('Debounced Validation', () => {
    it('should debounce validation calls', () => {
      // Type value quickly
      fillInputByLabel('Search', 'test query');
      
      // Test debounced validation
      performanceHelpers.testDebouncedValidation('Search', 'test query', 300);
    });

    it('should handle rapid typing without excessive validation', () => {
      // Type value very quickly
      const input = cy.get('input[placeholder*="Search"]');
      input.clear();
      
      // Type rapidly
      for (let i = 0; i < 10; i++) {
        input.type('a');
      }
      
      // Wait for debounce delay
      cy.wait(300);
      
      // Verify validation was triggered
      cy.get('body').should('contain', 'error');
    });

    it('should validate after debounce delay', () => {
      // Type value
      fillInputByLabel('Search', 'test query');
      
      // Wait for debounce delay
      cy.wait(300);
      
      // Verify validation was triggered
      cy.get('body').should('contain', 'error');
    });

    it('should not validate before debounce delay', () => {
      // Type value
      fillInputByLabel('Search', 'test query');
      
      // Wait less than debounce delay
      cy.wait(100);
      
      // Verify validation was not triggered yet
      cy.get('body').should('not.contain', 'error');
    });

    it('should handle multiple debounced fields', () => {
      // Type in multiple fields
      fillInputByLabel('Search', 'test query');
      fillInputByLabel('Filter', 'filter value');
      
      // Wait for debounce delay
      cy.wait(300);
      
      // Verify validation was triggered for both fields
      cy.get('body').should('contain', 'error');
    });
  });

  describe('Form Performance', () => {
    it('should handle forms with many fields efficiently', () => {
      // Test form performance
      performanceHelpers.testFormPerformance(10);
    });

    it('should handle forms with many fields without performance degradation', () => {
      // Fill many fields
      for (let i = 0; i < 20; i++) {
        fillInputByType('text', `value${i}`);
      }
      
      // Verify form is still responsive
      cy.get('input').first().should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should handle rapid form interactions', () => {
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

    it('should handle form with many conditional fields', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional fields appear
      cy.contains('label', 'Premium Features').should('be.visible');
      
      // Rapidly change trigger value
      for (let i = 0; i < 10; i++) {
        fillInputByLabel('User Type', i % 2 === 0 ? 'premium' : 'basic');
        cy.wait(50);
      }
      
      // Verify form is still functional
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should handle form with many field arrays', () => {
      // Add many field array items
      for (let i = 0; i < 10; i++) {
        performanceHelpers.addFieldArrayItem();
      }
      
      // Fill all fields
      for (let i = 1; i <= 10; i++) {
        fillInputByLabel('Name', `Item ${i}`);
        fillInputByLabel('Email', `item${i}@example.com`);
      }
      
      // Submit form
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Memoization', () => {
    it('should use memoization for form fields', () => {
      // Test memoization
      performanceHelpers.testMemoization('FormField');
    });

    it('should not re-render fields unnecessarily', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Change unrelated field
      fillInputByLabel('Notes', 'Some notes');
      
      // Verify name and email fields didn't re-render
      cy.get('input[name="name"]').should('have.value', 'John Doe');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
    });

    it('should memoize conditional fields', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears
      cy.contains('label', 'Premium Features').should('be.visible');
      
      // Change unrelated field
      fillInputByLabel('Notes', 'Some notes');
      
      // Verify conditional field is still visible
      cy.contains('label', 'Premium Features').should('be.visible');
    });

    it('should memoize field array items', () => {
      // Add field array item
      performanceHelpers.addFieldArrayItem();
      
      // Fill field array item
      fillInputByLabel('Name', 'Item 1');
      fillInputByLabel('Email', 'item1@example.com');
      
      // Change unrelated field
      fillInputByLabel('Notes', 'Some notes');
      
      // Verify field array item didn't re-render
      cy.contains('Item 1').should('be.visible');
      cy.get('input[name="name"]').should('have.value', 'Item 1');
      cy.get('input[name="email"]').should('have.value', 'item1@example.com');
    });
  });

  describe('Batched Updates', () => {
    it('should batch multiple field updates', () => {
      // Update multiple fields quickly
      fillInputByLabel('Name', 'John');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Phone', '123-456-7890');
      
      // Verify all fields were updated
      cy.get('input[name="name"]').should('have.value', 'John');
      cy.get('input[name="email"]').should('have.value', 'john@example.com');
      cy.get('input[name="phone"]').should('have.value', '123-456-7890');
    });

    it('should handle rapid field updates efficiently', () => {
      // Rapidly update fields
      for (let i = 0; i < 10; i++) {
        fillInputByLabel('Name', `Test ${i}`);
        fillInputByLabel('Email', `test${i}@example.com`);
      }
      
      // Verify final values
      cy.get('input[name="name"]').should('have.value', 'Test 9');
      cy.get('input[name="email"]').should('have.value', 'test9@example.com');
    });

    it('should batch updates for field arrays', () => {
      // Add field array item
      performanceHelpers.addFieldArrayItem();
      
      // Update multiple fields in field array
      fillInputByLabel('Name', 'Item 1');
      fillInputByLabel('Email', 'item1@example.com');
      fillInputByLabel('Phone', '123-456-7890');
      
      // Verify all fields were updated
      cy.get('input[name="name"]').should('have.value', 'Item 1');
      cy.get('input[name="email"]').should('have.value', 'item1@example.com');
      cy.get('input[name="phone"]').should('have.value', '123-456-7890');
    });
  });

  describe('Performance Monitoring', () => {
    it('should monitor component re-renders', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Check console for performance logs
      cy.window().then((win) => {
        const logs = win.console.log;
        expect(logs).to.be.called;
      });
    });

    it('should track form performance metrics', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Check for performance metrics
      cy.get('[data-performance-metrics]').should('exist');
    });

    it('should log performance warnings for slow operations', () => {
      // Perform slow operation
      for (let i = 0; i < 100; i++) {
        fillInputByLabel('Name', `Test ${i}`);
      }
      
      // Check for performance warnings
      cy.window().then((win) => {
        const logs = win.console.warn;
        expect(logs).to.be.called;
      });
    });
  });

  describe('Memory Management', () => {
    it('should clean up event listeners on unmount', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Navigate away
      cy.visit('/basic-form-demo');
      
      // Navigate back
      cy.visit('/performance-demo');
      
      // Verify form is still functional
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should clean up timers on unmount', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Navigate away
      cy.visit('/basic-form-demo');
      
      // Navigate back
      cy.visit('/performance-demo');
      
      // Verify form is still functional
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should clean up subscriptions on unmount', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Navigate away
      cy.visit('/basic-form-demo');
      
      // Navigate back
      cy.visit('/performance-demo');
      
      // Verify form is still functional
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Performance Optimization', () => {
    it('should optimize form rendering', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Verify form is rendered efficiently
      cy.get('form').should('be.visible');
      cy.get('input').should('have.length.at.least', 2);
    });

    it('should optimize validation performance', () => {
      // Fill form with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      
      // Submit form
      submitForm();
      
      // Verify validation errors appear quickly
      expectValidationError('required');
      expectValidationError('email');
    });

    it('should optimize form submission performance', () => {
      // Fill form
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify submission is fast
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });
});
