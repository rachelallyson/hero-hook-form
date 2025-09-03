"use client";

import React from "react";

import { Select, SelectItem } from "@heroui/react";
import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { FieldBaseProps, WithControl } from "../../src/types";

interface SelectOption<TValue extends string | number> {
  label: string;
  value: TValue;
  description?: string;
  disabled?: boolean;
}

export type SelectFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string | number = string,
> = FieldBaseProps<TFieldValues, TValue> &
  WithControl<TFieldValues> & {
    options: readonly SelectOption<TValue>[];
    placeholder?: string;
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

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedKey = field.value as TValue | undefined;

        return (
          <div className={className}>
            <Select
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
              onSelectionChange={(keys) => {
                const keyArray = Array.from(keys);
                const next =
                  (keyArray[0] as TValue | undefined) ??
                  ("" as unknown as TValue);

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
