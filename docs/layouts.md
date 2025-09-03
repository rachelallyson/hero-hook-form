# Layouts

Explore different form layouts: vertical, horizontal, and grid configurations.

## Overview

Hero Hook Form provides flexible layout options to create beautiful, responsive forms that adapt to different screen sizes and design requirements. The `ConfigurableForm` component supports three main layout types: vertical, horizontal, and grid.

## Layout Types

### Vertical Layout (Default)

The vertical layout stacks all fields in a single column, making it ideal for mobile-first designs and forms with fewer fields.

```tsx
<ConfigurableForm
  title="Contact Form"
  subtitle="We'd love to hear from you"
  fields={fields}
  onSubmit={handleSubmit}
  layout="vertical"
  spacing="md"
/>
```

**Best for:**

- Mobile-first designs
- Forms with 3-5 fields
- Simple contact forms
- Login/registration forms

**Example:**

```tsx
const contactFields = [
  {
    name: "name",
    type: "input",
    label: "Full Name",
    rules: { required: "Name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: { required: "Email is required" },
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    rules: { required: "Message is required" },
  },
];
```

### Horizontal Layout

The horizontal layout creates a two-column grid on desktop screens, with fields stacking vertically on mobile devices.

```tsx
<ConfigurableForm
  title="Registration Form"
  subtitle="Create your account"
  fields={fields}
  onSubmit={handleSubmit}
  layout="horizontal"
  spacing="md"
/>
```

**Best for:**

- Registration forms
- User profile forms
- Forms with 6-10 fields
- Desktop-focused applications

**Example:**

```tsx
const registrationFields = [
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    rules: { required: "First name is required" },
  },
  {
    name: "lastName",
    type: "input",
    label: "Last Name",
    rules: { required: "Last name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: { required: "Email is required" },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone Number",
    inputProps: { type: "tel" },
  },
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: { type: "password" },
    rules: { required: "Password is required" },
  },
  {
    name: "confirmPassword",
    type: "input",
    label: "Confirm Password",
    inputProps: { type: "password" },
    rules: { required: "Please confirm your password" },
  },
];
```

### Grid Layout

The grid layout provides the most flexibility, allowing you to specify 1, 2, or 3 columns for different screen sizes.

```tsx
<ConfigurableForm
  title="User Profile"
  subtitle="Update your information"
  fields={fields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={2}
  spacing="lg"
/>
```

**Best for:**

- Complex forms with many fields
- Dashboard settings
- Admin panels
- Data entry forms

#### Two-Column Grid

```tsx
<ConfigurableForm
  title="User Profile"
  fields={fields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={2}
  spacing="md"
/>
```

#### Three-Column Grid

```tsx
<ConfigurableForm
  title="Advanced Settings"
  fields={fields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={3}
  spacing="lg"
/>
```

## Spacing Options

Control the spacing between form fields with the `spacing` prop:

```tsx
// Small spacing
<ConfigurableForm spacing="sm" />

// Medium spacing (default)
<ConfigurableForm spacing="md" />

// Large spacing
<ConfigurableForm spacing="lg" />

// Extra large spacing
<ConfigurableForm spacing="xl" />
```

## Responsive Behavior

All layouts are fully responsive and adapt to different screen sizes:

### Vertical Layout

- **Mobile**: Single column
- **Tablet**: Single column
- **Desktop**: Single column

### Horizontal Layout

- **Mobile**: Single column (stacked)
- **Tablet**: Single column (stacked)
- **Desktop**: Two columns

### Grid Layout

- **Mobile**: Single column (stacked)
- **Tablet**: Two columns (if columns >= 2)
- **Desktop**: Full grid (1, 2, or 3 columns as specified)

## Layout Examples

### Contact Form (Vertical)

```tsx
const contactFields = [
  {
    name: "name",
    type: "input",
    label: "Full Name",
    rules: { required: "Name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: { required: "Email is required" },
  },
  {
    name: "subject",
    type: "select",
    label: "Subject",
    options: [
      { label: "General Inquiry", value: "general" },
      { label: "Support", value: "support" },
      { label: "Feature Request", value: "feature" },
    ],
    rules: { required: "Subject is required" },
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    rules: { required: "Message is required" },
  },
];

<ConfigurableForm
  title="Contact Us"
  subtitle="We'd love to hear from you"
  fields={contactFields}
  onSubmit={handleSubmit}
  layout="vertical"
  spacing="md"
  showResetButton={true}
/>
```

### Registration Form (Horizontal)

```tsx
const registrationFields = [
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    rules: { required: "First name is required" },
  },
  {
    name: "lastName",
    type: "input",
    label: "Last Name",
    rules: { required: "Last name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: { required: "Email is required" },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone Number",
    inputProps: { type: "tel" },
  },
  {
    name: "password",
    type: "input",
    label: "Password",
    inputProps: { type: "password" },
    rules: { required: "Password is required" },
  },
  {
    name: "confirmPassword",
    type: "input",
    label: "Confirm Password",
    inputProps: { type: "password" },
    rules: { required: "Please confirm your password" },
  },
  {
    name: "agreeToTerms",
    type: "checkbox",
    label: "I agree to the Terms of Service",
    rules: { required: "You must agree to the terms" },
  },
];

<ConfigurableForm
  title="Create Account"
  subtitle="Join our community"
  fields={registrationFields}
  onSubmit={handleSubmit}
  layout="horizontal"
  spacing="md"
  showResetButton={true}
/>
```

### User Profile Form (Grid)

```tsx
const profileFields = [
  // Personal Information
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    rules: { required: "First name is required" },
  },
  {
    name: "lastName",
    type: "input",
    label: "Last Name",
    rules: { required: "Last name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email Address",
    inputProps: { type: "email" },
    rules: { required: "Email is required" },
  },
  {
    name: "phone",
    type: "input",
    label: "Phone Number",
    inputProps: { type: "tel" },
  },
  {
    name: "dateOfBirth",
    type: "input",
    label: "Date of Birth",
    inputProps: { type: "date" },
  },
  {
    name: "gender",
    type: "select",
    label: "Gender",
    options: [
      { label: "Prefer not to say", value: "" },
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  
  // Address Information
  {
    name: "street",
    type: "input",
    label: "Street Address",
  },
  {
    name: "city",
    type: "input",
    label: "City",
  },
  {
    name: "state",
    type: "input",
    label: "State/Province",
  },
  {
    name: "zipCode",
    type: "input",
    label: "ZIP/Postal Code",
  },
  {
    name: "country",
    type: "select",
    label: "Country",
    options: [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
    ],
  },
  
  // Preferences
  {
    name: "newsletter",
    type: "checkbox",
    label: "Subscribe to Newsletter",
  },
  {
    name: "notifications",
    type: "switch",
    label: "Enable Notifications",
    defaultValue: true,
  },
];

<ConfigurableForm
  title="User Profile"
  subtitle="Update your personal information"
  fields={profileFields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={2}
  spacing="lg"
  showResetButton={true}
/>
```

### Settings Form (Three-Column Grid)

```tsx
const settingsFields = [
  {
    name: "theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
    defaultValue: "system",
  },
  {
    name: "language",
    type: "select",
    label: "Language",
    options: [
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" },
      { label: "French", value: "fr" },
    ],
    defaultValue: "en",
  },
  {
    name: "timezone",
    type: "select",
    label: "Timezone",
    options: [
      { label: "UTC", value: "utc" },
      { label: "EST", value: "est" },
      { label: "PST", value: "pst" },
    ],
    defaultValue: "utc",
  },
  {
    name: "notifications",
    type: "switch",
    label: "Email Notifications",
    defaultValue: true,
  },
  {
    name: "pushNotifications",
    type: "switch",
    label: "Push Notifications",
    defaultValue: false,
  },
  {
    name: "marketing",
    type: "switch",
    label: "Marketing Emails",
    defaultValue: false,
  },
];

<ConfigurableForm
  title="Settings"
  subtitle="Customize your experience"
  fields={settingsFields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={3}
  spacing="md"
  showResetButton={true}
/>
```

## Layout Best Practices

### 1. Choose Layout Based on Field Count

```tsx
// 1-5 fields: Use vertical layout
const smallForm = <ConfigurableForm layout="vertical" fields={smallFields} />;

// 6-10 fields: Use horizontal layout
const mediumForm = <ConfigurableForm layout="horizontal" fields={mediumFields} />;

// 10+ fields: Use grid layout
const largeForm = <ConfigurableForm layout="grid" columns={2} fields={largeFields} />;
```

### 2. Group Related Fields

```tsx
const userProfileFields = [
  // Personal Information Group
  { name: "firstName", type: "input", label: "First Name" },
  { name: "lastName", type: "input", label: "Last Name" },
  { name: "email", type: "input", label: "Email" },
  
  // Address Group
  { name: "street", type: "input", label: "Street" },
  { name: "city", type: "input", label: "City" },
  { name: "state", type: "input", label: "State" },
  
  // Preferences Group
  { name: "newsletter", type: "checkbox", label: "Newsletter" },
  { name: "notifications", type: "switch", label: "Notifications" },
];
```

### 3. Use Appropriate Spacing

```tsx
// Compact forms
<ConfigurableForm spacing="sm" />

// Standard forms
<ConfigurableForm spacing="md" />

// Spacious forms
<ConfigurableForm spacing="lg" />

// Very spacious forms
<ConfigurableForm spacing="xl" />
```

### 4. Consider Mobile Experience

```tsx
// All layouts are responsive, but consider field order
const fields = [
  // Most important fields first
  { name: "email", type: "input", label: "Email" },
  { name: "password", type: "input", label: "Password" },
  
  // Less important fields later
  { name: "firstName", type: "input", label: "First Name" },
  { name: "lastName", type: "input", label: "Last Name" },
];
```

### 5. Use Consistent Spacing

```tsx
// Maintain consistent spacing throughout your app
const formDefaults = {
  spacing: "md", // Use the same spacing across all forms
};

<ConfigurableForm
  spacing={formDefaults.spacing}
  // ... other props
/>
```

## Custom Layouts

For more complex layouts, you can combine multiple `ConfigurableForm` components or use individual field components:

```tsx
function ComplexForm() {
  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <ConfigurableForm
          fields={personalFields}
          onSubmit={handlePersonalSubmit}
          layout="horizontal"
          spacing="md"
          showResetButton={false}
        />
      </div>
      
      {/* Address Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Address Information</h3>
        <ConfigurableForm
          fields={addressFields}
          onSubmit={handleAddressSubmit}
          layout="grid"
          columns={2}
          spacing="md"
          showResetButton={false}
        />
      </div>
      
      {/* Preferences Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <ConfigurableForm
          fields={preferenceFields}
          onSubmit={handlePreferenceSubmit}
          layout="vertical"
          spacing="md"
          showResetButton={true}
        />
      </div>
    </div>
  );
}
```

## Examples

For complete layout examples, see:

- [Getting Started](./getting-started.md) - Basic layout usage
- [Form Builder](./form-builder.md) - ConfigurableForm layouts
- [Components](./components.md) - Individual field components

## Next Steps

- [Components](./components.md) - Learn about field components
- [Form Builder](./form-builder.md) - Master the ConfigurableForm component
- [Configuration](./configuration.md) - Set up global defaults
- [Validation](./validation.md) - Implement form validation
