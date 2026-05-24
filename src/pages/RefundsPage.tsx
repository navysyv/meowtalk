import { LegalLayout } from "@/components/LegalLayout";

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy" updated="May 24, 2026">
      <p>
        We want you to be happy with Talkie IELTS. <strong>girlsproduction</strong> offers a
        <strong> 30-day money-back guarantee</strong> on Talkie Premium subscriptions.
      </p>

      <h2>Eligibility</h2>
      <p>
        If you're not satisfied with your purchase, you can request a full refund within 30 days of your
        order date. This applies to first-time subscription purchases.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Refunds are processed by our payment provider, <strong>Paddle</strong>, who is the Merchant of Record
        for all our orders. To request a refund:
      </p>
      <ul>
        <li>Visit <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a> and look up your order using the email you used at checkout, or</li>
        <li>Email us at <a href="mailto:support@girlsproduction.com">support@girlsproduction.com</a> and we'll help arrange the refund through Paddle.</li>
      </ul>

      <h2>Processing time</h2>
      <p>
        Once approved, refunds are typically returned to the original payment method within 5–10 business
        days, depending on your bank or card issuer.
      </p>

      <h2>Subscription cancellations</h2>
      <p>
        You can cancel your subscription at any time. After cancellation, you keep access to Premium
        features until the end of your current billing period; you will not be charged again.
      </p>
    </LegalLayout>
  );
}