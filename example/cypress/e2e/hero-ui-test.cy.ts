describe("HeroUI Component Testing", () => {
  beforeEach(() => {
    cy.visit("/hero-ui-test");
  });

  it("should examine what's actually rendered on the page", () => {
    // Wait for page to load
    cy.get("h1").should("contain", "HeroUI Component Testing");

    // Look for any input elements
    cy.get("input").then(($inputs) => {
      cy.log(`Found ${$inputs.length} input elements`);

      $inputs.each((index, input) => {
        const type = input.getAttribute("type");
        const placeholder = input.getAttribute("placeholder");
        const className = input.getAttribute("class");
        const role = input.getAttribute("role");
        const id = input.getAttribute("id");
        const name = input.getAttribute("name");

        cy.log(
          `Input ${index}: type="${type}", placeholder="${placeholder}", class="${className}", role="${role}", id="${id}", name="${name}"`,
        );
      });
    });

    // Look for any button elements
    cy.get("button").then(($buttons) => {
      cy.log(`Found ${$buttons.length} button elements`);

      $buttons.each((index, button) => {
        const text = button.textContent;
        const className = button.getAttribute("class");
        const role = button.getAttribute("role");
        const ariaHaspopup = button.getAttribute("aria-haspopup");
        const ariaExpanded = button.getAttribute("aria-expanded");
        const type = button.getAttribute("type");

        cy.log(
          `Button ${index}: text="${text}", class="${className}", role="${role}", aria-haspopup="${ariaHaspopup}", aria-expanded="${ariaExpanded}", type="${type}"`,
        );
      });
    });

    // Look for any select elements
    cy.get("select").then(($selects) => {
      cy.log(`Found ${$selects.length} select elements`);

      $selects.each((index, select) => {
        const className = select.getAttribute("class");
        const role = select.getAttribute("role");
        const id = select.getAttribute("id");
        const name = select.getAttribute("name");

        cy.log(
          `Select ${index}: class="${className}", role="${role}", id="${id}", name="${name}"`,
        );
      });
    });

    // Look for any textarea elements
    cy.get("textarea").then(($textareas) => {
      cy.log(`Found ${$textareas.length} textarea elements`);

      $textareas.each((index, textarea) => {
        const placeholder = textarea.getAttribute("placeholder");
        const className = textarea.getAttribute("class");
        const role = textarea.getAttribute("role");
        const id = textarea.getAttribute("id");
        const name = textarea.getAttribute("name");

        cy.log(
          `Textarea ${index}: placeholder="${placeholder}", class="${className}", role="${role}", id="${id}", name="${name}"`,
        );
      });
    });

    // Look for any elements with role attributes
    cy.get("[role]").then(($roleElements) => {
      cy.log(`Found ${$roleElements.length} elements with role attributes`);

      $roleElements.each((index, element) => {
        const tagName = element.tagName;
        const role = element.getAttribute("role");
        const className = element.getAttribute("class");
        const id = element.getAttribute("id");

        cy.log(
          `Role Element ${index}: ${tagName}, role="${role}", class="${className}", id="${id}"`,
        );
      });
    });

    // Look for any elements with aria-haspopup attributes
    cy.get("[aria-haspopup]").then(($ariaElements) => {
      cy.log(
        `Found ${$ariaElements.length} elements with aria-haspopup attributes`,
      );

      $ariaElements.each((index, element) => {
        const tagName = element.tagName;
        const className = element.getAttribute("class");
        const ariaHaspopup = element.getAttribute("aria-haspopup");
        const ariaExpanded = element.getAttribute("aria-expanded");

        cy.log(
          `Aria Element ${index}: ${tagName}, class="${className}", aria-haspopup="${ariaHaspopup}", aria-expanded="${ariaExpanded}"`,
        );
      });
    });
  });

  it("should test basic interactions with what we find", () => {
    // Test typing in any visible input we find
    cy.get("input").should("have.length.at.least", 1);

    // Find visible inputs only
    cy.get("input:visible").first().should("exist");
    cy.get("input:visible").first().type("test value");
    cy.get("input:visible").first().should("have.value", "test value");

    // Test any visible textarea we find
    cy.get("textarea:visible").first().should("exist");
    cy.get("textarea:visible").first().type("test message");
    cy.get("textarea:visible").first().should("have.value", "test message");

    // Log what we found for analysis
    cy.get("input").then(($inputs) => {
      cy.log("Total inputs found:", $inputs.length);
    });
    cy.get("input:visible").then(($visibleInputs) => {
      cy.log("Visible inputs found:", $visibleInputs.length);
    });
    cy.get("textarea").then(($textareas) => {
      cy.log("Total textareas found:", $textareas.length);
    });
    cy.get("textarea:visible").then(($visibleTextareas) => {
      cy.log("Visible textareas found:", $visibleTextareas.length);
    });
  });
});
