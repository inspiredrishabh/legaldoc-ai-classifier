import type { FileUploadResult } from "../../types";
import { formatConfidence } from "../../utils/format";

interface UploadProgressProps {
  results: FileUploadResult[];
  onSelectFile: (fileId: string) => void;
}

export function UploadProgress({ results, onSelectFile }: UploadProgressProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Processing Results</h3>
      {results.map((result) => (
        <div
          key={result.file_id}
          className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300"
          onClick={() =>
            result.status === "completed" && onSelectFile(result.file_id)
          }
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-800 truncate">
              {result.file_id.slice(0, 8)}...
            </span>
            <StatusBadge status={result.status} />
          </div>
          {result.status === "processing" && (
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-2/3" />
            </div>
          )}
          {result.status === "completed" && (
            <p className="text-xs text-gray-500">
              {result.metadata.page_count} page(s) &middot; Confidence:{" "}
              {formatConfidence(result.metadata.confidence_score)}
            </p>
          )}
          {result.status === "failed" && (
            <p className="text-xs text-red-500">{result.error}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || ""}`}
    >
      {status}
    </span>
  );
}
