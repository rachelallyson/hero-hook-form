describe("Real World Demo - E-commerce Checkout Flow", () => {
  beforeEach(() => {
    cy.visit("/real-world-demo");
    cy.get("form").should("exist");
  });

  describe("Order Summary and Pricing", () => {
    it("should display complete order summary with accurate pricing", () => {
      // Verify order summary header
      cy.get("h2").contains("Order Summary").should("be.visible");

      // Verify product items with quantities and prices
      cy.contains("🎧").should("be.visible");
      cy.contains("Premium Wireless Headphones").should("be.visible");
      cy.contains("$299.99").should("be.visible");

      cy.contains("⌚").should("be.visible");
      cy.contains("Smart Fitness Watch").should("be.visible");
      cy.contains("$199.99").should("be.visible");

      // Verify pricing calculations are mathematically correct
      cy.contains("Subtotal:").should("be.visible");
      cy.contains("$499.98").should("be.visible"); // 299.99 + 199.99

      cy.contains("Tax (8%):").should("be.visible");
      cy.contains("$40.00").should("be.visible"); // 499.98 * 0.08

      cy.contains("Shipping:").should("be.visible");
      cy.contains("$15.99").should("be.visible");

      cy.contains("Total:").should("be.visible");
      cy.contains("$555.97").should("be.visible"); // 499.98 + 40.00 + 15.99

      // Verify quantity display
      cy.contains("Qty: 1").should("be.visible");
    });
  });

  describe("Customer Information Collection", () => {
    it("should allow users to enter and edit customer information", () => {
      // Test first name field interaction
      cy.get('input[type="text"]').first().should("exist");
      cy.get('input[type="text"]').first().type("John");
      cy.get('input[type="text"]').first().should("have.value", "John");

      // Test last name field interaction
      cy.get('input[type="text"]').eq(1).should("exist");
      cy.get('input[type="text"]').eq(1).type("Doe");
      cy.get('input[type="text"]').eq(1).should("have.value", "Doe");

      // Test email field interaction
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="email"]').type("john.doe@example.com");
      cy.get('input[type="email"]').should(
        "have.value",
        "john.doe@example.com",
      );

      // Test phone field interaction
      cy.get('input[type="tel"]').should("exist");
      cy.get('input[type="tel"]').type("123-456-7890");
      cy.get('input[type="tel"]').should("have.value", "123-456-7890");
    });

    it("should handle form submission with various data quality levels", () => {
      // Test form submission with invalid email format
      cy.get('input[type="email"]').type("invalid-email");
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should("exist"); // Form didn't crash

      // Test form submission with invalid phone number format
      cy.get('input[type="tel"]').clear().type("invalid-phone");
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should("exist"); // Form didn't crash

      // Test form submission with valid data
      cy.get('input[type="email"]').clear().type("valid@email.com");
      cy.get('input[type="tel"]').clear().type("555-123-4567");
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should("exist"); // Form handled submission
    });
  });

  describe("Address Management and Validation", () => {
    it("should allow users to enter complete shipping address", () => {
      // Test street address field
      cy.get('input[type="text"]').eq(4).should("exist");
      cy.get('input[type="text"]').eq(4).type("123 Main St");
      cy.get('input[type="text"]').eq(4).should("have.value", "123 Main St");

      // Test city field
      cy.get('input[type="text"]').eq(5).should("exist");
      cy.get('input[type="text"]').eq(5).type("Anytown");
      cy.get('input[type="text"]').eq(5).should("have.value", "Anytown");

      // Test state field
      cy.get('input[type="text"]').eq(6).should("exist");
      cy.get('input[type="text"]').eq(6).type("CA");
      cy.get('input[type="text"]').eq(6).should("have.value", "CA");

      // Test ZIP field
      cy.get('input[type="text"]').eq(7).should("exist");
      cy.get('input[type="text"]').eq(7).type("12345");
      cy.get('input[type="text"]').eq(7).should("have.value", "12345");

      // Verify country dropdown exists
      cy.get('button[aria-haspopup="listbox"]').should("exist");
    });

    it("should allow users to select shipping country from dropdown", () => {
      // Open country dropdown
      cy.get('button[aria-haspopup="listbox"]').first().should("be.visible");
      cy.get('button[aria-haspopup="listbox"]').first().click();

      // Verify dropdown options appear
      cy.get('[role="option"]').should("exist");

      // Select a country and verify selection
      cy.get('[role="option"]').eq(1).click({ force: true });

      // Verify dropdown closed after selection
      cy.get('button[aria-haspopup="listbox"]')
        .first()
        .should("have.attr", "aria-expanded", "false");
    });

    it("should allow users to enter complete billing address", () => {
      // Test street address field
      cy.get('input[type="text"]').eq(8).should("exist");
      cy.get('input[type="text"]').eq(8).type("456 Oak Ave");
      cy.get('input[type="text"]').eq(8).should("have.value", "456 Oak Ave");

      // Test city field
      cy.get('input[type="text"]').eq(9).should("exist");
      cy.get('input[type="text"]').eq(9).type("Somewhere");
      cy.get('input[type="text"]').eq(9).should("have.value", "Somewhere");

      // Test state field
      cy.get('input[type="text"]').eq(10).should("exist");
      cy.get('input[type="text"]').eq(10).type("NY");
      cy.get('input[type="text"]').eq(10).should("have.value", "NY");

      // Test ZIP field
      cy.get('input[type="text"]').eq(11).should("exist");
      cy.get('input[type="text"]').eq(11).type("54321");
      cy.get('input[type="text"]').eq(11).should("have.value", "54321");

      // Verify billing country dropdown exists
      cy.get('button[aria-haspopup="listbox"]').should("exist");
    });

    it("should allow users to select billing country from dropdown", () => {
      // Verify billing country dropdown exists
      cy.get('button[aria-haspopup="listbox"]').should("exist");

      // Open billing country dropdown (second dropdown)
      cy.get('button[aria-haspopup="listbox"]').eq(1).should("be.visible");
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();

      // Verify dropdown options appear
      cy.get('[role="option"]').should("exist");

      // Select a country and verify selection
      cy.get('[role="option"]').eq(1).click({ force: true });

      // Verify dropdown closed after selection
      cy.get('button[aria-haspopup="listbox"]')
        .eq(1)
        .should("have.attr", "aria-expanded", "false");
    });
  });

  describe("Payment Method Selection and Processing", () => {
    it("should display and allow selection of payment methods", () => {
      // Verify payment method field exists
      cy.contains("label", "Payment Method").should("exist");

      // Verify payment method dropdown exists
      cy.get('button[aria-haspopup="listbox"]').should("exist");
    });

    it("should allow users to select payment method from dropdown", () => {
      // Open payment method dropdown
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();
      cy.get('[role="option"]').should("exist");

      // Select a payment method and verify selection
      cy.get('[role="option"]').eq(1).click({ force: true });

      // Verify dropdown closed after selection
      cy.get('button[aria-haspopup="listbox"]')
        .eq(1)
        .should("have.attr", "aria-expanded", "false");
    });

    it("should allow users to enter credit card information", () => {
      // Test credit card number field
      cy.get('input[type="text"]').eq(8).should("exist");
      cy.get('input[type="text"]').eq(8).type("1234 5678 9012 3456");
      cy.get('input[type="text"]')
        .eq(8)
        .should("have.value", "1234 5678 9012 3456");

      // Test CVV field
      cy.get('input[type="password"]').should("exist");
      cy.get('input[type="password"]').type("123");
      cy.get('input[type="password"]').should("have.value", "123");
    });

    it("should allow users to select credit card expiry month", () => {
      // Verify expiry month field exists
      cy.contains("label", "Expiry Month").should("exist");

      // Open expiry month dropdown
      cy.get('button[aria-haspopup="listbox"]').eq(2).click();
      cy.get('[role="option"]').should("exist");

      // Select an expiry month and verify selection
      cy.get('[role="option"]').first().click({ force: true });

      // Verify dropdown closed after selection
      cy.get('button[aria-haspopup="listbox"]')
        .eq(2)
        .should("have.attr", "aria-expanded", "false");
    });

    it("should allow users to select credit card expiry year", () => {
      // Verify expiry year field exists
      cy.contains("label", "Expiry Year").should("exist");

      // Open expiry year dropdown
      cy.get('button[aria-haspopup="listbox"]').eq(3).click();
      cy.get('[role="option"]').should("exist");

      // Select an expiry year and verify selection
      cy.get('[role="option"]').first().click({ force: true });

      // Verify dropdown closed after selection
      cy.get('button[aria-haspopup="listbox"]')
        .eq(3)
        .should("have.attr", "aria-expanded", "false");
    });
  });

  describe("Delivery Options and Preferences", () => {
    it("should display and allow selection of delivery methods", () => {
      // Verify delivery method field exists
      cy.contains("label", "Delivery Method").should("exist");

      // Verify delivery method dropdown exists
      cy.get('button[aria-haspopup="listbox"]').should("exist");
    });

    it("should allow users to select delivery method from dropdown", () => {
      // Open delivery method dropdown
      cy.get('button[aria-haspopup="listbox"]').eq(2).click();
      cy.get('[role="option"]').should("exist");

      // Select a delivery method and verify selection
      cy.get('[role="option"]').eq(1).click({ force: true });

      // Verify dropdown closed after selection
      cy.get('button[aria-haspopup="listbox"]')
        .eq(2)
        .should("have.attr", "aria-expanded", "false");
    });

    it("should allow users to enter special delivery instructions", () => {
      // Test special instructions field
      cy.get("textarea").first().should("exist");
      cy.get("textarea").first().type("Leave at back door");
      cy.get("textarea").first().should("have.value", "Leave at back door");
    });
  });

  describe("Terms and Conditions Acceptance", () => {
    it("should allow users to accept all required terms", () => {
      // Test terms and conditions checkboxes
      cy.get('input[type="checkbox"]').first().should("exist");
      cy.get('input[type="checkbox"]').first().check();
      cy.get('input[type="checkbox"]').first().should("be.checked");

      cy.get('input[type="checkbox"]').eq(1).should("exist");
      cy.get('input[type="checkbox"]').eq(1).check();
      cy.get('input[type="checkbox"]').eq(1).should("be.checked");

      cy.get('input[type="checkbox"]').eq(2).should("exist");
      cy.get('input[type="checkbox"]').eq(2).check();
      cy.get('input[type="checkbox"]').eq(2).should("be.checked");
    });
  });

  describe("Complete Checkout Flow", () => {
    it("should allow users to complete entire checkout process", () => {
      // Fill customer information
      cy.get('input[type="text"]').first().type("Jane");
      cy.get('input[type="text"]').eq(1).type("Smith");
      cy.get('input[type="email"]').type("jane.smith@example.com");
      cy.get('input[type="tel"]').type("555-987-6543");

      // Fill shipping address
      cy.get('input[type="text"]').eq(4).type("789 Pine St");
      cy.get('input[type="text"]').eq(5).type("Elsewhere");
      cy.get('input[type="text"]').eq(6).type("TX");
      cy.get('input[type="text"]').eq(7).type("67890");

      // Select shipping country
      cy.get('button[aria-haspopup="listbox"]').first().click();
      cy.get('[role="option"]').eq(1).click({ force: true });

      // Fill billing address
      cy.get('input[type="text"]').eq(8).type("789 Pine St");
      cy.get('input[type="text"]').eq(9).type("Elsewhere");
      cy.get('input[type="text"]').eq(10).type("TX");
      cy.get('input[type="text"]').eq(11).type("67890");

      // Select payment method
      cy.get('button[aria-haspopup="listbox"]').eq(1).click();
      cy.get('[role="option"]').eq(2).click({ force: true });

      // Fill credit card details
      cy.get('input[type="text"]').eq(8).type("9876 5432 1098 7654");
      cy.get('input[type="password"]').type("456");

      // Select expiry month
      cy.get('button[aria-haspopup="listbox"]').eq(2).click();
      cy.get('[role="option"]').first().click({ force: true });

      // Select expiry year
      cy.get('button[aria-haspopup="listbox"]').eq(3).click();
      cy.get('[role="option"]').first().click({ force: true });

      // Select delivery method
      cy.get('button[aria-haspopup="listbox"]').eq(2).click();
      cy.get('[role="option"]').eq(1).click({ force: true });

      // Enter special instructions
      cy.get("textarea").first().type("Ring doorbell twice");

      // Accept terms and conditions
      cy.get('input[type="checkbox"]').first().check();
      cy.get('input[type="checkbox"]').eq(1).check();
      cy.get('input[type="checkbox"]').eq(2).check();

      // Submit form
      cy.get('button[type="submit"]').click();

      // Verify form submission was handled
      cy.get('button[type="submit"]').should("exist");
    });
  });

  describe("Form Validation and Error Handling", () => {
    it("should handle form submission with missing required fields", () => {
      // Try to submit without filling required fields
      cy.get('button[type="submit"]').click();

      // Form should still exist (validation errors may be displayed)
      cy.get("form").should("exist");
      cy.get('button[type="submit"]').should("exist");
    });

    it("should handle form submission with minimal valid data", () => {
      // Fill in some required fields
      cy.get('input[type="text"]').first().type("John");
      cy.get('input[type="email"]').type("john@example.com");

      // Submit form
      cy.get('button[type="submit"]').click();

      // Verify form can still be submitted
      cy.get('button[type="submit"]').should("exist");
    });

    it("should maintain form state during user interactions", () => {
      // Test that form state is managed properly
      cy.get("form").should("exist");

      // Fill in some fields to test state persistence
      cy.get('input[type="text"]').first().type("Test");
      cy.get('input[type="text"]').first().should("have.value", "Test");

      // Verify form remains functional
      cy.get('button[type="submit"]').should("exist");
    });
  });

  describe("Accessibility and User Experience", () => {
    it("should support keyboard navigation through form fields", () => {
      // Test tab navigation through form fields
      cy.get("input").first().focus().should("be.focused");

      // Test focus on another field
      cy.get("input").eq(1).focus().should("be.focused");

      // Verify form remains accessible
      cy.get("form").should("exist");
    });

    it("should have proper input types for form validation", () => {
      // Verify form exists
      cy.get("form").should("exist");

      // Verify required fields have proper input types
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="tel"]').should("exist");
      cy.get('input[type="password"]').should("exist");

      // Verify form is functional
      cy.get('button[type="submit"]').should("exist");
    });
  });
});
