import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useAuth } from "@/hooks/useAuth";

export const FREE_MOCK_LIMIT_PER_WEEK = 2;

export function useFreemium() {
  const { user } = useAuth();
  const [mocksThisWeek, setMocksThisWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const sid = getSessionId();
      const { count } = await supabase
        .from("mock_results")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sid)
        .gte("created_at", since);
      setMocksThisWeek(count ?? 0);
    } catch {
      setMocksThisWeek(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh, user?.id]);

  // Premium not yet wired to payments — always false for now.
  const isPremium = false;
  const remaining = Math.max(0, FREE_MOCK_LIMIT_PER_WEEK - mocksThisWeek);
  const blocked = !isPremium && mocksThisWeek >= FREE_MOCK_LIMIT_PER_WEEK;

  return { isPremium, mocksThisWeek, remaining, blocked, loading, refresh };
}
