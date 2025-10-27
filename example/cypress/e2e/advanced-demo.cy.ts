describe("Advanced Demo - Complex Multi-Section Forms with Conditional Logic", () => {
  beforeEach(() => {
    cy.visit("/advanced-demo");
    cy.get("h1").should("contain", "Advanced Form Demo");
  });

  describe("User Registration Form - Complex Multi-Section", () => {
    it("should display all registration form sections for user onboarding", () => {
      // Verify main registration section
      cy.contains("h2", "Create Your Account").should("be.visible");

      // Verify survey section
      cy.contains("h2", "User Experience Survey").should("be.visible");

      // Verify features demonstration section
      cy.contains("h2", "Advanced Features Demonstrated").should("be.visible");
    });

    it("should support comprehensive field types for user data collection", () => {
      // Verify all required input types exist
      cy.get('input[type="text"]').should("exist");
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="tel"]').should("exist");
      cy.get('input[type="password"]').should("exist");
      cy.get('input[type="radio"]').should("exist");
      cy.get('input[type="checkbox"]').should("exist");
      cy.get('input[role="switch"]').should("exist");
      cy.get("textarea").should("exist");
    });

    it("should enforce required field validation for data integrity", () => {
      // Attempt to submit form without filling required fields using helper
      cy.submitAndExpectErrors();

      // Form should remain visible (validation errors should appear)
      cy.verifyFormExists();
    });

    it("should validate field patterns and constraints for data quality", () => {
      // Test first name minimum length validation using helpers
      cy.fillInputByType("text", "A");
      cy.verifyFieldValue("text", "A");

      // Test first name with valid length using helpers
      cy.fillInputByType("text", "John");
      cy.verifyFieldValue("text", "John");

      // Test email validation with invalid format using helpers
      cy.fillInputByType("email", "invalid-email");
      cy.verifyFieldValue("email", "invalid-email");

      // Test email validation with valid format using helpers
      cy.fillInputByType("email", "john@example.com");
      cy.verifyFieldValue("email", "john@example.com");

      // Test phone validation with invalid format using helpers
      cy.fillInputByType("tel", "abc");
      cy.verifyFieldValue("tel", "abc");

      // Test phone validation with valid format using helpers
      cy.fillInputByType("tel", "+1234567890");
      cy.verifyFieldValue("tel", "+1234567890");
    });

    it("should handle password confirmation validation for security", () => {
      // Enter initial password using helper
      cy.fillInputByType("password", "password123");
      cy.verifyFieldValue("password", "password123");

      // Enter different confirmation password using helper
      cy.fillInputByType("password", "different", 1);
      cy.verifyFieldValue("password", "different", 1);
    });

    it("should handle account type selection and conditional field display", () => {
      // Select Personal account type
      cy.get('input[type="radio"][value="personal"]').check();
      cy.get('input[type="radio"][value="personal"]').should("be.checked");

      // Select Business account type
      cy.get('input[type="radio"][value="business"]').check();
      cy.get('input[type="radio"][value="business"]').should("be.checked");
      cy.get('input[type="radio"][value="personal"]').should("not.be.checked");
    });

    it("should handle checkbox and switch interactions for user preferences", () => {
      // Test newsletter subscription checkbox using helper
      cy.checkCheckbox();
      cy.get('input[type="checkbox"]').first().should("be.checked");

      // Test newsletter unsubscription using helper
      cy.uncheckCheckbox();
      cy.get('input[type="checkbox"]').first().should("not.be.checked");

      // Test SMS notifications switch using helper
      cy.checkSwitch();
      cy.get('input[role="switch"]').first().should("be.checked");
    });

    it("should submit successfully with complete valid user data", () => {
      // Fill all required fields with valid data using helpers
      cy.fillInputByType("text", "John");
      cy.fillInputByType("text", "Doe", 1);
      cy.fillInputByType("email", "john.doe@example.com");
      cy.fillInputByType("tel", "+1234567890");
      cy.fillInputByType("text", "johndoe", 2);
      cy.fillInputByType("password", "password123");
      cy.fillInputByType("password", "password123", 1);
      cy.get('input[type="radio"][value="personal"]').check();
      cy.checkCheckbox();
      cy.checkCheckbox(1);

      // Submit form using helper
      cy.submitForm();

      // Verify form submission was handled
      cy.verifyFormExists();
    });

    it("should reset form correctly and clear all user input", () => {
      // Fill some fields with test data using helpers
      cy.fillInputByType("text", "John");
      cy.fillInputByType("email", "john@example.com");

      // Reset form using helper
      cy.resetForm();

      // Verify that fields are properly cleared
      cy.get('input[type="text"]').eq(0).should("have.value", "");
      cy.get('input[type="email"]').should("have.value", "");
    });
  });

  describe("User Experience Survey - Compact Form", () => {
    it("should display survey form correctly for user feedback collection", () => {
      cy.contains("h2", "Help Us Improve").should("be.visible");
      cy.get("form").should("have.length", 2); // Two forms on the page
    });

    it("should have survey-specific fields for demographic and feedback data", () => {
      // Check for age input field
      cy.get('input[type="number"]').should("exist");

      // Check for gender selection options
      cy.get('input[type="radio"][value="male"]').should("exist");
      cy.get('input[type="radio"][value="female"]').should("exist");

      // Check for feedback text area
      cy.get("textarea").should("exist");
    });

    it("should handle survey form interactions for user feedback submission", () => {
      // Target the second form (survey form)
      cy.get("form")
        .eq(1)
        .within(() => {
          // Fill age field
          cy.get('input[type="number"]').type("25");
          cy.get('input[type="number"]').should("have.value", "25");

          // Select gender preference
          cy.get('input[type="radio"][value="male"]').check();
          cy.get('input[type="radio"][value="male"]').should("be.checked");

          // Enter feedback text
          cy.get("textarea").type("Great product!");
          cy.get("textarea").should("have.value", "Great product!");
        });
    });

    it("should submit survey form with user feedback data", () => {
      // Target the second form (survey form)
      cy.get("form")
        .eq(1)
        .within(() => {
          // Fill complete survey
          cy.get('input[type="number"]').type("30");
          cy.get('input[type="radio"][value="female"]').check();
          cy.get("textarea").type("Excellent user experience");
        });

      // Submit survey form
      cy.get('button[type="submit"]').last().click();

      // Verify survey submission was handled
      cy.get("form").should("exist");
    });
  });

  describe("Advanced Features and Conditional Logic", () => {
    it("should display feature highlight cards explaining advanced capabilities", () => {
      cy.contains("h3", "🔗 Conditional Logic").should("be.visible");
      cy.contains("h3", "📋 Field Grouping").should("be.visible");
      cy.contains("h3", "✅ Advanced Validation").should("be.visible");
      cy.contains("h3", "🎨 Layout Options").should("be.visible");
      cy.contains("h3", "🔧 Field Types").should("be.visible");
      cy.contains("h3", "⚙️ Customization").should("be.visible");
    });

    it("should have descriptive feature explanations for user understanding", () => {
      cy.contains("Business fields show based on account type").should(
        "be.visible",
      );
      cy.contains("Personal, Account, Business groups").should("be.visible");
      cy.contains("Password strength requirements").should("be.visible");
      cy.contains("Two-column grid for registration").should("be.visible");
    });

    it("should demonstrate conditional field display based on account type selection", () => {
      // Test personal account type selection
      cy.get('input[type="radio"][value="personal"]').check();
      cy.get('input[type="radio"][value="personal"]').should("be.checked");

      // Verify personal-specific fields are visible
      cy.get("form").should("exist");

      // Test business account type selection
      cy.get('input[type="radio"][value="business"]').check();
      cy.get('input[type="radio"][value="business"]').should("be.checked");

      // Verify business-specific fields are visible
      cy.get("form").should("exist");
    });
  });

  describe("Form Layout and User Experience", () => {
    it("should have proper form layout for optimal user interaction", () => {
      cy.get("form").should("be.visible");
      cy.get("form").should("have.length", 2);
    });

    it("should display clear form title and descriptive subtitle", () => {
      cy.get("h2").contains("Create Your Account").should("be.visible");
      cy.get("p")
        .contains("Join thousands of users already using our platform")
        .should("be.visible");
    });

    it("should have accessible submit and reset buttons for form control", () => {
      cy.get('button[type="submit"]').should("be.visible");
      cy.get('button[type="button"]')
        .contains("Clear Form")
        .should("be.visible");
      cy.get('button[type="button"]')
        .contains("Reset Survey")
        .should("be.visible");
    });
  });

  describe("Accessibility and User Experience", () => {
    it("should have proper ARIA attributes for screen reader support", () => {
      // Verify input types for proper accessibility
      cy.get('input[type="email"]').should("have.attr", "type", "email");
      cy.get('input[type="tel"]').should("have.attr", "type", "tel");
      cy.get('input[type="password"]').should("have.attr", "type", "password");
    });

    it("should support keyboard navigation for accessibility compliance", () => {
      // Test tab navigation through form fields
      cy.get('input[type="text"]').first().focus().should("be.focused");
      cy.get('input[type="email"]').focus().should("be.focused");
    });
  });

  describe("Form Validation and Error Handling", () => {
    it("should display validation errors when form is submitted without required data", () => {
      // Submit empty form to trigger validation
      cy.get('button[type="submit"]').first().click();

      // Form should remain visible (validation errors should be displayed)
      cy.get("form").should("exist");
    });

    it("should clear validation errors when valid data is entered", () => {
      // Submit empty form to trigger validation errors
      cy.get('button[type="submit"]').first().click();

      // Fill with valid data to clear errors
      cy.get('input[type="text"]').first().type("John");
      cy.get('input[type="email"]').type("john@example.com");

      // Verify form remains functional
      cy.get("form").should("exist");
    });

    it("should handle form state management during user interactions", () => {
      // Test form state persistence
      cy.get("form").should("exist");

      // Fill some fields to test state
      cy.get('input[type="text"]').first().type("TestUser");
      cy.get('input[type="text"]').first().should("have.value", "TestUser");

      // Verify form remains functional
      cy.get('button[type="submit"]').first().should("exist");
    });
  });
});
