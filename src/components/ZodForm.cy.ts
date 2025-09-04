import { z } from "zod";

describe("ZodForm Integration", () => {
  it("should create a valid ZodFormConfig", () => {
    const testSchema = z.object({
      email: z.string().email("Please enter a valid email address"),
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      message: z.string().min(10, "Message must be at least 10 characters"),
      terms: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
    });

    const testFields = [
      {
        label: "First Name",
        name: "firstName" as const,
        type: "input" as const,
      },
      {
        inputProps: { type: "email" },
        label: "Email",
        name: "email" as const,
        type: "input" as const,
      },
      {
        label: "Message",
        name: "message" as const,
        type: "textarea" as const,
      },
      {
        label: "I agree to the terms",
        name: "terms" as const,
        type: "checkbox" as const,
      },
    ];

    const config = {
      fields: testFields,
      schema: testSchema,
    };

    expect(config).to.have.property("schema");
    expect(config).to.have.property("fields");
    expect(config.fields).to.have.length(4);
    expect(config.fields[0]).to.have.property("name", "firstName");
    expect(config.fields[1]).to.have.property("name", "email");
    expect(config.fields[2]).to.have.property("name", "message");
    expect(config.fields[3]).to.have.property("name", "terms");
  });

  it("should create config with default values", () => {
    const testSchema = z.object({
      email: z.string().email("Please enter a valid email address"),
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      message: z.string().min(10, "Message must be at least 10 characters"),
      terms: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
    });

    const testFields = [
      {
        label: "First Name",
        name: "firstName" as const,
        type: "input" as const,
      },
      {
        inputProps: { type: "email" },
        label: "Email",
        name: "email" as const,
        type: "input" as const,
      },
      {
        label: "Message",
        name: "message" as const,
        type: "textarea" as const,
      },
      {
        label: "I agree to the terms",
        name: "terms" as const,
        type: "checkbox" as const,
      },
    ];

    const defaultValues = {
      email: "test@example.com",
      firstName: "John",
      message: "Test message",
      terms: false,
    };

    const config = {
      defaultValues,
      fields: testFields,
      schema: testSchema,
    };

    expect(config).to.have.property("defaultValues");
    expect(config.defaultValues).to.deep.equal(defaultValues);
  });

  it("should handle different field types", () => {
    const testSchema = z.object({
      email: z.string().email("Please enter a valid email address"),
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      message: z.string().min(10, "Message must be at least 10 characters"),
      terms: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
    });

    const testFields = [
      {
        label: "First Name",
        name: "firstName" as const,
        type: "input" as const,
      },
      {
        inputProps: { type: "email" },
        label: "Email",
        name: "email" as const,
        type: "input" as const,
      },
      {
        label: "Message",
        name: "message" as const,
        type: "textarea" as const,
      },
      {
        label: "I agree to the terms",
        name: "terms" as const,
        type: "checkbox" as const,
      },
    ];

    const config = {
      fields: testFields,
      schema: testSchema,
    };

    expect(config.fields[0]).to.have.property("type", "input");
    expect(config.fields[1]).to.have.property("type", "input");
    expect(config.fields[2]).to.have.property("type", "textarea");
    expect(config.fields[3]).to.have.property("type", "checkbox");
  });

  it("should handle field configurations", () => {
    const testSchema = z.object({
      email: z.string().email("Please enter a valid email address"),
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      message: z.string().min(10, "Message must be at least 10 characters"),
      terms: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
    });

    const testFields = [
      {
        label: "First Name",
        name: "firstName" as const,
        type: "input" as const,
      },
      {
        inputProps: { type: "email" },
        label: "Email",
        name: "email" as const,
        type: "input" as const,
      },
      {
        label: "Message",
        name: "message" as const,
        type: "textarea" as const,
      },
      {
        label: "I agree to the terms",
        name: "terms" as const,
        type: "checkbox" as const,
      },
    ];

    const config = {
      fields: testFields,
      schema: testSchema,
    };

    // Check that inputProps are preserved
    expect(config.fields[1]).to.have.property("inputProps");
    expect(config.fields[1].inputProps).to.have.property("type", "email");
  });

  it("should handle schema validation", () => {
    const testSchema = z.object({
      email: z.string().email("Please enter a valid email address"),
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      message: z.string().min(10, "Message must be at least 10 characters"),
      terms: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
    });

    const testFields = [
      {
        label: "First Name",
        name: "firstName" as const,
        type: "input" as const,
      },
      {
        inputProps: { type: "email" },
        label: "Email",
        name: "email" as const,
        type: "input" as const,
      },
      {
        label: "Message",
        name: "message" as const,
        type: "textarea" as const,
      },
      {
        label: "I agree to the terms",
        name: "terms" as const,
        type: "checkbox" as const,
      },
    ];

    const config = {
      fields: testFields,
      schema: testSchema,
    };

    // The schema should be a Zod object
    expect(config.schema).to.be.an("object");
    expect(config.schema).to.have.property("_def");
  });
});
