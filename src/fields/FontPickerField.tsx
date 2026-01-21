"use client";

import React from "react";

import type { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { FieldBaseProps, WithControl } from "../types";

// Optional font picker import - will be null if package is not installed
let FontPickerComponent: any = null;
let fontPickerLoaded = false;
let fontPickerLoading = false;

// Store callbacks to notify components when loading completes
const loadingCallbacks: (() => void)[] = [];

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

  const [fontPickerState, setFontPickerState] = React.useState<{
    component: any;
    loading: boolean;
    error: string | null;
  }>({
    component: FontPickerComponent,
    error: null,
    loading: false,
  });

  // Load font picker component dynamically
  React.useEffect(() => {
    // If already loaded, use the existing component
    if (fontPickerLoaded && FontPickerComponent) {
      setFontPickerState({
        component: FontPickerComponent,
        error: null,
        loading: false,
      });

      return;
    }

    // If already loading, wait for it to complete
    if (fontPickerLoading) {
      setFontPickerState((prev) => ({ ...prev, loading: true }));

      // Register callback to be notified when loading completes
      const callback = () => {
        if (fontPickerLoaded && FontPickerComponent) {
          setFontPickerState({
            component: FontPickerComponent,
            error: null,
            loading: false,
          });
        } else {
          setFontPickerState({
            component: null,
            error: "Font picker package not found",
            loading: false,
          });
        }
      };

      loadingCallbacks.push(callback);

      return;
    }

    const loadFontPicker = async () => {
      fontPickerLoading = true;
      setFontPickerState((prev) => ({ ...prev, loading: true }));

      try {
        const fontPickerModule = await import(
          "@rachelallyson/heroui-font-picker"
        );

        // The font picker package exports FontPicker as the main component
        // Handle dynamic import where the export structure may vary (named export vs default)
        FontPickerComponent =
          (fontPickerModule as { FontPicker?: React.ComponentType<any> })
            .FontPicker ||
          (fontPickerModule as { default?: React.ComponentType<any> }).default;

        fontPickerLoaded = true;
        fontPickerLoading = false; // Reset loading flag
        setFontPickerState({
          component: FontPickerComponent,
          error: null,
          loading: false,
        });

        // Notify all waiting components
        loadingCallbacks.forEach((callback) => callback());
        loadingCallbacks.length = 0; // Clear the callbacks
      } catch {
        fontPickerLoading = false; // Reset loading flag on error too
        setFontPickerState({
          component: null,
          error: "Font picker package not found",
          loading: false,
        });

        // Notify all waiting components
        loadingCallbacks.forEach((callback) => callback());
        loadingCallbacks.length = 0; // Clear the callbacks
      }
    };

    void loadFontPicker();
  }, []);

  // Show loading state
  if (fontPickerState.loading) {
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
          <div className="p-4 border border-default-200 bg-default-50 rounded-medium">
            <p className="text-default-600 text-sm">Loading font picker...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if font picker is available
  if (!fontPickerState.component) {
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
              Font picker requires the @rachelallyson/heroui-font-picker
              package. Please install it as a peer dependency for advanced font
              selection features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use the font picker package
  // Controller accepts control structurally, so compatible control types from
  // different react-hook-form versions will work at runtime
  return (
    <Controller<TFieldValues, Path<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <fontPickerState.component
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
