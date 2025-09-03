"use client";

import React from "react";

import { CalendarDate } from "@internationalized/date";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { DateInput } from "#ui";

export type DateFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  CalendarDate | null
> &
  WithControl<TFieldValues> & {
    dateProps?: Omit<
      React.ComponentProps<typeof DateInput>,
      | "value"
      | "onChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >;
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

  return (
    <DateInput
      {...defaults.dateInput}
      {...dateProps}
      description={description}
      errorMessage={errorMessage}
      isDisabled={disabled}
      isInvalid={Boolean(errorMessage)}
      label={label}
      value={field.value ?? null}
      onBlur={field.onBlur}
      onChange={field.onChange}
    />
  );
}

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
