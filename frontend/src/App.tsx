import { useState, useRef } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./components/home/HomePage";
import { MultiFileUpload } from "./components/upload/MultiFileUpload";
import { ReviewMode } from "./components/review/ReviewMode";
import { ChatInterface } from "./components/ask/ChatInterface";
import { ChatWidget } from "./components/ask/ChatWidget";
import { LanguageToggle } from "./components/common/LanguageToggle";
import { useDocumentStore } from "./stores/document-store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Page = "home" | "app";

function AppContent() {
  const [page, setPage] = useState<Page>("home");
  const { reset, results } = useDocumentStore();

  const uploadRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (page === "home") {
    return (
      <Layout page="home" onNavigate={setPage}>
        <HomePage onGetStarted={() => setPage("app")} />
        <ChatWidget />
      </Layout>
    );
  }

  const completedCount = results.filter((r) => r.status === "completed").length;

  return (
    <Layout page="app" onNavigate={setPage}>
      {/* Sticky section navigation */}
      <div className="sticky top-0 z-30 bg-parchment-50/95 backdrop-blur-sm border-b border-sepia-100 -mx-6 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => scrollTo(uploadRef)} className="section-nav-btn">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </button>
            <button onClick={() => scrollTo(reviewRef)} className="section-nav-btn">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Review
            </button>
            <button onClick={() => scrollTo(askRef)} className="section-nav-btn">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Ask Legal
            </button>
          </div>
          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <span className="text-xs text-sepia-500 font-body">
                {completedCount} document{completedCount !== 1 ? "s" : ""} ready
              </span>
            )}
            <LanguageToggle />
            <button
              onClick={reset}
              className="btn-ghost text-xs flex items-center gap-1.5 text-sepia-400 hover:text-legal-maroon"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* All sections stacked on one page */}
      <div className="space-y-16 py-8">
        {/* Upload Section */}
        <section ref={uploadRef} className="scroll-mt-20">
          <SectionHeader
            number="01"
            title="Upload Documents"
            subtitle="Upload legal documents for intelligent text extraction and analysis"
          />
          <MultiFileUpload />
        </section>

        <div className="decorative-line" />

        {/* Review Section */}
        <section ref={reviewRef} className="scroll-mt-20">
          <SectionHeader
            number="02"
            title="Review & Verify"
            subtitle="Compare original documents with extracted text side by side"
          />
          <ReviewMode />
        </section>

        <div className="decorative-line" />

        {/* Ask Legal Section */}
        <section ref={askRef} className="scroll-mt-20">
          <SectionHeader
            number="03"
            title="Ask Legal AI"
            subtitle="Chat with the AI assistant about Indian law — get answers with case precedents"
          />
          <div className="h-[600px]">
            <ChatInterface />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-body font-bold text-legal-gold bg-legal-gold/10 border border-legal-gold/20 rounded-full px-2.5 py-0.5">
          {number}
        </span>
        <h2 className="text-2xl font-serif font-bold text-legal-brown">{title}</h2>
      </div>
      <p className="text-sm font-body text-sepia-500 ml-12">{subtitle}</p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
