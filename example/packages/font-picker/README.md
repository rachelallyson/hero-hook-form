# @rachelallyson/heroui-font-picker

A powerful font picker component for HeroUI with Google Fonts integration and sprite-based previews.

## Features

- 🎨 **1,785+ Google Fonts** with instant previews
- 🖼️ **Sprite-based Previews** - Zero loading time for font previews
- 🚀 **Intelligent Loading** - Only loads 4 essential variants by default
- 🎯 **HeroUI Integration** - Seamless integration with HeroUI components
- 📱 **React Hook Form** - Built-in support for form integration
- ⚡ **TypeScript** - Full TypeScript support
- 🎨 **Customizable** - Flexible styling and behavior options

## Installation

```bash
npm install @rachelallyson/heroui-font-picker
```

### Peer Dependencies

The font picker supports both HeroUI packages. Install **one** of the following:

**Option 1: Full HeroUI package**

```bash
npm install @heroui/react react react-dom
```

**Option 2: Autocomplete-only package**

```bash
npm install @heroui/autocomplete react react-dom
```

**Option 3: Individual HeroUI packages (like @rachelallyson/hero-hook-form)**

```bash
npm install @heroui/autocomplete @heroui/system react react-dom
```

The font picker will automatically detect which package is available and use the appropriate components. This follows the same pattern as `@rachelallyson/hero-hook-form` for maximum flexibility.

## Quick Start

### Basic Usage

```tsx
import { FontPicker } from '@rachelallyson/heroui-font-picker';

function MyComponent() {
  const [selectedFont, setSelectedFont] = useState('Inter');

  return (
    <FontPicker
      label="Choose Font"
      description="Select your preferred font"
      value={selectedFont}
      onSelectionChange={(key) => setSelectedFont(key as string)}
      placeholder="Choose a font..."
      showFontPreview={true}
      size="md"
      variant="bordered"
      isRequired
    />
  );
}
```

### With Form Integration

```tsx
import { FontPickerField } from '@rachelallyson/heroui-font-picker';

function MyForm() {
  const [font, setFont] = useState('Inter');
  const [error, setError] = useState('');

  return (
    <FontPickerField
      label="Choose Font"
      description="Select your preferred font"
      value={font}
      onChange={setFont}
      error={error}
      fontPickerProps={{
        showFontPreview: true,
        loadAllVariants: false
      }}
    />
  );
}
```

## Props

### FontPicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Current selected font |
| `onChange` | `(value: string) => void` | - | Callback when font changes |
| `disabled` | `boolean` | `false` | Whether the picker is disabled |
| `showFontPreview` | `boolean` | `true` | Show font preview sprites |
| `loadAllVariants` | `boolean` | `false` | Load all font variants vs 4 essential |
| `onFontsLoaded` | `(loaded: boolean) => void` | - | Callback when fonts finish loading |
| `fontsLoadedTimeout` | `number` | `3000` | Timeout for font loading detection |
| `placeholder` | `string` | `"Select a font..."` | Placeholder text |
| `className` | `string` | - | Additional CSS classes |

### FontPickerField Props

All FontPicker props plus:

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Field label |
| `description` | `string` | Field description |
| `value` | `string` | Current field value |
| `onChange` | `(value: string) => void` | Change handler |
| `error` | `string` | Error message to display |

## Advanced Usage

### Custom Font Loading

```tsx
import { loadGoogleFont, getFourVariants } from '@rachelallyson/heroui-font-picker';

// Load specific font with all variants
loadGoogleFont('Inter', ['0,300', '0,400', '0,500', '0,600', '0,700']);

// Load font with intelligent 4-variant selection
const font = { variants: ['0,300', '0,400', '0,500', '0,600', '0,700', '1,300', '1,400'] };
const essentialVariants = getFourVariants(font.variants);
loadGoogleFont('Inter', essentialVariants);
```

### Font Loading Detection

```tsx
import { checkFontLoaded } from '@rachelallyson/heroui-font-picker';

const isLoaded = await checkFontLoaded('Inter', 5000);
console.log('Font loaded:', isLoaded);
```

## Sprite System

The font picker uses a sophisticated sprite system for instant font previews:

- **1,785+ Google Fonts** pre-rendered as sprites
- **Zero loading time** for previews
- **30MB sprite files** for complete coverage
- **CSS positioning** for efficient rendering

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
