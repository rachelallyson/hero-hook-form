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

  // Build per-component common defaults with precise prop types
  const commonInput: Partial<
    Pick<InputProps, "color" | "size" | "variant" | "radius" | "labelPlacement">
  > = {
    ...(common.color !== undefined
      ? { color: common.color as InputProps["color"] }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as InputProps["size"] }
      : {}),
    ...(common.variant !== undefined
      ? { variant: common.variant as InputProps["variant"] }
      : {}),
    ...(common.radius !== undefined
      ? { radius: common.radius as InputProps["radius"] }
      : {}),
    ...(common.labelPlacement !== undefined
      ? {
          labelPlacement: common.labelPlacement as InputProps["labelPlacement"],
        }
      : {}),
  };

  const commonTextarea: Partial<
    Pick<
      TextareaProps,
      "color" | "size" | "variant" | "radius" | "labelPlacement"
    >
  > = {
    ...(common.color !== undefined
      ? { color: common.color as TextareaProps["color"] }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as TextareaProps["size"] }
      : {}),
    ...(common.variant !== undefined
      ? { variant: common.variant as TextareaProps["variant"] }
      : {}),
    ...(common.radius !== undefined
      ? { radius: common.radius as TextareaProps["radius"] }
      : {}),
    ...(common.labelPlacement !== undefined
      ? {
          labelPlacement:
            common.labelPlacement as TextareaProps["labelPlacement"],
        }
      : {}),
  };

  const commonSelect: Partial<
    Pick<
      SelectProps,
      "color" | "size" | "variant" | "radius" | "labelPlacement"
    >
  > = {
    ...(common.color !== undefined
      ? { color: common.color as SelectProps["color"] }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as SelectProps["size"] }
      : {}),
    ...(common.variant !== undefined
      ? { variant: common.variant as SelectProps["variant"] }
      : {}),
    ...(common.radius !== undefined
      ? { radius: common.radius as SelectProps["radius"] }
      : {}),
    ...(common.labelPlacement !== undefined
      ? {
          labelPlacement:
            common.labelPlacement as SelectProps["labelPlacement"],
        }
      : {}),
  };

  // For controls and button, only apply color and size (safe shared keys)
  const commonCheckbox: Partial<
    Pick<React.ComponentProps<typeof Checkbox>, "color" | "size">
  > = {
    ...(common.color !== undefined
      ? {
          color: common.color as React.ComponentProps<typeof Checkbox>["color"],
        }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as React.ComponentProps<typeof Checkbox>["size"] }
      : {}),
  };

  const commonRadioGroup: Partial<
    Pick<React.ComponentProps<typeof RadioGroup>, "color" | "size">
  > = {
    ...(common.color !== undefined
      ? {
          color: common.color as React.ComponentProps<
            typeof RadioGroup
          >["color"],
        }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as React.ComponentProps<typeof RadioGroup>["size"] }
      : {}),
  };

  const commonDateInput: Partial<
    Pick<
      React.ComponentProps<typeof DateInput>,
      "color" | "size" | "variant" | "radius"
    >
  > = {
    ...(common.color !== undefined
      ? {
          color: common.color as React.ComponentProps<
            typeof DateInput
          >["color"],
        }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as React.ComponentProps<typeof DateInput>["size"] }
      : {}),
    ...(common.variant !== undefined
      ? {
          variant: common.variant as React.ComponentProps<
            typeof DateInput
          >["variant"],
        }
      : {}),
    ...(common.radius !== undefined
      ? {
          radius: common.radius as React.ComponentProps<
            typeof DateInput
          >["radius"],
        }
      : {}),
  };

  const commonSlider: Partial<
    Pick<React.ComponentProps<typeof Slider>, "color" | "size">
  > = {
    ...(common.color !== undefined
      ? { color: common.color as React.ComponentProps<typeof Slider>["color"] }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as React.ComponentProps<typeof Slider>["size"] }
      : {}),
  };

  const commonSwitch: Partial<
    Pick<React.ComponentProps<typeof Switch>, "color" | "size">
  > = {
    ...(common.color !== undefined
      ? { color: common.color as React.ComponentProps<typeof Switch>["color"] }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as React.ComponentProps<typeof Switch>["size"] }
      : {}),
  };

  const commonButton: Partial<
    Pick<React.ComponentProps<typeof Button>, "color" | "size">
  > = {
    ...(common.color !== undefined
      ? { color: common.color as React.ComponentProps<typeof Button>["color"] }
      : {}),
    ...(common.size !== undefined
      ? { size: common.size as React.ComponentProps<typeof Button>["size"] }
      : {}),
  };

  return {
    checkbox: { ...commonCheckbox, ...(cfg.checkbox ?? {}) },
    dateInput: { ...commonDateInput, ...(cfg.dateInput ?? {}) },
    input: { ...commonInput, ...(cfg.input ?? {}) },
    radioGroup: { ...commonRadioGroup, ...(cfg.radioGroup ?? {}) },
    select: { ...commonSelect, ...(cfg.select ?? {}) },
    slider: { ...commonSlider, ...(cfg.slider ?? {}) },
    submitButton: { ...commonButton, ...(cfg.submitButton ?? {}) },
    switch: { ...commonSwitch, ...(cfg.switch ?? {}) },
    textarea: { ...commonTextarea, ...(cfg.textarea ?? {}) },
  };
}
