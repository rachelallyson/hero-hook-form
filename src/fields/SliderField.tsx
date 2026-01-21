"use client";

import React from "react";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";
import type { FieldBaseProps, WithControl } from "../types";

import { Slider } from "#ui";

/**
 * Props for the SliderField component.
 *
 * @template TFieldValues - The form data type
 *
 * @example
 * ```tsx
 * import { SliderField } from "@rachelallyson/hero-hook-form";
 * import { useForm } from "react-hook-form";
 *
 * const form = useForm({
 *   defaultValues: { volume: 50 },
 * });
 *
 * <SliderField
 *   control={form.control}
 *   name="volume"
 *   label="Volume"
 *   description="Adjust the volume level"
 * />
 * ```
 */
export type SliderFieldProps<TFieldValues extends FieldValues> = FieldBaseProps<
  TFieldValues,
  number
> &
  WithControl<TFieldValues> & {
    /** Additional props to pass to the underlying Slider component */
    sliderProps?: Omit<
      React.ComponentProps<typeof Slider>,
      | "value"
      | "onValueChange"
      | "label"
      | "isInvalid"
      | "errorMessage"
      | "isDisabled"
    >;
    /** Transform function to modify the slider value before it's set */
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
      name={field.name}
      value={field.value ?? 0}
      onBlur={field.onBlur}
      onValueChange={field.onChange}
    />
  );
}

/**
 * A slider field component that integrates React Hook Form with HeroUI Slider.
 *
 * This component provides a type-safe slider field with validation support,
 * error handling, and accessibility features. The field value is a number.
 *
 * @template TFieldValues - The form data type
 *
 * @param props - The slider field props
 * @returns The rendered slider field component
 *
 * @example
 * ```tsx
 * import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   volume: z.number().min(0).max(100),
 *   brightness: z.number().min(0).max(100),
 * });
 *
 * function MyForm() {
 *   return (
 *     <ZodForm
 *       config={{
 *         schema,
 *         fields: [
 *           FormFieldHelpers.slider("volume", "Volume", { min: 0, max: 100 }),
 *           FormFieldHelpers.slider("brightness", "Brightness", { min: 0, max: 100 }),
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
 * // With custom step and marks
 * <SliderField
 *   control={form.control}
 *   name="volume"
 *   label="Volume"
 *   sliderProps={{
 *     minValue: 0,
 *     maxValue: 100,
 *     step: 10,
 *     marks: [
 *       { value: 0, label: "0" },
 *       { value: 50, label: "50" },
 *       { value: 100, label: "100" },
 *     ],
 *   }}
 * />
 * ```
 */
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
