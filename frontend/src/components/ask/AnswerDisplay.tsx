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
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
        <p className="text-sm text-blue-600">Generating answer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-3">
      <div className="flex gap-2">
        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">
          {data.method}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
          Source: {data.source}
        </span>
        {data.confidence != null && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
            {formatConfidence(data.confidence)}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
        {data.answer}
      </p>
    </div>
  );
}
