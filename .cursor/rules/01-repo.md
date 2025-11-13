Always read docs/content/llm-context.mdx, docs/content/index.mdx, and src/index.ts before generating code.
Prefer public exports from src/index.ts; avoid deep imports.
Never invent configuration keys; only those documented in docs/content/reference/config.mdx or config.schema.json.
When uncertain, propose tests first in tests/ and then implement.
If touching DB code, follow invariants in docs/content/concepts.mdx#data-invariants.
Documentation source is in docs/content/ (committed to git).
Documentation site infrastructure is in docs/ (docs/app/, docs/next.config.mjs, docs/mdx-components.js).
docs/package.json contains separate dependencies for the documentation site.
API docs are auto-generated from TypeScript using TypeDoc into docs/content/api/.
Regenerate API docs when source changes: npm run docs:api

# Repository Rules

## Documentation and Development Guidelines

### Always Read First

Before generating any code, always read these files in order:

1. `docs/content/llm-context.mdx` - AI context and public surface
2. `docs/content/index.mdx` - Package overview and quick start
3. `docs/content/concepts.mdx` - Core mental models and architecture
4. `docs/content/reference/config.mdx` - Configuration options
5. `src/index.ts` - Public exports and main entry point

### Code Generation Rules

#### Public API Surface

- **Prefer public exports** from `src/index.ts` over deep imports
- **Avoid deep imports** from internal modules (e.g., `src/components/Form.tsx`)
- **Use proper TypeScript types** from the public API surface
- **Follow naming conventions** established in the codebase

#### Form Building

- **Use helper functions** (`FormFieldHelpers`) for simple field creation
- **Use builder patterns** (`createBasicFormBuilder`, `createAdvancedBuilder`) for complex forms
- **Use type-inferred forms** (`defineInferredForm`) for automatic schema generation
- **Always include proper validation** with Zod schemas

#### Component Usage

- **Wrap forms** in `HeroHookFormProvider` for styling defaults
- **Use `disabled` prop** instead of `isDisabled` for consistency with HeroUI
- **Include proper accessibility** attributes (aria-label, aria-describedby)
- **Handle errors gracefully** with proper error display options

#### Configuration

- **Never invent configuration keys** - only use those documented in `docs/content/reference/config.mdx`
- **Follow the established patterns** for field configuration
- **Use proper TypeScript interfaces** for type safety
- **Include validation schemas** for all form data

### Testing Guidelines

- **Write tests first** when uncertain about implementation
- **Use form test utilities** (`createFormTestUtils`) for testing
- **Test all validation scenarios** including edge cases
- **Use Cypress integration** for end-to-end testing

### Database and Data Handling

- **Follow data invariants** documented in `docs/content/concepts.mdx`
- **Use proper error handling** for server-side validation
- **Apply server errors** using `applyServerErrors` utility
- **Handle loading states** appropriately

### Documentation Workflow

- **Edit `.mdx` files** in `docs/content/` directory (guides, concepts, recipes)
- **Regenerate API docs** when source changes: `npm run docs:api`
- **Preview docs locally**: `npm run docs:dev`
- **Build docs**: `npm run docs:build`
- **API docs are auto-generated** from TypeScript source using TypeDoc

### File Structure

- **Documentation source** is in `docs/content/` directory (committed to git)
- **Documentation site infrastructure** is in `docs/` directory
- **`docs/package.json`** contains separate dependencies for the documentation site
- **TypeDoc output** generates `.md` files committed to `docs/content/api/`
- **Human-written docs** use `.mdx` files in `docs/content/`

### Quality Standards

- **No TODOs or placeholders** in production code
- **All code must compile** and be copy-pasteable
- **Include proper error handling** and validation
- **Follow accessibility guidelines** and best practices
- **Use consistent naming** and code style
- **Include comprehensive tests** for all functionality

### Common Patterns

- **Form validation**: Use Zod schemas with proper error messages
- **Dynamic forms**: Use `ConditionalField`, `FieldArrayField`, `DynamicSectionField`
- **Performance**: Use memoization and debounced validation
- **Error handling**: Use `applyServerErrors` for server-side errors
- **Testing**: Use `createFormTestUtils` and Cypress integration
