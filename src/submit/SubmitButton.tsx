"use client";

import React from "react";

import { useFormContext } from "../index";

import { useHeroHookFormDefaults } from "../providers/ConfigProvider";

import { Button, Spinner } from "#ui";

export interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  buttonProps?: Omit<React.ComponentProps<typeof Button>, "type" | "isLoading">;
}

export function SubmitButton(props: SubmitButtonProps) {
  const ctx = useFormContext();
  const loading = props.isLoading ?? ctx.formState.isSubmitting;

  const isDisabledFromProps = props.buttonProps?.isDisabled ?? false;
  const isDisabled = Boolean(isDisabledFromProps) || Boolean(loading);

  const defaults = useHeroHookFormDefaults();

  return (
    <Button
      type="submit"
      {...defaults.submitButton}
      {...props.buttonProps}
      isDisabled={isDisabled}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Spinner size="sm" />
          Submitting…
        </span>
      ) : (
        props.children
      )}
    </Button>
  );
}
