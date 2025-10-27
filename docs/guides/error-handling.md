# Error Handling Guide

Learn how to handle validation errors, server errors, and edge cases in Hero Hook Form.

## Validation Errors

### Field-Level Validation

Field errors are automatically displayed based on your Zod schema validation:

```tsx
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  age: z.number()
    .min(18, "You must be at least 18 years old")
    .max(120, "Please enter a valid age"),
});

// Errors are automatically displayed in the UI
<ZodForm
  config={{
    schema,
    fields: [
      FormFieldHelpers.input("email", "Email", { type: "email" }),
      FormFieldHelpers.input("password", "Password", { type: "password" }),
      FormFieldHelpers.input("age", "Age", { type: "number" }),
    ],
    onSubmit: handleSubmit,
  }}
/>
```

### Custom Validation Rules

Add custom validation using React Hook Form's `rules` property:

```tsx
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export function CustomValidationForm() {
  return (
    <ZodForm
      config={{
        schema,
        fields: [
          FormFieldHelpers.input("username", "Username", {
            rules: {
              validate: async (value) => {
                // Check if username is available
                const response = await fetch(`/api/check-username?username=${value}`);
                const data = await response.json();
                return data.available || "Username is already taken";
              },
            },
          }),
          FormFieldHelpers.input("email", "Email", { type: "email" }),
        ],
        onSubmit: handleSubmit,
      }}
    />
  );
}
```

### Cross-Field Validation

Validate fields that depend on each other:

```tsx
import { crossFieldValidation } from "@rachelallyson/hero-hook-form";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  startDate: z.string(),
  endDate: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// Or use the helper function
const schemaWithCrossValidation = crossFieldValidation(
  baseSchema,
  {
    password: {
      confirmPassword: (password, confirm) => password === confirm || "Passwords don't match",
    },
    startDate: {
      endDate: (start, end) => new Date(end) > new Date(start) || "End date must be after start date",
    },
  }
);
```

## Server Error Handling

### Basic Server Errors

Handle server validation errors and display them in the form:

```tsx
import { applyServerErrors } from "@rachelallyson/hero-hook-form";

export function ContactForm() {
  const handleSubmit = async (data: FormData) => {
    try {
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
          // Handle other errors
          throw new Error(errorData.message || 'Submission failed');
        }
      }
      
      // Success
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <ZodForm
      config={{
        schema: contactSchema,
        fields: contactFields,
        onSubmit: handleSubmit,
      }}
    />
  );
}
```

### Advanced Server Error Handling

Create a comprehensive error handling system:

```tsx
interface ServerError {
  field?: string;
  message: string;
  code?: string;
}

interface ServerErrorResponse {
  errors: ServerError[];
  message?: string;
}

export function AdvancedErrorHandling() {
  const [serverError, setServerError] = useState<string | null>(null);
  
  const handleSubmit = async (data: FormData) => {
    try {
      setServerError(null);
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: ServerErrorResponse = await response.json();
        
        switch (response.status) {
          case 422:
            // Validation errors - apply to form fields
            applyServerErrors(form, errorData.errors);
            break;
            
          case 409:
            // Conflict - show specific message
            setServerError("This record already exists. Please check your information.");
            break;
            
          case 429:
            // Rate limited
            setServerError("Too many requests. Please try again in a few minutes.");
            break;
            
          case 500:
            // Server error
            setServerError("A server error occurred. Please try again later.");
            break;
            
          default:
            setServerError(errorData.message || "An unexpected error occurred.");
        }
        
        return;
      }
      
      // Success
      console.log('Form submitted successfully');
      
    } catch (error) {
      console.error('Network error:', error);
      setServerError("Network error. Please check your connection and try again.");
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
          schema: mySchema,
          fields: myFields,
          onSubmit: handleSubmit,
        }}
      />
    </div>
  );
}
```

## Form-Level Error Handling

### Custom Error Display

Create custom error displays for different error types:

```tsx
import { FormStatus } from "@rachelallyson/hero-hook-form";

export function CustomErrorForm() {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'validation' | 'server' | 'network' | null>(null);

  const handleSubmit = async (data: FormData) => {
    try {
      setError(null);
      setErrorType(null);
      
      await submitToAPI(data);
      
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrorType('validation');
        setError('Please check your input and try again.');
      } else if (error instanceof ServerError) {
        setErrorType('server');
        setError('Server error. Please try again later.');
      } else {
        setErrorType('network');
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div>
      {/* Custom error display */}
      {error && (
        <div className={`mb-4 p-4 rounded-lg ${
          errorType === 'validation' ? 'bg-yellow-50 border-yellow-200' :
          errorType === 'server' ? 'bg-red-50 border-red-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              errorType === 'validation' ? 'bg-yellow-400' :
              errorType === 'server' ? 'bg-red-400' :
              'bg-gray-400'
            }`} />
            <p className={`font-medium ${
              errorType === 'validation' ? 'text-yellow-800' :
              errorType === 'server' ? 'text-red-800' :
              'text-gray-800'
            }`}>
              {error}
            </p>
          </div>
        </div>
      )}
      
      <ZodForm
        config={{
          schema: mySchema,
          fields: myFields,
          onSubmit: handleSubmit,
        }}
      />
    </div>
  );
}
```

### Retry Logic

Implement retry logic for failed submissions:

```tsx
export function RetryForm() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 3;

  const handleSubmit = async (data: FormData) => {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        await submitToAPI(data);
        setRetryCount(0);
        return; // Success
      } catch (error) {
        attempts++;
        setRetryCount(attempts);
        
        if (attempts >= maxRetries) {
          throw new Error(`Failed after ${maxRetries} attempts`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  };

  return (
    <div>
      {retryCount > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Retrying... (Attempt {retryCount}/{maxRetries})
          </p>
        </div>
      )}
      
      <ZodForm
        config={{
          schema: mySchema,
          fields: myFields,
          onSubmit: handleSubmit,
        }}
      />
    </div>
  );
}
```

## Error Recovery

### Form Reset on Error

Reset the form when certain errors occur:

```tsx
export function ErrorRecoveryForm() {
  const [shouldReset, setShouldReset] = useState(false);

  const handleSubmit = async (data: FormData) => {
    try {
      await submitToAPI(data);
    } catch (error) {
      if (error.code === 'VALIDATION_FAILED') {
        // Don't reset for validation errors
        return;
      }
      
      if (error.code === 'NETWORK_ERROR') {
        // Reset form for network errors
        setShouldReset(true);
        setTimeout(() => setShouldReset(false), 100);
      }
    }
  };

  return (
    <ZodForm
      config={{
        schema: mySchema,
        fields: myFields,
        onSubmit: handleSubmit,
        key: shouldReset ? 'reset' : 'normal', // Force re-render to reset
      }}
    />
  );
}
```

### Partial Form Recovery

Save form data locally and restore on errors:

```tsx
export function PartialRecoveryForm() {
  const [savedData, setSavedData] = useState<Partial<FormData> | null>(null);

  // Save form data periodically
  const handleFormChange = useCallback((data: Partial<FormData>) => {
    localStorage.setItem('form-draft', JSON.stringify(data));
  }, []);

  const handleSubmit = async (data: FormData) => {
    try {
      await submitToAPI(data);
      localStorage.removeItem('form-draft'); // Clear saved data on success
    } catch (error) {
      // Save current data for recovery
      setSavedData(data);
      throw error;
    }
  };

  // Restore saved data on component mount
  useEffect(() => {
    const saved = localStorage.getItem('form-draft');
    if (saved) {
      setSavedData(JSON.parse(saved));
    }
  }, []);

  return (
    <ZodForm
      config={{
        schema: mySchema,
        fields: myFields,
        defaultValues: savedData || undefined,
        onSubmit: handleSubmit,
        onFormChange: handleFormChange,
      }}
    />
  );
}
```

## Testing Error Handling

### Testing Validation Errors

```tsx
// Cypress test
describe('Form Validation', () => {
  it('displays validation errors', () => {
    cy.get('[name="email"]').type('invalid-email');
    cy.get('[name="email"]').blur();
    cy.get('[data-testid="email-error"]').should('contain', 'Invalid email address');
  });
});
```

### Testing Server Errors

```tsx
// Cypress test
describe('Server Error Handling', () => {
  it('displays server errors', () => {
    cy.intercept('POST', '/api/submit', {
      statusCode: 422,
      body: { errors: [{ field: 'email', message: 'Email already exists' }] }
    });
    
    cy.get('[name="email"]').type('existing@example.com');
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="email-error"]').should('contain', 'Email already exists');
  });
});
```

## Error Patterns

### Common Error Types

```tsx
// Define error types
interface FormError {
  type: 'validation' | 'server' | 'network' | 'timeout';
  message: string;
  field?: string;
  code?: string;
}

// Error handler
const handleError = (error: FormError) => {
  switch (error.type) {
    case 'validation':
      return { message: error.message, field: error.field };
    case 'server':
      return { message: 'Server error. Please try again later.' };
    case 'network':
      return { message: 'Network error. Please check your connection.' };
    case 'timeout':
      return { message: 'Request timed out. Please try again.' };
    default:
      return { message: 'An unexpected error occurred.' };
  }
};
```

### Error Boundaries

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-red-800 font-medium">Something went wrong</h2>
      <p className="text-red-700 text-sm mt-1">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

export function FormWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ZodForm
        config={{
          schema: mySchema,
          fields: myFields,
          onSubmit: handleSubmit,
        }}
      />
    </ErrorBoundary>
  );
}
```

## Best Practices

### 1. Clear Error Messages

```tsx
// ❌ Bad: Generic error
z.string().min(1, "Required")

// ✅ Good: Specific error
z.string().min(1, "Name is required")
```

### 2. Progressive Error Display

```tsx
// Show errors only after user interaction
const [touched, setTouched] = useState(false);

const showError = touched && field.error;
```

### 3. Error Recovery

```tsx
// Provide clear recovery actions
{error && (
  <div className="error-message">
    <p>{error.message}</p>
    <button onClick={retry}>Try Again</button>
    <button onClick={reset}>Start Over</button>
  </div>
)}
```

### 4. Accessibility

```tsx
// Ensure errors are accessible
<div 
  role="alert" 
  aria-live="polite"
  className="error-message"
>
  {error?.message}
</div>
```
