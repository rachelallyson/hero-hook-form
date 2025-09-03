import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { RadioGroupField } from "./RadioGroupField";

interface TestFormData {
  preference: string;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      preference: "",
    },
  });

  const options = [
    { label: "Light Theme", value: "light" },
    { label: "Dark Theme", value: "dark" },
    { label: "Auto", value: "auto" },
  ];

  return (
    <form>
      <RadioGroupField
        control={methods.control}
        label="Theme Preference"
        name="preference"
        options={options}
      />
    </form>
  );
};

describe("RadioGroupField", () => {
  it("should render with label and options", () => {
    mount(<TestForm />);

    cy.contains("Theme Preference").should("exist");
    cy.get("input[type=radio]").should("have.length", 3);
    cy.get("input[type=radio]").first().should("have.value", "light");
  });

  it("should handle radio selection", () => {
    mount(<TestForm />);

    cy.get("input[type=radio]").first().click();
    cy.get("input[type=radio]").first().should("be.checked");
    cy.get("input[type=radio]").last().click();
    cy.get("input[type=radio]").first().should("not.be.checked");
    cy.get("input[type=radio]").last().should("be.checked");
  });

  it("should show validation errors", () => {
    const TestFormWithValidation = () => {
      const methods = useForm<TestFormData>();
      const options = [
        { label: "Light Theme", value: "light" },
        { label: "Dark Theme", value: "dark" },
      ];

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit(() => {
              // Form submitted successfully
            })();
          }}
        >
          <RadioGroupField
            control={methods.control}
            label="Theme Preference"
            name="preference"
            options={options}
            rules={{
              required: "Please select a theme preference",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    cy.get("button").click();
    cy.contains("Please select a theme preference").should("exist");
  });

  it("should handle disabled state", () => {
    const TestFormDisabled = () => {
      const methods = useForm<TestFormData>();
      const options = [{ label: "Light Theme", value: "light" }];

      return (
        <form>
          <RadioGroupField
            control={methods.control}
            isDisabled={true}
            label="Theme Preference"
            name="preference"
            options={options}
          />
        </form>
      );
    };

    mount(<TestFormDisabled />);

    cy.get("input[type=radio]").should("be.disabled");
  });

  it("should handle custom description", () => {
    const TestFormWithDescription = () => {
      const methods = useForm<TestFormData>();
      const options = [{ label: "Light Theme", value: "light" }];

      return (
        <form>
          <RadioGroupField
            control={methods.control}
            description="Choose your preferred theme"
            label="Theme Preference"
            name="preference"
            options={options}
          />
        </form>
      );
    };

    mount(<TestFormWithDescription />);

    cy.contains("Choose your preferred theme").should("exist");
  });
});
