import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { InputField } from "./InputField";

interface TestFormData {
  email: string;
  name: string;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      email: "",
      name: "",
    },
  });

  return (
    <form>
      <InputField
        control={methods.control}
        inputProps={{
          placeholder: "Enter your full name",
        }}
        label="Full Name"
        name="name"
      />
      <InputField
        control={methods.control}
        inputProps={{
          placeholder: "Enter your email",
          type: "email",
        }}
        label="Email Address"
        name="email"
      />
    </form>
  );
};

describe("InputField", () => {
  it("should render with label and placeholder", () => {
    mount(<TestForm />);

    cy.get("label").first().should("contain.text", "Full Name");
    cy.get("input")
      .first()
      .should("have.attr", "placeholder", "Enter your full name");
  });

  it("should handle user input", () => {
    mount(<TestForm />);

    const testName = "John Doe";

    cy.get("input").first().type(testName);
    cy.get("input").first().should("have.value", testName);
  });

  it("should handle different input types", () => {
    mount(<TestForm />);

    cy.get("input").last().should("have.attr", "type", "email");
    cy.get("input")
      .last()
      .should("have.attr", "placeholder", "Enter your email");
  });

  it("should show validation errors", () => {
    const TestFormWithValidation = () => {
      const methods = useForm<TestFormData>();

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit((data: TestFormData) => {
              // Test validation - this function is called when form is valid
              expect(data).to.be.an("object");
            })();
          }}
        >
          <InputField
            control={methods.control}
            label="Full Name"
            name="name"
            rules={{
              required: "Name is required",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    cy.get("button").click();
    cy.contains("Name is required").should("exist");
  });

  it("should handle disabled state", () => {
    const TestFormDisabled = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <InputField
            control={methods.control}
            isDisabled={true}
            label="Full Name"
            name="name"
          />
        </form>
      );
    };

    mount(<TestFormDisabled />);

    cy.get("input").should("be.disabled");
  });

  it("should handle required field", () => {
    const TestFormRequired = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <InputField
            control={methods.control}
            inputProps={{
              isRequired: true,
            }}
            label="Full Name"
            name="name"
          />
        </form>
      );
    };

    mount(<TestFormRequired />);

    // Check if the label contains the required indicator
    cy.get("label").should("contain.text", "Full Name");
    // The required indicator might be in a different element or styled differently
    // Let's check if there's a required indicator anywhere in the component
    cy.get("[data-required]").should("exist");
  });

  it("should handle custom description", () => {
    const TestFormWithDescription = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <InputField
            control={methods.control}
            description="Enter your legal name as it appears on your ID"
            label="Full Name"
            name="name"
          />
        </form>
      );
    };

    mount(<TestFormWithDescription />);

    cy.contains("Enter your legal name as it appears on your ID").should(
      "exist",
    );
  });
});
