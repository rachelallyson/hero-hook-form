"use client";

import type { FormFieldConfig } from "@rachelallyson/hero-hook-form";

import React from "react";
import { ConfigurableForm, ZodForm } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string; // Make phone optional
  message: string;
  category: string;
  priority: string;
  newsletter?: boolean; // Make newsletter optional
  notifications?: boolean; // Make notifications optional
  agreeToTerms: boolean;
}

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address").optional(),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  newsletter: z.boolean().optional(),
  notifications: z.boolean().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms of service",
  }),
});

const contactFields: FormFieldConfig<ContactFormData>[] = [
  {
    description: "Enter your first name",
    label: "First Name",
    name: "firstName",
    rules: { required: "First name is required" },
    type: "input",
  },
  {
    description: "Enter your last name",
    label: "Last Name",
    name: "lastName",
    rules: { required: "Last name is required" },
    type: "input",
  },
  {
    description: "Enter your email address",
    inputProps: { type: "email" },
    label: "Email",
    name: "email",
    rules: {
      pattern: {
        message: "Invalid email address",
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      },
      required: "Email is required",
    },
    type: "input",
  },
  {
    description: "Enter your phone number (optional)",
    inputProps: { type: "tel" },
    label: "Phone Number",
    name: "phone",
    type: "input",
  },
  {
    description: "Tell us about your inquiry",
    label: "Message",
    name: "message",
    rules: { required: "Message is required" },
    textareaProps: {
      maxRows: 6,
      minRows: 3,
      placeholder: "Please describe your inquiry in detail...",
    },
    type: "textarea",
  },
  {
    description: "Select the category that best fits your inquiry",
    label: "Category",
    name: "category",
    options: [
      { label: "General Inquiry", value: "general" },
      { label: "Technical Support", value: "support" },
      { label: "Feature Request", value: "feature" },
      { label: "Bug Report", value: "bug" },
      { label: "Partnership", value: "partnership" },
    ],
    rules: { required: "Category is required" },
    type: "select",
  },
  {
    description: "How urgent is your request?",
    label: "Priority Level",
    name: "priority",
    radioOptions: [
      { label: "Low - No rush", value: "low" },
      { label: "Medium - Normal priority", value: "medium" },
      { label: "High - Urgent", value: "high" },
    ],
    rules: { required: "Priority is required" },
    type: "radio",
  },
  {
    description: "Receive updates about new features and announcements",
    label: "Subscribe to Newsletter",
    name: "newsletter",
    type: "checkbox",
  },
  {
    description: "Receive push notifications for updates",
    label: "Enable Notifications",
    name: "notifications",
    type: "switch",
  },
  {
    description: "You must agree to our terms to submit this form",
    label: "I agree to the Terms of Service",
    name: "agreeToTerms",
    rules: {
      required: "You must agree to the terms of service",
      validate: (value) =>
        value === true || "You must agree to the terms of service",
    },
    type: "checkbox",
  },
];

export function ConfigurableFormDemo() {
  const handleSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", data);

    // In a real app, you would send this data to your API
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  };

  const handleSuccess = (data: ContactFormData) => {
    console.log("Form submitted successfully:", data);
    // You could show a toast notification here
  };

  const handleError = (error: { message: string; field?: string }) => {
    console.error("Form submission error:", error);
    // You could show an error toast here
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          ConfigurableForm Demo
        </h1>
        <p className="text-muted-foreground">
          This demonstrates the new ConfigurableForm component that allows you
          to create forms by simply defining field configurations. No need to
          manually wire up each field!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Grid Layout Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Grid Layout (2 columns)
          </h2>
          <ConfigurableForm<ContactFormData>
            className="p-6 border border-border rounded-lg"
            columns={2}
            fields={contactFields}
            layout="grid"
            resetButtonText="Clear Form"
            showResetButton={true}
            spacing="4"
            submitButtonText="Send Message"
            subtitle="Get in touch with our team"
            title="Contact Us"
            onError={handleError}
            onSubmit={handleSubmit}
            onSuccess={handleSuccess}
          />
        </div>

        {/* Vertical Layout Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Vertical Layout
          </h2>
          <ConfigurableForm<ContactFormData>
            className="p-6 border border-border rounded-lg"
            fields={contactFields.slice(0, 5)} // Just first 5 fields
            layout="vertical"
            showResetButton={false}
            spacing="6"
            submitButtonText="Submit"
            subtitle="Simple vertical form layout"
            title="Quick Contact"
            onError={handleError}
            onSubmit={handleSubmit}
            onSuccess={handleSuccess}
          />
        </div>
      </div>

      {/* Horizontal Layout Example */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Horizontal Layout
        </h2>
        <ConfigurableForm<ContactFormData>
          className="p-6 border border-border rounded-lg"
          fields={contactFields.slice(0, 6)} // Just first 6 fields
          layout="horizontal"
          resetButtonText="Clear"
          showResetButton={true}
          spacing="4"
          submitButtonText="Register"
          subtitle="Horizontal layout with 2 columns on desktop"
          title="Registration Form"
          onError={handleError}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />
      </div>

      {/* Code Example */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Usage Example
        </h3>
        <pre className="text-sm text-muted-foreground overflow-x-auto">
          {`import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

const fields = [
  {
    name: "firstName",
    type: "input",
    label: "First Name",
    rules: { required: "First name is required" },
  },
  {
    name: "email",
    type: "input",
    label: "Email",
    inputProps: { type: "email" },
    rules: { 
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
        message: "Invalid email address"
      }
    },
  },
  // ... more fields
];

<ConfigurableForm
  title="Contact Form"
  fields={fields}
  onSubmit={handleSubmit}
  layout="grid"
  columns={2}
  showResetButton={true}
/>`}
        </pre>
      </div>

      {/* Zod Validation Example */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Zod Validation Example
        </h3>
        <ZodForm<ContactFormData>
          className="p-6 border border-blue-200 rounded-lg bg-white"
          config={{ schema: contactSchema, fields: contactFields.slice(0, 4) }}
          layout="vertical"
          showResetButton={true}
          spacing="4"
          submitButtonText="Test Zod Validation"
          subtitle="This form uses Zod schemas for validation"
          title="Zod Validation Demo"
          onError={handleError}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
