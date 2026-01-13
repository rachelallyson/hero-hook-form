# Custom MDX Components

Hero Hook Form documentation includes custom MDX components for better visual presentation.

## Available Components

### `<Tip>`

Use for helpful tips and best practices.

```mdx
<Tip>
This is a helpful tip that provides additional context or guidance.
</Tip>
```

### `<Warning>`

Use for important warnings or things to be careful about.

```mdx
<Warning>
This is a warning about potential issues or pitfalls.
</Warning>
```

### `<Info>`

Use for informational content or additional details.

```mdx
<Info>
This provides additional information or context.
</Info>
```

### `<Note>`

Use for notes or side information.

```mdx
<Note>
This is a note with additional information.
</Note>
```

## Custom Titles

You can customize the title of any callout:

```mdx
<Tip title="💡 Pro Tip">
Custom tip title
</Tip>

<Warning title="⚠️ Important">
Custom warning title
</Warning>
```

## Usage Examples

### In Guides

```mdx
<Tip>
**Best Practice**: Always use explicit boolean comparisons in conditional field conditions.
</Tip>
```

### In Code Examples

```mdx
<Info>
The provider is optional but recommended for consistent styling.
</Info>

```tsx
// Your code here
```

```

### Multiple Callouts

```mdx
<Tip>
This approach works well for most use cases.
</Tip>

<Warning>
Be careful with this pattern - it can cause performance issues with large forms.
</Warning>
```

## Styling

Callout boxes are automatically styled with:

- Color-coded borders (blue, yellow, gray, purple)
- Dark mode support
- Responsive design
- Proper spacing and typography

## Best Practices

1. **Use sparingly** - Don't overuse callouts, they should highlight important information
2. **Be concise** - Keep callout content brief and actionable
3. **Use appropriate types** - Match the callout type to the content (tip vs warning)
4. **Place strategically** - Put callouts near relevant content, not randomly
