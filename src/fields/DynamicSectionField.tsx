"use client";

import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";

import type { DynamicSectionConfig } from "../types";
import { FormField } from "../components/FormField";

/**
 * Props for the DynamicSectionField component.
 *
 * @template TFieldValues - The form data type
 */
export interface DynamicSectionFieldProps<TFieldValues extends FieldValues> {
  config: DynamicSectionConfig<TFieldValues>;
  control: Control<TFieldValues>;
  className?: string;
}

/**
 * Dynamic section component that shows/hides groups of fields based on form values.
 *
 * @description
 * Similar to ConditionalField but for groups of fields. Renders a section
 * with title, description, and multiple fields when a condition is met.
 * Useful for creating multi-step-like experiences or conditional form sections.
 *
 * @template TFieldValues - The form data type
 *
 * @param {DynamicSectionFieldProps<TFieldValues>} props - Component props
 * @param {DynamicSectionConfig<TFieldValues>} props.config - Dynamic section configuration
 * @param {Control<TFieldValues>} props.control - React Hook Form control
 * @param {string} [props.className] - Additional CSS class name
 *
 * @returns {JSX.Element|null} The rendered section or null if condition is not met
 *
 * @example
 * ```tsx
 * import { DynamicSectionField, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 *
 * const fields = [
 *   FormFieldHelpers.checkbox("hasEmergencyContact", "Has Emergency Contact"),
 *   DynamicSectionField({
 *     config: {
 *       name: "emergencyContact",
 *       title: "Emergency Contact Information",
 *       description: "Please provide emergency contact details",
 *       condition: (values) => values.hasEmergencyContact === true,
 *       fields: [
 *         FormFieldHelpers.input("name", "Contact Name"),
 *         FormFieldHelpers.input("relationship", "Relationship"),
 *         FormFieldHelpers.input("phone", "Phone Number", "tel"),
 *         FormFieldHelpers.input("email", "Email", "email"),
 *       ],
 *     },
 *     control: form.control,
 *   }),
 * ];
 * ```
 *
 * @example
 * Nested dynamic sections:
 * ```tsx
 * DynamicSectionField({
 *   config: {
 *     name: "businessInfo",
 *     title: "Business Information",
 *     condition: (values) => values.accountType === "business",
 *     fields: [
 *       FormFieldHelpers.input("businessName", "Business Name"),
 *       DynamicSectionField({
 *         config: {
 *           name: "billingAddress",
 *           title: "Billing Address",
 *           condition: (values) => values.businessName && values.taxId,
 *           fields: [
 *             FormFieldHelpers.input("street", "Street Address"),
 *             FormFieldHelpers.input("city", "City"),
 *           ],
 *         },
 *         control: form.control,
 *       }),
 *     ],
 *   },
 *   control: form.control,
 * }),
 * ```
 *
 * @see {@link ConditionalField} for single conditional fields
 * @see {@link FieldArrayField} for repeating fields
 * @category Fields
 */
export function DynamicSectionField<TFieldValues extends FieldValues>({
  className,
  config,
  control,
}: DynamicSectionFieldProps<TFieldValues>) {
  const { condition, description, fields, title } = config;
  const form = useFormContext<TFieldValues>();

  // Watch all form values to determine if condition is met
  const formValues = useWatch({ control });

  // Check if condition is met
  const shouldShow = condition(formValues);

  // Don't render anything if condition is not met
  if (!shouldShow) {
    return null;
  }

  // Render the section with all fields when condition is met
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {fields.map((fieldConfig, index) => (
          <FormField<TFieldValues>
            key={`${fieldConfig.name}-${index}`}
            config={fieldConfig}
            form={form}
            submissionState={{
              error: undefined,
              isSubmitted: false,
              isSubmitting: false,
              isSuccess: false,
            }}
          />
        ))}
      </div>
    </div>
  );
}
