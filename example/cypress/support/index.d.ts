/// <reference types="cypress" />

// Import type definitions from hero-hook-form package
// This augments the Cypress namespace with all package custom commands
import type {} from "@rachelallyson/hero-hook-form/cypress";

// Declare example-specific custom commands only
declare global {
  namespace Cypress {
    interface Chainable {
      // Example-specific: Test form submission with console verification
      testFormSubmission(): Chainable<void>;
    }
  }
}
