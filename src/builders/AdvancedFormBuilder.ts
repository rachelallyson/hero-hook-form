import React from "react";
import type { FieldValues, Path } from "react-hook-form";
import type { ZodFormFieldConfig } from "../types";

import type { DateInput, Slider } from "#ui";

/**
 * Helper functions for creating individual field configurations
 */
function inputField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    type?: "text" | "email" | "tel" | "password" | "number" | "url";
    placeholder?: string;
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> | ZodFormFieldConfig<any> {
  return {
    label,
    name,
    type: "input",
    ...(props && {
      inputProps: {
        className: props.className,
        description: props.description,
        disabled: props.isDisabled,
        placeholder: props.placeholder,
        type: props.type || "text",
      },
    }),
  };
}

function textareaField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    placeholder?: string;
    description?: string;
    isDisabled?: boolean;
    className?: string;
    rows?: number;
  },
): ZodFormFieldConfig<T> | ZodFormFieldConfig<any> {
  return {
    label,
    name,
    type: "textarea",
    ...(props && {
      textareaProps: {
        className: props.className,
        description: props.description,
        disabled: props.isDisabled,
        placeholder: props.placeholder,
        rows: props.rows,
      },
    }),
  };
}

function selectField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  options: { label: string; value: string | number }[],
): ZodFormFieldConfig<T> {
  return {
    label,
    name,
    options,
    type: "select",
  };
}

function checkboxField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
  return {
    label,
    name,
    type: "checkbox",
    ...(props && {
      checkboxProps: {
        className: props.className,
        disabled: props.isDisabled,
      },
    }),
  };
}

function switchField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
  return {
    description: props?.description,
    isDisabled: props?.isDisabled,
    label,
    name,
    type: "switch",
    ...(props?.className && {
      switchProps: {
        className: props.className,
      },
    }),
  };
}

function radioField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  options: { label: string; value: string | number }[],
  props?: {
    description?: string;
    isDisabled?: boolean;
    className?: string;
    orientation?: "horizontal" | "vertical";
  },
): ZodFormFieldConfig<T> | ZodFormFieldConfig<any> {
  return {
    label,
    name,
    radioOptions: options,
    type: "radio",
    ...(props && {
      radioProps: {
        className: props.className,
        isDisabled: props.isDisabled,
        orientation: props.orientation,
      },
    }),
  };
}

function sliderField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    min?: number;
    max?: number;
    step?: number;
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
  return {
    label,
    name,
    type: "slider",
    ...(props && {
      sliderProps: {
        className: props.className,
        maxValue: props.max ?? 100,
        minValue: props.min ?? 0,
        step: props.step ?? 1,
      } as Omit<
        React.ComponentProps<typeof Slider>,
        "value" | "onChange" | "label" | "isDisabled"
      >,
    }),
  };
}

function dateField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    placeholder?: string;
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
  return {
    label,
    name,
    type: "date",
    ...(props && {
      dateProps: {
        className: props.className,
        placeholder: props.placeholder,
      } as React.ComponentProps<typeof DateInput>,
    }),
  };
}

function fileField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    accept?: string;
    multiple?: boolean;
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
  return {
    label,
    name,
    type: "file",
    ...(props && {
      fileProps: {
        accept: props.accept || "",
        className: props.className || "",
        disabled: props.isDisabled || false,
        multiple: props.multiple || false,
      },
    }),
  };
}

function fontPickerField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    description?: string;
    isDisabled?: boolean;
    className?: string;
    fontPickerProps?: {
      showFontPreview?: boolean;
      loadAllVariants?: boolean;
      onFontsLoaded?: (loaded: boolean) => void;
      fontsLoadedTimeout?: number;
    };
  },
): ZodFormFieldConfig<T> {
  return {
    className: props?.className,
    description: props?.description,
    fontPickerProps: props?.fontPickerProps,
    label,
    name,
    type: "fontPicker",
  };
}

function contentField<T extends FieldValues>(
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
): ZodFormFieldConfig<T> {
  return {
    className: options?.className,
    description: description || undefined,
    name: options?.name,
    render: options?.render,
    title: title || undefined,
    type: "content",
  };
}

/**
 * Unified field creation function
 * Takes field type as first argument and delegates to appropriate helper
 */
export function createField<T extends FieldValues>(
  type: string,
  name: Path<T>,
  label: string,
  optionsOrProps?: any,
  props?: any,
): ZodFormFieldConfig<T> {
  switch (type) {
    case "input":
      return inputField(name, label, optionsOrProps);

    case "textarea":
      return textareaField(name, label, optionsOrProps);

    case "select":
      return selectField(name, label, optionsOrProps);

    case "checkbox":
      return checkboxField(name, label, optionsOrProps);

    case "switch":
      return switchField(name, label, optionsOrProps);

    case "radio":
      return radioField(name, label, optionsOrProps, props);

    case "slider":
      return sliderField(name, label, optionsOrProps);

    case "date":
      return dateField(name, label, optionsOrProps);

    case "file":
      return fileField(name, label, optionsOrProps);

    case "fontPicker":
      return fontPickerField(name, label, optionsOrProps);

    case "content":
      // For content fields, name and label are optional
      // optionsOrProps can be title, description, or options object
      if (typeof optionsOrProps === "string" || optionsOrProps === null) {
        return contentField(optionsOrProps, props) as ZodFormFieldConfig<T>;
      }
      if (typeof optionsOrProps === "object" && optionsOrProps !== null) {
        return contentField(
          optionsOrProps.title,
          optionsOrProps.description,
          optionsOrProps,
        ) as ZodFormFieldConfig<T>;
      }

      return contentField(
        name as any,
        label as any,
        optionsOrProps,
      ) as ZodFormFieldConfig<T>;

    default:
      throw new Error(`Unknown field type: ${type}`);
  }
}

/**
 * Builder pattern for advanced field creation
 */
export class AdvancedFieldBuilder<T extends FieldValues> {
  private fields: ZodFormFieldConfig<T>[] = [];

  /**
   * Add any field type using the unified API
   */
  field(
    type: "input",
    name: Path<T>,
    label: string,
    props?: Parameters<typeof createField<T>>[3],
  ): this;
  field(
    type: "textarea",
    name: Path<T>,
    label: string,
    props?: Parameters<typeof createField<T>>[3],
  ): this;
  field(
    type: "select",
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
    props?: Parameters<typeof createField<T>>[4],
  ): this;
  field(
    type: "checkbox",
    name: Path<T>,
    label: string,
    props?: Parameters<typeof createField<T>>[3],
  ): this;
  field(
    type: "switch",
    name: Path<T>,
    label: string,
    props?: Parameters<typeof createField<T>>[3],
  ): this;
  field(
    type: "radio",
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
    props?: Parameters<typeof createField<T>>[4],
  ): this;
  field(
    type: "slider",
    name: Path<T>,
    label: string,
    props?: Parameters<typeof createField<T>>[3],
  ): this;
  field(
    type: "date",
    name: Path<T>,
    label: string,
    props?: Parameters<typeof createField<T>>[3],
  ): this;
  field(
    type: "file",
    name: Path<T>,
    label: string,
    props?: Parameters<typeof createField<T>>[3],
  ): this;
  field(
    type: string,
    name: Path<T>,
    label: string,
    optionsOrProps?: any,
    props?: any,
  ): this {
    this.fields.push(createField(type, name, label, optionsOrProps, props));

    return this;
  }

  /**
   * Add a conditional field that shows/hides based on form data
   */
  conditionalField(
    name: Path<T>,
    condition: (formData: Partial<T>) => boolean,
    field: ZodFormFieldConfig<T>,
  ): this {
    this.fields.push({
      condition,
      field,
      name,
      type: "conditional",
    } as ZodFormFieldConfig<T>);

    return this;
  }

  /**
   * Add a field array for dynamic repeating field groups
   */
  fieldArray(
    name: Path<T>,
    label: string,
    fields: ZodFormFieldConfig<any>[],
    options?: {
      min?: number;
      max?: number;
      addButtonText?: string;
      removeButtonText?: string;
    },
  ): this {
    this.fields.push({
      addButtonText: options?.addButtonText,
      fields,
      label,
      max: options?.max,
      min: options?.min,
      name,
      removeButtonText: options?.removeButtonText,
      type: "fieldArray",
    } as ZodFormFieldConfig<T>);

    return this;
  }

  /**
   * Add a dynamic section that shows/hides based on form data
   */
  dynamicSection(
    name: Path<T>,
    condition: (formData: Partial<T>) => boolean,
    fields: ZodFormFieldConfig<T>[],
    options?: {
      title?: string;
      description?: string;
    },
  ): this {
    this.fields.push({
      condition,
      description: options?.description,
      fields,
      name,
      title: options?.title,
      type: "dynamicSection",
    } as ZodFormFieldConfig<T>);

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
 * Field Array Builder for strongly-typed array item fields
 */
export class FieldArrayItemBuilder<TItem extends FieldValues> {
  private fields: ZodFormFieldConfig<TItem>[] = [];

  /**
   * Add any field type using the unified API for array items
   */
  field(
    type: "input",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: "textarea",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: "select",
    name: Path<TItem>,
    label: string,
    options: { label: string; value: string | number }[],
    props?: Parameters<typeof createField<TItem>>[4],
  ): this;
  field(
    type: "checkbox",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: "switch",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: "radio",
    name: Path<TItem>,
    label: string,
    options: { label: string; value: string | number }[],
    props?: Parameters<typeof createField<TItem>>[4],
  ): this;
  field(
    type: "slider",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: "date",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: "file",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: "fontPicker",
    name: Path<TItem>,
    label: string,
    props?: Parameters<typeof createField<TItem>>[3],
  ): this;
  field(
    type: string,
    name: Path<TItem>,
    label: string,
    optionsOrProps?: any,
    props?: any,
  ): this {
    this.fields.push(createField(type, name, label, optionsOrProps, props));

    return this;
  }

  /**
   * Build the field array item configuration
   */
  build(): ZodFormFieldConfig<TItem>[] {
    return this.fields;
  }
}

/**
 * Create a field array item builder for strongly-typed array fields
 */
export function createFieldArrayItemBuilder<
  TItem extends FieldValues,
>(): FieldArrayItemBuilder<TItem> {
  return new FieldArrayItemBuilder<TItem>();
}

/**
 * Field Array Builder for constructing field arrays with proper paths
 */
export class FieldArrayBuilder<
  T extends FieldValues,
  TArrayName extends Path<T>,
> {
  private fields: ZodFormFieldConfig<any>[] = [];

  constructor(private arrayName: TArrayName) {}

  field(
    type: string,
    name: string,
    label: string,
    optionsOrProps?: any,
    props?: any,
  ): this {
    const fullPath = `${this.arrayName}.${name}` as Path<T>;
    const fieldConfig = createField(
      type,
      fullPath,
      label,
      optionsOrProps,
      props,
    );

    this.fields.push(fieldConfig as ZodFormFieldConfig<any>);

    return this;
  }

  build(): ZodFormFieldConfig<any>[] {
    return this.fields;
  }
}

/**
 * Create a field array builder that constructs proper paths for array items
 */
export function createFieldArrayBuilder<
  T extends FieldValues,
  TArrayName extends Path<T>,
>(arrayName: TArrayName): FieldArrayBuilder<T, TArrayName> {
  return new FieldArrayBuilder<T, TArrayName>(arrayName);
}

/**
 * Create a new advanced field builder
 */
export function createAdvancedBuilder<
  T extends FieldValues,
>(): AdvancedFieldBuilder<T> {
  return new AdvancedFieldBuilder<T>();
}
