"use client";

import React from "react";
import { Button } from "@heroui/react";
// Using simple text instead of lucide-react icons

import type { EnhancedFormState } from "../hooks/useEnhancedFormState";

export interface FormStatusProps<T extends Record<string, any>> {
  state: EnhancedFormState<T>;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
}

export function FormStatus<T extends Record<string, any>>({
  state,
  onDismiss,
  className = "",
  showDetails = false,
}: FormStatusProps<T>) {
  const { status, isSubmitting, isSuccess, isError, error, submittedData } = state;

  // Don't render anything if idle
  if (status === "idle") {
    return null;
  }

  // Loading state
  if (isSubmitting) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
        <span className="text-blue-600">⏳</span>
        <div>
          <p className="text-sm font-medium text-blue-900">Submitting form...</p>
          {showDetails && (
            <p className="text-xs text-blue-700">Please wait while we process your request.</p>
          )}
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg ${className}`} data-testid="success-message">
        <span className="text-green-600">✅</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900">Form submitted successfully!</p>
          {showDetails && submittedData && (
            <p className="text-xs text-green-700">
              Your data has been saved. Thank you for your submission.
            </p>
          )}
        </div>
        {onDismiss && (
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={onDismiss}
            aria-label="Dismiss success message"
          >
            ✕
          </Button>
        )}
      </div>
    );
  }

  // Error state
  if (isError && error) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg ${className}`} data-testid="error-message">
        <span className="text-red-600">⚠️</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900">Error submitting form</p>
          <p className="text-xs text-red-700">{error}</p>
        </div>
        {onDismiss && (
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={onDismiss}
            aria-label="Dismiss error message"
          >
            ✕
          </Button>
        )}
      </div>
    );
  }

  return null;
}

// Toast notification component (optional)
export interface FormToastProps<T extends Record<string, any>> {
  state: EnhancedFormState<T>;
  onDismiss?: () => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  duration?: number;
}

export function FormToast<T extends Record<string, any>>({
  state,
  onDismiss,
  position = "top-right",
  duration = 5000,
}: FormToastProps<T>) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (state.isSuccess || state.isError) {
      setIsVisible(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [state.isSuccess, state.isError, duration, onDismiss]);

  if (!isVisible) {
    return null;
  }

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      <FormStatus state={state} onDismiss={onDismiss} />
    </div>
  );
}
