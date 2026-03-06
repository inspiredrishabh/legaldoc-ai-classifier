import { useDocumentStore } from "../../stores/document-store";
import { OriginalView } from "./OriginalView";
import { ExtractedText } from "./ExtractedText";

export function ReviewMode() {
  const { files, results, selectedFileId, selectFile } = useDocumentStore();

  const selectedResult =
    results.find((r) => r.file_id === selectedFileId) || null;

  // Find the original file by index mapping (files[i] maps to results[i])
  const selectedIndex = results.findIndex((r) => r.file_id === selectedFileId);
  const selectedFile = selectedIndex >= 0 ? files[selectedIndex] || null : null;

  const completedResults = results.filter((r) => r.status === "completed");

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 parchment-card rounded-xl animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-parchment-200 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-sepia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sepia-700 font-serif font-medium text-base">
          No Documents to Review
        </p>
        <p className="text-sepia-500 font-body text-sm mt-1">
          Upload and process documents first, then review results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Document selector bar */}
      {completedResults.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {completedResults.map((r) => (
            <button
              key={r.file_id}
              onClick={() => selectFile(r.file_id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-body font-medium transition-all duration-200 border ${
                selectedFileId === r.file_id
                  ? "bg-legal-brown text-parchment-50 border-legal-brown shadow-parchment"
                  : "bg-parchment-100 text-sepia-700 border-sepia-200 hover:border-legal-gold hover:bg-parchment-200"
              }`}
            >
              {r.file_id.slice(0, 8)}...
            </button>
          ))}
        </div>
      )}

      {!selectedFileId ? (
        <div className="flex flex-col items-center justify-center h-72 parchment-card rounded-xl">
          <svg className="h-12 w-12 text-sepia-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-sepia-600 font-body text-sm">
            Select a completed document above to review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[700px]">
          <OriginalView file={selectedFile} />
          <ExtractedText result={selectedResult} />
        </div>
      )}
    </div>
  );
}
