"use client";

import React from "react";
import type { DefaultValues, FieldValues } from "react-hook-form";
import type { ZodSchema } from "zod";

import { ZodForm } from "./ZodForm";
import type { FormValidationError, ZodFormFieldConfig } from "../types";

/**
 * Props for the SimpleForm component.
 *
 * @template TFieldValues - The form data type
 */
export interface SimpleFormProps<TFieldValues extends FieldValues> {
  /** Zod schema for validation */
  schema: ZodSchema<TFieldValues>;
  /** Single field configuration */
  field: ZodFormFieldConfig<TFieldValues>;
  /** Submit handler */
  onSubmit: (data: TFieldValues) => Promise<void> | void;
  /** Optional custom submit button */
  submitButton?: React.ReactNode;
  /** Optional form title */
  title?: string;
  /** Optional form subtitle */
  subtitle?: string;
  /** Optional className */
  className?: string;
  /** Optional default values */
  defaultValues?: DefaultValues<TFieldValues>;
  /** Optional error callback */
  onError?: (error: FormValidationError) => void;
  /** Optional success callback */
  onSuccess?: (data: TFieldValues) => void;
  /** Hide default submit button (use custom submitButton instead) */
  hideSubmitButton?: boolean;
}

/**
 * Simple form component for single-field forms.
 *
 * @description
 * A simplified API for forms with a single field. Provides the same validation
 * and error handling as ZodForm but with a simpler configuration.
 * Useful for simple inputs like search bars, message inputs, or single-field forms.
 *
 * @template TFieldValues - The form data type
 *
 * @param {SimpleFormProps<TFieldValues>} props - Component props
 * @returns {JSX.Element} The rendered form
 *
 * @example
 * ```tsx
 * import { SimpleForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const messageSchema = z.object({
 *   message: z.string().min(1, "Message cannot be empty"),
 * });
 *
 * function MessageInput() {
 *   return (
 *     <SimpleForm
 *       schema={messageSchema}
 *       field={FormFieldHelpers.input("message", "", {
 *         placeholder: "Add a note...",
 *         endContent: (
 *           <Button type="submit" isIconOnly>
 *             <SendIcon />
 *           </Button>
 *         ),
 *       })}
 *       onSubmit={async (data) => {
 *         await sendMessage(data.message);
 *       }}
 *       hideSubmitButton
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link ZodForm} for multi-field forms
 * @category Components
 */
export function SimpleForm<TFieldValues extends FieldValues>({
  className,
  defaultValues,
  field,
  hideSubmitButton = false,
  onError,
  onSubmit,
  onSuccess,
  schema,
  submitButton,
  subtitle,
  title,
}: SimpleFormProps<TFieldValues>) {
  return (
    <ZodForm
      className={className}
      config={{
        defaultValues,
        fields: [field],
        schema,
      }}
      onError={onError}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
      showResetButton={false}
      submitButtonText={hideSubmitButton ? "" : "Submit"}
      subtitle={subtitle}
      title={title}
      submitButtonProps={
        hideSubmitButton && submitButton
          ? {
              style: { display: "none" },
            }
          : {}
      }
    />
  );
}
