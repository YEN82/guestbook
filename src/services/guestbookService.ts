import type {
  GuestbookEntry,
  GuestbookInsertPayload,
} from "../types/guestbook";

const STORAGE_KEY = "guestbook_entries";

function load(): GuestbookEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestbookEntry[]) : [];
  } catch {
    return [];
  }
}

function save(entries: GuestbookEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export async function listGuestbookEntries(): Promise<GuestbookEntry[]> {
  return Promise.resolve(load());
}

export async function insertGuestbookEntry(
  payload: GuestbookInsertPayload
): Promise<GuestbookEntry> {
  const entry: GuestbookEntry = {
    id: crypto.randomUUID(),
    name: payload.name,
    message: payload.message,
    createdAt: Date.now(),
  };
  const entries = load();
  entries.unshift(entry);
  save(entries);
  return Promise.resolve(entry);
}
