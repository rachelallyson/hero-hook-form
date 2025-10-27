// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import the form testing helpers
import '@rachelallyson/hero-hook-form/cypress'

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  // Hide fetch requests
  const originalFetch = win.fetch;
  win.fetch = (...args) => {
    return originalFetch(...args);
  };
});

// Configure Cypress to handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Don't fail tests on uncaught exceptions from the app
  return false;
});
