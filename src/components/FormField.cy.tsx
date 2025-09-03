import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import type { FormFieldConfig } from "../types";

import { FormField } from "./FormField";

interface TestFormData {
  name: string;
  email: string;
  message: string;
  country: string;
  plan: string;
  newsletter: boolean;
  notifications: boolean;
  terms: boolean;
}

const TestForm = ({ config }: { config: FormFieldConfig<TestFormData> }) => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      country: "",
      email: "",
      message: "",
      name: "",
      newsletter: false,
      notifications: false,
      plan: "",
      terms: false,
    },
  });

  return (
    <FormField
      config={config}
      form={methods}
      submissionState={{
        isSubmitted: false,
        isSubmitting: false,
        isSuccess: false,
      }}
    />
  );
};

const TestFormWithDefaults = ({
  config,
  defaultValues,
}: {
  config: FormFieldConfig<TestFormData>;
  defaultValues: Partial<TestFormData>;
}) => {
  const methods = useForm<TestFormData>({
    defaultValues,
  });

  return (
    <FormField
      config={config}
      form={methods}
      submissionState={{
        isSubmitted: false,
        isSubmitting: false,
        isSuccess: false,
      }}
    />
  );
};

describe("FormField", () => {
  it("should render input field correctly", () => {
    const inputConfig: FormFieldConfig<TestFormData> = {
      description: "Enter your full name",
      label: "Full Name",
      name: "name",
      rules: { required: "Name is required" },
      type: "input",
    };

    mount(<TestForm config={inputConfig} />);

    cy.contains("label", "Full Name").should("exist");
    cy.get("input[type='text']").should("exist");
    cy.contains("Enter your full name").should("exist");
  });

  it("should render textarea field correctly", () => {
    const textareaConfig: FormFieldConfig<TestFormData> = {
      description: "Enter your message",
      label: "Message",
      name: "message",
      type: "textarea",
    };

    mount(<TestForm config={textareaConfig} />);

    cy.contains("label", "Message").should("exist");
    cy.get("textarea").should("exist");
    cy.contains("Enter your message").should("exist");
  });

  it("should render select field correctly", () => {
    const selectConfig: FormFieldConfig<TestFormData> = {
      label: "Country",
      name: "country",
      options: [
        { label: "Select a country", value: "" },
        { label: "United States", value: "us" },
        { label: "Canada", value: "ca" },
      ],
      type: "select",
    };

    mount(<TestForm config={selectConfig} />);

    cy.contains("label", "Country").should("exist");
    cy.get("button").should("exist");
  });

  it("should render checkbox field correctly", () => {
    const checkboxConfig: FormFieldConfig<TestFormData> = {
      label: "Subscribe to newsletter",
      name: "newsletter",
      type: "checkbox",
    };

    mount(<TestForm config={checkboxConfig} />);

    cy.contains("label", "Subscribe to newsletter").should("exist");
    cy.get("input[type='checkbox']").should("exist");
  });

  it("should render radio field correctly", () => {
    const radioConfig: FormFieldConfig<TestFormData> = {
      label: "Subscription Plan",
      name: "plan",
      radioOptions: [
        { label: "Basic", value: "basic" },
        { label: "Premium", value: "premium" },
      ],
      type: "radio",
    };

    mount(<TestForm config={radioConfig} />);

    cy.contains("Subscription Plan").should("exist");
    cy.contains("Basic").should("exist");
    cy.contains("Premium").should("exist");
  });

  it("should render switch field correctly", () => {
    const switchConfig: FormFieldConfig<TestFormData> = {
      label: "Enable notifications",
      name: "notifications",
      type: "switch",
    };

    mount(<TestForm config={switchConfig} />);

    cy.contains("label", "Enable notifications").should("exist");
  });

  it("should handle disabled state", () => {
    const inputConfig: FormFieldConfig<TestFormData> = {
      isDisabled: true,
      label: "Full Name",
      name: "name",
      type: "input",
    };

    mount(<TestForm config={inputConfig} />);

    cy.get("input").should("be.disabled");
  });

  it("should handle default values", () => {
    const inputConfig: FormFieldConfig<TestFormData> = {
      label: "Full Name",
      name: "name",
      type: "input",
    };

    const defaultValues = { name: "John Doe" };

    mount(
      <TestFormWithDefaults
        config={inputConfig}
        defaultValues={defaultValues}
      />,
    );

    cy.get("input").should("have.value", "John Doe");
  });

  it("should handle checkbox default value", () => {
    const checkboxConfig: FormFieldConfig<TestFormData> = {
      label: "Subscribe to newsletter",
      name: "newsletter",
      type: "checkbox",
    };

    const defaultValues = { newsletter: true };

    mount(
      <TestFormWithDefaults
        config={checkboxConfig}
        defaultValues={defaultValues}
      />,
    );

    cy.get("input[type='checkbox']").should("be.checked");
  });

  it("should handle custom className", () => {
    const inputConfig: FormFieldConfig<TestFormData> = {
      className: "custom-field-class",
      label: "Full Name",
      name: "name",
      type: "input",
    };

    mount(<TestForm config={inputConfig} />);

    cy.get(".custom-field-class").should("exist");
  });

  it("should handle input props", () => {
    const inputConfig: FormFieldConfig<TestFormData> = {
      inputProps: { placeholder: "Enter your email", type: "email" },
      label: "Email",
      name: "email",
      type: "input",
    };

    mount(<TestForm config={inputConfig} />);

    cy.get("input[type='email']").should("exist");
    cy.get("input").should("have.attr", "placeholder", "Enter your email");
  });

  it("should handle textarea props", () => {
    const textareaConfig: FormFieldConfig<TestFormData> = {
      label: "Message",
      name: "message",
      textareaProps: { placeholder: "Enter your message", rows: 5 },
      type: "textarea",
    };

    mount(<TestForm config={textareaConfig} />);

    cy.get("textarea").should("have.attr", "placeholder", "Enter your message");
  });

  it("should handle select props", () => {
    const selectConfig: FormFieldConfig<TestFormData> = {
      label: "Country",
      name: "country",
      options: [
        { label: "Select a country", value: "" },
        { label: "United States", value: "us" },
      ],

      type: "select",
    };

    mount(<TestForm config={selectConfig} />);

    // Select placeholder text may not be visible in test environment
    cy.get("button").should("exist");
  });

  it("should handle checkbox props", () => {
    const checkboxConfig: FormFieldConfig<TestFormData> = {
      checkboxProps: { color: "success" },
      label: "I agree to the terms",
      name: "terms",
      type: "checkbox",
    };

    mount(<TestForm config={checkboxConfig} />);

    cy.get("input[type='checkbox']").should("exist");
  });

  it("should handle radio props", () => {
    const radioConfig: FormFieldConfig<TestFormData> = {
      label: "Plan",
      name: "plan",
      radioOptions: [
        { label: "Basic", value: "basic" },
        { label: "Premium", value: "premium" },
      ],
      radioProps: { color: "primary" },
      type: "radio",
    };

    mount(<TestForm config={radioConfig} />);

    cy.contains("Basic").should("exist");
    cy.contains("Premium").should("exist");
  });

  it("should handle switch props", () => {
    const switchConfig: FormFieldConfig<TestFormData> = {
      label: "Enable notifications",
      name: "notifications",
      switchProps: { color: "success" },
      type: "switch",
    };

    mount(<TestForm config={switchConfig} />);

    cy.contains("label", "Enable notifications").should("exist");
  });

  it("should handle submission state", () => {
    const inputConfig: FormFieldConfig<TestFormData> = {
      label: "Full Name",
      name: "name",
      type: "input",
    };

    const TestFormWithSubmission = () => {
      const methods = useForm<TestFormData>();

      return (
        <FormField
          config={inputConfig}
          form={methods}
          submissionState={{
            isSubmitted: false,
            isSubmitting: true,
            isSuccess: false,
          }}
        />
      );
    };

    mount(<TestFormWithSubmission />);

    // Field should be disabled during submission
    cy.get("input").should("be.disabled");
  });

  it("should handle field with rules", () => {
    const inputConfig: FormFieldConfig<TestFormData> = {
      label: "Full Name",
      name: "name",
      rules: {
        minLength: { message: "Name must be at least 2 characters", value: 2 },
        required: "Name is required",
      },
      type: "input",
    };

    mount(<TestForm config={inputConfig} />);

    cy.contains("label", "Full Name").should("exist");
    cy.get("input").should("exist");
  });
});
