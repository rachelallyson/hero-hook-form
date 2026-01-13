import { describe, expect, it } from "vitest";
import { syncArrays } from "./arraySync";

interface TestItem {
  id?: string;
  name: string;
  value: number;
}

describe("syncArrays", () => {
  it("should identify items to create", () => {
    const existing: TestItem[] = [
      { id: "1", name: "Item 1", value: 10 },
      { id: "2", name: "Item 2", value: 20 },
    ];

    const current: TestItem[] = [
      { id: "1", name: "Item 1", value: 10 },
      { id: "2", name: "Item 2", value: 20 },
      { name: "Item 3", value: 30 }, // New item without ID
    ];

    const result = syncArrays({
      current,
      existing,
      getId: (item) => item.id,
    });

    expect(result.toCreate).toHaveLength(1);
    expect(result.toCreate[0].name).toBe("Item 3");
    expect(result.toDelete).toHaveLength(0);
    expect(result.toUpdate).toHaveLength(2);
  });

  it("should identify items to delete", () => {
    const existing: TestItem[] = [
      { id: "1", name: "Item 1", value: 10 },
      { id: "2", name: "Item 2", value: 20 },
      { id: "3", name: "Item 3", value: 30 },
    ];

    const current: TestItem[] = [
      { id: "1", name: "Item 1", value: 10 },
      { id: "2", name: "Item 2", value: 20 },
    ];

    const result = syncArrays({
      current,
      existing,
      getId: (item) => item.id,
    });

    expect(result.toDelete).toHaveLength(1);
    expect(result.toDelete[0].id).toBe("3");
    expect(result.toCreate).toHaveLength(0);
    expect(result.toUpdate).toHaveLength(2);
  });

  it("should identify items to update", () => {
    const existing: TestItem[] = [
      { id: "1", name: "Item 1", value: 10 },
      { id: "2", name: "Item 2", value: 20 },
    ];

    const current: TestItem[] = [
      { id: "1", name: "Item 1 Updated", value: 15 },
      { id: "2", name: "Item 2", value: 20 },
    ];

    const result = syncArrays({
      current,
      existing,
      getId: (item) => item.id,
    });

    expect(result.toUpdate).toHaveLength(2);
    expect(result.toUpdate[0].existing.name).toBe("Item 1");
    expect(result.toUpdate[0].current.name).toBe("Item 1 Updated");
    expect(result.toDelete).toHaveLength(0);
    expect(result.toCreate).toHaveLength(0);
  });

  it("should handle empty arrays", () => {
    const result = syncArrays({
      current: [],
      existing: [],
      getId: (item: TestItem) => item.id,
    });

    expect(result.toDelete).toHaveLength(0);
    expect(result.toCreate).toHaveLength(0);
    expect(result.toUpdate).toHaveLength(0);
  });

  it("should handle items without IDs", () => {
    const existing: TestItem[] = [{ name: "Item 1", value: 10 }];
    const current: TestItem[] = [{ name: "Item 2", value: 20 }];

    const result = syncArrays({
      current,
      existing,
      getId: (item) => item.id,
    });

    // Items without IDs are treated as new items
    expect(result.toCreate).toHaveLength(1);
    expect(result.toDelete).toHaveLength(0);
    expect(result.toUpdate).toHaveLength(0);
  });

  it("should handle complete replacement", () => {
    const existing: TestItem[] = [
      { id: "1", name: "Item 1", value: 10 },
      { id: "2", name: "Item 2", value: 20 },
    ];

    const current: TestItem[] = [
      { id: "3", name: "Item 3", value: 30 },
      { id: "4", name: "Item 4", value: 40 },
    ];

    const result = syncArrays({
      current,
      existing,
      getId: (item) => item.id,
    });

    expect(result.toDelete).toHaveLength(2);
    expect(result.toCreate).toHaveLength(2);
    expect(result.toUpdate).toHaveLength(0);
  });

  it("should handle numeric IDs", () => {
    interface NumericItem {
      id?: number;
      name: string;
    }

    const existing: NumericItem[] = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];

    const current: NumericItem[] = [
      { id: 1, name: "Item 1 Updated" },
      { id: 3, name: "Item 3" },
    ];

    const result = syncArrays({
      current,
      existing,
      getId: (item: NumericItem) => item.id,
    });

    expect(result.toDelete).toHaveLength(1);
    expect(result.toDelete[0].id).toBe(2);
    expect(result.toCreate).toHaveLength(1);
    expect(result.toCreate[0].id).toBe(3);
    expect(result.toUpdate).toHaveLength(1);
  });
});
