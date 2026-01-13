"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Select, SelectItem } from "#ui";

/**
 * Configuration for a select option.
 *
 * @template TValue - The value type for the option
 */
interface SelectOption<TValue extends string | number> {
  /** Display label for the option */
  label: string;
  /** Value of the option */
  value: TValue;
  /** Optional description text */
  description?: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

/**
 * Props for the SelectField component.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the select field (string or number)
 *
 * @example
 * ```tsx
 * import { SelectField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { country: "" },
 * });
 *
 * const options = [
 *   { label: "United States", value: "us" },
 *   { label: "Canada", value: "ca" },
 *   { label: "Mexico", value: "mx" },
 * ];
 *
 * <SelectField
 *   control={form.control}
 *   name="country"
 *   label="Country"
 *   options={options}
 *   placeholder="Select a country"
 * />
 * ```
 */
export type SelectFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
> = FieldBaseProps<TFieldValues, TValue> &
  WithControl<TFieldValues> & {
    /** Array of select options */
    options: readonly SelectOption<TValue>[];
    /** Placeholder text when no option is selected */
    placeholder?: string;
    /** Additional props to pass to the underlying Select component */
    selectProps?: Omit<
      React.ComponentProps<typeof Select>,
      | "selectedKeys"
      | "onSelectionChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >;
  };

/**
 * A select dropdown field component that integrates React Hook Form with HeroUI Select.
 *
 * This component provides a type-safe select field with validation support,
 * error handling, and accessibility features.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the select field (string or number)
 *
 * @param props - The select field props
 * @returns The rendered select field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   country: z.string().min(1, "Please select a country"),
 * });
 *
 * const options = [
 *   { label: "United States", value: "us" },
 *   { label: "Canada", value: "ca" },
 * ];
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.select("country", "Country", options, "Select a country"),
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
 * <SelectField
 *   control={form.control}
 *   name="country"
 *   label="Country"
 *   options={options}
 *   selectProps={{
 *     variant: "bordered",
 *     size: "lg",
 *   }}
 * />
 * ```
 */
export function SelectField<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
>(props: SelectFieldProps<TFieldValues, TValue>) {
  const {
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    options,
    placeholder,
    rules,
    selectProps,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedKey = field.value as TValue | undefined;

        return (
          <div className={className}>
            <Select
              {...defaults.select}
              {...selectProps}
              description={description}
              errorMessage={fieldState.error?.message}
              isDisabled={isDisabled}
              isInvalid={Boolean(fieldState.error)}
              label={label}
              placeholder={placeholder}
              selectedKeys={
                selectedKey != null ? new Set([String(selectedKey)]) : new Set()
              }
              onSelectionChange={(keys: Iterable<string | number>) => {
                const keyArray = Array.from(keys);
                const next =
                  (keyArray[0] as TValue | undefined) ?? ("" as TValue);

                field.onChange(next);
              }}
            >
              {options.map((opt) => (
                <SelectItem
                  key={String(opt.value)}
                  isDisabled={opt.disabled}
                  textValue={String(opt.value)}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        );
      }}
      rules={rules}
    />
  );
}
