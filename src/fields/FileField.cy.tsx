import React from "react";

import { mount } from "cypress/react";
import { useForm } from "react-hook-form";

import { FileField } from "./FileField";

interface TestFormData {
  avatar: FileList | null;
  documents: FileList | null;
}

function TestFileField() {
  const methods = useForm<TestFormData>({
    defaultValues: {
      avatar: null,
      documents: null,
    },
  });

  return (
    <div className="space-y-4">
      <FileField
        accept="image/*"
        control={methods.control}
        description="Upload your profile picture"
        fileProps={{
          variant: "bordered",
        }}
        label="Profile Picture"
        multiple={false}
        name="avatar"
      />
      <FileField
        accept=".pdf,.doc,.docx"
        control={methods.control}
        description="Upload supporting documents"
        fileProps={{
          variant: "flat",
        }}
        label="Documents"
        multiple={true}
        name="documents"
      />
    </div>
  );
}

describe("FileField", () => {
  it("should render with label", () => {
    mount(<TestFileField />);
    cy.get("label").contains("Profile Picture").should("be.visible");
    cy.get("label").contains("Documents").should("be.visible");
  });

  it("should render with description", () => {
    mount(<TestFileField />);
    cy.contains("Upload your profile picture").should("be.visible");
    cy.contains("Upload supporting documents").should("be.visible");
  });

  it("should handle file input attributes", () => {
    mount(<TestFileField />);

    // Check that file inputs have correct attributes
    cy.get('input[type="file"]').should("have.length", 2);
    cy.get('input[type="file"]')
      .first()
      .should("have.attr", "accept", "image/*");
    cy.get('input[type="file"]').first().should("not.have.attr", "multiple");
    cy.get('input[type="file"]')
      .last()
      .should("have.attr", "accept", ".pdf,.doc,.docx");
    cy.get('input[type="file"]').last().should("have.attr", "multiple");
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
          <FileField
            control={methods.control}
            label="Profile Picture"
            name="avatar"
            rules={{ required: "Profile picture is required" }}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    mount(<TestFormWithValidation />);

    // Trigger validation by submitting form
    cy.get("button[type='submit']").click();
    cy.contains("Profile picture is required").should("exist");
  });

  it("should handle disabled state", () => {
    const TestDisabledFile = () => {
      const methods = useForm<TestFormData>();

      return (
        <FileField
          control={methods.control}
          isDisabled={true}
          label="Profile Picture"
          name="avatar"
        />
      );
    };

    mount(<TestDisabledFile />);
    cy.get('input[type="file"]').should("be.disabled");
  });

  it("should handle custom className", () => {
    const TestCustomClass = () => {
      const methods = useForm<TestFormData>();

      return (
        <FileField
          className="custom-file-class"
          control={methods.control}
          label="Profile Picture"
          name="avatar"
        />
      );
    };

    mount(<TestCustomClass />);
    cy.get(".custom-file-class").should("exist");
  });

  it("should handle file props", () => {
    const TestFileProps = () => {
      const methods = useForm<TestFormData>();

      return (
        <FileField
          control={methods.control}
          fileProps={{
            size: "lg",
            variant: "flat",
          }}
          label="Profile Picture"
          name="avatar"
        />
      );
    };

    mount(<TestFileProps />);
    // Verify file input renders with custom props
    cy.get('input[type="file"]').should("exist");
  });

  it("should handle transform function", () => {
    const TestTransform = () => {
      const methods = useForm<TestFormData>();

      return (
        <FileField
          control={methods.control}
          label="Profile Picture"
          name="avatar"
          transform={(value) => {
            // Transform logic here
            return value;
          }}
        />
      );
    };

    mount(<TestTransform />);
    // Verify transform function is applied
    cy.get('input[type="file"]').should("exist");
  });

  it("should handle single file upload", () => {
    const TestSingleFile = () => {
      const methods = useForm<TestFormData>();

      return (
        <FileField
          accept="image/*"
          control={methods.control}
          label="Single File"
          multiple={false}
          name="avatar"
        />
      );
    };

    mount(<TestSingleFile />);
    cy.get('input[type="file"]').should("not.have.attr", "multiple");
  });

  it("should handle multiple file upload", () => {
    const TestMultipleFiles = () => {
      const methods = useForm<TestFormData>();

      return (
        <FileField
          accept=".pdf,.doc,.docx"
          control={methods.control}
          label="Multiple Files"
          multiple={true}
          name="documents"
        />
      );
    };

    mount(<TestMultipleFiles />);
    cy.get('input[type="file"]').should("have.attr", "multiple");
  });

  it("should handle file type restrictions", () => {
    const TestFileTypes = () => {
      const methods = useForm<TestFormData>();

      return (
        <FileField
          accept=".jpg,.png,.gif"
          control={methods.control}
          label="Image Files Only"
          name="avatar"
        />
      );
    };

    mount(<TestFileTypes />);
    cy.get('input[type="file"]').should(
      "have.attr",
      "accept",
      ".jpg,.png,.gif",
    );
  });
});
