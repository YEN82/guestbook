import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY 가 설정되지 않았습니다. 프로젝트 루트에 .env 파일을 확인하세요."
  );
}

export const supabase = createClient(url, anonKey);
