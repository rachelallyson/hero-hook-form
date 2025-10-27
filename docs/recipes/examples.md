# Recipe Examples

Copy-paste code snippets for common form patterns with Hero Hook Form.

## Basic Forms

### Contact Form

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  newsletter: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const handleSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  return (
    <ZodForm
      config={{
        schema: contactSchema,
        fields: [
          FormFieldHelpers.input("name", "Full Name"),
          FormFieldHelpers.input("email", "Email", { type: "email" }),
          FormFieldHelpers.input("phone", "Phone", { type: "tel" }),
          FormFieldHelpers.textarea("message", "Message", { 
            rows: 4,
            placeholder: "Tell us what's on your mind..." 
          }),
          FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
        ],
        onSubmit: handleSubmit,
        title: "Contact Us",
        subtitle: "We'd love to hear from you!",
      }}
    />
  );
}
```

### User Registration Form

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  country: z.string().min(1, "Please select a country"),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const handleSubmit = async (data: RegistrationFormData) => {
    console.log("Registration data:", data);
    // Handle registration
  };

  return (
    <ZodForm
      config={{
        schema: registrationSchema,
        fields: [
          FormFieldHelpers.input("firstName", "First Name"),
          FormFieldHelpers.input("lastName", "Last Name"),
          FormFieldHelpers.input("email", "Email", { type: "email" }),
          FormFieldHelpers.input("password", "Password", { type: "password" }),
          FormFieldHelpers.input("confirmPassword", "Confirm Password", { type: "password" }),
          FormFieldHelpers.select("country", "Country", {
            options: [
              { label: "United States", value: "US" },
              { label: "Canada", value: "CA" },
              { label: "United Kingdom", value: "UK" },
            ],
          }),
          FormFieldHelpers.checkbox("terms", "I agree to the terms and conditions"),
        ],
        onSubmit: handleSubmit,
        title: "Create Account",
        subtitle: "Join our community today",
      }}
    />
  );
}
```

## Advanced Forms

### Settings Form with Conditional Fields

```tsx
import { ZodForm, FormFieldHelpers, ConditionalField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  notifications: z.boolean().default(false),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  theme: z.enum(["light", "dark", "auto"]).default("auto"),
  language: z.string().default("en"),
  timezone: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const handleSubmit = async (data: SettingsFormData) => {
    console.log("Settings updated:", data);
    // Handle settings update
  };

  return (
    <ZodForm
      config={{
        schema: settingsSchema,
        fields: [
          FormFieldHelpers.input("name", "Display Name"),
          FormFieldHelpers.input("email", "Email", { type: "email" }),
          
          FormFieldHelpers.switch("notifications", "Enable Notifications"),
          
          ConditionalField({
            name: "emailNotifications",
            condition: (values) => values.notifications === true,
            render: () => (
              <FormFieldHelpers.switch("emailNotifications", "Email Notifications")
            ),
          }),
          
          ConditionalField({
            name: "pushNotifications",
            condition: (values) => values.notifications === true,
            render: () => (
              <FormFieldHelpers.switch("pushNotifications", "Push Notifications")
            ),
          }),
          
          FormFieldHelpers.select("theme", "Theme", {
            options: [
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
              { label: "Auto", value: "auto" },
            ],
          }),
          
          FormFieldHelpers.select("language", "Language", {
            options: [
              { label: "English", value: "en" },
              { label: "Spanish", value: "es" },
              { label: "French", value: "fr" },
            ],
          }),
          
          FormFieldHelpers.input("timezone", "Timezone", {
            placeholder: "America/New_York",
          }),
        ],
        onSubmit: handleSubmit,
        title: "Account Settings",
        subtitle: "Customize your experience",
      }}
    />
  );
}
```

### Product Catalog Form with Field Arrays

```tsx
import { ZodForm, FormFieldHelpers, FieldArrayField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  images: z.array(z.object({
    url: z.string().url("Invalid image URL"),
    alt: z.string().min(1, "Alt text is required"),
  })).min(1, "At least one image is required"),
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().min(0, "Stock must be non-negative"),
  })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const handleSubmit = async (data: ProductFormData) => {
    console.log("Product data:", data);
    // Handle product creation
  };

  return (
    <ZodForm
      config={{
        schema: productSchema,
        fields: [
          FormFieldHelpers.input("name", "Product Name"),
          FormFieldHelpers.textarea("description", "Description", { 
            rows: 4,
            placeholder: "Describe your product..." 
          }),
          FormFieldHelpers.select("category", "Category", {
            options: [
              { label: "Electronics", value: "electronics" },
              { label: "Clothing", value: "clothing" },
              { label: "Books", value: "books" },
            ],
          }),
          FormFieldHelpers.input("price", "Price", { 
            type: "number",
            step: 0.01,
            min: 0,
          }),
          
          FieldArrayField({
            name: "images",
            label: "Product Images",
            renderItem: (item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
                <FormFieldHelpers.input(`images.${index}.url`, "Image URL", {
                  type: "url",
                }),
                <FormFieldHelpers.input(`images.${index}.alt`, "Alt Text"),
              </div>
            ),
            addButtonText: "Add Image",
            removeButtonText: "Remove Image",
            minItems: 1,
          }),
          
          FieldArrayField({
            name: "variants",
            label: "Product Variants",
            renderItem: (item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded">
                <FormFieldHelpers.input(`variants.${index}.name`, "Variant Name"),
                <FormFieldHelpers.input(`variants.${index}.price`, "Price", {
                  type: "number",
                  step: 0.01,
                  min: 0,
                }),
                <FormFieldHelpers.input(`variants.${index}.stock`, "Stock", {
                  type: "number",
                  min: 0,
                }),
              </div>
            ),
            addButtonText: "Add Variant",
            removeButtonText: "Remove Variant",
          }),
        ],
        onSubmit: handleSubmit,
        title: "Add Product",
        subtitle: "Create a new product listing",
      }}
    />
  );
}
```

## Dynamic Forms

### Multi-Step Form

```tsx
import { ZodForm, FormFieldHelpers, ConditionalField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";
import { useState } from "react";

const multiStepSchema = z.object({
  step: z.number().default(1),
  personalInfo: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email"),
  }).optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
  preferences: z.object({
    newsletter: z.boolean().default(false),
    notifications: z.boolean().default(false),
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
  }).optional(),
});

type MultiStepFormData = z.infer<typeof multiStepSchema>;

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleSubmit = async (data: MultiStepFormData) => {
    console.log("Multi-step form data:", data);
    // Handle form submission
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Step {currentStep} of 3</h2>
          <div className="flex space-x-2">
            <button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={nextStep}
              disabled={currentStep === 3}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <ZodForm
        config={{
          schema: multiStepSchema,
          fields: [
            ConditionalField({
              name: "personalInfo",
              condition: () => currentStep === 1,
              render: () => (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <FormFieldHelpers.input("personalInfo.firstName", "First Name"),
                  <FormFieldHelpers.input("personalInfo.lastName", "Last Name"),
                  <FormFieldHelpers.input("personalInfo.email", "Email", { type: "email" }),
                </div>
              ),
            }),
            
            ConditionalField({
              name: "contactInfo",
              condition: () => currentStep === 2,
              render: () => (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <FormFieldHelpers.input("contactInfo.phone", "Phone", { type: "tel" }),
                  <FormFieldHelpers.input("contactInfo.address", "Address"),
                  <div className="grid grid-cols-2 gap-4">
                    <FormFieldHelpers.input("contactInfo.city", "City"),
                    <FormFieldHelpers.input("contactInfo.zipCode", "ZIP Code"),
                  </div>
                </div>
              ),
            }),
            
            ConditionalField({
              name: "preferences",
              condition: () => currentStep === 3,
              render: () => (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  <FormFieldHelpers.checkbox("preferences.newsletter", "Subscribe to newsletter"),
                  <FormFieldHelpers.switch("preferences.notifications", "Enable notifications"),
                  <FormFieldHelpers.select("preferences.theme", "Theme", {
                    options: [
                      { label: "Light", value: "light" },
                      { label: "Dark", value: "dark" },
                      { label: "Auto", value: "auto" },
                    ],
                  }),
                </div>
              ),
            }),
          ],
          onSubmit: handleSubmit,
          submitButtonText: currentStep === 3 ? "Complete" : "Continue",
        }}
      />
    </div>
  );
}
```

### Dynamic Form Builder

```tsx
import { ZodForm, FormFieldHelpers, DynamicSectionField } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const dynamicFormSchema = z.object({
  formType: z.enum(["contact", "support", "feedback"]),
  contactInfo: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
  }).optional(),
  supportInfo: z.object({
    subject: z.string().min(1, "Subject is required"),
    priority: z.enum(["low", "medium", "high"]),
    description: z.string().min(10, "Description must be at least 10 characters"),
  }).optional(),
  feedbackInfo: z.object({
    rating: z.number().min(1).max(5),
    category: z.string().min(1, "Category is required"),
    comments: z.string().min(10, "Comments must be at least 10 characters"),
  }).optional(),
});

type DynamicFormData = z.infer<typeof dynamicFormSchema>;

export function DynamicFormBuilder() {
  const handleSubmit = async (data: DynamicFormData) => {
    console.log("Dynamic form data:", data);
    // Handle form submission
  };

  return (
    <ZodForm
      config={{
        schema: dynamicFormSchema,
        fields: [
          FormFieldHelpers.select("formType", "Form Type", {
            options: [
              { label: "Contact", value: "contact" },
              { label: "Support", value: "support" },
              { label: "Feedback", value: "feedback" },
            ],
          }),
          
          DynamicSectionField({
            name: "contactInfo",
            title: "Contact Information",
            condition: (values) => values.formType === "contact",
            fields: [
              FormFieldHelpers.input("contactInfo.name", "Name"),
              FormFieldHelpers.input("contactInfo.email", "Email", { type: "email" }),
              FormFieldHelpers.input("contactInfo.phone", "Phone", { type: "tel" }),
            ],
          }),
          
          DynamicSectionField({
            name: "supportInfo",
            title: "Support Request",
            condition: (values) => values.formType === "support",
            fields: [
              FormFieldHelpers.input("supportInfo.subject", "Subject"),
              FormFieldHelpers.select("supportInfo.priority", "Priority", {
                options: [
                  { label: "Low", value: "low" },
                  { label: "Medium", value: "medium" },
                  { label: "High", value: "high" },
                ],
              }),
              FormFieldHelpers.textarea("supportInfo.description", "Description", {
                rows: 4,
                placeholder: "Describe your issue...",
              }),
            ],
          }),
          
          DynamicSectionField({
            name: "feedbackInfo",
            title: "Feedback",
            condition: (values) => values.formType === "feedback",
            fields: [
              FormFieldHelpers.slider("feedbackInfo.rating", "Rating", {
                min: 1,
                max: 5,
                step: 1,
              }),
              FormFieldHelpers.select("feedbackInfo.category", "Category", {
                options: [
                  { label: "Bug Report", value: "bug" },
                  { label: "Feature Request", value: "feature" },
                  { label: "General Feedback", value: "general" },
                ],
              }),
              FormFieldHelpers.textarea("feedbackInfo.comments", "Comments", {
                rows: 4,
                placeholder: "Share your thoughts...",
              }),
            ],
          }),
        ],
        onSubmit: handleSubmit,
        title: "Dynamic Form",
        subtitle: "Choose your form type and fill out the relevant fields",
      }}
    />
  );
}
```

## Form Builders

### Advanced Builder Example

```tsx
import { createAdvancedBuilder } from "@rachelallyson/hero-hook-form";

type UserFormData = {
  name: string;
  email: string;
  age: number;
  country: string;
  newsletter: boolean;
  preferences: {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
  };
};

export function AdvancedBuilderForm() {
  const handleSubmit = async (data: UserFormData) => {
    console.log("Advanced builder form data:", data);
    // Handle form submission
  };

  const builder = createAdvancedBuilder<UserFormData>()
    .addInput("name", "Full Name")
    .addEmail("email", "Email Address")
    .addInput("age", "Age", { type: "number", min: 18, max: 120 })
    .addSelect("country", "Country", {
      options: [
        { label: "United States", value: "US" },
        { label: "Canada", value: "CA" },
        { label: "United Kingdom", value: "UK" },
      ],
    })
    .addCheckbox("newsletter", "Subscribe to newsletter")
    .addSelect("preferences.theme", "Theme", {
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Auto", value: "auto" },
      ],
    })
    .addSwitch("preferences.notifications", "Enable notifications")
    .build();

  return (
    <ZodForm
      config={{
        ...builder,
        onSubmit: handleSubmit,
        title: "User Profile",
        subtitle: "Update your profile information",
      }}
    />
  );
}
```

### Type-Inferred Builder Example

```tsx
import { createTypeInferredBuilder } from "@rachelallyson/hero-hook-form";

export function TypeInferredForm() {
  const handleSubmit = async (data: any) => {
    console.log("Type-inferred form data:", data);
    // Handle form submission
  };

  const builder = createTypeInferredBuilder()
    .addInput("name", "Full Name")
    .addEmail("email", "Email Address")
    .addPassword("password", "Password")
    .addTextarea("bio", "Biography", { rows: 4 })
    .addSelect("role", "Role", {
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest" },
      ],
    })
    .addCheckbox("active", "Active user")
    .addSwitch("verified", "Verified account")
    .addRadio("gender", "Gender", {
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
    })
    .addSlider("experience", "Years of Experience", {
      min: 0,
      max: 50,
      step: 1,
    })
    .addDate("birthDate", "Birth Date")
    .addFile("avatar", "Profile Picture", {
      accept: "image/*",
      maxSize: 5 * 1024 * 1024, // 5MB
    })
    .build();

  return (
    <ZodForm
      config={{
        ...builder,
        onSubmit: handleSubmit,
        title: "User Registration",
        subtitle: "Create your account",
      }}
    />
  );
}
```

## Validation Patterns

### Cross-Field Validation

```tsx
import { ZodForm, FormFieldHelpers, crossFieldValidation } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const baseSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  email: z.string().email("Invalid email address"),
  confirmEmail: z.string(),
});

const schema = crossFieldValidation(baseSchema, {
  password: {
    confirmPassword: (password, confirm) => 
      password === confirm || "Passwords don't match",
  },
  email: {
    confirmEmail: (email, confirm) => 
      email === confirm || "Emails don't match",
  },
  startDate: {
    endDate: (start, end) => 
      new Date(end) > new Date(start) || "End date must be after start date",
  },
});

export function CrossFieldValidationForm() {
  const handleSubmit = async (data: any) => {
    console.log("Cross-field validation form data:", data);
    // Handle form submission
  };

  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.input("email", "Email", { type: "email" }),
          FormFieldHelpers.input("confirmEmail", "Confirm Email", { type: "email" }),
          FormFieldHelpers.input("password", "Password", { type: "password" }),
          FormFieldHelpers.input("confirmPassword", "Confirm Password", { type: "password" }),
          FormFieldHelpers.date("startDate", "Start Date"),
          FormFieldHelpers.date("endDate", "End Date"),
        ],
        onSubmit: handleSubmit,
        title: "Account Setup",
        subtitle: "Create your account with validation",
      }}
    />
  );
}
```

### Async Validation

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const asyncValidationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional(),
});

export function AsyncValidationForm() {
  const handleSubmit = async (data: any) => {
    console.log("Async validation form data:", data);
    // Handle form submission
  };

  return (
    <ZodForm
      config={{
        schema: asyncValidationSchema,
        fields: [
          FormFieldHelpers.input("username", "Username", {
            rules: {
              validate: async (value) => {
                // Simulate API call to check username availability
                await new Promise(resolve => setTimeout(resolve, 1000));
                return value !== "admin" || "Username is already taken";
              },
            },
          }),
          FormFieldHelpers.input("email", "Email", { 
            type: "email",
            rules: {
              validate: async (value) => {
                // Simulate API call to check email availability
                await new Promise(resolve => setTimeout(resolve, 500));
                return value !== "test@example.com" || "Email is already registered";
              },
            },
          }),
          FormFieldHelpers.input("website", "Website", { 
            type: "url",
            rules: {
              validate: async (value) => {
                if (!value) return true;
                // Simulate API call to check website accessibility
                await new Promise(resolve => setTimeout(resolve, 800));
                return value.includes("https://") || "Website must use HTTPS";
              },
            },
          }),
        ],
        onSubmit: handleSubmit,
        title: "Account Registration",
        subtitle: "Create your account with real-time validation",
      }}
    />
  );
}
```

## Error Handling

### Server Error Handling

```tsx
import { ZodForm, FormFieldHelpers, applyServerErrors } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const serverErrorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ServerErrorHandlingForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      setServerError(null);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 422) {
          // Apply validation errors to form fields
          applyServerErrors(form, errorData.errors);
        } else {
          setServerError(errorData.message || 'Submission failed');
        }
        return;
      }
      
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Submission error:', error);
      setServerError('Network error. Please try again.');
    }
  };

  return (
    <div>
      {serverError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{serverError}</p>
        </div>
      )}
      
      <ZodForm
        config={{
          schema: serverErrorSchema,
          fields: [
            FormFieldHelpers.input("name", "Name"),
            FormFieldHelpers.input("email", "Email", { type: "email" }),
            FormFieldHelpers.textarea("message", "Message", { rows: 4 }),
          ],
          onSubmit: handleSubmit,
          title: "Contact Form",
          subtitle: "Get in touch with us",
        }}
      />
    </div>
  );
}
```

### Retry Logic

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const retrySchema = z.object({
  data: z.string().min(1, "Data is required"),
});

export function RetryLogicForm() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 3;

  const handleSubmit = async (data: any) => {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        setIsRetrying(true);
        setRetryCount(attempts);
        
        await submitToAPI(data);
        setRetryCount(0);
        setIsRetrying(false);
        return; // Success
      } catch (error) {
        attempts++;
        setRetryCount(attempts);
        
        if (attempts >= maxRetries) {
          setIsRetrying(false);
          throw new Error(`Failed after ${maxRetries} attempts`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  };

  return (
    <div>
      {isRetrying && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Retrying... (Attempt {retryCount}/{maxRetries})
          </p>
        </div>
      )}
      
      <ZodForm
        config={{
          schema: retrySchema,
          fields: [
            FormFieldHelpers.textarea("data", "Data", { 
              rows: 4,
              placeholder: "Enter your data..." 
            }),
          ],
          onSubmit: handleSubmit,
          title: "Retry Logic Form",
          subtitle: "Form with automatic retry on failure",
        }}
      />
    </div>
  );
}
```

## Performance Optimization

### Debounced Validation

```tsx
import { ZodForm, FormFieldHelpers, useDebouncedValidation } from "@rachelallyson/hero-hook-form";
import { z } from "zod";

const debouncedSchema = z.object({
  search: z.string().min(1, "Search term is required"),
  email: z.string().email("Invalid email address"),
});

export function DebouncedValidationForm() {
  const [searchValue, setSearchValue] = useState("");
  const { debouncedValue, isDebouncing } = useDebouncedValidation(searchValue, 300);

  const handleSubmit = async (data: any) => {
    console.log("Debounced validation form data:", data);
    // Handle form submission
  };

  return (
    <div>
      {isDebouncing && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm">Validating...</p>
        </div>
      )}
      
      <ZodForm
        config={{
          schema: debouncedSchema,
          fields: [
            FormFieldHelpers.input("search", "Search", {
              rules: {
                validate: async (value) => {
                  // Simulate expensive validation
                  await new Promise(resolve => setTimeout(resolve, 500));
                  return value.length >= 3 || "Search term must be at least 3 characters";
                },
              },
            }),
            FormFieldHelpers.input("email", "Email", { type: "email" }),
          ],
          onSubmit: handleSubmit,
          title: "Debounced Validation",
          subtitle: "Form with debounced validation for better performance",
        }}
      />
    </div>
  );
}
```

### Memoized Form

```tsx
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";
import { z } from "zod";
import { memo, useMemo } from "react";

const memoizedSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
});

const MemoizedFormFields = memo(({ fields }: { fields: any[] }) => (
  <div className="space-y-4">
    {fields.map((field, index) => (
      <div key={index}>
        {field}
      </div>
    ))}
  </div>
));

export function MemoizedForm() {
  const handleSubmit = async (data: any) => {
    console.log("Memoized form data:", data);
    // Handle form submission
  };

  const fields = useMemo(() => [
    FormFieldHelpers.input("name", "Name"),
    FormFieldHelpers.input("email", "Email", { type: "email" }),
    FormFieldHelpers.input("age", "Age", { type: "number" }),
  ], []);

  return (
    <ZodForm
      config={{
        schema: memoizedSchema,
        fields,
        onSubmit: handleSubmit,
        title: "Memoized Form",
        subtitle: "Form with memoized components for better performance",
      }}
    />
  );
}
```
