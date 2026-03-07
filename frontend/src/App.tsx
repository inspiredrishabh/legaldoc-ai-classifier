import { useState, useRef } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./components/home/HomePage";
import { MultiFileUpload } from "./components/upload/MultiFileUpload";
import { ReviewMode } from "./components/review/ReviewMode";
import { ChatInterface } from "./components/ask/ChatInterface";
import { ChatWidget } from "./components/ask/ChatWidget";
import { LanguageToggle } from "./components/common/LanguageToggle";
import { DocumentSummary } from "./components/summary/DocumentSummary";
import { TimelineGenerator } from "./components/timeline/TimelineGenerator";
import { VoiceAssistant } from "./components/voice/VoiceAssistant";
import { JudgementPrediction } from "./components/judgement/JudgementPrediction";
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
        <div className="flex items-center justify-end gap-3">
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

        <div className="decorative-line" />

        {/* AI Document Summary Section */}
        <section className="scroll-mt-20">
          <SectionHeader
            number="04"
            title="AI Document Summary"
            subtitle="Generate intelligent summaries with key points from your legal documents"
          />
          <DocumentSummary />
        </section>

        <div className="decorative-line" />

        {/* Legal Timeline Section */}
        <section className="scroll-mt-20">
          <SectionHeader
            number="05"
            title="Legal Timeline"
            subtitle="Extract dates, deadlines, and chronological events from legal documents"
          />
          <TimelineGenerator />
        </section>

        <div className="decorative-line" />

        {/* Voice Legal Assistant Section */}
        <section className="scroll-mt-20">
          <SectionHeader
            number="06"
            title="Voice Legal Assistant"
            subtitle="Ask legal questions using your voice — speak naturally and get accurate answers"
          />
          <VoiceAssistant />
        </section>

        <div className="decorative-line" />

        {/* AI Judgement Prediction Section */}
        <section className="scroll-mt-20">
          <SectionHeader
            number="07"
            title="AI Judgement Prediction"
            subtitle="Describe a case and get an AI-powered prediction with relevant legal sections"
          />
          <JudgementPrediction />
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
