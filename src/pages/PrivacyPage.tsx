import { LegalLayout } from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 24, 2026">
      <p>
        This Privacy Notice explains how <strong>girlsproduction</strong> ("we", "us") collects, uses and
        protects personal data when you use Talkie IELTS (the "Service"). girlsproduction acts as the
        data controller for personal data processed through the Service.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email address, login credentials (via Google or email).</li>
        <li><strong>Usage data:</strong> practice sessions, mock test results, scores, progress, streaks.</li>
        <li><strong>Content you submit:</strong> spoken and written answers, recordings, and prompts.</li>
        <li><strong>Support communications:</strong> messages you send us.</li>
        <li><strong>Device & telemetry:</strong> IP address, browser/device identifiers, log data.</li>
      </ul>

      <h2>2. Why we use it</h2>
      <ul>
        <li>Creating and securing your account (contract performance).</li>
        <li>Providing the Service: AI feedback, scoring, history (contract performance).</li>
        <li>Improving the Service and our AI models (legitimate interests).</li>
        <li>Fraud prevention and security (legitimate interests, legal obligation).</li>
        <li>Customer support (contract performance).</li>
        <li>Sending service or marketing emails (consent, where required).</li>
      </ul>

      <h2>3. Who we share data with</h2>
      <ul>
        <li><strong>Service providers / subprocessors:</strong> cloud hosting, database, analytics, AI model
          providers, email and support tooling.</li>
        <li><strong>Paddle.com:</strong> our Merchant of Record. Paddle processes payments, manages
          subscriptions, calculates and remits taxes, and issues invoices.</li>
        <li><strong>Professional advisers:</strong> legal, accounting and similar advisers, when necessary.</li>
        <li><strong>Authorities:</strong> where required by law or to protect our rights.</li>
      </ul>

      <h2>4. International transfers</h2>
      <p>
        Your data may be processed outside your country of residence, including in the United States and the
        European Economic Area. Where required, we rely on Standard Contractual Clauses or adequacy decisions
        to protect the data.
      </p>

      <h2>5. Retention</h2>
      <p>
        We keep personal data only as long as needed to provide the Service, comply with our legal
        obligations, resolve disputes and enforce our agreements. When no longer needed, data is deleted or
        anonymised. You may delete your account at any time by contacting us.
      </p>

      <h2>6. Your rights</h2>
      <p>Subject to applicable law (including GDPR and UK GDPR where relevant), you have the right to:</p>
      <ul>
        <li>access and obtain a copy of your data;</li>
        <li>rectify inaccurate data;</li>
        <li>request erasure or restriction of processing;</li>
        <li>data portability;</li>
        <li>object to processing based on legitimate interests;</li>
        <li>withdraw consent at any time;</li>
        <li>lodge a complaint with your local supervisory authority.</li>
      </ul>
      <p>We aim to respond to requests within one month.</p>

      <h2>7. Security</h2>
      <p>
        We apply appropriate technical and organisational measures to protect personal data, including
        encryption in transit, access controls and least-privilege practices. No system is 100% secure;
        please notify us if you suspect a security issue.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use essential cookies and local storage to keep you signed in and remember preferences. We may
        use limited analytics cookies to understand product usage. You can manage cookies through your
        browser settings.
      </p>

      <h2>9. Contact</h2>
      <p>For privacy questions or to exercise your rights, contact <a href="mailto:privacy@girlsproduction.com">privacy@girlsproduction.com</a>.</p>
    </LegalLayout>
  );
}