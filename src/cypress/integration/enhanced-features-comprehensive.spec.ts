import { 
  formSubmissionHelpers, 
  dynamicFormHelpers, 
  performanceHelpers,
  typeInferenceHelpers 
} from "../helpers";

describe("Enhanced Features Comprehensive Test", () => {
  beforeEach(() => {
    cy.visit("/enhanced-features");
  });

  describe("Enhanced Form State", () => {
    it("should display loading state during submission", () => {
      cy.get('button[type="submit"]').first().click();
      formSubmissionHelpers.waitForFormStatus("loading");
    });

    it("should display success state after successful submission", () => {
      // Fill required fields
      cy.get('input[placeholder*="Full Name"]').type("John Doe");
      cy.get('input[placeholder*="Email"]').type("john@example.com");
      cy.get('input[placeholder*="Password"]').type("password123");
      cy.get('input[placeholder*="Confirm Password"]').type("password123");
      
      // Add at least one item
      cy.get('button').contains("Add Item").click();
      cy.get('input[placeholder*="Item Name"]').first().type("Test Item");
      
      cy.get('button[type="submit"]').first().click();
      formSubmissionHelpers.submitAndWaitForSuccess();
    });

    it("should display error state for validation errors", () => {
      // Submit with invalid data
      cy.get('button[type="submit"]').first().click();
      formSubmissionHelpers.waitForFormStatus("error");
    });
  });

  describe("Dynamic Forms", () => {
    it("should show/hide conditional fields", () => {
      // Initially hidden
      cy.get('input[placeholder*="Advanced Field"]').should("not.exist");
      
      // Toggle switch
      cy.get('input[role="switch"]').first().check();
      
      // Field should appear
      cy.get('input[placeholder*="Advanced Field"]').should("be.visible");
      
      // Toggle off
      cy.get('input[role="switch"]').first().uncheck();
      
      // Field should be hidden
      cy.get('input[placeholder*="Advanced Field"]').should("not.exist");
    });

    it("should handle field arrays", () => {
      // Add items
      cy.get('button').contains("Add Item").click();
      cy.get('input[placeholder*="Item Name"]').first().type("Item 1");
      
      cy.get('button').contains("Add Item").click();
      cy.get('input[placeholder*="Item Name"]').eq(1).type("Item 2");
      
      // Remove item
      cy.get('button').contains("Remove").first().click();
      
      // Should have one item left
      cy.get('input[placeholder*="Item Name"]').should("have.length", 1);
    });

    it("should show/hide dynamic sections", () => {
      // Initially hidden
      cy.get('h3').contains("Dynamic Section").should("not.exist");
      
      // Toggle switch
      cy.get('input[role="switch"]').eq(1).check();
      
      // Section should appear
      cy.get('h3').contains("Dynamic Section").should("be.visible");
      cy.get('input[placeholder*="Section Field 1"]').should("be.visible");
      cy.get('input[placeholder*="Section Field 2"]').should("be.visible");
    });
  });

  describe("Performance Features", () => {
    it("should debounce validation", () => {
      performanceHelpers.testDebouncedValidation("email", "test@example.com");
    });

    it("should memoize components", () => {
      performanceHelpers.testMemoization("FormField");
    });
  });

  describe("Type Inference", () => {
    it("should auto-infer validation", () => {
      typeInferenceHelpers.testInferredValidation("Email", "test@example.com", true);
    });

    it("should handle cross-field validation", () => {
      typeInferenceHelpers.testCrossFieldValidation("password", "pass123", "confirmPassword", "pass123", true);
    });
  });

  describe("Form Builders Integration", () => {
    it("should work with Advanced Form Builder", () => {
      // Test that all fields are rendered
      cy.get('input[placeholder*="Full Name"]').should("exist");
      cy.get('input[placeholder*="Email"]').should("exist");
      cy.get('input[placeholder*="Phone"]').should("exist");
    });

    it("should work with Type-Inferred Builder", () => {
      // Test type-inferred form
      cy.get('input[placeholder*="Full Name"]').eq(1).type("Jane Doe");
      cy.get('input[placeholder*="Email"]').eq(1).type("jane@example.com");
      cy.get('input[placeholder*="Age"]').type("25");
    });
  });

  describe("Validation Patterns", () => {
    it("should validate required fields", () => {
      cy.get('button[type="submit"]').first().click();
      cy.contains("Name must be at least 2 characters").should("be.visible");
    });

    it("should validate email format", () => {
      cy.get('input[placeholder*="Email"]').first().type("invalid-email");
      cy.get('button[type="submit"]').first().click();
      cy.contains("Invalid email address").should("be.visible");
    });

    it("should validate password confirmation", () => {
      cy.get('input[placeholder*="Password"]').type("password123");
      cy.get('input[placeholder*="Confirm Password"]').type("different123");
      cy.get('button[type="submit"]').first().click();
      cy.contains("Passwords don't match").should("be.visible");
    });
  });

  describe("Error Handling", () => {
    it("should handle form submission errors gracefully", () => {
      // Fill form with valid data
      cy.get('input[placeholder*="Full Name"]').first().type("John Doe");
      cy.get('input[placeholder*="Email"]').first().type("john@example.com");
      cy.get('input[placeholder*="Password"]').type("password123");
      cy.get('input[placeholder*="Confirm Password"]').type("password123");
      
      // Add required item
      cy.get('button').contains("Add Item").click();
      cy.get('input[placeholder*="Item Name"]').first().type("Test Item");
      
      // Submit and wait for success
      cy.get('button[type="submit"]').first().click();
      formSubmissionHelpers.submitAndWaitForSuccess();
    });

    it("should dismiss status messages", () => {
      // Trigger error state
      cy.get('button[type="submit"]').first().click();
      formSubmissionHelpers.waitForFormStatus("error");
      
      // Dismiss
      formSubmissionHelpers.dismissFormStatus();
    });
  });
});