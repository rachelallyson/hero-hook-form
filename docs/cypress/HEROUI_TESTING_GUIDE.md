# HeroUI Component Testing Guide

## Overview

This guide provides systematic rules and patterns for testing HeroUI components in Cypress. Based on our analysis, HeroUI components have specific DOM structures and attributes that differ from standard HTML elements.

## Key Findings from Analysis

### 1. Input Components

**HeroUI Input renders as:**

- **Main input**: `<input type="text">` with `id="react-aria-*"` (unique React aria ID)
- **Attributes**: `type`, `placeholder`, `class` (extensive Tailwind classes)
- **Name attribute**: ✅ **SUPPORTED** - HeroUI Input forwards the `name` prop to the DOM

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use name attribute (if provided)
cy.get('input[name="firstName"]').type("value");

// ✅ CORRECT: Use type attribute
cy.get('input[type="text"]').type("value");

// ✅ CORRECT: Use placeholder text
cy.get('input[placeholder="Type something..."]').type("value");

// ✅ CORRECT: Use React aria ID (if stable)
cy.get('#react-aria-_R_26inebnalb_').type("value");
```

### 2. Select Components

**HeroUI Select renders as:**

- **Trigger button**: `<button aria-haspopup="listbox" aria-expanded="false">`
- **Hidden select**: `<select>` (but this is not interactive)
- **Dropdown options**: `<div role="option">` (when expanded)

**Testing Strategy:**

```typescript
// ✅ CORRECT: Click the trigger button
cy.get('button[aria-haspopup="listbox"]').click();

// ✅ CORRECT: Wait for options to appear
cy.get('[role="option"]').should("exist");

// ✅ CORRECT: Select an option
cy.get('[role="option"]').first().click();

// ❌ WRONG: Don't use standard select methods
cy.get("select").select("option"); // This will NOT work
```

## Complete HeroUI Dropdown Testing Guide

### Understanding HeroUI Dropdowns

HeroUI dropdowns are **NOT** standard HTML `<select>` elements. They're custom components that:

1. **Render a button** as the trigger
2. **Show options** in a popover/dropdown when clicked
3. **Use ARIA attributes** for accessibility
4. **Have complex state management** (expanded/collapsed)

### Step-by-Step Dropdown Testing

#### 1. **Find the Dropdown Trigger**

```typescript
// Find by aria-haspopup attribute (most reliable)
cy.get('button[aria-haspopup="listbox"]').should("exist");

// Find by label text (if you know the field label)
cy.contains("label", "Country").parent().find('button[aria-haspopup="listbox"]');

// Find by position if you have multiple dropdowns
cy.get('button[aria-haspopup="listbox"]').first(); // First dropdown
cy.get('button[aria-haspopup="listbox"]').eq(1);   // Second dropdown
```

#### 2. **Open the Dropdown**

```typescript
// Click the trigger button to open
cy.get('button[aria-haspopup="listbox"]').click();

// Verify the dropdown is now expanded
cy.get('button[aria-haspopup="listbox"]').should("have.attr", "aria-expanded", "true");
```

#### 3. **Wait for Options to Appear**

```typescript
// Wait for options to be rendered
cy.get('[role="option"]').should("exist");

// Verify multiple options exist
cy.get('[role="option"]').should("have.length.at.least", 1);
```

#### 4. **Select an Option**

```typescript
// Select by position (most reliable)
cy.get('[role="option"]').first().click();     // First option
cy.get('[role="option"]').eq(1).click();      // Second option
cy.get('[role="option"]').last().click();     // Last option

// Select by text content (if you know the text)
cy.get('[role="option"]').contains("United States").click();

// Select by partial text match
cy.get('[role="option"]').contains("United").click();
```

#### 5. **Verify Selection**

```typescript
// Check that dropdown is collapsed
cy.get('button[aria-haspopup="listbox"]').should("have.attr", "aria-expanded", "false");

// Verify the selected value is displayed
cy.get('button[aria-haspopup="listbox"]').should("contain", "United States");
```

### Complete Dropdown Test Example

```typescript
describe("HeroUI Dropdown Testing", () => {
  it("should select an option from dropdown", () => {
    // 1. Find and click the dropdown trigger
    cy.get('button[aria-haspopup="listbox"]').first().click();
    
    // 2. Wait for options to appear
    cy.get('[role="option"]').should("exist");
    
    // 3. Select the first option
    cy.get('[role="option"]').first().click();
    
    // 4. Verify dropdown is closed
    cy.get('button[aria-haspopup="listbox"]').first()
      .should("have.attr", "aria-expanded", "false");
  });

  it("should select specific option by text", () => {
    // 1. Find dropdown by label
    cy.contains("label", "Country").parent()
      .find('button[aria-haspopup="listbox"]')
      .click();
    
    // 2. Wait for options
    cy.get('[role="option"]').should("exist");
    
    // 3. Select specific option
    cy.get('[role="option"]').contains("Canada").click();
    
    // 4. Verify selection
    cy.get('button[aria-haspopup="listbox"]')
      .should("contain", "Canada");
  });

  it("should handle multiple dropdowns", () => {
    // 1. Select from first dropdown (Country)
    cy.get('button[aria-haspopup="listbox"]').eq(0).click();
    cy.get('[role="option"]').first().click();
    
    // 2. Select from second dropdown (Payment Method)
    cy.get('button[aria-haspopup="listbox"]').eq(1).click();
    cy.get('[role="option"]').eq(1).click();
    
    // 3. Select from third dropdown (Delivery Method)
    cy.get('button[aria-haspopup="listbox"]').eq(2).click();
    cy.get('[role="option"]').last().click();
  });
});
```

### Advanced Dropdown Testing Patterns

#### **Testing Dropdown State Changes**

```typescript
it("should properly manage dropdown state", () => {
  const dropdown = cy.get('button[aria-haspopup="listbox"]').first();
  
  // Initially collapsed
  dropdown.should("have.attr", "aria-expanded", "false");
  
  // Click to expand
  dropdown.click();
  dropdown.should("have.attr", "aria-expanded", "true");
  
  // Select option to collapse
  cy.get('[role="option"]').first().click();
  dropdown.should("have.attr", "aria-expanded", "false");
});
```

#### **Testing Dropdown with Search/Filter**

```typescript
it("should handle searchable dropdown", () => {
  // Open dropdown
  cy.get('button[aria-haspopup="listbox"]').click();
  
  // Look for search input (if it exists)
  cy.get('[role="option"]').should("exist");
  
  // Type in search field if present
  cy.get('input[placeholder*="search"]').type("United");
  
  // Verify filtered results
  cy.get('[role="option"]').should("contain", "United States");
  cy.get('[role="option"]').should("contain", "United Kingdom");
});
```

#### **Testing Dropdown Validation**

```typescript
it("should validate required dropdown selection", () => {
  // Try to submit without selecting
  cy.get('button[type="submit"]').click();
  
  // Look for validation error
  cy.contains("Please select a country").should("exist");
  
  // Select an option
  cy.get('button[aria-haspopup="listbox"]').click();
  cy.get('[role="option"]').first().click();
  
  // Submit again
  cy.get('button[type="submit"]').click();
  
  // Should succeed
  cy.url().should("include", "success");
});
```

### Summary: HeroUI Dropdown Testing

HeroUI dropdowns require a **3-step process**:

1. **Click trigger** (`button[aria-haspopup="listbox"]`)
2. **Wait for options** (`[role="option"]`)
3. **Select option** (by position, text, or index)

This approach ensures your tests are:

- **Reliable**: Based on actual DOM structure
- **Maintainable**: Not dependent on implementation details
- **Accessible**: Tests proper ARIA attribute management
- **Fast**: Efficient element selection and interaction

## Real-World HeroUI Dropdown Behavior

Based on our testing, we discovered that HeroUI dropdowns have some unique characteristics:

### **Key Findings**

1. **Options appear immediately** when dropdown is opened
2. **Options may disappear quickly** after selection or interaction
3. **Timing is critical** - need to act fast before options are removed
4. **Options are `<li>` elements** with `role="option"`, not `<div>`

### **Updated Testing Strategy**

#### **Immediate Selection Approach**

```typescript
// ✅ CORRECT: Open and immediately select
cy.get('button[aria-haspopup="listbox"]').click();
cy.get('[role="option"]').first().click();

// ✅ CORRECT: Use force click if timing is an issue
cy.get('button[aria-haspopup="listbox"]').click();
cy.get('[role="option"]').first().click({ force: true });
```

#### **Timing-Based Approach**

```typescript
// ✅ CORRECT: Add small delay for stability
cy.get('button[aria-haspopup="listbox"]').click();
cy.wait(50); // Small delay for options to stabilize
cy.get('[role="option"]').first().click();
```

#### **Verification-Based Approach**

```typescript
// ✅ CORRECT: Verify selection was made
cy.get('button[aria-haspopup="listbox"]').click();
cy.get('[role="option"]').first().click();

// Verify the selection was actually made
cy.get('button[aria-haspopup="listbox"]').should("contain", "Selected Value");
```

## **Final HeroUI Dropdown Testing Strategy**

Based on our comprehensive testing, here's the **definitive approach** for testing HeroUI dropdowns:

### **✅ MOST RELIABLE: Force Click Approach**

```typescript
// 1. Open dropdown
cy.get('button[aria-haspopup="listbox"]').click();

// 2. Verify options exist
cy.get('[role="option"]').should("exist");

// 3. Select option with force click (handles timing issues)
cy.get('[role="option"]').first().click({ force: true });

// 4. Verify dropdown closed
cy.get('button[aria-haspopup="listbox"]').should("have.attr", "aria-expanded", "false");
```

### **❌ UNRELIABLE: Timing-Based Approach**

```typescript
// ❌ DON'T USE: Timing delays don't work reliably
cy.get('button[aria-haspopup="listbox"]').click();
cy.wait(100); // Options disappear even with delays
cy.get('[role="option"]').first().click(); // Fails
```

### **Key Findings from Testing**

1. **Options appear immediately** when dropdown opens
2. **Options disappear very quickly** - even 100ms delays cause failures
3. **Force clicks are essential** for reliable selection
4. **ARIA attributes work perfectly** for state verification
5. **Multiple dropdowns work sequentially** when handled properly

### **Production-Ready Dropdown Test Pattern**

```typescript
describe("HeroUI Dropdown Testing", () => {
  it("should select from dropdown reliably", () => {
    // Open dropdown
    cy.get('button[aria-haspopup="listbox"]').first().click();
    
    // Verify it's open
    cy.get('button[aria-haspopup="listbox"]').first()
      .should("have.attr", "aria-expanded", "true");
    
    // Select option with force click
    cy.get('[role="option"]').should("exist");
    cy.get('[role="option"]').first().click({ force: true });
    
    // Verify selection was made
    cy.get('button[aria-haspopup="listbox"]').first()
      .should("have.attr", "aria-expanded", "false");
  });
});
```

This approach has been **tested and proven** to work reliably with HeroUI dropdowns.

### 3. Checkbox Components

**HeroUI Checkbox renders as:**

- **Hidden input**: `<input type="checkbox" role="checkbox">` (opacity: 0.0001)
- **Visible label**: Text content in parent container

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use the hidden checkbox input
cy.get('input[type="checkbox"]').check();

// ✅ CORRECT: Verify state
cy.get('input[type="checkbox"]').should("be.checked");

// ✅ CORRECT: Use role attribute
cy.get('[role="checkbox"]').check();

// ❌ WRONG: Don't rely on visibility
cy.get('input[type="checkbox"]:visible'); // May not work due to opacity
```

### 4. Switch Components

**HeroUI Switch renders as:**

- **Hidden input**: `<input type="checkbox" role="switch">` (opacity: 0.0001)
- **Visible toggle**: Styled container

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use the hidden switch input
cy.get('input[role="switch"]').check();

// ✅ CORRECT: Verify state
cy.get('input[role="switch"]').should("be.checked");

// ❌ WRONG: Don't rely on visibility
cy.get('input[role="switch"]:visible'); // May not work due to opacity
```

### 5. Radio Components

**HeroUI RadioGroup renders as:**

- **Radio inputs**: `<input type="radio">` elements with `id="react-aria-*"`
- **Attributes**: `name`, `value`, `class` (extensive Tailwind classes)
- **Name attribute**: ✅ **SUPPORTED** - HeroUI RadioGroup forwards the `name` prop to all radio inputs in the group

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use name attribute (if provided)
cy.get('input[type="radio"][name="plan"]').first().check();

// ✅ CORRECT: Use value attribute
cy.get('input[type="radio"][value="option1"]').check();

// ✅ CORRECT: Combine name and value
cy.get('input[type="radio"][name="plan"][value="pro"]').check();

// ✅ CORRECT: Verify state
cy.get('input[type="radio"][name="plan"][value="pro"]').should("be.checked");

// ✅ CORRECT: Use role attribute
cy.get('[role="radio"]').first().click();
```

### 6. Textarea Components

**HeroUI Textarea renders as:**

- **Main textarea**: `<textarea>` with `id="react-aria-*"`
- **Attributes**: `placeholder`, `class` (extensive Tailwind classes)
- **Name attribute**: ✅ **SUPPORTED** - HeroUI Textarea forwards the `name` prop to the DOM

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use name attribute (if provided)
cy.get('textarea[name="description"]').type("value");

// ✅ CORRECT: Use placeholder text
cy.get('textarea[placeholder="Type a message..."]').type("value");

// ✅ CORRECT: Use React aria ID (if stable)
cy.get('#react-aria-_R_2minebnalb_').type("value");

// ✅ CORRECT: Use generic textarea selector
cy.get("textarea").first().type("value");
```

### 7. Autocomplete Components

**HeroUI Autocomplete renders as:**

- **Main input**: `<input type="text">` with `id="react-aria-*"`
- **Attributes**: `type`, `placeholder`, `class` (extensive Tailwind classes)
- **Name attribute**: ✅ **SUPPORTED** - HeroUI Autocomplete forwards the `name` prop to the DOM

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use name attribute (if provided)
cy.get('input[name="country"]').type("United");

// ✅ CORRECT: Use placeholder text
cy.get('input[placeholder="Search..."]').type("value");

// ✅ CORRECT: Use type attribute
cy.get('input[type="text"]').type("value");
```

### 8. Slider Components

**HeroUI Slider renders as:**

- **Main input**: `<input type="range">` with `id="react-aria-*"`
- **Attributes**: `type`, `class` (extensive Tailwind classes)
- **Name attribute**: ✅ **SUPPORTED** - HeroUI Slider forwards the `name` prop to the DOM

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use name attribute (if provided)
cy.get('input[type="range"][name="volume"]').should("exist");

// ✅ CORRECT: Use type attribute
cy.get('input[type="range"]').should("have.value", "50");

// ✅ CORRECT: Set slider value
cy.get('input[type="range"][name="volume"]').invoke("val", 75).trigger("input");
```

### 9. DateInput Components

**HeroUI DateInput renders as:**

- **Spinbuttons**: Multiple `<input role="spinbutton">` elements for month/day/year
- **Attributes**: `role`, `class` (extensive Tailwind classes)
- **Name attribute**: ⚠️ **PARTIALLY SUPPORTED** - DateInput doesn't forward `name` to spinbuttons, but hidden input is used for FormData

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use role attribute
cy.get('input[role="spinbutton"]').first().type("12");

// ✅ CORRECT: Use label to find the date input group
cy.contains("label", "Birth Date").parent().find('input[role="spinbutton"]').first();

// ⚠️ NOTE: Name attribute is not on spinbuttons, use hidden input or label for identification
```

### 10. File Input Components

**HeroUI File Input (using Input with type="file") renders as:**

- **Main input**: `<input type="file">` with `id="react-aria-*"`
- **Attributes**: `type`, `accept`, `multiple`, `class` (extensive Tailwind classes)
- **Name attribute**: ✅ **SUPPORTED** - HeroUI Input forwards the `name` prop to file inputs

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use name attribute (if provided)
cy.get('input[type="file"][name="avatar"]').selectFile("path/to/file.jpg");

// ✅ CORRECT: Use type attribute
cy.get('input[type="file"]').selectFile("path/to/file.jpg");

// ✅ CORRECT: Verify file input exists
cy.get('input[type="file"][name="avatar"]').should("exist");
```

### 11. Button Components

**HeroUI Button renders as:**

- **Standard button**: `<button>` with extensive Tailwind classes
- **Attributes**: `type`, `class`, text content

**Testing Strategy:**

```typescript
// ✅ CORRECT: Use text content
cy.contains("button", "Test Button").click();

// ✅ CORRECT: Use button type
cy.get('button[type="button"]').click();

// ✅ CORRECT: Use generic button selector
cy.get("button").first().click();

// ❌ WRONG: Don't rely on specific classes
cy.get('.specific-button-class'); // Classes may change
```

## Universal Testing Rules

### 1. Never Rely On These Attributes

- ❌ Standard `id` attribute (NOT rendered by HeroUI - uses React aria IDs instead)
- ❌ `data-testid` (unless explicitly added)

### 2. Always Use These Attributes

- ✅ `name` attribute (✅ **SUPPORTED** - HeroUI components forward the `name` prop to the DOM)
- ✅ `type` attribute (e.g., `input[type="email"]`)
- ✅ `role` attribute (e.g., `[role="checkbox"]`)
- ✅ `aria-*` attributes (e.g., `[aria-haspopup="listbox"]`)
- ✅ `placeholder` text (for inputs and textareas)

### 3. Fallback Strategies

- ✅ Generic tag selectors (`input`, `button`, `textarea`)
- ✅ Position-based selection (`.first()`, `.last()`, `.eq(index)`)
- ✅ Text content matching (`cy.contains()`)

## Testing Patterns by Component Type

### Form Inputs

```typescript
// Email field
cy.get('input[type="email"]').type("test@example.com");

// Phone field
cy.get('input[type="tel"]').type("123-456-7890");

// Password field
cy.get('input[type="password"]').type("password123");

// Text field
cy.get('input[type="text"]').type("some text");
```

### Form Controls

```typescript
// Checkbox
cy.get('input[type="checkbox"]').check();

// Switch
cy.get('input[role="switch"]').check();

// Select
cy.get('button[aria-haspopup="listbox"]').click();
cy.get('[role="option"]').first().click();
```

### Form Submission

```typescript
// Submit button
cy.get('button[type="submit"]').click();

// Or by text content
cy.contains("button", "Submit").click();
```

## Common Pitfalls and Solutions

### 1. "Element not found" errors

**Problem**: Using standard `id` attributes (HeroUI uses React aria IDs)
**Solution**: Use `name`, `type`, `role`, or `placeholder` attributes instead

### 2. "Element not visible" errors

**Problem**: HeroUI uses `opacity: 0.0001` for hidden inputs
**Solution**: Don't use `:visible` filter for form controls

### 3. "Select failed" errors

**Problem**: HeroUI Select is not a standard `<select>` element
**Solution**: Use the button trigger and role-based options

### 4. "Multiple elements found" errors

**Problem**: Generic selectors match multiple elements
**Solution**: Use `.first()`, `.last()`, or `.eq(index)` to narrow down

## Best Practices

1. **Use semantic selectors**: Prefer `type`, `role`, and `aria-*` attributes
2. **Avoid brittle selectors**: Don't rely on specific CSS classes
3. **Test actual functionality**: Verify interactions work, not just element existence
4. **Use fallback strategies**: Have multiple ways to find elements
5. **Document patterns**: Keep a reference of working selectors for your app

## Example Test Structure

```typescript
describe("HeroUI Form Testing", () => {
  it("should handle form interactions", () => {
    // Fill text inputs
    cy.get('input[type="text"]').first().type("John");
    cy.get('input[type="email"]').type("john@example.com");
    
    // Handle select components
    cy.get('button[aria-haspopup="listbox"]').first().click();
    cy.get('[role="option"]').first().click();
    
    // Handle checkboxes
    cy.get('input[type="checkbox"]').first().check();
    
    // Handle switches
    cy.get('input[role="switch"]').first().check();
    
    // Submit form
    cy.get('button[type="submit"]').click();
  });
});
```

## Summary

HeroUI components render differently than standard HTML elements. The key is to:

1. **Understand the actual DOM structure** (not assume standard HTML)
2. **Use semantic attributes** (`type`, `role`, `aria-*`)
3. **Avoid non-existent attributes** (`name`, standard `id`)
4. **Test real functionality** (not just element existence)
5. **Have fallback strategies** for element selection

By following these patterns, you can create robust, maintainable tests for HeroUI components that actually validate the functionality they claim to test.

## Real-World Example: E-commerce Checkout Form

Based on our analysis, here's how to properly test a HeroUI-based checkout form:

```typescript
describe("E-commerce Checkout with HeroUI", () => {
  it("should complete checkout form", () => {
    // Customer Information - Use type attributes
    cy.get('input[type="text"]').first().type("John"); // First Name
    cy.get('input[type="text"]').eq(1).type("Doe"); // Last Name
    cy.get('input[type="email"]').type("john.doe@example.com");
    cy.get('input[type="tel"]').type("123-456-7890");
    
    // Address Information - Use type attributes
    cy.get('input[type="text"]').eq(4).type("123 Main St"); // Street
    cy.get('input[type="text"]').eq(5).type("Anytown"); // City
    cy.get('input[type="text"]').eq(6).type("CA"); // State
    cy.get('input[type="text"]').eq(7).type("12345"); // ZIP
    
    // Country Selection - Use aria attributes
    cy.get('button[aria-haspopup="listbox"]').first().click();
    cy.get('[role="option"]').first().click();
    
    // Payment Method - Use aria attributes
    cy.get('button[aria-haspopup="listbox"]').eq(1).click();
    cy.get('[role="option"]').eq(1).click();
    
    // Credit Card Fields - Use type attributes
    cy.get('input[type="password"]').first().type("123"); // CVV
    cy.get('input[type="text"]').eq(8).type("1234 5678 9012 3456"); // Card Number
    
    // Expiry Selection - Use aria attributes
    cy.get('button[aria-haspopup="listbox"]').eq(2).click();
    cy.get('[role="option"]').eq(2).click();
    cy.get('button[aria-haspopup="listbox"]').eq(3).click();
    cy.get('[role="option"]').eq(3).click();
    
    // Delivery Method - Use aria attributes
    cy.get('button[aria-haspopup="listbox"]').eq(4).click();
    cy.get('[role="option"]').eq(4).click();
    
    // Special Instructions - Use placeholder text
    cy.get('textarea[placeholder*="instructions"]').type("Leave at front door");
    
    // Checkboxes - Use role attributes
    cy.get('input[role="checkbox"]').first().check(); // Terms
    cy.get('input[role="checkbox"]').eq(1).check(); // Marketing
    
    // Submit - Use type attribute
    cy.get('button[type="submit"]').click();
  });
});
```

This approach ensures your tests are:

- **Robust**: Using attributes that actually exist
- **Maintainable**: Not dependent on brittle selectors
- **Meaningful**: Actually testing real functionality
- **Fast**: Efficient element selection
- **Reliable**: Consistent across different environments
