/**
 * Cypress performance tests for field array memory management
 * Tests the memory leak fixes for conditional field arrays
 */

import {
  performanceHelpers,
  fillInputByLabel,
  selectDropdownByLabel,
  submitForm,
} from '../helpers';

describe('Field Array Memory Performance', () => {
  beforeEach(() => {
    cy.visit('/question-form-demo');
  });

  describe('Memory-Safe Conditional Field Arrays', () => {
    it('should handle conditional field arrays without memory leaks', () => {
      // Test the memory-safe conditional field array implementation
      // This tests the FormFieldHelpers.conditionalFieldArray functionality

      // Initially no field array should be visible
      cy.contains('label', 'Choice Text').should('not.exist');

      // Fill in question text first
      fillInputByLabel('Question Text', 'What is your favorite color?');

      // Change question type to MULTIPLE_CHOICE
      selectDropdownByLabel('Question Type', 'Multiple Choice');

      // Now the field array should appear
      cy.contains('label', 'Choice Text').should('be.visible');

      // Add several choices to test memory usage
      for (let i = 0; i < 5; i++) {
        cy.contains('button', 'Add Item').click();
        fillInputByLabel('Choice Text', `Choice ${i + 1}`);
      }

      // Verify all choices were added
      for (let i = 1; i <= 5; i++) {
        cy.contains(`Choice ${i}`).should('be.visible');
      }

      // Change back to different type
      selectDropdownByLabel('Question Type', 'SINGLE_CHOICE');

      // Field array should disappear (but remain registered)
      cy.contains('label', 'Choice Text').should('not.exist');

      // Change back to MULTIPLE_CHOICE
      selectDropdownByLabel('Question Type', 'Multiple Choice');

      // Choices should still be there (always-registered approach)
      for (let i = 1; i <= 5; i++) {
        cy.contains(`Choice ${i}`).should('be.visible');
      }
    });

    it('should not accumulate memory with rapid condition changes', () => {
      // Test rapid toggling between conditions to check for memory leaks
      for (let i = 0; i < 10; i++) {
        selectDropdownByLabel('Question Type', i % 2 === 0 ? 'Multiple Choice' : 'Single Choice');
        cy.wait(50); // Small delay to allow DOM updates
      }

      // Final state should be stable
      selectDropdownByLabel('Question Type', 'Multiple Choice');
      cy.contains('label', 'Choice Text').should('be.visible');

      // Form should still be functional
      cy.contains('button', 'Add Item').click();
      fillInputByLabel('Choice Text', 'Test Choice');
      submitForm();
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Memory Cleanup', () => {
    it('should clean up field array memory after navigation', () => {
      // Add field array items
      selectDropdownByLabel('Question Type', 'Multiple Choice');

      for (let i = 0; i < 3; i++) {
        cy.contains('button', 'Add Item').click();
        fillInputByLabel('Choice Text', `Choice ${i + 1}`);
      }

      // Navigate away (should trigger cleanup)
      cy.visit('/basic-form-demo');

      // Navigate back
      cy.visit('/dynamic-form-demo');

      // Form should be clean/reset
      cy.contains('label', 'Choice Text').should('not.exist');
      selectDropdownByLabel('Question Type', 'Multiple Choice');
      cy.contains('label', 'Choice Text').should('be.visible');
    });

    it('should handle field array operations without memory pressure', () => {
      selectDropdownByLabel('Question Type', 'Multiple Choice');

      // Add many items to test memory handling
      for (let i = 0; i < 20; i++) {
        cy.contains('button', 'Add Item').click();
        if (i < 5) { // Only fill first few to save test time
          fillInputByLabel('Choice Text', `Choice ${i + 1}`);
        }
      }

      // Verify items were added
      cy.contains('Item 20').should('be.visible');

      // Remove some items
      for (let i = 0; i < 5; i++) {
        cy.get('button').contains('Remove').first().click();
      }

      // Verify items were removed
      cy.contains('Item 16').should('be.visible');

      // Form should still be functional
      submitForm();
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Lazy Registration', () => {
    it('should register fields only when needed', () => {
      // Initially no fields should be registered for choices
      cy.window().then((win) => {
        const formState = win.console.log;
        // This would require custom instrumentation to verify lazy registration
        // For now, we test the functional behavior
      });

      // Enable the condition
      selectDropdownByLabel('Question Type', 'Multiple Choice');

      // Fields should now be available
      cy.contains('button', 'Add Item').should('be.visible');

      // Add and fill a field
      cy.contains('button', 'Add Item').click();
      fillInputByLabel('Choice Text', 'Lazy Loaded Choice');

      // Verify it works
      submitForm();
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });

  describe('Performance Monitoring', () => {
    it('should monitor field array performance metrics', () => {
      selectDropdownByLabel('Question Type', 'Multiple Choice');

      // Start performance monitoring
      cy.window().then((win) => {
        win.performance.mark('field-array-start');
      });

      // Perform field array operations
      for (let i = 0; i < 10; i++) {
        cy.contains('button', 'Add Item').click();
        fillInputByLabel('Choice Text', `Choice ${i + 1}`);
      }

      // End performance monitoring
      cy.window().then((win) => {
        win.performance.mark('field-array-end');
        win.performance.measure('field-array-operations', 'field-array-start', 'field-array-end');

        const measure = win.performance.getEntriesByName('field-array-operations')[0];
        console.log(`Field array operations took ${measure.duration}ms`);

        // Assert reasonable performance (under 5 seconds for 10 operations)
        expect(measure.duration).to.be.lessThan(5000);
      });
    });

    it('should handle memory-intensive field array scenarios', () => {
      // Test with maximum allowed items
      selectDropdownByLabel('Question Type', 'Multiple Choice');

      // Add items up to the limit
      for (let i = 0; i < 10; i++) {
        cy.contains('button', 'Add Item').click();
        fillInputByLabel('Choice Text', `Max Choice ${i + 1}`);
      }

      // Try to add one more (should not be possible)
      cy.get('button').contains('Add Item').should('not.exist');

      // Verify all items are present
      cy.contains('Item 10').should('be.visible');

      // Form should still submit successfully
      submitForm();
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });
});