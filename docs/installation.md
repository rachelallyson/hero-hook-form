# Installation Guide

The `@rachelallyson/hero-hook-form` package supports two different installation approaches for HeroUI components, giving you flexibility to choose based on your project's needs.

## 🎯 Installation Options

### Option 1: Individual HeroUI Packages (Recommended for Bundle Optimization)

Install only the HeroUI components you actually use:

```bash
npm install @rachelallyson/hero-hook-form

# Install only the HeroUI components you need
npm install @heroui/button @heroui/input @heroui/select @heroui/checkbox
# ... add other components as needed
```

**Benefits:**

- ✅ **Smaller bundle size** - Only includes components you use
- ✅ **Better tree-shaking** - Unused components are eliminated
- ✅ **Faster builds** - Less code to process
- ✅ **More control** - Explicit about what you're using

**When to use:** Production applications where bundle size matters, or when you only use a few HeroUI components.

### Option 2: All-in-One HeroUI Package (Recommended for Development)

Install the complete HeroUI package:

```bash
npm install @rachelallyson/hero-hook-form @heroui/react
```

**Benefits:**

- ✅ **Simpler setup** - One package installs everything
- ✅ **No missing dependencies** - All components available
- ✅ **Faster development** - No need to track individual packages
- ✅ **Future-proof** - New components automatically available

**When to use:** Development, prototyping, or when you use many HeroUI components.

## 📦 Required Dependencies

Regardless of which option you choose, you'll need these core dependencies:

```bash
npm install react react-dom react-hook-form zod
```

## 🔧 Package Configuration

Both approaches work seamlessly with our package. The internal UI system automatically detects which approach you're using:

- **Individual packages**: Components are imported from their specific packages
- **All-in-one package**: Components are imported from `@heroui/react`

## 📋 Complete Installation Examples

### For a Simple Form (Individual Packages)

```bash
npm install @rachelallyson/hero-hook-form
npm install @heroui/button @heroui/input @heroui/select
npm install react react-dom react-hook-form zod
```

### For a Complex Form (All-in-One)

```bash
npm install @rachelallyson/hero-hook-form @heroui/react
npm install react react-dom react-hook-form zod
```

### For Testing (All-in-One Recommended)

```bash
npm install @rachelallyson/hero-hook-form @heroui/react @heroui/system
npm install react react-dom react-hook-form zod
```

## 🚀 Usage

Once installed, you can use the package the same way regardless of your installation approach:

```tsx
import { ZodForm } from '@rachelallyson/hero-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

const config = {
  schema,
  fields: [
    { name: 'name', type: 'input', label: 'Name' },
    { name: 'email', type: 'input', label: 'Email', inputProps: { type: 'email' } },
  ],
};

function MyForm() {
  return <ZodForm config={config} />;
}
```

## 🔍 Troubleshooting

### "Module not found" errors

If you get module not found errors for HeroUI components:

1. **For individual packages**: Make sure you've installed the specific component package
2. **For all-in-one**: Make sure you've installed `@heroui/react`

### Bundle size concerns

If your bundle is too large:

1. Switch to individual packages
2. Only install the HeroUI components you actually use
3. Use bundle analyzers to identify unused components

### Development vs Production

- **Development**: Use `@heroui/react` for simplicity
- **Production**: Use individual packages for optimization

## 📚 Next Steps

- [Getting Started Guide](./getting-started.md)
- [Component Reference](./components.md)
- [Validation Guide](./validation.md)
- [Advanced Patterns](./advanced-patterns.md)
