"use client";

import React from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/react";

export default function GettingStartedPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Getting Started</h1>
        <p className="text-muted-foreground">
          Learn how to install, configure, and create your first form with Hero
          Hook Form.
        </p>
      </div>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Installation</h2>
        <p className="text-muted-foreground">
          Hero Hook Form requires React Hook Form and HeroUI components. Choose
          your preferred installation method:
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-foreground">
                Option A: Individual HeroUI Packages
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Install only the HeroUI components you need for better
                tree-shaking.
              </p>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                {`npm install @rachelallyson/hero-hook-form react-hook-form \\
  @heroui/input @heroui/checkbox @heroui/radio \\
  @heroui/select @heroui/switch @heroui/button \\
  @heroui/spinner`}
              </pre>
              <p className="text-sm text-muted-foreground">
                Import from the package root:
              </p>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                {`import { InputField, SelectField, ConfigurableForm } from "@rachelallyson/hero-hook-form";`}
              </pre>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-foreground">
                Option B: Aggregate HeroUI Package
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use the aggregate package for convenience and simpler dependency
                management.
              </p>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                {`npm install @rachelallyson/hero-hook-form react-hook-form @heroui/react`}
              </pre>
              <p className="text-sm text-muted-foreground">
                Import components (works with both installation methods):
              </p>
              <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                {`import { InputField, SelectField, ConfigurableForm } from "@rachelallyson/hero-hook-form";`}
              </pre>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Setup */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Setup</h2>
        <p className="text-muted-foreground">
          Configure your app with the necessary providers for optimal
          functionality.
        </p>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              App Configuration
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Wrap your app with the necessary providers. This example shows a
              typical Next.js setup:
            </p>
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
              {`import { HeroUIProvider } from "@heroui/system";
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
            input: { variant: "underlined" },
            select: { variant: "flat" },
            submitButton: { color: "secondary" },
          }}
        >
          {children}
        </HeroHookFormProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}`}
            </pre>
          </CardBody>
        </Card>
      </div>

      {/* Quick Start */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Quick Start</h2>
        <p className="text-muted-foreground">
          Create your first form using the ConfigurableForm component for rapid
          development.
        </p>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              Simple Contact Form
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This example demonstrates a basic contact form with validation:
            </p>
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
              {`import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  newsletter: boolean;
}

const fields = [
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
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
  },
  {
    name: "message",
    type: "textarea",
    label: "Message",
    rules: { required: "Message is required" },
  },
  {
    name: "newsletter",
    type: "checkbox",
    label: "Subscribe to newsletter",
  },
];

export function ContactForm() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // Send data to your API
  };

  return (
    <ConfigurableForm
      title="Contact Us"
      subtitle="We'd love to hear from you"
      fields={fields}
      onSubmit={handleSubmit}
      layout="vertical"
      showResetButton={true}
    />
  );
}`}
            </pre>
          </CardBody>
        </Card>
      </div>

      {/* Manual Form Setup */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Manual Form Setup
        </h2>
        <p className="text-muted-foreground">
          For more control, you can manually wire up individual field components
          with React Hook Form.
        </p>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              Using Individual Components
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This approach gives you maximum flexibility and control:
            </p>
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
              {`import { useForm } from "react-hook-form";
import { 
  InputField, 
  TextareaField, 
  SelectField, 
  CheckboxField,
  SubmitButton 
} from "@rachelallyson/hero-hook-form";

interface FormData {
  name: string;
  email: string;
  plan: string;
  agree: boolean;
}

export function ManualForm() {
  const methods = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      plan: "free",
      agree: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        control={methods.control}
        name="name"
        label="Name"
        rules={{ required: "Name is required" }}
      />
      
      <InputField
        control={methods.control}
        name="email"
        label="Email"
        inputProps={{ type: "email" }}
        rules={{ required: "Email is required" }}
      />
      
      <SelectField
        control={methods.control}
        name="plan"
        label="Plan"
        options={[
          { label: "Free", value: "free" },
          { label: "Pro", value: "pro" },
          { label: "Team", value: "team" },
        ]}
      />
      
      <CheckboxField
        control={methods.control}
        name="agree"
        label="I agree to the terms"
        rules={{ required: "You must agree" }}
      />
      
      <SubmitButton>Submit</SubmitButton>
    </form>
  );
}`}
            </pre>
          </CardBody>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Next Steps</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Explore Components
              </h3>
              <p className="text-muted-foreground mb-4">
                Learn about all available field components and their
                configuration options.
              </p>
              <Button as={Link} href="/docs/components" variant="flat">
                View Components
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Try the Demo
              </h3>
              <p className="text-muted-foreground mb-4">
                See Hero Hook Form in action with our comprehensive demo.
              </p>
              <Button as={Link} href="/comprehensive-demo" variant="flat">
                View Demo
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
