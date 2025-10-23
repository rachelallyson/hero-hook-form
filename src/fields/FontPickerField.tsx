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
const loadingCallbacks: Array<() => void> = [];

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
    loading: false,
    error: null,
  });

  // Load font picker component dynamically
  React.useEffect(() => {
    // If already loaded, use the existing component
    if (fontPickerLoaded && FontPickerComponent) {
      setFontPickerState({
        component: FontPickerComponent,
        loading: false,
        error: null,
      });
      return;
    }

    // If already loading, wait for it to complete
    if (fontPickerLoading) {
      setFontPickerState(prev => ({ ...prev, loading: true }));
      
      // Register callback to be notified when loading completes
      const callback = () => {
        if (fontPickerLoaded && FontPickerComponent) {
          setFontPickerState({
            component: FontPickerComponent,
            loading: false,
            error: null,
          });
        } else {
          setFontPickerState({
            component: null,
            loading: false,
            error: "Font picker package not found",
          });
        }
      };
      loadingCallbacks.push(callback);
      return;
    }

    const loadFontPicker = async () => {
      fontPickerLoading = true;
      setFontPickerState(prev => ({ ...prev, loading: true }));

      try {
        const fontPickerModule = await import("@rachelallyson/heroui-font-picker");
        
        // The font picker package exports FontPicker as the main component
        // Use any type to avoid TypeScript issues with incomplete definitions
        FontPickerComponent = (fontPickerModule as any).FontPicker || (fontPickerModule as any).default;
        
        fontPickerLoaded = true;
        fontPickerLoading = false; // Reset loading flag
        setFontPickerState({
          component: FontPickerComponent,
          loading: false,
          error: null,
        });
        
        // Notify all waiting components
        loadingCallbacks.forEach(callback => callback());
        loadingCallbacks.length = 0; // Clear the callbacks
      } catch (error) {
        fontPickerLoading = false; // Reset loading flag on error too
        setFontPickerState({
          component: null,
          loading: false,
          error: "Font picker package not found",
        });
        
        // Notify all waiting components
        loadingCallbacks.forEach(callback => callback());
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
            <p className="text-default-600 text-sm">
              Loading font picker...
            </p>
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
