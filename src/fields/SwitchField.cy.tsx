import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { SwitchField } from "./SwitchField";

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
    cy.get("input[type=checkbox]").click();
    cy.get("input[type=checkbox]").should("be.checked");
    cy.get("input[type=checkbox]").click();
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

    cy.get("button").click();
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
});
