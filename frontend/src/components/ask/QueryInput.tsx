import { useState } from "react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isPending: boolean;
}

const SUGGESTION_CHIPS = [
  "What is the punishment for theft under IPC?",
  "Explain Section 302 of IPC",
  "What are grounds for divorce under Hindu Marriage Act?",
  "What is bail under CrPC?",
  "Define murder under Indian Penal Code",
  "What is the limitation period under CPC?",
];

export function QueryInput({ onSubmit, isPending }: QueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
            <svg className="h-4 w-4 text-sepia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about Indian law..."
            className="input-field pl-10 pr-4"
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !query.trim()}
          className="btn-primary flex items-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Thinking...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ask
            </>
          )}
        </button>
      </form>

      {/* Suggestion chips */}
      {!isPending && (
        <div className="space-y-2">
          <p className="text-xs text-sepia-500 font-body">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTION_CHIPS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  onSubmit(suggestion);
                }}
                className="px-3 py-1.5 text-xs font-body text-sepia-700 bg-parchment-100 border border-sepia-200 rounded-full
                           hover:bg-parchment-200 hover:border-legal-gold hover:text-legal-brown transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
