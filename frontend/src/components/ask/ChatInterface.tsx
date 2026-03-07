import { useState, useRef, useEffect } from "react";
import { useAskLegal } from "../../hooks/useAskLegal";
import { useDocumentStore } from "../../stores/document-store";
import { formatConfidence } from "../../utils/format";
import type { AskResponse } from "../../types";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
  data?: AskResponse;
}

// Well-known landmark case references keyed by topic keywords
const CASE_PRECEDENTS: Record<string, { case: string; citation: string; summary: string }[]> = {
  murder: [
    { case: "K.M. Nanavati v. State of Maharashtra", citation: "AIR 1962 SC 605", summary: "Landmark case that abolished jury trials in India. Established key principles for distinguishing murder from culpable homicide." },
    { case: "Bachan Singh v. State of Punjab", citation: "AIR 1980 SC 898", summary: "The 'rarest of rare' doctrine for death penalty in murder cases was established." },
  ],
  theft: [
    { case: "K.N. Mehra v. State of Rajasthan", citation: "AIR 1957 SC 369", summary: "Defined the concept of 'dishonest intention' and 'moving of property' in theft under Section 378 IPC." },
  ],
  bail: [
    { case: "Arnesh Kumar v. State of Bihar", citation: "(2014) 8 SCC 273", summary: "Supreme Court laid down guidelines to prevent unnecessary arrests and granted mandatory consideration of bail for offences punishable up to 7 years." },
    { case: "Sanjay Chandra v. CBI", citation: "(2012) 1 SCC 40", summary: "Bail is the rule, jail is the exception — reiterated in white-collar crime context." },
  ],
  divorce: [
    { case: "Naveen Kohli v. Neelu Kohli", citation: "(2006) 4 SCC 558", summary: "Supreme Court recommended irretrievable breakdown of marriage as a ground for divorce under Hindu Marriage Act." },
    { case: "Shilpa Sailesh v. Varun Sreenivasan", citation: "2023 SCC OnLine SC 544", summary: "Supreme Court invoked Article 142 to grant divorce by mutual consent without the mandatory 6-month waiting period." },
  ],
  "section 302": [
    { case: "Machhi Singh v. State of Punjab", citation: "AIR 1983 SC 957", summary: "Expanded on the 'rarest of rare' doctrine, categorizing circumstances for imposing death penalty under Section 302." },
  ],
  "section 498a": [
    { case: "Arnesh Kumar v. State of Bihar", citation: "(2014) 8 SCC 273", summary: "Laid down guidelines for arrest under Section 498A to prevent misuse." },
  ],
  evidence: [
    { case: "Anvar P.V. v. P.K. Basheer", citation: "(2014) 10 SCC 473", summary: "Defined the admissibility of electronic evidence under Section 65B of the Indian Evidence Act." },
  ],
  punishment: [
    { case: "Bachan Singh v. State of Punjab", citation: "AIR 1980 SC 898", summary: "Established the 'rarest of rare' doctrine for death penalty sentencing in India." },
  ],
  marriage: [
    { case: "Sarla Mudgal v. Union of India", citation: "AIR 1995 SC 1531", summary: "Held that conversion to Islam solely for bigamy is an abuse of personal law and does not dissolve a Hindu marriage." },
  ],
  property: [
    { case: "Vineeta Sharma v. Rakesh Sharma", citation: "(2020) 9 SCC 1", summary: "Daughters have coparcenary rights by birth under the amended Hindu Succession Act, regardless of when the father died." },
  ],
  motor: [
    { case: "Sarla Verma v. Delhi Transport Corporation", citation: "(2009) 6 SCC 121", summary: "Laid down structured formula for calculating compensation in motor accident claims." },
  ],
  negotiable: [
    { case: "Dashrath Rupsingh Rathod v. State of Maharashtra", citation: "(2014) 9 SCC 129", summary: "Clarified territorial jurisdiction for cheque bouncing cases under Section 138 NI Act." },
  ],
  constitution: [
    { case: "Kesavananda Bharati v. State of Kerala", citation: "AIR 1973 SC 1461", summary: "Established the Basic Structure Doctrine — Parliament cannot alter the basic structure of the Constitution." },
    { case: "Maneka Gandhi v. Union of India", citation: "AIR 1978 SC 597", summary: "Expanded the scope of Article 21, holding that the right to life includes the right to live with dignity." },
  ],
  limitation: [
    { case: "Balakrishnan v. M.A. Krishnamurthy", citation: "(1998) 7 SCC 123", summary: "Explained the computation of limitation period and the effect of Section 5 of the Limitation Act." },
  ],
};

function findRelevantPrecedents(query: string) {
  const lowerQuery = query.toLowerCase();
  const found: { case: string; citation: string; summary: string }[] = [];
  const seen = new Set<string>();

  for (const [keyword, cases] of Object.entries(CASE_PRECEDENTS)) {
    if (lowerQuery.includes(keyword)) {
      for (const c of cases) {
        if (!seen.has(c.case)) {
          seen.add(c.case);
          found.push(c);
        }
      }
    }
  }
  return found.slice(0, 3);
}

const QUICK_QUESTIONS = [
  "What is the punishment for theft under IPC?",
  "Explain Section 302 of IPC",
  "Grounds for divorce under HMA?",
  "What is bail under CrPC?",
  "Limitation period under CPC?",
  "Section 498A IPC explained",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { mutate, isPending } = useAskLegal();
  const language = useDocumentStore((s) => s.language);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSend = (query: string) => {
    if (!query.trim() || isPending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      text: query.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    mutate({ query: query.trim(), language }, {
      onSuccess: (data) => {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          text: data.answer,
          timestamp: new Date(),
          data,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      },
      onError: (error) => {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          text: `I'm sorry, I couldn't process your question. ${error.message}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="flex flex-col h-full parchment-card-elevated rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-legal-brown flex items-center gap-3 flex-shrink-0">
        <div className="h-9 w-9 rounded-full bg-legal-gold/20 border border-legal-gold/40 flex items-center justify-center">
          <svg className="h-5 w-5 text-legal-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" />
            <path d="M5 7l7-4 7 4" />
            <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
            <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-serif font-semibold text-parchment-50">Legal AI Assistant</p>
          <p className="text-xs font-body text-parchment-300">Ask questions about Indian law</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-body text-parchment-300">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-parchment-50/50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-6">
            <div className="h-16 w-16 rounded-full bg-parchment-200 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-legal-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="font-serif font-semibold text-legal-brown text-base mb-1">
              Welcome to the Legal AI Assistant
            </p>
            <p className="text-sm font-body text-sepia-500 mb-5 max-w-sm">
              Ask any question about Indian law. I'll search through 8 legal acts and provide answers with relevant case precedents.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 text-xs font-body text-sepia-700 bg-parchment-100 border border-sepia-200 rounded-full
                           hover:bg-parchment-200 hover:border-legal-gold hover:text-legal-brown transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.type === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%]">
                  <div className="bg-legal-brown text-parchment-50 rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                    <p className="text-sm font-body leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-[10px] text-sepia-400 font-body mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="max-w-[85%] space-y-3">
                  {/* Answer bubble */}
                  <div className="bg-white border border-sepia-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    {msg.data && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-sepia-100">
                        <span className={`badge text-[10px] ${
                          msg.data.method === "qa_dataset" ? "badge-gold" : "bg-legal-brown/10 text-legal-brown border border-legal-brown/20"
                        }`}>
                          {msg.data.method === "qa_dataset" ? "Direct Match" : "AI Generated"}
                        </span>
                        {msg.data.confidence != null && (
                          <span className="badge-success text-[10px]">
                            {formatConfidence(msg.data.confidence)}
                          </span>
                        )}
                        <span className="text-[10px] text-sepia-400 font-body ml-auto">
                          {msg.data.source}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-body text-sepia-800 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Case Precedents — show for successful assistant replies */}
                  {msg.data && (() => {
                    const userMsgIndex = messages.findIndex((m) => m.id === String(Number(msg.id) - 1));
                    const userQuery = userMsgIndex >= 0 ? messages[userMsgIndex].text : "";
                    const precedents = findRelevantPrecedents(userQuery || msg.text);
                    if (precedents.length === 0) return null;
                    return (
                      <div className="bg-parchment-100 border border-sepia-200 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="h-4 w-4 text-legal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <p className="text-xs font-serif font-semibold text-legal-brown">Related Case Precedents</p>
                        </div>
                        <div className="space-y-2">
                          {precedents.map((p) => (
                            <div key={p.case} className="pl-3 border-l-2 border-legal-gold/40">
                              <p className="text-xs font-body font-semibold text-sepia-800">{p.case}</p>
                              <p className="text-[10px] font-body text-legal-gold">{p.citation}</p>
                              <p className="text-xs font-body text-sepia-600 mt-0.5">{p.summary}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <p className="text-[10px] text-sepia-400 font-body mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-white border border-sepia-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-legal-brown/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 bg-legal-brown/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 bg-legal-brown/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs font-body text-sepia-500">Analyzing legal texts...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick suggestions when conversation is active */}
      {messages.length > 0 && !isPending && (
        <div className="px-4 py-2 bg-parchment-50 border-t border-sepia-100 flex-shrink-0">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_QUESTIONS.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="flex-shrink-0 px-2.5 py-1 text-[10px] font-body text-sepia-600 bg-parchment-100 border border-sepia-200 rounded-full
                           hover:bg-parchment-200 hover:border-legal-gold transition-all duration-200 whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 bg-parchment-100 border-t border-sepia-200 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your legal question..."
            className="flex-1 px-4 py-2.5 bg-white border border-sepia-200 rounded-xl text-sm font-body text-sepia-900
                       placeholder-sepia-400 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 focus:border-legal-gold transition-all"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="px-4 py-2.5 bg-legal-brown text-parchment-50 rounded-xl hover:bg-legal-darkbrown
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
          >
            {isPending ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
