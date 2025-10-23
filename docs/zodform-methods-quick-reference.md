# ZodForm Methods Quick Reference

This is a quick reference for accessing form methods when using `ZodForm` in Hero Hook Form.

## Key Concept

**ZodForm is self-contained** - it creates its own form instance internally, so you access form methods through the `render` prop or by using our hooks inside the render function.

## Quick Setup

```typescript
import { 
  ZodForm, 
  useFormContext,  // ← For basic form access
  useHeroForm,    // ← For enhanced access with defaults
  HeroHookFormProvider 
} from "@rachelallyson/hero-hook-form";

<HeroHookFormProvider defaults={{ common: { color: "primary" } }}>
  <ZodForm
    config={config}
    onSubmit={handleSubmit}
    render={() => (
      <div>
        {/* Your components with form methods access */}
      </div>
    )}
  />
</HeroHookFormProvider>
```

## Method 1: Using the `render` prop (Direct Access)

```typescript
<ZodForm
  config={config}
  onSubmit={handleSubmit}
  render={({ form, isSubmitting, errors, values }) => {
    // Direct access to form methods
    return (
      <div>
        <p>Submitting: {isSubmitting ? 'Yes' : 'No'}</p>
        <button onClick={() => form.reset()}>Reset</button>
        <button onClick={() => form.trigger()}>Validate</button>
      </div>
    );
  }}
/>
```

## Method 2: Using `useFormContext` (Inside render)

```typescript
function MyComponent() {
  const form = useFormContext(); // ← Works inside ZodForm render
  
  return (
    <div>
      <p>Submitting: {form.formState.isSubmitting ? 'Yes' : 'No'}</p>
      <button onClick={() => form.reset()}>Reset</button>
    </div>
  );
}

<ZodForm
  config={config}
  onSubmit={handleSubmit}
  render={() => (
    <div>
      <MyComponent /> {/* Can use useFormContext here */}
    </div>
  )}
/>
```

## Method 3: Using `useHeroForm` (Enhanced Access)

```typescript
function EnhancedComponent() {
  const { formState, getValues, setValue, defaults } = useHeroForm();
  
  return (
    <div>
      <p>Form is {formState.isSubmitting ? 'submitting' : 'idle'}</p>
      <button 
        style={{ color: defaults.submitButton.color }}
        onClick={() => setValue('email', 'test@example.com')}
      >
        Set Test Email
      </button>
    </div>
  );
}

<ZodForm
  config={config}
  onSubmit={handleSubmit}
  render={() => (
    <div>
      <EnhancedComponent /> {/* Works with useHeroForm too! */}
    </div>
  )}
/>
```

## Common Patterns

### Custom Submit Button

```typescript
function CustomSubmitButton() {
  const form = useFormContext();
  
  return (
    <button 
      type="submit"
      disabled={form.formState.isSubmitting || !form.formState.isValid}
    >
      {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### Form Status Display

```typescript
function FormStatus() {
  const form = useFormContext();
  
  return (
    <div>
      <p>Submitting: {form.formState.isSubmitting ? 'Yes' : 'No'}</p>
      <p>Valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
      <p>Dirty: {form.formState.isDirty ? 'Yes' : 'No'}</p>
      <p>Errors: {Object.keys(form.formState.errors).length}</p>
    </div>
  );
}
```

### Form Progress

```typescript
function FormProgress() {
  const { formState } = useHeroForm();
  const totalFields = 5;
  const completedFields = Object.keys(formState.dirtyFields).length;
  const progress = (completedFields / totalFields) * 100;
  
  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
      <p>{completedFields} of {totalFields} fields completed</p>
    </div>
  );
}
```

### Dynamic Field Updates

```typescript
function DynamicActions() {
  const { formState, setValue, getValues } = useHeroForm();
  
  const handleSetTestData = () => {
    setValue('email', 'test@example.com');
    setValue('name', 'Test User');
  };
  
  const handleShowValues = () => {
    const values = getValues();
    console.log('Current values:', values);
  };
  
  return (
    <div>
      <button onClick={handleSetTestData}>Set Test Data</button>
      <button onClick={handleShowValues}>Show Values</button>
      <button onClick={() => formState.reset()}>Reset Form</button>
    </div>
  );
}
```

## Available Form Methods

When using `useFormContext()` or `useHeroForm()` inside ZodForm:

### Form State

- `formState.isSubmitting` - Whether form is submitting
- `formState.isValid` - Whether form is valid
- `formState.isDirty` - Whether form has been modified
- `formState.errors` - Current validation errors
- `formState.touchedFields` - Which fields have been touched
- `formState.dirtyFields` - Which fields have been modified

### Form Methods

- `getValues()` - Get all form values
- `getValues(name)` - Get specific field value
- `setValue(name, value)` - Set field value
- `reset()` - Reset form to default values
- `trigger()` - Validate all fields
- `trigger(name)` - Validate specific field
- `clearErrors()` - Clear all errors
- `setError(name, error)` - Set field error
- `setFocus(name)` - Focus on specific field

## Complete Example

```typescript
import { ZodForm, useFormContext, useHeroForm, HeroHookFormProvider } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

function FormStatus() {
  const form = useFormContext();
  return (
    <div>
      <p>Submitting: {form.formState.isSubmitting ? 'Yes' : 'No'}</p>
      <button onClick={() => form.reset()}>Reset</button>
    </div>
  );
}

function EnhancedActions() {
  const { setValue, defaults } = useHeroForm();
  return (
    <button 
      onClick={() => setValue('email', 'test@example.com')}
      style={{ color: defaults.submitButton.color }}
    >
      Set Test Email
    </button>
  );
}

export function MyZodForm() {
  return (
    <HeroHookFormProvider defaults={{ common: { color: "primary" } }}>
      <ZodForm
        config={{
          schema,
          fields: [
            { name: "email", type: "input", label: "Email" },
            { name: "name", type: "input", label: "Name" }
          ]
        }}
        onSubmit={(data) => console.log(data)}
        render={() => (
          <div>
            <FormStatus />
            <EnhancedActions />
            {/* Form fields are rendered automatically */}
          </div>
        )}
      />
    </HeroHookFormProvider>
  );
}
```

## Key Takeaways

1. **Use the `render` prop** - This is the primary way to access form methods with ZodForm
2. **Our hooks work inside render** - `useFormContext()` and `useHeroForm()` work inside the render function
3. **Styling still works** - Use `HeroHookFormProvider` for global styling defaults
4. **Type safety** - The `render` prop provides typed form state and methods
5. **Form fields are automatic** - ZodForm renders the form fields automatically based on your config
