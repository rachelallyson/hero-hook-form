describe("Working Comprehensive Demo Tests", () => {
  beforeEach(() => {
    cy.visit("/comprehensive-demo");
  });

  it("should display the page title and description", () => {
    cy.get("h1").should("contain", "Hero Hook Form Demo");
    cy.contains(
      "Comprehensive testing of all form field types and layouts",
    ).should("be.visible");
  });

  it("should display contact form section", () => {
    cy.contains("Contact Form").should("be.visible");
    cy.contains("Single column form with all field types").should("be.visible");
  });

  it("should display settings form section", () => {
    cy.contains("Settings Form").should("be.visible");
    cy.contains("Two column form with default values").should("be.visible");
  });

  it("should have form inputs that can be interacted with", () => {
    // Test text inputs
    cy.get('input[type="text"]').first().type("John");
    cy.get('input[type="text"]').first().should("have.value", "John");

    // Test email input
    cy.get('input[type="email"]').type("john@example.com");
    cy.get('input[type="email"]').should("have.value", "john@example.com");

    // Test phone input
    cy.get('input[type="tel"]').type("123-456-7890");
    cy.get('input[type="tel"]').should("have.value", "123-456-7890");
  });

  it("should have textarea that can be filled", () => {
    // Target the textarea in the contact form specifically
    cy.contains("Contact Form")
      .parent()
      .find("textarea")
      .type("This is a test message");
    cy.contains("Contact Form")
      .parent()
      .find("textarea")
      .should("have.value", "This is a test message");
  });

  it("should have checkboxes that can be toggled", () => {
    // Test newsletter checkbox
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input[type="checkbox"]').first().should("be.checked");

    cy.get('input[type="checkbox"]').first().uncheck();
    cy.get('input[type="checkbox"]').first().should("not.be.checked");
  });

  it("should have radio buttons that can be selected", () => {
    // Test theme radio buttons
    cy.get('input[type="radio"][value="light"]').check();
    cy.get('input[type="radio"][value="light"]').should("be.checked");

    cy.get('input[type="radio"][value="dark"]').check();
    cy.get('input[type="radio"][value="dark"]').should("be.checked");
    cy.get('input[type="radio"][value="light"]').should("not.be.checked");
  });

  it("should have switches that can be toggled", () => {
    // Test notification switch
    cy.get('input[role="switch"]').first().click();
    cy.get('input[role="switch"]').first().should("be.checked");
  });

  it("should have submit and reset buttons", () => {
    cy.get('button[type="submit"]').should("exist");
    cy.get('button[type="button"]').contains("Reset").should("exist");
  });

  it("should display package features section", () => {
    cy.contains("Package Features").should("be.visible");
    cy.contains("Field Types").should("be.visible");
    cy.contains("Validation").should("be.visible");
    cy.contains("Layouts").should("be.visible");
  });
});
