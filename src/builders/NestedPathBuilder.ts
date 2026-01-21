import type { FieldValues, Path } from "react-hook-form";
import type { FormFieldType, ZodFormFieldConfig } from "../types";
import { createField, type FieldCreationParams } from "./AdvancedFormBuilder";

/**
 * Helper type to construct a nested path from a base path and sub-path.
 * Attempts to construct the path and falls back to Path<T> if TypeScript
 * can't verify the nested structure at compile time.
 *
 * @example
 * type T = { user: { name: string } };
 * type Nested = ConstructNestedPath<T, "user", "name">; // "user.name"
 */
type ConstructNestedPath<
  T extends FieldValues,
  TBasePath extends Path<T>,
  TSubPath extends string,
> =
  `${TBasePath}.${TSubPath}` extends Path<T>
    ? `${TBasePath}.${TSubPath}`
    : Path<T>;

/**
 * Enhanced nested path builder with better syntax for complex nested structures
 * Provides multiple approaches for handling nested field paths
 */

// Approach 1: Object-based path builder
export class NestedPathBuilder<T extends FieldValues> {
  // fields is accessed by nested builder classes, so it needs to be accessible
  // Making it public allows nested builders to add fields while maintaining encapsulation
  public fields: ZodFormFieldConfig<T>[] = [];

  /**
   * Create a nested object path builder
   * Usage: builder.nest("address").field("street", "Street Address")
   *
   * @param path - A path in the form data structure. When called from root level,
   *               accepts Path<T>. When called after .end() from a nested context,
   *               accepts any string for nested paths under sections.
   * @returns A builder for nested paths under the specified path
   */
  nest(path: string & {}): NestedObjectBuilder<T, Path<T>> {
    return new NestedObjectBuilder<T, Path<T>>(this, path as Path<T>);
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
   * Usage: builder.field({ type: "input", name: "firstName", label: "First Name" })
   */
  field(
    params: FieldCreationParams<T> | FieldCreationParams<Record<string, any>>,
  ): this {
    this.fields.push(createField(params as FieldCreationParams<T>));

    return this;
  }

  /**
   * Add a field with path segments
   * Usage: builder.fieldPath({ type: "input", name: path.join("."), label: "Full Name" })
   */
  fieldPath(params: FieldCreationParams<T>): this {
    this.fields.push(createField(params));

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
  field(
    params: FieldCreationParams<Record<string, any>>,
  ): NestedObjectBuilder<T, TPath> {
    // If name is already a Path<T>, use it directly, otherwise construct full path
    const fullPath =
      typeof params.name === "string"
        ? (`${this.path}.${params.name}` as Path<T>)
        : params.name;

    const fieldParams = {
      ...params,
      name: fullPath,
    } as FieldCreationParams<T>;

    this.parent.fields.push(createField(fieldParams));

    return this;
  }

  /**
   * Nest deeper into the object
   *
   * @param subPath - A string representing a nested path under the current path.
   *                  The parameter accepts any string; TypeScript validates the constructed
   *                  path (basePath.subPath) in the return type.
   * @returns A builder for the nested path
   */
  nest<SubPath extends string>(
    subPath: SubPath,
  ): NestedObjectBuilder<T, ConstructNestedPath<T, TPath, SubPath>> {
    const fullPath = `${this.path}.${subPath}` as ConstructNestedPath<
      T,
      TPath,
      SubPath
    >;

    return new NestedObjectBuilder<T, ConstructNestedPath<T, TPath, SubPath>>(
      this.parent,
      fullPath,
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
  field(
    params: FieldCreationParams<Record<string, any>>,
  ): SectionBuilder<T, TPath> {
    // If name is already a Path<T>, use it directly, otherwise construct full path
    const fullPath =
      typeof params.name === "string"
        ? (`${this.path}.${params.name}` as Path<T>)
        : params.name;

    const fieldParams = {
      ...params,
      name: fullPath,
    } as FieldCreationParams<T>;

    this.parent.fields.push(createField(fieldParams));

    return this;
  }

  /**
   * Add multiple fields to the section
   */
  fields(
    fieldDefinitions: {
      name: string;
      label: string;
      type?: FormFieldType;
      props?: Record<string, unknown>;
    }[],
  ): SectionBuilder<T, TPath> {
    fieldDefinitions.forEach((field) => {
      const fullPath = `${this.path}.${field.name}` as Path<T>;

      this.parent.fields.push({
        label: field.label,
        name: fullPath,
        type: field.type || "input",
        ...field.props,
      } as ZodFormFieldConfig<T>);
    });

    return this;
  }

  /**
   * Nest deeper into the section
   *
   * @param subPath - A string representing a nested path under the current section path.
   *                  The parameter accepts any string; TypeScript validates the constructed
   *                  path (basePath.subPath) in the return type.
   * @returns A builder for the nested path
   */
  nest<SubPath extends string = string>(
    subPath: SubPath,
  ): NestedObjectBuilder<T, ConstructNestedPath<T, TPath, string>> {
    const fullPath = `${this.path}.${subPath}` as ConstructNestedPath<
      T,
      TPath,
      string
    >;

    return new NestedObjectBuilder<T, ConstructNestedPath<T, TPath, string>>(
      this.parent,
      fullPath,
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
  complete(
    params: Omit<FieldCreationParams<Record<string, any>>, "name"> & {
      name?: string;
    },
  ): NestedPathBuilder<T> {
    const fieldParams = {
      ...params,
      name: (params.name
        ? `${this.path}.${params.name}`
        : this.path) as Path<T>,
    } as FieldCreationParams<T>;

    this.parent.fields.push(createField(fieldParams));

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
