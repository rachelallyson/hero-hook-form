/**
 * Cypress integration tests for dynamic form features
 */

import { 
  dynamicFormHelpers,
  fillInputByLabel,
  fillInputByType,
  selectDropdownByLabel,
  checkCheckboxByLabel,
  submitForm,
  expectValidationError,
  expectNoValidationErrors
} from '../helpers';

describe('Dynamic Forms', () => {
  beforeEach(() => {
    cy.visit('/dynamic-form-demo');
  });

  describe('Conditional Fields', () => {
    it('should show conditional field when condition is met', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears
      cy.contains('label', 'Premium Features').should('be.visible');
      cy.contains('label', 'Advanced Settings').should('be.visible');
    });

    it('should hide conditional field when condition is not met', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'basic');
      
      // Verify conditional field is hidden
      cy.contains('label', 'Premium Features').should('not.exist');
      cy.contains('label', 'Advanced Settings').should('not.exist');
    });

    it('should update conditional field when trigger changes', () => {
      // Initially set to basic
      fillInputByLabel('User Type', 'basic');
      cy.contains('label', 'Premium Features').should('not.exist');
      
      // Change to premium
      fillInputByLabel('User Type', 'premium');
      cy.contains('label', 'Premium Features').should('be.visible');
      
      // Change back to basic
      fillInputByLabel('User Type', 'basic');
      cy.contains('label', 'Premium Features').should('not.exist');
    });

    it('should validate conditional fields when visible', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Fill conditional field
      fillInputByLabel('Premium Features', 'Advanced features enabled');
      
      // Submit form
      submitForm();
      
      // Verify no validation errors
      expectNoValidationErrors();
    });

    it('should not validate hidden conditional fields', () => {
      // Set trigger value to hide conditional field
      fillInputByLabel('User Type', 'basic');
      
      // Submit form
      submitForm();
      
      // Verify no validation errors for hidden fields
      expectNoValidationErrors();
    });
  });

  describe('Field Arrays', () => {
    it('should add new field array item', () => {
      // Add item
      dynamicFormHelpers.addFieldArrayItem();
      
      // Verify item was added
      cy.contains('Item 1').should('be.visible');
      cy.contains('label', 'Name').should('be.visible');
      cy.contains('label', 'Email').should('be.visible');
    });

    it('should remove field array item', () => {
      // Add item first
      dynamicFormHelpers.addFieldArrayItem();
      cy.contains('Item 1').should('be.visible');
      
      // Remove item
      dynamicFormHelpers.removeFieldArrayItem(0);
      
      // Verify item was removed
      cy.contains('Item 1').should('not.exist');
    });

    it('should add multiple items', () => {
      // Add multiple items
      dynamicFormHelpers.addFieldArrayItem();
      dynamicFormHelpers.addFieldArrayItem();
      dynamicFormHelpers.addFieldArrayItem();
      
      // Verify all items were added
      cy.contains('Item 1').should('be.visible');
      cy.contains('Item 2').should('be.visible');
      cy.contains('Item 3').should('be.visible');
    });

    it('should respect minimum limit', () => {
      // Should not be able to remove when at minimum
      cy.get('button').contains('Remove').should('not.exist');
    });

    it('should respect maximum limit', () => {
      // Add items up to maximum
      for (let i = 0; i < 5; i++) {
        dynamicFormHelpers.addFieldArrayItem();
      }
      
      // Should not be able to add more
      cy.get('button').contains('Add Item').should('not.exist');
    });

    it('should fill and validate field array items', () => {
      // Add item
      dynamicFormHelpers.addFieldArrayItem();
      
      // Fill fields
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      
      // Submit form
      submitForm();
      
      // Verify no validation errors
      expectNoValidationErrors();
    });

    it('should show validation errors for field array items', () => {
      // Add item
      dynamicFormHelpers.addFieldArrayItem();
      
      // Fill with invalid data
      fillInputByLabel('Name', '');
      fillInputByLabel('Email', 'invalid-email');
      
      // Submit form
      submitForm();
      
      // Verify validation errors
      expectValidationError('required');
      expectValidationError('email');
    });
  });

  describe('Dynamic Sections', () => {
    it('should show dynamic section when condition is met', () => {
      // Set trigger value
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Verify section appears
      cy.contains('Additional Information').should('be.visible');
      cy.contains('label', 'Additional Notes').should('be.visible');
      cy.contains('label', 'Priority Level').should('be.visible');
    });

    it('should hide dynamic section when condition is not met', () => {
      // Set trigger value
      fillInputByLabel('Include Additional Info', 'no');
      
      // Verify section is hidden
      cy.contains('Additional Information').should('not.exist');
      cy.contains('label', 'Additional Notes').should('not.exist');
      cy.contains('label', 'Priority Level').should('not.exist');
    });

    it('should update dynamic section when trigger changes', () => {
      // Initially set to no
      fillInputByLabel('Include Additional Info', 'no');
      cy.contains('Additional Information').should('not.exist');
      
      // Change to yes
      fillInputByLabel('Include Additional Info', 'yes');
      cy.contains('Additional Information').should('be.visible');
      
      // Change back to no
      fillInputByLabel('Include Additional Info', 'no');
      cy.contains('Additional Information').should('not.exist');
    });

    it('should validate dynamic section fields when visible', () => {
      // Set trigger value
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Fill section fields
      fillInputByLabel('Additional Notes', 'Some additional notes');
      selectDropdownByLabel('Priority Level', 'High');
      
      // Submit form
      submitForm();
      
      // Verify no validation errors
      expectNoValidationErrors();
    });

    it('should not validate hidden dynamic section fields', () => {
      // Set trigger value to hide section
      fillInputByLabel('Include Additional Info', 'no');
      
      // Submit form
      submitForm();
      
      // Verify no validation errors for hidden fields
      expectNoValidationErrors();
    });
  });

  describe('Complex Dynamic Forms', () => {
    it('should handle multiple conditional fields', () => {
      // Set multiple trigger values
      fillInputByLabel('User Type', 'premium');
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Verify all conditional elements appear
      cy.contains('label', 'Premium Features').should('be.visible');
      cy.contains('label', 'Advanced Settings').should('be.visible');
      cy.contains('Additional Information').should('be.visible');
    });

    it('should handle nested conditions', () => {
      // Set trigger value
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears
      cy.contains('label', 'Premium Features').should('be.visible');
      
      // Set nested condition
      fillInputByLabel('Premium Features', 'advanced');
      
      // Verify nested conditional field appears
      cy.contains('label', 'Advanced Settings').should('be.visible');
    });

    it('should handle field arrays with conditional fields', () => {
      // Add field array item
      dynamicFormHelpers.addFieldArrayItem();
      
      // Set trigger value for conditional field
      fillInputByLabel('User Type', 'premium');
      
      // Verify conditional field appears in field array
      cy.contains('label', 'Premium Features').should('be.visible');
    });

    it('should handle dynamic sections with field arrays', () => {
      // Set trigger value
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Add field array item in dynamic section
      dynamicFormHelpers.addFieldArrayItem();
      
      // Verify field array item appears in dynamic section
      cy.contains('Item 1').should('be.visible');
    });

    it('should validate complex dynamic form', () => {
      // Set trigger values
      fillInputByLabel('User Type', 'premium');
      fillInputByLabel('Include Additional Info', 'yes');
      
      // Add field array item
      dynamicFormHelpers.addFieldArrayItem();
      
      // Fill all fields
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      fillInputByLabel('Premium Features', 'Advanced features enabled');
      fillInputByLabel('Additional Notes', 'Some additional notes');
      selectDropdownByLabel('Priority Level', 'High');
      
      // Submit form
      submitForm();
      
      // Verify no validation errors
      expectNoValidationErrors();
    });
  });

  describe('Performance with Dynamic Forms', () => {
    it('should handle rapid state changes', () => {
      // Rapidly change trigger values
      for (let i = 0; i < 10; i++) {
        fillInputByLabel('User Type', i % 2 === 0 ? 'premium' : 'basic');
        cy.wait(100);
      }
      
      // Verify form is still functional
      fillInputByLabel('Name', 'John Doe');
      fillInputByLabel('Email', 'john@example.com');
      submitForm();
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });

    it('should handle many field array items', () => {
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
      
      // Verify success
      cy.contains('Form submitted successfully!').should('be.visible');
    });
  });
});
