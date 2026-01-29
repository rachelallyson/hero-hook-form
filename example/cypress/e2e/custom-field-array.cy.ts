/**
 * E2E test for custom field array: createFieldArrayCustomConfig with
 * getItemFieldConfig + createCustomFieldConfigForItem (ZodForm).
 */

describe("Custom Field Array Demo", () => {
  beforeEach(() => {
    cy.visit("/custom-field-array-demo");
    cy.get("form").should("exist");
  });

  it("should render form with title and custom fields (Short Text, Choice)", () => {
    cy.contains("Form Title").should("exist");
    cy.contains("Short Text Field").should("exist");
    cy.contains("Choice").should("exist");
    cy.get('input[type="text"]').should("exist");
    cy.get('button[aria-haspopup="listbox"]').should("exist");
    cy.get('button[type="submit"]').should("exist");
  });

  it("should fill custom fields and submit successfully", () => {
    cy.get('input[name="title"]').type("E2E Test");
    cy.contains("Short Text Field").parent().find("input").type("e2e short");
    cy.get('button[aria-haspopup="listbox"]').click();
    cy.get('[role="listbox"]').contains("Beta").click();

    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="submit-success"]', { timeout: 10000 }).should(
      "exist",
    );
    cy.get('[data-testid="submit-success"]').should(
      "contain.text",
      "Form submitted",
    );
    cy.get('[data-testid="submit-success"]').should(
      "contain.text",
      "e2e short",
    );
    cy.get('[data-testid="submit-success"]').should("contain.text", "Beta");
  });

  it("should show validation when title is empty", () => {
    cy.contains("Short Text Field").parent().find("input").type("something");
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="submit-success"]').should("not.exist");
  });
});
