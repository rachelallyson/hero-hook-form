# Configuration

Learn about global configuration, providers, and customization options.

## Overview

Hero Hook Form provides a powerful configuration system that allows you to set global defaults for all form components. This ensures consistency across your application while still allowing per-instance customization.

## HeroHookFormProvider

The main configuration provider that wraps your application and sets global defaults.

### Basic Setup

```tsx
import { HeroHookFormProvider } from "@rachelallyson/hero-hook-form";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HeroHookFormProvider
      defaults={{
        common: {
          color: "primary",
          size: "md",
          variant: "faded",
          radius: "sm",
          labelPlacement: "outside",
        },
        input: { variant: "underlined" },
        select: { variant: "flat" },
        submitButton: { color: "secondary" },
      }}
    >
      {children}
    </HeroHookFormProvider>
  );
}
```

### Configuration Structure

The `defaults` object supports the following structure:

```tsx
interface HeroHookFormDefaultsConfig {
  common?: CommonFieldDefaults;
  input?: InputDefaults;
  textarea?: TextareaDefaults;
  checkbox?: CheckboxDefaults;
  radioGroup?: RadioGroupDefaults;
  select?: SelectDefaults;
  switch?: SwitchDefaults;
  submitButton?: ButtonDefaults;
}
```

### Common Defaults

The `common` section applies to all text-like controls (Input, Textarea, Select) and is safely narrowed for toggles and buttons.

```tsx
type CommonFieldDefaults = Partial<{
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size: "sm" | "md" | "lg";
  variant: "flat" | "bordered" | "faded" | "underlined";
  radius: "none" | "sm" | "md" | "lg" | "full";
  labelPlacement: "inside" | "outside" | "outside-left";
}>;
```

### Component-Specific Defaults

Each component can have its own specific defaults that override the common settings:

```tsx
const componentDefaults = {
  input: {
    variant: "underlined",
    color: "primary",
    size: "md",
  },
  textarea: {
    variant: "bordered",
    color: "primary",
    size: "md",
  },
  select: {
    variant: "flat",
    color: "secondary",
    size: "md",
  },
  checkbox: {
    color: "primary",
    size: "md",
    radius: "sm",
  },
  radioGroup: {
    color: "primary",
    size: "md",
    orientation: "vertical",
  },
  switch: {
    color: "success",
    size: "md",
    radius: "full",
  },
  submitButton: {
    color: "primary",
    size: "md",
    variant: "solid",
  },
};
```

## Precedence Rules

Configuration follows a specific precedence order (highest to lowest):

1. **Per-instance props** (e.g., `inputProps`, `selectProps`)
2. **Component-specific defaults** (e.g., `defaults.input`)
3. **Common defaults** (e.g., `defaults.common`)

### Example Precedence

```tsx
<HeroHookFormProvider
  defaults={{
    common: { color: "primary", size: "md" },
    input: { color: "secondary" },
  }}
>
  <InputField
    control={methods.control}
    name="email"
    inputProps={{ color: "danger" }} // ✅ Wins - per-instance
  />
</HeroHookFormProvider>
```

## Advanced Configuration

### Scoped Configuration

You can nest providers to create different configurations for specific sections of your app:

```tsx
function App() {
  return (
    <HeroHookFormProvider
      defaults={{
        common: { color: "primary", size: "md" },
        input: { variant: "bordered" },
      }}
    >
      <Header />
      <MainContent />
      
      {/* Different config for sidebar forms */}
      <HeroHookFormProvider
        defaults={{
          common: { color: "secondary", size: "sm" },
          input: { variant: "flat" },
        }}
      >
        <Sidebar />
      </HeroHookFormProvider>
    </HeroHookFormProvider>
  );
}
```

### Dynamic Configuration

You can update configuration dynamically based on user preferences or theme changes:

```tsx
function App({ theme }: { theme: "light" | "dark" }) {
  const config = useMemo(() => ({
    common: {
      color: theme === "dark" ? "secondary" : "primary",
      variant: theme === "dark" ? "flat" : "bordered",
    },
    input: {
      variant: theme === "dark" ? "flat" : "underlined",
    },
  }), [theme]);

  return (
    <HeroHookFormProvider defaults={config}>
      {children}
    </HeroHookFormProvider>
  );
}
```

## Integration with HeroUI

### Complete Setup Example

Here's a complete setup that integrates with HeroUI's theming system:

```tsx
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "next-themes";
import { HeroHookFormProvider } from "@rachelallyson/hero-hook-form";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <HeroHookFormProvider
          defaults={{
            common: {
              color: "primary",
              size: "md",
              variant: "faded",
              radius: "sm",
              labelPlacement: "outside",
            },
            input: { 
              variant: "underlined",
              color: "primary",
            },
            textarea: { 
              variant: "bordered",
              color: "primary",
            },
            select: { 
              variant: "flat",
              color: "secondary",
            },
            radioGroup: { 
              color: "primary",
              orientation: "vertical",
            },
            checkbox: { 
              color: "primary",
              radius: "sm",
            },
            switch: { 
              color: "success",
              radius: "full",
            },
            submitButton: { 
              color: "primary",
              variant: "solid",
            },
          }}
        >
          {children}
        </HeroHookFormProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
```

## Best Practices

### 1. Use Common Defaults for Consistency

Set common defaults for properties that should be consistent across all components:

```tsx
const defaults = {
  common: {
    color: "primary",
    size: "md",
    radius: "sm",
  },
  // Component-specific overrides only when needed
  input: { variant: "underlined" },
  select: { variant: "flat" },
};
```

### 2. Leverage Component-Specific Overrides

Use component-specific defaults to create distinct visual hierarchies:

```tsx
const defaults = {
  common: { color: "primary", size: "md" },
  input: { variant: "underlined" },
  select: { variant: "bordered" },
  submitButton: { color: "secondary", size: "lg" },
};
```

### 3. Keep Per-Instance Props Minimal

Reserve per-instance props for truly unique cases:

```tsx
// ✅ Good - uses global defaults
<InputField control={methods.control} name="email" label="Email" />

// ✅ Good - overrides only when necessary
<InputField 
  control={methods.control} 
  name="password" 
  label="Password"
  inputProps={{ type: "password" }}
/>

// ❌ Avoid - overrides everything
<InputField 
  control={methods.control} 
  name="email" 
  label="Email"
  inputProps={{ 
    color: "primary",
    size: "md",
    variant: "underlined",
    radius: "sm"
  }}
/>
```

### 4. Use Scoped Configuration for Different Contexts

Create different configurations for different parts of your application:

```tsx
// Main app forms
<HeroHookFormProvider defaults={mainFormDefaults}>
  <MainContent />
</HeroHookFormProvider>

// Compact sidebar forms
<HeroHookFormProvider defaults={compactFormDefaults}>
  <Sidebar />
</HeroHookFormProvider>
```

## Troubleshooting

### Configuration Not Applied

If your configuration isn't being applied, check:

1. **Provider placement**: Ensure `HeroHookFormProvider` wraps your components
2. **Precedence**: Per-instance props override global defaults
3. **Import path**: Use the correct import path for your setup

### TypeScript Errors

If you encounter TypeScript errors:

```tsx
// ✅ Correct - use proper typing
<HeroHookFormProvider
  defaults={{
    common: { color: "primary" as const },
    input: { variant: "underlined" as const },
  }}
>

// ✅ Alternative - let TypeScript infer
const defaults = {
  common: { color: "primary" },
  input: { variant: "underlined" },
} as const;

<HeroHookFormProvider defaults={defaults}>
```

## Type Definitions

### HeroHookFormDefaultsConfig

```tsx
interface HeroHookFormDefaultsConfig {
  common?: CommonFieldDefaults;
  input?: InputDefaults;
  textarea?: TextareaDefaults;
  checkbox?: CheckboxDefaults;
  radioGroup?: RadioGroupDefaults;
  select?: SelectDefaults;
  switch?: SwitchDefaults;
  submitButton?: ButtonDefaults;
}
```

### CommonFieldDefaults

```tsx
type CommonFieldDefaults = Partial<{
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size: "sm" | "md" | "lg";
  variant: "flat" | "bordered" | "faded" | "underlined";
  radius: "none" | "sm" | "md" | "lg" | "full";
  labelPlacement: "inside" | "outside" | "outside-left";
}>;
```

### InputDefaults

```tsx
type InputDefaults = Partial<
  Omit<
    ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;
```

### TextareaDefaults

```tsx
type TextareaDefaults = Partial<
  Omit<
    ComponentProps<typeof Textarea>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;
```

### CheckboxDefaults

```tsx
type CheckboxDefaults = Partial<
  Omit<
    ComponentProps<typeof Checkbox>,
    "isSelected" | "onValueChange" | "isInvalid" | "errorMessage" | "isDisabled"
  >
>;
```

### RadioGroupDefaults

```tsx
type RadioGroupDefaults = Partial<
  Omit<
    ComponentProps<typeof RadioGroup>,
    "value" | "onValueChange" | "label"
  >
>;
```

### SelectDefaults

```tsx
type SelectDefaults = Partial<
  Omit<
    ComponentProps<typeof Select>,
    | "selectedKeys"
    | "onSelectionChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >
>;
```

### SwitchDefaults

```tsx
type SwitchDefaults = Partial<
  Omit<
    ComponentProps<typeof Switch>,
    "isSelected" | "onValueChange" | "isInvalid" | "isDisabled"
  >
>;
```

### ButtonDefaults

```tsx
type ButtonDefaults = Partial<
  Omit<ComponentProps<typeof Button>, "type" | "isLoading">
>;
```

## Examples

For complete configuration examples, see:

- [Getting Started](./getting-started.md) - Basic setup
- [Components](./components.md) - Component-specific configuration
- [Form Builder](./form-builder.md) - ConfigurableForm configuration

## Next Steps

- [Components](./components.md) - Learn about individual components
- [Form Builder](./form-builder.md) - Master the ConfigurableForm component
- [Validation](./validation.md) - Implement form validation
- [Layouts](./layouts.md) - Design form layouts
