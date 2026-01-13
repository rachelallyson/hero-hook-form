"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Switch } from "#ui";

/**
 * Props for the SwitchField component.
 *
 * @template TFieldValues - The form data type
 *
 * @example
 * ```tsx
 * import { SwitchField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { notifications: false },
 * });
 *
 * <SwitchField
 *   control={form.control}
 *   name="notifications"
 *   label="Enable notifications"
 *   description="Receive email notifications"
 * />
 * ```
 */
export type SwitchFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  boolean
> &
  WithControl<TFieldValues> & {
    /** Additional props to pass to the underlying Switch component */
    switchProps?: Omit<
      React.ComponentProps<typeof Switch>,
      "isSelected" | "onValueChange" | "isInvalid" | "isDisabled"
    >;
  };

/**
 * A switch/toggle field component that integrates React Hook Form with HeroUI Switch.
 *
 * This component provides a type-safe switch field with validation support,
 * error handling, and accessibility features. The field value is a boolean.
 *
 * @template TFieldValues - The form data type
 *
 * @param props - The switch field props
 * @returns The rendered switch field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   notifications: z.boolean(),
 *   darkMode: z.boolean().default(false),
 * });
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.switch("notifications", "Enable notifications", "Receive email notifications"),
 *           FormFieldHelpers.switch("darkMode", "Dark mode"),
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
 * <SwitchField
 *   control={form.control}
 *   name="notifications"
 *   label="Enable notifications"
 *   switchProps={{
 *     color: "success",
 *     size: "lg",
 *   }}
 * />
 * ```
 */
export function SwitchField<TFieldValues extends FieldValues>(
  props: SwitchFieldProps<TFieldValues>,
) {
  const {
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    rules,
    switchProps,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Switch
            {...defaults.switch}
            {...switchProps}
            isDisabled={isDisabled}
            isSelected={Boolean(field.value)}
            onBlur={field.onBlur}
            onValueChange={(val: boolean) => field.onChange(val)}
          >
            {label}
          </Switch>
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
