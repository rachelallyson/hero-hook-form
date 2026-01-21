"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import type {
  ArrayPath,
  Control,
  FieldArrayWithId,
  FieldErrors,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "@heroui/react";

import type { CustomFieldConfig } from "../types";

/**
 * Options for creating a custom field array config
 *
 * @template TFieldValues - The form data type
 */
export interface CreateFieldArrayCustomConfigOptions<
  TFieldValues extends FieldValues,
> {
  /** Field array name */
  name: ArrayPath<TFieldValues>;
  /** Optional label for the field array */
  label?: string;
  /** Render function for each array item */
  renderItem: (props: {
    index: number;
    field: FieldArrayWithId<TFieldValues, ArrayPath<TFieldValues>>;
    fields: FieldArrayWithId<TFieldValues, ArrayPath<TFieldValues>>[];
    form: UseFormReturn<TFieldValues>;
    control: Control<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
  }) => React.ReactNode;
  /** Optional render function for add button */
  renderAddButton?: (props: {
    onAdd: () => void;
    canAdd: boolean;
  }) => React.ReactNode;
  /** Function to create default item when adding new array item */
  defaultItem?: () => any;
  /** Minimum number of items */
  min?: number;
  /** Maximum number of items */
  max?: number;
  /** Enable reordering of array items */
  enableReordering?: boolean;
  /** Optional className */
  className?: string;
}

/**
 * Create a CustomFieldConfig for field arrays with full control over rendering.
 *
 * @description
 * This helper creates a CustomFieldConfig that uses useFieldArray internally,
 * giving you full control over the UI while still being integrated with the form.
 * Useful when you need custom layouts, reordering, or complex item rendering
 * that FieldArrayConfig doesn't support.
 *
 * @template TFieldValues - The form data type
 *
 * @param {CreateFieldArrayCustomConfigOptions<TFieldValues>} options - Configuration options
 * @returns {CustomFieldConfig<TFieldValues>} Custom field config for field arrays
 *
 * @example
 * ```tsx
 * const slotsConfig = createFieldArrayCustomConfig("slots", {
 *   label: "Question Slots",
 *   enableReordering: true,
 *   renderItem: ({ index, field, form, control, onMoveUp, onMoveDown, onRemove }) => (
 *     <div className="border rounded-lg p-4">
 *       <div className="flex justify-between">
 *         <span>Slot {index + 1}</span>
 *         <div className="flex gap-2">
 *           <Button onPress={onMoveUp}>↑</Button>
 *           <Button onPress={onMoveDown}>↓</Button>
 *           <Button onPress={onRemove}>Remove</Button>
 *         </div>
 *       </div>
 *       <SelectField
 *         name={`slots.${index}.slotType`}
 *         control={control}
 *         // ...
 *       />
 *     </div>
 *   ),
 * });
 * ```
 *
 * @category Utilities
 */
export function createFieldArrayCustomConfig<TFieldValues extends FieldValues>(
  options: CreateFieldArrayCustomConfigOptions<TFieldValues>,
): CustomFieldConfig<TFieldValues> {
  const {
    className,
    defaultItem,
    enableReordering = false,
    label,
    max = 10,
    min = 0,
    name,
    renderAddButton,
    renderItem,
  } = options;

  return {
    className,
    label,
    name, // ArrayPath is now accepted by CustomFieldConfig
    render: ({ control, errors, form }) => {
      const { append, fields, move, remove } = useFieldArray({
        control,
        name, // ArrayPath is the correct type for useFieldArray
      });

      const canAdd = fields.length < max;
      const canRemove = fields.length > min;

      const handleAdd = () => {
        if (canAdd) {
          if (defaultItem) {
            append(defaultItem());
          } else {
            // When defaultItem is not provided, we can't know the item type at compile time
            // This is a runtime decision - the form will handle the empty object
            append({} as never);
          }
        }
      };

      const handleRemove = (index: number) => {
        if (canRemove) {
          remove(index);
        }
      };

      const handleMoveUp = (index: number) => {
        if (enableReordering && index > 0) {
          move(index, index - 1);
        }
      };

      const handleMoveDown = (index: number) => {
        if (enableReordering && index < fields.length - 1) {
          move(index, index + 1);
        }
      };

      return (
        <div className={className}>
          <div className="space-y-4">
            {fields.map((field, index) => {
              const canMoveUp = enableReordering && index > 0;
              const canMoveDown = enableReordering && index < fields.length - 1;

              return (
                <React.Fragment key={field.id}>
                  {renderItem({
                    canMoveDown,
                    canMoveUp,
                    control,
                    errors,
                    // fields from useFieldArray are already typed correctly
                    field,
                    fields,
                    form,
                    index,
                    onMoveDown: () => handleMoveDown(index),
                    onMoveUp: () => handleMoveUp(index),
                    onRemove: () => handleRemove(index),
                  })}
                </React.Fragment>
              );
            })}

            {fields.length === 0 && renderAddButton ? (
              <div className="text-center py-8 text-gray-500">
                <p>No {label?.toLowerCase() || "items"} added yet.</p>
                {renderAddButton({ canAdd, onAdd: handleAdd })}
              </div>
            ) : null}

            {fields.length > 0 && renderAddButton
              ? renderAddButton({ canAdd, onAdd: handleAdd })
              : canAdd && (
                  <Button
                    variant="bordered"
                    onPress={handleAdd}
                    className="w-full"
                  >
                    Add Item
                  </Button>
                )}
          </div>
        </div>
      );
    },
    type: "custom",
  };
}
