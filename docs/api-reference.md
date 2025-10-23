# API Reference

Complete API documentation for Hero Hook Form components and utilities.

## Table of Contents

- [Field Components](#field-components)
- [Form Components](#form-components)
- [Provider Components](#provider-components)
- [Utility Functions](#utility-functions)
- [Zod Integration](#zod-integration)
- [Types](#types)

## Field Components

### InputField

A versatile input component supporting various input types.

```tsx
import { InputField } from "@rachelallyson/hero-hook-form";

<InputField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: string
  isDisabled?: boolean
  inputProps?: Omit<ComponentProps<typeof Input>, "value" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">
  transform?: (value: string) => string
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `inputProps`: HeroUI Input component props
- `transform`: Function to transform input value before writing to form state

### TextareaField

Multi-line text input component.

```tsx
import { TextareaField } from "@rachelallyson/hero-hook-form";

<TextareaField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: string
  isDisabled?: boolean
  textareaProps?: Omit<ComponentProps<typeof Textarea>, "value" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `textareaProps`: HeroUI Textarea component props

### SelectField

Dropdown selection component with options.

```tsx
import { SelectField } from "@rachelallyson/hero-hook-form";

<SelectField<TFieldValues, TValue>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: TValue
  isDisabled?: boolean
  options={readonly { label: string; value: TValue; description?: string; disabled?: boolean }[]}
  selectProps?: Omit<ComponentProps<typeof Select>, "selectedKeys" | "onSelectionChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `options` (required): Array of option objects
- `selectProps`: HeroUI Select component props

**Option Object:**

```tsx
interface Option {
  label: string;
  value: string | number;
  description?: string;
  disabled?: boolean;
}
```

### RadioGroupField

Radio button group for single selection.

```tsx
import { RadioGroupField } from "@rachelallyson/hero-hook-form";

<RadioGroupField<TFieldValues, TValue>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: TValue
  isDisabled?: boolean
  radioOptions={readonly { label: string; value: TValue; description?: string; disabled?: boolean }[]}
  radioProps?: Omit<ComponentProps<typeof RadioGroup>, "value" | "onValueChange" | "label">
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `radioOptions` (required): Array of option objects
- `radioProps`: HeroUI RadioGroup component props

### CheckboxField

Single checkbox component.

```tsx
import { CheckboxField } from "@rachelallyson/hero-hook-form";

<CheckboxField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: boolean
  isDisabled?: boolean
  checkboxProps?: Omit<ComponentProps<typeof Checkbox>, "isSelected" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `checkboxProps`: HeroUI Checkbox component props

### SwitchField

Toggle switch component.

```tsx
import { SwitchField } from "@rachelallyson/hero-hook-form";

<SwitchField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: boolean
  isDisabled?: boolean
  switchProps?: Omit<ComponentProps<typeof Switch>, "isSelected" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `switchProps`: HeroUI Switch component props

### SliderField

Range slider component for numeric values.

```tsx
import { SliderField } from "@rachelallyson/hero-hook-form";

<SliderField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: number
  isDisabled?: boolean
  sliderProps?: Omit<ComponentProps<typeof Slider>, "value" | "onChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `sliderProps`: HeroUI Slider component props

### DateField

Date picker component for date selection.

```tsx
import { DateField } from "@rachelallyson/hero-hook-form";

<DateField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: CalendarDate
  isDisabled?: boolean
  dateProps?: Omit<ComponentProps<typeof DateInput>, "value" | "onChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value (CalendarDate)
- `isDisabled`: Disable the field
- `dateProps`: HeroUI DateInput component props

### FileField

File upload component for file selection.

```tsx
import { FileField } from "@rachelallyson/hero-hook-form";

<FileField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: FileList | null
  isDisabled?: boolean
  multiple?: boolean
  accept?: string
  fileProps?: Omit<ComponentProps<typeof Input>, "value" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled" | "type">
  transform?: (value: FileList | null) => FileList | null
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `multiple`: Allow multiple file selection
- `accept`: Accepted file types
- `fileProps`: HeroUI Input component props (for file input)
- `transform`: Function to transform file value

### FontPickerField

Optional font picker component for font selection (requires `@rachelallyson/heroui-font-picker`).

```tsx
import { FontPickerField } from "@rachelallyson/hero-hook-form";

<FontPickerField<TFieldValues>
  control={Control<TFieldValues>}
  name={Path<TFieldValues>}
  label?: string
  description?: string
  className?: string
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  defaultValue?: string
  isDisabled?: boolean
  fontPickerProps?: {
    showFontPreview?: boolean
    loadAllVariants?: boolean
    onFontsLoaded?: (loaded: boolean) => void
    fontsLoadedTimeout?: number
  }
/>
```

**Props:**

- `control` (required): React Hook Form control object
- `name` (required): Form field name
- `label`: Field label text
- `description`: Helper text below the field
- `className`: Additional CSS classes
- `rules`: React Hook Form validation rules
- `defaultValue`: Default field value
- `isDisabled`: Disable the field
- `fontPickerProps`: Font picker specific configuration

> **Note**: FontPickerField requires the `@rachelallyson/heroui-font-picker` package. If not installed, it will show a helpful fallback message.

## Form Components

### ConfigurableForm

High-level form component for rapid development.

```tsx
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

<ConfigurableForm<TFieldValues>
  fields={FormFieldConfig<TFieldValues>[]}
  onSubmit={SubmitHandler<TFieldValues>}
  title?: string
  subtitle?: string
  layout?: "vertical" | "horizontal" | "grid"
  columns?: 1 | 2 | 3
  spacing?: "sm" | "md" | "lg" | "xl"
  showResetButton?: boolean
  resetButtonText?: string
  submitButtonText?: string
  submitButtonProps?: Partial<ComponentProps<typeof Button>>
  onError?: (error: FormValidationError) => void
  onSuccess?: (data: TFieldValues) => void
  defaultValues?: Partial<TFieldValues>
  className?: string
/>
```

**Props:**

- `fields` (required): Array of field configurations
- `onSubmit` (required): Form submission handler
- `title`: Form title
- `subtitle`: Form subtitle
- `layout`: Form layout type ("vertical" | "horizontal" | "grid")
- `columns`: Number of columns for grid layout (1 | 2 | 3)
- `spacing`: Spacing between fields ("sm" | "md" | "lg" | "xl")
- `showResetButton`: Show reset button
- `resetButtonText`: Reset button text
- `submitButtonText`: Submit button text
- `submitButtonProps`: Submit button props
- `onError`: Error handler
- `onSuccess`: Success handler
- `defaultValues`: Form default values
- `className`: Additional CSS classes

### SubmitButton

Submit button component with loading states.

```tsx
import { SubmitButton } from "@rachelallyson/hero-hook-form";

<SubmitButton
  isLoading?: boolean
  buttonProps?: Omit<ComponentProps<typeof Button>, "type" | "isLoading">
>
  {children}
</SubmitButton>
```

**Props:**

- `isLoading`: Override loading state (defaults to form submission state)
- `buttonProps`: HeroUI Button component props
- `children`: Button content

## Zod Integration

### ZodForm

Zod-enabled form component for schema-based validation.

```tsx
import { ZodForm } from "@rachelallyson/hero-hook-form";

<ZodForm<TFieldValues>
  config={ZodFormConfig<TFieldValues>}
  onSubmit={SubmitHandler<TFieldValues>}
  onError?: (error: FormValidationError) => void
  onSuccess?: (data: TFieldValues) => void
  layout?: "vertical" | "horizontal" | "grid"
  columns?: 1 | 2 | 3
  spacing?: "sm" | "md" | "lg" | "xl"
  title?: string
  subtitle?: string
  className?: string
  showResetButton?: boolean
  resetButtonText?: string
  submitButtonText?: string
  submitButtonProps?: Partial<ComponentProps<typeof Button>>
/>
```

**Props:**

- `config` (required): Zod form configuration
- `onSubmit` (required): Form submission handler
- `onError`: Error handler
- `onSuccess`: Success handler
- `layout`: Form layout type
- `columns`: Number of columns for grid layout
- `spacing`: Spacing between fields
- `title`: Form title
- `subtitle`: Form subtitle
- `className`: Additional CSS classes
- `showResetButton`: Show reset button
- `resetButtonText`: Reset button text
- `submitButtonText`: Submit button text
- `submitButtonProps`: Submit button props

### createZodFormConfig

Helper function to create Zod form configurations.

```tsx
import { createZodFormConfig } from "@rachelallyson/hero-hook-form";

function createZodFormConfig<TFieldValues extends FieldValues>(
  schema: ZodSchemaType,
  fields: ZodFormFieldConfig<TFieldValues>[],
  defaultValues?: Partial<TFieldValues>
): ZodFormConfig<TFieldValues>
```

**Parameters:**

- `schema`: Zod schema for validation (conditionally typed as `z.ZodSchema` when available)
- `fields`: Array of field configurations
- `defaultValues`: Form default values

### useZodForm

Hook for using Zod validation with React Hook Form.

```tsx
import { useZodForm } from "@rachelallyson/hero-hook-form";

function useZodForm<TFieldValues extends FieldValues>(
  config: ZodFormConfig<TFieldValues>
): UseFormReturn<TFieldValues>
```

**Parameters:**

- `config`: Zod form configuration

**Returns:**

- React Hook Form methods object with Zod resolver

### isZodAvailable

Utility to check if Zod is available in the current environment.

```tsx
import { isZodAvailable } from "@rachelallyson/hero-hook-form";

function isZodAvailable(): boolean
```

**Returns:**

- `true` if Zod and @hookform/resolvers are available, `false` otherwise

## Provider Components

### HeroHookFormProvider

Global configuration provider (previously `ConfigProvider`).

```tsx
import { HeroHookFormProvider } from "@rachelallyson/hero-hook-form";

<HeroHookFormProvider
  defaults={HeroHookFormDefaultsConfig}
>
  {children}
</HeroHookFormProvider>
```

**Props:**

- `defaults`: Global default configurations
- `children`: React children

**HeroHookFormDefaultsConfig Interface:**

```tsx
interface HeroHookFormDefaultsConfig {
  common?: CommonFieldDefaults;
  input?: InputDefaults;
  textarea?: TextareaDefaults;
  checkbox?: CheckboxDefaults;
  radioGroup?: RadioGroupDefaults;
  select?: SelectDefaults;
  switch?: SwitchDefaults;
  submitButton?: ButtonDefaults;
}
```

**CommonFieldDefaults Interface:**

```tsx
type CommonFieldDefaults = Partial<{
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size: "sm" | "md" | "lg";
  variant: "flat" | "bordered" | "faded" | "underlined";
  radius: "none" | "sm" | "md" | "lg" | "full";
  labelPlacement: "inside" | "outside" | "outside-left";
}>;
```

## Utility Functions

### applyServerErrors

Map API validation errors into React Hook Form field errors.

```tsx
import { applyServerErrors } from "@rachelallyson/hero-hook-form";

applyServerErrors<TFieldValues>(
  setError: UseFormSetError<TFieldValues>,
  serverError: ServerFormError<TFieldValues>
): void
```

**Parameters:**

- `setError`: React Hook Form setError function
- `serverError`: Server validation error object

**ServerFormError Interface:**

```tsx
interface ServerFormError<TFieldValues extends FieldValues> {
  message?: string;
  fieldErrors?: readonly ServerFieldError<TFieldValues>[];
}

interface ServerFieldError<TFieldValues extends FieldValues> {
  path: Path<TFieldValues>;
  message: string;
  type?: string;
}
```

**Example:**

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      applyServerErrors(methods.setError, errorData);
      return;
    }
    
    console.log('Form submitted successfully');
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

## Types

### FormFieldConfig

Configuration object for form fields in ConfigurableForm (discriminated union).

```tsx
type FormFieldConfig<TFieldValues extends FieldValues> =
  | StringFieldConfig<TFieldValues>
  | BooleanFieldConfig<TFieldValues>
  | RadioFieldConfig<TFieldValues>
  | OtherFieldConfig<TFieldValues>;
```

**StringFieldConfig:**

```tsx
interface StringFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "input" | "textarea" | "select";
  defaultValue?: string;
  inputProps?: Omit<ComponentProps<typeof Input>, "value" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">;
  textareaProps?: Omit<ComponentProps<typeof Textarea>, "value" | "onValueChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">;
  selectProps?: Omit<ComponentProps<typeof Select>, "selectedKeys" | "onSelectionChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled">;
  options?: { label: string; value: string | number }[];
}
```

**BooleanFieldConfig:**

```tsx
interface BooleanFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "checkbox" | "switch";
  defaultValue?: boolean;
  checkboxProps?: Omit<ComponentProps<typeof Checkbox>, "isSelected" | "onValueChange" | "isInvalid" | "errorMessage" | "isDisabled">;
  switchProps?: Omit<ComponentProps<typeof Switch>, "isSelected" | "onValueChange" | "isInvalid" | "errorMessage" | "isDisabled">;
}
```

**RadioFieldConfig:**

```tsx
interface RadioFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "radio";
  defaultValue?: string;
  radioProps?: Omit<ComponentProps<typeof RadioGroup>, "value" | "onValueChange" | "label">;
  radioOptions?: { label: string; value: string | number }[];
}
```

**OtherFieldConfig:**

```tsx
interface OtherFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "slider" | "date" | "file";
  defaultValue?: string | number | Date;
  sliderProps?: Record<string, string | number | boolean>;
  dateProps?: Record<string, string | number | boolean>;
  fileProps?: Record<string, string | number | boolean>;
}
```

**BaseFormFieldConfig:**

```tsx
interface BaseFormFieldConfig<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  condition?: (values: Partial<TFieldValues>) => boolean;
  group?: string;
}
```

### FieldBaseProps

Base props shared by all field components.

```tsx
interface FieldBaseProps<TFieldValues extends FieldValues, TValue> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  defaultValue?: TValue;
  isDisabled?: boolean;
}
```

### WithControl

Interface for components that require React Hook Form control.

```tsx
interface WithControl<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
}
```

### FormValidationError

Error object for form validation.

```tsx
interface FormValidationError {
  message: string;
  field?: string;
}
```

### FormSubmissionState

State object for form submission.

```tsx
interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSuccess: boolean;
  error?: string;
}
```

### ZodFormConfig

Configuration object for Zod forms.

```tsx
interface ZodFormConfig<TFieldValues extends FieldValues> {
  schema: ZodSchemaType; // Will be z.ZodSchema when zod is available
  fields: ZodFormFieldConfig<TFieldValues>[];
  defaultValues?: Partial<TFieldValues>;
}
```

### ZodFormFieldConfig

Configuration object for Zod form fields (omits rules since validation is handled by schema).

```tsx
type ZodFormFieldConfig<TFieldValues extends FieldValues> =
  | Omit<StringFieldConfig<TFieldValues>, "rules">
  | Omit<BooleanFieldConfig<TFieldValues>, "rules">
  | Omit<RadioFieldConfig<TFieldValues>, "rules">
  | Omit<OtherFieldConfig<TFieldValues>, "rules">;
```

### ZodSchemaType

Conditional type for Zod schemas.

```tsx
type ZodSchemaType = typeof import("zod") extends { ZodSchema: infer T } ? T : any;
```

This type resolves to `z.ZodSchema` when Zod is available, otherwise falls back to `any`.

### FormConfig

Advanced form configuration interface.

```tsx
interface FormConfig<TFieldValues extends FieldValues> {
  fields: FormFieldConfig<TFieldValues>[];
  layout?: "vertical" | "horizontal" | "grid" | "custom";
  columns?: 1 | 2 | 3 | 4;
  spacing?: "sm" | "md" | "lg" | "xl";
  title?: string;
  subtitle?: string;
  showResetButton?: boolean;
  resetButtonText?: string;
  submitButtonText?: string;
  className?: string;
  defaultValues?: Partial<TFieldValues>;
}
```

### ConditionalValidation

Advanced validation type for conditional field validation.

```tsx
interface ConditionalValidation<TFieldValues extends FieldValues> {
  when: Path<TFieldValues>;
  is: string | number | boolean | null | undefined;
  then: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  otherwise?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
}
```

## React Hook Form Integration

All field components are built on top of React Hook Form and support all its features:

### Validation Rules

```tsx
const rules = {
  required: "This field is required",
  minLength: { value: 3, message: "Minimum 3 characters" },
  maxLength: { value: 20, message: "Maximum 20 characters" },
  pattern: { value: /^[A-Za-z]+$/, message: "Letters only" },
  validate: {
    customRule: (value) => value === "expected" || "Invalid value",
  },
};
```

### Form Modes

```tsx
const methods = useForm({
  mode: "onBlur", // "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all"
  defaultValues: {
    email: "",
    password: "",
  },
});
```

### Form State

```tsx
const { formState } = methods;
const { errors, isSubmitting, isSubmitted, isValid } = formState;
```

## TypeScript Support

All components are fully typed with TypeScript. The field name prop is automatically typed based on your form schema:

```tsx
interface FormData {
  name: string;
  email: string;
  plan: "free" | "pro" | "team";
  agree: boolean;
}

// TypeScript will enforce correct field names
<InputField<FormData>
  control={methods.control}
  name="email" // ✅ Valid
  // name="invalid" // ❌ TypeScript error
/>
```

## Entry Points

### Default Entrypoint

For individual HeroUI packages:

```tsx
import { InputField, SelectField, ConfigurableForm } from "@rachelallyson/hero-hook-form";
```

### React Entrypoint

For aggregate HeroUI package:

```tsx
import { InputField, SelectField, ConfigurableForm } from "@rachelallyson/hero-hook-form/react";
```

## Examples

For complete usage examples, see:

- [Getting Started](./getting-started.md) - Basic usage
- [Components](./components.md) - Component examples
- [Form Builder](./form-builder.md) - ConfigurableForm examples
- [Validation](./validation.md) - Validation patterns
- [Layouts](./layouts.md) - Layout configurations

## Next Steps

- [Getting Started](./getting-started.md) - Installation and setup
- [Components](./components.md) - Component documentation
- [Form Builder](./form-builder.md) - ConfigurableForm guide
- [Configuration](./configuration.md) - Global configuration
- [Validation](./validation.md) - Validation patterns
- [Layouts](./layouts.md) - Layout options
