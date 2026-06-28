import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PracticePage from "./pages/PracticePage.tsx";
import SpeakingPage from "./pages/SpeakingPage.tsx";
import HistoryPage from "./pages/HistoryPage.tsx";
import FullTestPage from "./pages/FullTestPage.tsx";
import ListeningPage from "./pages/ListeningPage.tsx";
import ReadingPage from "./pages/ReadingPage.tsx";
import WritingPage from "./pages/WritingPage.tsx";
import MockTestPage from "./pages/MockTestPage.tsx";
import MockSummaryPage from "./pages/MockSummaryPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import TermsOfServicePage from "./pages/TermsOfServicePage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import RefundsPage from "./pages/RefundsPage.tsx";
import RefundPolicyPage from "./pages/RefundPolicyPage.tsx";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route path="/practice/:part" element={<PracticePage />} />
          <Route path="/practice-listening" element={<ListeningPage />} />
          <Route path="/practice-reading" element={<ReadingPage />} />
          <Route path="/practice-writing" element={<WritingPage />} />
          <Route path="/mock-test" element={<MockTestPage />} />
          <Route path="/mock-summary" element={<MockSummaryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/full-test" element={<FullTestPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/refunds" element={<RefundsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
