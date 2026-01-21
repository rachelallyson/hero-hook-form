"use client";

import React, { useState } from "react";

import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import type {
  FieldBaseProps,
  StringArrayFieldConfig,
  WithControl,
} from "../types";

import { Button } from "#ui";
import { Input } from "#ui";

/**
 * Props for the StringArrayField component.
 *
 * @template TFieldValues - The form data type
 */
export type StringArrayFieldProps<TFieldValues extends FieldValues> =
  FieldBaseProps<TFieldValues, string[]> &
    WithControl<TFieldValues> &
    Pick<StringArrayFieldConfig<TFieldValues>, "stringArrayProps">;

function StringArrayInput<TFieldValues extends FieldValues>(props: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  label?: string;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  stringArrayProps?: StringArrayFieldConfig<TFieldValues>["stringArrayProps"];
}) {
  const {
    description,
    disabled,
    errorMessage,
    field,
    label,
    stringArrayProps,
  } = props;

  const [inputValue, setInputValue] = useState("");

  const items = (field.value as string[]) || [];

  const {
    addButtonText = "Add",
    allowDuplicates = false,
    maxItems,
    minItems,
    placeholder = "Add item...",
    showAddButton = true,
    transformItem = (item: string) => item.trim(),
    validateItem = () => true,
  } = stringArrayProps || {};

  const canAddMore = !maxItems || items.length < maxItems;

  const handleAddItem = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    const transformedValue = transformItem(trimmedValue);

    // Validate the item
    const validation = validateItem(transformedValue);

    if (validation !== true) return; // Don't add if validation fails

    // Check for duplicates if not allowed
    if (!allowDuplicates && items.includes(transformedValue)) return;

    // Add the item
    const newItems = [...items, transformedValue];

    field.onChange(newItems);
    setInputValue("");
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const newItems = items.filter((_, index) => index !== indexToRemove);

    field.onChange(newItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!showAddButton) {
        handleAddItem();
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {minItems !== undefined && (
            <span className="text-xs text-muted-foreground ml-1">
              (min {minItems})
            </span>
          )}
          {maxItems !== undefined && (
            <span className="text-xs text-muted-foreground ml-1">
              (max {maxItems})
            </span>
          )}
        </label>
      )}

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Input and Add Button */}
      {canAddMore && (
        <div className="flex gap-2">
          <Input
            className="flex-1"
            disabled={disabled}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            isInvalid={!!errorMessage}
            errorMessage={errorMessage}
          />
          {showAddButton && (
            <Button
              type="button"
              variant="flat"
              onClick={handleAddItem}
              disabled={disabled || !inputValue.trim()}
              size="sm"
            >
              {addButtonText}
            </Button>
          )}
        </div>
      )}

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-content2 rounded-md"
            >
              <span className="flex-1 text-sm">{item}</span>
              <Button
                type="button"
                variant="light"
                size="sm"
                onClick={() => handleRemoveItem(index)}
                disabled={disabled}
                className="min-w-[60px]"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Validation Messages */}
      {minItems !== undefined && items.length < minItems && (
        <p className="text-xs text-danger">
          At least {minItems} item{minItems === 1 ? "" : "s"} required
        </p>
      )}
      {maxItems !== undefined && items.length >= maxItems && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxItems} item{maxItems === 1 ? "" : "s"} allowed
        </p>
      )}
    </div>
  );
}

/**
 * String Array Field Component
 *
 * Allows users to add/remove string items from an array.
 * Useful for tags, skills, keywords, etc.
 *
 * @template TFieldValues - The form data type
 */
export function StringArrayField<TFieldValues extends FieldValues>(
  props: StringArrayFieldProps<TFieldValues>,
): React.ReactElement {
  const { control, label, name, rules, ...fieldProps } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <StringArrayInput
          field={field}
          label={label}
          description={fieldProps.description}
          disabled={fieldProps.isDisabled}
          errorMessage={fieldState.error?.message}
          stringArrayProps={fieldProps.stringArrayProps}
        />
      )}
    />
  );
}
