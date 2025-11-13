describe("HeroUI Dropdown Testing - Simplified", () => {
  beforeEach(() => {
    cy.visit("/real-world-demo");
    cy.get("h2").should("contain", "Checkout Information");
  });

  describe("Essential Dropdown Behavior", () => {
    it("should allow users to open and select from dropdowns", () => {
      // Open first dropdown
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Verify options are available
      cy.get('[role="option"]').should("exist");

      // Select an option
      cy.get('[role="option"]').first().click({ force: true });

      // Verify dropdown closed
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "false");
    });

    it("should handle multiple dropdown selections in sequence", () => {
      // Select country
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.get('[role="option"]').first().click({ force: true });

      // Select payment method
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();
      cy.get('[role="option"]').first().click({ force: true });

      // Select delivery method
      cy.get('button[aria-haspopup="listbox"]').eq(2).click();
      cy.get('[role="option"]').first().click({ force: true });

      // Verify all dropdowns are closed
      cy.get('button[aria-haspopup="listbox"]').each(($dropdown) => {
        cy.wrap($dropdown).should("have.attr", "aria-expanded", "false");
      });
    });
  });

  describe("User Interaction Patterns", () => {
    it("should maintain proper state during user interactions", () => {
      const dropdown = 'button[aria-haspopup="listbox"]:first';

      // Check initial state
      cy.get(dropdown).should("have.attr", "aria-expanded", "false");

      // Open dropdown
      cy.get(dropdown).click();
      cy.get(dropdown).should("have.attr", "aria-expanded", "true");

      // Select option
      cy.get('[role="option"]').first().click({ force: true });
      cy.get(dropdown).should("have.attr", "aria-expanded", "false");
    });

    it("should allow users to cancel dropdown selection by clicking outside", () => {
      // Open dropdown
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.get('[role="option"]').should("exist");

      // Click outside to close
      cy.get("h2").click();

      // Verify dropdown closed
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "false");
    });
  });
});
