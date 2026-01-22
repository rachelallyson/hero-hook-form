import type { ComponentProps } from "react";
import type {
  ArrayPath,
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

import type {
  Autocomplete,
  Checkbox,
  DateInput,
  Input,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
} from "#ui";

/**
 * All supported field types that can be used in form builders
 * This type is used throughout the codebase to ensure consistency
 */
export type FormFieldType =
  | "input"
  | "textarea"
  | "select"
  | "autocomplete"
  | "checkbox"
  | "switch"
  | "radio"
  | "slider"
  | "date"
  | "file"
  | "fontPicker"
  | "stringArray";

/**
 * Helper to convert a Path<T>, ArrayPath<T>, or string to a string for use in React keys and DOM operations.
 * Path<T> and ArrayPath<T> are branded string types, so this is safe - it's just removing the brand.
 *
 * @param path - The path to convert (can be Path<T>, ArrayPath<T>, string, or undefined)
 * @returns The path as a plain string, or empty string if undefined
 */
export function pathToString<T extends FieldValues>(
  path: Path<T> | ArrayPath<T> | string | undefined,
): string {
  if (path === undefined) return "";

  // Path<T> and ArrayPath<T> are branded strings, so this cast is safe
  return path as unknown as string;
}

export interface FieldBaseProps<TFieldValues extends FieldValues, TValue> {
  // name must be Path<TFieldValues> - Controller requires this exact type
  // When field configs come from FormFieldHelpers without generics, they have string
  // but at runtime it's always a valid path, so we accept both for flexibility
  // The field components will pass it to Controller which accepts it at runtime
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
  // Accept Control type from react-hook-form.
  // Controller uses structural typing internally, so it will accept compatible Control types.
  control: Control<TFieldValues, any>;
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
  type: "input" | "textarea" | "select" | "autocomplete";
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
  autocompleteProps?: Omit<
    ComponentProps<typeof Autocomplete>,
    | "selectedKey"
    | "onSelectionChange"
    | "inputValue"
    | "onInputChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
    | "children"
    | "items"
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

// Checkbox group field config
export interface CheckboxGroupFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "checkboxGroup";
  defaultValue?: (string | number)[];
  checkboxGroupOptions?: { label: string; value: string | number }[];
  checkboxProps?: Omit<
    React.ComponentProps<typeof import("#ui").Checkbox>,
    | "isSelected"
    | "onValueChange"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
    | "name"
  >;
  orientation?: "vertical" | "horizontal";
}

// Slider field config
export interface SliderFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "slider";
  defaultValue?: number;
  sliderProps?: Omit<
    ComponentProps<typeof Slider>,
    "value" | "onChange" | "label" | "isDisabled"
  >;
}

// Date field config
export interface DateFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "date";
  defaultValue?: import("@internationalized/date").CalendarDate | null;
  dateProps?: Omit<
    ComponentProps<typeof DateInput>,
    "value" | "onChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled"
  >;
}

// File field config
export interface FileFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "file";
  defaultValue?: FileList | null;
  fileProps?: Omit<
    ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
    | "type"
  >;
  multiple?: boolean;
  accept?: string;
}

// Font picker field config
export interface FontPickerFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "fontPicker";
  defaultValue?: string;
  fontPickerProps?: {
    showFontPreview?: boolean;
    loadAllVariants?: boolean;
    onFontsLoaded?: (loaded: boolean) => void;
    fontsLoadedTimeout?: number;
  };
}

// String array field config for arrays of strings (like tags, skills, etc.)
export interface StringArrayFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "stringArray";
  defaultValue?: string[];
  stringArrayProps?: {
    /** Placeholder text for the input */
    placeholder?: string;
    /** Maximum number of items allowed */
    maxItems?: number;
    /** Minimum number of items required */
    minItems?: number;
    /** Allow duplicate values */
    allowDuplicates?: boolean;
    /** Custom validation function for each item */
    validateItem?: (item: string) => string | true;
    /** Transform item before adding (e.g., trim whitespace) */
    transformItem?: (item: string) => string;
    /** Custom chip render function */
    renderChip?: (item: string, onRemove: () => void) => React.ReactNode;
    /** Custom add button text */
    addButtonText?: string;
    /** Whether to show add button or use enter key */
    showAddButton?: boolean;
  };
}

// Custom field config for advanced use cases
export interface CustomFieldConfig<TFieldValues extends FieldValues>
  extends Omit<BaseFormFieldConfig<TFieldValues>, "name"> {
  type: "custom";
  // Accept both Path and ArrayPath to support field arrays
  name: Path<TFieldValues> | ArrayPath<TFieldValues>;
  render: (field: {
    name: Path<TFieldValues> | ArrayPath<TFieldValues>;
    control: Control<TFieldValues>;
    form: UseFormReturn<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    isSubmitting: boolean;
  }) => React.ReactNode;
}

// Conditional field config for dynamic rendering
export interface ConditionalFieldConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "conditional";
  condition: (formData: Partial<TFieldValues>) => boolean;
  field: ZodFormFieldConfig<TFieldValues>;
}

/**
 * Field array config for dynamic repeating field groups.
 *
 * @description
 * Configuration for field arrays that support reordering, custom rendering,
 * default values, and conditional fields within array items.
 *
 * @template TFieldValues - The form data type
 */
export interface FieldArrayConfig<TFieldValues extends FieldValues>
  extends Omit<BaseFormFieldConfig<TFieldValues>, "name"> {
  type: "fieldArray";
  /** Field array name - must be an ArrayPath (points to an array field) */
  name: ArrayPath<TFieldValues>;
  /** Field configurations for each array item */
  fields: ZodFormFieldConfig<TFieldValues>[];
  /** Minimum number of items (default: 0) */
  min?: number;
  /** Maximum number of items (default: 10) */
  max?: number;
  /** Add button text (default: "Add Item") */
  addButtonText?: string;
  /** Remove button text (default: "Remove") */
  removeButtonText?: string;
  /** Enable reordering of array items with up/down buttons (default: false) */
  enableReordering?: boolean;
  /** Custom text for reorder buttons */
  reorderButtonText?: {
    /** Text for move up button (default: "↑") */
    up?: string;
    /** Text for move down button (default: "↓") */
    down?: string;
  };
  /** Function to create default item when adding new array item */
  defaultItem?: () => any;
  /** Whether this field array should always be registered (for conditional rendering) */
  alwaysRegistered?: boolean;
  /** Custom render function for array items */
  renderItem?: (props: {
    /** Item index (0-based) */
    index: number;
    /** Field array item with id */
    field: { id: string; [key: string]: any };
    /** All fields in the array */
    fields: { id: string; [key: string]: any }[];
    /** Rendered field elements */
    children: React.ReactNode;
    /** Remove this item */
    onRemove: () => void;
    /** Move item up */
    onMoveUp: () => void;
    /** Move item down */
    onMoveDown: () => void;
    /** Whether item can be removed */
    canRemove: boolean;
    /** Whether item can move up */
    canMoveUp: boolean;
    /** Whether item can move down */
    canMoveDown: boolean;
  }) => React.ReactNode;
  /** Custom render function for add button */
  renderAddButton?: (props: {
    /** Add new item */
    onAdd: () => void;
    /** Whether new item can be added */
    canAdd: boolean;
  }) => React.ReactNode;
}

// Dynamic section config for grouped conditional fields
export interface DynamicSectionConfig<TFieldValues extends FieldValues>
  extends BaseFormFieldConfig<TFieldValues> {
  type: "dynamicSection";
  title?: string;
  description?: string;
  condition: (formData: Partial<TFieldValues>) => boolean;
  fields: ZodFormFieldConfig<TFieldValues>[];
}

// Content field config for adding headers, questions, or custom content between fields
// When name is not provided, this is compatible with any form type
// The render function is typed to accept the specific form type, but when not provided,
// ContentFieldConfig<FieldValues> is structurally compatible with ContentFieldConfig<SpecificType>
export interface ContentFieldConfig<
  TFieldValues extends FieldValues = FieldValues,
> {
  type: "content";
  // Optional name - if not provided, won't be part of form schema
  // When provided, must be a valid Path<TFieldValues>
  name?: Path<TFieldValues>;
  // Optional title for simple header rendering
  title?: string;
  // Optional description/subtitle
  description?: string;
  // Custom render function for full control
  // When render is not provided, the config is compatible with any form type
  // When render is provided, it should match the specific form type being used
  render?: (field: {
    form: UseFormReturn<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    isSubmitting: boolean;
  }) => React.ReactNode;
  // Optional className for styling
  className?: string;
}

// Union type for all field configs
export type FormFieldConfig<TFieldValues extends FieldValues> =
  | StringFieldConfig<TFieldValues>
  | BooleanFieldConfig<TFieldValues>
  | RadioFieldConfig<TFieldValues>
  | CheckboxGroupFieldConfig<TFieldValues>
  | SliderFieldConfig<TFieldValues>
  | DateFieldConfig<TFieldValues>
  | FileFieldConfig<TFieldValues>
  | FontPickerFieldConfig<TFieldValues>
  | StringArrayFieldConfig<TFieldValues>
  | CustomFieldConfig<TFieldValues>
  | ConditionalFieldConfig<TFieldValues>
  | FieldArrayConfig<TFieldValues>
  | DynamicSectionConfig<TFieldValues>
  | ContentFieldConfig<TFieldValues>;

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
  | Omit<CheckboxGroupFieldConfig<TFieldValues>, "rules">
  | Omit<SliderFieldConfig<TFieldValues>, "rules">
  | Omit<DateFieldConfig<TFieldValues>, "rules">
  | Omit<FileFieldConfig<TFieldValues>, "rules">
  | Omit<FontPickerFieldConfig<TFieldValues>, "rules">
  | Omit<StringArrayFieldConfig<TFieldValues>, "rules">
  | Omit<CustomFieldConfig<TFieldValues>, "rules">
  | Omit<ConditionalFieldConfig<TFieldValues>, "rules">
  | Omit<FieldArrayConfig<TFieldValues>, "rules">
  | Omit<DynamicSectionConfig<TFieldValues>, "rules">
  | ContentFieldConfig<TFieldValues>;

export interface ZodFormConfig<TFieldValues extends FieldValues>
  extends UseFormProps<TFieldValues> {
  schema: import("zod").ZodSchema<TFieldValues>;
  // Fields can be created with FormFieldHelpers - TypeScript will ensure compatibility
  // Each field config must have a name that's a valid path in TFieldValues
  // Template literal types from FormFieldHelpers (e.g., "email" | `email.${string}`) are
  // compatible with Path<TFieldValues> when the base path exists in TFieldValues
  fields: (
    | ZodFormFieldConfig<TFieldValues>
    | (Omit<ZodFormFieldConfig<FieldValues>, "name"> & {
        name: Path<TFieldValues>;
      })
  )[];

  // Enhanced error handling
  onError?: (errors: FieldErrors<TFieldValues>) => void;
  errorDisplay?: "inline" | "toast" | "modal" | "none";
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
