import { applyServerErrors } from "./applyServerErrors";

describe("applyServerErrors", () => {
  it("should apply server errors to form state", () => {
    const mockSetError = cy.stub().as("setError");
    const serverError = {
      fieldErrors: [
        { message: "Name is required", path: "name" as const },
        { message: "Invalid email format", path: "email" as const },
      ],
    };

    applyServerErrors(mockSetError, serverError);

    cy.get("@setError").should("have.been.calledWith", "name", {
      message: "Name is required",
      type: undefined,
    });
    cy.get("@setError").should("have.been.calledWith", "email", {
      message: "Invalid email format",
      type: undefined,
    });
  });

  it("should handle empty server errors object", () => {
    const mockSetError = cy.stub().as("setError");
    const serverError = {};

    applyServerErrors(mockSetError, serverError);

    cy.get("@setError").should("not.have.been.called");
  });

  it("should handle server errors with nested field names", () => {
    const mockSetError = cy.stub().as("setError");
    const nestedError = {
      fieldErrors: [
        { message: "User name is required", path: "user.name" as const },
        { message: "User email is invalid", path: "user.email" as const },
      ],
    };

    applyServerErrors(mockSetError, nestedError);

    cy.get("@setError").should("have.been.calledWith", "user.name", {
      message: "User name is required",
      type: undefined,
    });
    cy.get("@setError").should("have.been.calledWith", "user.email", {
      message: "User email is invalid",
      type: undefined,
    });
  });
});
