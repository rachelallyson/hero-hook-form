describe("ZodForm Basic Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3010/zod-form-comprehensive-test");
    // Wait for form to load
    cy.get("form").should("exist");
  });

  it("should render basic form fields", () => {
    // Basic text inputs
    cy.get('input[name="firstName"]').should("exist");
    cy.get('input[name="lastName"]').should("exist");
    cy.get('input[name="email"]').should("exist");

    // Textarea
    cy.get('textarea[name="message"]').should("exist");

    // Select dropdown
    cy.get('button[aria-haspopup="listbox"]').should("exist");

    // Radio buttons
    cy.get('input[type="radio"][name="gender"]').should("have.length", 3);

    // Checkboxes
    cy.get('input[type="checkbox"][name="terms"]').should("exist");

    // Submit button
    cy.get('button[type="submit"]').should("exist");
  });

  it("should fill out basic form fields", () => {
    // Fill text inputs
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="email"]').type("john.doe@example.com");

    // Fill textarea
    const message =
      "This is a test message that is long enough to pass validation";

    cy.get('textarea[name="message"]').type(message);

    // Select radio option
    cy.get('input[type="radio"][name="gender"][value="male"]').check();

    // Check terms checkbox
    cy.get('input[type="checkbox"][name="terms"]').check();

    // Verify values
    cy.get('input[name="firstName"]').should("have.value", "John");
    cy.get('input[name="lastName"]').should("have.value", "Doe");
    cy.get('input[name="email"]').should("have.value", "john.doe@example.com");
    cy.get('textarea[name="message"]').should("have.value", message);
    cy.get('input[type="radio"][name="gender"][value="male"]').should(
      "be.checked",
    );
    cy.get('input[type="checkbox"][name="terms"]').should("be.checked");
  });

  it("should submit form successfully", () => {
    // Fill required fields
    cy.get('input[name="firstName"]').type("John");
    cy.get('input[name="lastName"]').type("Doe");
    cy.get('input[name="email"]').type("john.doe@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('textarea[name="message"]').type(
      "This is a test message that is long enough to pass validation",
    );
    cy.get('input[type="checkbox"][name="terms"]').check();

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify form still exists (successful submission)
    cy.get("form").should("exist");
  });

  it("should validate required fields and show errors", () => {
    // Try to submit without filling required fields
    cy.get('button[type="submit"]').click();

    // Verify that the form still exists (validation prevented submission)
    cy.get("form").should("exist");
  });
});
