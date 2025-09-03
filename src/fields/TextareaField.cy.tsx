import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { TextareaField } from "./TextareaField";

interface TestFormData {
  description: string;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      description: "",
    },
  });

  return (
    <form>
      <TextareaField
        control={methods.control}
        label="Description"
        name="description"
        textareaProps={{
          placeholder: "Enter description",
        }}
      />
    </form>
  );
};

describe("TextareaField", () => {
  it("should render with label and placeholder", () => {
    mount(<TestForm />);

    cy.get("label").should("contain.text", "Description");
    cy.get("textarea").should("have.attr", "placeholder", "Enter description");
  });

  it("should handle user input", () => {
    mount(<TestForm />);

    const testText = "This is a test description";

    cy.get("textarea").first().should("be.visible");
    cy.get("textarea").first().click({ force: true });
    cy.get("textarea").first().type(testText, { force: true });
    cy.get("textarea").first().should("have.value", testText);
  });

  it("should show validation errors", () => {
    const TestFormWithValidation = () => {
      const methods = useForm<TestFormData>({
        defaultValues: {
          description: "",
        },
      });

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void methods.handleSubmit(() => {
              // Form submitted successfully
            })();
          }}
        >
          <TextareaField
            control={methods.control}
            label="Description"
            name="description"
            rules={{
              required: "Description is required",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    cy.get("button").click();
    cy.contains("Description is required").should("exist");
  });

  it("should handle disabled state", () => {
    const TestFormDisabled = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <TextareaField
            control={methods.control}
            isDisabled={true}
            label="Description"
            name="description"
          />
        </form>
      );
    };

    mount(<TestFormDisabled />);

    cy.get("textarea").should("be.disabled");
  });

  it("should handle required field", () => {
    const TestFormRequired = () => {
      const methods = useForm<TestFormData>();

      return (
        <form>
          <TextareaField
            control={methods.control}
            label="Description"
            name="description"
            textareaProps={{
              isRequired: true,
            }}
          />
        </form>
      );
    };

    mount(<TestFormRequired />);

    cy.get("label").should("contain.text", "Description");
    cy.get("[data-required]").should("exist");
  });
});
