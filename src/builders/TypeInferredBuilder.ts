"use client";

import type { FieldValues, Path } from "react-hook-form";
import { z } from "zod";
import type { ZodFormFieldConfig } from "../types";

/**
 * Type-inferred form builder that auto-generates both schema and field configs
 */
export class TypeInferredBuilder<T extends FieldValues> {
  private schemaFields: Record<string, z.ZodTypeAny> = {};
  private formFields: ZodFormFieldConfig<T>[] = [];

  /**
   * Add a text field
   */
  text(
    name: Path<T>,
    label: string,
    options?: {
      placeholder?: string;
      description?: string;
      isDisabled?: boolean;
      className?: string;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
    },
  ): this {
    const { maxLength, minLength, pattern, ...fieldOptions } = options || {};

    // Build Zod schema
    let zodType: z.ZodString = z.string();

    if (minLength)
      zodType = zodType.min(
        minLength,
        `${label} must be at least ${minLength} characters`,
      );
    if (maxLength)
      zodType = zodType.max(
        maxLength,
        `${label} must be no more than ${maxLength} characters`,
      );
    if (pattern)
      zodType = zodType.regex(
        new RegExp(pattern),
        `${label} format is invalid`,
      );

    this.schemaFields[name as string] = zodType;

    // Build form field
    this.formFields.push({
      inputProps: { type: "text", ...fieldOptions },
      label,
      name,
      type: "input",
    });

    return this;
  }

  /**
   * Add an email field
   */
  email(
    name: Path<T>,
    label: string,
    options?: {
      placeholder?: string;
      description?: string;
      isDisabled?: boolean;
      className?: string;
    },
  ): this {
    // Build Zod schema
    this.schemaFields[name as string] = z
      .string()
      .email(`Please enter a valid email address`);

    // Build form field
    this.formFields.push({
      inputProps: { type: "email", ...options },
      label,
      name,
      type: "input",
    });

    return this;
  }

  /**
   * Add a number field
   */
  number(
    name: Path<T>,
    label: string,
    options?: {
      placeholder?: string;
      description?: string;
      isDisabled?: boolean;
      className?: string;
      min?: number;
      max?: number;
      step?: number;
    },
  ): this {
    const { max, min, step, ...fieldOptions } = options || {};

    // Build Zod schema
    let zodType: z.ZodNumber = z.number();

    if (min !== undefined)
      zodType = zodType.min(min, `${label} must be at least ${min}`);
    if (max !== undefined)
      zodType = zodType.max(max, `${label} must be no more than ${max}`);

    this.schemaFields[name as string] = zodType;

    // Build form field
    this.formFields.push({
      inputProps: { max, min, step, type: "number", ...fieldOptions },
      label,
      name,
      type: "input",
    });

    return this;
  }

  /**
   * Add a textarea field
   */
  textarea(
    name: Path<T>,
    label: string,
    options?: {
      placeholder?: string;
      description?: string;
      isDisabled?: boolean;
      className?: string;
      rows?: number;
      minLength?: number;
    },
  ): this {
    const { minLength, ...fieldOptions } = options || {};

    // Build Zod schema
    let zodType: z.ZodString = z.string();

    if (minLength)
      zodType = zodType.min(
        minLength,
        `${label} must be at least ${minLength} characters`,
      );

    this.schemaFields[name as string] = zodType;

    // Build form field
    this.formFields.push({
      label,
      name,
      textareaProps: fieldOptions,
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
    // Build Zod schema
    this.schemaFields[name as string] = z
      .string()
      .min(1, `Please select a ${label.toLowerCase()}`);

    // Build form field
    this.formFields.push({
      label,
      name,
      options,
      type: "select",
    });

    return this;
  }

  /**
   * Add a checkbox field
   */
  checkbox(
    name: Path<T>,
    label: string,
    options?: {
      description?: string;
      isDisabled?: boolean;
      className?: string;
      required?: boolean;
    },
  ): this {
    const { required = false, ...fieldOptions } = options || {};

    // Build Zod schema
    let zodType: z.ZodBoolean = z.boolean();

    if (required) {
      zodType = zodType.refine(
        (val) => val === true,
        `You must agree to ${label.toLowerCase()}`,
      );
    }
    this.schemaFields[name as string] = zodType;

    // Build form field
    this.formFields.push({
      checkboxProps: fieldOptions,
      label,
      name,
      type: "checkbox",
    });

    return this;
  }

  /**
   * Add a switch field
   */
  switch(
    name: Path<T>,
    label: string,
    options?: {
      description?: string;
      isDisabled?: boolean;
      className?: string;
    },
  ): this {
    // Build Zod schema
    this.schemaFields[name as string] = z.boolean().optional();

    // Build form field
    this.formFields.push({
      label,
      name,
      switchProps: options,
      type: "switch",
    });

    return this;
  }

  /**
   * Add a radio field
   */
  radio(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
    fieldOptions?: {
      description?: string;
      isDisabled?: boolean;
      className?: string;
      orientation?: "horizontal" | "vertical";
    },
  ): this {
    // Build Zod schema
    this.schemaFields[name as string] = z
      .string()
      .min(1, `Please select a ${label.toLowerCase()}`);

    // Build form field
    this.formFields.push({
      label,
      name,
      radioOptions: options,
      radioProps: fieldOptions,
      type: "radio",
    });

    return this;
  }

  /**
   * Add a slider field
   */
  slider(
    name: Path<T>,
    label: string,
    options?: {
      min?: number;
      max?: number;
      step?: number;
      description?: string;
      isDisabled?: boolean;
      className?: string;
    },
  ): this {
    const { max = 100, min = 0, step = 1, ...fieldOptions } = options || {};

    // Build Zod schema
    let zodType: z.ZodNumber = z.number();

    if (min !== undefined)
      zodType = zodType.min(min, `${label} must be at least ${min}`);
    if (max !== undefined)
      zodType = zodType.max(max, `${label} must be no more than ${max}`);

    this.schemaFields[name as string] = zodType;

    // Build form field
    this.formFields.push({
      label,
      name,
      sliderProps: {
        maxValue: max,
        minValue: min,
        step,
        ...fieldOptions,
      } as any,
      type: "slider",
    });

    return this;
  }

  /**
   * Add a date field
   */
  date(
    name: Path<T>,
    label: string,
    options?: {
      placeholder?: string;
      description?: string;
      isDisabled?: boolean;
      className?: string;
    },
  ): this {
    // Build Zod schema
    this.schemaFields[name as string] = z
      .string()
      .min(1, `${label} is required`);

    // Build form field
    this.formFields.push({
      dateProps: options,
      label,
      name,
      type: "date",
    });

    return this;
  }

  /**
   * Add a file field
   */
  file(
    name: Path<T>,
    label: string,
    options?: {
      accept?: string;
      multiple?: boolean;
      description?: string;
      isDisabled?: boolean;
      className?: string;
    },
  ): this {
    // Build Zod schema
    this.schemaFields[name as string] = z.any().optional();

    // Build form field
    this.formFields.push({
      fileProps: options,
      label,
      name,
      type: "file",
    });

    return this;
  }

  /**
   * Build the final schema and fields
   */
  build(): {
    schema: z.ZodSchema<T>;
    fields: ZodFormFieldConfig<T>[];
  } {
    return {
      fields: this.formFields,
      schema: z.object(this.schemaFields) as z.ZodSchema<T>,
    };
  }
}

/**
 * Create a new type-inferred form builder
 */
export function createTypeInferredBuilder<
  T extends FieldValues,
>(): TypeInferredBuilder<T> {
  return new TypeInferredBuilder<T>();
}

/**
 * Define a form with type inference
 */
export function defineInferredForm<T extends FieldValues>(
  fieldDefinitions: (builder: TypeInferredBuilder<T>) => TypeInferredBuilder<T>,
): {
  schema: z.ZodSchema<T>;
  fields: ZodFormFieldConfig<T>[];
} {
  const builder = createTypeInferredBuilder<T>();

  fieldDefinitions(builder);

  return builder.build();
}

/**
 * Field type builders for individual field creation
 */
export const field = {
  checkbox: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["checkbox"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.checkbox(name, label, options);
  },

  date: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["date"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.date(name, label, options);
  },

  email: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["email"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.email(name, label, options);
  },

  file: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["file"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.file(name, label, options);
  },

  number: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["number"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.number(name, label, options);
  },

  radio: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
    fieldOptions?: Parameters<TypeInferredBuilder<T>["radio"]>[3],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.radio(name, label, options, fieldOptions);
  },

  select: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.select(name, label, options);
  },

  slider: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["slider"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.slider(name, label, options);
  },

  switch: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["switch"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.switch(name, label, options);
  },

  text: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["text"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.text(name, label, options);
  },

  textarea: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options?: Parameters<TypeInferredBuilder<T>["textarea"]>[2],
  ) => {
    const builder = new TypeInferredBuilder<T>();

    return builder.textarea(name, label, options);
  },
};
