"use client";

import React from "react";

import { Button } from "@heroui/react";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";

import type { FormValidationError, ZodFormConfig } from "../types";
import { useZodForm } from "../zod-integration";
import { useEnhancedFormState } from "../hooks/useEnhancedFormState";
import { FormStatus } from "./FormStatus";

import { FormField } from "./FormField";

/**
 * Props for the ZodForm component.
 *
 * @template T - The form data type inferred from the Zod schema
 */
interface ZodFormProps<T extends FieldValues> {
  className?: string;
  columns?: 1 | 2 | 3;
  config: ZodFormConfig<T>;
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
}

/**
 * ZodForm component for building type-safe forms with Zod validation.
 *
 * @description
 * This component provides a complete form solution with automatic validation,
 * error handling, and type safety. It integrates React Hook Form with Zod
 * schemas and HeroUI components. The form automatically validates inputs based
 * on the provided Zod schema and displays error messages inline.
 *
 * @template T - The form data type inferred from the Zod schema
 *
 * @param {ZodFormProps<T>} props - Component props
 * @param {ZodFormConfig<T>} props.config - Form configuration with schema and fields
 * @param {SubmitHandler<T>} props.onSubmit - Submit handler function called with validated data
 * @param {string} [props.title] - Optional form title displayed above the form
 * @param {string} [props.subtitle] - Optional form subtitle displayed below the title
 * @param {"vertical"|"horizontal"|"grid"} [props.layout="vertical"] - Form layout style
 * @param {1|2|3} [props.columns=1] - Number of columns for grid layout (only applies when layout="grid")
 * @param {"2"|"4"|"6"|"8"|"lg"} [props.spacing="4"] - Spacing between form fields
 * @param {string} [props.submitButtonText="Submit"] - Text for the submit button
 * @param {boolean} [props.showResetButton=false] - Whether to show a reset button
 * @param {string} [props.resetButtonText="Reset"] - Text for the reset button
 * @param {(error: FormValidationError) => void} [props.onError] - Error callback for validation errors
 * @param {(data: T) => void} [props.onSuccess] - Success callback called after successful submission
 *
 * @returns {JSX.Element} The rendered form component with validation and error handling
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   email: z.string().email("Please enter a valid email"),
 *   name: z.string().min(2, "Name must be at least 2 characters"),
 *   message: z.string().min(10, "Message must be at least 10 characters"),
 * });
 *
 * function ContactForm() {
 *   const handleSubmit = async (data) => {
 *     console.log("Form submitted:", data);
 *     // Handle form submission (e.g., API call)
 *   };
 *
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.input("name", "Name"),
 *           FormFieldHelpers.input("email", "Email", "email"),
 *           FormFieldHelpers.textarea("message", "Message"),
 *         ],
 *       }}
 *       onSubmit={handleSubmit}
 *       title="Contact Us"
 *       subtitle="Send us a message and we'll get back to you"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * Grid layout with multiple columns:
 * ```tsx
 * <ZodForm
 *   config={{ schema, fields }}
 *   layout="grid"
 *   columns={2}
 *   spacing="6"
 * />
 * ```
 *
 * @see {@link Form} for the base form component without Zod
 * @see {@link FormFieldHelpers} for field creation helpers
 * @see {@link createBasicFormBuilder} for builder pattern alternative
 * @category Components
 */
export function ZodForm<T extends FieldValues>({
  className,
  columns = 1,
  config,
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
}: ZodFormProps<T>) {
  const form = useZodForm(config);
  const enhancedState = useEnhancedFormState(form, {
    autoReset: true,
    onError: (error: string) => onError?.({ field: "form", message: error }),
    onSuccess: onSuccess,
    resetDelay: 3000,
  });

  const handleSubmit = async () => {
    try {
      // Use React Hook Form's built-in validation
      await form.handleSubmit(
        async (formData) => {
          // Success handler - form is valid
          await onSubmit(formData);
          enhancedState.handleSuccess(formData);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_errors) => {
          // Error handler - form has validation errors
          enhancedState.handleError("Please fix the validation errors above");
        },
      )();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      enhancedState.handleError(errorMessage);
    }
  };

  const resetForm = () => {
    form.reset();
    enhancedState.reset();
  };

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
          {config.fields.map((field) => (
            <FormField
              key={field.name as string}
              config={field}
              form={form}
              submissionState={{
                error: enhancedState.error,
                isSubmitted: enhancedState.status !== "idle",
                isSubmitting: enhancedState.isSubmitting,
                isSuccess: enhancedState.isSuccess,
              }}
            />
          ))}
        </div>
      );
    }

    if (layout === "horizontal") {
      return (
        <div className={`grid gap-${spacing} grid-cols-1 md:grid-cols-2`}>
          {config.fields.map((field) => (
            <FormField
              key={field.name as string}
              config={field}
              form={form}
              submissionState={{
                error: enhancedState.error,
                isSubmitted: enhancedState.status !== "idle",
                isSubmitting: enhancedState.isSubmitting,
                isSuccess: enhancedState.isSuccess,
              }}
            />
          ))}
        </div>
      );
    }

    // Vertical layout (default)
    return (
      <div className={`space-y-${spacing}`}>
        {config.fields.map((field) => (
          <FormField
            key={field.name as string}
            config={field}
            form={form}
            submissionState={{
              error: enhancedState.error,
              isSubmitted: enhancedState.status !== "idle",
              isSubmitting: enhancedState.isSubmitting,
              isSuccess: enhancedState.isSuccess,
            }}
          />
        ))}
      </div>
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit();
  };

  // Enhanced error handling
  React.useEffect(() => {
    if (config.onError && Object.keys(form.formState.errors).length > 0) {
      config.onError(form.formState.errors);
    }
  }, [form.formState.errors, config.onError]);

  return (
    <FormProvider {...form}>
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

        {/* Enhanced Form Status */}
        <FormStatus
          state={enhancedState}
          onDismiss={() => enhancedState.reset()}
          showDetails={true}
        />

        {/* Form Fields */}
        {renderFields()}

        {/* Submit Button */}
        <div className="mt-6 flex gap-3 justify-end">
          <Button
            color="primary"
            isDisabled={enhancedState.isSubmitting}
            isLoading={enhancedState.isSubmitting}
            type="submit"
            {...submitButtonProps}
          >
            {enhancedState.isSuccess ? "Success!" : submitButtonText}
          </Button>

          {showResetButton && (
            <Button
              isDisabled={enhancedState.isSubmitting}
              type="button"
              variant="bordered"
              onPress={resetForm}
            >
              {resetButtonText}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
