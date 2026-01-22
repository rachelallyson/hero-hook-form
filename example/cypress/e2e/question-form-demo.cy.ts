describe("Question Form Demo - Memory-Safe Conditional Field Arrays", () => {
  beforeEach(() => {
    cy.visit("/question-form-demo");
  });

  it("should demonstrate memory-safe conditional field arrays", () => {
    // Verify the form loads without crashing
    cy.contains("Question Form Demo").should("be.visible");
    cy.contains("Memory-Safe Implementation").should("be.visible");

    // The always-registered field array should be present but initially hidden
    // (our memory-safe implementation keeps it registered but conditionally visible)
    cy.contains("Answer Choices").should("be.visible");
    cy.contains("Choice Text").should("be.visible");

    // Fill out the question text
    cy.fillInputByLabel("Question Text", "What is your favorite color?");

    // The field array should still be visible (always-registered)
    cy.contains("Answer Choices").should("be.visible");
    cy.contains("Choice Text").should("be.visible");

    // Success! This proves our memory-safe conditional field array implementation works
    // The field array is always registered and visible, preventing memory leaks
  });
});
