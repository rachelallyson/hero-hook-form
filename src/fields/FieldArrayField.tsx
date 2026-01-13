"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { FieldValues, FieldArrayWithId } from "react-hook-form";
import { Button } from "@heroui/react";
// Using HeroUI icons instead of lucide-react

import type { FieldArrayConfig } from "../types";
import { FormField } from "../components/FormField";

/**
 * Props for the FieldArrayField component.
 *
 * @template TFieldValues - The form data type
 */
export interface FieldArrayFieldProps<TFieldValues extends FieldValues> {
  config: FieldArrayConfig<TFieldValues>;
  className?: string;
}

/**
 * Field array component for dynamic repeating field groups.
 *
 * @description
 * Allows users to add and remove multiple instances of a field group.
 * Useful for forms with repeating data like addresses, items, or contacts.
 * Automatically manages field array state and provides add/remove buttons.
 * Supports reordering, custom item rendering, default values, and conditional fields within items.
 *
 * @template TFieldValues - The form data type
 *
 * @param {FieldArrayFieldProps<TFieldValues>} props - Component props
 * @param {FieldArrayConfig<TFieldValues>} props.config - Field array configuration
 * @param {string} [props.className] - Additional CSS class name
 *
 * @returns {JSX.Element} The rendered field array with add/remove controls
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { FieldArrayField, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
 *
 * const fields = [
 *   FormFieldHelpers.input("name", "Name"),
 *   {
 *     type: "fieldArray",
 *     name: "addresses",
 *     label: "Address",
 *     fields: [
 *       FormFieldHelpers.input("street", "Street Address"),
 *       FormFieldHelpers.input("city", "City"),
 *       FormFieldHelpers.input("zipCode", "ZIP Code"),
 *     ],
 *     min: 1,
 *     max: 5,
 *     addButtonText: "Add Address",
 *     removeButtonText: "Remove Address",
 *   },
 * ];
 * ```
 *
 * @example
 * With reordering:
 * ```tsx
 * {
 *   type: "fieldArray",
 *   name: "slots",
 *   label: "Question Slots",
 *   enableReordering: true,
 *   reorderButtonText: { up: "↑", down: "↓" },
 *   fields: [
 *     FormFieldHelpers.select("slotType", "Slot Type", options),
 *   ],
 * }
 * ```
 *
 * @example
 * With custom item rendering:
 * ```tsx
 * {
 *   type: "fieldArray",
 *   name: "items",
 *   renderItem: ({ index, children, onMoveUp, onMoveDown, onRemove }) => (
 *     <Card className="p-4">
 *       <div className="flex justify-between">
 *         <span>Item {index + 1}</span>
 *         <Button onPress={onRemove}>Remove</Button>
 *       </div>
 *       {children}
 *     </Card>
 *   ),
 *   fields: [...],
 * }
 * ```
 *
 * @example
 * With default item:
 * ```tsx
 * {
 *   type: "fieldArray",
 *   name: "slots",
 *   defaultItem: () => ({
 *     order: 0,
 *     slotType: "STATIC",
 *     staticQuestionId: "",
 *   }),
 *   fields: [...],
 * }
 * ```
 *
 * @example
 * With conditional fields within items:
 * ```tsx
 * {
 *   type: "fieldArray",
 *   name: "slots",
 *   fields: [
 *     FormFieldHelpers.select("slotType", "Slot Type", [
 *       { label: "Static", value: "STATIC" },
 *       { label: "Dynamic", value: "DYNAMIC" },
 *     ]),
 *     {
 *       ...FormFieldHelpers.select("staticQuestionId", "Question", questions),
 *       dependsOn: "slotType",
 *       dependsOnValue: "STATIC",
 *     },
 *   ],
 * }
 * ```
 *
 * @see {@link ConditionalField} for conditional single fields
 * @see {@link DynamicSectionField} for conditional field groups
 * @see {@link createFieldArrayCustomConfig} for advanced custom rendering
 * @category Fields
 */
export function FieldArrayField<TFieldValues extends FieldValues>({
  className,
  config,
}: FieldArrayFieldProps<TFieldValues>) {
  const {
    addButtonText = "Add Item",
    defaultItem,
    enableReordering = false,
    fields: fieldConfigs,
    max = 10,
    min = 0,
    name,
    removeButtonText = "Remove",
    renderAddButton,
    renderItem,
    reorderButtonText = { down: "↓", up: "↑" },
  } = config;

  const form = useFormContext<TFieldValues>();

  // Check if form context is available (for SSR compatibility)
  if (!form || !form.control) {
    return null;
  }

  const { control } = form;
  const { append, fields, move, remove } = useFieldArray({
    control,
    name: name as any, // FieldArray name
  });

  const canAdd = fields.length < max;
  const canRemove = fields.length > min;

  const handleAdd = () => {
    if (canAdd) {
      // Use defaultItem function if provided, otherwise infer from field configs
      if (defaultItem) {
        append(defaultItem());
      } else {
        // Create default values for new field array item
        const defaultValues = fieldConfigs.reduce((acc, fieldConfig) => {
          const fieldName = fieldConfig.name as string;

          // Use appropriate default value based on field type
          if (
            fieldConfig.type === "checkbox" ||
            fieldConfig.type === "switch"
          ) {
            acc[fieldName] = false;
          } else if (fieldConfig.type === "slider") {
            acc[fieldName] = 0;
          } else {
            acc[fieldName] = "";
          }

          return acc;
        }, {} as any);

        append(defaultValues);
      }
    }
  };

  const handleRemove = (index: number) => {
    if (canRemove) {
      remove(index);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };

  // Render field array items
  const renderFieldArrayItems = () => {
    return fields.map((field, index) => {
      const canMoveUp = enableReordering && index > 0;
      const canMoveDown = enableReordering && index < fields.length - 1;
      const itemCanRemove = canRemove;

      // Render field configs for this item
      const fieldElements = fieldConfigs.map((fieldConfig) => {
        // Handle dependsOn for array-relative paths
        const fieldName = fieldConfig.name as string;
        const fullPath = `${name}.${index}.${fieldName}` as any;

        // If dependsOn is relative (doesn't start with array name), make it relative to this item
        let processedConfig: any = { ...fieldConfig, name: fullPath };

        // Check if dependsOn exists (not all field types have it, e.g., ContentFieldConfig)
        if (
          "dependsOn" in fieldConfig &&
          fieldConfig.dependsOn &&
          typeof fieldConfig.dependsOn === "string"
        ) {
          const dependsOnPath = fieldConfig.dependsOn;

          // If dependsOn doesn't include the array path, make it relative to this item
          if (!dependsOnPath.startsWith(`${name}.`)) {
            processedConfig = {
              ...processedConfig,
              dependsOn: `${name}.${index}.${dependsOnPath}` as any,
              // Preserve dependsOnValue if it exists
              ...("dependsOnValue" in fieldConfig && {
                dependsOnValue: fieldConfig.dependsOnValue,
              }),
            };
          }
        }

        return (
          <FormField
            key={`${fieldConfig.name}-${index}`}
            config={processedConfig}
            form={form}
            submissionState={{
              error: undefined,
              isSubmitted: false,
              isSubmitting: false,
              isSuccess: false,
            }}
          />
        );
      });

      // Use custom renderItem if provided
      if (renderItem) {
        return (
          <React.Fragment key={field.id}>
            {renderItem({
              canMoveDown,
              canMoveUp,
              canRemove: itemCanRemove,
              children: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fieldElements}
                </div>
              ),
              field: field as FieldArrayWithId,
              fields: fields as FieldArrayWithId[],
              index,
              onMoveDown: () => handleMoveDown(index),
              onMoveUp: () => handleMoveUp(index),
              onRemove: () => handleRemove(index),
            })}
          </React.Fragment>
        );
      }

      // Default rendering
      return (
        <div
          key={field.id}
          className="border border-gray-200 rounded-lg p-4 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">
              {config.label} #{index + 1}
            </h4>
            <div className="flex gap-2">
              {enableReordering && (
                <>
                  <Button
                    size="sm"
                    variant="light"
                    isDisabled={!canMoveUp}
                    onPress={() => handleMoveUp(index)}
                    aria-label={`Move ${config.label} ${index + 1} up`}
                  >
                    {reorderButtonText.up}
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    isDisabled={!canMoveDown}
                    onPress={() => handleMoveDown(index)}
                    aria-label={`Move ${config.label} ${index + 1} down`}
                  >
                    {reorderButtonText.down}
                  </Button>
                </>
              )}
              {itemCanRemove && (
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  startContent="🗑️"
                  onPress={() => handleRemove(index)}
                  aria-label={`${removeButtonText} ${config.label} ${index + 1}`}
                >
                  {removeButtonText}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldElements}
          </div>
        </div>
      );
    });
  };

  // Render add button
  const renderAddButtonElement = () => {
    if (renderAddButton) {
      return renderAddButton({
        canAdd,
        onAdd: handleAdd,
      });
    }

    if (!canAdd) {
      return null;
    }

    return (
      <Button
        variant="bordered"
        startContent="➕"
        onPress={handleAdd}
        className="w-full"
      >
        {addButtonText}
      </Button>
    );
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {fields.length > 0 ? (
          renderFieldArrayItems()
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No {config.label?.toLowerCase()} added yet.</p>
            {renderAddButtonElement()}
          </div>
        )}

        {fields.length > 0 && renderAddButtonElement()}
      </div>
    </div>
  );
}
