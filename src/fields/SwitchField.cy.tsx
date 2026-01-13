import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SwitchField } from "./SwitchField";
import { FormFieldHelpers, createBasicFormBuilder } from "../builders/BasicFormBuilder";
import { ZodForm } from "../components/ZodForm";
import { uncheckSwitch, submitForm } from "../cypress/helpers";

interface TestFormData {
  notifications: boolean;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      notifications: false,
    },
  });

  return (
    <form>
      <SwitchField
        control={methods.control}
        label="Enable notifications"
        name="notifications"
      />
    </form>
  );
};

describe("SwitchField", () => {
  it("should render with label", () => {
    mount(<TestForm />);

    cy.get("label").should("contain.text", "Enable notifications");
    cy.get("input[type=checkbox]").should("exist");
  });

  it("should handle switch toggle", () => {
    mount(<TestForm />);

    cy.get("input[type=checkbox]").should("not.be.checked");
    cy.get('input[type="checkbox"]').check();
    cy.get("input[type=checkbox]").should("be.checked");
    uncheckSwitch();
    cy.get("input[type=checkbox]").should("not.be.checked");
  });

  it("should show validation errors", () => {
    const TestFormWithValidation = () => {
      const methods = useForm<TestFormData>();

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit(() => {
              // Form submitted successfully
            })();
          }}
        >
          <SwitchField
            control={methods.control}
            label="Enable notifications"
            name="notifications"
            rules={{
              required: "Please enable notifications",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    submitForm();
    cy.contains("Please enable notifications").should("exist");
  });

  it("should handle disabled state", () => {
    const TestFormDisabled = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <SwitchField
            control={methods.control}
            isDisabled={true}
            label="Enable notifications"
            name="notifications"
          />
        </form>
      );
    };

    mount(<TestFormDisabled />);

    cy.get("input[type=checkbox]").should("be.disabled");
  });

  it("should handle custom description", () => {
    const TestFormWithDescription = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <SwitchField
            control={methods.control}
            description="Receive updates about new features"
            label="Enable notifications"
            name="notifications"
          />
        </form>
      );
    };

    mount(<TestFormWithDescription />);

    cy.contains("Receive updates about new features").should("exist");
  });

  it("should work with FormFieldHelpers.switch and description", () => {
    const testSchema = z.object({
      notifications: z.boolean(),
    });

    const handleSubmit = cy.stub().as("handleSubmit");

    mount(
      <ZodForm
        config={{
          schema: testSchema,
          fields: [
            FormFieldHelpers.switch(
              "notifications",
              "Enable notifications",
              "Receive email notifications",
            ),
          ],
        }}
        onSubmit={handleSubmit}
      />,
    );

    // Check if form renders
    cy.get("form").should("exist");

    // Check if switch label exists
    cy.contains("Enable notifications").should("exist");

    // Check if description exists
    cy.contains("Receive email notifications").should("exist");

    // Check if switch input exists
    cy.get('input[type="checkbox"]').should("exist");
  });

  it("should work with FormFieldHelpers.switch without description", () => {
    const testSchema = z.object({
      darkMode: z.boolean(),
    });

    const handleSubmit = cy.stub().as("handleSubmit");

    mount(
      <ZodForm
        config={{
          schema: testSchema,
          fields: [FormFieldHelpers.switch("darkMode", "Dark mode")],
        }}
        onSubmit={handleSubmit}
      />,
    );

    // Check if form renders
    cy.get("form").should("exist");

    // Check if switch label exists
    cy.contains("Dark mode").should("exist");

    // Check if switch input exists
    cy.get('input[type="checkbox"]').should("exist");
  });

  it("should work with BasicFormBuilder.switch and description", () => {
    const testSchema = z.object({
      notifications: z.boolean(),
    });

    const fields = createBasicFormBuilder()
      .switch("notifications", "Enable notifications", "Receive email notifications")
      .build();

    const handleSubmit = cy.stub().as("handleSubmit");

    mount(
      <ZodForm
        config={{
          schema: testSchema,
          fields,
        }}
        onSubmit={handleSubmit}
      />,
    );

    // Check if form renders
    cy.get("form").should("exist");

    // Check if switch label exists
    cy.contains("Enable notifications").should("exist");

    // Check if description exists
    cy.contains("Receive email notifications").should("exist");

    // Check if switch input exists
    cy.get('input[type="checkbox"]').should("exist");
  });
});
