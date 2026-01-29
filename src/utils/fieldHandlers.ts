import type { ControllerRenderProps } from "react-hook-form";

/**
 * Creates a wrapped blur handler that calls both user handler and form handler
 */
export function createBlurHandler<TElement extends Element = HTMLInputElement>(
  userHandler?: (e: React.FocusEvent<TElement>) => void,
  formHandler?: () => void,
): (e: React.FocusEvent<TElement>) => void {
  return (e: React.FocusEvent<TElement>) => {
    // Call user's handler first (if provided)
    if (userHandler) {
      userHandler(e);
    }
    // Always call form's onBlur
    if (formHandler) {
      formHandler();
    }
  };
}

/**
 * Creates a wrapped value change handler that calls both user handler and form handler
 */
export function createValueChangeHandler<TValue = string>(
  userHandler?: (value: TValue) => void,
  formHandler?: (value: TValue) => void,
): (value: TValue) => void {
  return (value: TValue) => {
    // Call user's handler first (if provided)
    if (userHandler) {
      userHandler(value);
    }
    // Always update form state
    if (formHandler) {
      formHandler(value);
    }
  };
}

/**
 * Creates a wrapped selection change handler that calls both user handler and form handler
 */
export function createSelectionChangeHandler<TValue = string | number>(
  userHandler?: (keys: Iterable<TValue>) => void,
  formHandler?: (value: TValue) => void,
  extractValue?: (keys: Iterable<TValue>) => TValue,
): (keys: Iterable<TValue>) => void {
  return (keys: Iterable<TValue>) => {
    // Call user's handler first (if provided)
    if (userHandler) {
      userHandler(keys);
    }
    // Always update form state
    if (formHandler && extractValue) {
      const value = extractValue(keys);

      formHandler(value);
    }
  };
}

/**
 * Extracts handlers from props and returns cleaned props without handlers
 */
export function extractHandlers<T extends Record<string, any>>(
  props: T | undefined,
  handlerKeys: (keyof T)[],
): {
  handlers: Partial<Pick<T, keyof T>>;
  restProps: Omit<T, keyof T>;
} {
  if (!props) {
    return { handlers: {}, restProps: {} as Omit<T, keyof T> };
  }

  const handlers: Partial<Pick<T, keyof T>> = {};
  const restProps = { ...props };

  for (const key of handlerKeys) {
    if (key in props) {
      handlers[key] = props[key];

      delete restProps[key];
    }
  }

  return { handlers, restProps };
}

/** Optional field-level label and disabled for merge with *Props overrides */
export interface FieldLevel {
  label?: string;
  isDisabled?: boolean;
}

function mergeLabelAndDisabledFromRest(
  restProps: { label?: React.ReactNode; isDisabled?: boolean } | undefined,
  fieldLevel: FieldLevel | undefined,
): {
  label: React.ReactNode | undefined;
  isDisabled: boolean | undefined;
} {
  return {
    isDisabled: restProps?.isDisabled ?? fieldLevel?.isDisabled,
    label: restProps?.label ?? fieldLevel?.label,
  };
}

/**
 * Merges label and isDisabled from restProps (user overrides) with field-level values.
 * Use when passing through *Props so that field-level label/disabled can be overridden per-instance.
 * Accepts ReactNode for label since HeroUI components allow it.
 */
export function mergeLabelAndDisabled(
  restProps: { label?: React.ReactNode; isDisabled?: boolean } | undefined,
  fieldLevel: FieldLevel,
): { label: React.ReactNode | undefined; isDisabled: boolean | undefined } {
  return mergeLabelAndDisabledFromRest(restProps, fieldLevel);
}

/**
 * Helper to create wrapped handlers for a field with onBlur and onValueChange.
 * Optionally pass fieldLevel; merged label and isDisabled are applied into restProps.
 */
export function createFieldHandlers<
  TValue = string,
  TElement extends Element = HTMLInputElement,
  TProps extends {
    onBlur?: (e: React.FocusEvent<TElement>) => void;
    onValueChange?: (value: TValue) => void;
  } = {
    onBlur?: (e: React.FocusEvent<TElement>) => void;
    onValueChange?: (value: TValue) => void;
  },
>(
  props: TProps | undefined,
  field: ControllerRenderProps<any, any>,
  fieldLevel?: FieldLevel,
) {
  const handleBlur = createBlurHandler<TElement>(props?.onBlur, field.onBlur);
  const handleValueChange = createValueChangeHandler(
    props?.onValueChange,
    field.onChange,
  );

  const { restProps } = extractHandlers(props, ["onBlur", "onValueChange"]);
  const typedRest = restProps as Omit<TProps, "onBlur" | "onValueChange"> & {
    label?: React.ReactNode;
    isDisabled?: boolean;
  };
  const merged = mergeLabelAndDisabledFromRest(typedRest, fieldLevel);

  return {
    ...typedRest,
    ...merged,
    onBlur: handleBlur,
    onValueChange: handleValueChange,
  };
}

/**
 * Helper to create wrapped handlers for a field with onBlur and onChange (for DateInput).
 * Optionally pass fieldLevel; merged label and isDisabled are applied into restProps.
 */
export function createDateFieldHandlers<
  TElement extends Element = HTMLInputElement,
  TProps extends {
    onBlur?: (e: React.FocusEvent<TElement>) => void;
    onChange?: (value: any) => void;
  } = {
    onBlur?: (e: React.FocusEvent<TElement>) => void;
    onChange?: (value: any) => void;
  },
>(
  props: TProps | undefined,
  field: ControllerRenderProps<any, any>,
  fieldLevel?: FieldLevel,
) {
  const handleBlur = createBlurHandler<TElement>(props?.onBlur, field.onBlur);
  const handleChange = createValueChangeHandler(
    props?.onChange,
    field.onChange,
  );

  const { restProps } = extractHandlers(props, ["onBlur", "onChange"]);
  const typedRest = restProps as Omit<TProps, "onBlur" | "onChange"> & {
    label?: React.ReactNode;
    isDisabled?: boolean;
  };
  const merged = mergeLabelAndDisabledFromRest(typedRest, fieldLevel);

  return {
    ...typedRest,
    ...merged,
    onBlur: handleBlur,
    onChange: handleChange,
  };
}

/**
 * Helper to create wrapped handlers for a field with onBlur and onValueChange (for Slider).
 * Optionally pass fieldLevel; merged label and isDisabled are applied into restProps.
 */
export function createSliderFieldHandlers<
  TProps extends {
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onValueChange?: (value: number) => void;
  } = {
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onValueChange?: (value: number) => void;
  },
>(
  props: TProps | undefined,
  field: ControllerRenderProps<any, any>,
  fieldLevel?: FieldLevel,
) {
  const handleBlur = createBlurHandler(props?.onBlur, field.onBlur);
  const handleValueChange = createValueChangeHandler(
    props?.onValueChange,
    field.onChange,
  );

  const { restProps } = extractHandlers(props, ["onBlur", "onValueChange"]);
  const typedRest = restProps as Omit<TProps, "onBlur" | "onValueChange"> & {
    label?: React.ReactNode;
    isDisabled?: boolean;
  };
  const merged = mergeLabelAndDisabledFromRest(typedRest, fieldLevel);

  return {
    ...typedRest,
    ...merged,
    onBlur: handleBlur,
    onValueChange: handleValueChange,
  };
}

/**
 * Helper to create wrapped handlers for SelectField with onSelectionChange.
 * Optionally pass fieldLevel; merged label and isDisabled are applied into restProps.
 */
export function createSelectFieldHandlers<
  TValue extends string | number,
  TProps extends { onSelectionChange?: (keys: Iterable<TValue>) => void } = {
    onSelectionChange?: (keys: Iterable<TValue>) => void;
  },
>(
  props: TProps | undefined,
  field: ControllerRenderProps<any, any>,
  fieldLevel?: FieldLevel,
) {
  const handleSelectionChange = createSelectionChangeHandler(
    props?.onSelectionChange,
    field.onChange,
    (keys: Iterable<TValue>) => {
      const keyArray = Array.from(keys);

      return (keyArray[0] as TValue | undefined) ?? ("" as TValue);
    },
  );

  const { restProps } = extractHandlers(props, ["onSelectionChange"]);
  const typedRest = restProps as Omit<TProps, "onSelectionChange"> & {
    label?: React.ReactNode;
    isDisabled?: boolean;
  };
  const merged = mergeLabelAndDisabledFromRest(typedRest, fieldLevel);

  return {
    ...typedRest,
    ...merged,
    onSelectionChange: handleSelectionChange,
  };
}

/**
 * Helper to create wrapped handlers for FileField with native onChange.
 * Optionally pass fieldLevel; merged label and isDisabled are applied into restProps.
 */
export function createFileFieldHandlers<
  TProps extends {
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  } = {
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  },
>(
  props: TProps | undefined,
  field: ControllerRenderProps<any, any>,
  transform?: (files: FileList | null) => FileList | null,
  fieldLevel?: FieldLevel,
) {
  const handleBlur = createBlurHandler(props?.onBlur, field.onBlur);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call user's handler first (if provided)
    if (props?.onChange) {
      props.onChange(e);
    }

    // Always update form state
    if (e.target instanceof HTMLInputElement) {
      const files = e.target.files;
      const transformedFiles = transform ? transform(files) : files;

      field.onChange(transformedFiles);
    }
  };

  const { restProps } = extractHandlers(props, ["onBlur", "onChange"]);
  const typedRest = restProps as Omit<TProps, "onBlur" | "onChange"> & {
    label?: React.ReactNode;
    isDisabled?: boolean;
  };
  const merged = mergeLabelAndDisabledFromRest(typedRest, fieldLevel);

  return {
    ...typedRest,
    ...merged,
    onBlur: handleBlur,
    onChange: handleChange,
  };
}

/**
 * Helper to create wrapped handlers for AutocompleteField with onSelectionChange and onInputChange.
 * Optionally pass fieldLevel; merged label and isDisabled are applied into the returned object.
 * When allowsCustomValue is true, onInputChange also updates form state as the user types.
 */
export function createAutocompleteFieldHandlers<
  TValue = string | number,
  TProps extends {
    onInputChange?: (value: string) => void;
    onSelectionChange?: (key: string | number | null) => void;
  } = {
    onInputChange?: (value: string) => void;
    onSelectionChange?: (key: string | number | null) => void;
  },
>(
  props: TProps | undefined,
  field: ControllerRenderProps<any, any>,
  fieldLevel?: FieldLevel,
  options?: { allowsCustomValue?: boolean },
) {
  const allowsCustomValue = options?.allowsCustomValue ?? false;

  const handleSelectionChange = (key: string | number | null) => {
    const next = (key as TValue | undefined) ?? ("" as TValue);
    if (props?.onSelectionChange) {
      props.onSelectionChange(key);
    }
    field.onChange(next);
  };

  const handleInputChange = (value: string | number | null) => {
    const strValue = value != null ? String(value) : "";
    if (props?.onInputChange) {
      props.onInputChange(strValue);
    }
    if (allowsCustomValue) {
      field.onChange(strValue as TValue);
    }
  };

  const { restProps } = extractHandlers(props, [
    "onInputChange",
    "onSelectionChange",
  ]);
  const typedRest = restProps as Omit<TProps, "onInputChange" | "onSelectionChange"> & {
    label?: React.ReactNode;
    isDisabled?: boolean;
  };
  const merged = mergeLabelAndDisabledFromRest(typedRest, fieldLevel);

  return {
    ...typedRest,
    ...merged,
    onInputChange: handleInputChange,
    onSelectionChange: handleSelectionChange,
  };
}

/**
 * Helper to create wrapped handlers for FontPickerField with onSelectionChange.
 * Optionally pass fieldLevel; merged label and isDisabled are applied into restProps.
 */
export function createFontPickerFieldHandlers<
  TProps extends { onSelectionChange?: (value: string) => void } = {
    onSelectionChange?: (value: string) => void;
  },
>(
  props: TProps | undefined,
  field: ControllerRenderProps<any, any>,
  fieldLevel?: FieldLevel,
) {
  const handleSelectionChange = createValueChangeHandler(
    props?.onSelectionChange,
    field.onChange,
  );

  const { restProps } = extractHandlers(props, ["onSelectionChange"]);
  const typedRest = restProps as Omit<TProps, "onSelectionChange"> & {
    label?: React.ReactNode;
    isDisabled?: boolean;
  };
  const merged = mergeLabelAndDisabledFromRest(typedRest, fieldLevel);

  return {
    ...typedRest,
    ...merged,
    onSelectionChange: handleSelectionChange,
  };
}
