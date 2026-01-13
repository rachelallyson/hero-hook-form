import type { FieldValues, Path } from "react-hook-form";
import type { ZodFormFieldConfig } from "../types";

/**
 * Basic form field builder that eliminates "as const" assertions
 * Focuses on the most common use cases
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
 * Create a new simple form field builder
 */
export function createBasicFormBuilder<
  T extends FieldValues,
>(): BasicFormBuilder<T> {
  return new BasicFormBuilder<T>();
}

/**
 * Simple helper functions for common field types
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
