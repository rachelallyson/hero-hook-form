import type { ComponentProps } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

import type {
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from "#ui";

export interface FieldBaseProps<TFieldValues extends FieldValues, TValue> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  /** Additional validation rules */
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  /** Provide a default value when the form hasn't set one yet. */
  defaultValue?: TValue;
  /** Disable the input */
  isDisabled?: boolean;
}

export interface WithControl<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
}

// Base form field config without type-specific props
export interface BaseFormFieldConfig<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;

  // For conditional rendering
  condition?: (values: Partial<TFieldValues>) => boolean;
  dependsOn?: Path<TFieldValues>;
  dependsOnValue?: unknown;

  // For grouping related fields
  group?: string;

  // Accessibility enhancements
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// String-based field configs
export interface StringFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "input" | "textarea" | "select";
  defaultValue?: string;
  inputProps?: Omit<
    ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
  textareaProps?: Omit<
    ComponentProps<typeof Textarea>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
  selectProps?: Omit<
    ComponentProps<typeof Select>,
    | "selectedKeys"
    | "onSelectionChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
  options?: { label: string; value: string | number }[];
}

// Boolean-based field configs
export interface BooleanFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "checkbox" | "switch";
  defaultValue?: boolean;
  checkboxProps?: Omit<
    ComponentProps<typeof Checkbox>,
    "isSelected" | "onValueChange" | "isInvalid" | "errorMessage" | "isDisabled"
  >;
  switchProps?: Omit<
    ComponentProps<typeof Switch>,
    "isSelected" | "onValueChange" | "isInvalid" | "errorMessage" | "isDisabled"
  >;
}

// Radio field config
export interface RadioFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "radio";
  defaultValue?: string;
  radioProps?: Omit<
    ComponentProps<typeof RadioGroup>,
    "value" | "onValueChange" | "label"
  >;
  radioOptions?: { label: string; value: string | number }[];
}

// Slider field config
export interface SliderFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "slider";
  defaultValue?: number;
  sliderProps?: Record<string, string | number | boolean>;
}

// Date field config
export interface DateFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "date";
  defaultValue?: import("@internationalized/date").CalendarDate | null;
  dateProps?: Record<string, string | number | boolean>;
}

// File field config
export interface FileFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "file";
  defaultValue?: FileList | null;
  fileProps?: Record<string, string | number | boolean>;
  multiple?: boolean;
  accept?: string;
}

// Font picker field config
export interface FontPickerFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "fontPicker";
  defaultValue?: string;
  fontPickerProps?: Record<string, string | number | boolean>;
}

// Custom field config for advanced use cases
export interface CustomFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "custom";
  render: (field: {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    form: UseFormReturn<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    isSubmitting: boolean;
  }) => React.ReactNode;
}

// Union type for all field configs
export type FormFieldConfig<TFieldValues extends FieldValues> =
  | StringFieldConfig<TFieldValues>
  | BooleanFieldConfig<TFieldValues>
  | RadioFieldConfig<TFieldValues>
  | SliderFieldConfig<TFieldValues>
  | DateFieldConfig<TFieldValues>
  | FileFieldConfig<TFieldValues>
  | FontPickerFieldConfig<TFieldValues>
  | CustomFieldConfig<TFieldValues>;

// Advanced form configuration
export interface FormConfig<TFieldValues extends FieldValues> {
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

// Zod integration types (only available when zod is installed)
export type ZodFormFieldConfig<TFieldValues extends FieldValues> =
  | Omit<StringFieldConfig<TFieldValues>, "rules">
  | Omit<BooleanFieldConfig<TFieldValues>, "rules">
  | Omit<RadioFieldConfig<TFieldValues>, "rules">
  | Omit<SliderFieldConfig<TFieldValues>, "rules">
  | Omit<DateFieldConfig<TFieldValues>, "rules">
  | Omit<FileFieldConfig<TFieldValues>, "rules">
  | Omit<FontPickerFieldConfig<TFieldValues>, "rules">
  | Omit<CustomFieldConfig<TFieldValues>, "rules">;

export interface ZodFormConfig<TFieldValues extends FieldValues>
  extends UseFormProps<TFieldValues> {
  schema: import("zod").ZodSchema<TFieldValues>;
  fields: ZodFormFieldConfig<TFieldValues>[];

  // Enhanced error handling
  onError?: (errors: FieldErrors<TFieldValues>) => void;
  errorDisplay?: "inline" | "toast" | "modal" | "none";

  // Form state access for advanced use cases
  render?: (formState: {
    form: UseFormReturn<TFieldValues>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    isSuccess: boolean;
    errors: FieldErrors<TFieldValues>;
    values: TFieldValues;
  }) => React.ReactNode;
}

export interface FormValidationError {
  message: string;
  field?: string;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSuccess: boolean;
  error?: string;
}

// Form wizard/multi-step types
export interface FormStep<TFieldValues extends FieldValues> {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldConfig<TFieldValues>[];
  validation?: (values: Partial<TFieldValues>) => boolean;
}

export interface WizardFormConfig<TFieldValues extends FieldValues> {
  steps: FormStep<TFieldValues>[];
  allowStepNavigation?: boolean;
  showStepProgress?: boolean;
}

// Advanced validation types
export interface ConditionalValidation<TFieldValues extends FieldValues> {
  when: Path<TFieldValues>;
  is: string | number | boolean | null | undefined;
  then: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  otherwise?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
}

// Form field grouping
export interface FieldGroup<TFieldValues extends FieldValues> {
  id: string;
  title?: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: FormFieldConfig<TFieldValues>[];
}

// Validation utilities
export interface ValidationUtils {
  createMinLengthSchema: (
    min: number,
    fieldName: string,
  ) => import("zod").ZodString;
  createMaxLengthSchema: (
    max: number,
    fieldName: string,
  ) => import("zod").ZodString;
  createEmailSchema: () => import("zod").ZodString;
  createRequiredSchema: (fieldName: string) => import("zod").ZodString;
  createUrlSchema: () => import("zod").ZodString;
  createPhoneSchema: () => import("zod").ZodString;
}

// Testing utilities
export interface FormTestUtils<TFieldValues extends FieldValues> {
  getField: (name: Path<TFieldValues>) => {
    value: unknown;
    error: unknown;
    isDirty: boolean;
    isTouched: boolean;
  };
  submitForm: () => Promise<void>;
  resetForm: () => void;
  getFormState: () => {
    values: TFieldValues;
    errors: FieldErrors<TFieldValues>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    isSuccess: boolean;
  };
  setFieldValue: (name: Path<TFieldValues>, value: unknown) => void;
  triggerValidation: (name?: Path<TFieldValues>) => Promise<boolean>;
}
