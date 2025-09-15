export type GenerationRecord = {
  id: string;
  createdAt: number;
  packageId: string;
  images: string[];
};

const KEY = "generationHistory";

export function getHistory(): GenerationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GenerationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: GenerationRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addRecord(record: GenerationRecord) {
  const items = getHistory();
  items.unshift(record);
  saveHistory(items.slice(0, 100));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
