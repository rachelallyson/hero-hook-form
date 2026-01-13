"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Checkbox } from "#ui";

/**
 * Props for the CheckboxField component.
 *
 * @template TFieldValues - The form data type
 *
 * @example
 * ```tsx
 * import { CheckboxField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { newsletter: false },
 * });
 *
 * <CheckboxField
 *   control={form.control}
 *   name="newsletter"
 *   label="Subscribe to newsletter"
 *   description="Receive weekly updates"
 * />
 * ```
 */
export type CheckboxFieldProps<TFieldValues extends FieldValues> =
  FieldBaseProps<TFieldValues, boolean> &
    WithControl<TFieldValues> & {
      /** Additional props to pass to the underlying Checkbox component */
      checkboxProps?: Omit<
        React.ComponentProps<typeof Checkbox>,
        | "isSelected"
        | "onValueChange"
        | "isInvalid"
        | "errorMessage"
        | "isDisabled"
      >;
    };

/**
 * A checkbox field component that integrates React Hook Form with HeroUI Checkbox.
 *
 * This component provides a type-safe checkbox field with validation support,
 * error handling, and accessibility features. The field value is a boolean.
 *
 * @template TFieldValues - The form data type
 *
 * @param props - The checkbox field props
 * @returns The rendered checkbox field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   terms: z.boolean().refine((val) => val === true, {
 *     message: "You must accept the terms",
 *   }),
 *   newsletter: z.boolean().optional(),
 * });
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.checkbox("terms", "I accept the terms and conditions"),
 *           FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
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
 * // With custom styling
 * <CheckboxField
 *   control={form.control}
 *   name="newsletter"
 *   label="Subscribe"
 *   checkboxProps={{
 *     color: "primary",
 *     size: "lg",
 *   }}
 * />
 * ```
 */
export function CheckboxField<TFieldValues extends FieldValues>(
  props: CheckboxFieldProps<TFieldValues>,
) {
  const {
    checkboxProps,
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    rules,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Checkbox
            {...defaults.checkbox}
            {...checkboxProps}
            isDisabled={isDisabled}
            isInvalid={Boolean(fieldState.error)}
            isSelected={Boolean(field.value)}
            onBlur={field.onBlur}
            onValueChange={(val: boolean) => field.onChange(val)}
          >
            {label}
          </Checkbox>
          {description ? (
            <p className="text-small text-default-400">{description}</p>
          ) : null}
          {fieldState.error?.message ? (
            <p className="text-tiny text-danger mt-1">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
      rules={rules}
    />
  );
}
