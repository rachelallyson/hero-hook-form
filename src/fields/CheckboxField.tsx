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

  // Default to "on" (HTML standard), but allow users to customize via checkboxProps
  const checkboxValue = checkboxProps?.value ?? "on";

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // Use a ref and useLayoutEffect to ensure the value attribute is set on the underlying input
        // HeroUI Checkbox may not always forward the value prop correctly
        const containerRef = React.useRef<HTMLDivElement>(null);

        React.useLayoutEffect(() => {
          const setValue = () => {
            if (containerRef.current) {
              const input = containerRef.current.querySelector(
                `input[type="checkbox"][name="${name}"]`,
              );

              // Type guard: check if element is HTMLInputElement
              if (input instanceof HTMLInputElement) {
                input.setAttribute("value", checkboxValue);
                // Also set the value property directly as a fallback
                input.value = checkboxValue;
              }
            }
          };

          // Set immediately
          setValue();

          // Also set after a short delay to catch async rendering
          const timeoutId = setTimeout(setValue, 0);

          return () => clearTimeout(timeoutId);
        }, [name, checkboxValue, field.value]);

        return (
          <div ref={containerRef} className={className}>
            <Checkbox
              {...defaults.checkbox}
              {...checkboxProps}
              isDisabled={isDisabled}
              isInvalid={Boolean(fieldState.error)}
              isSelected={Boolean(field.value)}
              name={name}
              value={checkboxValue}
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
        );
      }}
      rules={rules}
    />
  );
}
