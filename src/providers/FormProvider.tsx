"use client";

import React from "react";

import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as RHFProvider } from "react-hook-form";

export interface FormProps<TFieldValues extends FieldValues> {
  methods: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  className?: string;
  children: React.ReactNode;
  id?: string;
  noValidate?: boolean;
}

export function FormProvider<TFieldValues extends FieldValues>(
  props: FormProps<TFieldValues>,
) {
  return (
    <RHFProvider {...props.methods}>
      <form
        className={props.className}
        id={props.id}
        noValidate={props.noValidate}
        onSubmit={(event) =>
          void props.methods.handleSubmit(props.onSubmit)(event)
        }
      >
        {props.children}
      </form>
    </RHFProvider>
  );
}
