"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type {
  AutocompletePassthroughProps,
  FieldBaseProps,
  WithControl,
} from "../types";
import { createAutocompleteFieldHandlers } from "../utils/fieldHandlers";

import { Autocomplete, AutocompleteItem } from "#ui";

/**
 * Configuration for an autocomplete option.
 *
 * @template TValue - The value type for the option
 */
export interface AutocompleteOption<TValue extends string | number> {
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
 * Props for the AutocompleteField component.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the autocomplete field (string or number)
 *
 * @example
 * ```tsx
 * import { AutocompleteField } from "@rachelallyson/hero-hook-form";
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
 * <AutocompleteField
 *   control={form.control}
 *   name="country"
 *   label="Country"
 *   items={options}
 *   placeholder="Search for a country"
 * />
 * ```
 */
export type AutocompleteFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
> = FieldBaseProps<TFieldValues, TValue> &
  WithControl<TFieldValues> & {
    /** Array of autocomplete options (for static lists) */
    items?: readonly AutocompleteOption<TValue>[];
    /** Placeholder text when no option is selected */
    placeholder?: string;
    /** Additional props to pass to the underlying Autocomplete component */
    autocompleteProps?: AutocompletePassthroughProps & {
      defaultItems?: Iterable<AutocompleteOption<TValue>>;
    };
    /** Custom render function for items (for async loading) */
    children?: (item: AutocompleteOption<TValue>) => React.JSX.Element;
  };

/**
 * An autocomplete field component that integrates React Hook Form with HeroUI Autocomplete.
 *
 * This component provides a type-safe autocomplete field with validation support,
 * error handling, and accessibility features. It supports both static option lists
 * and async loading via the items prop or children render function. For dynamic
 * options (e.g. API search), use FormFieldHelpers.autocomplete with a getter:
 * () => people.map(p => ({ label: p.name, value: p.id })) and onInputChange to fetch.
 *
 * @template TFieldValues - The form data type
 * @template TValue - The value type for the autocomplete field (string or number)
 *
 * @param props - The autocomplete field props
 * @returns The rendered autocomplete field component
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
 *           FormFieldHelpers.autocomplete("country", "Country", options, "Search for a country"),
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
 * // With async loading
 * <AutocompleteField
 *   control={form.control}
 *   name="country"
 *   label="Country"
 *   placeholder="Search for a country"
 *   autocompleteProps={{
 *     allowsCustomValue: true,
 *     onInputChange={(value) => {
 *       // Load options asynchronously based on input
 *       loadOptions(value);
 *     }},
 *   }}
 * >
 *   {(item) => (
 *     <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
 *   )}
 * </AutocompleteField>
 * ```
 */
export function AutocompleteField<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
>(props: AutocompleteFieldProps<TFieldValues, TValue>) {
  const {
    autocompleteProps,
    children,
    className,
    control,
    description,
    isDisabled,
    items,
    label,
    name,
    placeholder,
    rules,
  } = props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedKey = field.value as TValue | undefined;
        const hasSelectedValue = selectedKey != null && selectedKey !== "";
        const allowsCustomValue = autocompleteProps?.allowsCustomValue ?? false;
        const shouldShowInputValue = allowsCustomValue || !hasSelectedValue;

        const { defaultItems, ...restAutocompleteProps } =
          autocompleteProps ?? {};
        const rest = createAutocompleteFieldHandlers<
          TValue,
          AutocompletePassthroughProps
        >(
          restAutocompleteProps,
          field,
          { isDisabled, label },
          { allowsCustomValue },
        );

        return (
          <div className={className}>
            <Autocomplete<AutocompleteOption<TValue>>
              {...defaults.autocomplete}
              {...rest}
              {...(defaultItems && {
                defaultItems: defaultItems as Iterable<
                  AutocompleteOption<TValue>
                >,
              })}
              description={description}
              errorMessage={fieldState.error?.message}
              isInvalid={Boolean(fieldState.error)}
              name={name}
              placeholder={placeholder}
              selectedKey={
                allowsCustomValue
                  ? undefined
                  : hasSelectedValue
                    ? String(selectedKey)
                    : undefined
              }
              inputValue={
                shouldShowInputValue
                  ? ((field.value as string | undefined) ?? "")
                  : undefined
              }
              items={items as AutocompleteOption<TValue>[] | undefined}
            >
              {children
                ? (item: AutocompleteOption<TValue>) => (
                    <AutocompleteItem
                      key={String(item.value)}
                      textValue={item.label ?? String(item.value)}
                      description={item.description}
                      isDisabled={item.disabled}
                    >
                      {children(item)}
                    </AutocompleteItem>
                  )
                : (item: AutocompleteOption<TValue>) => (
                    <AutocompleteItem
                      key={String(item.value)}
                      textValue={item.label ?? String(item.value)}
                      description={item.description}
                      isDisabled={item.disabled}
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
            </Autocomplete>
          </div>
        );
      }}
      rules={rules}
    />
  );
}
