# API Reference

Complete API documentation for Hero Hook Form.

## Core Components

### ZodForm

Main form component with Zod schema validation.

```tsx
import { ZodForm } from "@rachelallyson/hero-hook-form";

<ZodForm
  config={{
    schema: mySchema,
    fields: myFields,
    onSubmit: handleSubmit,
  }}
/>
```

**Props:**

- `config: ZodFormConfig<T>` - Form configuration object

### ConfigurableForm

Alternative form component without Zod requirement.

```tsx
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

<ConfigurableForm
  fields={myFields}
  onSubmit={handleSubmit}
  defaultValues={defaultValues}
/>
```

**Props:**

- `fields: FormFieldConfig<T>[]` - Array of field configurations
- `onSubmit: SubmitHandler<T>` - Form submission handler
- `defaultValues?: Partial<T>` - Default form values
- `onError?: (error: FormValidationError) => void` - Error handler
- `onSuccess?: (data: T) => void` - Success handler
- `title?: string` - Form title
- `subtitle?: string` - Form subtitle
- `layout?: "vertical" | "horizontal" | "grid"` - Form layout
- `columns?: 1 | 2 | 3` - Number of columns for grid layout
- `spacing?: "2" | "4" | "6" | "8" | "lg"` - Field spacing
- `className?: string` - Custom CSS class
- `submitButtonText?: string` - Submit button text
- `resetButtonText?: string` - Reset button text
- `showResetButton?: boolean` - Show reset button
- `submitButtonProps?: Partial<ComponentProps<typeof Button>>` - Submit button props

### FormField

Individual field wrapper component.

```tsx
import { FormField } from "@rachelallyson/hero-hook-form";

<FormField
  config={fieldConfig}
  form={form}
  submissionState={submissionState}
/>
```

**Props:**

- `config: FormFieldConfig<T>` - Field configuration
- `form: UseFormReturn<T>` - React Hook Form instance
- `submissionState: SubmissionState` - Form submission state

### FormStatus

Form status display component.

```tsx
import { FormStatus } from "@rachelallyson/hero-hook-form";

<FormStatus
  isSubmitting={isSubmitting}
  isSuccess={isSuccess}
  error={error}
/>
```

**Props:**

- `isSubmitting: boolean` - Whether form is submitting
- `isSuccess: boolean` - Whether form submission was successful
- `error?: string` - Error message to display
- `successMessage?: string` - Success message to display
- `className?: string` - Custom CSS class

## Field Components

### InputField

Text input field component.

```tsx
import { InputField } from "@rachelallyson/hero-hook-form";

<InputField
  name="email"
  label="Email"
  type="email"
  placeholder="Enter your email"
  description="We'll never share your email"
  isDisabled={false}
  rules={{ required: "Email is required" }}
/>
```

**Props:**

- `name: Path<T>` - Field name (type-safe path)
- `label?: string` - Field label
- `description?: string` - Help text
- `type?: "text" | "email" | "tel" | "password" | "number" | "url"` - Input type
- `placeholder?: string` - Placeholder text
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `inputProps?: Partial<ComponentProps<typeof Input>>` - HeroUI Input props

### TextareaField

Textarea field component.

```tsx
import { TextareaField } from "@rachelallyson/hero-hook-form";

<TextareaField
  name="message"
  label="Message"
  placeholder="Enter your message"
  rows={4}
  description="Maximum 500 characters"
  maxLength={500}
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `placeholder?: string` - Placeholder text
- `rows?: number` - Number of rows
- `maxLength?: number` - Maximum character count
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `textareaProps?: Partial<ComponentProps<typeof Textarea>>` - HeroUI Textarea props

### SelectField

Select dropdown field component.

```tsx
import { SelectField } from "@rachelallyson/hero-hook-form";

<SelectField
  name="country"
  label="Country"
  options={[
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
  ]}
  placeholder="Select a country"
  description="Choose your country of residence"
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `options: { label: string; value: string | number }[]` - Select options
- `placeholder?: string` - Placeholder text
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `selectProps?: Partial<ComponentProps<typeof Select>>` - HeroUI Select props

### CheckboxField

Checkbox field component.

```tsx
import { CheckboxField } from "@rachelallyson/hero-hook-form";

<CheckboxField
  name="newsletter"
  label="Subscribe to newsletter"
  description="Get updates about new features"
  isDisabled={false}
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `checkboxProps?: Partial<ComponentProps<typeof Checkbox>>` - HeroUI Checkbox props

### SwitchField

Switch field component.

```tsx
import { SwitchField } from "@rachelallyson/hero-hook-form";

<SwitchField
  name="notifications"
  label="Enable notifications"
  description="Receive push notifications"
  isDisabled={false}
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `switchProps?: Partial<ComponentProps<typeof Switch>>` - HeroUI Switch props

### RadioGroupField

Radio group field component.

```tsx
import { RadioGroupField } from "@rachelallyson/hero-hook-form";

<RadioGroupField
  name="gender"
  label="Gender"
  options={[
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]}
  description="Select your gender"
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `options: { label: string; value: string | number }[]` - Radio options
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `radioProps?: Partial<ComponentProps<typeof RadioGroup>>` - HeroUI RadioGroup props

### SliderField

Slider field component.

```tsx
import { SliderField } from "@rachelallyson/hero-hook-form";

<SliderField
  name="rating"
  label="Rating"
  min={1}
  max={5}
  step={1}
  description="Rate from 1 to 5"
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `min?: number` - Minimum value
- `max?: number` - Maximum value
- `step?: number` - Step value
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `sliderProps?: Partial<ComponentProps<typeof Slider>>` - HeroUI Slider props

### DateField

Date picker field component.

```tsx
import { DateField } from "@rachelallyson/hero-hook-form";

<DateField
  name="birthDate"
  label="Birth Date"
  description="Select your birth date"
  isDisabled={false}
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `dateProps?: Partial<ComponentProps<typeof DateInput>>` - HeroUI DateInput props
- `datePickerProps?: Partial<ComponentProps<typeof DatePicker>>` - HeroUI DatePicker props

### FileField

File upload field component.

```tsx
import { FileField } from "@rachelallyson/hero-hook-form";

<FileField
  name="avatar"
  label="Profile Picture"
  accept="image/*"
  multiple={false}
  maxFiles={1}
  maxSize={5 * 1024 * 1024} // 5MB
  description="Upload a profile picture (max 5MB)"
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `accept?: string` - Accepted file types
- `multiple?: boolean` - Allow multiple files
- `maxFiles?: number` - Maximum number of files
- `maxSize?: number` - Maximum file size in bytes
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `fileProps?: Partial<ComponentProps<typeof FileInput>>` - HeroUI FileInput props

### FontPickerField

Font picker field component.

```tsx
import { FontPickerField } from "@rachelallyson/hero-hook-form";

<FontPickerField
  name="font"
  label="Choose Font"
  googleFontsApiKey="your_api_key"
  categories={["serif", "sans-serif", "display"]}
  showPreview={true}
  description="Select a font for your design"
/>
```

**Props:**

- `name: Path<T>` - Field name
- `label?: string` - Field label
- `description?: string` - Help text
- `googleFontsApiKey?: string` - Google Fonts API key
- `categories?: string[]` - Font categories to show
- `showPreview?: boolean` - Show font preview
- `isDisabled?: boolean` - Disable field
- `rules?: RegisterOptions<T, Path<T>>` - Validation rules
- `fontPickerProps?: Partial<ComponentProps<typeof FontPicker>>` - FontPicker props

## Dynamic Components

### ConditionalField

Conditional field component that shows/hides based on form values.

```tsx
import { ConditionalField } from "@rachelallyson/hero-hook-form";

<ConditionalField
  name="conditionalField"
  condition={(values) => values.showField === true}
  render={(props) => (
    <InputField name="conditionalField" label="Conditional Field" />
  )}
/>
```

**Props:**

- `name: Path<T>` - Field name
- `condition: (values: Partial<T>) => boolean` - Show/hide condition
- `render: (props: any) => React.ReactNode` - Field render function
- `label?: string` - Field label
- `description?: string` - Help text

### FieldArrayField

Dynamic field array component for repeating fields.

```tsx
import { FieldArrayField } from "@rachelallyson/hero-hook-form";

<FieldArrayField
  name="items"
  label="Items"
  renderItem={(item, index) => (
    <InputField name={`items.${index}.name`} label="Item Name" />
  )}
  addButtonText="Add Item"
  removeButtonText="Remove"
  maxItems={10}
  minItems={1}
/>
```

**Props:**

- `name: Path<T>` - Field array name
- `label?: string` - Field array label
- `renderItem: (item: any, index: number) => React.ReactNode` - Item render function
- `addButtonText?: string` - Add button text
- `removeButtonText?: string` - Remove button text
- `maxItems?: number` - Maximum number of items
- `minItems?: number` - Minimum number of items

### DynamicSectionField

Dynamic section component for grouped conditional fields.

```tsx
import { DynamicSectionField } from "@rachelallyson/hero-hook-form";

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
    FormFieldHelpers.switch("preferences.notifications", "Enable Notifications"),
  ]}
/>
```

**Props:**

- `name: Path<T>` - Section name
- `title?: string` - Section title
- `condition: (values: Partial<T>) => boolean` - Show/hide condition
- `fields: FormFieldConfig<T>[]` - Section fields
- `className?: string` - Custom CSS class

## Hooks

### useHeroForm

Enhanced hook that provides form methods and styling defaults.

```tsx
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
}
```

**Returns:**

- All React Hook Form methods and state
- `defaults: HeroHookFormDefaults` - Styling defaults

### useFormHelper

Form helper hook for managing form state and submission.

```tsx
import { useFormHelper } from "@rachelallyson/hero-hook-form";

function MyForm() {
  const {
    error,
    form,
    handleSubmit,
    isSubmitted,
    isSubmitting,
    isSuccess,
    resetForm,
    submissionState,
  } = useFormHelper({
    defaultValues,
    onError,
    onSubmit,
    onSuccess,
  });
}
```

**Parameters:**

- `defaultValues?: Partial<T>` - Default form values
- `onError?: (error: FormValidationError) => void` - Error handler
- `onSubmit: SubmitHandler<T>` - Submit handler
- `onSuccess?: (data: T) => void` - Success handler

**Returns:**

- `error: string | null` - Form error message
- `form: UseFormReturn<T>` - React Hook Form instance
- `handleSubmit: () => void` - Submit handler
- `isSubmitted: boolean` - Whether form has been submitted
- `isSubmitting: boolean` - Whether form is submitting
- `isSuccess: boolean` - Whether submission was successful
- `resetForm: () => void` - Reset form function
- `submissionState: SubmissionState` - Submission state object

### useEnhancedFormState

Enhanced form state hook with comprehensive state tracking.

```tsx
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
}
```

**Returns:**

- `formState: FormState` - React Hook Form state
- `fieldStates: Record<string, FieldState>` - Individual field states
- `isDirty: boolean` - Whether form has been modified
- `isSubmitted: boolean` - Whether form has been submitted
- `isSubmitting: boolean` - Whether form is submitting
- `isValid: boolean` - Whether form is valid
- `errors: FieldErrors` - Form errors
- `touchedFields: Set<string>` - Touched fields
- `dirtyFields: Set<string>` - Dirty fields
- `hasErrors: boolean` - Whether form has errors
- `hasFieldErrors: (fieldName: string) => boolean` - Check if field has errors
- `getFieldError: (fieldName: string) => FieldError | undefined` - Get field error
- `getFieldState: (fieldName: string) => FieldState` - Get field state

### useDebouncedValidation

Debounced validation hook for expensive validation operations.

```tsx
import { useDebouncedValidation } from "@rachelallyson/hero-hook-form";

function MyForm() {
  const { debouncedValue, isDebouncing, cancel } = useDebouncedValidation(
    fieldValue,
    300 // 300ms delay
  );
}
```

**Parameters:**

- `value: any` - Value to debounce
- `delay: number` - Debounce delay in milliseconds
- `options?: DebounceOptions` - Debounce options

**Returns:**

- `debouncedValue: any` - Debounced value
- `isDebouncing: boolean` - Whether debouncing is active
- `cancel: () => void` - Cancel debounce function

### useInferredForm

Type-inferred form hook for automatic schema generation.

```tsx
import { useInferredForm } from "@rachelallyson/hero-hook-form";

function MyForm() {
  const { form, schema, fields, handleSubmit } = useInferredForm({
    fields: [
      { name: "name", type: "input", label: "Name" },
      { name: "email", type: "input", label: "Email" },
    ],
    onSubmit: (data) => console.log(data),
  });
}
```

**Parameters:**

- `fields: InferredFieldConfig[]` - Field configurations
- `onSubmit: SubmitHandler<T>` - Submit handler
- `options?: InferredFormOptions` - Form options

**Returns:**

- `form: UseFormReturn<T>` - React Hook Form instance
- `schema: ZodSchema<T>` - Generated Zod schema
- `fields: FormFieldConfig<T>[]` - Generated field configurations
- `handleSubmit: () => void` - Submit handler

## Builders

### createAdvancedBuilder

Advanced form builder for complex forms.

```tsx
import { createAdvancedBuilder } from "@rachelallyson/hero-hook-form";

const builder = createAdvancedBuilder<MyFormData>()
  .addInput("name", "Name")
  .addEmail("email", "Email")
  .addCheckbox("newsletter", "Subscribe to newsletter")
  .addConditionalField("phone", "Phone", {
    condition: (values) => values.newsletter === true,
    render: () => <InputField name="phone" label="Phone" />,
  })
  .addFieldArray("items", "Items", {
    renderItem: (item, index) => (
      <InputField name={`items.${index}.name`} label="Item Name" />
    ),
    addButtonText: "Add Item",
    removeButtonText: "Remove",
  })
  .build();
```

**Methods:**

- `addInput(name, label, props?)` - Add input field
- `addEmail(name, label, props?)` - Add email field
- `addPassword(name, label, props?)` - Add password field
- `addTextarea(name, label, props?)` - Add textarea field
- `addSelect(name, label, props?)` - Add select field
- `addCheckbox(name, label, props?)` - Add checkbox field
- `addSwitch(name, label, props?)` - Add switch field
- `addRadio(name, label, props?)` - Add radio group field
- `addSlider(name, label, props?)` - Add slider field
- `addDate(name, label, props?)` - Add date field
- `addFile(name, label, props?)` - Add file field
- `addFontPicker(name, label, props?)` - Add font picker field
- `addConditionalField(name, label, config)` - Add conditional field
- `addFieldArray(name, label, config)` - Add field array
- `addDynamicSection(name, title, config)` - Add dynamic section
- `build()` - Build form configuration

### createTypeInferredBuilder

Type-inferred form builder for automatic schema generation.

```tsx
import { createTypeInferredBuilder } from "@rachelallyson/hero-hook-form";

const builder = createTypeInferredBuilder()
  .addInput("name", "Name")
  .addEmail("email", "Email")
  .addCheckbox("newsletter", "Subscribe to newsletter")
  .build();
```

**Methods:**

- `addInput(name, label, props?)` - Add input field
- `addEmail(name, label, props?)` - Add email field
- `addPassword(name, label, props?)` - Add password field
- `addTextarea(name, label, props?)` - Add textarea field
- `addSelect(name, label, props?)` - Add select field
- `addCheckbox(name, label, props?)` - Add checkbox field
- `addSwitch(name, label, props?)` - Add switch field
- `addRadio(name, label, props?)` - Add radio group field
- `addSlider(name, label, props?)` - Add slider field
- `addDate(name, label, props?)` - Add date field
- `addFile(name, label, props?)` - Add file field
- `addFontPicker(name, label, props?)` - Add font picker field
- `build()` - Build form configuration

### createBasicFormBuilder

Basic form builder for simple forms.

```tsx
import { createBasicFormBuilder } from "@rachelallyson/hero-hook-form";

const builder = createBasicFormBuilder<MyFormData>()
  .addInput("name", "Name")
  .addEmail("email", "Email")
  .addCheckbox("newsletter", "Subscribe to newsletter")
  .build();
```

**Methods:**

- `addInput(name, label, props?)` - Add input field
- `addEmail(name, label, props?)` - Add email field
- `addPassword(name, label, props?)` - Add password field
- `addTextarea(name, label, props?)` - Add textarea field
- `addSelect(name, label, props?)` - Add select field
- `addCheckbox(name, label, props?)` - Add checkbox field
- `addSwitch(name, label, props?)` - Add switch field
- `addRadio(name, label, props?)` - Add radio group field
- `addSlider(name, label, props?)` - Add slider field
- `addDate(name, label, props?)` - Add date field
- `addFile(name, label, props?)` - Add file field
- `addFontPicker(name, label, props?)` - Add font picker field
- `build()` - Build form configuration

## Helper Functions

### FormFieldHelpers

Helper functions for creating field configurations.

```tsx
import { FormFieldHelpers } from "@rachelallyson/hero-hook-form";

// Input fields
FormFieldHelpers.input("name", "Name")
FormFieldHelpers.input("email", "Email", { type: "email" })
FormFieldHelpers.input("password", "Password", { type: "password" })
FormFieldHelpers.input("age", "Age", { type: "number" })

// Textarea
FormFieldHelpers.textarea("message", "Message", { rows: 4 })

// Select
FormFieldHelpers.select("country", "Country", {
  options: [
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
  ],
})

// Boolean fields
FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter")
FormFieldHelpers.switch("notifications", "Enable notifications")

// Radio group
FormFieldHelpers.radio("gender", "Gender", {
  options: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ],
})

// Slider
FormFieldHelpers.slider("rating", "Rating", {
  min: 1,
  max: 5,
  step: 1,
})

// Date
FormFieldHelpers.date("birthDate", "Birth Date")

// File
FormFieldHelpers.file("avatar", "Profile Picture", {
  accept: "image/*",
  maxSize: 5 * 1024 * 1024, // 5MB
})

// Font picker
FormFieldHelpers.fontPicker("font", "Choose Font", {
  googleFontsApiKey: "your_api_key",
})

// Content field (headers/questions between fields)
FormFieldHelpers.content("Section Header", "Description text")
FormFieldHelpers.content(null, null, {
  render: () => <div>Custom content</div>
})
```

### CommonFields

Pre-configured common field types.

```tsx
import { CommonFields } from "@rachelallyson/hero-hook-form";

// Common input fields
CommonFields.name("name", "Full Name")
CommonFields.email("email", "Email Address")
CommonFields.password("password", "Password")
CommonFields.phone("phone", "Phone Number")
CommonFields.url("website", "Website")
CommonFields.textarea("message", "Message")

// Common select fields
CommonFields.country("country", "Country")
CommonFields.state("state", "State/Province")
CommonFields.timezone("timezone", "Timezone")

// Common boolean fields
CommonFields.newsletter("newsletter", "Subscribe to newsletter")
CommonFields.terms("terms", "I agree to the terms and conditions")
CommonFields.privacy("privacy", "I agree to the privacy policy")
```

### validationPatterns

Pre-configured validation patterns.

```tsx
import { validationPatterns } from "@rachelallyson/hero-hook-form";

// Email validation
validationPatterns.email("Invalid email address")

// Phone validation
validationPatterns.phone("Invalid phone number")

// URL validation
validationPatterns.url("Invalid URL")

// Password validation
validationPatterns.password("Password must be at least 8 characters")

// Credit card validation
validationPatterns.creditCard("Invalid credit card number")

// Postal code validation
validationPatterns.postalCode("Invalid postal code")
```

## Utilities

### applyServerErrors

Apply server validation errors to form fields.

```tsx
import { applyServerErrors } from "@rachelallyson/hero-hook-form";

// Apply server errors to form
applyServerErrors(form, {
  email: "Email already exists",
  password: "Password is too weak",
});
```

**Parameters:**

- `form: UseFormReturn<T>` - React Hook Form instance
- `errors: Record<string, string>` - Server error messages

### crossFieldValidation

Create cross-field validation rules.

```tsx
import { crossFieldValidation } from "@rachelallyson/hero-hook-form";

const schema = crossFieldValidation(baseSchema, {
  password: {
    confirmPassword: (password, confirm) => 
      password === confirm || "Passwords don't match",
  },
  startDate: {
    endDate: (start, end) => 
      new Date(end) > new Date(start) || "End date must be after start date",
  },
});
```

**Parameters:**

- `schema: ZodSchema` - Base Zod schema
- `validations: CrossFieldValidations` - Cross-field validation rules

**Returns:**

- `ZodSchema` - Enhanced schema with cross-field validation

### performance utilities

Performance monitoring and optimization utilities.

```tsx
import { 
  usePerformanceMonitor,
  useBatchedFieldUpdates,
  optimizeFormRender 
} from "@rachelallyson/hero-hook-form";

// Performance monitoring
const { renderTime, validationTime, submissionTime } = usePerformanceMonitor();

// Batched field updates
const { batchUpdate, flushUpdates } = useBatchedFieldUpdates();

// Form render optimization
const optimizedForm = optimizeFormRender(form, {
  memoizeFields: true,
  debounceValidation: 300,
});
```

## Providers

### ConfigProvider

Configuration provider for global form settings.

```tsx
import { ConfigProvider } from "@rachelallyson/hero-hook-form";

<ConfigProvider
  defaults={{
    input: { variant: "bordered", color: "default" },
    select: { variant: "bordered", color: "default" },
    checkbox: { color: "primary" },
    switch: { color: "primary" },
    radio: { color: "primary" },
    slider: { color: "primary" },
    date: { variant: "bordered", color: "default" },
    file: { variant: "bordered", color: "default" },
    fontPicker: { variant: "bordered", color: "default" },
    submitButton: { color: "primary", variant: "solid" },
  }}
  theme={{
    primary: "blue",
    secondary: "gray",
    success: "green",
    warning: "yellow",
    danger: "red",
  }}
  validation={{
    mode: "onBlur",
    reValidateMode: "onChange",
    delayError: 0,
  }}
>
  <MyApp />
</ConfigProvider>
```

**Props:**

- `defaults?: HeroHookFormDefaults` - Default component props
- `theme?: ThemeConfig` - Theme configuration
- `validation?: ValidationConfig` - Validation configuration

### FormProvider

Form context provider for React Hook Form integration.

```tsx
import { FormProvider } from "@rachelallyson/hero-hook-form";

<FormProvider
  form={form}
  onSubmit={handleSubmit}
  onError={handleError}
  onSuccess={handleSuccess}
  defaultValues={defaultValues}
>
  <MyForm />
</FormProvider>
```

**Props:**

- `form: UseFormReturn<T>` - React Hook Form instance
- `onSubmit?: SubmitHandler<T>` - Submit handler
- `onError?: (error: FormValidationError) => void` - Error handler
- `onSuccess?: (data: T) => void` - Success handler
- `defaultValues?: Partial<T>` - Default form values

## Type Definitions

### Core Types

```tsx
// Form data type
type FormData = {
  [key: string]: any;
};

// Field path type
type FieldPath<T> = Path<T>;

// Form field configuration
interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  type: FieldType;
  isDisabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  condition?: (values: Partial<T>) => boolean;
  dependsOn?: Path<T>;
  dependsOnValue?: unknown;
  group?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// Field types
type FieldType = 
  | "input" 
  | "textarea" 
  | "select" 
  | "checkbox" 
  | "switch" 
  | "radio" 
  | "slider" 
  | "date" 
  | "file" 
  | "fontPicker";

// Form validation error
interface FormValidationError {
  message: string;
  field?: string;
  code?: string;
}

// Submission state
interface SubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSuccess: boolean;
  error: string | null;
}
```

### Builder Types

```tsx
// Advanced builder
interface AdvancedFormBuilder<T extends FieldValues> {
  addInput(name: Path<T>, label: string, props?: InputProps): this;
  addEmail(name: Path<T>, label: string, props?: InputProps): this;
  addPassword(name: Path<T>, label: string, props?: InputProps): this;
  addTextarea(name: Path<T>, label: string, props?: TextareaProps): this;
  addSelect(name: Path<T>, label: string, props?: SelectProps): this;
  addCheckbox(name: Path<T>, label: string, props?: CheckboxProps): this;
  addSwitch(name: Path<T>, label: string, props?: SwitchProps): this;
  addRadio(name: Path<T>, label: string, props?: RadioProps): this;
  addSlider(name: Path<T>, label: string, props?: SliderProps): this;
  addDate(name: Path<T>, label: string, props?: DateProps): this;
  addFile(name: Path<T>, label: string, props?: FileProps): this;
  addFontPicker(name: Path<T>, label: string, props?: FontPickerProps): this;
  addConditionalField(name: Path<T>, label: string, config: ConditionalFieldConfig): this;
  addFieldArray(name: Path<T>, label: string, config: FieldArrayConfig): this;
  addDynamicSection(name: Path<T>, title: string, config: DynamicSectionConfig): this;
  build(): ZodFormConfig<T>;
}

// Type-inferred builder
interface TypeInferredBuilder {
  addInput(name: string, label: string, props?: InputProps): this;
  addEmail(name: string, label: string, props?: InputProps): this;
  addPassword(name: string, label: string, props?: InputProps): this;
  addTextarea(name: string, label: string, props?: TextareaProps): this;
  addSelect(name: string, label: string, props?: SelectProps): this;
  addCheckbox(name: string, label: string, props?: CheckboxProps): this;
  addSwitch(name: string, label: string, props?: SwitchProps): this;
  addRadio(name: string, label: string, props?: RadioProps): this;
  addSlider(name: string, label: string, props?: SliderProps): this;
  addDate(name: string, label: string, props?: DateProps): this;
  addFile(name: string, label: string, props?: FileProps): this;
  addFontPicker(name: string, label: string, props?: FontPickerProps): this;
  build(): InferredFormConfig;
}
```

### Hook Types

```tsx
// Form helper hook
interface UseFormHelperReturn<T extends FieldValues> {
  error: string | null;
  form: UseFormReturn<T>;
  handleSubmit: () => void;
  isSubmitted: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  resetForm: () => void;
  submissionState: SubmissionState;
}

// Enhanced form state hook
interface UseEnhancedFormStateReturn<T extends FieldValues> {
  formState: FormState;
  fieldStates: Record<string, FieldState>;
  isDirty: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  errors: FieldErrors;
  touchedFields: Set<string>;
  dirtyFields: Set<string>;
  hasErrors: boolean;
  hasFieldErrors: (fieldName: string) => boolean;
  getFieldError: (fieldName: string) => FieldError | undefined;
  getFieldState: (fieldName: string) => FieldState;
}

// Debounced validation hook
interface UseDebouncedValidationReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
  cancel: () => void;
}
```
