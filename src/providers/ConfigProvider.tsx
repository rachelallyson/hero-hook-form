"use client";

import React, { createContext, useContext, useMemo } from "react";

import type {
  Button,
  Checkbox,
  DateInput,
  Input,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
} from "#ui";

// Derive shared unions across text-like controls (Input, Textarea, Select)
type InputProps = React.ComponentProps<typeof Input>;
type TextareaProps = React.ComponentProps<typeof Textarea>;
type SelectProps = React.ComponentProps<typeof Select>;

type SharedTextLikeColor = Extract<
  InputProps["color"],
  Extract<TextareaProps["color"], SelectProps["color"]>
>;
type SharedTextLikeSize = Extract<
  InputProps["size"],
  Extract<TextareaProps["size"], SelectProps["size"]>
>;
type SharedTextLikeVariant = Extract<
  InputProps["variant"],
  Extract<TextareaProps["variant"], SelectProps["variant"]>
>;
type SharedTextLikeRadius = Extract<
  InputProps["radius"],
  Extract<TextareaProps["radius"], SelectProps["radius"]>
>;
type SharedTextLikeLabelPlacement = Extract<
  InputProps["labelPlacement"],
  Extract<TextareaProps["labelPlacement"], SelectProps["labelPlacement"]>
>;

export type CommonFieldDefaults = Partial<{
  color: SharedTextLikeColor;
  size: SharedTextLikeSize;
  variant: SharedTextLikeVariant;
  radius: SharedTextLikeRadius;
  labelPlacement: SharedTextLikeLabelPlacement;
}>;

export type InputDefaults = Partial<
  Omit<
    InputProps,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;

export type TextareaDefaults = Partial<
  Omit<
    TextareaProps,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;

export type CheckboxDefaults = Partial<
  Omit<
    React.ComponentProps<typeof Checkbox>,
    "isSelected" | "onValueChange" | "isInvalid" | "errorMessage" | "isDisabled"
  >
>;

export type RadioGroupDefaults = Partial<
  Omit<
    React.ComponentProps<typeof RadioGroup>,
    "value" | "onValueChange" | "label"
  >
>;

export type SelectDefaults = Partial<
  Omit<
    SelectProps,
    | "selectedKeys"
    | "onSelectionChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;

export type DateInputDefaults = Partial<
  Omit<
    React.ComponentProps<typeof DateInput>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;

export type SliderDefaults = Partial<
  Omit<
    React.ComponentProps<typeof Slider>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;

export type SwitchDefaults = Partial<
  Omit<
    React.ComponentProps<typeof Switch>,
    "isSelected" | "onValueChange" | "isInvalid" | "isDisabled"
  >
>;

export type ButtonDefaults = Partial<
  Omit<React.ComponentProps<typeof Button>, "type" | "isLoading">
>;

export interface HeroHookFormDefaultsConfig {
  common?: CommonFieldDefaults;
  input?: InputDefaults;
  textarea?: TextareaDefaults;
  checkbox?: CheckboxDefaults;
  radioGroup?: RadioGroupDefaults;
  select?: SelectDefaults;
  dateInput?: DateInputDefaults;
  slider?: SliderDefaults;
  switch?: SwitchDefaults;
  submitButton?: ButtonDefaults;
}

const DefaultsContext = createContext<HeroHookFormDefaultsConfig | null>(null);

export interface HeroHookFormProviderProps {
  children: React.ReactNode;
  defaults?: HeroHookFormDefaultsConfig;
}

export function HeroHookFormProvider(props: HeroHookFormProviderProps) {
  const value = useMemo(() => props.defaults ?? {}, [props.defaults]);

  return (
    <DefaultsContext.Provider value={value}>
      {props.children}
    </DefaultsContext.Provider>
  );
}

/**
 * Type-safe helper to extract common config for Input component.
 * SharedTextLikeColor is Extract<InputProps["color"], ...>, so it's provably a subset of InputProps["color"].
 * However, TypeScript's type system doesn't automatically prove Extract<A, B> extends A.
 * We restructure to make the relationship explicit by using explicit type annotations.
 */
type InputCommonConfig = Partial<
  Pick<InputProps, "color" | "size" | "variant" | "radius" | "labelPlacement">
>;
type TextareaCommonConfig = Partial<
  Pick<
    TextareaProps,
    "color" | "size" | "variant" | "radius" | "labelPlacement"
  >
>;
type SelectCommonConfig = Partial<
  Pick<SelectProps, "color" | "size" | "variant" | "radius" | "labelPlacement">
>;

/**
 * Since SharedTextLike* types are intersections, we can prove they're compatible with each component.
 * We use explicit type annotations to help TypeScript understand the relationship.
 */
function extractInputCommon(common: CommonFieldDefaults): InputCommonConfig {
  // SharedTextLikeColor = Extract<InputProps["color"], Extract<...>>
  // This means every value in SharedTextLikeColor is also in InputProps["color"]
  // TypeScript needs help recognizing this, so we structure the code to make it obvious
  const result: InputCommonConfig = {};

  if (common.color !== undefined) {
    // At runtime, this is safe because SharedTextLikeColor is a subset of InputProps["color"]
    // At compile time, we need to help TypeScript understand this relationship
    const color: InputProps["color"] = common.color;

    result.color = color;
  }
  if (common.size !== undefined) {
    const size: InputProps["size"] = common.size;

    result.size = size;
  }
  if (common.variant !== undefined) {
    const variant: InputProps["variant"] = common.variant;

    result.variant = variant;
  }
  if (common.radius !== undefined) {
    const radius: InputProps["radius"] = common.radius;

    result.radius = radius;
  }
  if (common.labelPlacement !== undefined) {
    const labelPlacement: InputProps["labelPlacement"] = common.labelPlacement;

    result.labelPlacement = labelPlacement;
  }

  return result;
}

function extractTextareaCommon(
  common: CommonFieldDefaults,
): TextareaCommonConfig {
  const result: TextareaCommonConfig = {};

  if (common.color !== undefined) {
    const color: TextareaProps["color"] = common.color;

    result.color = color;
  }
  if (common.size !== undefined) {
    const size: TextareaProps["size"] = common.size;

    result.size = size;
  }
  if (common.variant !== undefined) {
    const variant: TextareaProps["variant"] = common.variant;

    result.variant = variant;
  }
  if (common.radius !== undefined) {
    const radius: TextareaProps["radius"] = common.radius;

    result.radius = radius;
  }
  if (common.labelPlacement !== undefined) {
    const labelPlacement: TextareaProps["labelPlacement"] =
      common.labelPlacement;

    result.labelPlacement = labelPlacement;
  }

  return result;
}

function extractSelectCommon(common: CommonFieldDefaults): SelectCommonConfig {
  const result: SelectCommonConfig = {};

  if (common.color !== undefined) {
    const color: SelectProps["color"] = common.color;

    result.color = color;
  }
  if (common.size !== undefined) {
    const size: SelectProps["size"] = common.size;

    result.size = size;
  }
  if (common.variant !== undefined) {
    const variant: SelectProps["variant"] = common.variant;

    result.variant = variant;
  }
  if (common.radius !== undefined) {
    const radius: SelectProps["radius"] = common.radius;

    result.radius = radius;
  }
  if (common.labelPlacement !== undefined) {
    const labelPlacement: SelectProps["labelPlacement"] = common.labelPlacement;

    result.labelPlacement = labelPlacement;
  }

  return result;
}

export function useHeroHookFormDefaults(): Required<
  Pick<
    HeroHookFormDefaultsConfig,
    | "input"
    | "textarea"
    | "checkbox"
    | "radioGroup"
    | "select"
    | "dateInput"
    | "slider"
    | "switch"
    | "submitButton"
  >
> {
  const cfg = useContext(DefaultsContext) ?? {};
  const common = cfg.common ?? {};

  // For Input, Textarea, Select: SharedTextLike* types are intersections of their prop types
  // This means they're provably compatible - we use explicit type annotations to help TypeScript
  const commonInput = extractInputCommon(common);
  const commonTextarea = extractTextareaCommon(common);
  const commonSelect = extractSelectCommon(common);

  // For other components, we don't apply common config because:
  // 1. Their prop types may not be compatible with SharedTextLike* types
  // 2. Users can still set component-specific defaults in cfg.checkbox, etc.
  // This is a breaking change but results in better type safety

  return {
    checkbox: cfg.checkbox ?? {},
    dateInput: cfg.dateInput ?? {},
    input: { ...commonInput, ...(cfg.input ?? {}) },
    radioGroup: cfg.radioGroup ?? {},
    select: { ...commonSelect, ...(cfg.select ?? {}) },
    slider: cfg.slider ?? {},
    submitButton: cfg.submitButton ?? {},
    switch: cfg.switch ?? {},
    textarea: { ...commonTextarea, ...(cfg.textarea ?? {}) },
  };
}
