# Configuration Reference

Complete reference for all configuration options in Hero Hook Form.

## Form Configuration

### ZodForm Configuration

```tsx
interface ZodFormConfig<T extends FieldValues> {
  schema: ZodSchema<T>;
  fields: ZodFormFieldConfig<T>[];
  onSubmit: SubmitHandler<T>;
  onError?: (error: FormValidationError) => void;
  onSuccess?: (data: T) => void;
  defaultValues?: Partial<T>;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  layout?: "vertical" | "horizontal" | "grid";
  columns?: 1 | 2 | 3;
  spacing?: "2" | "4" | "6" | "8" | "lg";
  className?: string;
  submitButtonProps?: Partial<ComponentProps<typeof Button>>;
}
```

### ConfigurableForm Configuration

```tsx
interface FormProps<T extends FieldValues> {
  fields: FormFieldConfig<T>[];
  onSubmit: SubmitHandler<T>;
  onError?: (error: FormValidationError) => void;
  onSuccess?: (data: T) => void;
  defaultValues?: Partial<T>;
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  layout?: "vertical" | "horizontal" | "grid";
  columns?: 1 | 2 | 3;
  spacing?: "2" | "4" | "6" | "8" | "lg";
  className?: string;
  submitButtonProps?: Partial<ComponentProps<typeof Button>>;
}
```

## Field Configuration

### Base Field Configuration

```tsx
interface BaseFormFieldConfig<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  condition?: (values: Partial<TFieldValues>) => boolean;
  dependsOn?: Path<TFieldValues>;
  dependsOnValue?: unknown;
  group?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

### Input Field Configuration

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

### Boolean Field Configuration

```tsx
interface BooleanFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "checkbox" | "switch";
  defaultValue?: boolean;
  checkboxProps?: Omit<ComponentProps<typeof Checkbox>, "isSelected" | "onValueChange" | "isDisabled">;
  switchProps?: Omit<ComponentProps<typeof Switch>, "isSelected" | "onValueChange" | "isDisabled">;
}
```

### Radio Group Configuration

```tsx
interface RadioGroupFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "radio";
  defaultValue?: string | number;
  radioProps?: Omit<ComponentProps<typeof RadioGroup>, "value" | "onValueChange" | "isDisabled">;
  radioOptions: { label: string; value: string | number }[];
}
```

### Slider Configuration

```tsx
interface SliderFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "slider";
  defaultValue?: number;
  sliderProps?: Omit<ComponentProps<typeof Slider>, "value" | "onChange" | "isDisabled">;
  min?: number;
  max?: number;
  step?: number;
}
```

### Date Field Configuration

```tsx
interface DateFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "date";
  defaultValue?: string;
  dateProps?: Omit<ComponentProps<typeof DateInput>, "value" | "onValueChange" | "isDisabled">;
  datePickerProps?: Omit<ComponentProps<typeof DatePicker>, "value" | "onValueChange" | "isDisabled">;
}
```

### File Field Configuration

```tsx
interface FileFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "file";
  defaultValue?: File[];
  fileProps?: Omit<ComponentProps<typeof FileInput>, "value" | "onValueChange" | "isDisabled">;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
}
```

### Font Picker Configuration

```tsx
interface FontPickerFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "fontPicker";
  defaultValue?: string;
  fontPickerProps?: Omit<ComponentProps<typeof FontPicker>, "value" | "onValueChange" | "isDisabled">;
  googleFontsApiKey?: string;
  categories?: string[];
  showPreview?: boolean;
}
```

## Builder Configuration

### Advanced Builder Configuration

```tsx
interface AdvancedBuilderConfig<T extends FieldValues> {
  fields: AdvancedFormFieldConfig<T>[];
  validation?: {
    mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
    reValidateMode?: "onChange" | "onBlur" | "onSubmit";
    delayError?: number;
  };
  layout?: {
    type?: "vertical" | "horizontal" | "grid";
    columns?: 1 | 2 | 3;
    spacing?: "2" | "4" | "6" | "8" | "lg";
  };
  submit?: {
    text?: string;
    props?: Partial<ComponentProps<typeof Button>>;
  };
  reset?: {
    show?: boolean;
    text?: string;
    props?: Partial<ComponentProps<typeof Button>>;
  };
}
```

### Type-Inferred Builder Configuration

```tsx
interface TypeInferredBuilderConfig {
  fields: TypeInferredFieldConfig[];
  schema?: ZodSchema;
  validation?: ValidationConfig;
  layout?: LayoutConfig;
  submit?: SubmitConfig;
  reset?: ResetConfig;
}
```

## Provider Configuration

### ConfigProvider Configuration

```tsx
interface ConfigProviderProps {
  children: React.ReactNode;
  defaults?: {
    input?: Partial<ComponentProps<typeof Input>>;
    textarea?: Partial<ComponentProps<typeof Textarea>>;
    select?: Partial<ComponentProps<typeof Select>>;
    checkbox?: Partial<ComponentProps<typeof Checkbox>>;
    switch?: Partial<ComponentProps<typeof Switch>>;
    radio?: Partial<ComponentProps<typeof RadioGroup>>;
    slider?: Partial<ComponentProps<typeof Slider>>;
    date?: Partial<ComponentProps<typeof DateInput>>;
    file?: Partial<ComponentProps<typeof FileInput>>;
    fontPicker?: Partial<ComponentProps<typeof FontPicker>>;
    submitButton?: Partial<ComponentProps<typeof Button>>;
  };
  theme?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    danger?: string;
  };
  validation?: {
    mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
    reValidateMode?: "onChange" | "onBlur" | "onSubmit";
    delayError?: number;
  };
}
```

### FormProvider Configuration

```tsx
interface FormProviderProps<T extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit?: SubmitHandler<T>;
  onError?: (error: FormValidationError) => void;
  onSuccess?: (data: T) => void;
  defaultValues?: Partial<T>;
}
```

## Validation Configuration

### Validation Rules

```tsx
interface ValidationRules {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: ValidationRule | ValidationRule[];
  custom?: (value: any, formValues: any) => boolean | string;
}
```

### Zod Schema Configuration

```tsx
interface ZodSchemaConfig {
  schema: ZodSchema;
  resolver?: "zod" | "yup" | "joi" | "ajv";
  options?: {
    mode?: "sync" | "async";
    delayError?: number;
  };
}
```

## Layout Configuration

### Grid Layout

```tsx
interface GridLayoutConfig {
  type: "grid";
  columns: 1 | 2 | 3;
  spacing: "2" | "4" | "6" | "8" | "lg";
  responsive?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3;
    desktop?: 1 | 2 | 3;
  };
}
```

### Horizontal Layout

```tsx
interface HorizontalLayoutConfig {
  type: "horizontal";
  spacing: "2" | "4" | "6" | "8" | "lg";
  labelWidth?: string;
  fieldWidth?: string;
}
```

### Vertical Layout

```tsx
interface VerticalLayoutConfig {
  type: "vertical";
  spacing: "2" | "4" | "6" | "8" | "lg";
  fieldSpacing?: string;
}
```

## Performance Configuration

### Debounced Validation

```tsx
interface DebouncedValidationConfig {
  enabled: boolean;
  delay: number;
  maxDelay?: number;
  leading?: boolean;
  trailing?: boolean;
}
```

### Memoization Configuration

```tsx
interface MemoizationConfig {
  enabled: boolean;
  dependencies?: string[];
  compare?: (prev: any, next: any) => boolean;
}
```

### Performance Monitoring

```tsx
interface PerformanceMonitoringConfig {
  enabled: boolean;
  metrics?: {
    renderTime?: boolean;
    validationTime?: boolean;
    submissionTime?: boolean;
  };
  thresholds?: {
    renderTime?: number;
    validationTime?: number;
    submissionTime?: number;
  };
}
```

## Environment Variables

### Required Environment Variables

```bash
# Google Fonts API Key (for FontPickerField)
GOOGLE_FONTS_API_KEY=your_api_key_here
```

### Optional Environment Variables

```bash
# Development
NODE_ENV=development
DEBUG=hero-hook-form:*

# Performance
HERO_HOOK_FORM_PERFORMANCE_MONITORING=true
HERO_HOOK_FORM_DEBOUNCE_DELAY=300

# Validation
HERO_HOOK_FORM_VALIDATION_MODE=onBlur
HERO_HOOK_FORM_REVALIDATE_MODE=onChange
```

## Default Values

### Form Defaults

```tsx
const defaultFormConfig = {
  layout: "vertical" as const,
  columns: 1 as const,
  spacing: "4" as const,
  submitButtonText: "Submit",
  resetButtonText: "Reset",
  showResetButton: false,
  validation: {
    mode: "onSubmit" as const,
    reValidateMode: "onChange" as const,
    delayError: 0,
  },
};
```

### Field Defaults

```tsx
const defaultFieldConfig = {
  isDisabled: false,
  rules: {},
  condition: undefined,
  dependsOn: undefined,
  dependsOnValue: undefined,
  group: undefined,
  ariaLabel: undefined,
  ariaDescribedBy: undefined,
};
```

### Component Defaults

```tsx
const defaultComponentProps = {
  input: {
    variant: "bordered",
    color: "default",
    size: "md",
  },
  textarea: {
    variant: "bordered",
    color: "default",
    size: "md",
  },
  select: {
    variant: "bordered",
    color: "default",
    size: "md",
  },
  checkbox: {
    color: "primary",
    size: "md",
  },
  switch: {
    color: "primary",
    size: "md",
  },
  radio: {
    color: "primary",
    size: "md",
  },
  slider: {
    color: "primary",
    size: "md",
  },
  date: {
    variant: "bordered",
    color: "default",
    size: "md",
  },
  file: {
    variant: "bordered",
    color: "default",
    size: "md",
  },
  fontPicker: {
    variant: "bordered",
    color: "default",
    size: "md",
  },
  submitButton: {
    color: "primary",
    variant: "solid",
    size: "md",
  },
};
```

## Configuration Precedence

1. **Field-level props** (highest priority)
2. **Form-level configuration**
3. **Provider-level defaults**
4. **Package defaults** (lowest priority)

## Configuration Validation

All configuration options are validated at runtime:

```tsx
// Invalid configuration will throw an error
const config = {
  layout: "invalid", // ❌ Error: Invalid layout type
  columns: 5,        // ❌ Error: Invalid column count
  spacing: "10",     // ❌ Error: Invalid spacing value
};
```

## TypeScript Support

All configuration options are fully typed:

```tsx
// TypeScript will catch configuration errors
const config: ZodFormConfig<MyFormData> = {
  schema: mySchema,
  fields: myFields,
  onSubmit: handleSubmit,
  layout: "grid",     // ✅ Valid
  columns: 2,         // ✅ Valid
  spacing: "4",      // ✅ Valid
};
```
