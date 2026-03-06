import type { FileUploadResult } from "../../types";
import { formatConfidence } from "../../utils/format";

interface UploadProgressProps {
  results: FileUploadResult[];
  onSelectFile: (fileId: string) => void;
}

export function UploadProgress({ results, onSelectFile }: UploadProgressProps) {
  if (results.length === 0) return null;

  const completedCount = results.filter((r) => r.status === "completed").length;
  const totalCount = results.length;

  return (
    <div className="space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="section-title text-base">Analysis Results</h3>
        <span className="text-xs text-sepia-500 font-body">
          {completedCount}/{totalCount} completed
        </span>
      </div>
      <div className="space-y-2">
        {results.map((result) => (
          <div
            key={result.file_id}
            className={`p-4 parchment-card cursor-pointer transition-all duration-200 ${
              result.status === "completed"
                ? "hover:shadow-parchment-md hover:border-legal-gold"
                : ""
            }`}
            onClick={() =>
              result.status === "completed" && onSelectFile(result.file_id)
            }
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-sepia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-body font-semibold text-sepia-800 truncate">
                  {result.file_id.slice(0, 12)}...
                </span>
              </div>
              <StatusBadge status={result.status} />
            </div>
            {result.status === "processing" && (
              <div className="w-full bg-parchment-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-legal-gold h-1.5 rounded-full animate-pulse w-2/3" />
              </div>
            )}
            {result.status === "completed" && (
              <div className="flex items-center gap-3 mt-1">
                <span className="badge-info">
                  {result.metadata.page_count} page{result.metadata.page_count !== 1 ? "s" : ""}
                </span>
                <span className="badge-success">
                  {formatConfidence(result.metadata.confidence_score)} confidence
                </span>
                <span className="text-xs text-legal-gold font-body ml-auto">Click to review &rarr;</span>
              </div>
            )}
            {result.status === "failed" && (
              <p className="text-xs text-red-600 font-body mt-1">{result.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "badge-info",
    processing: "badge-processing",
    completed: "badge-success",
    failed: "badge-danger",
  };

  return (
    <span className={styles[status] || "badge-info"}>
      {status}
    </span>
  );
}
