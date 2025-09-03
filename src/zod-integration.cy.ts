import { z } from "zod";

import { createZodFormConfig, isZodAvailable } from "./zod-integration";

describe("zod-integration", () => {
  describe("createZodFormConfig", () => {
    it("should create a valid ZodFormConfig", () => {
      const schema = z.object({
        agree: z.boolean().refine((val) => val === true, "Must agree"),
        email: z.string().email("Invalid email"),
        name: z.string().min(2, "Name must be at least 2 characters"),
      });

      const fields = [
        {
          label: "Name",
          name: "name" as const,
          type: "input" as const,
        },
        {
          inputProps: { type: "email" },
          label: "Email",
          name: "email" as const,
          type: "input" as const,
        },
        {
          label: "I agree",
          name: "agree" as const,
          type: "checkbox" as const,
        },
      ];

      const config = createZodFormConfig(schema, fields);

      expect(config).to.have.property("schema");
      expect(config).to.have.property("fields");
      expect(config.fields).to.have.length(3);
      expect(config.fields[0]).to.have.property("name", "name");
      expect(config.fields[1]).to.have.property("name", "email");
      expect(config.fields[2]).to.have.property("name", "agree");
    });

    it("should create config with default values", () => {
      const schema = z.object({
        agree: z.boolean(),
        email: z.string(),
        name: z.string(),
      });

      const fields = [
        {
          label: "Name",
          name: "name" as const,
          type: "input" as const,
        },
        {
          label: "Email",
          name: "email" as const,
          type: "input" as const,
        },
        {
          label: "I agree",
          name: "agree" as const,
          type: "checkbox" as const,
        },
      ];

      const defaultValues = {
        agree: false,
        email: "john@example.com",
        name: "John Doe",
      };

      const config = createZodFormConfig(schema, fields, defaultValues);

      expect(config).to.have.property("defaultValues");
      expect(config.defaultValues).to.deep.equal(defaultValues);
    });

    it("should handle empty fields array", () => {
      const schema = z.object({});
      const fields: never[] = [];

      const config = createZodFormConfig(schema, fields);

      expect(config.fields).to.have.length(0);
    });

    it("should handle complex field configurations", () => {
      const schema = z.object({
        country: z.string(),
        email: z.string(),
        message: z.string(),
        name: z.string(),
        newsletter: z.boolean(),
        notifications: z.boolean(),
        theme: z.string(),
      });

      const fields = [
        {
          inputProps: { placeholder: "Enter your name" },
          label: "Name",
          name: "name" as const,
          type: "input" as const,
        },
        {
          inputProps: { placeholder: "Enter your email", type: "email" },
          label: "Email",
          name: "email" as const,
          type: "input" as const,
        },
        {
          label: "Message",
          name: "message" as const,
          textareaProps: { placeholder: "Enter your message" },
          type: "textarea" as const,
        },
        {
          label: "Country",
          name: "country" as const,
          options: [
            { label: "Select a country", value: "" },
            { label: "United States", value: "us" },
            { label: "Canada", value: "ca" },
          ],
          type: "select" as const,
        },
        {
          label: "Theme",
          name: "theme" as const,
          radioOptions: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ],
          type: "radio" as const,
        },
        {
          label: "Subscribe to newsletter",
          name: "newsletter" as const,
          type: "checkbox" as const,
        },
        {
          label: "Enable notifications",
          name: "notifications" as const,
          type: "switch" as const,
        },
      ];

      const config = createZodFormConfig(schema, fields);

      expect(config.fields).to.have.length(7);
      expect(config.fields[0]).to.have.property("type", "input");
      expect(config.fields[1]).to.have.property("type", "input");
      expect(config.fields[2]).to.have.property("type", "textarea");
      expect(config.fields[3]).to.have.property("type", "select");
      expect(config.fields[4]).to.have.property("type", "radio");
      expect(config.fields[5]).to.have.property("type", "checkbox");
      expect(config.fields[6]).to.have.property("type", "switch");
    });
  });

  describe("isZodAvailable", () => {
    it("should return true when zod is available", () => {
      // Since we're importing zod in this test file, it should be available
      const available = isZodAvailable();

      expect(available).to.equal(true);
    });

    it("should handle zod availability check", () => {
      // This test verifies the function doesn't throw
      expect(() => isZodAvailable()).to.not.throw();
    });
  });
});
