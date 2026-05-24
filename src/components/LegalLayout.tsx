import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 py-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={14} /> Back
        </Link>
        <header className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground mt-1">Last updated: {updated}</p>
        </header>
        <article className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline">
          {children}
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}