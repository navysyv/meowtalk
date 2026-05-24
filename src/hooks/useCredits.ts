import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export function useCredits() {
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const dailyGrant = isActive ? 300 : 10;

  const refresh = useCallback(async () => {
    if (!user) { setBalance(null); setLoading(false); return; }
    try {
      // ensure_user_credits applies daily refill server-side. Call via edge function
      // so a fresh row is created on first read.
      const { data, error } = await supabase.functions.invoke("consume-credits", {
        body: { action: "balance" },
      });
      if (!error && typeof data?.balance === "number") {
        setBalance(data.balance);
      } else {
        // Fall back to direct table read (works once the row exists)
        const { data: row } = await supabase
          .from("user_credits")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle();
        setBalance(row?.balance ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`credits-${user.id}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "user_credits", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const next = (payload.new as any)?.balance;
          if (typeof next === "number") setBalance(next);
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  return { balance, dailyGrant, isPremium: isActive, loading, refresh };
}