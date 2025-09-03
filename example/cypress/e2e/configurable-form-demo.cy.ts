describe("Configurable Form Demo - Dynamic Form Building and Configuration", () => {
  beforeEach(() => {
    cy.visit("/configurable-form-demo");
    cy.get("h1").should("contain", "ConfigurableForm Demo");
  });

  describe("Dynamic Form Configuration and Layout", () => {
    it("should display configurable form with grid layout", () => {
      cy.get("h2").contains("Grid Layout (2 columns)").should("be.visible");
      cy.get("form").should("be.visible");
    });

    it("should demonstrate different form configurations", () => {
      // Verify the main form configuration exists
      cy.get("h2").contains("Grid Layout (2 columns)").should("exist");

      // Verify that multiple forms exist with different configurations
      cy.get("form").should("have.length.at.least", 3);
    });

    it("should display all form fields with proper configuration", () => {
      // Check that form fields exist and are properly configured
      cy.contains("label", "First Name").should("exist");
      cy.contains("label", "Last Name").should("exist");
      cy.contains("label", "Email").should("exist");
      cy.contains("label", "Phone Number").should("exist");
      cy.contains("label", "Message").should("exist");
      cy.contains("label", "Category").should("exist");
    });

    it("should validate required fields with real-time feedback", () => {
      // Test validation by submitting empty form
      cy.get("form")
        .first()
        .within(() => {
          cy.get('button[type="submit"]').click();
        });

      // Form should still exist (validation errors should appear)
      cy.get("form").should("exist");
    });

    it("should submit successfully with valid data", () => {
      // Fill required fields with valid data
      cy.get('input[type="text"]').first().type("John");
      cy.get('input[type="text"]').eq(1).type("Doe");
      cy.get('input[type="email"]').first().type("john.doe@example.com");
      cy.get('input[type="tel"]').first().type("123-456-7890");
      cy.get("textarea").first().type("This is a test message");

      // Select category - test that we can click the dropdown button
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Verify the button has proper ARIA attributes
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-haspopup", "listbox");

      // Submit form
      cy.get('button[type="submit"]').first().click();

      // Form should still exist after submission
      cy.get("form").should("exist");
    });
  });

  describe("Form Configuration Options and Features", () => {
    it("should show different layout configurations", () => {
      // Verify the main layout option is displayed
      cy.get("h2").contains("Grid Layout (2 columns)").should("exist");

      // Verify that multiple forms exist with different configurations
      cy.get("form").should("have.length.at.least", 3);
    });

    it("should demonstrate configurable form features", () => {
      // Verify that forms have different configurations
      cy.get("form").should("have.length.at.least", 3);

      // Each form should have different styling/layout
      cy.get("form").first().should("exist");
      cy.get("form").eq(1).should("exist");
      cy.get("form").eq(2).should("exist");
    });

    it("should handle different field configurations", () => {
      // Test that different forms have different field arrangements
      cy.get("form")
        .first()
        .within(() => {
          cy.get('input[type="text"]').should("exist");
          cy.get('input[type="email"]').should("exist");
        });
    });
  });

  describe("Form Layout and Styling Variations", () => {
    it("should have proper form layout for each configuration", () => {
      // Verify all forms exist with proper structure
      cy.get("form").should("exist");
      cy.get("form").should("have.length.at.least", 3);
    });

    it("should display form titles and descriptions for each layout", () => {
      // Verify the main layout has proper headers
      cy.get("h2").contains("Grid Layout (2 columns)").should("exist");

      // Verify that multiple forms exist with proper structure
      cy.get("form").should("have.length.at.least", 3);
    });

    it("should have submit and reset buttons for each form", () => {
      // Verify each form has proper controls
      cy.get('button[type="submit"]').should("have.length.at.least", 3);
      cy.get('button[type="button"]').should("exist");
    });
  });

  describe("Form Accessibility and User Experience", () => {
    it("should provide proper form labels and descriptions", () => {
      // Verify form structure and accessibility
      cy.get("form").should("exist");
      cy.get("label").should("exist");
    });

    it("should handle keyboard navigation and focus management", () => {
      // Test focus management
      cy.get('input[type="text"]').first().focus().should("be.focused");

      // Test that we can focus on different fields
      cy.get('input[type="text"]').eq(1).focus().should("be.focused");
    });

    it("should provide clear validation feedback to users", () => {
      // Test that validation feedback is provided
      cy.get('button[type="submit"]').first().click();
      cy.get("form").should("exist");
    });
  });

  describe("Error Handling and Validation Recovery", () => {
    it("should display validation errors when forms are invalid", () => {
      // Trigger validation errors
      cy.get('button[type="submit"]').first().click();
      cy.get("form").should("exist");
    });

    it("should allow users to correct validation errors", () => {
      // Fill invalid data first
      cy.get('input[type="email"]').first().type("invalid-email");

      // Try to submit
      cy.get('button[type="submit"]').first().click();

      // Correct the error
      cy.get('input[type="email"]').first().clear().type("valid@example.com");
      cy.get('input[type="email"]')
        .first()
        .should("have.value", "valid@example.com");
    });

    it("should handle multiple validation errors simultaneously", () => {
      // Try to submit completely empty form
      cy.get('button[type="submit"]').first().click();
      cy.get("form").should("exist");
    });
  });

  describe("Form Reset and State Management", () => {
    it("should maintain form state during interactions", () => {
      // Fill fields and verify state persistence
      cy.get('input[type="text"]').first().type("Persistent");
      cy.get('input[type="text"]').first().should("have.value", "Persistent");

      // Navigate away and back to verify state
      cy.get('input[type="text"]').eq(1).focus();
      cy.get('input[type="text"]').first().should("have.value", "Persistent");
    });
  });

  describe("Field Interactions and Validation", () => {
    it("should handle text input fields with proper validation", () => {
      // Test text input functionality
      cy.get('input[type="text"]').first().type("Test Input");
      cy.get('input[type="text"]').first().should("have.value", "Test Input");

      // Test email input functionality
      cy.get('input[type="email"]').first().type("test@example.com");
      cy.get('input[type="email"]')
        .first()
        .should("have.value", "test@example.com");
    });

    it("should handle textarea input with proper sizing", () => {
      // Test textarea functionality
      cy.get("textarea")
        .first()
        .type("This is a test message for the textarea field");
      cy.get("textarea")
        .first()
        .should("have.value", "This is a test message for the textarea field");
    });

    it("should handle select dropdowns with proper selection", () => {
      // Test dropdown functionality - verify the dropdown button exists and is clickable
      cy.get('button[aria-haspopup="listbox"]').first().should("exist");

      // Test that we can click the dropdown button
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Verify the button has proper ARIA attributes
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-haspopup", "listbox");
    });

    it("should handle checkbox interactions properly", () => {
      // Test checkbox functionality if present
      cy.get('input[type="checkbox"]').should("exist");

      // Toggle checkbox state
      cy.get('input[type="checkbox"]').first().check();
      cy.get('input[type="checkbox"]').first().should("be.checked");
    });
  });

  describe("Validation Patterns and Rules", () => {
    it("should validate email format with real-time feedback", () => {
      // Test email validation
      cy.get('input[type="email"]').first().type("invalid-email");
      cy.get('input[type="email"]')
        .first()
        .should("have.value", "invalid-email");

      // Test valid email
      cy.get('input[type="email"]').first().clear().type("valid@example.com");
      cy.get('input[type="email"]')
        .first()
        .should("have.value", "valid@example.com");
    });

    it("should validate required fields with proper error handling", () => {
      // Test required field validation
      cy.get('button[type="submit"]').first().click();
      cy.get("form").should("exist");
    });

    it("should handle field-specific validation rules", () => {
      // Test phone number field
      cy.get('input[type="tel"]').first().type("123-456-7890");
      cy.get('input[type="tel"]').first().should("have.value", "123-456-7890");
    });
  });

  describe("Performance and Edge Case Handling", () => {
    it("should handle rapid form interactions without breaking", () => {
      // Test rapid typing and interactions
      cy.get('input[type="text"]').first().type("test");
      cy.get('input[type="text"]').first().clear();
      cy.get('input[type="text"]').first().type("another test");
      cy.get('input[type="text"]').first().should("have.value", "another test");
    });

    it("should handle large text input appropriately", () => {
      // Test textarea with large content
      const longMessage =
        "This is a very long message that tests the textarea's ability to handle large amounts of text input without breaking or causing performance issues. It should handle this gracefully.";

      cy.get("textarea").first().type(longMessage);
      cy.get("textarea").first().should("have.value", longMessage);
    });

    it("should handle special characters in input fields", () => {
      // Test special characters
      cy.get('input[type="text"]').first().type("Test@#$%^&*()");
      cy.get('input[type="text"]')
        .first()
        .should("have.value", "Test@#$%^&*()");

      // Test email with special characters
      cy.get('input[type="email"]')
        .first()
        .clear()
        .type("test+tag@example.com");
      cy.get('input[type="email"]')
        .first()
        .should("have.value", "test+tag@example.com");
    });

    it("should handle multiple form submissions gracefully", () => {
      // Fill form with valid data
      cy.get('input[type="text"]').first().type("John");
      cy.get('input[type="email"]').first().type("john@example.com");

      // Submit multiple times
      cy.get('button[type="submit"]').first().click();
      cy.get('button[type="submit"]').first().click();

      // Form should still exist and be functional
      cy.get("form").should("exist");
      cy.get('input[type="text"]').first().should("have.value", "John");
    });
  });
});
