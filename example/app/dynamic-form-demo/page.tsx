"use client";

import React from "react";
import { z } from "zod";
import {
  ZodForm,
  createAdvancedBuilder,
  createField,
  createFieldArrayItemBuilder,
} from "@rachelallyson/hero-hook-form";

// Example 1: Dynamic Form with Conditional Fields and Field Arrays
const userFormSchema = z.object({
  addresses: z
    .array(
      z.object({
        city: z.string().min(1, "City is required"),
        street: z.string().min(1, "Street is required"),
        zip: z.string().min(5, "ZIP code must be at least 5 characters"),
      }),
    )
    .optional(),
  contactMethod: z.enum(["email", "phone", "both"]),
  email: z.string().email("Please enter a valid email"),
  emergencyContacts: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(10, "Phone must be at least 10 digits"),
        relationship: z.string().min(1, "Relationship is required"),
      }),
    )
    .optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
});

type UserForm = z.infer<typeof userFormSchema>;

// Using Advanced Builder
const userFormFields = createAdvancedBuilder<UserForm>()
  .field({
    type: "input",
    name: "firstName",
    label: "First Name",
    props: { placeholder: "Enter your first name" },
  })
  .field({
    type: "input",
    name: "lastName",
    label: "Last Name",
    props: { placeholder: "Enter your last name" },
  })
  .field({
    type: "input",
    name: "email",
    label: "Email Address",
    props: { placeholder: "Enter your email", type: "email" },
  })
  .field({
    type: "select",
    name: "contactMethod",
    label: "Preferred Contact Method",
    options: [
      { label: "Email Only", value: "email" },
      { label: "Phone Only", value: "phone" },
      { label: "Both Email and Phone", value: "both" },
    ],
  })
  .conditionalField(
    "phone",
    (data) => data.contactMethod === "phone" || data.contactMethod === "both",
    createField({
      type: "input",
      name: "phone",
      label: "Phone Number",
      props: { placeholder: "Enter your phone number", type: "tel" },
    }),
  )
  .fieldArray(
    "addresses",
    "Addresses",
    createFieldArrayItemBuilder<{ street: string; city: string; zip: string }>()
      .field({ type: "input", name: "street", label: "Street Address" })
      .field({ type: "input", name: "city", label: "City" })
      .field({ type: "input", name: "zip", label: "ZIP Code" })
      .build() as any,
    {
      addButtonText: "Add Address",
      max: 3,
      min: 0,
      removeButtonText: "Remove Address",
    },
  )
  .fieldArray(
    "emergencyContacts",
    "Emergency Contacts",
    createFieldArrayItemBuilder<{
      name: string;
      relationship: string;
      phone: string;
    }>()
      .field({ type: "input", name: "name", label: "Contact Name" })
      .field({ type: "input", name: "relationship", label: "Relationship" })
      .field({
        type: "input",
        name: "phone",
        label: "Phone Number",
        props: { type: "tel" },
      })
      .build() as any,
    {
      addButtonText: "Add Emergency Contact",
      max: 5,
      min: 1,
      removeButtonText: "Remove Contact",
    },
  )
  .build();

// Example 2: Product Form with Advanced Builder
const productFormSchema = z.object({
  category: z.enum(["electronics", "clothing", "books", "home"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  inStock: z.boolean(),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  price: z.number().min(0, "Price must be positive"),
  tags: z.string().optional(),
});

const productFormConfig = createAdvancedBuilder<ProductForm>()
  .field({
    type: "input",
    name: "name",
    label: "Product Name",
    props: { placeholder: "Enter product name" },
  })
  .field({
    type: "textarea",
    name: "description",
    label: "Description",
    props: { placeholder: "Enter product description" },
  })
  .field({
    type: "input",
    name: "price",
    label: "Price",
    props: { placeholder: "Enter price", type: "number" },
  })
  .field({
    type: "select",
    name: "category",
    label: "Category",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Books", value: "books" },
      { label: "Home & Garden", value: "home" },
    ],
  })
  .field({ type: "checkbox", name: "inStock", label: "In Stock" })
  .field({
    type: "input",
    name: "tags",
    label: "Tags",
    props: { placeholder: "Enter tags separated by commas" },
  })
  .build();

const productFormConfigWithSchema = {
  fields: productFormConfig,
  schema: productFormSchema,
};

interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: "electronics" | "clothing" | "books" | "home";
  inStock: boolean;
  tags?: string;
}

export default function DynamicFormDemo() {
  const handleUserSubmit = async (data: UserForm) => {
    console.log("User form submitted:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleProductSubmit = async (data: ProductForm) => {
    console.log("Product form submitted:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dynamic Form Features Demo
        </h1>
        <p className="text-lg text-gray-600">
          Showcasing conditional fields, field arrays, and type-inferred forms
        </p>
      </div>

      {/* Example 1: Advanced Dynamic Form */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Advanced Dynamic Form
        </h2>
        <p className="text-gray-600 mb-6">
          This form demonstrates conditional fields, field arrays, and dynamic
          sections.
        </p>

        <ZodForm
          columns={2}
          config={{
            fields: userFormFields,
            schema: userFormSchema,
          }}
          layout="grid"
          showResetButton={true}
          subtitle="Complete your profile with dynamic fields"
          title="User Registration"
          onSubmit={handleUserSubmit}
        />
      </section>

      {/* Example 2: Type-Inferred Form */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Type-Inferred Form
        </h2>
        <p className="text-gray-600 mb-6">
          This form is built using the type-inferred builder for automatic
          schema generation.
        </p>

        <ZodForm
          columns={2}
          config={productFormConfigWithSchema}
          layout="grid"
          showResetButton={true}
          subtitle="Add a new product with auto-generated validation"
          title="Product Information"
          onSubmit={handleProductSubmit}
        />
      </section>

      {/* Feature Highlights */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          New Features Demonstrated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">
              Conditional Fields
            </h3>
            <p className="text-sm text-gray-600">
              Phone field appears only when &quot;Phone&quot; or
              &quot;Both&quot; contact methods are selected.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Field Arrays</h3>
            <p className="text-sm text-gray-600">
              Dynamic address and emergency contact sections with add/remove
              functionality.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Type Inference</h3>
            <p className="text-sm text-gray-600">
              Automatic schema generation and type safety with the inferred
              builder.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Enhanced State</h3>
            <p className="text-sm text-gray-600">
              Loading states, success feedback, and error handling built-in.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
            <p className="text-sm text-gray-600">
              Memoized components and debounced validation for optimal
              performance.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Validation</h3>
            <p className="text-sm text-gray-600">
              Cross-field validation and comprehensive validation patterns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
