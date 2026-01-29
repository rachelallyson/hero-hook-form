import React from "react";
import type {
  ArrayPath,
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import type {
  ConditionalFieldConfig,
  DynamicSectionConfig,
  FieldArrayConfig,
  ZodFormFieldConfig,
} from "../types";

/**
 * Discriminated union types for field creation parameters
 * This eliminates the need for 'unknown' types and type assertions
 */
export type FieldCreationParams<T extends FieldValues> =
  | {
      type: "input";
      name: Path<T>;
      label: string;
      props?: {
        type?: "text" | "email" | "tel" | "password" | "number" | "url";
        placeholder?: string;
        description?: string;
        isDisabled?: boolean;
        className?: string;
      };
    }
  | {
      type: "textarea";
      name: Path<T>;
      label: string;
      props?: {
        placeholder?: string;
        description?: string;
        isDisabled?: boolean;
        className?: string;
        rows?: number;
      };
    }
  | {
      type: "select";
      name: Path<T>;
      label: string;
      options: { label: string; value: string | number }[];
    }
  | {
      type: "autocomplete";
      name: Path<T>;
      label: string;
      options: { label: string; value: string | number }[];
      props?: Record<string, unknown>;
    }
  | {
      type: "checkbox";
      name: Path<T>;
      label: string;
      props?: {
        description?: string;
        isDisabled?: boolean;
        className?: string;
      };
    }
  | {
      type: "switch";
      name: Path<T>;
      label: string;
      props?: {
        description?: string;
        isDisabled?: boolean;
        className?: string;
      };
    }
  | {
      type: "radio";
      name: Path<T>;
      label: string;
      options: { label: string; value: string | number }[];
      props?: {
        description?: string;
        isDisabled?: boolean;
        className?: string;
        orientation?: "horizontal" | "vertical";
      };
    }
  | {
      type: "slider";
      name: Path<T>;
      label: string;
      props?: {
        min?: number;
        max?: number;
        step?: number;
        description?: string;
        isDisabled?: boolean;
        className?: string;
      };
    }
  | {
      type: "date";
      name: Path<T>;
      label: string;
      props?: {
        placeholder?: string;
        description?: string;
        isDisabled?: boolean;
        className?: string;
      };
    }
  | {
      type: "file";
      name: Path<T>;
      label: string;
      props?: {
        accept?: string;
        multiple?: boolean;
        description?: string;
        isDisabled?: boolean;
        className?: string;
      };
    }
  | {
      type: "fontPicker";
      name: Path<T>;
      label: string;
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
      };
    }
  | {
      type: "stringArray";
      name: Path<T>;
      label: string;
      props?: {
        placeholder?: string;
        maxItems?: number;
        minItems?: number;
        allowDuplicates?: boolean;
        validateItem?: (item: string) => string | true;
        transformItem?: (item: string) => string;
        addButtonText?: string;
        showAddButton?: boolean;
        description?: string;
        isDisabled?: boolean;
        className?: string;
      };
    }
  | {
      type: "content";
      name?: Path<T>;
      label?: string;
      title?: string | null;
      description?: string | null;
      render?: (field: {
        form: UseFormReturn<T>;
        errors: FieldErrors<T>;
        isSubmitting: boolean;
      }) => React.ReactNode;
      className?: string;
    };

/**
 * Helper functions for creating individual field configurations
 * These are now properly typed without using Parameters<> or type assertions
 */
function createInputField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    type?: "text" | "email" | "tel" | "password" | "number" | "url";
    placeholder?: string;
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
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

function createTextareaField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    placeholder?: string;
    description?: string;
    isDisabled?: boolean;
    className?: string;
    rows?: number;
  },
): ZodFormFieldConfig<T> {
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

function createSelectField<T extends FieldValues>(
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

function createCheckboxField<T extends FieldValues>(
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

function createSwitchField<T extends FieldValues>(
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

function createRadioField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  options: { label: string; value: string | number }[],
  props?: {
    description?: string;
    isDisabled?: boolean;
    className?: string;
    orientation?: "horizontal" | "vertical";
  },
): ZodFormFieldConfig<T> {
  return {
    label,
    name,
    radioOptions: options,
    type: "radio",
    ...(props && {
      radioProps: {
        className: props.className,
        orientation: props.orientation,
      },
    }),
  };
}

function createSliderField<T extends FieldValues>(
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
      },
    }),
  };
}

function createDateField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    placeholder?: string;
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
  // DateInput only supports className from our props
  const dateProps: { className?: string } = {};

  if (props?.className !== undefined) {
    dateProps.className = props.className;
  }

  return {
    label,
    name,
    type: "date",
    ...(Object.keys(dateProps).length > 0 && { dateProps }),
  };
}

function createFileField<T extends FieldValues>(
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

function createFontPickerField<T extends FieldValues>(
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

function createStringArrayField<T extends FieldValues>(
  name: Path<T>,
  label: string,
  props?: {
    placeholder?: string;
    maxItems?: number;
    minItems?: number;
    allowDuplicates?: boolean;
    validateItem?: (item: string) => string | true;
    transformItem?: (item: string) => string;
    addButtonText?: string;
    showAddButton?: boolean;
    description?: string;
    isDisabled?: boolean;
    className?: string;
  },
): ZodFormFieldConfig<T> {
  return {
    className: props?.className,
    description: props?.description,
    isDisabled: props?.isDisabled,
    label,
    name,
    stringArrayProps: {
      addButtonText: props?.addButtonText,
      allowDuplicates: props?.allowDuplicates,
      maxItems: props?.maxItems,
      minItems: props?.minItems,
      placeholder: props?.placeholder,
      showAddButton: props?.showAddButton,
      transformItem: props?.transformItem,
      validateItem: props?.validateItem,
    },
    type: "stringArray",
  };
}

function createContentField<T extends FieldValues>(config: {
  name?: Path<T>;
  title?: string | null;
  description?: string | null;
  render?: (field: {
    form: UseFormReturn<T>;
    errors: FieldErrors<T>;
    isSubmitting: boolean;
  }) => React.ReactNode;
  className?: string;
}): ZodFormFieldConfig<T> {
  return {
    className: config.className,
    description: config.description || undefined,
    name: config.name,
    render: config.render,
    title: config.title || undefined,
    type: "content",
  };
}

/**
 * Type-safe helper to create fields using discriminated union types
 * This eliminates all type assertions and provides proper type safety
 */
function createFieldFromParams<T extends FieldValues>(
  params: FieldCreationParams<T>,
): ZodFormFieldConfig<T> {
  switch (params.type) {
    case "input":
      return createInputField(params.name, params.label, params.props);
    case "textarea":
      return createTextareaField(params.name, params.label, params.props);
    case "select":
      return createSelectField(params.name, params.label, params.options);
    case "checkbox":
      return createCheckboxField(params.name, params.label, params.props);
    case "switch":
      return createSwitchField(params.name, params.label, params.props);
    case "radio":
      return createRadioField(
        params.name,
        params.label,
        params.options,
        params.props,
      );
    case "slider":
      return createSliderField(params.name, params.label, params.props);
    case "date":
      return createDateField(params.name, params.label, params.props);
    case "file":
      return createFileField(params.name, params.label, params.props);
    case "fontPicker":
      return createFontPickerField(params.name, params.label, params.props);
    case "stringArray":
      return createStringArrayField(params.name, params.label, params.props);
    case "autocomplete":
      return {
        autocompleteProps: params.props,
        label: params.label,
        name: params.name,
        options: params.options,
        type: "autocomplete",
      };
    case "content":
      return createContentField({
        className: params.className,
        description: params.description,
        name: params.name,
        render: params.render,
        title: params.title,
      });
    default: {
      // TypeScript will ensure all cases are handled
      const _exhaustive: never = params;

      throw new Error(`Unknown field type: ${(_exhaustive as any).type}`);
    }
  }
}

/**
 * Unified field creation function using discriminated union types
 * This provides full type safety without complex overloads
 */
export function createField<T extends FieldValues>(
  params: FieldCreationParams<T>,
): ZodFormFieldConfig<T> {
  return createFieldFromParams(params);
}

/**
 * Builder pattern for advanced field creation
 */
export class AdvancedFieldBuilder<T extends FieldValues> {
  private fields: ZodFormFieldConfig<T>[] = [];

  /**
   * Add any field type using the unified API
   */
  field(params: FieldCreationParams<T>): this {
    this.fields.push(createField(params));

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
    const config: ConditionalFieldConfig<T> = {
      condition,
      field,
      name,
      type: "conditional",
    };

    this.fields.push(config);

    return this;
  }

  /**
   * Add a field array for dynamic repeating field groups
   */
  fieldArray(
    name: ArrayPath<T>,
    label: string,
    fields: ZodFormFieldConfig<T>[],
    options?: {
      min?: number;
      max?: number;
      addButtonText?: string;
      removeButtonText?: string;
    },
  ): this {
    const config: FieldArrayConfig<T> = {
      addButtonText: options?.addButtonText,
      fields,
      label,
      max: options?.max,
      min: options?.min,
      name,
      removeButtonText: options?.removeButtonText,
      type: "fieldArray",
    };

    this.fields.push(config);

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
    const config: DynamicSectionConfig<T> = {
      condition,
      description: options?.description,
      fields,
      name,
      title: options?.title,
      type: "dynamicSection",
    };

    this.fields.push(config);

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
  field(params: FieldCreationParams<TItem>): this {
    this.fields.push(createField(params));

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
  private fields: ZodFormFieldConfig<T>[] = [];

  constructor(private arrayName: TArrayName) {}

  field(params: FieldCreationParams<Record<string, any>>): this {
    const fullPath = `${this.arrayName}.${params.name}` as Path<T>;
    // For field arrays, we need to be more permissive with types since the array item
    // structure is not fully known at this level
    const fieldConfig = createField({
      ...params,
      name: fullPath,
    } as FieldCreationParams<T>);

    this.fields.push(fieldConfig);

    return this;
  }

  build(): ZodFormFieldConfig<T>[] {
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
