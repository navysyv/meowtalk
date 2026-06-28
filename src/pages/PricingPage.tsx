import { ArrowLeft, Check, Crown, Loader2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteFooter } from "@/components/SiteFooter";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useAuth } from "@/hooks/useAuth";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

const features = [
  "Unlimited full mock tests",
  "Advanced examiner-style feedback",
  "Deeper AI insights & analytics",
  "Priority AI processing",
  "Full history & progress tracking",
  "30-day money-back guarantee",
];

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openCheckout, loading: checkoutLoading } = usePaddleCheckout();
  const { isActive } = useSubscription();

  const handleBuy = async (priceId: string) => {
    if (!user) {
      navigate(`/auth?redirect=/pricing`);
      return;
    }
    if (isActive) {
      toast.success("You're already Premium — enjoy unlimited mocks!");
      navigate("/");
      return;
    }
    try {
      await openCheckout({
        priceId,
        userId: user.id,
        customerEmail: user.email ?? undefined,
        successUrl: `${window.location.origin}/checkout/success`,
      });
    } catch (e: any) {
      toast.error(e?.message || "Could not open checkout");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PaymentTestModeBanner />
      <div className="max-w-md mx-auto w-full px-5 py-6 flex-1">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={14} /> Back
        </Link>

        <header className="text-center mb-8">
          <div className="w-14 h-14 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
            <Crown size={24} className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Talkie Premium</h1>
          <p className="text-sm text-muted-foreground mt-1">Everything you need to hit your IELTS goal.</p>
        </header>

        <div className="grid gap-4">
          {/* Monthly */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 bg-card border border-border shadow-soft"
          >
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display text-lg font-semibold text-foreground">Monthly</h2>
              <div>
                <span className="text-2xl font-bold text-foreground">$4.99</span>
                <span className="text-xs text-muted-foreground">/month</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Billed monthly. Cancel anytime.</p>
            <button
              disabled={checkoutLoading}
              onClick={() => handleBuy("talkie_premium_monthly")}
              className="w-full py-2.5 rounded-2xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {checkoutLoading ? <Loader2 size={14} className="animate-spin" /> : null}
              {isActive ? "You're Premium" : "Subscribe monthly"}
            </button>
          </motion.section>

          {/* Annual */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="relative rounded-3xl p-5 bg-gradient-to-br from-lavender-soft via-card to-lavender-soft border border-primary/30 shadow-glow"
          >
            <span className="absolute -top-2 right-4 text-[10px] font-semibold text-primary-foreground bg-primary px-2 py-1 rounded-full">
              Save 34%
            </span>
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-display text-lg font-semibold text-foreground">Annual</h2>
              <div>
                <span className="text-2xl font-bold text-foreground">$79</span>
                <span className="text-xs text-muted-foreground">/year</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">≈ $6.58/month. Billed yearly.</p>
            <button
              disabled={checkoutLoading}
              onClick={() => handleBuy("talkie_premium_annual")}
              className="w-full py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:shadow-[0_8px_40px_-8px_hsla(265,70%,70%,0.4)] transition-shadow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {checkoutLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isActive ? "You're Premium" : "Subscribe annually"}
            </button>
          </motion.section>
        </div>

        <section className="mt-6 rounded-3xl p-5 bg-card border border-border">
          <h3 className="font-display font-semibold text-foreground mb-3">What's included</h3>
          <ul className="grid gap-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check size={14} className="text-primary shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-[11px] text-muted-foreground text-center mt-5 leading-relaxed">
          Payments are processed by our reseller Paddle.com, the Merchant of Record for all orders.
          Prices in USD. Taxes calculated at checkout. By subscribing you agree to our{" "}
          <Link to="/terms-of-service" className="underline">Terms of Service</Link>,{" "}
          <Link to="/privacy-policy" className="underline">Privacy Policy</Link> and{" "}
          <Link to="/refund-policy" className="underline">Refund Policy</Link>.
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}