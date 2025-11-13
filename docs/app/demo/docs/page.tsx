"use client";

import React from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/react";

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Hero Hook Form Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Build beautiful, type-safe forms with React Hook Form and HeroUI
          components. Featuring comprehensive validation, multiple layouts, and
          seamless integration.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            as={Link}
            color="primary"
            href="/docs/getting-started"
            size="lg"
          >
            Get Started
          </Button>
          <Button
            as={Link}
            href="/comprehensive-demo"
            size="lg"
            variant="bordered"
          >
            Live Demo
          </Button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              🚀 Getting Started
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-muted-foreground mb-4">
              Learn how to install, configure, and create your first form with
              Hero Hook Form.
            </p>
            <Button
              as={Link}
              href="/docs/getting-started"
              size="sm"
              variant="flat"
            >
              Read Guide
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              🧩 Components
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-muted-foreground mb-4">
              Explore all available field components and their configuration
              options.
            </p>
            <Button as={Link} href="/docs/components" size="sm" variant="flat">
              View Components
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              ⚙️ Configuration
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-muted-foreground mb-4">
              Learn about global configuration, providers, and customization
              options.
            </p>
            <Button
              as={Link}
              href="/docs/configuration"
              size="sm"
              variant="flat"
            >
              Configure
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              📝 Form Builder
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-muted-foreground mb-4">
              Discover the ConfigurableForm component for rapid form
              development.
            </p>
            <Button
              as={Link}
              href="/docs/form-builder"
              size="sm"
              variant="flat"
            >
              Learn More
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              ✅ Validation
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-muted-foreground mb-4">
              Master form validation with built-in rules and custom validators.
            </p>
            <Button as={Link} href="/docs/validation" size="sm" variant="flat">
              Validate Forms
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              🎨 Layouts
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-muted-foreground mb-4">
              Explore different form layouts: vertical, horizontal, and grid
              configurations.
            </p>
            <Button as={Link} href="/docs/layouts" size="sm" variant="flat">
              View Layouts
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Type Safety</h4>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with automatic type inference from
                  your form schemas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Multiple Field Types
                </h4>
                <p className="text-sm text-muted-foreground">
                  Input, Textarea, Select, Radio, Checkbox, Switch, and more
                  with HeroUI styling.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Flexible Layouts
                </h4>
                <p className="text-sm text-muted-foreground">
                  Vertical, horizontal, and grid layouts with responsive design.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Built-in Validation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive validation with React Hook Form integration and
                  custom rules.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  Global Configuration
                </h4>
                <p className="text-sm text-muted-foreground">
                  Set defaults across your entire application with the
                  ConfigProvider.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  ConfigurableForm
                </h4>
                <p className="text-sm text-muted-foreground">
                  Rapid form development with declarative field configurations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Quick Example</h2>
        <Card>
          <CardBody>
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
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
  {
    name: "plan",
    type: "select",
    label: "Plan",
    options: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
      { label: "Team", value: "team" },
    ],
  },
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
