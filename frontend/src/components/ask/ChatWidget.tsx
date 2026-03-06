import { useState } from "react";
import { ChatInterface } from "./ChatInterface";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat panel */}
      {isOpen && (
        <div
          className="mb-3 w-[380px] max-h-[calc(100vh-120px)] h-[460px] rounded-2xl shadow-2xl border border-sepia-200 overflow-hidden
                     animate-fade-in bg-parchment-50"
          style={{ animationDuration: "200ms" }}
        >
          {/* Close bar */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full bg-legal-brown/80 text-parchment-50 flex items-center justify-center
                         hover:bg-legal-brown transition-colors"
              aria-label="Close chat"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ChatInterface />
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
          ${isOpen
            ? "bg-legal-maroon hover:bg-legal-darkbrown"
            : "bg-legal-brown hover:bg-legal-darkbrown hover:scale-110"
          }`}
        aria-label={isOpen ? "Close legal assistant" : "Open legal assistant"}
      >
        {isOpen ? (
          <svg className="h-6 w-6 text-parchment-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-legal-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" />
            <path d="M5 7l7-4 7 4" />
            <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
            <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
          </svg>
        )}
      </button>

      {/* Tooltip when closed */}
      {!isOpen && (
        <div className="absolute bottom-16 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-legal-brown text-parchment-50 text-xs font-body px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            Ask Legal AI
          </span>
        </div>
      )}
    </div>
  );
}
