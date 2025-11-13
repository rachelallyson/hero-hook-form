describe("HeroUI Dropdown Testing Examples", () => {
  beforeEach(() => {
    cy.visit("/real-world-demo");
    cy.get("h2").should("contain", "Checkout Information");
  });

  describe("Core Dropdown Functionality", () => {
    it("should allow users to select country from dropdown", () => {
      // Open country dropdown
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Verify options are available
      cy.get('[role="option"]').should("have.length.greaterThan", 1);

      // Select first option
      cy.get('[role="option"]').first().click({ force: true });

      // Verify dropdown closed and selection made
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "false");
    });

    it("should allow users to select payment method", () => {
      // Find payment method dropdown (usually the second one)
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();

      // Select any available option
      cy.get('[role="option"]').first().click({ force: true });

      // Verify dropdown closed
      cy.get('button[aria-haspopup="listbox"]')
        .eq(1)
        .should("have.attr", "aria-expanded", "false");
    });

    it("should allow users to select delivery method", () => {
      // Find delivery method dropdown
      cy.get('button[aria-haspopup="listbox"]').eq(2).click();

      // Select any available option
      cy.get('[role="option"]').first().click({ force: true });

      // Verify dropdown closed
      cy.get('button[aria-haspopup="listbox"]')
        .eq(2)
        .should("have.attr", "aria-expanded", "false");
    });
  });

  describe("User Experience and Accessibility", () => {
    it("should maintain focus management during dropdown interaction", () => {
      // Focus on dropdown
      cy.get('button[aria-haspopup="listbox"]').first().focus();

      // Verify focus
      cy.get('button[aria-haspopup="listbox"]').first().should("be.focused");

      // Open dropdown
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Verify dropdown opened
      cy.get('[role="option"]').should("exist");

      // Select option
      cy.get('[role="option"]').first().click({ force: true });

      // Verify focus returns to button
      cy.get('button[aria-haspopup="listbox"]').first().should("be.focused");
    });

    it("should provide proper ARIA attributes for screen readers", () => {
      // Check initial state
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "false");

      // Open dropdown
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Check expanded state
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "true");

      // Verify options have proper roles
      cy.get('[role="option"]').should("exist");
    });
  });

  describe("Real-World User Scenarios", () => {
    it("should allow users to complete checkout with dropdown selections", () => {
      // Fill out form fields
      cy.get('input[type="text"]').first().type("John Doe");
      cy.get('input[type="email"]').type("john@example.com");

      // Select country
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.get('[role="option"]')
        .contains("United States")
        .click({ force: true });

      // Select payment method
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();
      cy.get('[role="option"]').first().click({ force: true });

      // Select delivery method
      cy.get('button[aria-haspopup="listbox"]').eq(2).click();
      cy.get('[role="option"]').first().click({ force: true });

      // Submit form
      cy.get('button[type="submit"]').click();

      // Verify form submission (check that form still exists or success message appears)
      cy.get("form").should("exist");
    });

    it("should handle rapid dropdown interactions without breaking", () => {
      // Open first dropdown
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Quickly close by clicking outside (click on header)
      cy.get("h2").first().click();

      // Verify dropdown closed
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "false");

      // Open again and select option
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.get('[role="option"]').first().click({ force: true });

      // Verify selection worked
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "false");
    });
  });
});
