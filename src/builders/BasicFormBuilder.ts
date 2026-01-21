import React from "react";
import type {
  ArrayPath,
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import type {
  ConditionalFieldConfig,
  ContentFieldConfig,
  ZodFormFieldConfig,
} from "../types";

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
 * Basic form field builder for creating form field configurations.
 *
 * @description
 * Provides a fluent API for building form field configurations. This builder
 * focuses on the most common use cases and eliminates the need for "as const"
 * assertions. Use this for simple forms with standard field types.
 *
 * @template T - The form data type
 *
 * @example
 * ```tsx
 * import { createBasicFormBuilder } from "@rachelallyson/hero-hook-form";
 *
 * const fields = createBasicFormBuilder()
 *   .input("name", "Name")
 *   .input("email", "Email", "email")
 *   .textarea("message", "Message")
 *   .select("country", "Country", [
 *     { label: "US", value: "us" },
 *     { label: "CA", value: "ca" },
 *   ])
 *   .checkbox("newsletter", "Subscribe to newsletter")
 *   .build();
 * ```
 *
 * @see {@link createAdvancedBuilder} for more advanced features
 * @see {@link FormFieldHelpers} for helper function alternative
 * @category Builders
 */
export class BasicFormBuilder<T extends FieldValues> {
  private fields: ZodFormFieldConfig<T>[] = [];

  /**
   * Add an input field
   */
  input(
    name: Path<T>,
    label: string,
    type: "text" | "email" | "tel" | "password" = "text",
  ): this {
    this.fields.push({
      inputProps: { type },
      label,
      name,
      type: "input",
    });

    return this;
  }

  /**
   * Add a textarea field
   */
  textarea(name: Path<T>, label: string, placeholder?: string): this {
    this.fields.push({
      label,
      name,
      textareaProps: { placeholder },
      type: "textarea",
    });

    return this;
  }

  /**
   * Add a select field
   */
  select(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
  ): this {
    this.fields.push({
      label,
      name,
      options,
      type: "select",
    });

    return this;
  }

  /**
   * Add an autocomplete field
   */
  autocomplete(
    name: Path<T>,
    label: string,
    items: { label: string; value: string | number }[],
    placeholder?: string,
  ): this {
    this.fields.push({
      autocompleteProps: placeholder ? { placeholder } : undefined,
      label,
      name,
      options: items,
      type: "autocomplete",
    });

    return this;
  }

  /**
   * Add a checkbox field
   */
  checkbox(name: Path<T>, label: string): this {
    this.fields.push({
      label,
      name,
      type: "checkbox",
    });

    return this;
  }

  /**
   * Add a content field for headers, questions, or custom content between fields
   */
  content(
    title?: string | null,
    description?: string | null,
    options?: {
      render?: (field: {
        form: any;
        errors: any;
        isSubmitting: boolean;
      }) => React.ReactNode;
      className?: string;
      name?: Path<T>;
    },
  ): this {
    this.fields.push({
      className: options?.className,
      description: description || undefined,
      name: options?.name,
      render: options?.render,
      title: title || undefined,
      type: "content",
    });

    return this;
  }

  /**
   * Add a switch field
   */
  switch(name: Path<T>, label: string, description?: string): this {
    this.fields.push({
      description,
      label,
      name,
      type: "switch",
    });

    return this;
  }

  /**
   * Build the final field configuration array
   */
  build(): ZodFormFieldConfig<T>[] {
    return this.fields;
  }
}

/**
 * Creates a basic form builder for simple form construction.
 *
 * @description
 * Provides a fluent API for building form field configurations. Best for
 * simple forms with standard field types. Returns a builder instance with
 * chainable methods for adding fields.
 *
 * @template T - The form data type
 *
 * @returns {BasicFormBuilder<T>} Builder instance with chainable methods
 *
 * @example
 * ```tsx
 * import { createBasicFormBuilder } from "@rachelallyson/hero-hook-form";
 *
 * const fields = createBasicFormBuilder()
 *   .input("name", "Name")
 *   .input("email", "Email", "email")
 *   .textarea("message", "Message")
 *   .select("country", "Country", [
 *     { label: "US", value: "us" },
 *     { label: "CA", value: "ca" },
 *   ])
 *   .checkbox("newsletter", "Subscribe to newsletter")
 *   .build();
 *
 * // Use with ZodForm
 * <ZodForm config={{ schema, fields }} onSubmit={handleSubmit} />
 * ```
 *
 * @see {@link createAdvancedBuilder} for more advanced features
 * @see {@link FormFieldHelpers} for helper function alternative
 * @see {@link defineInferredForm} for type-inferred forms
 * @category Builders
 */
export function createBasicFormBuilder<
  T extends FieldValues,
>(): BasicFormBuilder<T> {
  return new BasicFormBuilder<T>();
}

/**
 * Helper functions for creating form field configurations.
 *
 * @description
 * Simple helper functions for common field types. This is the recommended
 * approach for most use cases as it's straightforward and doesn't require
 * method chaining. Each helper returns a field configuration object.
 *
 * @example
 * ```tsx
 * import { FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 *
 * const fields = [
 *   FormFieldHelpers.input("name", "Name"),
 *   FormFieldHelpers.input("email", "Email", "email"),
 *   FormFieldHelpers.textarea("message", "Message"),
 *   FormFieldHelpers.select("country", "Country", [
 *     { label: "US", value: "us" },
 *     { label: "CA", value: "ca" },
 *   ]),
 *   FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
 *   FormFieldHelpers.conditional(
 *     "phone",
 *     (values) => values.hasPhone === true,
 *     FormFieldHelpers.input("phone", "Phone Number", "tel")
 *   ),
 * ];
 * ```
 *
 * @see {@link createBasicFormBuilder} for builder pattern alternative
 * @category Builders
 */
// Type alias for Input props
type InputPropsType = Omit<
  React.ComponentProps<typeof Input>,
  | "value"
  | "onValueChange"
  | "label"
  | "isInvalid"
  | "errorMessage"
  | "isDisabled"
>;

// Overload signatures for input helper
function inputHelper<T extends FieldValues>(
  name: Path<T>,
  label: string,
): ZodFormFieldConfig<T>;
function inputHelper<T extends FieldValues>(
  name: Path<T>,
  label: string,
  type: "text" | "email" | "tel" | "password",
): ZodFormFieldConfig<T>;
function inputHelper<T extends FieldValues>(
  name: Path<T>,
  label: string,
  inputProps: InputPropsType,
): ZodFormFieldConfig<T>;
function inputHelper<T extends FieldValues>(
  name: Path<T>,
  label: string,
  type: "text" | "email" | "tel" | "password",
  inputProps: InputPropsType,
): ZodFormFieldConfig<T>;
function inputHelper<T extends FieldValues>(
  name: Path<T>,
  label: string,
  typeOrProps?: "text" | "email" | "tel" | "password" | InputPropsType,
  inputProps?: InputPropsType,
): ZodFormFieldConfig<T> {
  // Handle case where third param is props object (not a type string)
  if (
    typeOrProps &&
    typeof typeOrProps === "object" &&
    !(
      "type" in typeOrProps &&
      typeof typeOrProps.type === "string" &&
      ["text", "email", "tel", "password"].includes(typeOrProps.type)
    )
  ) {
    return {
      inputProps: {
        type: "text",
        ...typeOrProps,
      },
      label,
      name,
      type: "input",
    };
  }

  // Handle case where third param is type string
  const type = typeof typeOrProps === "string" ? typeOrProps : undefined;

  return {
    inputProps: {
      type: type || "text",
      ...inputProps,
    },
    label,
    name,
    type: "input",
  };
}

export const FormFieldHelpers = {
  /**
   * Create an autocomplete field
   *
   * @example
   * ```tsx
   * // Simple autocomplete
   * FormFieldHelpers.autocomplete("country", "Country", options)
   *
   * // With placeholder
   * FormFieldHelpers.autocomplete("country", "Country", options, "Search countries")
   *
   * // With full customization
   * FormFieldHelpers.autocomplete("country", "Country", options, "Search countries", {
   *   classNames: { base: "custom-autocomplete" },
   *   allowsCustomValue: true
   * })
   * ```
   */
  autocomplete: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    items: { label: string; value: string | number }[],
    placeholder?: string,
    autocompleteProps?: Omit<
      React.ComponentProps<typeof Autocomplete>,
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
    >,
  ): ZodFormFieldConfig<T> => ({
    autocompleteProps: {
      ...(placeholder && { placeholder }),
      ...autocompleteProps,
    },
    label,
    name,
    options: items,
    type: "autocomplete",
  }),

  /**
   * Create a checkbox field
   *
   * @example
   * ```tsx
   * // Simple checkbox
   * FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter")
   *
   * // With full customization
   * FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter", {
   *   classNames: { base: "custom-checkbox" },
   *   size: "lg"
   * })
   * ```
   */
  checkbox: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    checkboxProps?: Omit<
      React.ComponentProps<typeof Checkbox>,
      | "isSelected"
      | "onValueChange"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >,
  ): ZodFormFieldConfig<T> => ({
    checkboxProps,
    label,
    name,
    type: "checkbox",
  }),

  /**
   * Create a checkbox group field (multiple checkboxes saving to an array)
   *
   * @example
   * ```tsx
   * // Simple checkbox group
   * FormFieldHelpers.checkboxGroup("interests", "Interests", [
   *   { label: "Reading", value: "reading" },
   *   { label: "Sports", value: "sports" },
   *   { label: "Music", value: "music" },
   * ])
   *
   * // With horizontal layout and custom styling
   * FormFieldHelpers.checkboxGroup("interests", "Interests", options, {
   *   orientation: "horizontal",
   *   checkboxProps: { color: "primary", size: "lg" }
   * })
   * ```
   */
  checkboxGroup: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
    config?: {
      checkboxProps?: Omit<
        React.ComponentProps<typeof Checkbox>,
        | "isSelected"
        | "onValueChange"
        | "isInvalid"
        | "errorMessage"
        | "isDisabled"
        | "name"
      >;
      orientation?: "vertical" | "horizontal";
      description?: string;
    },
  ): ZodFormFieldConfig<T> => ({
    checkboxGroupOptions: options,
    checkboxProps: config?.checkboxProps,
    description: config?.description,
    label,
    name,
    orientation: config?.orientation || "vertical",
    type: "checkboxGroup",
  }),

  /**
   * Create a conditional field that shows/hides based on form data
   *
   * @example
   * ```tsx
   * FormFieldHelpers.conditional(
   *   "phone",
   *   (values) => values.hasPhone === true,
   *   FormFieldHelpers.input("phone", "Phone Number", "tel")
   * )
   * ```
   *
   * @example
   * With explicit type in condition function (similar to content helper pattern):
   * ```tsx
   * FormFieldHelpers.conditional(
   *   "options",
   *   (formData: Partial<z.infer<typeof fieldSchema>>) =>
   *     formData.fieldType === 'DROPDOWN',
   *   FormFieldHelpers.textarea("options", "Dropdown Options", "One per line")
   * )
   * ```
   */
  conditional: <T extends FieldValues = FieldValues>(
    name: Path<T>,
    condition: (formData: Partial<T>) => boolean,
    field: ZodFormFieldConfig<T>,
  ): ZodFormFieldConfig<T> => {
    const config: ConditionalFieldConfig<T> = {
      condition,
      field,
      name,
      type: "conditional",
    };

    return config;
  },

  /**
   * Create a content field for headers, questions, or custom content between fields
   *
   * @example
   * ```tsx
   * // Simple header
   * FormFieldHelpers.content("Personal Information", "Please provide your details")
   *
   * // Custom render
   * FormFieldHelpers.content(null, null, {
   *   render: () => <div>Custom content</div>
   * })
   * ```
   */
  content: <T extends FieldValues = FieldValues>(
    title?: string | null,
    description?: string | null,
    options?: {
      render?: (field: {
        form: UseFormReturn<T>;
        errors: FieldErrors<T>;
        isSubmitting: boolean;
      }) => React.ReactNode;
      className?: string;
      name?: Path<T>;
    },
  ): ZodFormFieldConfig<T> => {
    const config: ContentFieldConfig<T> = {
      className: options?.className,
      description: description || undefined,
      name: options?.name,
      render: options?.render,
      title: title || undefined,
      type: "content",
    };

    return config;
  },

  /**
   * Create a custom field with full control over rendering
   *
   * @example
   * ```tsx
   * // Custom field with render function
   * FormFieldHelpers.custom<FormData>(
   *   "skills",
   *   "Skills",
   *   ({ form, control }) => {
   *     // Custom rendering logic
   *     return <div>...</div>;
   *   }
   * )
   * ```
   */
  custom: <T extends FieldValues>(
    name: Path<T> | ArrayPath<T>,
    label: string,
    render: (field: {
      name: Path<T> | ArrayPath<T>;
      control: Control<T>;
      form: UseFormReturn<T>;
      errors: FieldErrors<T>;
      isSubmitting: boolean;
    }) => React.ReactNode,
    options?: {
      description?: string;
      className?: string;
      isDisabled?: boolean;
    },
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    render,
    type: "custom",
    ...options,
  }),

  /**
   * Create a date field
   *
   * @example
   * ```tsx
   * // Simple date field
   * FormFieldHelpers.date("birthDate", "Birth Date")
   *
   * // With full customization
   * FormFieldHelpers.date("birthDate", "Birth Date", {
   *   label: "Select your birth date",
   *   granularity: "day",
   *   minValue: new CalendarDate(1900, 1, 1)
   * })
   * ```
   */
  date: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    dateProps?: Omit<
      React.ComponentProps<typeof DateInput>,
      | "value"
      | "onChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >,
  ): ZodFormFieldConfig<T> => ({
    dateProps,
    label,
    name,
    type: "date",
  }),

  /**
   * Create a file upload field
   *
   * @example
   * ```tsx
   * // Simple file field
   * FormFieldHelpers.file("avatar", "Profile Picture")
   *
   * // With accept and multiple
   * FormFieldHelpers.file("avatar", "Profile Picture", {
   *   accept: "image/*",
   *   multiple: true
   * })
   *
   * // With full customization
   * FormFieldHelpers.file("avatar", "Profile Picture", {
   *   accept: "image/*",
   *   multiple: false,
   *   fileProps: { className: "custom-file-input" }
   * })
   * ```
   */
  file: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: {
      accept?: string;
      fileProps?: Omit<
        React.ComponentProps<typeof Input>,
        | "value"
        | "onValueChange"
        | "label"
        | "isInvalid"
        | "errorMessage"
        | "isDisabled"
        | "type"
      >;
      multiple?: boolean;
    },
  ): ZodFormFieldConfig<T> => ({
    accept: options?.accept,
    fileProps: options?.fileProps,
    label,
    multiple: options?.multiple,
    name,
    type: "file",
  }),

  /**
   * Create a font picker field
   *
   * @example
   * ```tsx
   * // Simple font picker
   * FormFieldHelpers.fontPicker("font", "Choose Font")
   *
   * // With full customization
   * FormFieldHelpers.fontPicker("font", "Choose Font", {
   *   showFontPreview: true,
   *   loadAllVariants: false,
   *   fontsLoadedTimeout: 5000
   * })
   * ```
   */
  fontPicker: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    fontPickerProps?: {
      showFontPreview?: boolean;
      loadAllVariants?: boolean;
      onFontsLoaded?: (loaded: boolean) => void;
      fontsLoadedTimeout?: number;
    },
  ): ZodFormFieldConfig<T> => ({
    fontPickerProps,
    label,
    name,
    type: "fontPicker",
  }),

  /**
   * Create an input field
   *
   * @example
   * ```tsx
   * // Simple input
   * FormFieldHelpers.input("name", "Name")
   *
   * // With type
   * FormFieldHelpers.input("email", "Email", "email")
   *
   * // With props only (no type)
   * FormFieldHelpers.input("name", "Name", { placeholder: "Enter name" })
   *
   * // With type and props
   * FormFieldHelpers.input("email", "Email", "email", {
   *   placeholder: "Enter your email",
   *   classNames: { input: "custom-input" },
   *   startContent: <MailIcon />,
   *   description: "We'll never share your email"
   * })
   * ```
   */
  input: inputHelper,

  /**
   * Create a radio group field
   *
   * @example
   * ```tsx
   * // Simple radio group
   * FormFieldHelpers.radio("gender", "Gender", [
   *   { label: "Male", value: "male" },
   *   { label: "Female", value: "female" }
   * ])
   *
   * // With full customization
   * FormFieldHelpers.radio("gender", "Gender", options, {
   *   orientation: "horizontal",
   *   classNames: { base: "custom-radio" }
   * })
   * ```
   */
  /**
   * Create a radio group field
   *
   * @example
   * ```tsx
   * // Simple radio group
   * FormFieldHelpers.radio("gender", "Gender", [
   *   { label: "Male", value: "male" },
   *   { label: "Female", value: "female" }
   * ])
   *
   * // With full customization
   * FormFieldHelpers.radio("gender", "Gender", options, {
   *   orientation: "horizontal",
   *   classNames: { base: "custom-radio" }
   * })
   * ```
   */
  radio: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
    radioProps?: Omit<
      React.ComponentProps<typeof RadioGroup>,
      "value" | "onValueChange" | "label"
    >,
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    radioOptions: options,
    radioProps,
    type: "radio",
  }),

  /**
   * Create a select field
   *
   * @example
   * ```tsx
   * // Simple select
   * FormFieldHelpers.select("country", "Country", options)
   *
   * // With full customization
   * FormFieldHelpers.select("country", "Country", options, {
   *   placeholder: "Select a country",
   *   classNames: { trigger: "custom-select" },
   *   selectionMode: "multiple"
   * })
   * ```
   */
  select: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
    selectProps?: Omit<
      React.ComponentProps<typeof Select>,
      | "selectedKeys"
      | "onSelectionChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >,
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    options,
    selectProps,
    type: "select",
  }),

  /**
   * Create a slider field
   *
   * @example
   * ```tsx
   * // Simple slider
   * FormFieldHelpers.slider("rating", "Rating")
   *
   * // With full customization
   * FormFieldHelpers.slider("rating", "Rating", {
   *   minValue: 1,
   *   maxValue: 5,
   *   step: 1,
   *   showSteps: true,
   *   classNames: { base: "custom-slider" }
   * })
   * ```
   */
  slider: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    sliderProps?: Omit<
      React.ComponentProps<typeof Slider>,
      "value" | "onChange" | "label" | "isDisabled"
    >,
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    sliderProps,
    type: "slider",
  }),

  /**
   * Create a switch field
   *
   * @example
   * ```tsx
   * // Simple switch
   * FormFieldHelpers.switch("notifications", "Enable notifications")
   *
   * // With description
   * FormFieldHelpers.switch("notifications", "Enable notifications", "Receive email notifications")
   *
   * // With full customization
   * FormFieldHelpers.switch("notifications", "Enable notifications", "Receive email notifications", {
   *   classNames: { base: "custom-switch" },
   *   size: "lg",
   *   color: "primary"
   * })
   * ```
   */
  switch: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    description?: string,
    switchProps?: Omit<
      React.ComponentProps<typeof Switch>,
      | "isSelected"
      | "onValueChange"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >,
  ): ZodFormFieldConfig<T> => ({
    description,
    label,
    name,
    switchProps,
    type: "switch",
  }),

  /**
   * Create a textarea field
   *
   * @example
   * ```tsx
   * // Simple textarea
   * FormFieldHelpers.textarea("message", "Message")
   *
   * // With placeholder
   * FormFieldHelpers.textarea("message", "Message", "Enter your message")
   *
   * // With full customization
   * FormFieldHelpers.textarea("message", "Message", "Enter your message", {
   *   classNames: { input: "custom-textarea" },
   *   minRows: 3,
   *   maxRows: 10
   * })
   * ```
   */
  textarea: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    placeholder?: string,
    textareaProps?: Omit<
      React.ComponentProps<typeof Textarea>,
      | "value"
      | "onValueChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >,
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    textareaProps: {
      ...(placeholder && { placeholder }),
      ...textareaProps,
    },
    type: "textarea",
  }),
};

/**
 * Common field collections
 *
 * These helpers provide reusable field sets for common form patterns.
 * The `as Path<T>` assertions are necessary because TypeScript cannot prove
 * that string literals like "street" or "email" are valid paths in an arbitrary
 * form type `T`. These helpers are designed to work with any form type that
 * happens to have these fields - the type safety is enforced when you use them
 * with a specific form schema.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   street: z.string(),
 *   city: z.string(),
 *   // ... other fields
 * });
 *
 * const fields = [
 *   ...CommonFields.address<z.infer<typeof schema>>(),
 * ];
 * ```
 */
export const CommonFields = {
  /**
   * Address fields
   */
  address: <T extends FieldValues>() => [
    // Type assertions are necessary: TypeScript can't prove these strings are valid Path<T>
    // for an arbitrary T, but they will be valid when used with a matching schema
    FormFieldHelpers.input<T>("street" as Path<T>, "Street Address"),
    FormFieldHelpers.input<T>("city" as Path<T>, "City"),
    FormFieldHelpers.input<T>("state" as Path<T>, "State/Province"),
    FormFieldHelpers.input<T>("zipCode" as Path<T>, "ZIP/Postal Code"),
    FormFieldHelpers.select<T>("country" as Path<T>, "Country", [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
      { label: "Australia", value: "au" },
      { label: "Germany", value: "de" },
      { label: "France", value: "fr" },
    ]),
  ],

  /**
   * Personal information fields
   */
  personal: <T extends FieldValues>() => [
    // Type assertions are necessary - see CommonFields documentation above
    FormFieldHelpers.input<T>("firstName" as Path<T>, "First Name"),
    FormFieldHelpers.input<T>("lastName" as Path<T>, "Last Name"),
    FormFieldHelpers.input<T>("email" as Path<T>, "Email", "email"),
    FormFieldHelpers.input<T>("phone" as Path<T>, "Phone", "tel"),
  ],

  /**
   * Terms and conditions fields
   */
  terms: <T extends FieldValues>() => [
    // Type assertions are necessary - see CommonFields documentation above
    FormFieldHelpers.checkbox<T>(
      "terms" as Path<T>,
      "I agree to the terms and conditions",
    ),
    FormFieldHelpers.checkbox<T>(
      "privacy" as Path<T>,
      "I agree to the privacy policy",
    ),
    FormFieldHelpers.checkbox<T>(
      "newsletter" as Path<T>,
      "Subscribe to newsletter",
    ),
  ],
};
