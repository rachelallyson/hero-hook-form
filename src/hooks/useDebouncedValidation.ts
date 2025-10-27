"use client";

import { useCallback, useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

export interface UseDebouncedValidationOptions {
  delay?: number;
  fields?: string[];
  enabled?: boolean;
}

export function useDebouncedValidation<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: UseDebouncedValidationOptions = {}
) {
  const { delay = 300, fields, enabled = true } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastValuesRef = useRef<Partial<T>>({});

  const debouncedTrigger = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      const currentValues = form.getValues();
      const lastValues = lastValuesRef.current;

      // Check if any watched fields have changed
      const hasChanges = fields
        ? fields.some(field => currentValues[field] !== lastValues[field])
        : Object.keys(currentValues).some(key => currentValues[key] !== lastValues[key]);

      if (hasChanges) {
        // Update last values
        lastValuesRef.current = { ...currentValues };
        
        // Trigger validation for specific fields or all fields
        if (fields && fields.length > 0) {
          await form.trigger(fields as any);
        } else {
          await form.trigger();
        }
      }
    }, delay);
  }, [form, delay, fields, enabled]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []);

  // Reset when form is reset
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      lastValuesRef.current = {};
    }
  }, [form.formState.isSubmitSuccessful]);

  return {
    debouncedTrigger,
    isDebouncing: !!timeoutRef.current,
  };
}

// Hook for debouncing individual field changes
export function useDebouncedFieldValidation<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  fieldName: keyof T,
  options: { delay?: number; enabled?: boolean } = {}
) {
  const { delay = 300, enabled = true } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const debouncedFieldTrigger = useCallback(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      await form.trigger(fieldName as any);
    }, delay);
  }, [form, fieldName, delay, enabled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []);

  return {
    debouncedFieldTrigger,
    isDebouncing: !!timeoutRef.current,
  };
}
