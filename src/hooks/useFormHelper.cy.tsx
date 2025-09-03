import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { useFormHelper } from "./useFormHelper";

interface TestFormData {
  name: string;
  email: string;
}

const TestComponent = ({
  defaultValues,
  onError,
  onSubmit,
  onSuccess,
}: {
  defaultValues?: Partial<TestFormData>;
  onError?: (error: { message: string }) => void;
  onSubmit: (data: TestFormData) => void | Promise<void>;
  onSuccess?: (data: TestFormData) => void;
}) => {
  const { form, handleSubmit, resetForm, submissionState } = useFormHelper({
    defaultValues,
    onError,
    onSubmit,
    onSuccess,
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <input {...form.register("name")} placeholder="Name" />
        <input {...form.register("email")} placeholder="Email" />
        <button disabled={submissionState.isSubmitting} type="submit">
          {submissionState.isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button type="button" onClick={resetForm}>
          Reset
        </button>
      </form>
      <div data-testid="submission-state">
        {submissionState.isSubmitting && <span>Submitting</span>}
        {submissionState.isSubmitted && <span>Submitted</span>}
        {submissionState.isSuccess && <span>Success</span>}
      </div>
    </div>
  );
};

describe("useFormHelper", () => {
  let mockOnSubmit: ReturnType<typeof cy.stub>;
  let mockOnError: ReturnType<typeof cy.stub>;
  let mockOnSuccess: ReturnType<typeof cy.stub>;

  beforeEach(() => {
    mockOnSubmit = cy.stub().as("onSubmit");
    mockOnError = cy.stub().as("onError");
    mockOnSuccess = cy.stub().as("onSuccess");
  });

  it("should initialize with default submission state", () => {
    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    cy.get("[data-testid='submission-state']").should(
      "not.contain",
      "Submitting",
    );
    cy.get("[data-testid='submission-state']").should(
      "not.contain",
      "Submitted",
    );
    cy.get("[data-testid='submission-state']").should("not.contain", "Success");
  });

  it("should handle form submission", () => {
    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");

    // Submit form
    cy.get("button[type='submit']").click();

    cy.get("@onSubmit").should("have.been.calledOnce");
    cy.get("@onSubmit").should("have.been.calledWith", {
      email: "john@example.com",
      name: "John Doe",
    });
  });

  it("should handle successful submission", () => {
    // Use a sync function instead of returning Promise
    const successOnSubmit = (data: TestFormData) => {
      mockOnSubmit(data);
      // Don't return anything for void function
    };

    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={successOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill and submit form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");
    cy.get("button[type='submit']").click();

    cy.get("@onSubmit").should("have.been.calledOnce");
  });

  it("should handle submission errors", () => {
    const errorOnSubmit = (data: TestFormData) => {
      mockOnSubmit(data);
      throw new Error("Submission failed");
    };

    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={errorOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill and submit form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");
    cy.get("button[type='submit']").click();

    cy.get("@onSubmit").should("have.been.calledOnce");
    cy.get("@onError").should("have.been.calledOnce");
  });

  it("should handle async submission errors", () => {
    // Use a proper async function type
    const asyncErrorOnSubmit = async (data: TestFormData): Promise<void> => {
      await Promise.resolve(); // Add await to satisfy eslint
      mockOnSubmit(data);
      throw new Error("Async submission failed");
    };

    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={asyncErrorOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill and submit form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");
    cy.get("button[type='submit']").click();

    cy.get("@onSubmit").should("have.been.calledOnce");
    cy.get("@onError").should("have.been.calledOnce");
  });

  it("should handle form reset", () => {
    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");

    // Reset form
    cy.get("button").contains("Reset").click();

    // Fields should be cleared
    cy.get("input[placeholder='Name']").should("have.value", "");
    cy.get("input[placeholder='Email']").should("have.value", "");
  });

  it("should handle default values", () => {
    const defaultValues = {
      email: "default@example.com",
      name: "Default Name",
    };

    mount(
      <TestComponent
        defaultValues={defaultValues}
        onError={mockOnError}
        onSubmit={mockOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Should have default values
    cy.get("input[placeholder='Name']").should("have.value", "Default Name");
    cy.get("input[placeholder='Email']").should(
      "have.value",
      "default@example.com",
    );
  });

  it("should disable submit button during submission", () => {
    // Use a function that returns Promise<void> explicitly
    const slowOnSubmit = async (data: TestFormData): Promise<void> => {
      mockOnSubmit(data);
      await new Promise((resolve) => setTimeout(resolve, 100));
    };

    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={slowOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");

    // Submit form
    cy.get("button[type='submit']").click();

    // Button should be disabled during submission
    cy.get("button[type='submit']").should("be.disabled");
    cy.get("button[type='submit']").should("contain", "Submitting...");
  });

  it("should handle onSuccess callback", () => {
    // Use sync function for simple success case
    const successOnSubmit = (data: TestFormData) => {
      mockOnSubmit(data);
      // Success is handled by the hook internally
    };

    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={successOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill and submit form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");
    cy.get("button[type='submit']").click();

    cy.get("@onSubmit").should("have.been.calledOnce");
    cy.get("@onSuccess").should("have.been.calledOnce");
  });

  it("should handle submission state transitions", () => {
    // Use async function with proper typing
    const delayedOnSubmit = async (data: TestFormData): Promise<void> => {
      mockOnSubmit(data);
      await new Promise((resolve) => setTimeout(resolve, 50));
    };

    mount(
      <TestComponent
        onError={mockOnError}
        onSubmit={delayedOnSubmit}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill form
    cy.get("input[placeholder='Name']").type("John Doe");
    cy.get("input[placeholder='Email']").type("john@example.com");

    // Submit form
    cy.get("button[type='submit']").click();

    // Should show submitting state
    cy.get("[data-testid='submission-state']").should("contain", "Submitting");

    // Wait for submission to complete
    cy.wait(100);
    cy.get("[data-testid='submission-state']").should("contain", "Success");
  });

  it("should handle custom form methods", () => {
    const CustomTestComponent = () => {
      const customMethods = useForm<TestFormData>({
        defaultValues: { email: "custom@test.com", name: "Custom" },
      });

      const { handleSubmit, submissionState } = useFormHelper({
        methods: customMethods,
        onError: mockOnError,
        onSubmit: mockOnSubmit,
        onSuccess: mockOnSuccess,
      });

      return (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <input {...customMethods.register("name")} placeholder="Name" />
            <button disabled={submissionState.isSubmitting} type="submit">
              Submit
            </button>
          </form>
        </div>
      );
    };

    mount(<CustomTestComponent />);

    cy.get("input[placeholder='Name']").should("have.value", "Custom");
    cy.get("button[type='submit']").click();
    cy.get("@onSubmit").should("have.been.calledOnce");
  });
});
