import { useState } from "react";
import { useJudgementPrediction } from "../../hooks/useJudgementPrediction";
import { useDocumentStore } from "../../stores/document-store";
import { LoadingSpinner } from "../common/LoadingSpinner";

const CASE_TYPES = [
  { value: "criminal", label: "Criminal" },
  { value: "civil", label: "Civil" },
  { value: "constitutional", label: "Constitutional" },
  { value: "family", label: "Family" },
  { value: "property", label: "Property" },
  { value: "motor_accident", label: "Motor Accident" },
  { value: "consumer", label: "Consumer" },
  { value: "labour", label: "Labour" },
  { value: "general", label: "General / Other" },
];

export function JudgementPrediction() {
  const language = useDocumentStore((s) => s.language);
  const { mutate, data, isPending, error, reset } = useJudgementPrediction();
  const [caseDescription, setCaseDescription] = useState("");
  const [caseType, setCaseType] = useState("general");

  const handlePredict = () => {
    if (!caseDescription.trim()) return;
    reset();
    mutate({ caseDescription: caseDescription.trim(), caseType, language });
  };

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <div className="parchment-card-elevated rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <svg className="h-5 w-5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18" />
              <path d="M5 7l7-4 7 4" />
              <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
              <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
            </svg>
          </div>
          <div>
            <h3 className="section-title">AI Judgement Prediction</h3>
            <p className="text-xs font-body text-sepia-500">
              Describe a case and get an AI-powered prediction with relevant legal sections
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Case Type Selector */}
          <div>
            <label className="text-xs font-body font-semibold text-sepia-600 mb-1.5 block">
              Case Type
            </label>
            <div className="flex flex-wrap gap-2">
              {CASE_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setCaseType(type.value)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-body transition-all duration-200 ${
                    caseType === type.value
                      ? "bg-legal-brown text-parchment-50 border-legal-brown"
                      : "bg-parchment-50 text-sepia-600 border-sepia-200 hover:border-legal-gold/50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Case Description */}
          <div>
            <label className="text-xs font-body font-semibold text-sepia-600 mb-1.5 block">
              Case Description
            </label>
            <textarea
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              placeholder={
                language === "hi"
                  ? "मामले का विवरण यहाँ लिखें — तथ्य, पक्ष, और परिस्थितियाँ…"
                  : "Describe the case facts, parties involved, and circumstances…"
              }
              rows={5}
              className="input-field resize-none"
            />
            <p className="text-xs font-body text-sepia-400 mt-1">
              Provide as much detail as possible for a more accurate prediction.
            </p>
          </div>

          <button
            onClick={handlePredict}
            disabled={!caseDescription.trim() || isPending}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Analyzing Case…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18" />
                  <path d="M5 7l7-4 7 4" />
                  <path d="M2 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
                  <path d="M16 17l3-10 3 10a4.35 4.35 0 0 1-6 0z" />
                </svg>
                Predict Judgement
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="parchment-card rounded-xl p-4 border-red-200 bg-red-50">
          <p className="text-sm font-body text-red-700">
            Failed to generate prediction. Please try again.
          </p>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-4 animate-fade-in">
          {/* Prediction */}
          <div className="parchment-card-elevated rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-semibold text-legal-brown text-lg">Prediction</h4>
              <span className={`badge ${
                data.confidence_level === "high"
                  ? "badge-success"
                  : data.confidence_level === "medium"
                  ? "badge-gold"
                  : "badge-info"
              }`}>
                {data.confidence_level} confidence
              </span>
            </div>
            <p className="text-sm font-body text-sepia-700 leading-relaxed whitespace-pre-line">
              {data.prediction}
            </p>
          </div>

          {/* Relevant Sections */}
          {data.relevant_sections.length > 0 && (
            <div className="parchment-card rounded-xl p-5">
              <h4 className="font-serif font-semibold text-legal-brown mb-3">Relevant Legal Sections</h4>
              <div className="flex flex-wrap gap-2">
                {data.relevant_sections.map((section, index) => (
                  <span key={index} className="badge badge-gold">
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="rounded-xl p-4 bg-amber-50/80 border border-amber-200/60">
            <div className="flex items-start gap-2.5">
              <svg className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-body text-amber-800 leading-relaxed">
                {data.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
