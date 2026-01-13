import React from "react";
import type { FieldValues, Path } from "react-hook-form";
import type { ContentFieldConfig, ZodFormFieldConfig } from "../types";

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
  switch(name: Path<T>, label: string): this {
    this.fields.push({
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
 * ];
 * ```
 *
 * @see {@link createBasicFormBuilder} for builder pattern alternative
 * @category Builders
 */
export const FormFieldHelpers = {
  /**
   * Create a checkbox field
   */
  checkbox: <T extends FieldValues>(
    name: Path<T>,
    label: string,
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    type: "checkbox",
  }),

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
  content: <T extends FieldValues>(
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
  ): ContentFieldConfig<T> => ({
    className: options?.className,
    description: description || undefined,
    name: options?.name,
    render: options?.render,
    title: title || undefined,
    type: "content",
  }),

  /**
   * Create a date field
   */
  date: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    dateProps?: Record<string, string | number | boolean>,
  ): ZodFormFieldConfig<T> => ({
    dateProps,
    label,
    name,
    type: "date",
  }),

  /**
   * Create an input field
   */
  input: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    type: "text" | "email" | "tel" | "password" = "text",
  ): ZodFormFieldConfig<T> => ({
    inputProps: { type },
    label,
    name,
    type: "input",
  }),

  /**
   * Create a select field
   */
  select: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    options: { label: string; value: string | number }[],
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    options,
    type: "select",
  }),

  /**
   * Create a switch field
   */
  switch: <T extends FieldValues>(
    name: Path<T>,
    label: string,
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    type: "switch",
  }),

  /**
   * Create a textarea field
   */
  textarea: <T extends FieldValues>(
    name: Path<T>,
    label: string,
    placeholder?: string,
  ): ZodFormFieldConfig<T> => ({
    label,
    name,
    textareaProps: { placeholder },
    type: "textarea",
  }),
};

/**
 * Common field collections
 */
export const CommonFields = {
  /**
   * Address fields
   */
  address: <T extends FieldValues>() => [
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
    FormFieldHelpers.input<T>("firstName" as Path<T>, "First Name"),
    FormFieldHelpers.input<T>("lastName" as Path<T>, "Last Name"),
    FormFieldHelpers.input<T>("email" as Path<T>, "Email", "email"),
    FormFieldHelpers.input<T>("phone" as Path<T>, "Phone", "tel"),
  ],

  /**
   * Terms and conditions fields
   */
  terms: <T extends FieldValues>() => [
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
