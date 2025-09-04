# Enhanced Features Guide

This guide covers the advanced features and improvements added to the `@rachelallyson/hero-hook-form` package based on user feedback and real-world usage patterns.

## 🚀 New Features Overview

### 1. Custom Field Rendering

### 2. Enhanced Error Handling

### 3. Form State Access

### 4. Field Dependencies & Conditional Rendering

### 5. Validation Utilities

### 6. Testing Utilities

### 7. Accessibility Improvements

---

## 1. Custom Field Rendering

For complex use cases where standard field types aren't sufficient, you can now create custom field renderers.

### Basic Custom Field

```tsx
import { ZodForm } from "@rachelallyson/hero-hook-form";

const formConfig = {
  schema: z.object({
    skills: z.array(z.string()).min(1, "Select at least one skill"),
  }),
  fields: [
    {
      name: "skills" as const,
      type: "custom" as const,
      label: "Technical Skills",
      description: "Select your technical skills",
      render: ({ form, name, control, errors, isSubmitting }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <div className="grid grid-cols-2 gap-2">
            {["React", "TypeScript", "Node.js", "Python"].map((skill) => (
              <label key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const currentSkills = form.getValues(name) || [];
                    if (e.target.checked) {
                      form.setValue(name, [...currentSkills, skill]);
                    } else {
                      form.setValue(name, currentSkills.filter((s: string) => s !== skill));
                    }
                  }}
                />
                <span className="text-sm">{skill}</span>
              </label>
            ))}
          </div>
          {errors[name] && (
            <p className="text-red-500 text-sm">{errors[name]?.message}</p>
          )}
        </div>
      ),
    },
  ],
};
```

### Advanced Custom Field with React Hook Form Controller

```tsx
import { Controller } from "react-hook-form";

const customFieldConfig = {
  name: "customField" as const,
  type: "custom" as const,
  label: "Custom Field",
  render: ({ control, name }) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label className="block text-sm font-medium mb-1">
            Custom Field
          </label>
          <input
            {...field}
            type="text"
            className="w-full px-3 py-2 border rounded-md"
          />
          {fieldState.error && (
            <p className="text-red-500 text-sm mt-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  ),
};
```

---

## 2. Enhanced Error Handling

The package now supports multiple error display modes and enhanced error handling.

### Error Display Modes

```tsx
<ZodForm
  config={formConfig}
  onSubmit={handleSubmit}
  errorDisplay="inline" // Default: shows errors inline
  // errorDisplay="toast" // Show errors as toast notifications
  // errorDisplay="modal" // Show errors in a modal
  // errorDisplay="none"  // Hide error display
/>
```

### Custom Error Handling

```tsx
const formConfig = {
  schema: mySchema,
  fields: myFields,
  
  // Enhanced error handling
  onError: (errors) => {
    console.log("Validation errors:", errors);
    // Custom error handling logic
    showToast("Please fix the validation errors");
  },
};
```

### Field-Level Error Handling

```tsx
const fieldConfig = {
  name: "email" as const,
  type: "input" as const,
  label: "Email",
  inputProps: { type: "email" },
  
  // Custom error handling for this field
  onError: (error) => {
    console.log("Email field error:", error);
  },
};
```

---

## 3. Form State Access

Access form state for advanced use cases with the custom render function.

### Custom Form Rendering

```tsx
<ZodForm
  config={formConfig}
  onSubmit={handleSubmit}
  render={({ form, isSubmitting, isSubmitted, isSuccess, errors, values }) => (
    <div className="custom-form-container">
      {/* Custom form layout */}
      <div className="form-header">
        <h1>Custom Form</h1>
        {isSubmitting && <div className="loading-spinner">Submitting...</div>}
        {isSuccess && <div className="success-message">Success!</div>}
      </div>
      
      {/* Custom field rendering */}
      <div className="form-fields">
        {formConfig.fields.map((field) => (
          <CustomFieldRenderer
            key={field.name}
            field={field}
            form={form}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>
      
      {/* Custom submit button */}
      <button
        onClick={form.handleSubmit(handleSubmit)}
        disabled={isSubmitting}
        className="custom-submit-button"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  )}
/>
```

### Form State Debugging

```tsx
const formConfig = {
  schema: mySchema,
  fields: myFields,
  render: ({ form, errors, values }) => (
    <div>
      {/* Your form fields */}
      <div className="form-fields">
        {/* ... */}
      </div>
      
      {/* Debug panel */}
      <div className="debug-panel">
        <h3>Form State Debug</h3>
        <pre>{JSON.stringify(values, null, 2)}</pre>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
    </div>
  ),
};
```

---

## 4. Field Dependencies & Conditional Rendering

Fields can now be conditionally rendered based on other field values.

### Basic Conditional Rendering

```tsx
const formConfig = {
  schema: z.object({
    hasPhone: z.boolean(),
    phoneNumber: z.string().optional(),
  }),
  fields: [
    {
      name: "hasPhone" as const,
      type: "switch" as const,
      label: "I have a phone number",
    },
    {
      name: "phoneNumber" as const,
      type: "input" as const,
      label: "Phone Number",
      inputProps: { type: "tel" },
      dependsOn: "hasPhone" as const,
      dependsOnValue: true, // Only show when hasPhone is true
    },
  ],
};
```

### Advanced Conditional Rendering

```tsx
const formConfig = {
  schema: z.object({
    userType: z.enum(["individual", "business"]),
    businessName: z.string().optional(),
    taxId: z.string().optional(),
  }),
  fields: [
    {
      name: "userType" as const,
      type: "select" as const,
      label: "User Type",
      options: [
        { label: "Individual", value: "individual" },
        { label: "Business", value: "business" },
      ],
    },
    {
      name: "businessName" as const,
      type: "input" as const,
      label: "Business Name",
      condition: (values) => values.userType === "business",
    },
    {
      name: "taxId" as const,
      type: "input" as const,
      label: "Tax ID",
      condition: (values) => values.userType === "business",
    },
  ],
};
```

### Complex Conditional Logic

```tsx
const formConfig = {
  schema: z.object({
    country: z.string(),
    state: z.string().optional(),
    city: z.string().optional(),
  }),
  fields: [
    {
      name: "country" as const,
      type: "select" as const,
      label: "Country",
      options: [
        { label: "United States", value: "US" },
        { label: "Canada", value: "CA" },
        { label: "United Kingdom", value: "UK" },
      ],
    },
    {
      name: "state" as const,
      type: "select" as const,
      label: "State/Province",
      condition: (values) => ["US", "CA"].includes(values.country),
      options: values => {
        if (values.country === "US") {
          return [
            { label: "California", value: "CA" },
            { label: "New York", value: "NY" },
            // ... more US states
          ];
        }
        if (values.country === "CA") {
          return [
            { label: "Ontario", value: "ON" },
            { label: "Quebec", value: "QC" },
            // ... more Canadian provinces
          ];
        }
        return [];
      },
    },
    {
      name: "city" as const,
      type: "input" as const,
      label: "City",
      condition: (values) => values.country && values.state,
    },
  ],
};
```

---

## 5. Validation Utilities

The package now includes comprehensive validation utilities for common patterns.

### Basic Validation Utilities

```tsx
import { commonValidations } from "@rachelallyson/hero-hook-form/utils/validation";

const schema = z.object({
  email: commonValidations.email,
  password: commonValidations.password(8), // Minimum 8 characters
  confirmPassword: commonValidations.confirmPassword("password"),
  phone: commonValidations.phone,
  url: commonValidations.url,
  requiredField: commonValidations.required("Field Name"),
});
```

### Advanced Validation Patterns

```tsx
import { 
  createMinLengthSchema,
  createMaxLengthSchema,
  createEmailSchema,
  createPasswordSchema,
  createConditionalSchema,
} from "@rachelallyson/hero-hook-form/utils/validation";

const schema = z.object({
  // Basic validations
  firstName: createMinLengthSchema(2, "First Name"),
  lastName: createMaxLengthSchema(50, "Last Name"),
  email: createEmailSchema(),
  
  // Password with custom requirements
  password: createPasswordSchema(12), // Minimum 12 characters
  
  // Conditional validation
  phoneNumber: createConditionalSchema(
    (data) => data.hasPhone === true,
    z.string().min(10, "Phone number must be at least 10 digits"),
    "Phone number is required when you have a phone"
  ),
  
  // File validation
  avatar: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB"
  ),
});
```

### Custom Validation Schemas

```tsx
import { z } from "zod";

// Custom validation for specific business rules
const createAgeSchema = (minAge: number) =>
  z.date().refine(
    (date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= minAge;
    },
    `You must be at least ${minAge} years old`
  );

const createUsernameSchema = () =>
  z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

const schema = z.object({
  birthDate: createAgeSchema(18),
  username: createUsernameSchema(),
});
```

---

## 6. Testing Utilities

Comprehensive testing utilities for form testing and debugging.

### Basic Testing Setup

```tsx
import { createFormTestUtils } from "@rachelallyson/hero-hook-form/utils/testing";

// In your test file
const form = useZodForm(config);
const testUtils = createFormTestUtils(form);

// Test form submission
await testUtils.submitForm();

// Test field values
testUtils.setFieldValue("email", "test@example.com");
const fieldState = testUtils.getField("email");

// Test form state
const formState = testUtils.getFormState();
console.log("Form state:", formState);
```

### Advanced Testing Patterns

```tsx
import { 
  createFormTestUtils,
  createMockFormData,
  createMockFormErrors,
  waitForFormState,
} from "@rachelallyson/hero-hook-form/utils/testing";

describe("Form Testing", () => {
  let form: UseFormReturn<FormData>;
  let testUtils: FormTestUtils<FormData>;

  beforeEach(() => {
    form = useZodForm(config);
    testUtils = createFormTestUtils(form);
  });

  it("should validate required fields", async () => {
    // Test with empty form
    const isValid = await testUtils.triggerValidation();
    expect(isValid).toBe(false);
    
    // Test with valid data
    const mockData = createMockFormData({
      email: "test@example.com",
      password: "password123",
    });
    
    Object.entries(mockData).forEach(([key, value]) => {
      testUtils.setFieldValue(key as any, value);
    });
    
    const isValidAfter = await testUtils.triggerValidation();
    expect(isValidAfter).toBe(true);
  });

  it("should handle form submission", async () => {
    const mockData = createMockFormData();
    Object.entries(mockData).forEach(([key, value]) => {
      testUtils.setFieldValue(key as any, value);
    });
    
    await testUtils.submitForm();
    
    const formState = testUtils.getFormState();
    expect(formState.isSubmitted).toBe(true);
  });

  it("should wait for form state changes", async () => {
    const promise = waitForFormState(
      form,
      (state) => state.isSubmitting === true,
      5000
    );
    
    // Trigger form submission
    testUtils.submitForm();
    
    // Wait for state change
    await promise;
    expect(form.formState.isSubmitting).toBe(true);
  });
});
```

### Cypress Testing Integration

```tsx
// cypress/support/commands.ts
import { createFormTestUtils } from "@rachelallyson/hero-hook-form/utils/testing";

declare global {
  namespace Cypress {
    interface Chainable {
      getFormTestUtils(): Chainable<FormTestUtils<any>>;
      fillForm(data: Record<string, any>): Chainable<void>;
      submitForm(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("getFormTestUtils", () => {
  return cy.window().then((win) => {
    // Access form instance from window or context
    const form = win.formInstance;
    return createFormTestUtils(form);
  });
});

Cypress.Commands.add("fillForm", (data: Record<string, any>) => {
  Object.entries(data).forEach(([key, value]) => {
    cy.get(`[name="${key}"]`).type(value);
  });
});

Cypress.Commands.add("submitForm", () => {
  cy.get('button[type="submit"]').click();
});

// In your test file
describe("Form E2E Tests", () => {
  it("should submit form successfully", () => {
    cy.visit("/form-page");
    
    cy.fillForm({
      email: "test@example.com",
      password: "password123",
      agreeToTerms: true,
    });
    
    cy.submitForm();
    
    cy.get('[data-testid="success-message"]').should("be.visible");
  });
});
```

---

## 7. Accessibility Improvements

Enhanced accessibility features for better user experience.

### ARIA Labels and Descriptions

```tsx
const formConfig = {
  schema: mySchema,
  fields: [
    {
      name: "email" as const,
      type: "input" as const,
      label: "Email Address",
      description: "We'll never share your email with anyone else",
      ariaLabel: "Email address for account creation",
      ariaDescribedBy: "email-description",
      inputProps: { type: "email" },
    },
  ],
};
```

### Screen Reader Support

```tsx
const accessibleFormConfig = {
  schema: mySchema,
  fields: [
    {
      name: "password" as const,
      type: "input" as const,
      label: "Password",
      description: "Password must be at least 8 characters long",
      ariaLabel: "Create a secure password",
      ariaDescribedBy: "password-requirements",
      inputProps: { 
        type: "password",
        "aria-describedby": "password-requirements",
        "aria-required": "true",
      },
    },
  ],
};
```

---

## 🎯 Migration Guide

### From Basic to Enhanced Forms

If you're upgrading from the basic form configuration, here's how to migrate:

#### Before (Basic)

```tsx
const formConfig = {
  schema: mySchema,
  fields: [
    {
      name: "email" as const,
      type: "input" as const,
      label: "Email",
      inputProps: { type: "email" },
    },
  ],
};
```

#### After (Enhanced)

```tsx
const formConfig = {
  schema: mySchema,
  fields: [
    {
      name: "email" as const,
      type: "input" as const,
      label: "Email",
      description: "We'll never share your email",
      ariaLabel: "Email address",
      inputProps: { type: "email" },
      // Enhanced error handling
      onError: (error) => console.log("Email error:", error),
    },
  ],
  
  // Enhanced error handling
  onError: (errors) => {
    console.log("Form validation errors:", errors);
  },
};
```

### Adding Conditional Fields

```tsx
// Add conditional rendering to existing fields
const enhancedConfig = {
  ...existingConfig,
  fields: existingConfig.fields.map(field => ({
    ...field,
    // Add conditional rendering
    condition: field.name === "phoneNumber" 
      ? (values) => values.hasPhone === true
      : undefined,
  })),
};
```

---

## 🔧 Best Practices

### 1. Field Organization

- Use the `group` property to organize related fields
- Group fields logically (personal info, contact info, etc.)

### 2. Error Handling

- Use `onError` callbacks for custom error handling
- Provide clear, actionable error messages
- Use validation utilities for consistent error messages

### 3. Conditional Rendering

- Use `dependsOn` for simple dependencies
- Use `condition` for complex conditional logic
- Test all conditional paths

### 4. Custom Fields

- Use custom fields sparingly - prefer standard field types when possible
- Ensure custom fields are accessible
- Test custom field behavior thoroughly

### 5. Testing

- Use testing utilities for consistent test patterns
- Test both valid and invalid form states
- Test conditional field behavior

---

## 📚 Examples

See the `example/app/enhanced-demo/page.tsx` file for a comprehensive example demonstrating all the new features.

---

## 🤝 Contributing

We welcome contributions! Please see the [Contributing Guide](../CONTRIBUTING.md) for details on how to contribute to this project.

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.
