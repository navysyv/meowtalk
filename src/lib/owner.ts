import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";

/** Returns user_id (if logged in) and session_id. Use for inserts so logged-in users own their rows. */
export async function getOwner(): Promise<{ user_id: string | null; session_id: string }> {
  let user_id: string | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user_id = data.user?.id ?? null;
  } catch { /* ignore */ }
  return { user_id, session_id: getSessionId() };
}
