# Troubleshooting

Common issues and their solutions when using Hero Hook Form.

## TypeScript Errors

### Field Name Type Errors

**Symptom**: TypeScript error "Argument of type 'string' is not assignable to parameter of type 'Path<T>'"

**Cause**: Field name is not a valid path in the form data type

**Fix**: Ensure field names match the form data type structure

```tsx
// ❌ Wrong: Field name not in form data type
type FormData = {
  user: {
    name: string;
    email: string;
  };
};

FormFieldHelpers.input("name", "Name") // Error: "name" not in FormData

// ✅ Correct: Use proper nested path
FormFieldHelpers.input("user.name", "Name")
FormFieldHelpers.input("user.email", "Email")
```

### Schema Type Mismatch

**Symptom**: TypeScript error "Type 'string' is not assignable to type 'number'"

**Cause**: Field type doesn't match schema type

**Fix**: Ensure field types match schema types

```tsx
// ❌ Wrong: Schema expects number, field provides string
const schema = z.object({
  age: z.number(),
});

FormFieldHelpers.input("age", "Age") // Error: string vs number

// ✅ Correct: Use number input type
FormFieldHelpers.input("age", "Age", { type: "number" })
```

### Missing Dependencies

**Symptom**: TypeScript error "Cannot find module '@heroui/react'"

**Cause**: Missing peer dependencies

**Fix**: Install required dependencies

```bash
# Install all required dependencies
npm install @heroui/react react-hook-form zod @hookform/resolvers

# Or install specific HeroUI components
npm install @heroui/input @heroui/button @heroui/select @heroui/checkbox
```

## Runtime Errors

### Form Not Rendering

**Symptom**: Form doesn't render or shows blank

**Cause**: Missing providers or incorrect configuration

**Fix**: Wrap app with required providers

```tsx
// ❌ Wrong: Missing providers
function App() {
  return <MyForm />;
}

// ✅ Correct: Include required providers
import { ConfigProvider } from "@rachelallyson/hero-hook-form";
import { HeroUIProvider } from "@heroui/react";

function App() {
  return (
    <HeroUIProvider>
      <ConfigProvider>
        <MyForm />
      </ConfigProvider>
    </HeroUIProvider>
  );
}
```

### Validation Not Working

**Symptom**: Form submits without validation or validation errors don't show

**Cause**: Missing schema or incorrect validation configuration

**Fix**: Ensure proper schema and validation setup

```tsx
// ❌ Wrong: Missing schema
<ZodForm
  config={{
    fields: [FormFieldHelpers.input("name", "Name")],
    onSubmit: handleSubmit,
  }}
/>

// ✅ Correct: Include schema
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

<ZodForm
  config={{
    schema,
    fields: [FormFieldHelpers.input("name", "Name")],
    onSubmit: handleSubmit,
  }}
/>
```

### Field Errors Not Displaying

**Symptom**: Validation errors don't appear in the UI

**Cause**: Missing error handling or incorrect field configuration

**Fix**: Ensure proper error handling setup

```tsx
// ❌ Wrong: Missing error handling
<InputField name="email" label="Email" />

// ✅ Correct: Include error handling
<InputField 
  name="email" 
  label="Email" 
  rules={{ required: "Email is required" }}
/>
```

## Performance Issues

### Slow Form Rendering

**Symptom**: Form renders slowly or freezes

**Cause**: Too many re-renders or expensive operations

**Fix**: Use memoization and debouncing

```tsx
// ❌ Wrong: No memoization
function MyForm() {
  const fields = [
    FormFieldHelpers.input("name", "Name"),
    FormFieldHelpers.input("email", "Email"),
  ];
  
  return <ZodForm config={{ fields, onSubmit }} />;
}

// ✅ Correct: Memoize fields
function MyForm() {
  const fields = useMemo(() => [
    FormFieldHelpers.input("name", "Name"),
    FormFieldHelpers.input("email", "Email"),
  ], []);
  
  return <ZodForm config={{ fields, onSubmit }} />;
}
```

### Memory Leaks

**Symptom**: Memory usage increases over time

**Cause**: Not cleaning up event listeners or subscriptions

**Fix**: Proper cleanup in useEffect

```tsx
// ❌ Wrong: No cleanup
useEffect(() => {
  const subscription = someService.subscribe();
  // Missing cleanup
}, []);

// ✅ Correct: Proper cleanup
useEffect(() => {
  const subscription = someService.subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Validation Issues

### Cross-Field Validation Not Working

**Symptom**: Cross-field validation doesn't trigger

**Cause**: Incorrect validation setup or missing dependencies

**Fix**: Use proper cross-field validation

```tsx
// ❌ Wrong: Manual validation
const schema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
});

// ✅ Correct: Use crossFieldValidation
import { crossFieldValidation } from "@rachelallyson/hero-hook-form";

const schema = crossFieldValidation(baseSchema, {
  password: {
    confirmPassword: (password, confirm) => 
      password === confirm || "Passwords don't match",
  },
});
```

### Async Validation Not Working

**Symptom**: Async validation doesn't complete

**Cause**: Missing async/await or incorrect validation setup

**Fix**: Proper async validation

```tsx
// ❌ Wrong: Missing async/await
FormFieldHelpers.input("username", "Username", {
  rules: {
    validate: (value) => {
      return fetch(`/api/check-username?username=${value}`)
        .then(response => response.json())
        .then(data => data.available || "Username taken");
    },
  },
})

// ✅ Correct: Proper async validation
FormFieldHelpers.input("username", "Username", {
  rules: {
    validate: async (value) => {
      const response = await fetch(`/api/check-username?username=${value}`);
      const data = await response.json();
      return data.available || "Username taken";
    },
  },
})
```

## Styling Issues

### HeroUI Components Not Styled

**Symptom**: Components appear unstyled or with default browser styles

**Cause**: Missing HeroUI CSS or incorrect theme setup

**Fix**: Include HeroUI CSS and theme

```tsx
// ❌ Wrong: Missing CSS imports
import { HeroUIProvider } from "@heroui/react";

// ✅ Correct: Include CSS
import { HeroUIProvider } from "@heroui/react";
import "@heroui/react/dist/index.css";

function App() {
  return (
    <HeroUIProvider>
      <MyApp />
    </HeroUIProvider>
  );
}
```

### Custom Styling Not Applied

**Symptom**: Custom styles don't appear

**Cause**: CSS specificity issues or incorrect class names

**Fix**: Use proper CSS classes and specificity

```tsx
// ❌ Wrong: Generic class names
<ZodForm
  config={{
    className: "my-form",
    // ...
  }}
/>

// ✅ Correct: Specific class names
<ZodForm
  config={{
    className: "hero-hook-form my-form",
    submitButtonProps: {
      className: "my-submit-button",
    },
    // ...
  }}
/>
```

## Build Issues

### Build Errors

**Symptom**: Build fails with TypeScript or bundler errors

**Cause**: Missing types or incorrect configuration

**Fix**: Check TypeScript configuration and dependencies

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  }
}
```

### Import Errors

**Symptom**: "Cannot resolve module" errors

**Cause**: Incorrect import paths or missing exports

**Fix**: Use correct import paths

```tsx
// ❌ Wrong: Deep imports
import { InputField } from "@rachelallyson/hero-hook-form/src/fields/InputField";

// ✅ Correct: Use public exports
import { InputField } from "@rachelallyson/hero-hook-form";
```

## Testing Issues

### Cypress Tests Failing

**Symptom**: Cypress tests fail to find elements

**Cause**: Missing data-testid attributes or incorrect selectors

**Fix**: Use proper test selectors

```tsx
// ❌ Wrong: Generic selectors
cy.get('[name="email"]').type('test@example.com');

// ✅ Correct: Use data-testid
<InputField 
  name="email" 
  label="Email"
  inputProps={{ "data-testid": "email-input" }}
/>

cy.get('[data-testid="email-input"]').type('test@example.com');
```

### Form Submission Tests Failing

**Symptom**: Form submission tests fail

**Cause**: Missing form submission handling or incorrect test setup

**Fix**: Proper test setup and form handling

```tsx
// ❌ Wrong: Missing form submission
cy.get('[data-testid="submit-button"]').click();

// ✅ Correct: Wait for submission
cy.get('[data-testid="submit-button"]').click();
cy.get('[data-testid="success-message"]').should('be.visible');
```

## Common Patterns

### Form Reset Issues

**Symptom**: Form doesn't reset properly

**Cause**: Missing reset handling or incorrect state management

**Fix**: Proper form reset

```tsx
// ❌ Wrong: Manual reset
const handleReset = () => {
  setValue('name', '');
  setValue('email', '');
};

// ✅ Correct: Use form reset
const { reset } = useForm();

const handleReset = () => {
  reset();
};
```

### Conditional Field Issues

**Symptom**: Conditional fields don't show/hide properly

**Cause**: Incorrect condition logic or missing dependencies

**Fix**: Proper condition setup

```tsx
// ❌ Wrong: Incorrect condition
ConditionalField({
  name: "conditionalField",
  condition: (values) => values.showField, // Missing === true
  render: () => <InputField name="conditionalField" label="Field" />,
})

// ✅ Correct: Explicit condition
ConditionalField({
  name: "conditionalField",
  condition: (values) => values.showField === true,
  render: () => <InputField name="conditionalField" label="Field" />,
})
```

### Field Array Issues

**Symptom**: Field arrays don't add/remove items properly

**Cause**: Incorrect field array setup or missing keys

**Fix**: Proper field array configuration

```tsx
// ❌ Wrong: Missing key prop
FieldArrayField({
  name: "items",
  renderItem: (item, index) => (
    <InputField name={`items.${index}.name`} label="Item" />
  ),
})

// ✅ Correct: Include key prop
FieldArrayField({
  name: "items",
  renderItem: (item, index) => (
    <div key={index}>
      <InputField name={`items.${index}.name`} label="Item" />
    </div>
  ),
})
```

## Debugging Tips

### Enable Debug Mode

```tsx
// Add debug logging
const handleSubmit = async (data: any) => {
  console.log('Form data:', data);
  console.log('Form errors:', form.formState.errors);
  console.log('Form state:', form.formState);
  
  // Handle submission
};
```

### Check Form State

```tsx
// Monitor form state
const { formState } = useForm();

useEffect(() => {
  console.log('Form state changed:', formState);
}, [formState]);
```

### Validate Schema

```tsx
// Test schema validation
const result = schema.safeParse(formData);
if (!result.success) {
  console.log('Schema validation errors:', result.error.issues);
}
```

## Getting Help

### Check Documentation

1. Review the [API Reference](./reference/api/README.md)
2. Check the [Configuration Guide](./reference/config.md)
3. Look at [Examples](./recipes/examples.md)

### Common Solutions

1. **TypeScript Errors**: Check field names match form data type
2. **Validation Issues**: Ensure schema is properly configured
3. **Styling Problems**: Include HeroUI CSS and theme
4. **Performance Issues**: Use memoization and debouncing
5. **Testing Failures**: Add proper data-testid attributes

### Report Issues

If you can't find a solution:

1. Check existing [GitHub Issues](https://github.com/rachelallyson/hero-hook-form/issues)
2. Create a new issue with:
   - Code example
   - Error message
   - Expected behavior
   - Actual behavior
   - Environment details

### Community Support

- **GitHub Discussions**: Ask questions and share solutions
- **Discord**: Join the community chat
- **Stack Overflow**: Tag questions with `hero-hook-form`
