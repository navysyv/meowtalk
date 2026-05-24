import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CREDIT_COSTS = {
  speaking: 5,
  writing: 8,
  mock: 25,
} as const;

export type CreditFeature = keyof typeof CREDIT_COSTS;

/**
 * Attempt to deduct credits server-side before running an AI call.
 * Returns true if the user is anonymous (legacy session flow) OR if the
 * deduction succeeded. Returns false and shows a toast otherwise.
 */
export async function consumeCredits(feature: CreditFeature): Promise<boolean> {
  const cost = CREDIT_COSTS[feature];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return true; // anonymous: existing freemium gating still applies

  try {
    const { data, error } = await supabase.functions.invoke("consume-credits", {
      body: { action: "consume", cost },
    });
    if (error) {
      // Edge function returned non-2xx — most commonly 402 insufficient credits
      const message = (error as any)?.context?.error || (error as any)?.message || "";
      if (String(message).includes("insufficient") || (error as any)?.context?.status === 402) {
        toast.error("Out of credits", {
          description: "You've used your daily AI credits. Upgrade to Premium for more.",
          action: { label: "Upgrade", onClick: () => { window.location.href = "/pricing"; } },
        });
        return false;
      }
      // Network / unknown — fail open so the AI call still runs (avoid hard blocks)
      console.warn("consume-credits soft-fail:", error);
      return true;
    }
    if (data && data.ok === false) {
      toast.error("Out of credits", {
        description: "You've used your daily AI credits. Upgrade to Premium for more.",
        action: { label: "Upgrade", onClick: () => { window.location.href = "/pricing"; } },
      });
      return false;
    }
    return true;
  } catch (e) {
    console.warn("consume-credits exception (soft fail):", e);
    return true;
  }
}