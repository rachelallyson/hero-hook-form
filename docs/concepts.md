# Core Concepts

This document explains the fundamental concepts, mental models, and data flow patterns in Hero Hook Form.

## Form Architecture

### Component Hierarchy

```
ZodForm (or ConfigurableForm)
├── FormProvider (React Hook Form context)
├── FormField (field wrapper)
│   └── HeroUI Component (Input, Select, etc.)
└── SubmitButton
```

### Data Flow

1. **Schema Definition**: Zod schema defines form structure and validation
2. **Field Configuration**: Fields are configured with names, labels, and props
3. **Form Rendering**: Components render with HeroUI styling
4. **User Interaction**: Changes trigger React Hook Form state updates
5. **Validation**: Zod schema validates on submit or field blur
6. **Submission**: Valid data is passed to `onSubmit` handler

## Mental Models

### 1. Form as Configuration

Forms are defined as configuration objects rather than JSX:

```tsx
// ✅ Configuration-based (Hero Hook Form way)
const config = {
  schema: mySchema,
  fields: [
    FormFieldHelpers.input("name", "Name"),
    FormFieldHelpers.checkbox("newsletter", "Subscribe"),
  ],
  onSubmit: handleSubmit,
};

// ❌ JSX-based (traditional React way)
<form>
  <input name="name" />
  <input type="checkbox" name="newsletter" />
</form>
```

### 2. Type-Safe Field Paths

All field names must be valid TypeScript paths in the form data:

```tsx
type FormData = {
  user: {
    name: string;
    email: string;
  };
  preferences: {
    newsletter: boolean;
  };
};

// ✅ Valid paths
"user.name"        // string
"user.email"        // string  
"preferences.newsletter" // boolean

// ❌ Invalid paths
"user.age"          // not in type
"invalid.path"     // not in type
```

### 3. HeroUI Integration

All fields render HeroUI components with consistent styling:

```tsx
// InputField renders HeroUI Input
<InputField name="email" label="Email" />

// Internally becomes:
<Input
  label="Email"
  value={field.value}
  onValueChange={field.onChange}
  isInvalid={!!field.error}
  errorMessage={field.error?.message}
/>
```

## Form Lifecycle

### 1. Initialization

```tsx
// Form is created with schema and default values
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: "", email: "" },
});
```

### 2. Field Registration

```tsx
// Fields register with React Hook Form
const field = useController({
  name: "email",
  control: form.control,
  rules: { required: "Email is required" },
});
```

### 3. User Interaction

```tsx
// User types in field
onChange("user@example.com") 
// → React Hook Form updates state
// → Component re-renders with new value
// → Validation runs (if configured)
```

### 4. Validation

```tsx
// Validation can happen on:
// - Field blur (onBlur)
// - Field change (onChange) 
// - Form submit (onSubmit)

// Zod schema validation
const result = schema.safeParse(formData);
if (!result.success) {
  // Display field errors
  setFieldError("email", "Invalid email format");
}
```

### 5. Submission

```tsx
// Valid data is passed to onSubmit
const handleSubmit = (data: FormData) => {
  // data is fully typed and validated
  console.log(data); // { name: "John", email: "john@example.com" }
};
```

## Data Model

### Form Data Structure

```tsx
type FormData = {
  // Basic fields
  name: string;
  email: string;
  
  // Optional fields
  phone?: string;
  
  // Boolean fields
  newsletter: boolean;
  terms: boolean;
  
  // Nested objects
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  
  // Arrays
  tags: string[];
  
  // Conditional fields
  showAdvanced?: boolean;
  advancedField?: string;
};
```

### Field Configuration

```tsx
interface FieldConfig {
  name: Path<FormData>;           // Type-safe field path
  label?: string;                 // Display label
  description?: string;           // Help text
  type: FieldType;               // Field type
  disabled?: boolean;             // Disable field
  condition?: (values) => boolean; // Show/hide logic
  rules?: RegisterOptions;        // Validation rules
  inputProps?: ComponentProps;    // HeroUI component props
}
```

### Validation Schema

```tsx
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, "Must agree to terms"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  }),
  tags: z.array(z.string()).min(1, "At least one tag required"),
});
```

## State Management

### Form State

```tsx
interface FormState {
  isDirty: boolean;           // Form has been modified
  isSubmitted: boolean;       // Form has been submitted
  isSubmitting: boolean;      // Form is currently submitting
  isValid: boolean;           // Form passes validation
  errors: FieldErrors;        // Field validation errors
  touchedFields: Set<string>; // Fields that have been touched
}
```

### Field State

```tsx
interface FieldState {
  value: any;                 // Current field value
  error?: FieldError;         // Field validation error
  isDirty: boolean;          // Field has been modified
  isTouched: boolean;        // Field has been focused/blurred
  isDisabled: boolean;        // Field is disabled
}
```

## Performance Considerations

### Memoization

All field components use `React.memo` to prevent unnecessary re-renders:

```tsx
export const InputField = React.memo<InputFieldProps>(({ name, label, ...props }) => {
  // Component implementation
});
```

### Debounced Validation

Use `useDebouncedValidation` for expensive validation:

```tsx
const { debouncedValue, isDebouncing } = useDebouncedValidation(
  fieldValue, 
  300 // 300ms delay
);
```

### Field Arrays

Field arrays are optimized for minimal re-renders:

```tsx
// Only re-renders when items are added/removed, not when individual items change
<FieldArrayField
  name="items"
  renderItem={(item, index) => (
    <InputField name={`items.${index}.name`} label="Item Name" />
  )}
/>
```

## Error Handling

### Field Errors

```tsx
// Field-level errors are displayed via HeroUI errorMessage
<Input
  isInvalid={!!field.error}
  errorMessage={field.error?.message}
/>
```

### Form Errors

```tsx
// Form-level errors are shown in FormStatus component
<FormStatus
  isSubmitting={isSubmitting}
  isSuccess={isSuccess}
  error={error}
/>
```

### Server Errors

```tsx
// Apply server errors to form fields
applyServerErrors(form, {
  email: "Email already exists",
  password: "Password is too weak",
});
```

## Accessibility

### ARIA Support

All fields include proper ARIA attributes:

```tsx
<Input
  aria-label={label}
  aria-describedby={description ? `${name}-description` : undefined}
  aria-invalid={!!error}
/>
```

### Keyboard Navigation

HeroUI components provide full keyboard navigation support.

### Screen Reader Support

Error messages are properly associated with fields for screen readers.

## Testing

### Component Testing

```tsx
// Test form submission
cy.get('[data-testid="submit-button"]').click();
cy.get('[data-testid="success-message"]').should('be.visible');
```

### Field Testing

```tsx
// Test field validation
cy.get('[name="email"]').type('invalid-email');
cy.get('[data-testid="email-error"]').should('contain', 'Invalid email');
```

### Integration Testing

```tsx
// Test complete form flow
cy.visit('/contact-form');
cy.get('[name="name"]').type('John Doe');
cy.get('[name="email"]').type('john@example.com');
cy.get('[data-testid="submit-button"]').click();
cy.get('[data-testid="success-message"]').should('be.visible');
```
