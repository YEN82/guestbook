import { supabase } from "../lib/supabaseClient";
import type {
  GuestbookEntry,
  GuestbookInsertPayload,
} from "../types/guestbook";

type GuestbookRow = {
  id: number;
  name: string | null;
  message: string | null;
  created_at: string | null;
};

function mapRow(row: GuestbookRow): GuestbookEntry {
  return {
    id: String(row.id),
    name: row.name ?? "",
    message: row.message ?? "",
    createdAt: row.created_at
      ? new Date(row.created_at).getTime()
      : Date.now(),
  };
}

export async function listGuestbookEntries(): Promise<GuestbookEntry[]> {
  const { data, error } = await supabase
    .from("guestbook")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as GuestbookRow[]).map(mapRow);
}

export async function insertGuestbookEntry(
  payload: GuestbookInsertPayload
): Promise<GuestbookEntry> {
  const { data, error } = await supabase
    .from("guestbook")
    .insert({ name: payload.name, message: payload.message })
    .select("id, name, message, created_at")
    .single();

  if (error) throw error;
  return mapRow(data as GuestbookRow);
}
