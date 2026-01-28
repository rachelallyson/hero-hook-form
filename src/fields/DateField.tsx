"use client";

import React from "react";

import { CalendarDate } from "@internationalized/date";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";
import { toCalendarDateValue } from "../utils/dateCoercion";

import { DateInput } from "#ui";

/**
 * Props for the DateField component.
 *
 * @template TFieldValues - The form data type
 *
 * @example
 * ```tsx
 * import { DateField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 * import { CalendarDate } from "@internationalized/date";
 *
 * const form = useForm({
 *   defaultValues: { birthDate: null as CalendarDate | null },
 * });
 *
 * <DateField
 *   control={form.control}
 *   name="birthDate"
 *   label="Birth Date"
 *   description="Select your date of birth"
 * />
 * ```
 */
export type DateFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  CalendarDate | null
> &
  WithControl<TFieldValues> & {
    /** Additional props to pass to the underlying DateInput component */
    dateProps?: Omit<
      React.ComponentProps<typeof DateInput>,
      | "value"
      | "onChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >;
    /** Transform function to modify the date value before it's set */
    transform?: (value: CalendarDate | null) => CalendarDate | null;
  };

function CoercedDateInput<TFieldValues extends FieldValues>(props: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  label?: string;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  dateProps?: Omit<
    React.ComponentProps<typeof DateInput>,
    "value" | "onChange" | "label" | "isInvalid" | "errorMessage" | "isDisabled"
  >;
}) {
  const { dateProps, description, disabled, errorMessage, field, label } =
    props;
  const defaults = useHeroHookFormDefaults();

  const dateValue = toCalendarDateValue(field.value);

  return (
    <DateInput
      {...defaults.dateInput}
      {...dateProps}
      description={description}
      errorMessage={errorMessage}
      isDisabled={disabled}
      isInvalid={Boolean(errorMessage)}
      label={label}
      name={field.name}
      value={dateValue}
      onBlur={field.onBlur}
      onChange={field.onChange}
    />
  );
}

/**
 * A date input field component that integrates React Hook Form with HeroUI DateInput.
 *
 * This component provides a type-safe date field with validation support,
 * error handling, and accessibility features. Uses `@internationalized/date`
 * for date handling.
 *
 * @template TFieldValues - The form data type
 *
 * @param props - The date field props
 * @returns The rendered date field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 * import { CalendarDate } from "@internationalized/date";
 *
 * const schema = z.object({
 *   birthDate: z.instanceof(CalendarDate).nullable(),
 *   eventDate: z.instanceof(CalendarDate),
 * });
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.date("birthDate", "Birth Date"),
 *           FormFieldHelpers.date("eventDate", "Event Date"),
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
 * // With custom date format and min/max dates
 * <DateField
 *   control={form.control}
 *   name="eventDate"
 *   label="Event Date"
 *   dateProps={{
 *     minValue: new CalendarDate(2024, 1, 1),
 *     maxValue: new CalendarDate(2024, 12, 31),
 *   }}
 * />
 * ```
 */
export function DateField<TFieldValues extends FieldValues>(
  props: DateFieldProps<TFieldValues>,
) {
  const {
    className,
    control,
    dateProps,
    description,
    isDisabled,
    label,
    name,
    rules,
    transform,
  } = props;

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <CoercedDateInput<TFieldValues>
            dateProps={dateProps}
            description={description}
            disabled={isDisabled}
            errorMessage={fieldState.error?.message}
            field={{
              ...field,
              onChange: (value: CalendarDate | null) =>
                field.onChange(transform ? transform(value) : value),
            }}
            label={label}
          />
        </div>
      )}
      rules={rules}
    />
  );
}
