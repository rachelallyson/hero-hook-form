"use client";

import { ServerActionForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

// Example Server Action (simulated - in real app this would be in app/actions/)
async function mockSignupAction(
  state: { errors?: Record<string, string[]>; message?: string; success?: boolean } | undefined,
  formData: FormData,
): Promise<{ errors?: Record<string, string[]>; message?: string; success?: boolean }> {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Simulate validation
  if (!name || name.length < 2) {
    return {
      errors: {
        name: ["Name must be at least 2 characters"],
      },
    };
  }

  if (!email || !email.includes("@")) {
    return {
      errors: {
        email: ["Please enter a valid email"],
      },
    };
  }

  if (!password || password.length < 8) {
    return {
      errors: {
        password: ["Password must be at least 8 characters"],
      },
    };
  }

  // Simulate success
  return {
    message: "Account created successfully!",
    success: true,
  };
}

// Client-side validation schema (optional)
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default function ServerActionDemoPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Server Action Form Demo</h1>

      <div className="space-y-12">
        {/* Server-side only validation */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Server-Side Only Validation
          </h2>
          <p className="text-muted-foreground mb-6">
            Form submits directly to Server Action. All validation happens
            server-side.
          </p>
          <ServerActionForm
            action={mockSignupAction}
            fields={[
              FormFieldHelpers.input("name", "Name"),
              FormFieldHelpers.input("email", "Email", { type: "email" }),
              FormFieldHelpers.input("password", "Password", {
                type: "password",
              }),
            ]}
            title="Sign Up"
            subtitle="Create a new account"
          />
        </section>

        {/* Client + Server validation */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Client + Server Validation
          </h2>
          <p className="text-muted-foreground mb-6">
            Client-side validation provides immediate feedback, then server
            validates for security.
          </p>
          <ServerActionForm
            action={mockSignupAction}
            clientValidationSchema={signupSchema}
            fields={[
              FormFieldHelpers.input("name", "Name"),
              FormFieldHelpers.input("email", "Email", { type: "email" }),
              FormFieldHelpers.input("password", "Password", {
                type: "password",
              }),
            ]}
            title="Sign Up (With Client Validation)"
            subtitle="Immediate feedback + server security"
          />
        </section>

        {/* With default values */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">With Default Values</h2>
          <p className="text-muted-foreground mb-6">
            Pre-fill form fields for editing existing records.
          </p>
          <ServerActionForm
            action={mockSignupAction}
            defaultValues={{
              email: "user@example.com",
              name: "John Doe",
            }}
            fields={[
              FormFieldHelpers.input("name", "Name"),
              FormFieldHelpers.input("email", "Email", { type: "email" }),
              FormFieldHelpers.input("password", "Password", {
                type: "password",
              }),
            ]}
            title="Edit Profile"
            subtitle="Update your information"
          />
        </section>

        {/* With callbacks */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">With Callbacks</h2>
          <p className="text-muted-foreground mb-6">
            Use onError and onSuccess for analytics, logging, or custom
            handling.
          </p>
          <ServerActionForm
            action={mockSignupAction}
            fields={[
              FormFieldHelpers.input("name", "Name"),
              FormFieldHelpers.input("email", "Email", { type: "email" }),
              FormFieldHelpers.input("password", "Password", {
                type: "password",
              }),
            ]}
            onError={(error) => {
              console.log("Form error:", error);
              // Could show toast, track analytics, etc.
            }}
            onSuccess={(formData) => {
              console.log("Form success:", formData);
              // Could track conversion, redirect, etc.
            }}
            title="Sign Up (With Callbacks)"
            subtitle="Check console for callback logs"
          />
        </section>
      </div>
    </div>
  );
}
