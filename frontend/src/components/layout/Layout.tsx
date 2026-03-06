import { ReactNode } from "react";
import { Header } from "./Header";
import { ErrorBoundary } from "../common/ErrorBoundary";

type Page = "home" | "app";

interface LayoutProps {
  children: ReactNode;
  page: Page;
  onNavigate: (page: Page) => void;
}

export function Layout({ children, page, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-parchment-50 flex flex-col">
      <Header page={page} onNavigate={onNavigate} />
      <ErrorBoundary>
        {page === "home" ? (
          <main className="flex-1">{children}</main>
        ) : (
          <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">{children}</main>
        )}
      </ErrorBoundary>
      <footer className="border-t border-sepia-200 bg-parchment-100 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-legal-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18" />
                <path d="M5 7l7-4 7 4" />
                <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
                <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
              </svg>
              <p className="text-sm font-serif font-semibold text-sepia-700">
                LegalDoc AI
              </p>
            </div>
            <p className="text-xs text-sepia-400 font-body">
              Built with FastAPI &middot; React &middot; TailwindCSS &middot; Ollama
            </p>
          </div>
          <div className="decorative-line mt-4 mb-3" />
          <p className="text-xs text-sepia-400 font-body text-center">
            &copy; {new Date().getFullYear()} LegalDoc AI &mdash; Indian Legal Document Intelligence Platform. All processing is done locally.
          </p>
        </div>
      </footer>
    </div>
  );
}
