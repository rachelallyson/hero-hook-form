# Accessibility Guide

Learn how to create accessible forms with Hero Hook Form that work for all users.

## ARIA Support

### Automatic ARIA Attributes

Hero Hook Form automatically adds proper ARIA attributes to all field components:

```tsx
// Input field with automatic ARIA support
<InputField 
  name="email" 
  label="Email Address"
  description="We'll never share your email"
  inputProps={{
    "aria-describedby": "email-description",
    "aria-invalid": "true", // When field has errors
  }}
/>
```

### Manual ARIA Configuration

For custom accessibility needs, you can override ARIA attributes:

```tsx
<InputField 
  name="username" 
  label="Username"
  inputProps={{
    "aria-label": "Choose a unique username",
    "aria-describedby": "username-help",
    "aria-required": "true",
  }}
/>
```

## Screen Reader Support

### Error Messages

Error messages are automatically associated with fields for screen readers:

```tsx
// Error message is automatically linked to field
<InputField 
  name="email" 
  label="Email"
  rules={{ required: "Email is required" }}
/>
// Screen reader will announce: "Email, required, Email is required"
```

### Form Status

Use the `FormStatus` component for screen reader announcements:

```tsx
<FormStatus
  isSubmitting={isSubmitting}
  isSuccess={isSuccess}
  error={error}
  successMessage="Form submitted successfully"
  // Screen reader will announce status changes
/>
```

### Field Descriptions

Provide helpful descriptions for screen readers:

```tsx
<InputField 
  name="password" 
  label="Password"
  description="Must be at least 8 characters with uppercase and number"
  inputProps={{
    "aria-describedby": "password-requirements",
  }}
/>
```

## Keyboard Navigation

### Tab Order

Fields are automatically included in the tab order:

```tsx
// Tab order: name → email → phone → submit
<ZodForm
  config={{
    fields: [
      FormFieldHelpers.input("name", "Name"),
      FormFieldHelpers.input("email", "Email"),
      FormFieldHelpers.input("phone", "Phone"),
    ],
    onSubmit: handleSubmit,
  }}
/>
```

### Custom Tab Index

Control tab order with custom tab indices:

```tsx
<InputField 
  name="priority" 
  label="Priority"
  inputProps={{ tabIndex: 1 }}
/>
<InputField 
  name="description" 
  label="Description"
  inputProps={{ tabIndex: 2 }}
/>
```

### Keyboard Shortcuts

HeroUI components support standard keyboard shortcuts:

- **Tab**: Move to next field
- **Shift+Tab**: Move to previous field
- **Enter**: Submit form (on submit button)
- **Escape**: Close dropdowns/selects
- **Arrow keys**: Navigate select options

## Focus Management

### Focus Indicators

All fields have visible focus indicators:

```tsx
// Focus ring is automatically applied
<InputField name="email" label="Email" />
```

### Programmatic Focus

Control focus programmatically:

```tsx
import { useForm } from "react-hook-form";

function MyForm() {
  const { setFocus } = useForm();
  
  const handleError = (fieldName: string) => {
    // Focus on field with error
    setFocus(fieldName);
  };
  
  return (
    <ZodForm
      config={{
        fields: [/* ... */],
        onError: handleError,
      }}
    />
  );
}
```

### Focus Trapping

For modal forms, implement focus trapping:

```tsx
import { useEffect, useRef } from "react";

function ModalForm() {
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    
    const focusableElements = form.querySelectorAll(
      'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    form.addEventListener('keydown', handleKeyDown);
    return () => form.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <form ref={formRef}>
      <ZodForm config={{ /* ... */ }} />
    </form>
  );
}
```

## Color and Contrast

### High Contrast Support

HeroUI components support high contrast mode:

```tsx
// Components automatically adapt to high contrast
<InputField 
  name="email" 
  label="Email"
  inputProps={{
    // High contrast colors are applied automatically
  }}
/>
```

### Color Blind Support

Use semantic colors and additional indicators:

```tsx
// Use semantic colors for status
<FormStatus
  isSuccess={isSuccess}
  error={error}
  // Green for success, red for error (not just colors)
  successMessage="✓ Form submitted successfully"
  errorMessage="✗ Please check your input"
/>
```

### Custom Color Schemes

Override colors for accessibility:

```tsx
<ConfigProvider
  defaults={{
    input: {
      color: "primary", // Use semantic colors
    },
    submitButton: {
      color: "primary",
    },
  }}
>
  <MyForm />
</ConfigProvider>
```

## Form Labels and Descriptions

### Required Field Indicators

Clearly indicate required fields:

```tsx
<InputField 
  name="email" 
  label="Email Address *"
  rules={{ required: "Email is required" }}
  inputProps={{
    "aria-required": "true",
  }}
/>
```

### Field Groups

Group related fields with proper labels:

```tsx
<fieldset>
  <legend>Contact Information</legend>
  <InputField name="firstName" label="First Name" />
  <InputField name="lastName" label="Last Name" />
  <InputField name="email" label="Email" />
</fieldset>
```

### Help Text

Provide helpful descriptions:

```tsx
<InputField 
  name="password" 
  label="Password"
  description="Must be at least 8 characters"
  inputProps={{
    "aria-describedby": "password-help",
  }}
/>
<div id="password-help" className="sr-only">
  Password requirements: at least 8 characters, one uppercase letter, one number
</div>
```

## Error Handling

### Error Announcements

Errors are automatically announced to screen readers:

```tsx
// Screen reader will announce: "Email, invalid, Please enter a valid email"
<InputField 
  name="email" 
  label="Email"
  rules={{ 
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email"
    }
  }}
/>
```

### Error Summary

Provide an error summary for complex forms:

```tsx
function ErrorSummary({ errors }: { errors: FieldErrors }) {
  const errorList = Object.entries(errors).map(([field, error]) => ({
    field,
    message: error?.message,
  }));
  
  if (errorList.length === 0) return null;
  
  return (
    <div role="alert" aria-live="polite" className="error-summary">
      <h3>Please correct the following errors:</h3>
      <ul>
        {errorList.map(({ field, message }) => (
          <li key={field}>
            <a href={`#${field}`} onClick={() => setFocus(field)}>
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Testing Accessibility

### Screen Reader Testing

Test with screen readers:

```bash
# Install screen reader testing tools
npm install --save-dev @testing-library/jest-axe

# Add to test setup
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

```tsx
// Test for accessibility violations
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

test('form should not have accessibility violations', async () => {
  const { container } = render(<MyForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Keyboard Testing

Test keyboard navigation:

```tsx
// Cypress keyboard testing
describe('Keyboard Navigation', () => {
  it('should navigate fields with Tab key', () => {
    cy.get('[name="name"]').focus();
    cy.get('[name="name"]').tab();
    cy.get('[name="email"]').should('be.focused');
  });
  
  it('should submit form with Enter key', () => {
    cy.get('[data-testid="submit-button"]').focus();
    cy.get('[data-testid="submit-button"]').type('{enter}');
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

### Color Contrast Testing

Test color contrast:

```tsx
// Test color contrast ratios
import { getContrast } from 'color2k';

test('error text has sufficient contrast', () => {
  const errorColor = '#dc2626'; // red-600
  const backgroundColor = '#ffffff'; // white
  const contrast = getContrast(errorColor, backgroundColor);
  
  // WCAG AA requires 4.5:1 for normal text
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});
```

## Best Practices

### 1. Semantic HTML

Use proper semantic elements:

```tsx
// ✅ Good: Semantic form structure
<form role="form">
  <fieldset>
    <legend>User Information</legend>
    <InputField name="name" label="Full Name" />
    <InputField name="email" label="Email" />
  </fieldset>
</form>
```

### 2. Clear Labels

Provide clear, descriptive labels:

```tsx
// ✅ Good: Clear labels
<InputField name="phone" label="Phone Number" />
<InputField name="email" label="Email Address" />

// ❌ Bad: Unclear labels
<InputField name="field1" label="Field" />
<InputField name="data" label="Info" />
```

### 3. Error Messages

Provide helpful error messages:

```tsx
// ✅ Good: Specific error messages
rules={{ 
  required: "Email address is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  }
}}

// ❌ Bad: Generic error messages
rules={{ 
  required: "Required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid"
  }
}}
```

### 4. Loading States

Indicate loading states clearly:

```tsx
<FormStatus
  isSubmitting={isSubmitting}
  isSuccess={isSuccess}
  error={error}
  // Screen reader announces: "Form is submitting" or "Form submitted successfully"
/>
```

### 5. Progress Indicators

Show progress for multi-step forms:

```tsx
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  return (
    <div>
      <div role="progressbar" aria-valuenow={currentStep} aria-valuemax={totalSteps}>
        Step {currentStep} of {totalSteps}
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      {/* Form content */}
    </div>
  );
}
```

## Accessibility Checklist

### ✅ Form Structure
- [ ] All fields have labels
- [ ] Required fields are marked
- [ ] Error messages are associated with fields
- [ ] Form has proper semantic structure

### ✅ Keyboard Navigation
- [ ] All fields are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Keyboard shortcuts work

### ✅ Screen Reader Support
- [ ] All content is announced
- [ ] Error messages are announced
- [ ] Status changes are announced
- [ ] Form structure is clear

### ✅ Visual Design
- [ ] Sufficient color contrast
- [ ] High contrast mode support
- [ ] Color is not the only indicator
- [ ] Text is readable

### ✅ Testing
- [ ] Tested with screen reader
- [ ] Tested with keyboard only
- [ ] Tested with high contrast
- [ ] Automated accessibility tests pass

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [HeroUI Accessibility](https://www.heroui.com/docs/components/accessibility)
