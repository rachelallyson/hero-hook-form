"use client";

import React from "react";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Slider } from "#ui";

export type SliderFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  number
> &
  WithControl<TFieldValues> & {
    sliderProps?: Omit<
      React.ComponentProps<typeof Slider>,
      | "value"
      | "onValueChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >;
    transform?: (value: number) => number;
  };

function CoercedSlider<TFieldValues extends FieldValues>(props: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  label?: string;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  sliderProps?: Omit<
    React.ComponentProps<typeof Slider>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
}) {
  const { description, disabled, errorMessage, field, label, sliderProps } =
    props;
  const defaults = useHeroHookFormDefaults();

  return (
    <Slider
      {...defaults.slider}
      {...sliderProps}
      description={description}
      errorMessage={errorMessage}
      isDisabled={disabled}
      isInvalid={Boolean(errorMessage)}
      label={label}
      value={field.value ?? 0}
      onBlur={field.onBlur}
      onValueChange={field.onChange}
    />
  );
}

export function SliderField<TFieldValues extends FieldValues>(
  props: SliderFieldProps<TFieldValues>,
) {
  const {
    className,
    control,
    description,
    isDisabled,
    label,
    name,
    rules,
    sliderProps,
    transform,
  } = props;

  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <CoercedSlider<TFieldValues>
            description={description}
            disabled={isDisabled}
            errorMessage={fieldState.error?.message}
            field={{
              ...field,
              onChange: (value: number) =>
                field.onChange(transform ? transform(value) : value),
            }}
            label={label}
            sliderProps={sliderProps}
          />
        </div>
      )}
      rules={rules}
    />
  );
}
