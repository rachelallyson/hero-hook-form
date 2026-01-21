// ***********************************************
// Example-specific Cypress commands
//
// Note: Most helpers are available from the package:
// - fillInputByLabel, fillInputByType, fillInputByName
// - selectDropdownByLabel, selectDropdownByName
// - submitForm, verifyFormExists, etc.
//
// Only add commands here if they're truly example-specific
// and won't be useful to other users of the package.
// ***********************************************

// Example-specific: Test form submission with console verification
// This is example-specific because it checks for console.log calls
Cypress.Commands.add("testFormSubmission", () => {
  // Submit the form using package helper
  cy.submitForm();

  // Check that something happened (console log, network request, etc.)
  // This is example-specific behavior
  cy.window().its("console.log").should("be.called");
});

// These commands are too unreliable with HeroUI's overflow-hidden issue
// Cypress.Commands.add("validateFieldError", (fieldLabel: string, errorMessage: string) => {
//   cy.contains("label", fieldLabel).parent().should("contain", errorMessage);
// });

// Cypress.Commands.add("validateFieldSuccess", (fieldLabel: string) => {
//   cy.contains("label", fieldLabel).parent().should("not.contain", "error");
// });
