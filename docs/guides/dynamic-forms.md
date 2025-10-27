# Dynamic Forms Guide

Learn how to create forms with conditional fields, field arrays, and dynamic sections.

## Conditional Fields

Show or hide fields based on form values using the `ConditionalField` component.

### Basic Conditional Field

```tsx
import { ZodForm, FormFieldHelpers, ConditionalField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  hasPhone: z.boolean(),
  phone: z.string().optional(),
  hasAddress: z.boolean(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }).optional(),
});

export function ConditionalForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.checkbox("hasPhone", "I have a phone number"),
          
          // Show phone field only when hasPhone is true
          ConditionalField({
            name: "phone",
            label: "Phone Number",
            condition: (values) => values.hasPhone === true,
            render: (props) => (
              <FormFieldHelpers.input("phone", "Phone Number", {
                type: "tel",
                placeholder: "+1 (555) 123-4567",
              })
            ),
          }),
          
          FormFieldHelpers.checkbox("hasAddress", "I have an address"),
          
          // Show address fields only when hasAddress is true
          ConditionalField({
            name: "address",
            condition: (values) => values.hasAddress === true,
            render: (props) => (
              <div className="space-y-4">
                <FormFieldHelpers.input("address.street", "Street Address"),
                <FormFieldHelpers.input("address.city", "City"),
                <FormFieldHelpers.input("address.zipCode", "ZIP Code"),
              </div>
            ),
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

### Advanced Conditional Logic

```tsx
const schema = z.object({
  userType: z.enum(["individual", "business"]),
  businessName: z.string().optional(),
  businessType: z.enum(["llc", "corporation", "partnership"]).optional(),
  hasEmployees: z.boolean().optional(),
  employeeCount: z.number().optional(),
});

export function AdvancedConditionalForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.select("userType", "Account Type", {
            options: [
              { label: "Individual", value: "individual" },
              { label: "Business", value: "business" },
            ],
          }),
          
          // Show business fields only for business accounts
          ConditionalField({
            name: "businessName",
            condition: (values) => values.userType === "business",
            render: () => (
              <div className="space-y-4">
                <FormFieldHelpers.input("businessName", "Business Name"),
                <FormFieldHelpers.select("businessType", "Business Type", {
                  options: [
                    { label: "LLC", value: "llc" },
                    { label: "Corporation", value: "corporation" },
                    { label: "Partnership", value: "partnership" },
                  ],
                }),
                <FormFieldHelpers.checkbox("hasEmployees", "Has employees"),
                
                // Show employee count only if has employees
                ConditionalField({
                  name: "employeeCount",
                  condition: (values) => values.hasEmployees === true,
                  render: () => (
                    <FormFieldHelpers.input("employeeCount", "Number of Employees", {
                      type: "number",
                      min: 1,
                    })
                  ),
                }),
              </div>
            ),
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

## Field Arrays

Create dynamic lists of fields using the `FieldArrayField` component.

### Basic Field Array

```tsx
import { ZodForm, FormFieldHelpers, FieldArrayField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  items: z.array(z.object({
    name: z.string().min(1, "Item name is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be positive"),
  })).min(1, "At least one item is required"),
});

export function ShoppingListForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FieldArrayField({
            name: "items",
            label: "Shopping Items",
            renderItem: (item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded">
                <FormFieldHelpers.input(`items.${index}.name`, "Item Name"),
                <FormFieldHelpers.input(`items.${index}.quantity`, "Quantity", {
                  type: "number",
                  min: 1,
                }),
                <FormFieldHelpers.input(`items.${index}.price`, "Price", {
                  type: "number",
                  step: 0.01,
                  min: 0,
                }),
              </div>
            ),
            addButtonText: "Add Item",
            removeButtonText: "Remove",
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

### Advanced Field Array with Validation

```tsx
const schema = z.object({
  contacts: z.array(z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).min(1, "At least one contact is required"),
});

export function ContactListForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FieldArrayField({
            name: "contacts",
            label: "Emergency Contacts",
            renderItem: (item, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Contact {index + 1}</h4>
                  <FormFieldHelpers.checkbox(`contacts.${index}.isPrimary`, "Primary Contact"),
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldHelpers.input(`contacts.${index}.name`, "Full Name"),
                  <FormFieldHelpers.input(`contacts.${index}.email`, "Email", {
                    type: "email",
                  }),
                  <FormFieldHelpers.input(`contacts.${index}.phone`, "Phone", {
                    type: "tel",
                  }),
                </div>
              </div>
            ),
            addButtonText: "Add Contact",
            removeButtonText: "Remove Contact",
            maxItems: 5,
            minItems: 1,
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

## Dynamic Sections

Group related conditional fields together using `DynamicSectionField`.

### Basic Dynamic Section

```tsx
import { ZodForm, FormFieldHelpers, DynamicSectionField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const schema = z.object({
  hasPreferences: z.boolean(),
  preferences: z.object({
    theme: z.enum(["light", "dark", "auto"]).optional(),
    language: z.string().optional(),
    notifications: z.boolean().optional(),
    emailUpdates: z.boolean().optional(),
  }).optional(),
});

export function PreferencesForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.checkbox("hasPreferences", "I want to customize my preferences"),
          
          DynamicSectionField({
            name: "preferences",
            title: "User Preferences",
            condition: (values) => values.hasPreferences === true,
            fields: [
              FormFieldHelpers.select("preferences.theme", "Theme", {
                options: [
                  { label: "Light", value: "light" },
                  { label: "Dark", value: "dark" },
                  { label: "Auto", value: "auto" },
                ],
              }),
              FormFieldHelpers.input("preferences.language", "Language", {
                placeholder: "en-US",
              }),
              FormFieldHelpers.switch("preferences.notifications", "Enable Notifications"),
              FormFieldHelpers.switch("preferences.emailUpdates", "Email Updates"),
            ],
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

### Complex Dynamic Section

```tsx
const schema = z.object({
  accountType: z.enum(["personal", "business", "enterprise"]),
  businessInfo: z.object({
    companyName: z.string().optional(),
    industry: z.string().optional(),
    size: z.enum(["small", "medium", "large"]).optional(),
    features: z.array(z.string()).optional(),
  }).optional(),
  enterpriseInfo: z.object({
    companyName: z.string().optional(),
    contractType: z.enum(["annual", "monthly"]).optional(),
    customFeatures: z.array(z.string()).optional(),
  }).optional(),
});

export function AccountSetupForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.select("accountType", "Account Type", {
            options: [
              { label: "Personal", value: "personal" },
              { label: "Business", value: "business" },
              { label: "Enterprise", value: "enterprise" },
            ],
          }),
          
          // Business account section
          DynamicSectionField({
            name: "businessInfo",
            title: "Business Information",
            condition: (values) => values.accountType === "business",
            fields: [
              FormFieldHelpers.input("businessInfo.companyName", "Company Name"),
              FormFieldHelpers.input("businessInfo.industry", "Industry"),
              FormFieldHelpers.select("businessInfo.size", "Company Size", {
                options: [
                  { label: "Small (1-50)", value: "small" },
                  { label: "Medium (51-200)", value: "medium" },
                  { label: "Large (200+)", value: "large" },
                ],
              }),
              FieldArrayField({
                name: "businessInfo.features",
                label: "Required Features",
                renderItem: (item, index) => (
                  <FormFieldHelpers.input(`businessInfo.features.${index}`, `Feature ${index + 1}`)
                ),
                addButtonText: "Add Feature",
                removeButtonText: "Remove",
              }),
            ],
          }),
          
          // Enterprise account section
          DynamicSectionField({
            name: "enterpriseInfo",
            title: "Enterprise Information",
            condition: (values) => values.accountType === "enterprise",
            fields: [
              FormFieldHelpers.input("enterpriseInfo.companyName", "Company Name"),
              FormFieldHelpers.select("enterpriseInfo.contractType", "Contract Type", {
                options: [
                  { label: "Annual", value: "annual" },
                  { label: "Monthly", value: "monthly" },
                ],
              }),
              FieldArrayField({
                name: "enterpriseInfo.customFeatures",
                label: "Custom Features",
                renderItem: (item, index) => (
                  <FormFieldHelpers.input(`enterpriseInfo.customFeatures.${index}`, `Custom Feature ${index + 1}`)
                ),
                addButtonText: "Add Custom Feature",
                removeButtonText: "Remove",
              }),
            ],
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

## Advanced Patterns

### Nested Conditional Fields

```tsx
const schema = z.object({
  hasAddress: z.boolean(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    hasApartment: z.boolean().optional(),
    apartment: z.string().optional(),
  }).optional(),
});

export function NestedConditionalForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.checkbox("hasAddress", "I have an address"),
          
          ConditionalField({
            name: "address",
            condition: (values) => values.hasAddress === true,
            render: () => (
              <div className="space-y-4">
                <FormFieldHelpers.input("address.street", "Street Address"),
                <FormFieldHelpers.input("address.city", "City"),
                <FormFieldHelpers.input("address.country", "Country"),
                
                <FormFieldHelpers.checkbox("address.hasApartment", "I have an apartment number"),
                
                ConditionalField({
                  name: "address.apartment",
                  condition: (values) => values.address?.hasApartment === true,
                  render: () => (
                    <FormFieldHelpers.input("address.apartment", "Apartment Number")
                  ),
                }),
              </div>
            ),
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

### Field Array with Conditional Items

```tsx
const schema = z.object({
  products: z.array(z.object({
    name: z.string().min(1, "Product name is required"),
    category: z.enum(["physical", "digital"]),
    weight: z.number().optional(),
    downloadLink: z.string().optional(),
  })).min(1, "At least one product is required"),
});

export function ProductCatalogForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FieldArrayField({
            name: "products",
            label: "Products",
            renderItem: (item, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <FormFieldHelpers.input(`products.${index}.name`, "Product Name"),
                
                <FormFieldHelpers.select(`products.${index}.category`, "Category", {
                  options: [
                    { label: "Physical Product", value: "physical" },
                    { label: "Digital Product", value: "digital" },
                  ],
                }),
                
                ConditionalField({
                  name: `products.${index}.weight`,
                  condition: (values) => values.products?.[index]?.category === "physical",
                  render: () => (
                    <FormFieldHelpers.input(`products.${index}.weight`, "Weight (kg)", {
                      type: "number",
                      step: 0.1,
                      min: 0,
                    })
                  ),
                }),
                
                ConditionalField({
                  name: `products.${index}.downloadLink`,
                  condition: (values) => values.products?.[index]?.category === "digital",
                  render: () => (
                    <FormFieldHelpers.input(`products.${index}.downloadLink`, "Download Link", {
                      type: "url",
                    })
                  ),
                }),
              </div>
            ),
            addButtonText: "Add Product",
            removeButtonText: "Remove Product",
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

## Performance Considerations

### Memoization for Conditional Fields

```tsx
import React, { memo } from "react";

const ConditionalFieldComponent = memo(({ condition, render, values }) => {
  if (!condition(values)) return null;
  return render();
});

// Use in your form
ConditionalField({
  name: "conditionalField",
  condition: (values) => values.showField === true,
  render: () => <FormFieldHelpers.input("conditionalField", "Label"),
})
```

### Debounced Validation for Field Arrays

```tsx
import { useDebouncedValidation } from "@rachelallyson/hero-hook-form";

export function OptimizedFieldArray() {
  const { debouncedValue, isDebouncing } = useDebouncedValidation(
    fieldArrayValue,
    300 // 300ms delay
  );

  return (
    <FieldArrayField({
      name: "items",
      renderItem: (item, index) => (
        <div>
          <FormFieldHelpers.input(`items.${index}.name`, "Name"),
          {isDebouncing && <div>Validating...</div>}
        </div>
      ),
    })
  );
}
```

## Testing Dynamic Forms

### Testing Conditional Fields

```tsx
// Cypress test
describe("Conditional Fields", () => {
  it("shows phone field when checkbox is checked", () => {
    cy.get('[name="hasPhone"]').check();
    cy.get('[name="phone"]').should('be.visible');
    cy.get('[name="phone"]').type("555-1234");
  });
});
```

### Testing Field Arrays

```tsx
// Cypress test
describe("Field Arrays", () => {
  it("adds and removes items", () => {
    cy.get('[data-testid="add-item"]').click();
    cy.get('[name="items.0.name"]').type("Item 1");
    
    cy.get('[data-testid="add-item"]').click();
    cy.get('[name="items.1.name"]').type("Item 2");
    
    cy.get('[data-testid="remove-item-1"]').click();
    cy.get('[name="items.1.name"]').should('not.exist');
  });
});
```

## Common Patterns

### Multi-Step Forms

```tsx
const schema = z.object({
  step: z.number().default(1),
  personalInfo: z.object({...}).optional(),
  contactInfo: z.object({...}).optional(),
  preferences: z.object({...}).optional(),
});

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          ConditionalField({
            name: "personalInfo",
            condition: () => currentStep === 1,
            render: () => <PersonalInfoFields />,
          }),
          ConditionalField({
            name: "contactInfo", 
            condition: () => currentStep === 2,
            render: () => <ContactInfoFields />,
          }),
          ConditionalField({
            name: "preferences",
            condition: () => currentStep === 3,
            render: () => <PreferencesFields />,
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}
```

### Dynamic Form Generation

```tsx
export function DynamicFormGenerator({ formConfig }) {
  return (
    <ZodForm
      config={{
        schema: formConfig.schema,
        fields: formConfig.fields.map(field => {
          if (field.type === 'conditional') {
            return ConditionalField(field);
          }
          if (field.type === 'array') {
            return FieldArrayField(field);
          }
          return FormFieldHelpers[field.type](field.name, field.label, field.props);
        }),
        onSubmit: formConfig.onSubmit,
      }}
    />
  );
}
```
