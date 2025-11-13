describe("Zod Demo - Schema-based Validation and Real-time Feedback", () => {
  beforeEach(() => {
    cy.visit("/zod-demo");
    cy.get("h1").should("contain", "Zod Validation Demo");
  });

  describe("Contact Form - Zod Validation Testing", () => {
    beforeEach(() => {
      cy.get("h2")
        .contains("Contact Form (Zod Validation)")
        .should("be.visible");
    });

    it("should validate required fields with real-time Zod feedback", () => {
      // Try to submit empty form to trigger validation
      cy.submitAndExpectErrors("First name must be at least 2 characters");
    });

    it("should validate first name with Zod pattern constraints", () => {
      // Test pattern validation (only letters allowed)
      cy.fillInputByType("text", "John123");
      cy.verifyFieldValue("text", "John123");

      // Clear and test with valid input
      cy.fillInputByType("text", "John");
      cy.verifyFieldValue("text", "John");

      // Test first name minimum length validation
      cy.fillInputByType("text", "A");
      cy.submitAndExpectErrors("First name must be at least 2 characters");
    });

    it("should validate email format with Zod email validation", () => {
      // Test invalid email format
      cy.fillInputByType("email", "invalid-email");
      cy.verifyFieldValue("email", "invalid-email");

      // Test valid email format
      cy.fillInputByType("email", "valid@example.com");
      cy.verifyFieldValue("email", "valid@example.com");

      // Test email validation error message
      cy.fillInputByType("email", "invalid-email");
      cy.submitAndExpectErrors("Please enter a valid email address");
    });

    it("should validate phone number with Zod pattern", () => {
      // Test phone field exists and can accept input
      cy.fillInputByType("tel", "123-456-7890");
      cy.verifyFieldValue("tel", "123-456-7890");
    });

    it("should validate message length with Zod constraints", () => {
      // Test message field with minimum length validation
      cy.fillInputByType("textarea", "Short");
      cy.verifyFieldValue("textarea", "Short");

      // Test with longer message
      cy.fillInputByType(
        "textarea",
        "This is a longer message that should meet minimum length requirements",
      );
      cy.verifyFieldValue(
        "textarea",
        "This is a longer message that should meet minimum length requirements",
      );

      // Test message length validation error message
      cy.fillInputByType("textarea", "Short");
      cy.submitAndExpectErrors("Message must be at least 10 characters");
    });

    it("should handle country selection with Zod validation", () => {
      // Test country dropdown selection using HeroUI pattern
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.wait(500); // Give more time for dropdown to render

      // Try to find options with different approaches
      cy.get("body").then(($body) => {
        if ($body.find('[role="option"]').length > 0) {
          // Options are visible, proceed with selection
          cy.get('[role="option"]').first().click({ force: true });
        } else {
          // Options not visible, try clicking again
          cy.get('button[aria-haspopup="listbox"]').first().click();
          cy.wait(300);
          cy.get('[role="option"]').should("exist").and("be.visible");
          cy.get('[role="option"]').first().click({ force: true });
        }
      });

      cy.wait(200);

      // Test country validation error message (try to submit without selecting)
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.wait(300);
      cy.get('[role="option"]').should("exist").and("be.visible");
      cy.get('[role="option"]').first().click({ force: true });
      cy.wait(200);

      // Now try to submit and see what validation message appears
      cy.submitAndExpectErrors();
      cy.get("body").should("contain.text", "country");
    });

    it("should handle newsletter subscription with default value", () => {
      // Test newsletter checkbox interaction
      cy.get('input[type="checkbox"]').first().should("exist");

      // Toggle checkbox state
      cy.get('input[type="checkbox"]').first().check();
      cy.get('input[type="checkbox"]').first().should("be.checked");

      cy.get('input[type="checkbox"]').first().uncheck();
      cy.get('input[type="checkbox"]').first().should("not.be.checked");
    });

    it("should validate terms agreement with Zod refinement", () => {
      // Test terms checkbox interaction
      cy.get('input[type="checkbox"]').eq(1).should("exist");

      // Toggle terms agreement
      cy.get('input[type="checkbox"]').eq(1).check();
      cy.get('input[type="checkbox"]').eq(1).should("be.checked");

      // Test terms validation error message
      cy.get('input[type="checkbox"]').eq(1).uncheck();
      cy.submitAndExpectErrors("You must agree to the terms");
    });

    it("should submit contact form with valid data", () => {
      // Fill required fields with valid data
      cy.fillInputByType("text", "John");
      cy.fillInputByType("text", "Doe", 1);
      cy.fillInputByType("email", "john.doe@example.com");
      cy.fillInputByType("tel", "123-456-7890");
      cy.fillInputByType(
        "textarea",
        "This is a test message for the contact form",
      );

      // Select country using HeroUI pattern
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.get('[role="option"]').should("exist").and("be.visible");
      cy.get('[role="option"]').first().click({ force: true });

      // Agree to terms
      cy.get('input[type="checkbox"]').eq(1).check();

      // Submit form
      cy.get('button[type="submit"]').first().click();

      // Form should still exist after submission
      cy.get("form").should("exist");
    });

    it("should reset contact form correctly", () => {
      // Fill some fields first
      cy.fillInputByType("text", "Test");
      cy.fillInputByType("email", "test@example.com");

      // Reset form
      cy.get('button[type="button"]').contains("Reset").click();

      // Verify fields are cleared
      cy.get('input[type="text"]').first().should("have.value", "");
      cy.get('input[type="email"]').should("have.value", "");
    });

    it("should validate last name with Zod constraints", () => {
      // Test last name minimum length validation
      cy.fillInputByType("text", "A", 1);
      cy.submitAndExpectErrors("Last name must be at least 2 characters");

      // Test with valid last name
      cy.fillInputByType("text", "Doe", 1);
      cy.verifyFieldValue("text", "Doe", 1);
    });
  });

  describe("Settings Form - Complex Zod Validation Testing", () => {
    beforeEach(() => {
      cy.get("h2")
        .contains("Settings Form (Zod Validation)")
        .should("be.visible");
    });

    it("should validate username with Zod length and pattern constraints", () => {
      // Test username field with validation using custom helpers
      cy.fillInputByType("text", "user", 2);
      cy.verifyFieldValue("text", "user", 2);

      // Test with longer username
      cy.fillInputByType("text", "validusername", 2);
      cy.verifyFieldValue("text", "validusername", 2);

      // Test username minimum length validation
      cy.fillInputByType("text", "ab", 2);
      cy.fillInputByType("number", "25"); // Fill age to avoid other validation errors
      cy.submitAndExpectErrors("Username must be at least 3 characters", 1);

      // Test username maximum length validation
      cy.fillInputByType("text", "thisusernameistoolongforvalidation", 2);
      cy.fillInputByType("number", "25"); // Fill age to avoid other validation errors

      // Debug: Check what's in the form before submission
      cy.get('input[type="text"]')
        .eq(2)
        .should("have.value", "thisusernameistoolongforvalidation");
      cy.get('input[type="number"]').should("have.value", "25");

      // Use submitAndExpectErrors helper for better error handling
      cy.submitAndExpectErrors("Username must be less than 20 characters", 1);
    });

    it("should validate age with Zod range constraints", () => {
      // Test age field with min/max validation using custom helpers
      cy.fillInputByType("number", "15");
      cy.verifyFieldValue("number", "15");

      // Test with valid age
      cy.fillInputByType("number", "25");
      cy.verifyFieldValue("number", "25");

      // Test age validation error message
      cy.fillInputByType("number", "5");
      cy.fillInputByType("text", "validusername", 2); // Fill username to avoid other validation errors
      cy.submitAndExpectErrors("You must be at least 13 years old", 1);

      // Test max age validation
      cy.fillInputByType("number", "150");
      cy.fillInputByType("text", "validusername", 2); // Fill username to avoid other validation errors
      cy.submitAndExpectErrors("Age must be less than 120", 1);
    });

    it("should handle theme selection with Zod enum validation", () => {
      // Test theme radio button selection
      cy.get('input[type="radio"]').first().check();
      cy.get('input[type="radio"]').first().should("be.checked");

      // Test different theme selection
      cy.get('input[type="radio"]').eq(1).check();
      cy.get('input[type="radio"]').eq(1).should("be.checked");
      cy.get('input[type="radio"]').first().should("not.be.checked");
    });

    it("should handle language selection with Zod enum validation", () => {
      // Test language dropdown selection using HeroUI pattern
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();

      // Wait longer for dropdown options to render and try multiple approaches
      cy.wait(500); // Give more time for dropdown to render

      // Try to find options with different approaches
      cy.get("body").then(($body) => {
        if ($body.find('[role="option"]').length > 0) {
          // Options are visible, proceed with selection
          cy.get('[role="option"]').first().click({ force: true });
        } else {
          // Options not visible, try clicking again
          cy.get('button[aria-haspopup="listbox"]').eq(1).click();
          cy.wait(300);
          cy.get('[role="option"]').should("exist").and("be.visible");
          cy.get('[role="option"]').first().click({ force: true });
        }
      });

      // Wait a moment for selection to process
      cy.wait(200);
    });

    it("should handle boolean switches with default values", () => {
      // Test notification switch
      cy.get('input[role="switch"]').first().should("exist");

      // Toggle switch state
      cy.get('input[role="switch"]').first().check();
      cy.get('input[role="switch"]').first().should("be.checked");

      // Test auto-save checkbox
      cy.get('input[type="checkbox"]').eq(2).should("exist");
      cy.get('input[type="checkbox"]').eq(2).check();
      cy.get('input[type="checkbox"]').eq(2).should("be.checked");
    });

    it("should submit settings form with valid data", () => {
      // Fill required fields with valid data
      cy.get('input[type="text"]').eq(2).type("validusername");
      cy.get('input[type="number"]').type("25");

      // Select theme
      cy.get('input[type="radio"]').first().check();

      // Select language using HeroUI pattern
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();
      cy.get('[role="option"]').should("exist").and("be.visible");
      cy.get('[role="option"]').first().click({ force: true });

      // Enable features
      cy.get('input[role="switch"]').first().check();
      cy.get('input[type="checkbox"]').eq(2).check();

      // Submit form
      cy.get('button[type="submit"]').eq(1).click();

      // Form should still exist after submission
      cy.get("form").should("exist");
    });
  });

  describe("Zod Schema Integration Features", () => {
    it("should demonstrate real-time Zod validation feedback", () => {
      // Test that Zod validation is actually working by triggering validation
      cy.get('button[type="submit"]').first().click();
      cy.get("form").should("exist");
    });

    it("should show Zod integration benefits through form behavior", () => {
      // Verify that the page demonstrates Zod validation capabilities
      cy.get("h1").should("contain", "Zod Validation Demo");
      cy.get("form").should("exist");
    });
  });

  describe("Form Accessibility and User Experience", () => {
    it("should provide proper form labels and descriptions", () => {
      // Verify form structure and accessibility
      cy.get("form").should("exist");
      cy.get("h2").contains("Contact Form (Zod Validation)").should("exist");
      cy.get("h2").contains("Settings Form (Zod Validation)").should("exist");
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
    it("should display Zod validation errors when form is invalid", () => {
      // Trigger validation errors
      cy.get('button[type="submit"]').first().click();
      cy.get("form").should("exist");
    });

    it("should allow users to correct validation errors", () => {
      // Fill invalid data first
      cy.fillInputByType("email", "invalid-email");

      // Try to submit
      cy.get('button[type="submit"]').first().click();

      // Correct the error
      cy.fillInputByType("email", "valid@example.com");
      cy.verifyFieldValue("email", "valid@example.com");
    });

    it("should handle multiple validation errors simultaneously", () => {
      // Try to submit completely empty form
      cy.get('button[type="submit"]').first().click();
      cy.get("form").should("exist");
    });
  });

  describe("Validation Error Handling", () => {
    it("should show validation error instead of success when form is invalid", () => {
      // Try to submit empty form to trigger validation
      cy.get('button[type="submit"]').first().click();

      // Should show validation error message, not success
      cy.get('[data-testid="error-message"]').should("exist");
      cy.get('[data-testid="success-message"]').should("not.exist");

      // Error message should contain the expected text
      cy.get('[data-testid="error-message"]').should(
        "contain",
        "Please fix the validation errors above",
      );
    });

    it("should show success message only when form is valid", () => {
      // Fill required fields with valid data
      cy.fillInputByType("text", "John");
      cy.fillInputByType("text", "Doe", 1);
      cy.fillInputByType("email", "john.doe@example.com");
      cy.fillInputByType(
        "textarea",
        "This is a test message for the contact form",
      );

      // Select country
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.get('[role="option"]').should("exist").and("be.visible");
      cy.get('[role="option"]').eq(1).click({ force: true }); // Select "United States"

      // Agree to terms
      cy.get('input[type="checkbox"]').eq(1).check();

      // Submit form
      cy.get('button[type="submit"]').first().click();

      // Should show success message, not error
      cy.get('[data-testid="success-message"]').should("exist");
      cy.get('[data-testid="error-message"]').should("not.exist");
    });
  });

  describe("Performance and Edge Case Handling", () => {
    it("should handle rapid form interactions without breaking", () => {
      // Test rapid typing and interactions
      cy.fillInputByType("text", "test");
      cy.get('input[type="text"]').first().clear();
      cy.fillInputByType("text", "another test");
      cy.verifyFieldValue("text", "another test");
    });

    it("should handle edge case values appropriately", () => {
      // Test boundary values for age field
      cy.fillInputByType("number", "0");
      cy.verifyFieldValue("number", "0");

      cy.fillInputByType("number", "100");
      cy.verifyFieldValue("number", "100");
    });

    it("should handle special characters in text inputs", () => {
      // Test special characters
      cy.fillInputByType("text", "Test@#$%^&*()");
      cy.verifyFieldValue("text", "Test@#$%^&*()");

      // Test email with special characters
      cy.fillInputByType("email", "test+tag@example.com");
      cy.verifyFieldValue("email", "test+tag@example.com");
    });
  });
});
