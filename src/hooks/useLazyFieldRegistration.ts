"use client";

import { useEffect, useRef, useState } from "react";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

/**
 * Hook for lazy field registration to reduce initial memory usage.
 *
 * This hook registers fields only when they become active (e.g., when a condition is met),
 * preventing the memory overhead of always-registered fields while avoiding
 * register/unregister cycles that cause memory leaks in Cypress.
 *
 * @param fieldName - The field name to potentially register
 * @param shouldRegister - Function that determines if the field should be registered
 * @param defaultValue - Default value for the field when registered
 * @param rules - Validation rules for the field
 */
export function useLazyFieldRegistration<TFieldValues extends FieldValues>(
  fieldName: FieldPath<TFieldValues>,
  shouldRegister: () => boolean,
  defaultValue?: any,
  rules?: any,
) {
  const { register, setValue, unregister, watch } =
    useFormContext<TFieldValues>();
  const [isRegistered, setIsRegistered] = useState(false);
  const hasCheckedRegistration = useRef(false);

  // Watch the condition to determine when to register/unregister
  const conditionMet = shouldRegister();

  useEffect(() => {
    if (conditionMet && !isRegistered) {
      // Register the field
      register(fieldName, rules);
      if (defaultValue !== undefined) {
        setValue(fieldName, defaultValue);
      }
      setIsRegistered(true);
      hasCheckedRegistration.current = true;
    } else if (
      !conditionMet &&
      isRegistered &&
      hasCheckedRegistration.current
    ) {
      // Unregister the field only after it has been registered at least once
      // This prevents unnecessary unregister calls during initial render
      unregister(fieldName);
      setIsRegistered(false);
    }
  }, [
    conditionMet,
    fieldName,
    register,
    unregister,
    setValue,
    rules,
    defaultValue,
    isRegistered,
  ]);

  return {
    currentValue: isRegistered ? watch(fieldName) : undefined,
    isRegistered,
  };
}

/**
 * Hook for lazy field array registration.
 *
 * Similar to useLazyFieldRegistration but specifically for field arrays,
 * which have more complex registration requirements.
 */
export function useLazyFieldArrayRegistration<TFieldValues extends FieldValues>(
  arrayName: FieldPath<TFieldValues>,
  shouldRegister: () => boolean,
  defaultValue: any[] = [],
) {
  const { setValue, watch } = useFormContext<TFieldValues>();
  const [isRegistered, setIsRegistered] = useState(false);
  const hasCheckedRegistration = useRef(false);

  const conditionMet = shouldRegister();
  const currentValue = watch(arrayName);

  useEffect(() => {
    if (conditionMet && !isRegistered) {
      // Initialize the array if it doesn't exist
      if (!currentValue || !Array.isArray(currentValue)) {
        setValue(arrayName, defaultValue as any);
      }
      setIsRegistered(true);
      hasCheckedRegistration.current = true;
    } else if (
      !conditionMet &&
      isRegistered &&
      hasCheckedRegistration.current
    ) {
      // Clear the array when condition is no longer met
      setValue(arrayName, [] as any);
      setIsRegistered(false);
    }
  }, [
    conditionMet,
    arrayName,
    setValue,
    defaultValue,
    isRegistered,
    currentValue,
  ]);

  return {
    currentValue: isRegistered ? currentValue : ([] as any),
    isRegistered,
  };
}
