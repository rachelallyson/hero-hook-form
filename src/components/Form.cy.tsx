import React from "react";

import { HeroUIProvider } from "@heroui/system";
import { mount } from "cypress/react";

import type { FormFieldConfig } from "../types";

import { ConfigurableForm } from "./Form";

// Create a test wrapper component that provides necessary context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

interface TestFormData {
  name: string;
  email: string;
  message: string;
  country: string;
  newsletter: boolean;
  terms: boolean;
}

const testFields: FormFieldConfig<TestFormData>[] = [
  {
    label: "Full Name",
    name: "name",
    rules: { required: "Name is required" },
    type: "input",
  },
  {
    inputProps: { type: "email" },
    label: "Email Address",
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
    label: "Country",
    name: "country",
    options: [
      { label: "Select a country", value: "" },
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
    ],
    rules: { required: "Country is required" },
    type: "select",
  },
  {
    label: "Subscribe to newsletter",
    name: "newsletter",
    type: "checkbox",
  },
  {
    label: "I agree to the terms",
    name: "terms",
    rules: { required: "You must agree to the terms" },
    type: "checkbox",
  },
];

describe("ConfigurableForm", () => {
  let mockOnSubmit: ReturnType<typeof cy.stub>;
  let mockOnError: ReturnType<typeof cy.stub>;
  let mockOnSuccess: ReturnType<typeof cy.stub>;

  beforeEach(() => {
    mockOnSubmit = cy.stub().as("onSubmit");
    mockOnError = cy.stub().as("onError");
    mockOnSuccess = cy.stub().as("onSuccess");
  });

  it("should render with title and subtitle", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          subtitle="We'd love to hear from you"
          title="Contact Form"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    cy.get("h2").should("contain", "Contact Form");
    cy.get("p").should("contain", "We'd love to hear from you");
  });

  it("should render all field types correctly", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm fields={testFields} onSubmit={mockOnSubmit} />
      </TestWrapper>,
    );

    // Check that all field types are rendered
    cy.contains("label", "Full Name").should("exist");
    cy.contains("label", "Email Address").should("exist");
    cy.contains("label", "Message").should("exist");
    cy.contains("label", "Country").should("exist");
    cy.contains("label", "Subscribe to newsletter").should("exist");
    cy.contains("label", "I agree to the terms").should("exist");
  });

  it("should handle form submission with valid data", () => {
    // Create test fields with country field not required for this test
    const testFieldsWithoutRequiredCountry = testFields.map((field) =>
      field.name === "country" ? { ...field, rules: {} } : field,
    );

    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFieldsWithoutRequiredCountry}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Fill in required fields using labels
    cy.contains("label", "Full Name").parent().find("input").type("John Doe");
    cy.contains("label", "Email Address")
      .parent()
      .find("input")
      .type("john@example.com");
    cy.contains("label", "Message")
      .parent()
      .find("textarea")
      .type("Test message");

    // Select country - use aria-haspopup to find the select button
    // The Select component renders a button with aria-haspopup="listbox"
    cy.contains("label", "Country").should("exist");
    // Find the select button using aria-haspopup attribute
    cy.get('button[aria-haspopup="listbox"]').first().click();
    cy.get("[role=option]").contains("United States").click();

    // Check terms
    cy.contains("label", "I agree to the terms")
      .parent()
      .find("input[type='checkbox']")
      .check({ force: true });

    // Submit form
    cy.get("button[type='submit']").click();

    cy.get("@onSubmit").should("have.been.calledOnce");
  });

  it("should show validation errors for required fields", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          onError={mockOnError}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Submit without filling required fields
    cy.get("button[type='submit']").click();

    // Should show validation errors
    cy.contains("Name is required").should("exist");
    cy.contains("Email is required").should("exist");
    cy.contains("Message is required").should("exist");
    cy.contains("Country is required").should("exist");
    cy.contains("You must agree to the terms").should("exist");
  });

  it("should handle vertical layout (default)", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          layout="vertical"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Vertical layout should stack fields in a single column
    cy.get("form > div").should("have.class", "space-y-4");
  });

  it("should handle horizontal layout", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          layout="horizontal"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Horizontal layout should use grid with 2 columns on desktop
    cy.get("form > div").should("have.class", "grid");
    cy.get("form > div").should("have.class", "grid-cols-1");
    cy.get("form > div").should("have.class", "md:grid-cols-2");
  });

  it("should handle grid layout with different columns", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          columns={2}
          fields={testFields}
          layout="grid"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Grid layout should use grid classes
    cy.get("form > div").should("have.class", "grid");
    cy.get("form > div").should("have.class", "grid-cols-1");
    cy.get("form > div").should("have.class", "md:grid-cols-2");
  });

  it("should handle grid layout with 3 columns", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          columns={3}
          fields={testFields}
          layout="grid"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Grid layout with 3 columns should use appropriate grid classes
    cy.get("form > div").should("have.class", "grid");
    cy.get("form > div").should("have.class", "grid-cols-1");
    cy.get("form > div").should("have.class", "md:grid-cols-2");
    cy.get("form > div").should("have.class", "lg:grid-cols-3");
  });

  it("should show reset button when enabled", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          showResetButton={true}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Should show reset button
    cy.get("button").contains("Reset").should("exist");
  });

  it("should handle form reset", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          showResetButton={true}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Fill in some data
    cy.contains("label", "Full Name").parent().find("input").type("John Doe");
    cy.contains("label", "Email Address")
      .parent()
      .find("input")
      .type("john@example.com");

    // Reset form
    cy.get("button").contains("Reset").click();

    // Fields should be cleared
    cy.contains("label", "Full Name")
      .parent()
      .find("input")
      .should("have.value", "");
    cy.contains("label", "Email Address")
      .parent()
      .find("input")
      .should("have.value", "");
  });

  it("should show success message after successful submission", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          onSubmit={mockOnSubmit}
          onSuccess={mockOnSuccess}
        />
      </TestWrapper>,
    );

    // Fill in required fields
    cy.contains("label", "Full Name").parent().find("input").type("John Doe");
    cy.contains("label", "Email Address")
      .parent()
      .find("input")
      .type("john@example.com");
    cy.contains("label", "Message")
      .parent()
      .find("textarea")
      .type("Test message");
    cy.contains("label", "I agree to the terms")
      .parent()
      .find("input[type='checkbox']")
      .check({ force: true });

    // Submit form
    cy.get("button[type='submit']").click();

    // Should show success message
    cy.get('[data-testid="success-message"]').should("exist");
  });

  it("should handle custom submit button text", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          submitButtonText="Send Message"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    cy.get('button[type="submit"]').should("contain", "Send Message");
  });

  it("should handle custom reset button text", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          resetButtonText="Clear Form"
          showResetButton={true}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    cy.get("button").contains("Clear Form").should("exist");
  });

  it("should handle different spacing options", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          spacing="6"
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Should use the specified spacing
    cy.get("form > div").should("have.class", "space-y-6");
  });

  it("should handle default values", () => {
    const defaultValues = {
      country: "us",
      email: "john@example.com",
      message: "Default message",
      name: "John Doe",
      newsletter: true,
      terms: false,
    };

    mount(
      <TestWrapper>
        <ConfigurableForm
          defaultValues={defaultValues}
          fields={testFields}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    // Check that default values are set
    cy.contains("label", "Full Name")
      .parent()
      .find("input")
      .should("have.value", "John Doe");
    cy.contains("label", "Email Address")
      .parent()
      .find("input")
      .should("have.value", "john@example.com");
    cy.contains("label", "Message")
      .parent()
      .find("textarea")
      .should("have.value", "Default message");
  });

  it("should handle disabled fields", () => {
    const disabledFields = testFields.map((field) => ({
      ...field,
      isDisabled: true,
    }));

    mount(
      <TestWrapper>
        <ConfigurableForm fields={disabledFields} onSubmit={mockOnSubmit} />
      </TestWrapper>,
    );

    // All fields should be disabled
    cy.get("input").should("be.disabled");
    cy.get("textarea").should("be.disabled");
    cy.get("select").should("be.disabled");
  });

  it("should handle custom className", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          className="custom-form-class"
          fields={testFields}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    cy.get(".custom-form-class").should("exist");
  });

  it("should handle submit button props", () => {
    mount(
      <TestWrapper>
        <ConfigurableForm
          fields={testFields}
          submitButtonProps={{
            color: "secondary",
            size: "lg",
          }}
          onSubmit={mockOnSubmit}
        />
      </TestWrapper>,
    );

    cy.get('button[type="submit"]').should("exist");
  });
});
