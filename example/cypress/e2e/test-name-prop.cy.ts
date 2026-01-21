describe("HeroUI Input name prop test", () => {
  it("should verify that name prop IS rendered in the DOM", () => {
    cy.visit("http://localhost:3010/hero-ui-test");

    // Find the input with name prop passed to HeroUI Input
    cy.contains("Input with name prop").should("be.visible");

    // Find the actual HTML input element (not the HeroUI wrapper)
    // HeroUI Input renders an <input> inside a wrapper
    cy.get('input[placeholder="Check if name appears in DOM"]').then(
      ($input) => {
        // Check if the name attribute exists
        const nameAttr = $input.attr("name");

        // Log the result
        cy.log(`Name attribute value: ${nameAttr || "NOT FOUND"}`);

        // Verify that name attribute IS present
        // This confirms HeroUI DOES forward the name prop to the DOM
        expect(nameAttr).to.equal("test-name-attribute");
      },
    );
  });

  it("should show that name attributes work for identification", () => {
    cy.visit("http://localhost:3010/hero-ui-test");

    // Verify we can find inputs by name attribute
    cy.get('input[name="test-name-attribute"]').should("exist");

    // Verify we can also find inputs by other attributes
    cy.get('input[type="text"]').should("exist");
    cy.get('input[placeholder*="Check if name"]').should("exist");
  });
});
