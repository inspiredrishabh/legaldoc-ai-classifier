import { useState } from "react";
import { formatConfidence } from "../../utils/format";
import { useDocumentStore } from "../../stores/document-store";
import { askLegal } from "../../api/ask-api";
import type { FileUploadResult } from "../../types";

interface ExtractedTextProps {
  result: FileUploadResult | null;
}

export function ExtractedText({ result }: ExtractedTextProps) {
  const [copied, setCopied] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const language = useDocumentStore((s) => s.language);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full parchment-card rounded-xl">
        <svg className="h-10 w-10 text-sepia-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <p className="text-sm text-sepia-500 font-body">No extracted text available</p>
      </div>
    );
  }

  const displayText = language === "hi" && translatedText ? translatedText : result.raw_text;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslate = async () => {
    if (isTranslating || translatedText) return;
    setIsTranslating(true);
    try {
      const resp = await askLegal(
        `Translate the following legal document text to Hindi (Devanagari script). Only provide the translation, nothing else:\n\n${result.raw_text.slice(0, 3000)}`,
        "hi"
      );
      setTranslatedText(resp.answer);
    } catch {
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="h-full overflow-auto parchment-card rounded-xl flex flex-col">
      <div className="p-3 bg-parchment-100 border-b border-sepia-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-sm font-serif font-semibold text-legal-brown">
            Extracted Text
            {language === "hi" && translatedText && (
              <span className="ml-2 text-xs font-body text-legal-gold">(हिंदी)</span>
            )}
          </h3>
          <div className="flex gap-2 mt-1">
            <span className="badge-info">
              {result.metadata.page_count} page{result.metadata.page_count !== 1 ? "s" : ""}
            </span>
            <span className="badge-success">
              {formatConfidence(result.metadata.confidence_score)} confidence
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {language === "hi" && !translatedText && (
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5"
            >
              {isTranslating ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Translating...
                </>
              ) : (
                "Translate to Hindi"
              )}
            </button>
          )}
          {language === "hi" && translatedText && (
            <button
              onClick={() => setTranslatedText(null)}
              className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5"
            >
              Show Original
            </button>
          )}
          <button
            onClick={handleCopy}
            className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm font-body whitespace-pre-wrap text-sepia-800 leading-relaxed flex-1 overflow-auto">
        {displayText}
      </pre>
    </div>
  );
}
