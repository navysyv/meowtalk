import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/hooks/useStreak";
import { useAuth } from "@/hooks/useAuth";

export const FREE_MOCK_LIMIT_PER_WEEK = 2;

export function useFreemium() {
  const { user } = useAuth();
  const [mocksThisWeek, setMocksThisWeek] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      let query = supabase
        .from("mock_results")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since);
      if (user?.id) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("session_id", getSessionId());
      }
      const { count } = await query;
      setMocksThisWeek(count ?? 0);

      if (user?.id) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("is_premium, premium_until")
          .eq("user_id", user.id)
          .maybeSingle();
        const active = !!prof?.is_premium && (!prof?.premium_until || new Date(prof.premium_until) > new Date());
        setIsPremium(active);
      } else {
        setIsPremium(false);
      }
    } catch {
      setMocksThisWeek(0);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const remaining = Math.max(0, FREE_MOCK_LIMIT_PER_WEEK - mocksThisWeek);
  const blocked = !isPremium && mocksThisWeek >= FREE_MOCK_LIMIT_PER_WEEK;

  return { isPremium, mocksThisWeek, remaining, blocked, loading, refresh };
}
