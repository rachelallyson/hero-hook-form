"use client";

import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";

import type { ConditionalFieldConfig } from "../types";
import { FormField } from "../components/FormField";

/**
 * Props for the ConditionalField component.
 *
 * @template TFieldValues - The form data type
 */
export interface ConditionalFieldProps<TFieldValues extends FieldValues> {
  config: ConditionalFieldConfig<TFieldValues>;
  control: Control<TFieldValues>;
  className?: string;
}

/**
 * Conditional field component that shows/hides fields based on form values.
 *
 * @description
 * Renders a field only when a condition function returns true based on
 * current form values. Useful for creating dynamic forms that adapt to
 * user input. The field is completely removed from the DOM when hidden.
 *
 * @template TFieldValues - The form data type
 *
 * @param {ConditionalFieldProps<TFieldValues>} props - Component props
 * @param {ConditionalFieldConfig<TFieldValues>} props.config - Conditional field configuration
 * @param {Control<TFieldValues>} props.control - React Hook Form control
 * @param {string} [props.className] - Additional CSS class name
 *
 * @returns {JSX.Element|null} The rendered field or null if condition is not met
 *
 * @example
 * ```tsx
 * import { ConditionalField, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 *
 * const fields = [
 *   FormFieldHelpers.checkbox("hasPhone", "I have a phone number"),
 *   ConditionalField({
 *     config: {
 *       name: "phone",
 *       condition: (values) => values.hasPhone === true,
 *       field: FormFieldHelpers.input("phone", "Phone Number", "tel"),
 *     },
 *     control: form.control,
 *   }),
 * ];
 * ```
 *
 * @example
 * Multiple conditions:
 * ```tsx
 * ConditionalField({
 *   config: {
 *     name: "businessDetails",
 *     condition: (values) =>
 *       values.userType === "business" && values.isRegistered === true,
 *     field: FormFieldHelpers.input("taxId", "Tax ID"),
 *   },
 *   control: form.control,
 * }),
 * ```
 *
 * @see {@link DynamicSectionField} for grouping multiple conditional fields
 * @see {@link FieldArrayField} for repeating fields
 * @category Fields
 */
export function ConditionalField<TFieldValues extends FieldValues>({
  className,
  config,
  control,
}: ConditionalFieldProps<TFieldValues>) {
  const { condition, field } = config;
  const form = useFormContext<TFieldValues>();

  // Watch all form values to determine if condition is met
  const formValues = useWatch({ control });

  // Check if condition is met
  const shouldShow = condition(formValues);

  // Don't render anything if condition is not met
  if (!shouldShow) {
    return null;
  }

  // Render the child field when condition is met
  return (
    <div className={className}>
      <FormField<TFieldValues>
        config={field}
        form={form}
        submissionState={{
          error: undefined,
          isSubmitted: false,
          isSubmitting: false,
          isSuccess: false,
        }}
      />
    </div>
  );
}
