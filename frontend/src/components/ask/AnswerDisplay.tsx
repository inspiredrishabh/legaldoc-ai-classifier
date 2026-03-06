import type { AskResponse } from "../../types";
import { formatConfidence } from "../../utils/format";

interface AnswerDisplayProps {
  data: AskResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function AnswerDisplay({ data, isLoading, error }: AnswerDisplayProps) {
  if (isLoading) {
    return (
      <div className="parchment-card-elevated rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-parchment-200 flex items-center justify-center">
            <svg className="h-5 w-5 text-legal-gold animate-quill" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-serif font-semibold text-legal-brown">Analyzing legal texts...</p>
            <p className="text-xs text-sepia-500 font-body">Searching through Indian legal acts and generating answer</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-parchment-200 rounded w-full" />
          <div className="h-3 bg-parchment-200 rounded w-5/6" />
          <div className="h-3 bg-parchment-200 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-5 bg-red-50 border border-red-200 animate-scale-in">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-serif font-semibold text-red-800">Unable to generate answer</p>
            <p className="text-sm text-red-600 font-body mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const methodIcon = data.method === "qa_dataset" ? (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="parchment-card-elevated rounded-xl overflow-hidden animate-slide-up">
      {/* Answer header */}
      <div className="px-5 py-3 bg-parchment-100 border-b border-sepia-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-legal-brown/10 flex items-center justify-center text-legal-brown">
            {methodIcon}
          </div>
          <div>
            <p className="text-sm font-serif font-semibold text-legal-brown">Legal Answer</p>
            <p className="text-xs text-sepia-500 font-body">{data.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${
            data.method === "qa_dataset" ? "badge-gold" : "bg-legal-brown/10 text-legal-brown border border-legal-brown/20"
          }`}>
            {data.method === "qa_dataset" ? "Direct Match" : "LLM Generated"}
          </span>
          {data.confidence != null && (
            <span className="badge-success">
              {formatConfidence(data.confidence)}
            </span>
          )}
        </div>
      </div>

      {/* Answer body */}
      <div className="p-5">
        <p className="text-sm font-body text-sepia-800 leading-relaxed whitespace-pre-wrap">
          {data.answer}
        </p>
      </div>

      {/* Decorative footer line */}
      <div className="decorative-line mx-5 mb-4" />
    </div>
  );
}
