"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { Button } from "@heroui/react";
// Using HeroUI icons instead of lucide-react

import type { FieldArrayConfig, ZodFormFieldConfig } from "../types";
import { FormField } from "../components/FormField";

export interface FieldArrayFieldProps<TFieldValues extends FieldValues> {
  config: FieldArrayConfig<TFieldValues>;
  className?: string;
}

export function FieldArrayField<TFieldValues extends FieldValues>({
  config,
  className,
}: FieldArrayFieldProps<TFieldValues>) {
  const { 
    name, 
    fields: fieldConfigs, 
    min = 0, 
    max = 10,
    addButtonText = "Add Item",
    removeButtonText = "Remove"
  } = config;
  
  const form = useFormContext<TFieldValues>();
  
  // Check if form context is available (for SSR compatibility)
  if (!form || !form.control) {
    return null;
  }
  
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any, // FieldArray name
  });
  
  const canAdd = fields.length < max;
  const canRemove = fields.length > min;
  
  const handleAdd = () => {
    if (canAdd) {
      // Create default values for new field array item
      const defaultValues = fieldConfigs.reduce((acc, fieldConfig) => {
        const fieldName = fieldConfig.name as string;
        // Use appropriate default value based on field type
        if (fieldConfig.type === "checkbox" || fieldConfig.type === "switch") {
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
  };
  
  const handleRemove = (index: number) => {
    if (canRemove) {
      remove(index);
    }
  };
  
  return (
    <div className={className}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">
                {config.label} #{index + 1}
              </h4>
              {canRemove && (
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldConfigs.map((fieldConfig) => (
                <FormField
                  key={`${fieldConfig.name}-${index}`}
                  config={{
                    ...fieldConfig,
                    name: `${name}.${index}.${fieldConfig.name}` as any,
                  } as any}
                  form={form}
                  submissionState={{
                    isSubmitting: false,
                    isSubmitted: false,
                    isSuccess: false,
                    error: undefined,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        
        {canAdd && (
          <Button
            variant="bordered"
            startContent="➕"
            onPress={handleAdd}
            className="w-full"
          >
            {addButtonText}
          </Button>
        )}
        
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No {config.label?.toLowerCase()} added yet.</p>
            <Button
              variant="bordered"
              startContent="➕"
              onPress={handleAdd}
              className="mt-2"
            >
              {addButtonText}
          </Button>
          </div>
        )}
      </div>
    </div>
  );
}
