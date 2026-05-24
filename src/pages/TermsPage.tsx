import { LegalLayout } from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 24, 2026">
      <p>
        These Terms of Service ("Terms") govern your use of Talkie IELTS (the "Service"), operated by
        <strong> girlsproduction</strong> ("we", "us", "our"). By creating an account or otherwise using the Service,
        you agree to be bound by these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        Talkie IELTS provides AI-powered IELTS preparation tools, including mock tests, speaking, writing,
        listening and reading practice, automated feedback and progress tracking.
      </p>

      <h2>2. Eligibility & Account</h2>
      <p>
        You must be of legal age in your jurisdiction (or have parental consent) to use the Service. You are
        responsible for keeping your account credentials confidential and for all activity under your account.
        You agree to provide accurate information and to keep it up to date.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>You agree not to misuse the Service. Specifically, you will not:</p>
      <ul>
        <li>use the Service for any unlawful, fraudulent, or abusive purpose;</li>
        <li>infringe intellectual property or privacy rights of others;</li>
        <li>upload malware, attempt to probe, scan, or interfere with the security of the Service;</li>
        <li>scrape, resell, or redistribute the Service or its content;</li>
        <li>attempt to reverse engineer or circumvent technical limitations.</li>
      </ul>

      <h2>4. AI-Generated Content</h2>
      <p>
        The Service uses generative AI models to produce feedback, sample answers and explanations. You are
        responsible for your prompts and inputs, for verifying the accuracy of outputs, and for ensuring you
        have the rights to any content you submit. AI outputs may be inaccurate or incomplete and must not be
        treated as professional advice. We reserve the right to moderate, filter or refuse outputs, and to
        remove content or suspend accounts that violate these Terms. Prohibited uses include generating illegal
        content, deepfakes, hate speech, malware, attempts to jailbreak the model, or content that infringes
        third-party rights. Rights-holders may contact us to request takedown of infringing material; repeated
        infringement may result in account termination.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        We retain all rights, title and interest in and to the Service, including software, models, branding
        and documentation. You are granted a limited, non-exclusive, non-transferable right to use the Service
        within your selected plan. You retain ownership of content you submit and grant us a limited license to
        host and process it solely to provide the Service.
      </p>

      <h2>6. Subscriptions, Payments & Taxes</h2>
      <p>
        Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the
        Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles
        returns. Payment, billing, tax, cancellation and refund mechanics are governed by Paddle's
        {" "}<a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer">Buyer Terms</a>.
        Subscriptions renew automatically at the end of each billing period until cancelled.
      </p>

      <h2>7. Service Level</h2>
      <p>
        The Service is provided "as is". We do not guarantee that it will be uninterrupted, error-free, or
        meet your specific requirements. To the fullest extent permitted by law, we disclaim all implied
        warranties, including merchantability and fitness for a particular purpose.
      </p>

      <h2>8. Suspension & Termination</h2>
      <p>
        We may suspend or terminate your access for material breach of these Terms, non-payment, suspected
        fraud or security risk, or repeated or serious policy violations. On termination your right to use
        the Service ends; you may request export of your data within 30 days, after which it may be deleted.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the fullest extent permitted by law, our aggregate liability for any claims arising from the
        Service is capped at the fees you paid in the 12 months preceding the claim. We are not liable for
        indirect, incidental, special or consequential damages, including loss of profits, data or goodwill.
        Nothing in these Terms limits liability for fraud, death or personal injury caused by negligence,
        where such limitation is not permitted by law.
      </p>

      <h2>10. Indemnity</h2>
      <p>
        You agree to indemnify us against third-party claims arising from your content, your unlawful use of
        the Service, or your breach of these Terms.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms from time to time. Material changes will be notified through the Service.
        Continued use after changes take effect constitutes acceptance.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which girlsproduction is established,
        without regard to conflict-of-laws rules. Disputes will be resolved in the competent courts of that
        jurisdiction.
      </p>

      <h2>13. Contact</h2>
      <p>For questions about these Terms, contact us at <a href="mailto:support@girlsproduction.com">support@girlsproduction.com</a>.</p>
    </LegalLayout>
  );
}