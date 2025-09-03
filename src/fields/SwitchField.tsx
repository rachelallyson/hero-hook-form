"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Switch } from "#ui";

export type SwitchFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  boolean
> &
  WithControl<TFieldValues> & {
    switchProps?: Omit<
      React.ComponentProps<typeof Switch>,
      "isSelected" | "onValueChange" | "isInvalid" | "isDisabled"
    >;
  };

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
