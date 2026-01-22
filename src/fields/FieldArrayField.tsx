"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { FieldValues, FieldArrayWithId } from "react-hook-form";
import { Button } from "@heroui/react";
// Using HeroUI icons instead of lucide-react

import type { FieldArrayConfig, ZodFormFieldConfig } from "../types";
import { FormField } from "../components/FormField";

/**
 * Props for the FieldArrayField component.
 *
 * @template TFieldValues - The form data type
 */
export interface FieldArrayFieldProps<TFieldValues extends FieldValues> {
  config: FieldArrayConfig<TFieldValues>;
  className?: string;
  /** Whether this field array should always be registered (for conditional rendering) */
  alwaysRegistered?: boolean;
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
  alwaysRegistered = false,
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
    name,
  });

  const canAdd = fields.length < max;
  const canRemove = fields.length > min;

  // For always-registered mode, render nothing if no fields (prevents UI flicker)
  if (alwaysRegistered && fields.length === 0) {
    return null;
  }

  // Helper: Construct full path for a field within an array item
  // e.g., "items.0.fieldName" from array name "items", index 0, and field name "fieldName"
  const getFieldPath = (fieldName: string, itemIndex: number): string => {
    return `${String(name)}.${itemIndex}.${fieldName}`;
  };

  // Helper: Process field config for a specific array item
  // Converts relative paths to full paths including array index
  const processFieldConfig = (
    fieldConfig: ZodFormFieldConfig<TFieldValues>,
    itemIndex: number,
  ) => {
    const fieldName = String(fieldConfig.name);
    const fullPath = getFieldPath(fieldName, itemIndex);

    // Check if field has dependsOn that needs to be nested
    if (
      "dependsOn" in fieldConfig &&
      fieldConfig.dependsOn &&
      typeof fieldConfig.dependsOn === "string"
    ) {
      const dependsOnPath = fieldConfig.dependsOn;
      const arrayNamePrefix = `${String(name)}.`;

      // If dependsOn is relative (doesn't include array path), nest it to this item
      if (!dependsOnPath.startsWith(arrayNamePrefix)) {
        const nestedDependsOn = getFieldPath(dependsOnPath, itemIndex);

        return {
          ...fieldConfig,
          dependsOn: nestedDependsOn,
          name: fullPath,
          ...("dependsOnValue" in fieldConfig && {
            dependsOnValue: fieldConfig.dependsOnValue,
          }),
        };
      }
    }

    // No dependsOn or dependsOn already includes array path
    return {
      ...fieldConfig,
      name: fullPath,
    };
  };

  // Helper: Render a single field for an array item
  const renderField = (
    fieldConfig: ZodFormFieldConfig<TFieldValues>,
    itemIndex: number,
  ) => {
    const processedConfig = processFieldConfig(fieldConfig, itemIndex);

    return (
      <FormField<TFieldValues>
        key={`${fieldConfig.name}-${itemIndex}`}
        // @ts-expect-error - TypeScript can't verify runtime-constructed paths are valid Path<TFieldValues>, but we construct them from valid paths
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
  };

  const handleAdd = () => {
    if (canAdd) {
      // defaultItem is required to ensure type safety
      // Users must provide a function that returns the default item structure
      if (defaultItem) {
        append(defaultItem());
      } else {
        // If defaultItem is not provided, we cannot safely create defaults
        // This ensures type safety - users must explicitly provide default values
        console.warn(
          `FieldArrayField: defaultItem is required for field array "${String(name)}". Please provide a defaultItem function that returns the default item structure.`,
        );
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

      // Render all fields for this array item
      const fieldElements = fieldConfigs.map((fieldConfig) =>
        renderField(fieldConfig, index),
      );

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
