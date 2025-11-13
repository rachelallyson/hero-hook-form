import type { FieldValues, Path } from "react-hook-form";
import type { ZodFormFieldConfig } from "../types";

/**
 * Enhanced nested path builder with better syntax for complex nested structures
 * Provides multiple approaches for handling nested field paths
 */

// Approach 1: Object-based path builder
export class NestedPathBuilder<T extends FieldValues> {
  private fields: ZodFormFieldConfig<T>[] = [];

  /**
   * Create a nested object path builder
   * Usage: builder.nest("address").field("street", "Street Address")
   */
  nest<TPath extends Path<T>>(path: TPath): NestedObjectBuilder<T, TPath> {
    return new NestedObjectBuilder<T, TPath>(this, path);
  }

  /**
   * Create a section-based path builder
   * Usage: builder.section("shipping").field("street", "Street Address")
   */
  section<TPath extends Path<T>>(path: TPath): SectionBuilder<T, TPath> {
    return new SectionBuilder<T, TPath>(this, path);
  }

  /**
   * Add a field with single path
   * Usage: builder.field("firstName", "First Name")
   */
  field(name: Path<T>, label: string, type = "input", props?: any): this {
    this.fields.push({
      label,
      name,
      type: type as any,
      ...props,
    });

    return this;
  }

  /**
   * Add a field with path segments
   * Usage: builder.fieldPath(["user", "profile", "name"], "Full Name")
   */
  fieldPath(path: string[], label: string, type = "input", props?: any): this {
    const name = path.join(".") as Path<T>;

    this.fields.push({
      label,
      name,
      type: type as any,
      ...props,
    });

    return this;
  }

  /**
   * Add a field with template literal path
   * Usage: builder.field`user.profile.name`("Full Name")
   */
  fieldTemplate(path: TemplateStringsArray): FieldTemplateBuilder<T> {
    const pathString = path[0];

    return new FieldTemplateBuilder<T>(this, pathString);
  }

  /**
   * Return to the parent builder (no-op for root builder)
   */
  end(): this {
    return this;
  }

  build(): ZodFormFieldConfig<T>[] {
    return this.fields;
  }
}

/**
 * Nested object builder for chaining nested paths
 */
class NestedObjectBuilder<T extends FieldValues, TPath extends Path<T>> {
  constructor(
    private parent: NestedPathBuilder<T>,
    private path: TPath,
  ) {}

  /**
   * Add a field to the current nested path
   */
  field<FName extends string>(
    fieldName: FName,
    label: string,
    type = "input",
    props?: any,
  ): NestedObjectBuilder<T, TPath> {
    const fullPath = `${this.path}.${fieldName}` as Path<T>;

    (this.parent as any).fields.push({
      label,
      name: fullPath,
      type: type as any,
      ...props,
    });

    return this;
  }

  /**
   * Nest deeper into the object
   */
  nest<SubPath extends string>(
    subPath: SubPath,
  ): NestedObjectBuilder<T, TPath> {
    return new NestedObjectBuilder<T, TPath>(
      this.parent,
      `${this.path}.${subPath}` as TPath,
    );
  }

  /**
   * Return to the parent builder
   */
  end(): NestedPathBuilder<T> {
    return this.parent;
  }
}

/**
 * Section builder for grouping related fields
 */
class SectionBuilder<T extends FieldValues, TPath extends Path<T>> {
  constructor(
    private parent: NestedPathBuilder<T>,
    private path: TPath,
  ) {}

  /**
   * Add a field to the current section
   */
  field<FName extends string>(
    fieldName: FName,
    label: string,
    type = "input",
    props?: any,
  ): SectionBuilder<T, TPath> {
    const fullPath = `${this.path}.${fieldName}` as Path<T>;

    (this.parent as any).fields.push({
      label,
      name: fullPath,
      type: type as any,
      ...props,
    });

    return this;
  }

  /**
   * Add multiple fields to the section
   */
  fields(
    fieldDefinitions: {
      name: string;
      label: string;
      type?: string;
      props?: any;
    }[],
  ): SectionBuilder<T, TPath> {
    fieldDefinitions.forEach((field) => {
      this.field(field.name, field.label, field.type, field.props);
    });

    return this;
  }

  /**
   * Nest deeper into the section
   */
  nest<SubPath extends string>(
    subPath: SubPath,
  ): NestedObjectBuilder<T, TPath> {
    return new NestedObjectBuilder<T, TPath>(
      this.parent,
      `${this.path}.${subPath}` as TPath,
    );
  }

  /**
   * Return to the parent builder
   */
  end(): NestedPathBuilder<T> {
    return this.parent;
  }
}

/**
 * Template literal field builder
 */
class FieldTemplateBuilder<T extends FieldValues> {
  constructor(
    private parent: NestedPathBuilder<T>,
    private path: string,
  ) {}

  /**
   * Complete the field definition
   */
  complete(label: string, type = "input", props?: any): NestedPathBuilder<T> {
    (this.parent as any).fields.push({
      label,
      name: this.path as Path<T>,
      type: type as any,
      ...props,
    });

    return this.parent;
  }
}

/**
 * Factory function for creating the nested path builder
 */
export function createNestedPathBuilder<
  T extends FieldValues,
>(): NestedPathBuilder<T> {
  return new NestedPathBuilder<T>();
}
