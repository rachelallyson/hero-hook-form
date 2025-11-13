/**
 * Simple test to verify our Cypress helpers are working
 */

describe("Simple Helper Test", () => {
  beforeEach(() => {
    cy.visit("/real-world-demo");
  });

  it("should be able to use basic form interactions", () => {
    // Test basic form interaction using helpers
    cy.verifyFormExists();

    // Test input by type using helpers
    cy.fillInputByType("text", "John Doe");
    cy.verifyFieldValue("text", "John Doe");

    // Test email input using helpers
    cy.fillInputByType("email", "john@example.com");
    cy.verifyFieldValue("email", "john@example.com");

    // Test dropdown interaction using helpers
    cy.selectDropdownOption();

    // Test checkbox using helpers
    cy.checkCheckbox();
    cy.get('input[type="checkbox"]').first().should("be.checked");

    // Test submit button
    cy.get('button[type="submit"]').should("exist");
  });
});
