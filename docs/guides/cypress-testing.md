# Cypress Testing Guide

Learn how to use Hero Hook Form's comprehensive Cypress testing helpers for reliable form testing.

## Setup

### Installation

```bash
npm install @rachelallyson/hero-hook-form
```

### Import Helpers

Add to your `cypress/support/e2e.ts`:

```typescript
// Import all Cypress helpers
import '@rachelallyson/hero-hook-form/cypress';

// Or import manually for more control
import { registerHeroFormCommands } from '@rachelallyson/hero-hook-form/cypress';
registerHeroFormCommands();
```

### TypeScript Support

Add to your `cypress/support/index.d.ts`:

```typescript
/// <reference types="@rachelallyson/hero-hook-form/cypress" />
```

## Field Interaction Helpers

### Input Fields

```typescript
// Fill input by type
cy.fillInputByType('email', 'test@example.com');
cy.fillInputByType('password', 'securePassword123');
cy.fillInputByType('tel', '+1-555-123-4567');

// Fill input by label
cy.fillInputByLabel('First Name', 'John');
cy.fillInputByLabel('Email Address', 'john@example.com');

// Fill input by placeholder
cy.fillInputByPlaceholder('Enter your email', 'test@example.com');

// Fill textarea
cy.fillTextarea('This is a long message...');
cy.fillTextarea('Another message', 1); // Second textarea
```

### Selection Fields

```typescript
// Select dropdown by label
cy.selectDropdownByLabel('Country', 'United States');
cy.selectDropdownByLabel('State', 'California');

// Select dropdown by option value
cy.selectDropdownOption('US');
cy.selectDropdownOption('CA', 1); // Second dropdown

// Radio group selection
cy.selectRadioByLabel('Gender', 'Male');
cy.selectRadioByValue('premium');
```

### Boolean Fields

```typescript
// Checkboxes
cy.checkCheckboxByLabel('Terms and Conditions');
cy.checkCheckboxByLabel('Subscribe to newsletter');
cy.checkCheckbox(0); // First checkbox
cy.checkCheckbox(1); // Second checkbox

// Uncheck checkboxes
cy.uncheckCheckboxByLabel('Marketing emails');
cy.uncheckCheckbox(0);

// Switches
cy.checkSwitchByLabel('Enable notifications');
cy.checkSwitch(0); // First switch
cy.uncheckSwitchByLabel('Dark mode');
```

### Special Fields

```typescript
// Slider
cy.moveSlider(75); // Set slider to 75%
cy.moveSlider(50, 1); // Second slider to 50%

// Date picker
cy.fillDateField('2024-12-25');
cy.fillDateField('2024-01-01', 1); // Second date field

// File upload
cy.uploadFile('avatar.jpg');
cy.uploadFile('document.pdf', 1); // Second file field
```

## Validation Testing

### Error Validation

```typescript
// Expect specific validation errors
cy.expectValidationError('Email is required');
cy.expectValidationError('Password must be at least 8 characters');
cy.expectFieldError('Email', 'Invalid email address');

// Expect no validation errors
cy.expectNoValidationErrors();

// Check if field is valid
cy.expectFieldValid('Email');
cy.expectFieldValid('Password');
```

### Trigger Validation

```typescript
// Trigger validation by submitting form
cy.triggerValidation();

// Trigger validation by clicking specific button
cy.triggerValidation('submit-button');

// Test real-time validation
cy.testRealTimeValidation('email', 'invalid-email');
cy.testRealTimeValidation('password', 'weak');
```

### Validation Patterns

```typescript
// Test specific validation patterns
cy.testEmailValidation('test@example.com', true);
cy.testEmailValidation('invalid-email', false);

cy.testPhoneValidation('+1-555-123-4567', true);
cy.testPhoneValidation('invalid-phone', false);

cy.testPasswordValidation('SecurePass123!', true);
cy.testPasswordValidation('weak', false);

// Test required fields
cy.testRequiredFieldsValidation();
```

## Form Submission

### Basic Submission

```typescript
// Submit form
cy.submitForm();

// Submit and expect success
cy.submitAndExpectSuccess();
cy.submitAndExpectSuccess('Thank you for your submission');

// Submit and expect errors
cy.submitAndExpectErrors();
```

### Intercepted Submission

```typescript
// Intercept form submission
cy.interceptFormSubmission('POST', '/api/contact', 'contactSubmission');

// Wait for submission to complete
cy.wait('@contactSubmission');

// Verify submission data
cy.get('@contactSubmission').then((interception) => {
  expect(interception.request.body).to.deep.include({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

### Reset Form

```typescript
// Reset form to initial state
cy.resetForm();

// Clear all fields
cy.clearForm();
```

## Form State Verification

### Form Existence

```typescript
// Verify form exists
cy.verifyFormExists();

// Verify specific fields exist
cy.verifyFieldExists('[name="email"]');
cy.verifyFieldExists('[data-testid="phone-input"]');

// Verify field count
cy.verifyFieldCount('input[type="text"]', 3);
cy.verifyFieldCount('select', 2);
```

### Field Values

```typescript
// Verify field values
cy.verifyFieldValue('[name="email"]', 'test@example.com');
cy.verifyFieldValue('[name="firstName"]', 'John');

// Get all form data
cy.getFormData().then((formData) => {
  expect(formData).to.deep.include({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  });
});
```

## Complex Form Flows

### Complete Form Filling

```typescript
// Fill entire form with data object
cy.fillCompleteForm({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1-555-123-4567',
  country: 'United States',
  state: 'California',
  agreeToTerms: true,
  subscribeToNewsletter: false,
  message: 'This is a test message'
});
```

### Field Interaction Testing

```typescript
// Test specific field interactions
cy.testFieldInteraction('email', 'test@example.com');
cy.testFieldInteraction('password', 'SecurePass123!');
cy.testFieldInteraction('checkbox', 'agreeToTerms');
```

### Multi-Step Form Flows

```typescript
// Test complex form flows
cy.testFormFlow([
  { action: 'fill', field: 'firstName', value: 'John' },
  { action: 'fill', field: 'lastName', value: 'Doe' },
  { action: 'fill', field: 'email', value: 'john@example.com' },
  { action: 'select', field: 'country', value: 'United States' },
  { action: 'check', field: 'agreeToTerms' },
  { action: 'submit' },
  { action: 'expectSuccess', message: 'Registration successful' }
]);
```

## Convenience Commands

### Quick Field Filling

```typescript
// Convenience commands for common fields
cy.fillEmail('test@example.com');
cy.fillPhone('+1-555-123-4567');
cy.fillPassword('SecurePass123!');
cy.fillText('This is some text');
```

## Debug Commands

### Form State Debugging

```typescript
// Log current form state
cy.logFormState();

// Wait for form to be ready
cy.waitForFormReady();

// Verify form is valid
cy.verifyFormValid();

// Take screenshot of form
cy.screenshotForm('contact-form');
cy.screenshotForm(); // Auto-generated name
```

## Advanced Testing Patterns

### Conditional Fields

```typescript
// Test conditional field behavior
describe('Conditional Fields', () => {
  it('shows phone field when checkbox is checked', () => {
    cy.visit('/contact-form');
    
    // Initially phone field should not exist
    cy.get('[name="phone"]').should('not.exist');
    
    // Check the "has phone" checkbox
    cy.checkCheckboxByLabel('I have a phone number');
    
    // Phone field should now be visible
    cy.get('[name="phone"]').should('be.visible');
    
    // Fill the phone field
    cy.fillInputByLabel('Phone Number', '+1-555-123-4567');
  });
});
```

### Field Arrays

```typescript
// Test field arrays
describe('Field Arrays', () => {
  it('adds and removes items', () => {
    cy.visit('/shopping-cart');
    
    // Add first item
    cy.get('[data-testid="add-item"]').click();
    cy.fillInputByLabel('Item Name', 'Product 1');
    cy.fillInputByLabel('Quantity', '2');
    
    // Add second item
    cy.get('[data-testid="add-item"]').click();
    cy.fillInputByLabel('Item Name', 'Product 2');
    cy.fillInputByLabel('Quantity', '1');
    
    // Remove first item
    cy.get('[data-testid="remove-item-0"]').click();
    cy.get('[name="items.0.name"]').should('not.exist');
  });
});
```

### Dynamic Sections

```typescript
// Test dynamic sections
describe('Dynamic Sections', () => {
  it('shows preferences section when enabled', () => {
    cy.visit('/settings');
    
    // Enable preferences
    cy.checkSwitchByLabel('Customize preferences');
    
    // Preferences section should be visible
    cy.get('[data-testid="preferences-section"]').should('be.visible');
    
    // Fill preferences
    cy.selectDropdownByLabel('Theme', 'Dark');
    cy.checkSwitchByLabel('Enable notifications');
  });
});
```

### Error Recovery

```typescript
// Test error recovery
describe('Error Recovery', () => {
  it('recovers from validation errors', () => {
    cy.visit('/contact-form');
    
    // Submit with invalid data
    cy.fillInputByLabel('Email', 'invalid-email');
    cy.submitForm();
    
    // Should show validation error
    cy.expectValidationError('Invalid email address');
    
    // Fix the error
    cy.fillInputByLabel('Email', 'valid@example.com');
    
    // Error should be cleared
    cy.expectNoValidationErrors();
    
    // Submit successfully
    cy.submitAndExpectSuccess();
  });
});
```

## Performance Testing

### Form Performance

```typescript
// Test form performance
describe('Form Performance', () => {
  it('renders within performance budget', () => {
    const start = performance.now();
    
    cy.visit('/contact-form');
    cy.verifyFormExists();
    
    const end = performance.now();
    const renderTime = end - start;
    
    expect(renderTime).to.be.lessThan(1000); // 1 second budget
  });
});
```

### Large Form Testing

```typescript
// Test large forms
describe('Large Form Performance', () => {
  it('handles many fields efficiently', () => {
    cy.visit('/large-form');
    
    // Fill form with many fields
    cy.fillCompleteForm({
      field1: 'value1',
      field2: 'value2',
      // ... many more fields
    });
    
    // Should still be responsive
    cy.submitAndExpectSuccess();
  });
});
```

## Best Practices

### 1. Use Semantic Selectors

```typescript
// ✅ Good: Use semantic selectors
cy.fillInputByLabel('Email Address', 'test@example.com');
cy.selectDropdownByLabel('Country', 'United States');
cy.checkCheckboxByLabel('Terms and Conditions');

// ❌ Bad: Use implementation selectors
cy.get('[data-testid="email-input"]').type('test@example.com');
cy.get('[data-testid="country-select"]').select('US');
cy.get('[data-testid="terms-checkbox"]').check();
```

### 2. Test User Interactions

```typescript
// ✅ Good: Test user behavior
cy.fillInputByLabel('Email', 'test@example.com');
cy.submitForm();
cy.expectValidationError('Email is required');

// ❌ Bad: Test implementation details
cy.get('[name="email"]').should('have.value', 'test@example.com');
```

### 3. Use Data Objects

```typescript
// ✅ Good: Use structured data
const formData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  country: 'United States',
  agreeToTerms: true
};

cy.fillCompleteForm(formData);

// ❌ Bad: Fill fields individually
cy.fillInputByLabel('First Name', 'John');
cy.fillInputByLabel('Last Name', 'Doe');
cy.fillInputByLabel('Email', 'john@example.com');
// ... many more lines
```

### 4. Test Error States

```typescript
// ✅ Good: Test error scenarios
cy.fillInputByLabel('Email', 'invalid-email');
cy.submitForm();
cy.expectValidationError('Invalid email address');

// ❌ Bad: Only test happy path
cy.fillInputByLabel('Email', 'valid@example.com');
cy.submitForm();
cy.expectSuccess();
```

## Troubleshooting

### Common Issues

#### 1. Element Not Found

**Error**: `Timed out retrying: cy.get() failed because the element was not found`

**Fix**: Use semantic selectors and wait for elements

```typescript
// ❌ Problem
cy.get('[name="email"]').type('test@example.com');

// ✅ Solution
cy.fillInputByLabel('Email', 'test@example.com');
// or
cy.waitForFormReady();
cy.get('[name="email"]').type('test@example.com');
```

#### 2. Validation Errors Not Showing

**Error**: Validation errors not appearing in tests

**Fix**: Trigger validation explicitly

```typescript
// ❌ Problem
cy.fillInputByLabel('Email', 'invalid-email');
cy.expectValidationError('Invalid email');

// ✅ Solution
cy.fillInputByLabel('Email', 'invalid-email');
cy.triggerValidation();
cy.expectValidationError('Invalid email');
```

#### 3. Form Submission Failing

**Error**: Form submission not working

**Fix**: Wait for form to be ready and use proper submission

```typescript
// ❌ Problem
cy.get('button[type="submit"]').click();

// ✅ Solution
cy.submitForm();
// or
cy.waitForFormReady();
cy.get('button[type="submit"]').click();
```

## Command Reference

### Field Interactions

- `fillInputByType(type, value, index?, options?)`
- `fillInputByPlaceholder(placeholder, value, options?)`
- `fillInputByLabel(label, value, options?)`
- `fillTextarea(value, index?, options?)`
- `selectDropdownOption(optionValue, dropdownIndex?)`
- `selectDropdownByLabel(label, optionValue)`
- `checkCheckbox(index?)`
- `checkCheckboxByLabel(label)`
- `checkSwitch(index?)`
- `uncheckCheckbox(index?)`
- `uncheckSwitch(index?)`
- `moveSlider(value, index?)`

### Validation

- `expectValidationError(message)`
- `expectNoValidationErrors()`
- `expectFieldError(fieldLabel, errorMessage)`
- `expectFieldValid(fieldLabel)`
- `triggerValidation(submitButton?)`

### Submission

- `submitForm()`
- `submitAndExpectSuccess(successIndicator?)`
- `submitAndExpectErrors()`
- `resetForm()`
- `interceptFormSubmission(method, url, alias)`

### State

- `verifyFormExists()`
- `verifyFieldExists(selector)`
- `verifyFieldValue(selector, value)`
- `verifyFieldCount(selector, count)`
- `getFormData()`

### Complex Flows

- `fillCompleteForm(formData)`
- `testFieldInteraction(fieldType, value)`
- `testFormFlow(steps)`

### Convenience

- `fillEmail(value)`
- `fillPhone(value)`
- `fillPassword(value)`
- `fillText(value)`

### Debug

- `logFormState()`
- `waitForFormReady()`
- `clearForm()`
- `verifyFormValid()`
- `screenshotForm(name?)`
