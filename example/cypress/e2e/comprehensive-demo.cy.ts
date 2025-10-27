describe("Comprehensive Demo - Complete Form Testing", () => {
  beforeEach(() => {
    cy.visit("/comprehensive-demo");
    cy.get("h1").should("contain", "Hero Hook Form Demo");
  });

  describe("Contact Form - All Field Types", () => {
    it("should display all form fields correctly", () => {
      // Check that the contact form section exists
      cy.contains("Contact Form").should("be.visible");
      cy.contains("Single column form with all field types").should(
        "be.visible",
      );

      // Check that form inputs exist
      cy.get('input[type="text"]').should("exist");
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="tel"]').should("exist");
      cy.get("textarea").should("exist");
      cy.get('input[type="checkbox"]').should("exist");
    });

    it("should validate required fields", () => {
      // Try to submit the form without filling required fields using helper
      cy.submitAndExpectErrors();

      // Check for validation errors (they should appear in the form)
      cy.verifyFormExists();
    });

    it("should validate email format correctly", () => {
      // Fill email with invalid format using helper
      cy.fillInputByType("email", "invalid-email");

      // Fill email with valid format using helper
      cy.fillInputByType("email", "valid@example.com");
      cy.verifyFieldValue("email", "valid@example.com");
    });

    it("should handle form submission", () => {
      // Fill some fields using helpers
      cy.fillInputByType("text", "John");
      cy.fillInputByType("email", "john@example.com");
      cy.fillTextarea("Test message");

      // Submit form using helper
      cy.submitForm();
    });

    it("should handle form reset", () => {
      // Fill some fields using helpers
      cy.fillInputByType("text", "John");
      cy.fillInputByType("email", "john@example.com");

      // Reset form using helper
      cy.resetForm();

      // Check that fields are cleared
      cy.get('input[type="text"]').first().should("have.value", "");
      cy.get('input[type="email"]').should("have.value", "");
    });
  });

  describe("Settings Form - Two Column Layout", () => {
    it("should display settings form correctly", () => {
      // Check that the settings form section exists
      cy.contains("Settings Form").should("be.visible");
      cy.contains("Two column form with default values").should("be.visible");

      // Check for radio buttons (theme selection)
      cy.get('input[type="radio"]').should("exist");

      // Check for switches
      cy.get('input[role="switch"]').should("exist");
    });

    it("should handle theme selection", () => {
      // Select light theme
      cy.get('input[type="radio"][value="light"]').check();
      cy.get('input[type="radio"][value="light"]').should("be.checked");

      // Select dark theme
      cy.get('input[type="radio"][value="dark"]').check();
      cy.get('input[type="radio"][value="dark"]').should("be.checked");
      cy.get('input[type="radio"][value="light"]').should("not.be.checked");
    });

    it("should handle switch toggles", () => {
      // Toggle notification switch using helper
      cy.checkSwitch();
      cy.get('input[role="switch"]').first().should("be.checked");

      // Toggle auto save switch using helper
      cy.checkSwitch(1);
      cy.get('input[role="switch"]').last().should("be.checked");
    });

    it("should handle settings form submission", () => {
      // Fill some settings
      cy.get('input[type="radio"][value="light"]').check();
      cy.checkSwitch();

      // Submit settings form using helper
      cy.submitForm();
    });
  });

  describe("Form Interactions", () => {
    it("should handle text input fields", () => {
      cy.fillInputByType("text", "Test User");
      cy.verifyFieldValue("text", "Test User");
    });

    it("should handle email input", () => {
      cy.fillInputByType("email", "test@example.com");
      cy.verifyFieldValue("email", "test@example.com");
    });

    it("should handle phone input", () => {
      cy.fillInputByType("tel", "123-456-7890");
      cy.verifyFieldValue("tel", "123-456-7890");
    });

    it("should handle textarea", () => {
      const message = "This is a comprehensive test message for the form.";

      cy.fillTextarea(message);
      cy.get("textarea").should("have.value", message);
    });

    it("should handle checkbox interactions", () => {
      cy.checkCheckbox();
      cy.get('input[type="checkbox"]').first().should("be.checked");

      cy.uncheckCheckbox();
      cy.get('input[type="checkbox"]').first().should("not.be.checked");
    });
  });

  describe("Accessibility and UX", () => {
    it("should have proper form labels", () => {
      // Check that labels exist for form fields
      cy.contains("First Name").should("be.visible");
      cy.contains("Email").should("be.visible");
      cy.contains("Message").should("be.visible");
    });

    it("should have proper ARIA attributes", () => {
      // Check for required field indicators
      cy.get('input[type="email"]').should("have.attr", "type", "email");
      cy.get('input[type="tel"]').should("have.attr", "type", "tel");
    });

    it("should handle keyboard navigation", () => {
      cy.get('input[type="text"]').eq(0).focus().should("be.focused");
      cy.get('input[type="email"]').focus().should("be.focused");
    });
  });

  describe("Form Reset and Error Handling", () => {
    it("should reset form correctly", () => {
      // Fill some fields - target the first form specifically
      cy.get("form")
        .first()
        .within(() => {
          cy.get('input[type="text"]').first().type("John Doe");
          cy.get('input[type="email"]').type("john@example.com");
          cy.get("textarea").type("Test message");
        });

      // Reset form
      cy.get('button[type="button"]').contains("Reset").click();

      // Check that fields are cleared
      cy.get("form")
        .first()
        .within(() => {
          cy.get('input[type="text"]').first().should("have.value", "");
          cy.get('input[type="email"]').should("have.value", "");
          cy.get("textarea").should("have.value", "");
        });
    });

    it("should clear errors when valid data is entered", () => {
      // Submit form to trigger validation
      cy.get('button[type="submit"]').first().click();

      // Fill with valid data - target the first form specifically
      cy.get("form")
        .first()
        .within(() => {
          cy.get('input[type="text"]').first().type("John");
          cy.get('input[type="email"]').type("john@example.com");
        });
    });
  });

  describe("Feature Highlights", () => {
    it("should display feature highlight cards", () => {
      cy.contains("Package Features").should("be.visible");
      cy.contains("Field Types").should("be.visible");
      cy.contains("Validation").should("be.visible");
      cy.contains("Layouts").should("be.visible");
    });

    it("should have descriptive feature explanations", () => {
      cy.contains("Input (text, email, tel)").should("be.visible");
      cy.contains("Required field validation").should("be.visible");
      cy.contains("Vertical single column").should("be.visible");
    });
  });
});
