export type LibraryItem = {
  id: string;
  createdAt: number;
  sourceRecordId?: string;
  packageId?: string;
  images: string[];
};

const KEY = "savedLibraryItems";

export function getLibrary(): LibraryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LibraryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items: LibraryItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToLibrary(item: LibraryItem) {
  const items = getLibrary();
  items.unshift(item);
  saveLibrary(items.slice(0, 200));
}

function imageSetSignature(images: string[]): string {
  const uniqueSorted = Array.from(new Set((images || []).filter(Boolean))).sort();
  return uniqueSorted.join("||");
}

function hasGroupWithSameImages(images: string[]): boolean {
  const sig = imageSetSignature(images);
  const existing = getLibrary();
  return existing.some((it) => imageSetSignature(it.images) === sig);
}

export function addAllToLibrary(
  images: string[],
  metadata?: { sourceRecordId?: string; packageId?: string },
): boolean {
  const normalized = Array.from(new Set((images || []).filter(Boolean)));
  if (normalized.length === 0) return false;
  if (hasGroupWithSameImages(normalized)) return false;

  addToLibrary({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    sourceRecordId: metadata?.sourceRecordId,
    packageId: metadata?.packageId,
    images: normalized,
  });
  return true;
}

export function removeLibraryItem(id: string) {
  const items = getLibrary().filter((it) => it.id !== id);
  saveLibrary(items);
}

export function clearLibrary() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function removeImagesFromLibrary(images: string[]): number {
  const targets = new Set((images || []).filter(Boolean));
  if (targets.size === 0) return 0;
  const items = getLibrary();
  let removed = 0;
  const next = items
    .map((g) => {
      const before = g.images.length;
      const remaining = g.images.filter((src) => !targets.has(src));
      removed += before - remaining.length;
      return { ...g, images: remaining } as LibraryItem;
    })
    .filter((g) => g.images.length > 0);
  saveLibrary(next);
  return removed;
}


