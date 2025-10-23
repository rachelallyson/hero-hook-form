# Form Methods Access Guide

This guide explains how to access React Hook Form methods and state within your components when using Hero Hook Form.

## Overview

Hero Hook Form provides multiple ways to access form methods and state:

1. **Direct `useFormContext`** - Access React Hook Form's context directly
2. **Enhanced `useHeroForm`** - Access both form methods and styling defaults
3. **Component Props** - Pass form methods as props to field components

## Method 1: Using `useFormContext` (Recommended)

Import `useFormContext` from the package (not directly from `react-hook-form`):

```typescript
import { useFormContext } from "@rachelallyson/hero-hook-form";

function MyComponent() {
  const form = useFormContext();
  
  // Access form state
  const isSubmitting = form.formState.isSubmitting;
  const errors = form.formState.errors;
  const isDirty = form.formState.isDirty;
  const isValid = form.formState.isValid;
  
  // Access form methods
  const values = form.getValues();
  const handleReset = () => form.reset();
  const handleSetValue = (name: string, value: any) => form.setValue(name, value);
  const handleTrigger = (name?: string) => form.trigger(name);
  
  return (
    <div>
      <p>Form is {isSubmitting ? 'submitting' : 'idle'}</p>
      <p>Form is {isDirty ? 'dirty' : 'clean'}</p>
      <p>Current values: {JSON.stringify(values)}</p>
      <button onClick={handleReset}>Reset Form</button>
    </div>
  );
}
```

## Method 2: Using `useHeroForm` (Enhanced)

For components that need both form methods and styling defaults:

```typescript
import { useHeroForm } from "@rachelallyson/hero-hook-form";

function MyComponent() {
  const { formState, getValues, setValue, defaults } = useHeroForm();
  
  // Access form state
  const isSubmitting = formState.isSubmitting;
  const errors = formState.errors;
  
  // Access form methods
  const values = getValues();
  const handleReset = () => setValue('fieldName', '');
  
  // Access styling defaults
  const inputDefaults = defaults.input;
  const buttonDefaults = defaults.submitButton;
  
  return (
    <div>
      <p>Form state: {isSubmitting ? 'Submitting...' : 'Ready'}</p>
      <button 
        style={{ 
          color: buttonDefaults.color,
          fontSize: buttonDefaults.size 
        }}
        onClick={handleReset}
      >
        Reset Form
      </button>
    </div>
  );
}
```

## Method 3: Component Props Pattern

For field components, pass form methods as props:

```typescript
import { useForm } from "@rachelallyson/hero-hook-form";

function MyForm() {
  const methods = useForm({
    defaultValues: { email: '', name: '' }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit}>
      <InputField 
        control={methods.control}
        name="email"
        label="Email"
      />
      <CustomComponent formMethods={methods} />
    </FormProvider>
  );
}

function CustomComponent({ formMethods }) {
  const handleCustomAction = () => {
    formMethods.setValue('email', 'custom@example.com');
    formMethods.trigger('email');
  };
  
  return (
    <button onClick={handleCustomAction}>
      Set Custom Email
    </button>
  );
}
```

## Complete Setup Example

Here's a complete example showing the proper setup:

```typescript
import { 
  HeroHookFormProvider, 
  FormProvider, 
  useFormContext,  // ← From package, not react-hook-form
  useForm 
} from "@rachelallyson/hero-hook-form";

interface FormData {
  email: string;
  name: string;
}

function App() {
  const methods = useForm<FormData>({
    defaultValues: { email: '', name: '' }
  });

  const handleSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <HeroHookFormProvider 
      defaults={{ 
        common: { color: "primary", size: "md" } 
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit}>
        <MyForm />
      </FormProvider>
    </HeroHookFormProvider>
  );
}

function MyForm() {
  const form = useFormContext<FormData>();
  
  return (
    <div>
      <h2>Form Status</h2>
      <p>Submitting: {form.formState.isSubmitting ? 'Yes' : 'No'}</p>
      <p>Valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
      <p>Dirty: {form.formState.isDirty ? 'Yes' : 'No'}</p>
      
      <h3>Form Values</h3>
      <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      
      <h3>Form Errors</h3>
      <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
      
      <div>
        <button 
          type="button" 
          onClick={() => form.setValue('email', 'test@example.com')}
        >
          Set Test Email
        </button>
        <button 
          type="button" 
          onClick={() => form.reset()}
        >
          Reset Form
        </button>
        <button 
          type="button" 
          onClick={() => form.trigger()}
        >
          Validate All Fields
        </button>
      </div>
    </div>
  );
}
```

## Available Form Methods

When you use `useFormContext()` or `useHeroForm()`, you get access to all React Hook Form methods:

### Form State

- `formState.isSubmitting` - Whether form is currently submitting
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
- `handleSubmit(onSubmit)` - Handle form submission
- `watch()` - Watch all form values
- `watch(name)` - Watch specific field

### Form Actions

- `clearErrors()` - Clear all errors
- `clearErrors(name)` - Clear specific field error
- `setError(name, error)` - Set field error
- `setFocus(name)` - Focus on specific field

## Best Practices

1. **Use the package's re-export**: Always import `useFormContext` from `@rachelallyson/hero-hook-form`, not directly from `react-hook-form`

2. **Type your form data**: Use TypeScript generics for better type safety:

   ```typescript
   const form = useFormContext<MyFormData>();
   ```

3. **Combine with styling defaults**: Use `useHeroForm()` when you need both form methods and styling defaults

4. **Handle loading states**: Use `formState.isSubmitting` to show loading indicators

5. **Validate before submission**: Use `form.trigger()` to validate fields before submission

## Common Use Cases

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

### Form Progress Indicator

```typescript
function FormProgress() {
  const form = useFormContext();
  const totalFields = 5; // Adjust based on your form
  const completedFields = Object.keys(form.formState.dirtyFields).length;
  const progress = (completedFields / totalFields) * 100;
  
  return (
    <div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p>{completedFields} of {totalFields} fields completed</p>
    </div>
  );
}
```

### Dynamic Field Validation

```typescript
function DynamicValidation() {
  const form = useFormContext();
  
  const validateEmail = async () => {
    const email = form.getValues('email');
    if (email) {
      const isValid = await form.trigger('email');
      if (!isValid) {
        form.setError('email', { 
          type: 'manual', 
          message: 'Please enter a valid email address' 
        });
      }
    }
  };
  
  return (
    <div>
      <button type="button" onClick={validateEmail}>
        Validate Email
      </button>
    </div>
  );
}
```

## ZodForm Integration

When using `ZodForm` (the self-contained form component), the form methods access patterns are slightly different but still use the same hooks.

### Key Difference: ZodForm is Self-Contained

**Regular Form Pattern:**

```typescript
// You create the form instance externally
const methods = useForm();
<FormProvider methods={methods} onSubmit={handleSubmit}>
  <MyComponent /> {/* Can use useFormContext() here */}
</FormProvider>
```

**ZodForm Pattern:**

```typescript
// ZodForm creates its own form instance internally
<ZodForm 
  config={config} 
  onSubmit={handleSubmit}
  render={(formState) => (
    <MyComponent /> {/* Can use useFormContext() here too! */}
  )}
/>
```

### Method 1: Using the `render` prop (Recommended for ZodForm)

```typescript
import { ZodForm, useFormContext } from "@rachelallyson/hero-hook-form";

function MyZodForm() {
  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      render={({ form, isSubmitting, errors, values }) => {
        // You have direct access to form methods here
        return (
          <div>
            <h2>Form Status</h2>
            <p>Submitting: {isSubmitting ? 'Yes' : 'No'}</p>
            <p>Errors: {Object.keys(errors).length}</p>
            <p>Values: {JSON.stringify(values)}</p>
            
            <button onClick={() => form.reset()}>Reset</button>
            <button onClick={() => form.trigger()}>Validate</button>
          </div>
        );
      }}
    />
  );
}
```

### Method 2: Using `useFormContext` inside ZodForm

```typescript
import { ZodForm, useFormContext } from "@rachelallyson/hero-hook-form";

function FormStatusDisplay() {
  const form = useFormContext(); // ← This works inside ZodForm too!
  
  return (
    <div>
      <p>Submitting: {form.formState.isSubmitting ? 'Yes' : 'No'}</p>
      <button onClick={() => form.reset()}>Reset Form</button>
    </div>
  );
}

function MyZodForm() {
  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      render={() => (
        <div>
          <FormStatusDisplay /> {/* Can use useFormContext here */}
          {/* Your form fields */}
        </div>
      )}
    />
  );
}
```

### Method 3: Using `useHeroForm` with ZodForm

```typescript
import { ZodForm, useHeroForm } from "@rachelallyson/hero-hook-form";

function EnhancedFormComponent() {
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

function MyZodForm() {
  return (
    <ZodForm
      config={config}
      onSubmit={handleSubmit}
      render={() => (
        <div>
          <EnhancedFormComponent /> {/* Works with useHeroForm too! */}
        </div>
      )}
    />
  );
}
```

### Complete ZodForm Example

```typescript
import { 
  ZodForm, 
  useFormContext, 
  useHeroForm,
  HeroHookFormProvider 
} from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

function FormStatus() {
  const form = useFormContext();
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>Submitting: {form.formState.isSubmitting ? 'Yes' : 'No'}</p>
      <p>Valid: {form.formState.isValid ? 'Yes' : 'No'}</p>
      <button onClick={() => form.reset()}>Reset</button>
    </div>
  );
}

function EnhancedActions() {
  const { formState, setValue, defaults } = useHeroForm();
  
  return (
    <div className="space-y-2">
      <button 
        onClick={() => setValue('email', 'test@example.com')}
        style={{ color: defaults.submitButton.color }}
      >
        Set Test Email
      </button>
    </div>
  );
}

export function ZodFormWithMethods() {
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

### ZodForm vs Regular Forms: Setup Comparison

**Regular Form Setup:**

```typescript
// External form creation
const methods = useForm();
<HeroHookFormProvider defaults={defaults}>
  <FormProvider methods={methods} onSubmit={handleSubmit}>
    <MyComponent />
  </FormProvider>
</HeroHookFormProvider>
```

**ZodForm Setup:**

```typescript
// ZodForm handles form creation internally
<HeroHookFormProvider defaults={defaults}>
  <ZodForm 
    config={config} 
    onSubmit={handleSubmit}
    render={() => <MyComponent />} // ← Form context available here
  />
</HeroHookFormProvider>
```

### ZodForm Best Practices

1. **Use the `render` prop**: This is the primary way to access form methods with ZodForm
2. **Combine with our hooks**: `useFormContext()` and `useHeroForm()` work inside the render function
3. **Styling still works**: Use `HeroHookFormProvider` for global styling defaults
4. **Type safety**: The `render` prop provides typed form state and methods

### Common ZodForm Patterns

#### Custom Submit Button

```typescript
function CustomZodSubmitButton() {
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

<ZodForm
  config={config}
  onSubmit={handleSubmit}
  render={() => (
    <div>
      {/* Your form fields */}
      <CustomZodSubmitButton />
    </div>
  )}
/>
```

#### Form Progress with ZodForm

```typescript
function ZodFormProgress() {
  const { formState } = useHeroForm();
  const totalFields = 5; // Adjust based on your form
  const completedFields = Object.keys(formState.dirtyFields).length;
  const progress = (completedFields / totalFields) * 100;
  
  return (
    <div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <p>{completedFields} of {totalFields} fields completed</p>
    </div>
  );
}
```

This guide provides everything you need to access and work with form methods in Hero Hook Form, including both regular forms and ZodForm!
