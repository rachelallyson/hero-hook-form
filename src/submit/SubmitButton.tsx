"use client";

import React from "react";
// Using simple text instead of lucide-react icons

import { useFormContext } from "../index";
import type { EnhancedFormState } from "../hooks/useEnhancedFormState";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";

import { Button, Spinner } from "#ui";

export interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  successText?: string;
  loadingText?: string;
  enhancedState?: EnhancedFormState<any>;
  buttonProps?: Omit<React.ComponentProps<typeof Button>, "type" | "isLoading">;
}

export function SubmitButton(props: SubmitButtonProps) {
  const ctx = useFormContext();
  const loading = props.isLoading ?? ctx.formState.isSubmitting;
  const enhancedState = props.enhancedState;

  const isDisabledFromProps = props.buttonProps?.isDisabled ?? false;
  const isDisabled = Boolean(isDisabledFromProps) || Boolean(loading);

  const defaults = useHeroHookFormDefaults();

  // Determine button state and content
  const getButtonContent = () => {
    if (enhancedState?.isSuccess) {
      return (
        <span className="inline-flex items-center gap-2">
          ✅
          {props.successText || "Success!"}
        </span>
      );
    }

    if (loading) {
      return (
        <span className="inline-flex items-center gap-2">
          ⏳
          {props.loadingText || "Submitting..."}
        </span>
      );
    }

    return props.children;
  };

  const getButtonColor = () => {
    if (enhancedState?.isSuccess) {
      return "success";
    }
    if (enhancedState?.isError) {
      return "danger";
    }
    return props.buttonProps?.color || defaults.submitButton.color;
  };

  return (
    <Button
      type="submit"
      {...defaults.submitButton}
      {...props.buttonProps}
      isDisabled={isDisabled}
      color={getButtonColor()}
    >
      {getButtonContent()}
    </Button>
  );
}
