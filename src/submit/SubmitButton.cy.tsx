import React from "react";

import { mount } from "cypress/react";
import { FormProvider, useForm } from "react-hook-form";

import { SubmitButton } from "./SubmitButton";

interface TestFormData {
  name: string;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: TestFormData) => {
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted with data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void methods.handleSubmit(onSubmit)();
        }}
      >
        <input {...methods.register("name")} data-testid="name-input" />
        <SubmitButton>Save</SubmitButton>
      </form>
    </FormProvider>
  );
};

describe("SubmitButton", () => {
  it("should render with default text", () => {
    mount(<TestForm />);

    cy.get("button").should("contain.text", "Save");
    cy.get("button").should("have.attr", "type", "submit");
  });

  it("should show loading state during submission", () => {
    mount(<TestForm />);

    cy.get("button").should("contain.text", "Save");
    cy.get("button").click();

    // Should show loading state
    cy.get("button").should("contain.text", "Submitting");
    cy.get("button").should("be.disabled");

    // Wait for submission to complete
    cy.wait(1100);
    cy.get("button").should("contain.text", "Save");
    cy.get("button").should("not.be.disabled");
  });

  it("should be disabled when form is submitting", () => {
    mount(<TestForm />);

    cy.get("button").click();
    cy.get("button").should("be.disabled");
  });

  it("should show spinner during loading", () => {
    mount(<TestForm />);

    cy.get("button").click();
    cy.get("button").within(() => {
      cy.get("span").should("contain.text", "Submitting");
    });
  });

  it("should handle custom children", () => {
    const CustomButton = () => {
      const methods = useForm<TestFormData>();

      return (
        <FormProvider {...methods}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void methods.handleSubmit(() => {
                // Form submitted successfully
              })();
            }}
          >
            <SubmitButton>Custom Text</SubmitButton>
          </form>
        </FormProvider>
      );
    };

    mount(<CustomButton />);
    cy.get("button").should("contain.text", "Custom Text");
  });
});
