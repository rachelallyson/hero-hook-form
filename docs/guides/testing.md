# Testing Guide

Learn how to test Hero Hook Form components and forms effectively.

## Component Testing

### Basic Component Tests

Test individual field components:

```tsx
// InputField.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from '@rachelallyson/hero-hook-form';
import { useForm } from 'react-hook-form';

function TestWrapper({ children }: { children: React.ReactNode }) {
  const form = useForm();
  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

describe('InputField', () => {
  it('renders with label', () => {
    render(
      <TestWrapper>
        <InputField name="test" label="Test Field" />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });

  it('shows validation error', async () => {
    const form = useForm({
      mode: 'onChange',
    });
    
    render(
      <FormProvider {...form}>
        <InputField 
          name="email" 
          label="Email"
          rules={{ 
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email'
            }
          }}
        />
      </FormProvider>
    );
    
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.blur(input);
    
    await screen.findByText('Invalid email');
  });

  it('calls onChange handler', () => {
    const handleChange = jest.fn();
    
    render(
      <TestWrapper>
        <InputField 
          name="test" 
          label="Test Field"
          inputProps={{ onChange: handleChange }}
        />
      </TestWrapper>
    );
    
    const input = screen.getByLabelText('Test Field');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });
});
```

### Form Integration Tests

Test complete forms:

```tsx
// ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ZodForm, FormFieldHelpers } from '@rachelallyson/hero-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

function ContactForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <ZodForm
      config={{
        schema: contactSchema,
        fields: [
          FormFieldHelpers.input('name', 'Name'),
          FormFieldHelpers.input('email', 'Email', { type: 'email' }),
          FormFieldHelpers.textarea('message', 'Message', { rows: 4 }),
        ],
        onSubmit,
        title: 'Contact Us',
      }}
    />
  );
}

describe('ContactForm', () => {
  it('renders form with title', () => {
    render(<ContactForm onSubmit={jest.fn()} />);
    
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const handleSubmit = jest.fn();
    render(<ContactForm onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Name'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Message'), { 
      target: { value: 'This is a test message' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      });
    });
  });

  it('shows validation errors for invalid data', async () => {
    render(<ContactForm onSubmit={jest.fn()} />);
    
    fireEvent.change(screen.getByLabelText('Name'), { 
      target: { value: 'J' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'invalid-email' } 
    });
    fireEvent.change(screen.getByLabelText('Message'), { 
      target: { value: 'Short' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await screen.findByText('Name must be at least 2 characters');
    await screen.findByText('Invalid email address');
    await screen.findByText('Message must be at least 10 characters');
  });
});
```

## Cypress Testing

### Component Testing with Cypress

Test components in isolation:

```tsx
// InputField.cy.tsx
import { InputField } from '@rachelallyson/hero-hook-form';
import { useForm } from 'react-hook-form';

function TestWrapper({ children }: { children: React.ReactNode }) {
  const form = useForm();
  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

describe('InputField', () => {
  it('renders with label', () => {
    cy.mount(
      <TestWrapper>
        <InputField name="test" label="Test Field" />
      </TestWrapper>
    );
    
    cy.get('label').should('contain', 'Test Field');
    cy.get('[name="test"]').should('be.visible');
  });

  it('shows validation error', () => {
    cy.mount(
      <TestWrapper>
        <InputField 
          name="email" 
          label="Email"
          rules={{ 
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email'
            }
          }}
        />
      </TestWrapper>
    );
    
    cy.get('[name="email"]').type('invalid-email');
    cy.get('[name="email"]').blur();
    cy.get('[data-testid="email-error"]').should('contain', 'Invalid email');
  });

  it('clears error when valid input is entered', () => {
    cy.mount(
      <TestWrapper>
        <InputField 
          name="email" 
          label="Email"
          rules={{ 
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email'
            }
          }}
        />
      </TestWrapper>
    );
    
    cy.get('[name="email"]').type('invalid-email');
    cy.get('[name="email"]').blur();
    cy.get('[data-testid="email-error"]').should('be.visible');
    
    cy.get('[name="email"]').clear().type('valid@example.com');
    cy.get('[name="email"]').blur();
    cy.get('[data-testid="email-error"]').should('not.exist');
  });
});
```

### Form Integration Testing

Test complete form workflows:

```tsx
// ContactForm.cy.tsx
import { ZodForm, FormFieldHelpers } from '@rachelallyson/hero-hook-form';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

function ContactForm() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <ZodForm
      config={{
        schema: contactSchema,
        fields: [
          FormFieldHelpers.input('name', 'Name'),
          FormFieldHelpers.input('email', 'Email', { type: 'email' }),
          FormFieldHelpers.textarea('message', 'Message', { rows: 4 }),
        ],
        onSubmit: handleSubmit,
        title: 'Contact Us',
      }}
    />
  );
}

describe('ContactForm', () => {
  it('renders form with all fields', () => {
    cy.mount(<ContactForm />);
    
    cy.get('h2').should('contain', 'Contact Us');
    cy.get('[name="name"]').should('be.visible');
    cy.get('[name="email"]').should('be.visible');
    cy.get('[name="message"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('submits form with valid data', () => {
    cy.mount(<ContactForm />);
    
    cy.get('[name="name"]').type('John Doe');
    cy.get('[name="email"]').type('john@example.com');
    cy.get('[name="message"]').type('This is a test message');
    
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('shows validation errors for invalid data', () => {
    cy.mount(<ContactForm />);
    
    cy.get('[name="name"]').type('J');
    cy.get('[name="email"]').type('invalid-email');
    cy.get('[name="message"]').type('Short');
    
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="name-error"]').should('contain', 'Name must be at least 2 characters');
    cy.get('[data-testid="email-error"]').should('contain', 'Invalid email address');
    cy.get('[data-testid="message-error"]').should('contain', 'Message must be at least 10 characters');
  });

  it('clears errors when valid data is entered', () => {
    cy.mount(<ContactForm />);
    
    // Enter invalid data
    cy.get('[name="name"]').type('J');
    cy.get('[name="email"]').type('invalid-email');
    cy.get('[name="message"]').type('Short');
    
    cy.get('button[type="submit"]').click();
    
    // Verify errors are shown
    cy.get('[data-testid="name-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="message-error"]').should('be.visible');
    
    // Enter valid data
    cy.get('[name="name"]').clear().type('John Doe');
    cy.get('[name="email"]').clear().type('john@example.com');
    cy.get('[name="message"]').clear().type('This is a test message');
    
    // Verify errors are cleared
    cy.get('[data-testid="name-error"]').should('not.exist');
    cy.get('[data-testid="email-error"]').should('not.exist');
    cy.get('[data-testid="message-error"]').should('not.exist');
  });
});
```

### Dynamic Form Testing

Test conditional fields and field arrays:

```tsx
// DynamicForm.cy.tsx
import { ZodForm, FormFieldHelpers, ConditionalField, FieldArrayField } from '@rachelallyson/hero-hook-form';
import { z } from 'zod';

const dynamicSchema = z.object({
  hasPhone: z.boolean(),
  phone: z.string().optional(),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    value: z.string().optional(),
  })).optional(),
});

function DynamicForm() {
  return (
    <ZodForm
      config={{
        schema: dynamicSchema,
        fields: [
          FormFieldHelpers.checkbox('hasPhone', 'I have a phone number'),
          
          ConditionalField({
            name: 'phone',
            condition: (values) => values.hasPhone === true,
            render: () => (
              <FormFieldHelpers.input('phone', 'Phone Number', { type: 'tel' })
            ),
          }),
          
          FieldArrayField({
            name: 'items',
            label: 'Items',
            renderItem: (item, index) => (
              <div key={index} className="item-field">
                <FormFieldHelpers.input(`items.${index}.name`, 'Item Name' />
                <FormFieldHelpers.input(`items.${index}.value`, 'Item Value' />
              </div>
            ),
            addButtonText: 'Add Item',
            removeButtonText: 'Remove',
          }),
        ],
        onSubmit: (data) => console.log(data),
      }}
    />
  );
}

describe('DynamicForm', () => {
  it('shows phone field when checkbox is checked', () => {
    cy.mount(<DynamicForm />);
    
    cy.get('[name="hasPhone"]').should('not.be.checked');
    cy.get('[name="phone"]').should('not.exist');
    
    cy.get('[name="hasPhone"]').check();
    cy.get('[name="phone"]').should('be.visible');
  });

  it('adds and removes items in field array', () => {
    cy.mount(<DynamicForm />);
    
    // Add first item
    cy.get('[data-testid="add-item"]').click();
    cy.get('[name="items.0.name"]').should('be.visible');
    cy.get('[name="items.0.value"]').should('be.visible');
    
    // Add second item
    cy.get('[data-testid="add-item"]').click();
    cy.get('[name="items.1.name"]').should('be.visible');
    cy.get('[name="items.1.value"]').should('be.visible');
    
    // Remove first item
    cy.get('[data-testid="remove-item-0"]').click();
    cy.get('[name="items.0.name"]').should('not.exist');
    cy.get('[name="items.1.name"]').should('be.visible');
  });

  it('validates field array items', () => {
    cy.mount(<DynamicForm />);
    
    cy.get('[data-testid="add-item"]').click();
    cy.get('[name="items.0.name"]').type('Item 1');
    cy.get('[name="items.0.value"]').type('Value 1');
    
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

## Accessibility Testing

### Screen Reader Testing

Test with screen readers:

```tsx
// Accessibility.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ZodForm, FormFieldHelpers } from '@rachelallyson/hero-hook-form';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ZodForm
        config={{
          schema: z.object({
            name: z.string().min(2, 'Name is required'),
            email: z.string().email('Invalid email'),
          }),
          fields: [
            FormFieldHelpers.input('name', 'Name'),
            FormFieldHelpers.input('email', 'Email', { type: 'email' }),
          ],
          onSubmit: jest.fn(),
        }}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <ZodForm
        config={{
          schema: z.object({
            email: z.string().email('Invalid email'),
          }),
          fields: [
            FormFieldHelpers.input('email', 'Email', { type: 'email' }),
          ],
          onSubmit: jest.fn(),
        }}
      />
    );
    
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
  });
});
```

### Keyboard Navigation Testing

Test keyboard navigation:

```tsx
// KeyboardNavigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ZodForm, FormFieldHelpers } from '@rachelallyson/hero-hook-form';

describe('Keyboard Navigation', () => {
  it('should navigate fields with Tab key', () => {
    render(
      <ZodForm
        config={{
          schema: z.object({
            name: z.string(),
            email: z.string(),
            message: z.string(),
          }),
          fields: [
            FormFieldHelpers.input('name', 'Name'),
            FormFieldHelpers.input('email', 'Email'),
            FormFieldHelpers.textarea('message', 'Message'),
          ],
          onSubmit: jest.fn(),
        }}
      />
    );
    
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');
    
    nameInput.focus();
    expect(nameInput).toHaveFocus();
    
    fireEvent.keyDown(nameInput, { key: 'Tab' });
    expect(emailInput).toHaveFocus();
    
    fireEvent.keyDown(emailInput, { key: 'Tab' });
    expect(messageInput).toHaveFocus();
  });

  it('should submit form with Enter key', () => {
    const handleSubmit = jest.fn();
    
    render(
      <ZodForm
        config={{
          schema: z.object({
            name: z.string(),
          }),
          fields: [
            FormFieldHelpers.input('name', 'Name'),
          ],
          onSubmit: handleSubmit,
        }}
      />
    );
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    submitButton.focus();
    
    fireEvent.keyDown(submitButton, { key: 'Enter' });
    expect(handleSubmit).toHaveBeenCalled();
  });
});
```

## Performance Testing

### Render Performance

Test component render performance:

```tsx
// Performance.test.tsx
import { render } from '@testing-library/react';
import { ZodForm, FormFieldHelpers } from '@rachelallyson/hero-hook-form';

describe('Performance', () => {
  it('should render within performance budget', () => {
    const start = performance.now();
    
    render(
      <ZodForm
        config={{
          schema: z.object({
            name: z.string(),
            email: z.string(),
            message: z.string(),
          }),
          fields: [
            FormFieldHelpers.input('name', 'Name'),
            FormFieldHelpers.input('email', 'Email'),
            FormFieldHelpers.textarea('message', 'Message'),
          ],
          onSubmit: jest.fn(),
        }}
      />
    );
    
    const end = performance.now();
    const renderTime = end - start;
    
    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  it('should handle large field arrays efficiently', () => {
    const largeFieldArray = Array.from({ length: 100 }, (_, i) => ({
      name: `item${i}`,
      value: `value${i}`,
    }));
    
    const start = performance.now();
    
    render(
      <ZodForm
        config={{
          schema: z.object({
            items: z.array(z.object({
              name: z.string(),
              value: z.string(),
            })),
          }),
          fields: [
            FieldArrayField({
              name: 'items',
              label: 'Items',
              renderItem: (item, index) => (
                <div key={index}>
                  <FormFieldHelpers.input(`items.${index}.name`, 'Item Name' />
                  <FormFieldHelpers.input(`items.${index}.value`, 'Item Value' />
                </div>
              ),
            }),
          ],
          onSubmit: jest.fn(),
        }}
      />
    );
    
    const end = performance.now();
    const renderTime = end - start;
    
    expect(renderTime).toBeLessThan(500); // 500ms budget
  });
});
```

### Memory Usage Testing

Test memory usage:

```tsx
// Memory.test.tsx
describe('Memory Usage', () => {
  it('should not leak memory', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Render and unmount form multiple times
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(
        <ZodForm
          config={{
            schema: z.object({
              name: z.string(),
              email: z.string(),
            }),
            fields: [
              FormFieldHelpers.input('name', 'Name'),
              FormFieldHelpers.input('email', 'Email'),
            ],
            onSubmit: jest.fn(),
          }}
        />
      );
      unmount();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    expect(memoryIncrease).toBeLessThan(1000000); // 1MB limit
  });
});
```

## Testing Utilities

### Custom Test Utilities

Create reusable test utilities:

```tsx
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ConfigProvider } from '@rachelallyson/hero-hook-form';

function AllTheProviders({ children }: { children: React.ReactNode }) {
  const form = useForm();
  
  return (
    <ConfigProvider>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </ConfigProvider>
  );
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mock Functions

Create mock functions for testing:

```tsx
// mocks.ts
export const mockFormSubmit = jest.fn();
export const mockFormError = jest.fn();
export const mockFormSuccess = jest.fn();

export const mockFormConfig = {
  schema: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
  }),
  fields: [
    FormFieldHelpers.input('name', 'Name'),
    FormFieldHelpers.input('email', 'Email', { type: 'email' }),
  ],
  onSubmit: mockFormSubmit,
  onError: mockFormError,
  onSuccess: mockFormSuccess,
};
```

## Testing Best Practices

### 1. Test User Interactions

```tsx
// ✅ Good: Test user interactions
it('should submit form when user clicks submit button', () => {
  render(<MyForm />);
  
  fireEvent.change(screen.getByLabelText('Name'), { 
    target: { value: 'John Doe' } 
  });
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
  });
});

// ❌ Bad: Test implementation details
it('should call onSubmit prop', () => {
  const onSubmit = jest.fn();
  render(<MyForm onSubmit={onSubmit} />);
  
  // This tests implementation, not user behavior
  expect(onSubmit).toHaveBeenCalled();
});
```

### 2. Use Semantic Queries

```tsx
// ✅ Good: Use semantic queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByText('Form submitted successfully');

// ❌ Bad: Use implementation queries
screen.getByTestId('submit-button');
screen.getByClassName('email-input');
screen.getBySelector('[data-success]');
```

### 3. Test Error States

```tsx
// ✅ Good: Test error states
it('should show validation errors', async () => {
  render(<MyForm />);
  
  fireEvent.change(screen.getByLabelText('Email'), { 
    target: { value: 'invalid-email' } 
  });
  fireEvent.blur(screen.getByLabelText('Email'));
  
  await screen.findByText('Invalid email address');
});
```

### 4. Test Loading States

```tsx
// ✅ Good: Test loading states
it('should show loading state during submission', async () => {
  const slowSubmit = jest.fn().mockImplementation(
    () => new Promise(resolve => setTimeout(resolve, 1000))
  );
  
  render(<MyForm onSubmit={slowSubmit} />);
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText('Submitting...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Form submitted successfully')).toBeInTheDocument();
  });
});
```

## Testing Checklist

### ✅ Component Testing

- [ ] Components render correctly
- [ ] Props are passed correctly
- [ ] Event handlers are called
- [ ] Validation errors are displayed
- [ ] Loading states work

### ✅ Integration Testing

- [ ] Forms submit with valid data
- [ ] Validation errors are shown
- [ ] Error states are handled
- [ ] Success states are shown
- [ ] Dynamic fields work

### ✅ Accessibility Testing

- [ ] No accessibility violations
- [ ] ARIA attributes are correct
- [ ] Keyboard navigation works
- [ ] Screen reader support
- [ ] Focus management

### ✅ Performance Testing

- [ ] Render time is within budget
- [ ] Memory usage is reasonable
- [ ] Large forms perform well
- [ ] No memory leaks
- [ ] Bundle size is optimized

### ✅ User Experience Testing

- [ ] User interactions work
- [ ] Error messages are helpful
- [ ] Loading states are clear
- [ ] Success feedback is provided
- [ ] Form is intuitive to use
