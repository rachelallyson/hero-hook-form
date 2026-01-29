"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type {
  FieldBaseProps,
  TextareaPassthroughProps,
  WithControl,
} from "../types";
import { createFieldHandlers } from "../utils/fieldHandlers";

import { Textarea } from "#ui";

/**
 * Props for the TextareaField component.
 *
 * @template TFieldValues - The form data type
 *
 * @example
 * ```tsx
 * import { TextareaField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { message: "" },
 * });
 *
 * <TextareaField
 *   control={form.control}
 *   name="message"
 *   label="Message"
 *   description="Enter your message here"
 *   placeholder="Type your message..."
 * />
 * ```
 */
export type TextareaFieldProps<TFieldValues extends FieldValues> =
  FieldBaseProps<TFieldValues, string> &
    WithControl<TFieldValues> & {
      /** Additional props to pass to the underlying Textarea component */
      textareaProps?: TextareaPassthroughProps;
    };

/**
 * A textarea field component that integrates React Hook Form with HeroUI Textarea.
 *
 * This component provides a type-safe textarea field with validation support,
 * error handling, and accessibility features. Use this for multi-line text input.
 *
 * @template TFieldValues - The form data type
 *
 * @param props - The textarea field props
 * @returns The rendered textarea field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   message: z.string().min(10, "Message must be at least 10 characters"),
 *   feedback: z.string().max(500, "Feedback must be less than 500 characters"),
 * });
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.textarea("message", "Message", "Enter your message"),
 *           FormFieldHelpers.textarea("feedback", "Feedback"),
 *         ],
 *       }}
 *       onSubmit={(data) => console.log(data)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling and min/max rows
 * <TextareaField
 *   control={form.control}
 *   name="message"
 *   label="Message"
 *   textareaProps={{
 *     minRows: 3,
 *     maxRows: 10,
 *     variant: "bordered",
 *   }}
 * />
 * ```
 */
export function TextareaField<TFieldValues extends FieldValues>(
  props: TextareaFieldProps<TFieldValues>,
) {
  const {
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    rules,
    textareaProps,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const restProps = createFieldHandlers(textareaProps, field, {
          isDisabled,
          label,
        });

        return (
          <div className={className}>
            <Textarea
              {...defaults.textarea}
              {...restProps}
              description={description}
              errorMessage={fieldState.error?.message}
              isInvalid={Boolean(fieldState.error)}
              name={field.name}
              value={field.value ?? ""}
            />
          </div>
        );
      }}
      rules={rules}
    />
  );
}
