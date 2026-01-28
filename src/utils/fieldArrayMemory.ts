"use client";

import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

/**
 * Memory management utilities for field arrays to prevent memory leaks
 * in Cypress tests and long-running applications.
 */

/**
 * Hook to clean up field array memory when component unmounts.
 * Helps prevent memory accumulation in Cypress Electron renderer.
 */
export function useFieldArrayMemoryCleanup<TFieldValues extends FieldValues>(
  arrayName: FieldPath<TFieldValues>,
) {
  const { reset, unregister } = useFormContext<TFieldValues>();

  const cleanup = () => {
    try {
      // Clear the array data
      reset((formValues) => ({
        ...formValues,
        [arrayName]: [],
      }));

      // Small delay to allow React to process the cleanup
      setTimeout(() => {
        try {
          unregister(arrayName);
        } catch (error) {
          // Ignore unregister errors during cleanup
          console.debug("Field array cleanup unregister failed:", error);
        }
      }, 0);
    } catch (error) {
      console.debug("Field array cleanup failed:", error);
    }
  };

  return { cleanup };
}

/**
 * Utility to force garbage collection hints for Cypress tests.
 * Only effective when experimentalMemoryManagement is enabled.
 */
export function suggestGarbageCollection() {
  if (typeof window !== "undefined" && "gc" in window) {
    try {
      // Force garbage collection if available (only in dev/test environments)
      (window as any).gc();
    } catch {
      // Ignore GC errors
    }
  }
}

/**
 * Memory-safe field array operations that include cleanup hints.
 */
export const memorySafeFieldArray = {
  /**
   * Add items to a field array with memory management.
   */
  addItems: (
    append: (value: any) => void,
    items: any[],
    onProgress?: (addedCount: number) => void,
  ) => {
    let addedCount = 0;

    // Add items in batches to allow garbage collection between batches
    const batchSize = 10;

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      batch.forEach((item) => {
        append(item);
        addedCount++;
      });

      // Suggest GC after each batch
      if (addedCount % batchSize === 0) {
        suggestGarbageCollection();
        onProgress?.(addedCount);
      }
    }

    // Final GC suggestion
    suggestGarbageCollection();
  },

  /**
   * Clear entire field array with memory cleanup.
   */

  clearArray: <TFieldValues extends FieldValues>(
    setValue: (name: FieldPath<TFieldValues>, value: any) => void,
    arrayName: FieldPath<TFieldValues>,
  ) => {
    setValue(arrayName, []);
    suggestGarbageCollection();
  },

  /**
   * Remove items from a field array with memory cleanup.
   */
  removeItems: (remove: (index: number) => void, indices: number[]) => {
    // Sort indices in descending order to avoid index shifting issues
    const sortedIndices = [...indices].sort((a, b) => b - a);

    sortedIndices.forEach((index) => {
      remove(index);
    });

    // Suggest GC after removal
    suggestGarbageCollection();
  },
};
