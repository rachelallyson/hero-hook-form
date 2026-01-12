# Next.js Server Actions Integration

Hero Hook Form now supports Next.js Server Actions, making it compatible with Next.js authentication patterns and server-side form handling.

## Overview

The `ServerActionForm` component allows you to use Hero Hook Form's beautiful field components with Next.js Server Actions, following the [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication) patterns.

**Key Characteristics:**

- **Server-side validation (default)** - Form submits directly to Server Action
- **Optional client-side validation** - Pass `clientValidationSchema` for client-side validation before submission
- **Defense in depth** - If client validation is enabled, it runs first, then server validation still runs
- **Native form submission** - Uses native HTML form submission with FormData

## Basic Usage

### Server-Side Only (Default)

```tsx
'use client'

import { ServerActionForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { signup } from "@/app/actions/auth";

export function SignupForm() {
  return (
    <ServerActionForm
      action={signup}
      fields={[
        FormFieldHelpers.input("name", "Name"),
        FormFieldHelpers.input("email", "Email", { type: "email" }),
        FormFieldHelpers.input("password", "Password", { type: "password" }),
      ]}
      title="Create Account"
      subtitle="Sign up to get started"
    />
  );
}
```

### With Client-Side Validation

Add client-side validation by passing a Zod schema. This provides immediate feedback before submission:

```tsx
'use client'

import { ServerActionForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { signup } from "@/app/actions/auth";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export function SignupForm() {
  return (
    <ServerActionForm
      action={signup}
      clientValidationSchema={signupSchema}
      fields={[
        FormFieldHelpers.input("name", "Name"),
        FormFieldHelpers.input("email", "Email", { type: "email" }),
        FormFieldHelpers.input("password", "Password", { type: "password" }),
      ]}
      title="Create Account"
      subtitle="Sign up to get started"
    />
  );
}
```

**How it works:**

1. User submits form
2. Client-side validation runs (if `clientValidationSchema` provided)
3. If client validation fails → errors display, form doesn't submit
4. If client validation passes → form submits to Server Action
5. Server Action validates again (defense in depth)
6. Server errors display if validation fails

## Server Action Setup

Your Server Action should follow the Next.js pattern with `useActionState`:

```tsx
// app/actions/auth.ts
'use server'

import { z } from 'zod';

const SignupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type ActionState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function signup(
  state: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Create user account
  const { name, email, password } = validatedFields.data;
  // ... your user creation logic ...

  // Option 1: Return success (message displays in form)
  return {
    success: true,
    message: 'Account created successfully!',
  };

  // Option 2: Redirect (success message won't show in form - use URL params)
  // import { redirect } from 'next/navigation';
  // redirect('/dashboard?success=Account created successfully');
}
```

## Using with useActionState

The `ServerActionForm` component uses React's `useActionState` hook internally, so you don't need to manage it yourself. However, if you need more control, you can pass an initial state:

```tsx
export function SignupForm() {
  return (
    <ServerActionForm
      action={signup}
      initialState={{
        errors: undefined,
        message: undefined,
        success: false,
      }}
      fields={[
        FormFieldHelpers.input("name", "Name"),
        FormFieldHelpers.input("email", "Email", { type: "email" }),
        FormFieldHelpers.input("password", "Password", { type: "password" }),
      ]}
    />
  );
}
```

## Error Handling

Errors from your Server Action are automatically displayed:

```tsx
// Server Action returns errors like this:
return {
  errors: {
    email: ['Email already exists'],
    password: ['Password is too weak'],
  },
};

// ServerActionForm automatically displays these errors
// under the respective fields
```

## Success Messages

### Without Redirect

If your Server Action returns state (doesn't call `redirect()`), success messages display automatically:

```tsx
// Server Action returns success:
return {
  success: true,
  message: 'Account created successfully!',
};

// ServerActionForm displays a success banner
```

### With Redirect

**Important:** If your Server Action calls `redirect()`, the page navigates away immediately, so success messages won't display in the form component. You have several options:

#### Option 1: URL Search Params (Recommended)

Pass success message via URL:

```tsx
// app/actions/auth.ts
import { redirect } from 'next/navigation';

export async function signup(
  state: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // ... validation and user creation ...
  
  // Redirect with success message
  redirect('/dashboard?success=Account created successfully');
}
```

Then display on the redirected page:

```tsx
// app/dashboard/page.tsx
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  
  return (
    <>
      {success && (
        <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
          <p className="text-success-800">{success}</p>
        </div>
      )}
      {/* Dashboard content */}
    </>
  );
}
```

#### Option 2: Cookies

Store success message in a cookie:

```tsx
// app/actions/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signup(
  state: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // ... validation and user creation ...
  
  const cookieStore = await cookies();
  cookieStore.set('success', 'Account created successfully!', {
    maxAge: 5, // 5 seconds
    httpOnly: false, // Allow client-side access
  });
  
  redirect('/dashboard');
}
```

Display on redirected page:

```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const success = cookieStore.get('success')?.value;
  
  return (
    <>
      {success && (
        <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
          <p className="text-success-800">{success}</p>
        </div>
      )}
      {/* Dashboard content */}
    </>
  );
}
```

#### Option 3: Don't Redirect on Success

If you want to show the success message in the form, don't call `redirect()`:

```tsx
export async function signup(
  state: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  // ... validation and user creation ...
  
  // Return success instead of redirecting
  return {
    success: true,
    message: 'Account created successfully!',
  };
  
  // User can then manually navigate or you can use client-side redirect
}
```

## Field Types Supported

The following field types work with Server Actions:

- `input` - Text, email, password, number, etc.
- `textarea` - Multi-line text input
- `select` - Dropdown selection
- `checkbox` - Boolean checkbox

## Default Values

Pre-fill form fields with default values:

```tsx
<ServerActionForm
  action={updateProfile}
  defaultValues={{
    name: "John Doe",
    email: "john@example.com",
    newsletter: true,
  }}
  fields={[...]}
/>
```

This is useful for:

- Editing existing records
- Pre-filling from user data
- Setting sensible defaults

## Callbacks

### onError

Handle errors with a callback:

```tsx
<ServerActionForm
  action={signup}
  onError={(error) => {
    // Log to analytics
    console.error("Form error:", error);
    // Show toast notification
    toast.error(error.message || "Validation failed");
  }}
  fields={[...]}
/>
```

### onSuccess

Handle successful submissions:

```tsx
<ServerActionForm
  action={signup}
  onSuccess={(formData) => {
    // Track conversion
    analytics.track("signup_completed");
    // Show custom success message
    toast.success("Welcome!");
  }}
  fields={[...]}
/>
```

## Complete Authentication Example

Here's a complete signup form following Next.js authentication patterns:

```tsx
// app/ui/signup-form.tsx
'use client'

import { ServerActionForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { signup } from "@/app/actions/auth";

export function SignupForm() {
  return (
    <ServerActionForm
      action={signup}
      fields={[
        FormFieldHelpers.input("name", "Name"),
        FormFieldHelpers.input("email", "Email", { 
          type: "email",
          inputProps: {
            placeholder: "Enter your email",
          },
        }),
        FormFieldHelpers.input("password", "Password", { 
          type: "password",
          inputProps: {
            placeholder: "Create a password",
          },
        }),
      ]}
      title="Create Account"
      subtitle="Sign up to get started"
      submitButtonText="Sign Up"
    />
  );
}
```

## Differences from ZodForm

| Feature | ZodForm | ServerActionForm |
|---------|---------|------------------|
| Validation | Client-side (Zod) before submission | Optional client-side + always server-side |
| Submission | Client-side handler (async function) | Server Action (native form submission) |
| Error Handling | React Hook Form | useActionState |
| Form Data | JSON (via React Hook Form) | FormData (native HTML form) |
| Success Messages | Can show in form | Only if no redirect; use URL params/cookies if redirecting |
| Use Case | General forms with client-side validation | Next.js auth, server-side forms, progressive enhancement |

## When to Use ServerActionForm

Use `ServerActionForm` when:

- Building authentication forms (login, signup)
- You want **server-side only** validation (no client-side checks)
- Following Next.js authentication patterns
- You want progressive enhancement (works without JavaScript)
- You're okay with form submitting even if fields are invalid (server handles it)

Use `ZodForm` when:

- Building general application forms
- You want **client-side validation** before submission
- You need complex form logic
- You're not using Next.js Server Actions
- You want to prevent invalid submissions from reaching the server

## Migration from ZodForm

If you have an existing form using `ZodForm` and want to migrate to Server Actions:

1. Move validation logic to your Server Action
2. Change `onSubmit` to `action` prop
3. Update error handling to match Server Action response format
4. Replace `ZodForm` with `ServerActionForm`

```tsx
// Before (ZodForm)
<ZodForm
  config={{
    schema: mySchema,
    fields: myFields,
    onSubmit: async (data) => {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // ...
    },
  }}
/>

// After (ServerActionForm)
<ServerActionForm
  action={myServerAction}
  fields={myFields}
/>
```

## Best Practices

1. **Always validate on the server** - Server-side validation is your security layer. Even with client-side validation, always validate in your Server Action.
2. **Client-side validation is optional** - Use `clientValidationSchema` for better UX (immediate feedback), but it's not required.
3. **Defense in depth** - If you use client-side validation, your Server Action should still validate. Client validation prevents unnecessary server calls; server validation ensures security.
4. **Use Zod schemas** - Use Zod in both client and server for consistent validation rules
5. **Return clear errors** - Return field-specific errors in the format: `{ errors: { fieldName: ['error message'] } }`
6. **Handle success appropriately**:
   - If not redirecting: Return `{ success: true, message: '...' }` to show success message in form
   - If redirecting: Use URL params or cookies to pass success message to redirected page
7. **Type your actions** - Use TypeScript to type your Server Action state

## Troubleshooting

### Form values not submitting

Make sure your Server Action accepts `FormData` as the second parameter:

```tsx
export async function myAction(
  state: ActionState | undefined,
  formData: FormData, // Must be FormData
): Promise<ActionState> {
  // ...
}
```

### Errors not displaying

Ensure your Server Action returns errors in the correct format:

```tsx
return {
  errors: {
    fieldName: ['Error message'],
  },
};
```

### Checkbox values

For checkboxes, the value will be `"on"` when checked, or empty when unchecked. Handle this in your Server Action:

```tsx
const isChecked = formData.get('newsletter') === 'on';
```

### Success message not showing after redirect

If you call `redirect()` in your Server Action, the page navigates away immediately, so success messages won't display in the form component. Use one of these approaches:

1. **URL search params**: `redirect('/dashboard?success=Message')`
2. **Cookies**: Set a cookie before redirecting
3. **Don't redirect**: Return success state instead and handle navigation client-side

See the [Success Messages](#success-messages) section for examples.

### Client validation not working

If you pass `clientValidationSchema` but validation doesn't run:

1. **Check schema type**: Make sure the schema matches your form data type
2. **Check field names**: Field names in the schema must match field names in your form
3. **Check FormData conversion**: The component converts FormData to an object for validation. Checkbox values are converted from `"on"` to `true`

### Form not submitting

If the form doesn't submit:

1. **Check Server Action signature**: Must be `(state, formData: FormData) => Promise<ActionState>`
2. **Check form action**: Make sure the `action` prop is a valid Server Action
3. **Check client validation**: If `clientValidationSchema` is provided and validation fails, form won't submit
4. **Check browser console**: Look for JavaScript errors

### Default values not showing

If default values aren't pre-filling:

1. **Check prop name**: Use `defaultValues` (not `defaultValue`)
2. **Check field names**: Keys in `defaultValues` must match field `name` props
3. **Check value types**: Make sure value types match field types (string for inputs, boolean for checkboxes)

### Errors not displaying

If server errors aren't showing:

1. **Check error format**: Server Action must return `{ errors: { fieldName: ['error message'] } }`
2. **Check field names**: Error keys must match field `name` props
3. **Check state**: Make sure your Server Action is returning the error state correctly

## See Also

- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React useActionState](https://react.dev/reference/react/useActionState)
