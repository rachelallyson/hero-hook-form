"use client";

import React from "react";

import { Button } from "@heroui/react";
import type { FieldValues, SubmitHandler } from "react-hook-form";

import { useFormHelper } from "../hooks/useFormHelper";
import type { FormFieldConfig, FormValidationError } from "../types";

import { FormField } from "./FormField";

/**
 * Props for the Form component.
 *
 * @template T - The form data type
 */
interface FormProps<T extends FieldValues> {
  className?: string;
  columns?: 1 | 2 | 3;
  fields: FormFieldConfig<T>[];
  layout?: "vertical" | "horizontal" | "grid";
  onError?: (error: FormValidationError) => void;
  onSubmit: SubmitHandler<T>;
  onSuccess?: (data: T) => void;
  resetButtonText?: string;
  showResetButton?: boolean;
  spacing?: "2" | "4" | "6" | "8" | "lg";
  submitButtonProps?: Partial<React.ComponentProps<typeof Button>>;
  submitButtonText?: string;
  subtitle?: string;
  title?: string;
  defaultValues?: Partial<T>;
}

/**
 * Base form component for building forms without Zod validation.
 *
 * @description
 * This component provides a flexible form solution using React Hook Form
 * without requiring Zod schemas. It's useful when you need more control over
 * validation or want to use React Hook Form's built-in validation rules.
 *
 * @template T - The form data type
 *
 * @param {FormProps<T>} props - Component props
 * @param {FormFieldConfig<T>[]} props.fields - Array of field configurations
 * @param {SubmitHandler<T>} props.onSubmit - Submit handler function
 * @param {Partial<T>} [props.defaultValues] - Default form values
 * @param {string} [props.title] - Optional form title
 * @param {string} [props.subtitle] - Optional form subtitle
 * @param {"vertical"|"horizontal"|"grid"} [props.layout="vertical"] - Form layout
 * @param {1|2|3} [props.columns=1] - Number of columns for grid layout
 * @param {"2"|"4"|"6"|"8"|"lg"} [props.spacing="4"] - Spacing between fields
 * @param {string} [props.submitButtonText="Submit"] - Submit button text
 * @param {boolean} [props.showResetButton=false] - Whether to show reset button
 * @param {(error: FormValidationError) => void} [props.onError] - Error callback
 * @param {(data: T) => void} [props.onSuccess] - Success callback
 *
 * @returns {JSX.Element} The rendered form component
 *
 * @example
 * ```tsx
 * import { ConfigurableForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 *
 * function MyForm() {
 *   return (
 *     <ConfigurableForm
 *       fields={[
 *         FormFieldHelpers.input("name", "Name"),
 *         FormFieldHelpers.input("email", "Email", "email"),
 *       ]}
 *       defaultValues={{ name: "", email: "" }}
 *       onSubmit={async (data) => {
 *         console.log("Submitted:", data);
 *       }}
 *       title="Contact Form"
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link ZodForm} for Zod-integrated form with automatic validation
 * @see {@link FormFieldHelpers} for field creation helpers
 * @category Components
 */
export function ConfigurableForm<T extends FieldValues>({
  className,
  columns = 1,
  defaultValues,
  fields,
  layout = "vertical",
  onError,
  onSubmit,
  onSuccess,
  resetButtonText = "Reset",
  showResetButton = false,
  spacing = "4",
  submitButtonProps = {},
  submitButtonText = "Submit",
  subtitle,
  title,
}: FormProps<T>) {
  const {
    error,
    form,
    handleSubmit,
    isSubmitted,
    isSubmitting,
    isSuccess,
    resetForm,
    submissionState,
  } = useFormHelper({
    defaultValues,
    onError,
    onSubmit,
    onSuccess,
  });

  const renderFields = () => {
    if (layout === "grid") {
      return (
        <div
          className={`grid gap-${spacing} ${
            columns === 1
              ? "grid-cols-1"
              : columns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {fields.map((field) => (
            <FormField
              key={field.name as string}
              config={field}
              form={form}
              submissionState={submissionState}
            />
          ))}
        </div>
      );
    }

    if (layout === "horizontal") {
      return (
        <div className={`grid gap-${spacing} grid-cols-1 md:grid-cols-2`}>
          {fields.map((field) => (
            <FormField
              key={field.name as string}
              config={field}
              form={form}
              submissionState={submissionState}
            />
          ))}
        </div>
      );
    }

    // Vertical layout (default)
    return (
      <div className={`space-y-${spacing}`}>
        {fields.map((field) => (
          <FormField
            key={field.name as string}
            config={field}
            form={form}
            submissionState={submissionState}
          />
        ))}
      </div>
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit();
  };

  return (
    <form className={className} role="form" onSubmit={handleFormSubmit}>
      {/* Title and Subtitle */}
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {/* Success Message */}
      {isSubmitted && isSuccess && (
        <div
          className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg"
          data-testid="success-message"
        >
          <p className="text-success-800 font-medium">Success!</p>
          <p className="text-success-700 text-sm mt-1">
            Your request has been processed successfully.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
          data-testid="error-message"
        >
          <p className="text-danger-800 font-medium">Error</p>
          <p className="text-danger-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Form Fields */}
      {renderFields()}

      {/* Submit Button */}
      <div className="mt-6 flex gap-3 justify-end">
        <Button
          color="primary"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
          {...submitButtonProps}
        >
          {submitButtonText}
        </Button>

        {showResetButton && (
          <Button
            isDisabled={isSubmitting}
            type="button"
            variant="bordered"
            onPress={resetForm}
          >
            {resetButtonText}
          </Button>
        )}
      </div>
    </form>
  );
}
