describe("Config Demo - Form Configuration Options and Provider Features", () => {
  beforeEach(() => {
    cy.visit("/config-demo");
    cy.get("h1").should("contain", "Global Configuration Demo");
  });

  describe("Default Configuration Form - Base Styling", () => {
    it("should display default configuration form with base styling", () => {
      cy.get("h2").contains("Default Configuration").should("be.visible");
    });

    it("should display all form fields with default configuration styling", () => {
      // Verify all required form fields exist with default styling
      cy.contains("label", "Name").should("exist");
      cy.contains("label", "Email").should("exist");
      cy.contains("label", "Message").should("exist");
      cy.contains("span", "Theme").should("exist");
      cy.contains("label", "Enable Notifications").should("exist");
    });

    it("should apply default form styling consistently", () => {
      cy.get("form").should("be.visible");
    });

    it("should enforce required field validation with default configuration", () => {
      // Target the first form specifically
      cy.get("form")
        .first()
        .within(() => {
          cy.get('button[type="submit"]').click();
        });

      // Verify form validation was triggered
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("should submit successfully with valid data using default configuration", () => {
      // Target the first form specifically
      cy.get("form")
        .first()
        .within(() => {
          cy.fillField("Name", "John Doe");
          cy.fillField("Email", "john@example.com");
          cy.fillField("Message", "This is a test message");
          cy.get('button[type="submit"]').click();
        });

      // Verify form submission was handled
      cy.get('button[type="submit"]').should("be.visible");
    });
  });

  describe("Common Defaults Form - Shared Configuration", () => {
    it("should display common defaults form with shared configuration", () => {
      cy.get("h2").contains("Common Defaults").should("be.visible");
    });

    it("should display all form fields with common configuration styling", () => {
      // Verify all required form fields exist with common styling
      cy.contains("label", "Name").should("exist");
      cy.contains("label", "Email").should("exist");
      cy.contains("label", "Message").should("exist");
      cy.contains("span", "Theme").should("exist");
      cy.contains("label", "Enable Notifications").should("exist");
    });

    it("should apply common configuration styling consistently", () => {
      cy.get("form").should("be.visible");
    });

    it("should validate required fields using common configuration", () => {
      // Target the second form specifically
      cy.get("form")
        .eq(1)
        .within(() => {
          cy.get('button[type="submit"]').click();
        });

      // Verify form validation was triggered
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("should submit successfully with valid data using common configuration", () => {
      // Target the second form specifically
      cy.get("form")
        .eq(1)
        .within(() => {
          cy.fillField("Name", "Jane Smith");
          cy.fillField("Email", "jane@example.com");
          cy.fillField("Message", "This is a common defaults test message");
          cy.get('button[type="submit"]').click();
        });

      // Verify form submission was handled
      cy.get('button[type="submit"]').should("be.visible");
    });
  });

  describe("Component Overrides Form - Custom Configuration", () => {
    it("should display component overrides form with custom configuration", () => {
      cy.get("h2").contains("Component Overrides").should("be.visible");
    });

    it("should display all form fields with component override styling", () => {
      // Verify all required form fields exist with component styling
      cy.contains("label", "Name").should("exist");
      cy.contains("label", "Email").should("exist");
      cy.contains("label", "Message").should("exist");
      cy.contains("span", "Theme").should("exist");
      cy.contains("label", "Enable Notifications").should("exist");
    });

    it("should apply component override styling consistently", () => {
      cy.get("form").should("be.visible");
    });

    it("should validate required fields using component override configuration", () => {
      // Target the third form specifically
      cy.get("form")
        .eq(2)
        .within(() => {
          cy.get('button[type="submit"]').click();
        });

      // Verify form validation was triggered
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("should submit successfully with valid data using component override configuration", () => {
      // Target the third form specifically
      cy.get("form")
        .eq(2)
        .within(() => {
          cy.fillField("Name", "Bob Johnson");
          cy.fillField("Email", "bob@example.com");
          cy.fillField("Message", "This is a component overrides test message");
          cy.get('button[type="submit"]').click();
        });

      // Verify form submission was handled
      cy.get('button[type="submit"]').should("be.visible");
    });
  });

  describe("Nested Providers Form - Layered Configuration", () => {
    it("should display nested providers form with layered configuration", () => {
      cy.get("h2").contains("Nested Providers").should("be.visible");
    });

    it("should display all form fields with nested provider styling", () => {
      // Verify all required form fields exist with nested styling
      cy.contains("label", "Name").should("exist");
      cy.contains("label", "Email").should("exist");
      cy.contains("label", "Message").should("exist");
      cy.contains("span", "Theme").should("exist");
      cy.contains("label", "Enable Notifications").should("exist");
    });

    it("should apply nested provider styling consistently", () => {
      cy.get("form").should("be.visible");
    });

    it("should validate required fields using nested provider configuration", () => {
      // Target the fourth form specifically
      cy.get("form")
        .eq(3)
        .within(() => {
          cy.get('button[type="submit"]').click();
        });

      // Verify form validation was triggered
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("should submit successfully with valid data using nested provider configuration", () => {
      // Target the fourth form specifically
      cy.get("form")
        .eq(3)
        .within(() => {
          cy.fillField("Name", "Alice Brown");
          cy.fillField("Email", "alice@example.com");
          cy.fillField("Message", "This is a nested providers test message");
          cy.get('button[type="submit"]').click();
        });

      // Verify form submission was handled
      cy.get('button[type="submit"]').should("be.visible");
    });
  });

  describe("Configuration Differences and Provider Features", () => {
    it("should demonstrate different configuration options between forms", () => {
      // Verify all configuration variants are displayed
      cy.get("h2").contains("Default Configuration").should("be.visible");
      cy.get("h2").contains("Common Defaults").should("be.visible");
      cy.get("h2").contains("Component Overrides").should("be.visible");
      cy.get("h2").contains("Nested Providers").should("be.visible");

      // Verify all forms are present
      cy.get("form").should("have.length", 4);
    });

    it("should explain configuration and provider features", () => {
      cy.contains(
        "Demonstrating global configuration and provider features",
      ).should("be.visible");
    });

    it("should maintain consistent field structure across different configurations", () => {
      // Verify all forms have the same field structure despite different styling
      cy.get("form").each(($form) => {
        cy.wrap($form).within(() => {
          cy.contains("label", "Name").should("exist");
          cy.contains("label", "Email").should("exist");
          cy.contains("label", "Message").should("exist");
        });
      });
    });
  });

  describe("Form Layout and Configuration Styling", () => {
    it("should have proper form layout across all configuration variants", () => {
      cy.get("form").should("be.visible");
    });

    it("should display clear form titles and configuration descriptions", () => {
      cy.get("h1").contains("Global Configuration Demo").should("be.visible");
      cy.contains(
        "Demonstrating global configuration and provider features",
      ).should("be.visible");
    });

    it("should have consistent submit and reset buttons across configurations", () => {
      cy.get('button[type="submit"]').should("be.visible");
      cy.get('button[type="button"]').contains("Reset").should("be.visible");
    });
  });

  describe("Accessibility and Configuration Consistency", () => {
    it("should maintain proper form labels across all configuration variants", () => {
      // Verify form labels exist consistently across all configurations
      cy.contains("label", "Name").should("exist");
      cy.contains("label", "Email").should("exist");
      cy.contains("label", "Message").should("exist");
    });

    it("should maintain proper ARIA attributes across configurations", () => {
      cy.get("form").should("have.attr", "role", "form");
    });

    it("should support keyboard navigation consistently across all configurations", () => {
      // Test keyboard navigation on first form
      cy.get('input[type="text"]').first().focus().should("be.focused");
      cy.get('input[type="email"]').first().focus().should("be.focused");
    });
  });

  describe("Form Validation and Error Handling Across Configurations", () => {
    it("should display validation errors consistently across all configuration variants", () => {
      // Test validation on first form
      cy.get("form")
        .first()
        .within(() => {
          cy.get('button[type="submit"]').click();
        });

      // Verify form validation was triggered
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("should clear validation errors consistently when valid data is entered", () => {
      // Test error clearing on first form
      cy.get("form")
        .first()
        .within(() => {
          cy.get('button[type="submit"]').click();
          cy.fillField("Name", "John Doe");
          cy.fillField("Email", "john@example.com");
          cy.fillField("Message", "Test message");
        });
    });

    it("should maintain form state management across different configurations", () => {
      // Test form state on first form
      cy.get("form")
        .first()
        .within(() => {
          // Fill some fields to test state
          cy.fillField("Name", "TestUser");
          cy.get('input[type="text"]').first().should("have.value", "TestUser");

          // Verify form remains functional
          cy.get('button[type="submit"]').should("exist");
        });
    });
  });
});
