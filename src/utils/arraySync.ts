/**
 * Options for syncing arrays
 *
 * @template TItem - The item type in the arrays
 */
export interface ArraySyncOptions<TItem> {
  /** Existing items (from database/API) */
  existing: TItem[];
  /** Current items (from form) */
  current: TItem[];
  /** Function to extract ID from an item */
  getId: (item: TItem) => string | number | undefined;
}

/**
 * Result of array sync operation
 *
 * @template TItem - The item type in the arrays
 */
export interface ArraySyncResult<TItem> {
  /** Items that should be deleted (exist in existing but not in current) */
  toDelete: TItem[];
  /** Items that should be updated (exist in both, may have changed) */
  toUpdate: { existing: TItem; current: TItem }[];
  /** Items that should be created (exist in current but not in existing) */
  toCreate: TItem[];
}

/**
 * Sync arrays to determine what items to delete, update, and create.
 *
 * @description
 * Compares existing items (from database) with current items (from form)
 * to determine which items need to be deleted, updated, or created.
 * Useful for edit forms where you need to sync array changes.
 *
 * @template TItem - The item type in the arrays
 *
 * @param {ArraySyncOptions<TItem>} options - Sync options
 * @returns {ArraySyncResult<TItem>} Result with items to delete, update, and create
 *
 * @example
 * ```tsx
 * const { toDelete, toUpdate, toCreate } = syncArrays({
 *   existing: slots,
 *   current: data.slots,
 *   getId: (slot) => slot.id,
 * });
 *
 * // Delete removed slots
 * await Promise.all(toDelete.map(slot => deleteSlot(slot.id)));
 *
 * // Update existing slots
 * await Promise.all(
 *   toUpdate.map(({ existing, current }) =>
 *     updateSlot(existing.id, current)
 *   )
 * );
 *
 * // Create new slots
 * await Promise.all(toCreate.map(slot => createSlot(slot)));
 * ```
 *
 * @category Utilities
 */
export function syncArrays<TItem>(
  options: ArraySyncOptions<TItem>,
): ArraySyncResult<TItem> {
  const { current, existing, getId } = options;

  // Create maps for efficient lookup
  const existingMap = new Map<string | number, TItem>();
  const currentMap = new Map<string | number, TItem>();

  existing.forEach((item) => {
    const id = getId(item);

    if (id !== undefined) {
      existingMap.set(id, item);
    }
  });

  current.forEach((item) => {
    const id = getId(item);

    if (id !== undefined) {
      currentMap.set(id, item);
    }
  });

  // Find items to delete (in existing but not in current)
  const toDelete: TItem[] = [];

  existingMap.forEach((item, id) => {
    if (!currentMap.has(id)) {
      toDelete.push(item);
    }
  });

  // Find items to update (in both, may have changed)
  const toUpdate: { existing: TItem; current: TItem }[] = [];

  existingMap.forEach((existingItem, id) => {
    const currentItem = currentMap.get(id);

    if (currentItem) {
      toUpdate.push({ current: currentItem, existing: existingItem });
    }
  });

  // Find items to create (in current but not in existing)
  const toCreate: TItem[] = [];

  currentMap.forEach((item, id) => {
    if (!existingMap.has(id)) {
      toCreate.push(item);
    }
  });

  return {
    toCreate,
    toDelete,
    toUpdate,
  };
}
