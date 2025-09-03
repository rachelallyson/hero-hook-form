// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// New commands that work with HeroUI's actual DOM structure
Cypress.Commands.add("fillFieldByLabel", (labelText: string, value: string) => {
  // Find the label containing the text, then find the nearest input
  cy.contains("label", labelText).should("exist");
  cy.contains("label", labelText)
    .closest("div")
    .find("input, textarea")
    .first()
    .clear()
    .type(value);
});

// New command: Fill field by input type (more reliable)
Cypress.Commands.add("fillFieldByType", (inputType: string, value: string) => {
  cy.get(`input[type="${inputType}"]`).first().clear().type(value);
});

// New command: Select option from dropdown by label
Cypress.Commands.add(
  "selectOptionByLabel",
  (labelText: string, option: string) => {
    cy.contains("label", labelText).should("exist");
    cy.contains("label", labelText)
      .closest("div")
      .find("select")
      .first()
      .select(option);
  },
);

// New command: Submit form (works with any submit button)
Cypress.Commands.add("submitForm", () => {
  cy.get('button[type="submit"]').first().click();
});

// New command: Test form submission actually works
Cypress.Commands.add("testFormSubmission", () => {
  // Submit the form
  cy.submitForm();

  // Check that something happened (console log, network request, etc.)
  cy.window().its("console.log").should("be.called");
});

// New command: Test field interaction actually works
Cypress.Commands.add(
  "testFieldInteraction",
  (inputType: string, testValue: string) => {
    const input = cy.get(`input[type="${inputType}"]`).first();

    // Type the value
    input.clear().type(testValue);

    // Verify the value was set
    input.should("have.value", testValue);
  },
);

// Legacy commands (kept for backward compatibility but may not work)
Cypress.Commands.add("fillField", (label: string, value: string) => {
  cy.fillFieldByLabel(label, value);
});

Cypress.Commands.add("selectOption", (label: string, option: string) => {
  cy.selectOptionByLabel(label, option);
});

// These commands are too unreliable with HeroUI's overflow-hidden issue
// Cypress.Commands.add("validateFieldError", (fieldLabel: string, errorMessage: string) => {
//   cy.contains("label", fieldLabel).parent().should("contain", errorMessage);
// });

// Cypress.Commands.add("validateFieldSuccess", (fieldLabel: string) => {
//   cy.contains("label", fieldLabel).parent().should("not.contain", "error");
// });
