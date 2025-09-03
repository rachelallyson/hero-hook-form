"use client";

import React from "react";

import { Radio, RadioGroup } from "@heroui/react";
import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { FieldBaseProps, WithControl } from "../../src/types";

interface RadioOption<TValue extends string | number> {
  label: string;
  value: TValue;
  description?: string;
  disabled?: boolean;
}

export type RadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
> = FieldBaseProps<TFieldValues, TValue> &
  WithControl<TFieldValues> & {
    options: readonly RadioOption<TValue>[];
    radioGroupProps?: Omit<
      React.ComponentProps<typeof RadioGroup>,
      "value" | "onValueChange" | "label"
    >;
  };

export function RadioGroupField<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
>(props: RadioGroupFieldProps<TFieldValues, TValue>) {
  const {
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    options,
    radioGroupProps,
    rules,
  } = props;

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <RadioGroup
            {...radioGroupProps}
            description={description}
            isDisabled={isDisabled}
            isInvalid={Boolean(fieldState.error)}
            label={label}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onValueChange={(val: string) => field.onChange(val)}
          >
            {options.map((opt) => (
              <Radio
                key={String(opt.value)}
                isDisabled={opt.disabled}
                value={String(opt.value)}
              >
                {opt.label}
              </Radio>
            ))}
          </RadioGroup>
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
