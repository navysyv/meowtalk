import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border/60 bg-background/60 mt-8">
      <div className="max-w-md mx-auto px-5 py-6 flex flex-col items-center gap-3 text-[11px] text-muted-foreground">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
        </nav>
        <p className="text-center leading-relaxed">
          © {new Date().getFullYear()} girlsproduction. Payments handled by our reseller Paddle.com,
          the Merchant of Record for all orders.
        </p>
      </div>
    </footer>
  );
}