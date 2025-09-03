import { applyServerErrors } from "./applyServerErrors";
import { useForm } from "react-hook-form";
import { mount } from "cypress/react";
import React from "react";

interface TestFormData {
  name: string;
  email: string;
  age: number;
}

const TestComponent = () => {
  const methods = useForm<TestFormData>({
    defaultValues: {
      name: "",
      email: "",
      age: 0,
    },
  });

  const handleServerError = () => {
    const serverError = {
      fieldErrors: [
        { path: "name" as const, message: "Name is required" },
        { path: "email" as const, message: "Invalid email format" },
        { path: "age" as const, message: "Age must be a number" },
      ],
    };

    applyServerErrors(methods.setError, serverError);
  };

  return (
    <div>
      <button onClick={handleServerError} data-testid="trigger-error">
        Trigger Server Error
      </button>
      <div data-testid="name-error">
        {methods.formState.errors.name?.message}
      </div>
      <div data-testid="email-error">
        {methods.formState.errors.email?.message}
      </div>
      <div data-testid="age-error">
        {methods.formState.errors.age?.message}
      </div>
    </div>
  );
};

describe("applyServerErrors", () => {
  it("should apply server errors to form state", () => {
    mount(<TestComponent />);

    cy.get("[data-testid=trigger-error]").click();

    cy.get("[data-testid=name-error]").should("contain.text", "Name is required");
    cy.get("[data-testid=email-error]").should("contain.text", "Invalid email format");
    cy.get("[data-testid=age-error]").should("contain.text", "Age must be a number");
  });

  it("should handle empty server errors object", () => {
    const TestComponentEmpty = () => {
      const methods = useForm<TestFormData>();
      const handleEmptyError = () => {
        applyServerErrors(methods.setError, {});
      };

      return (
        <div>
          <button onClick={handleEmptyError} data-testid="trigger-empty-error">
            Trigger Empty Error
          </button>
        </div>
      );
    };

    mount(<TestComponentEmpty />);
    cy.get("[data-testid=trigger-empty-error]").click();
    // Should not throw any errors
  });

  it("should handle server errors with nested field names", () => {
    const TestComponentNested = () => {
      const methods = useForm<TestFormData>();
      const handleNestedError = () => {
        const nestedError = {
          fieldErrors: [
            { path: "name" as const, message: "User name is required" },
            { path: "email" as const, message: "User email is invalid" },
          ],
        };
        applyServerErrors(methods.setError, nestedError);
      };

      return (
        <div>
          <button onClick={handleNestedError} data-testid="trigger-nested-error">
            Trigger Nested Error
          </button>
        </div>
      );
    };

    mount(<TestComponentNested />);
    cy.get("[data-testid=trigger-nested-error]").click();
    // Should handle nested field names gracefully
  });
});
