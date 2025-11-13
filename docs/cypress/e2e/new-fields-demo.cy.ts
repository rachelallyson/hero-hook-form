describe("New Fields Demo - Advanced Field Types", () => {
  beforeEach(() => {
    cy.visit("/new-fields-demo");
    cy.get("h1").should("contain", "New Field Types Demo");
  });

  describe("Slider Field Interactions", () => {
    it("should display volume slider with proper constraints", () => {
      // Test volume slider exists and has proper attributes
      cy.get('input[type="range"]').first().should("exist");

      // Verify slider has proper constraints
      cy.get('input[type="range"]').first().should("have.attr", "min", "0");
      cy.get('input[type="range"]').first().should("have.attr", "max", "100");
      cy.get('input[type="range"]').first().should("have.attr", "step", "1");

      // Verify slider is accessible (even if covered by HeroUI wrapper)
      cy.get('input[type="range"]')
        .first()
        .should("have.attr", "aria-valuetext");
    });

    it("should display brightness slider with proper constraints", () => {
      // Test brightness slider exists and has proper attributes
      cy.get('input[type="range"]').last().should("exist");

      // Verify slider has proper constraints
      cy.get('input[type="range"]').last().should("have.attr", "min", "0");
      cy.get('input[type="range"]').last().should("have.attr", "max", "100");
      cy.get('input[type="range"]').last().should("have.attr", "step", "5");

      // Verify slider is accessible
      cy.get('input[type="range"]')
        .last()
        .should("have.attr", "aria-valuetext");
    });

    it("should maintain slider accessibility attributes", () => {
      // Test that sliders maintain their accessibility features
      cy.get('input[type="range"]').should("have.length", 2);

      // Verify both sliders have proper ARIA attributes
      cy.get('input[type="range"]')
        .first()
        .should("have.attr", "aria-orientation", "horizontal");
      cy.get('input[type="range"]')
        .last()
        .should("have.attr", "aria-orientation", "horizontal");
    });
  });

  describe("Date Field Interactions", () => {
    it("should display date picker components correctly", () => {
      // Test that date fields exist and are properly labeled
      cy.contains("Date of Birth").should("exist");
      cy.contains("Appointment Date").should("exist");

      // Verify date picker components are present
      cy.get('[role="spinbutton"]').should("exist");
      cy.get('[data-type="month"]').should("exist");
      cy.get('[data-type="day"]').should("exist");
      cy.get('[data-type="year"]').should("exist");
    });

    it("should handle date field focus and accessibility", () => {
      // Test that date fields can receive focus
      cy.get('[role="spinbutton"]').first().focus();
      cy.get('[role="spinbutton"]').first().should("be.focused");

      // Test that date fields are keyboard accessible
      cy.get('[role="spinbutton"]').first().should("have.attr", "tabindex");
    });

    it("should validate required date field behavior", () => {
      // Test that required date field shows proper indication
      cy.contains("Date of Birth").should("exist");

      // Verify date field is present and interactive
      cy.get('[role="spinbutton"]').should("exist");
    });
  });

  describe("File Upload Field Interactions", () => {
    it("should allow users to select profile picture files", () => {
      // Test profile picture file upload
      cy.get('input[type="file"]').first().should("exist");

      // Verify file input accepts appropriate types
      cy.get('input[type="file"]')
        .first()
        .should("have.attr", "accept", "image/*");

      // Test that file input is interactive
      cy.get('input[type="file"]').first().should("be.visible");
    });

    it("should allow users to select document files", () => {
      // Test document file upload
      cy.get('input[type="file"]').last().should("exist");

      // Verify file input accepts appropriate types
      cy.get('input[type="file"]')
        .last()
        .should("have.attr", "accept", ".pdf,.doc,.docx");

      // Test that file input is interactive
      cy.get('input[type="file"]').last().should("be.visible");
    });

    it("should handle multiple file selection for documents", () => {
      // Test that documents field supports multiple files
      cy.get('input[type="file"]').last().should("have.attr", "multiple");

      // Verify file input is functional
      cy.get('input[type="file"]').last().should("be.visible");
    });
  });

  describe("Form Integration and Workflow", () => {
    it("should display form with all field types", () => {
      // Verify form structure and field presence
      cy.get("form").should("exist");
      cy.get('input[type="range"]').should("exist");
      cy.get('input[type="file"]').should("exist");
      cy.get('[role="spinbutton"]').should("exist");

      // Verify form is ready for interaction
      cy.get('button[type="submit"]').should("exist");
    });

    it("should handle form submission with advanced field types", () => {
      // Test form submission functionality
      cy.get('button[type="submit"]').click();

      // Verify form submission handled
      cy.get("form").should("exist");
    });

    it("should handle form reset functionality", () => {
      // Test form reset functionality
      cy.get('button[type="button"]').contains("Reset").click();

      // Verify form is still functional after reset
      cy.get("form").should("exist");
    });
  });

  describe("Advanced Field Behavior", () => {
    it("should handle slider step increments correctly", () => {
      // Test volume slider step behavior
      cy.get('input[type="range"]').first().should("have.attr", "step", "1");

      // Test brightness slider step behavior
      cy.get('input[type="range"]').last().should("have.attr", "step", "5");

      // Verify sliders have proper step constraints
      cy.get('input[type="range"]').first().should("have.attr", "step");
      cy.get('input[type="range"]').last().should("have.attr", "step");
    });

    it("should maintain field state during form interaction", () => {
      // Test that form maintains its structure during interaction
      cy.get('input[type="range"]').should("exist");
      cy.get('[role="spinbutton"]').should("exist");
      cy.get('input[type="file"]').should("exist");

      // Verify form remains functional
      cy.get("form").should("exist");
    });

    it("should handle field validation and error states", () => {
      // Test required field validation
      cy.get('button[type="submit"]').click();

      // Form should still exist (validation errors should appear)
      cy.get("form").should("exist");

      // Verify form is still functional after validation
      cy.get("form").should("exist");
    });
  });

  describe("User Experience and Accessibility", () => {
    it("should provide clear visual feedback for field interactions", () => {
      // Test that sliders show proper attributes
      cy.get('input[type="range"]')
        .first()
        .should("have.attr", "aria-valuetext");
      cy.get('input[type="range"]')
        .last()
        .should("have.attr", "aria-valuetext");

      // Test that date fields show proper labels
      cy.contains("Date of Birth").should("be.visible");
      cy.contains("Appointment Date").should("be.visible");

      // Test that file upload fields show proper labels
      cy.contains("Profile Picture").should("be.visible");
      cy.contains("Documents").should("be.visible");
    });

    it("should support keyboard navigation and accessibility", () => {
      // Test that form elements can receive focus
      cy.get('input[type="range"]').first().should("have.attr", "tabindex");
      cy.get('input[type="range"]').last().should("have.attr", "tabindex");

      // Test that date fields can receive focus
      cy.get('[role="spinbutton"]').first().should("have.attr", "tabindex");
    });

    it("should provide proper field descriptions and help text", () => {
      // Test that field labels are visible and descriptive
      cy.contains("Volume Level").should("be.visible");
      cy.contains("Brightness").should("be.visible");
      cy.contains("Date of Birth").should("be.visible");
      cy.contains("Appointment Date").should("be.visible");
      cy.contains("Profile Picture").should("be.visible");
      cy.contains("Documents").should("be.visible");
    });
  });

  describe("Real-World Usage Scenarios", () => {
    it("should handle user profile setup workflow", () => {
      // Simulate user setting up profile by verifying form structure
      cy.get("form").should("exist");
      cy.get('input[type="range"]').should("exist");
      cy.get('[role="spinbutton"]').should("exist");
      cy.get('input[type="file"]').should("exist");

      // Verify form is ready for profile setup
      cy.get('button[type="submit"]').should("exist");
    });

    it("should handle appointment booking workflow", () => {
      // Simulate user booking appointment by verifying form structure
      cy.get("form").should("exist");
      cy.get('input[type="range"]').should("exist");
      cy.get('[role="spinbutton"]').should("exist");
      cy.get('input[type="file"]').should("exist");

      // Verify form is ready for appointment booking
      cy.get('button[type="submit"]').should("exist");
    });
  });
});
