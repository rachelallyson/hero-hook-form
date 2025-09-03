# Components

Learn about the individual field components available in Hero Hook Form.

## Overview

Hero Hook Form provides a comprehensive set of form field components that integrate seamlessly with React Hook Form and HeroUI. Each component follows a consistent API pattern and supports full customization through props.

## Field Components

### InputField

A versatile text input component supporting various input types.

```tsx
import { InputField } from "@rachelallyson/hero-hook-form";

<InputField
  control={control}
  name="email"
  label="Email Address"
  description="We'll never share your email"
  inputProps={{
    type: "email",
    placeholder: "john@example.com",
    startContent: <MailIcon />,
  }}
  rules={{
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  }}
/>
```

### TextareaField

A multi-line text input component for longer content.

```tsx
import { TextareaField } from "@rachelallyson/hero-hook-form";

<TextareaField
  control={control}
  name="message"
  label="Message"
  description="Tell us about your project"
  textareaProps={{
    placeholder: "Share your story...",
    minRows: 3,
    maxRows: 6,
    variant: "bordered",
  }}
  rules={{ required: "Message is required" }}
/>
```

### SelectField

A dropdown selection component with customizable options.

```tsx
import { SelectField } from "@rachelallyson/hero-hook-form";

<SelectField
  control={control}
  name="country"
  label="Country"
  description="Select your country"
  options={[
    { label: "Select a country", value: "" },
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
  ]}
  selectProps={{
    placeholder: "Choose your country",
    variant: "bordered",
  }}
  rules={{ required: "Country is required" }}
/>
```

### CheckboxField

A checkbox component for boolean values.

```tsx
import { CheckboxField } from "@rachelallyson/hero-hook-form";

<CheckboxField
  control={control}
  name="newsletter"
  label="Subscribe to Newsletter"
  description="Receive updates about new features"
  checkboxProps={{
    color: "primary",
  }}
  defaultValue={false}
/>
```

### SwitchField

A toggle switch component for boolean values.

```tsx
import { SwitchField } from "@rachelallyson/hero-hook-form";

<SwitchField
  control={control}
  name="notifications"
  label="Enable Notifications"
  description="Receive push notifications"
  switchProps={{
    color: "primary",
  }}
  defaultValue={true}
/>
```

### RadioGroupField

A radio button group component for single selection.

```tsx
import { RadioGroupField } from "@rachelallyson/hero-hook-form";

<RadioGroupField
  control={control}
  name="theme"
  label="Theme Preference"
  description="Choose your preferred theme"
  options={[
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ]}
  radioGroupProps={{
    color: "primary",
  }}
  defaultValue="system"
/>
```

### SliderField

A slider component for numeric values within a range.

```tsx
import { SliderField } from "@rachelallyson/hero-hook-form";

<SliderField
  control={control}
  name="volume"
  label="Volume Level"
  description="Adjust the volume"
  sliderProps={{
    minValue: 0,
    maxValue: 100,
    step: 1,
    color: "primary",
  }}
  defaultValue={50}
/>
```

### DateField

A date input component with date picker functionality.

```tsx
import { DateField } from "@rachelallyson/hero-hook-form";
import { CalendarDate } from "@internationalized/date";

<DateField
  control={control}
  name="birthDate"
  label="Date of Birth"
  description="Select your birth date"
  dateProps={{
    variant: "bordered",
  }}
  rules={{ required: "Date of birth is required" }}
/>

// With default value
<DateField
  control={control}
  name="birthDate"
  label="Date of Birth"
  defaultValue={new CalendarDate(1990, 1, 1)}
/>
```

### FileField

A file upload component supporting single and multiple files.

```tsx
import { FileField } from "@rachelallyson/hero-hook-form";

<FileField
  control={control}
  name="avatar"
  label="Profile Picture"
  description="Upload your profile picture"
  fileProps={{
    variant: "bordered",
  }}
  multiple={false}
  accept="image/*"
  rules={{ required: "Profile picture is required" }}
/>
```

## Common Props

All field components share these common props:

### FieldBaseProps

```tsx
interface FieldBaseProps<TFieldValues extends FieldValues, TValue> {
  name: Path<TFieldValues>;           // Field name in form data
  label?: string;                     // Field label
  description?: string;               // Field description/help text
  className?: string;                 // Custom CSS class
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>; // Validation rules
  defaultValue?: TValue;              // Default field value
  isDisabled?: boolean;               // Disable the field
}
```

### WithControl

```tsx
interface WithControl<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;     // React Hook Form control
}
```

## Component-Specific Props

### InputField

```tsx
interface InputFieldProps<TFieldValues extends FieldValues> {
  inputProps?: Omit<
    React.ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
  transform?: (value: string) => string;
}
```

### TextareaField

```tsx
interface TextareaFieldProps<TFieldValues extends FieldValues> {
  textareaProps?: Omit<
    React.ComponentProps<typeof Textarea>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
  transform?: (value: string) => string;
}
```

### SelectField

```tsx
interface SelectFieldProps<TFieldValues extends FieldValues> {
  options: readonly SelectOption<TValue>[];
  placeholder?: string;
  selectProps?: Omit<
    React.ComponentProps<typeof Select>,
    | "selectedKeys"
    | "onSelectionChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
}
```

### CheckboxField

```tsx
interface CheckboxFieldProps<TFieldValues extends FieldValues> {
  checkboxProps?: Omit<
    React.ComponentProps<typeof Checkbox>,
    "isSelected" | "onValueChange" | "isInvalid" | "errorMessage" | "isDisabled"
  >;
  transform?: (value: boolean) => boolean;
}
```

### SwitchField

```tsx
interface SwitchFieldProps<TFieldValues extends FieldValues> {
  switchProps?: Omit<
    React.ComponentProps<typeof Switch>,
    "isSelected" | "onValueChange" | "isInvalid" | "isDisabled"
  >;
  transform?: (value: boolean) => boolean;
}
```

### RadioGroupField

```tsx
interface RadioGroupFieldProps<TFieldValues extends FieldValues> {
  options: readonly RadioOption<TValue>[];
  radioGroupProps?: Omit<
    React.ComponentProps<typeof RadioGroup>,
    "value" | "onValueChange" | "label"
  >;
}
```

### SliderField

```tsx
interface SliderFieldProps<TFieldValues extends FieldValues> {
  sliderProps?: Omit<
    React.ComponentProps<typeof Slider>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
  transform?: (value: number) => number;
}
```

### DateField

```tsx
interface DateFieldProps<TFieldValues extends FieldValues> {
  dateProps?: Omit<
    React.ComponentProps<typeof DateInput>,
    | "value"
    | "onChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
  >;
  transform?: (value: CalendarDate | null) => CalendarDate | null;
}
```

### FileField

```tsx
interface FileFieldProps<TFieldValues extends FieldValues> {
  fileProps?: Omit<
    React.ComponentProps<typeof Input>,
    | "value"
    | "onValueChange"
    | "label"
    | "isInvalid"
    | "errorMessage"
    | "isDisabled"
    | "type"
  >;
  transform?: (value: FileList | null) => FileList | null;
  multiple?: boolean;
  accept?: string;
}
```

## Usage Examples

### Basic Form

```tsx
import { useForm } from "react-hook-form";
import {
  InputField,
  TextareaField,
  SelectField,
  CheckboxField,
} from "@rachelallyson/hero-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  newsletter: boolean;
}

function ContactForm() {
  const { control, handleSubmit } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        control={control}
        name="name"
        label="Full Name"
        rules={{ required: "Name is required" }}
      />
      
      <InputField
        control={control}
        name="email"
        label="Email Address"
        inputProps={{ type: "email" }}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
      />
      
      <TextareaField
        control={control}
        name="message"
        label="Message"
        rules={{ required: "Message is required" }}
      />
      
      <CheckboxField
        control={control}
        name="newsletter"
        label="Subscribe to Newsletter"
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Advanced Form with New Field Types

```tsx
import { useForm } from "react-hook-form";
import {
  SliderField,
  DateField,
  FileField,
} from "@rachelallyson/hero-hook-form";
import { CalendarDate } from "@internationalized/date";

interface AdvancedFormData {
  volume: number;
  birthDate: CalendarDate | null;
  avatar: FileList | null;
}

function AdvancedForm() {
  const { control, handleSubmit } = useForm<AdvancedFormData>();

  const onSubmit = (data: AdvancedFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SliderField
        control={control}
        name="volume"
        label="Volume Level"
        description="Adjust the volume"
        sliderProps={{
          minValue: 0,
          maxValue: 100,
          step: 1,
          color: "primary",
        }}
        defaultValue={50}
      />
      
      <DateField
        control={control}
        name="birthDate"
        label="Date of Birth"
        description="Select your birth date"
        rules={{ required: "Date of birth is required" }}
      />
      
      <FileField
        control={control}
        name="avatar"
        label="Profile Picture"
        description="Upload your profile picture"
        multiple={false}
        accept="image/*"
        rules={{ required: "Profile picture is required" }}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Best Practices

### 1. Use Appropriate Field Types

Choose the right field type for your data:

- Use `InputField` for text, email, password, etc.
- Use `TextareaField` for longer text content
- Use `SelectField` for predefined options
- Use `CheckboxField` or `SwitchField` for boolean values
- Use `RadioGroupField` for single selection from options
- Use `SliderField` for numeric ranges
- Use `DateField` for date selection
- Use `FileField` for file uploads

### 2. Provide Meaningful Labels and Descriptions

```tsx
<InputField
  control={control}
  name="email"
  label="Email Address"
  description="We'll use this to send you important updates"
  inputProps={{ type: "email" }}
/>
```

### 3. Use Validation Rules

```tsx
<InputField
  control={control}
  name="password"
  label="Password"
  inputProps={{ type: "password" }}
  rules={{
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    validate: {
      hasUpperCase: (value) =>
        /[A-Z]/.test(value) || "Password must contain uppercase letter",
    },
  }}
/>
```

### 4. Leverage Transform Functions

```tsx
<InputField
  control={control}
  name="phone"
  label="Phone Number"
  transform={(value) => value.replace(/\D/g, "")} // Remove non-digits
/>
```

### 5. Use Default Values

```tsx
<SelectField
  control={control}
  name="country"
  label="Country"
  options={countryOptions}
  defaultValue="us"
/>
```

## Next Steps

- [Form Builder](./form-builder.md) - Learn about the ConfigurableForm component
- [Validation](./validation.md) - Implement comprehensive validation
- [Configuration](./configuration.md) - Set up global defaults
- [Layouts](./layouts.md) - Design beautiful form layouts
