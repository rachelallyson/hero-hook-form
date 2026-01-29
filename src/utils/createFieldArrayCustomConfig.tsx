"use client";

import React from "react";
import { useFieldArray } from "react-hook-form";
import type {
  ArrayPath,
  Control,
  FieldArrayWithId,
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "@heroui/react";

import { FormFieldHelpers } from "../builders/BasicFormBuilder";
import { FormField } from "../components/FormField";
import type {
  CustomFieldConfig,
  FormSubmissionState,
  ZodFormFieldConfig,
} from "../types";

/**
 * Supported input types for dynamic custom fields (e.g. member custom field values).
 * Use with createCustomFieldConfigForItem so each array item can render the right control.
 */
export type CustomFieldInputType =
  | "DATE"
  | "DROPDOWN"
  | "LONG_TEXT"
  | "NUMBER"
  | "SHORT_TEXT";

/**
 * Minimal field definition for creating a single field config by type.
 * Matches common patterns where each array item has a type and label (e.g. customFieldId → field def).
 */
export interface CustomFieldDef {
  fieldType: CustomFieldInputType;
  name: string;
  /** For DROPDOWN: newline-separated string or array of { label, value } */
  options?: string | { label: string; value: string | number }[];
}

function parseDropdownOptions(
  options: string | { label: string; value: string | number }[] | undefined,
): { label: string; value: string | number }[] {
  if (options == null) return [];
  if (Array.isArray(options)) return options;

  return options
    .split("\n")
    .map((o) => o.trim())
    .filter((o) => o.length > 0)
    .map((o) => ({ label: o, value: o }));
}

/**
 * Create the right ZodFormFieldConfig for a single custom field by type.
 * Use inside createFieldArrayCustomConfig getItemFieldConfig (or renderItem) so each
 * array item renders one control (date, short text, long text, number, or dropdown)
 * instead of multiple conditionals.
 *
 * @param name - Form path for the value (e.g. `customFieldValues.${index}.value`)
 * @param def - Field definition with fieldType, name (label), and optional options for DROPDOWN
 * @returns ZodFormFieldConfig for use with FormField
 *
 * @example
 * ```tsx
 * createFieldArrayCustomConfig({
 *   name: 'customFieldValues',
 *   getItemFieldConfig: ({ field, form, index }) => {
 *     const fieldDef = fields.find(f => f.id === field.customFieldId);
 *     if (!fieldDef) return null;
 *     return createCustomFieldConfigForItem(
 *       `customFieldValues.${index}.value`,
 *       { fieldType: fieldDef.fieldType, name: fieldDef.name, options: fieldDef.options }
 *     );
 *   },
 *   defaultItem: () => ({ customFieldId: '', value: '' }),
 * });
 * ```
 */
export function createCustomFieldConfigForItem<T extends FieldValues>(
  name: Path<T>,
  def: CustomFieldDef,
): ZodFormFieldConfig<T> {
  const { fieldType, name: label, options } = def;

  switch (fieldType) {
    case "DATE":
      return FormFieldHelpers.date(name, label, { granularity: "day" });
    case "SHORT_TEXT":
      return FormFieldHelpers.input(name, label);
    case "LONG_TEXT":
      return FormFieldHelpers.textarea(name, label);
    case "NUMBER":
      return FormFieldHelpers.input(name, label, { type: "number" });
    case "DROPDOWN":
      return FormFieldHelpers.select(
        name,
        label,
        parseDropdownOptions(options),
      );
    default: {
      void fieldType;

      return FormFieldHelpers.input(name, label);
    }
  }
}

/** Props passed to renderItem or getItemFieldConfig for each array item */
export interface FieldArrayItemRenderProps<
  TFieldValues extends FieldValues,
  TArrayPath extends ArrayPath<TFieldValues>,
> {
  index: number;
  field: FieldArrayWithId<TFieldValues, TArrayPath>;
  fields: FieldArrayWithId<TFieldValues, TArrayPath>[];
  form: UseFormReturn<TFieldValues>;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

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
  /**
   * Return a single field config for this item; the array helper will render one FormField.
   * Use with createCustomFieldConfigForItem when each item's control type depends on item data
   * (e.g. custom fields: look up field def by customFieldId, then createCustomFieldConfigForItem).
   * When provided, renderItem is optional.
   */
  getItemFieldConfig?: (
    props: FieldArrayItemRenderProps<TFieldValues, ArrayPath<TFieldValues>>,
  ) => ZodFormFieldConfig<TFieldValues> | null;
  /** Render function for each array item (optional if getItemFieldConfig is provided) */
  renderItem?: (
    props: FieldArrayItemRenderProps<TFieldValues, ArrayPath<TFieldValues>>,
  ) => React.ReactNode;
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
    getItemFieldConfig,
    label,
    max = 10,
    min = 0,
    name,
    renderAddButton,
    renderItem,
  } = options;

  if (!getItemFieldConfig && !renderItem) {
    throw new Error(
      "createFieldArrayCustomConfig: provide either getItemFieldConfig or renderItem",
    );
  }

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

      const submissionState: FormSubmissionState = {
        error: undefined,
        isSubmitted: form.formState.isSubmitted,
        isSubmitting: form.formState.isSubmitting,
        isSuccess: false,
      };

      const itemProps = (index: number) =>
        ({
          canMoveDown: enableReordering && index < fields.length - 1,
          canMoveUp: enableReordering && index > 0,
          control,
          errors,
          field: fields[index],
          fields,
          form,
          index,
          onMoveDown: () => handleMoveDown(index),
          onMoveUp: () => handleMoveUp(index),
          onRemove: () => handleRemove(index),
        }) as FieldArrayItemRenderProps<TFieldValues, ArrayPath<TFieldValues>>;

      return (
        <div className={className}>
          <div className="space-y-4">
            {fields.map((field, index) => {
              if (getItemFieldConfig) {
                const config = getItemFieldConfig(itemProps(index));

                if (!config) return <React.Fragment key={field.id} />;

                return (
                  <FormField<TFieldValues>
                    key={field.id}
                    config={config}
                    form={form}
                    submissionState={submissionState}
                  />
                );
              }

              return (
                <React.Fragment key={field.id}>
                  {renderItem!(itemProps(index))}
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
