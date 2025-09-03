import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { CheckboxField } from "./CheckboxField";

interface TestFormData {
  terms: boolean;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      terms: false,
    },
  });

  return (
    <form>
      <CheckboxField
        control={methods.control}
        label="I agree to the terms and conditions"
        name="terms"
      />
    </form>
  );
};

describe("CheckboxField", () => {
  it("should render with label", () => {
    mount(<TestForm />);

    cy.get("label").should(
      "contain.text",
      "I agree to the terms and conditions",
    );
    cy.get("input[type=checkbox]").should("exist");
  });

  it("should handle checkbox toggle", () => {
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
          <CheckboxField
            control={methods.control}
            label="I agree to the terms and conditions"
            name="terms"
            rules={{
              required: "You must agree to the terms",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    cy.get("button").click();
    cy.contains("You must agree to the terms").should("exist");
  });

  it("should handle disabled state", () => {
    const TestFormDisabled = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <CheckboxField
            control={methods.control}
            isDisabled={true}
            label="I agree to the terms and conditions"
            name="terms"
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
          <CheckboxField
            control={methods.control}
            description="Please read the terms carefully"
            label="I agree to the terms and conditions"
            name="terms"
          />
        </form>
      );
    };

    mount(<TestFormWithDescription />);

    cy.contains("Please read the terms carefully").should("exist");
  });
});
