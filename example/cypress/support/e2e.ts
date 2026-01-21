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
import "./commands";
import { registerHeroFormCommands } from "@rachelallyson/hero-hook-form/cypress";
import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";

// Manually register the commands
registerHeroFormCommands();

installLogsCollector({
  // add back in 'cy:command' if you want more
  collectTypes: [
    "cons:log",
    "cons:info",
    "cons:error",
    "cy:log",
    "cy:xhr",
    "cy:intercept",
    "cy:command",
  ],
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
