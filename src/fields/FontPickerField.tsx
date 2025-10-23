"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { FieldBaseProps, WithControl } from "../types";

// Optional font picker import - will be null if package is not installed
let FontPickerComponent: any = null;

try {
  // Try to dynamically import the font picker package
  const fontPickerModule = require("@rachelallyson/heroui-font-picker");
  FontPickerComponent = fontPickerModule.FontPicker;
} catch (e) {
  // Font picker package not available - this is expected for users who don't need it
  console.debug("Font picker package not available - FontPickerField will show fallback UI");
}

// Font picker props type - matches the font picker package interface
interface FontPickerProps {
  showFontPreview?: boolean;
  loadAllVariants?: boolean;
  onFontsLoaded?: (loaded: boolean) => void;
  fontsLoadedTimeout?: number;
}

export type FontPickerFieldProps<
  TFieldValues extends FieldValues,
  TValue extends string = string,
> = FieldBaseProps<TFieldValues, TValue> &
  WithControl<TFieldValues> & {
    fontPickerProps?: FontPickerProps;
  };

export function FontPickerField<
  TFieldValues extends FieldValues,
  TValue extends string = string,
>(props: FontPickerFieldProps<TFieldValues, TValue>) {
  const {
    className,
    control,
    description,
    fontPickerProps,
    isDisabled,
    label,
    name,
    rules,
  } = props;

  // Check if font picker is available
  if (!FontPickerComponent) {
    return (
      <div className={className}>
        <div className="space-y-2">
          {label && (
            <label className="block text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <div className="p-4 border border-warning-200 bg-warning-50 rounded-medium">
            <p className="text-warning-800 text-sm">
              Font picker requires the @rachelallyson/heroui-font-picker package. 
              Please install it as a peer dependency for advanced font selection features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use the font picker package
  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FontPickerComponent
          label={label}
          description={description}
          value={field.value ?? ""}
          onSelectionChange={(value: string) => field.onChange(value)}
          errorMessage={fieldState.error?.message}
          isDisabled={isDisabled}
          className={className}
          {...fontPickerProps}
        />
      )}
      rules={rules}
    />
  );
}
