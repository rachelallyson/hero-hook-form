"use client";

import type { FormFieldConfig } from "@rachelallyson/hero-hook-form";

import React from "react";
import {
  ConfigurableForm,
  HeroHookFormProvider,
} from "@rachelallyson/hero-hook-form";

interface ConfigFormData {
  name: string;
  email: string;
  message: string;
  theme: string;
  notifications: boolean;
}

const configFields: FormFieldConfig<ConfigFormData>[] = [
  {
    label: "Name",
    name: "name",
    rules: { required: "Name is required" },
    type: "input",
  },
  {
    inputProps: { type: "email" },
    label: "Email",
    name: "email",
    rules: { required: "Email is required" },
    type: "input",
  },
  {
    label: "Message",
    name: "message",
    rules: { required: "Message is required" },
    type: "textarea",
  },
  {
    label: "Theme",
    name: "theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
    type: "radio",
  },
  {
    label: "Enable Notifications",
    name: "notifications",
    type: "switch",
  },
];

export default function ConfigDemoPage() {
  const handleSubmit = (data: ConfigFormData) => {
    console.log("Config form submitted:", data);
    alert(`Configuration saved! Name: ${data.name}, Theme: ${data.theme}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Global Configuration Demo</h1>
        <p className="text-gray-600">
          Demonstrating global configuration and provider features
        </p>
      </div>

      {/* Default Configuration - No Provider */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Default Configuration</h2>
        <p className="text-gray-600">Form without global configuration</p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ConfigurableForm
            fields={configFields}
            layout="vertical"
            showResetButton={true}
            subtitle="Default styling and behavior"
            title="Default Form"
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      {/* Common Defaults Configuration */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common Defaults</h2>
        <p className="text-gray-600">Form with common defaults applied</p>
        <div className="bg-blue-50 p-6 rounded-lg">
          <HeroHookFormProvider
            defaults={{
              common: {
                color: "primary",
                labelPlacement: "outside",
                radius: "md",
                size: "md",
                variant: "bordered",
              },
            }}
          >
            <ConfigurableForm
              fields={configFields}
              layout="vertical"
              showResetButton={true}
              subtitle="Common defaults applied"
              title="Common Defaults Form"
              onSubmit={handleSubmit}
            />
          </HeroHookFormProvider>
        </div>
      </section>

      {/* Component-Specific Defaults */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Component Overrides</h2>
        <p className="text-gray-600">Form with component-specific defaults</p>
        <div className="bg-green-50 p-6 rounded-lg">
          <HeroHookFormProvider
            defaults={{
              common: {
                color: "success",
                labelPlacement: "outside",
                radius: "lg",
                size: "lg",
                variant: "faded",
              },
              input: {
                color: "primary",
                size: "md",
                variant: "bordered",
              },
              select: {
                color: "warning",
                size: "md",
                variant: "bordered",
              },
              submitButton: {
                color: "secondary",
                size: "lg",
                variant: "solid",
              },
            }}
          >
            <ConfigurableForm
              fields={configFields}
              layout="vertical"
              showResetButton={true}
              subtitle="Component-specific overrides"
              title="Component Overrides Form"
              onSubmit={handleSubmit}
            />
          </HeroHookFormProvider>
        </div>
      </section>

      {/* Nested Providers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Nested Providers</h2>
        <p className="text-gray-600">Form with nested provider configuration</p>
        <div className="bg-purple-50 p-6 rounded-lg">
          <HeroHookFormProvider
            defaults={{
              common: {
                color: "secondary",
                labelPlacement: "outside",
                radius: "md",
                size: "md",
                variant: "bordered",
              },
            }}
          >
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Outer Provider</h3>
              <HeroHookFormProvider
                defaults={{
                  common: {
                    color: "danger",
                    labelPlacement: "inside",
                    radius: "sm",
                    size: "sm",
                    variant: "underlined",
                  },
                }}
              >
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-lg font-semibold mb-2">Inner Provider</h3>
                  <ConfigurableForm
                    fields={configFields}
                    layout="vertical"
                    showResetButton={true}
                    subtitle="Nested provider configuration"
                    title="Nested Providers Form"
                    onSubmit={handleSubmit}
                  />
                </div>
              </HeroHookFormProvider>
            </div>
          </HeroHookFormProvider>
        </div>
      </section>

      {/* Configuration Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Configuration Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-blue-600 mb-3">
              🎨 Common Defaults
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Global color schemes</li>
              <li>• Consistent sizing</li>
              <li>• Unified variants</li>
              <li>• Standard border radius</li>
              <li>• Label placement</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-green-600 mb-3">
              🔧 Component Overrides
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Input-specific styling</li>
              <li>• Button customization</li>
              <li>• Select field options</li>
              <li>• Individual component control</li>
              <li>• Granular customization</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-purple-600 mb-3">
              🔗 Nested Providers
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Hierarchical configuration</li>
              <li>• Context inheritance</li>
              <li>• Override capabilities</li>
              <li>• Flexible structure</li>
              <li>• Modular design</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
