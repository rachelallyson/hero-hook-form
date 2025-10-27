# Performance Guide

Learn how to optimize Hero Hook Form for better performance and user experience.

## Memoization

### Component Memoization

All field components are automatically memoized with `React.memo`:

```tsx
// ✅ Already optimized - no additional work needed
<InputField name="email" label="Email" />
<CheckboxField name="newsletter" label="Subscribe" />
```

### Custom Field Components

Memoize custom field components:

```tsx
import React, { memo } from "react";
import { InputField } from "@rachelallyson/hero-hook-form";

const CustomField = memo(({ name, label, ...props }) => {
  return (
    <div className="custom-field">
      <InputField name={name} label={label} {...props} />
      <div className="custom-addition">Additional content</div>
    </div>
  );
});

// Use in form
<CustomField name="customField" label="Custom Field" />
```

### Field Configuration Memoization

Memoize field configurations to prevent re-creation:

```tsx
import { useMemo } from "react";
import { FormFieldHelpers } from "@rachelallyson/hero-hook-form";

function MyForm() {
  // Memoize field configurations
  const fields = useMemo(() => [
    FormFieldHelpers.input("name", "Name"),
    FormFieldHelpers.input("email", "Email", { type: "email" }),
    FormFieldHelpers.checkbox("newsletter", "Subscribe to newsletter"),
  ], []);

  return (
    <ZodForm
      config={{
        schema: mySchema,
        fields,
        onSubmit: handleSubmit,
      }}
    />
  );
}
```

## Debounced Validation

### Basic Debouncing

Use `useDebouncedValidation` for expensive validation:

```tsx
import { useDebouncedValidation } from "@rachelallyson/hero-hook-form";

function ExpensiveValidationField() {
  const [value, setValue] = useState("");
  const { debouncedValue, isDebouncing } = useDebouncedValidation(value, 300);

  const handleValidation = async (val: string) => {
    // Expensive validation (API call, complex calculation)
    const response = await fetch(`/api/validate?value=${val}`);
    return response.ok;
  };

  return (
    <InputField
      name="expensiveField"
      label="Field with Expensive Validation"
      rules={{
        validate: async (val) => {
          if (val !== debouncedValue) return true; // Skip if not debounced value
          return await handleValidation(val);
        },
      }}
    />
  );
}
```

### Custom Debounce Configuration

Configure debounce behavior:

```tsx
const { debouncedValue, isDebouncing, cancel } = useDebouncedValidation(
  fieldValue,
  500, // 500ms delay
  {
    leading: false,   // Don't call on leading edge
    trailing: true,   // Call on trailing edge
    maxWait: 2000,    // Maximum wait time
  }
);
```

### Visual Debounce Feedback

Show debounce status to users:

```tsx
function DebouncedField() {
  const [value, setValue] = useState("");
  const { debouncedValue, isDebouncing } = useDebouncedValidation(value, 300);

  return (
    <div>
      <InputField
        name="debouncedField"
        label="Debounced Field"
        value={value}
        onChange={setValue}
      />
      {isDebouncing && (
        <div className="debounce-indicator">
          <Spinner size="sm" />
          <span>Validating...</span>
        </div>
      )}
    </div>
  );
}
```

## Field Array Optimization

### Efficient Field Array Rendering

Optimize field arrays for better performance:

```tsx
import { FieldArrayField } from "@rachelallyson/hero-hook-form";
import { memo } from "react";

const ItemField = memo(({ index, item }: { index: number; item: any }) => (
  <div className="item-field">
    <InputField name={`items.${index}.name`} label="Item Name" />
    <InputField name={`items.${index}.value`} label="Item Value" />
  </div>
));

function OptimizedFieldArray() {
  return (
    <FieldArrayField
      name="items"
      label="Items"
      renderItem={(item, index) => (
        <ItemField key={index} index={index} item={item} />
      )}
      addButtonText="Add Item"
      removeButtonText="Remove"
    />
  );
}
```

### Virtual Scrolling for Large Arrays

For very large field arrays, implement virtual scrolling:

```tsx
import { FixedSizeList as List } from "react-window";

function VirtualizedFieldArray() {
  const [items, setItems] = useState([]);
  
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <InputField name={`items.${index}.name`} label="Item Name" />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </List>
  );
}
```

## Conditional Field Optimization

### Efficient Conditional Rendering

Optimize conditional fields to prevent unnecessary re-renders:

```tsx
import { ConditionalField } from "@rachelallyson/hero-hook-form";
import { memo, useMemo } from "react";

const ConditionalFieldComponent = memo(({ 
  condition, 
  render, 
  values 
}: { 
  condition: (values: any) => boolean;
  render: () => React.ReactNode;
  values: any;
}) => {
  const shouldRender = useMemo(() => condition(values), [condition, values]);
  
  if (!shouldRender) return null;
  return <>{render()}</>;
});

// Use in form
<ConditionalField
  name="conditionalField"
  condition={(values) => values.showField === true}
  render={() => (
    <InputField name="conditionalField" label="Conditional Field" />
  )}
/>
```

### Condition Memoization

Memoize condition functions:

```tsx
const conditionFunctions = useMemo(() => ({
  showAdvanced: (values: any) => values.userType === 'advanced',
  showBusiness: (values: any) => values.accountType === 'business',
}), []);

<ConditionalField
  name="advancedField"
  condition={conditionFunctions.showAdvanced}
  render={() => <AdvancedFields />}
/>
```

## Performance Monitoring

### Built-in Performance Monitoring

Use the built-in performance monitoring:

```tsx
import { usePerformanceMonitor } from "@rachelallyson/hero-hook-form";

function MonitoredForm() {
  const {
    renderTime,
    validationTime,
    submissionTime,
    isMonitoring,
  } = usePerformanceMonitor();

  return (
    <div>
      <ZodForm config={{ /* ... */ }} />
      
      {isMonitoring && (
        <div className="performance-info">
          <p>Render: {renderTime}ms</p>
          <p>Validation: {validationTime}ms</p>
          <p>Submission: {submissionTime}ms</p>
        </div>
      )}
    </div>
  );
}
```

### Custom Performance Tracking

Implement custom performance tracking:

```tsx
import { useEffect, useRef } from "react";

function PerformanceTracker() {
  const renderStart = useRef<number>();
  const validationStart = useRef<number>();
  
  useEffect(() => {
    renderStart.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - (renderStart.current || 0);
      console.log(`Form render time: ${renderTime}ms`);
    };
  }, []);
  
  const trackValidation = () => {
    validationStart.current = performance.now();
  };
  
  const trackValidationEnd = () => {
    const validationTime = performance.now() - (validationStart.current || 0);
    console.log(`Validation time: ${validationTime}ms`);
  };
  
  return (
    <ZodForm
      config={{
        fields: myFields,
        onSubmit: handleSubmit,
        onValidationStart: trackValidation,
        onValidationEnd: trackValidationEnd,
      }}
    />
  );
}
```

## Bundle Size Optimization

### Tree Shaking

Ensure proper tree shaking:

```tsx
// ✅ Good: Import only what you need
import { ZodForm, FormFieldHelpers } from "@rachelallyson/hero-hook-form";

// ❌ Bad: Import entire library
import * as HeroHookForm from "@rachelallyson/hero-hook-form";
```

### Dynamic Imports

Use dynamic imports for large features:

```tsx
import { lazy, Suspense } from "react";

const AdvancedForm = lazy(() => import('./AdvancedForm'));

function MyApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdvancedForm />
    </Suspense>
  );
}
```

### Code Splitting

Split forms by route or feature:

```tsx
// routes/ContactForm.tsx
export default function ContactForm() {
  return <ZodForm config={contactConfig} />;
}

// routes/SettingsForm.tsx
export default function SettingsForm() {
  return <ZodForm config={settingsConfig} />;
}

// App.tsx
import { lazy } from "react";

const ContactForm = lazy(() => import('./routes/ContactForm'));
const SettingsForm = lazy(() => import('./routes/SettingsForm'));
```

## Memory Optimization

### Cleanup Event Listeners

Properly cleanup event listeners:

```tsx
import { useEffect, useRef } from "react";

function FormWithCleanup() {
  const cleanupRef = useRef<(() => void)[]>([]);
  
  useEffect(() => {
    const handleResize = () => {
      // Handle resize
    };
    
    window.addEventListener('resize', handleResize);
    
    cleanupRef.current.push(() => {
      window.removeEventListener('resize', handleResize);
    });
    
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup());
    };
  }, []);
  
  return <ZodForm config={{ /* ... */ }} />;
}
```

### Avoid Memory Leaks

Prevent memory leaks in form components:

```tsx
import { useEffect, useRef } from "react";

function FormWithRefs() {
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Set up timeout
    timeoutRef.current = setTimeout(() => {
      // Do something
    }, 1000);
    
    return () => {
      // Cleanup timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return <form ref={formRef}><ZodForm config={{ /* ... */ }} /></form>;
}
```

## Server-Side Rendering (SSR)

### SSR Compatibility

Ensure forms work with SSR:

```tsx
import { useEffect, useState } from "react";

function SSRCompatibleForm() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div>Loading form...</div>;
  }
  
  return <ZodForm config={{ /* ... */ }} />;
}
```

### Hydration Optimization

Optimize hydration performance:

```tsx
function OptimizedSSRForm() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="form-skeleton">
        {/* Skeleton UI that matches form structure */}
      </div>
    );
  }
  
  return <ZodForm config={{ /* ... */ }} />;
}
```

## Performance Testing

### Load Testing

Test form performance under load:

```tsx
// Performance test
describe('Form Performance', () => {
  it('should render within performance budget', () => {
    const start = performance.now();
    render(<MyForm />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100); // 100ms budget
  });
  
  it('should handle large field arrays efficiently', () => {
    const largeFieldArray = Array.from({ length: 1000 }, (_, i) => ({
      name: `item${i}`,
      value: `value${i}`,
    }));
    
    const start = performance.now();
    render(<FieldArrayForm items={largeFieldArray} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(500); // 500ms budget
  });
});
```

### Memory Usage Testing

Monitor memory usage:

```tsx
// Memory usage test
describe('Memory Usage', () => {
  it('should not leak memory', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Render and unmount form multiple times
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<MyForm />);
      unmount();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    expect(memoryIncrease).toBeLessThan(1000000); // 1MB limit
  });
});
```

## Performance Best Practices

### 1. Minimize Re-renders

```tsx
// ✅ Good: Memoized components
const MemoizedField = memo(InputField);

// ❌ Bad: Unnecessary re-renders
function BadForm() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <InputField name="email" label="Email" /> {/* Re-renders on count change */}
    </div>
  );
}
```

### 2. Optimize Validation

```tsx
// ✅ Good: Debounced validation
const { debouncedValue } = useDebouncedValidation(value, 300);

// ❌ Bad: Validation on every keystroke
<InputField
  name="email"
  rules={{
    validate: async (value) => {
      // Expensive API call on every keystroke
      return await validateEmail(value);
    },
  }}
/>
```

### 3. Use Efficient Data Structures

```tsx
// ✅ Good: Efficient field array
const fields = useMemo(() => [
  FormFieldHelpers.input("name", "Name"),
  FormFieldHelpers.input("email", "Email"),
], []);

// ❌ Bad: Recreated on every render
function BadForm() {
  const fields = [
    FormFieldHelpers.input("name", "Name"),
    FormFieldHelpers.input("email", "Email"),
  ];
  
  return <ZodForm config={{ fields, onSubmit }} />;
}
```

### 4. Monitor Performance

```tsx
// ✅ Good: Performance monitoring
const { renderTime } = usePerformanceMonitor();

if (renderTime > 100) {
  console.warn('Form render time exceeds budget:', renderTime);
}
```

## Performance Checklist

### ✅ Optimization

- [ ] Components are memoized
- [ ] Field configurations are memoized
- [ ] Expensive validation is debounced
- [ ] Field arrays are optimized
- [ ] Conditional fields are efficient

### ✅ Monitoring

- [ ] Performance is monitored
- [ ] Memory usage is tracked
- [ ] Bundle size is optimized
- [ ] SSR compatibility is ensured

### ✅ Testing

- [ ] Performance tests are written
- [ ] Load testing is performed
- [ ] Memory leak tests pass
- [ ] Performance budgets are met

## Tools and Resources

- **React DevTools Profiler**: Profile component performance
- **Chrome DevTools**: Monitor memory usage and performance
- **Bundle Analyzer**: Analyze bundle size
- **Lighthouse**: Audit performance and accessibility
- **Web Vitals**: Monitor Core Web Vitals
