"use client";

import { useCallback, useMemo, useRef } from "react";

/**
 * Debounce function for field changes
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for high-frequency events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoization helper for expensive computations
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
): T {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    deps,
  );
}

/**
 * Shallow comparison for React.memo
 */
export function shallowEqual<T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Deep comparison for complex objects
 */
export function deepEqual<T extends Record<string, any>>(
  prevProps: T,
  nextProps: T,
): boolean {
  if (prevProps === nextProps) {
    return true;
  }

  if (typeof prevProps !== typeof nextProps) {
    return false;
  }

  if (
    typeof prevProps !== "object" ||
    prevProps === null ||
    nextProps === null
  ) {
    return prevProps === nextProps;
  }

  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (!nextKeys.includes(key)) {
      return false;
    }

    if (!deepEqual(prevProps[key], nextProps[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Performance monitoring utilities (dev mode only)
 */
export function usePerformanceMonitor(
  componentName: string,
  enabled: boolean = process.env.NODE_ENV === "development",
) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  if (enabled) {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;

    console.log(`[Performance] ${componentName}:`, {
      renderCount: renderCountRef.current,
      timeSinceLastRender: `${timeSinceLastRender}ms`,
    });

    lastRenderTimeRef.current = now;
  }

  return {
    renderCount: renderCountRef.current,
    resetRenderCount: () => {
      renderCountRef.current = 0;
    },
  };
}

/**
 * Optimized field change handler
 */
export function createOptimizedFieldHandler<T>(
  onChange: (value: T) => void,
  options: {
    debounce?: number;
    throttle?: number;
  } = {},
) {
  const { debounce: debounceMs, throttle: throttleMs } = options;

  let handler = onChange;

  if (throttleMs) {
    handler = throttle(handler, throttleMs);
  }

  if (debounceMs) {
    handler = debounce(handler, debounceMs);
  }

  return handler;
}

/**
 * Memoized field props to prevent unnecessary re-renders
 */
export function useMemoizedFieldProps<T extends Record<string, any>>(
  props: T,
  deps: React.DependencyList,
): T {
  return useMemo(() => props, deps);
}
