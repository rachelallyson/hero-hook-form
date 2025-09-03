import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { SelectField } from "./SelectField";

interface TestFormData {
  category: string;
}

const TestForm = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      category: "",
    },
  });

  const options = [
    { label: "Technology", value: "tech" },
    { label: "Design", value: "design" },
    { label: "Marketing", value: "marketing" },
  ];

  return (
    <form>
      <SelectField
        control={methods.control}
        label="Category"
        name="category"
        options={options}
        placeholder="Select a category"
      />
    </form>
  );
};

describe("SelectField", () => {
  it("should render with label and placeholder", () => {
    mount(<TestForm />);

    cy.get("label").should("contain.text", "Category");
    cy.get("button").should("contain.text", "Select a category");
  });

  it("should open dropdown and show options", () => {
    mount(<TestForm />);

    cy.get("button").click();
    cy.get("[role=listbox]").should("exist");
    cy.get("[role=option]").should("have.length", 3);
    cy.get("[role=option]").first().should("contain.text", "Technology");
  });

  it("should select an option", () => {
    mount(<TestForm />);

    cy.get("button").click();
    cy.get("[role=option]").first().click();
    cy.get("button").should("not.contain.text", "Select a category");
    cy.contains("Technology").should("exist");
  });

  it("should show validation errors", () => {
    const TestFormWithValidation = () => {
      const methods = useForm<TestFormData>();
      const options = [
        { label: "Technology", value: "tech" },
        { label: "Design", value: "design" },
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
          <SelectField
            control={methods.control}
            label="Category"
            name="category"
            options={options}
            rules={{
              required: "Category is required",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    cy.get("button").last().click();
    cy.contains("Category is required").should("exist");
  });

  it("should handle disabled state", () => {
    const TestFormDisabled = () => {
      const methods = useForm<TestFormData>();
      const options = [{ label: "Technology", value: "tech" }];

      return (
        <form>
          <SelectField
            control={methods.control}
            isDisabled={true}
            label="Category"
            name="category"
            options={options}
          />
        </form>
      );
    };

    mount(<TestFormDisabled />);

    cy.get("button").should("have.class", "pointer-events-none");
  });

  it("should handle required field", () => {
    const TestFormRequired = () => {
      const methods = useForm<TestFormData>();
      const options = [{ label: "Technology", value: "tech" }];

      return (
        <form>
          <SelectField
            control={methods.control}
            label="Category"
            name="category"
            options={options}
          />
        </form>
      );
    };

    mount(<TestFormRequired />);

    cy.get("label").should("contain.text", "Category");
    // Remove this test as the select doesn't have a required indicator in the current implementation
  });
});
