# Migration Guide - v2.0.0

This guide helps you migrate from Hero Hook Form v1.x to v2.0.0.

## Breaking Changes

### Field Props

**Changed**: `isDisabled` → `disabled` for consistency with HeroUI

```tsx
// ❌ v1.x (old)
<InputField 
  name="email" 
  label="Email"
  isDisabled={true}
/>

// ✅ v2.0 (new)
<InputField 
  name="email" 
  label="Email"
  disabled={true}
/>
```

### Form State Structure

**Changed**: Enhanced form state with additional properties

```tsx
// ❌ v1.x (old)
const { formState, getValues, setValue } = useFormHelper();

// ✅ v2.0 (new)
const { 
  formState, 
  getValues, 
  setValue,
  isDirty,
  isSubmitted,
  isSubmitting,
  isValid,
  errors,
  touchedFields,
  dirtyFields,
  hasErrors,
  hasFieldErrors,
  getFieldError,
  getFieldState
} = useEnhancedFormState();
```

### Field Configuration

**Changed**: `FormFieldConfig` → `ZodFormFieldConfig` (removed `rules` property)

```tsx
// ❌ v1.x (old)
interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  rules?: RegisterOptions;
  // ... other props
}

// ✅ v2.0 (new)
interface ZodFormFieldConfig {
  name: Path<T>;
  label: string;
  type: FieldType;
  // rules moved to individual field props
  // ... other props
}
```

## New Features

### Dynamic Forms

**New**: Conditional fields, field arrays, and dynamic sections

```tsx
// ✅ v2.0 (new)
import { ConditionalField, FieldArrayField, DynamicSectionField } from "@rachelallyson/hero-hook-form";

// Conditional field
<ConditionalField
  name="phone"
  condition={(values) => values.hasPhone === true}
  render={() => (
    <InputField name="phone" label="Phone Number" />
  )}
/>

// Field array
<FieldArrayField
  name="items"
  label="Items"
  renderItem={(item, index) => (
    <InputField name={`items.${index}.name`} label="Item Name" />
  )}
  addButtonText="Add Item"
  removeButtonText="Remove"
/>

// Dynamic section
<DynamicSectionField
  name="preferences"
  title="User Preferences"
  condition={(values) => values.hasPreferences === true}
  fields={[
    FormFieldHelpers.select("preferences.theme", "Theme", {
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    }),
  ]}
/>
```

### Enhanced Form State

**New**: Comprehensive form state management

```tsx
// ✅ v2.0 (new)
import { useEnhancedFormState } from "@rachelallyson/hero-hook-form";

function MyForm() {
  const {
    formState,
    fieldStates,
    isDirty,
    isSubmitted,
    isSubmitting,
    isValid,
    errors,
    touchedFields,
    dirtyFields,
    hasErrors,
    hasFieldErrors,
    getFieldError,
    getFieldState,
  } = useEnhancedFormState();
  
  return (
    <div>
      {isSubmitting && <div>Submitting...</div>}
      {isSuccess && <div>Success!</div>}
      {hasErrors && <div>Please fix errors</div>}
    </div>
  );
}
```

### Form Status Component

**New**: Built-in form status display

```tsx
// ✅ v2.0 (new)
import { FormStatus } from "@rachelallyson/hero-hook-form";

<FormStatus
  isSubmitting={isSubmitting}
  isSuccess={isSuccess}
  error={error}
  successMessage="Form submitted successfully"
  errorMessage="Please check your input"
/>
```

### Performance Optimizations

**New**: Memoized components and debounced validation

```tsx
// ✅ v2.0 (new)
import { useDebouncedValidation } from "@rachelallyson/hero-hook-form";

function OptimizedForm() {
  const [value, setValue] = useState("");
  const { debouncedValue, isDebouncing } = useDebouncedValidation(value, 300);
  
  return (
    <div>
      <InputField 
        name="search" 
        label="Search"
        value={value}
        onChange={setValue}
      />
      {isDebouncing && <div>Searching...</div>}
    </div>
  );
}
```

### Type-Inferred Forms

**New**: Automatic schema generation

```tsx
// ✅ v2.0 (new)
import { createTypeInferredBuilder } from "@rachelallyson/hero-hook-form";

const builder = createTypeInferredBuilder()
  .addInput("name", "Name")
  .addEmail("email", "Email")
  .addCheckbox("newsletter", "Subscribe to newsletter")
  .build();

// Schema is automatically generated
<ZodForm config={builder} onSubmit={handleSubmit} />
```

## Migration Steps

### Step 1: Update Dependencies

```bash
npm install @rachelallyson/hero-hook-form@^2.0.0
```

### Step 2: Update Field Props

Replace `isDisabled` with `disabled`:

```tsx
// Find and replace
// isDisabled={true} → disabled={true}
// isDisabled={false} → disabled={false}
```

### Step 3: Update Form State Usage

Replace `useFormHelper` with `useEnhancedFormState`:

```tsx
// ❌ v1.x (old)
import { useFormHelper } from "@rachelallyson/hero-hook-form";

const { formState, getValues, setValue } = useFormHelper();

// ✅ v2.0 (new)
import { useEnhancedFormState } from "@rachelallyson/hero-hook-form";

const { 
  formState, 
  getValues, 
  setValue,
  isDirty,
  isSubmitted,
  isSubmitting,
  isValid,
  errors,
  hasErrors,
  hasFieldErrors,
  getFieldError,
  getFieldState
} = useEnhancedFormState();
```

### Step 4: Update Field Configuration

Remove `rules` from field configuration:

```tsx
// ❌ v1.x (old)
const fieldConfig = {
  name: "email",
  label: "Email",
  type: "input",
  rules: { required: "Email is required" },
};

// ✅ v2.0 (new)
const fieldConfig = {
  name: "email",
  label: "Email",
  type: "input",
  inputProps: {
    rules: { required: "Email is required" },
  },
};
```

### Step 5: Add New Features (Optional)

#### Add Form Status

```tsx
// ✅ v2.0 (new)
import { FormStatus } from "@rachelallyson/hero-hook-form";

<FormStatus
  isSubmitting={isSubmitting}
  isSuccess={isSuccess}
  error={error}
/>
```

#### Add Conditional Fields

```tsx
// ✅ v2.0 (new)
import { ConditionalField } from "@rachelallyson/hero-hook-form";

<ConditionalField
  name="phone"
  condition={(values) => values.hasPhone === true}
  render={() => (
    <InputField name="phone" label="Phone Number" />
  )}
/>
```

#### Add Field Arrays

```tsx
// ✅ v2.0 (new)
import { FieldArrayField } from "@rachelallyson/hero-hook-form";

<FieldArrayField
  name="items"
  label="Items"
  renderItem={(item, index) => (
    <InputField name={`items.${index}.name`} label="Item Name" />
  )}
  addButtonText="Add Item"
  removeButtonText="Remove"
/>
```

## Code Examples

### Before (v1.x)

```tsx
import { ZodForm, FormFieldHelpers, useFormHelper } from "@rachelallyson/hero-hook-form";

function ContactForm() {
  const { formState, getValues, setValue } = useFormHelper();
  
  return (
    <ZodForm
      config={{
        schema: contactSchema,
        fields: [
          FormFieldHelpers.input("name", "Name"),
          FormFieldHelpers.input("email", "Email", { 
            type: "email",
            isDisabled: false,
          }),
          FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
        ],
        onSubmit: handleSubmit,
      }}
    />
  );
}
```

### After (v2.0)

```tsx
import { 
  ZodForm, 
  FormFieldHelpers, 
  useEnhancedFormState,
  FormStatus,
  ConditionalField 
} from "@rachelallyson/hero-hook-form";

function ContactForm() {
  const { 
    formState, 
    isSubmitting, 
    isSuccess, 
    hasErrors 
  } = useEnhancedFormState();
  
  return (
    <div>
      <FormStatus
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        error={hasErrors ? "Please fix errors" : null}
      />
      
      <ZodForm
        config={{
          schema: contactSchema,
          fields: [
            FormFieldHelpers.input("name", "Name"),
            FormFieldHelpers.input("email", "Email", { 
              type: "email",
              disabled: false,
            }),
            FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
            
            ConditionalField({
              name: "phone",
              condition: (values) => values.newsletter === true,
              render: () => (
                <FormFieldHelpers.input("phone", "Phone Number", { type: "tel" })
              ),
            }),
          ],
          onSubmit: handleSubmit,
        }}
      />
    </div>
  );
}
```

## Testing Updates

### Update Test Files

Update test files to use new APIs:

```tsx
// ❌ v1.x (old)
import { render, screen } from '@testing-library/react';
import { useFormHelper } from '@rachelallyson/hero-hook-form';

// ✅ v2.0 (new)
import { render, screen } from '@testing-library/react';
import { useEnhancedFormState } from '@rachelallyson/hero-hook-form';
```

### Update Cypress Tests

Update Cypress tests for new components:

```tsx
// ❌ v1.x (old)
cy.get('[name="email"]').should('not.be.disabled');

// ✅ v2.0 (new)
cy.get('[name="email"]').should('not.be.disabled');
// Same test, but now uses 'disabled' prop instead of 'isDisabled'
```

## Performance Improvements

### Automatic Memoization

All field components are now automatically memoized:

```tsx
// ✅ v2.0 (new) - No changes needed, automatic optimization
<InputField name="email" label="Email" />
<CheckboxField name="newsletter" label="Subscribe" />
```

### Debounced Validation

Use debounced validation for expensive operations:

```tsx
// ✅ v2.0 (new)
import { useDebouncedValidation } from "@rachelallyson/hero-hook-form";

function SearchForm() {
  const [searchValue, setSearchValue] = useState("");
  const { debouncedValue, isDebouncing } = useDebouncedValidation(searchValue, 300);
  
  return (
    <div>
      <InputField 
        name="search" 
        label="Search"
        value={searchValue}
        onChange={setSearchValue}
      />
      {isDebouncing && <div>Searching...</div>}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

#### 1. TypeScript Errors

**Error**: `Property 'isDisabled' does not exist on type 'InputProps'`

**Fix**: Replace `isDisabled`` with`disabled`

```tsx
// ❌ Error
<InputField name="email" isDisabled={true} />

// ✅ Fixed
<InputField name="email" disabled={true} />
```

#### 2. Form State Errors

**Error**: `Property 'isDirty' does not exist on type 'FormState'`

**Fix**: Use `useEnhancedFormState` instead of `useFormHelper`

```tsx
// ❌ Error
import { useFormHelper } from "@rachelallyson/hero-hook-form";
const { isDirty } = useFormHelper();

// ✅ Fixed
import { useEnhancedFormState } from "@rachelallyson/hero-hook-form";
const { isDirty } = useEnhancedFormState();
```

#### 3. Field Configuration Errors

**Error**: `Property 'rules' does not exist on type 'ZodFormFieldConfig'`

**Fix**: Move rules to field-specific props

```tsx
// ❌ Error
const fieldConfig = {
  name: "email",
  label: "Email",
  type: "input",
  rules: { required: "Email is required" },
};

// ✅ Fixed
const fieldConfig = {
  name: "email",
  label: "Email",
  type: "input",
  inputProps: {
    rules: { required: "Email is required" },
  },
};
```

### Getting Help

If you encounter issues during migration:

1. **Check the documentation**: [docs/index.md](docs/index.md)
2. **Review examples**: [docs/recipes/examples.md](docs/recipes/examples.md)
3. **Check troubleshooting**: [docs/troubleshooting.md](docs/troubleshooting.md)
4. **Report issues**: [GitHub Issues](https://github.com/rachelallyson/hero-hook-form/issues)

## Migration Checklist

### ✅ Dependencies

- [ ] Updated to v2.0.0
- [ ] All peer dependencies installed
- [ ] TypeScript types updated

### ✅ Code Changes

- [ ] Replaced `isDisabled` with `disabled`
- [ ] Updated form state usage
- [ ] Removed `rules` from field config
- [ ] Added new features (optional)

### ✅ Testing

- [ ] Updated test files
- [ ] Updated Cypress tests
- [ ] All tests passing
- [ ] Performance tests updated

### ✅ Documentation

- [ ] Updated component documentation
- [ ] Updated API documentation
- [ ] Updated examples
- [ ] Updated migration guide

## Benefits of v2.0

### 🚀 Performance

- **Memoized components**: Better performance with React.memo
- **Debounced validation**: Optimized for expensive operations
- **Memory optimization**: Better memory usage and cleanup

### 🎨 Enhanced UX

- **Form status**: Built-in loading and success states
- **Dynamic forms**: Conditional fields and field arrays
- **Better error handling**: Comprehensive error management

### 🔧 Developer Experience

- **Type inference**: Automatic schema generation
- **Enhanced state**: More form state information
- **Better testing**: Improved testing utilities

### 📱 Accessibility

- **ARIA support**: Better screen reader support
- **Keyboard navigation**: Improved keyboard accessibility
- **Focus management**: Better focus handling

---

**Need help?** Check the [troubleshooting guide](troubleshooting.md) or [report an issue](https://github.com/rachelallyson/hero-hook-form/issues).
