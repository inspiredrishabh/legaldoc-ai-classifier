import { useDocumentStore } from "../../stores/document-store";

export function LanguageToggle() {
  const language = useDocumentStore((s) => s.language);
  const setLanguage = useDocumentStore((s) => s.setLanguage);

  const toggle = () => setLanguage(language === "en" ? "hi" : "en");

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-body font-medium transition-all duration-200
                 border-sepia-200 bg-parchment-100 hover:border-legal-gold hover:bg-parchment-200 text-sepia-700"
      title={language === "en" ? "Switch to Hindi" : "Switch to English"}
    >
      <span className={language === "en" ? "font-bold text-legal-brown" : "text-sepia-400"}>EN</span>
      <span className="text-sepia-300">/</span>
      <span className={language === "hi" ? "font-bold text-legal-brown" : "text-sepia-400"}>हि</span>
    </button>
  );
}
