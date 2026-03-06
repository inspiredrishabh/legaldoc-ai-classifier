import { formatFileSize } from "../../utils/format";

interface FilePreviewProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

export function FilePreview({ file, index, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="flex items-center gap-3 p-3 parchment-card hover:shadow-parchment-md transition-shadow duration-200 group">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="h-12 w-12 object-cover rounded-lg border border-sepia-200"
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      ) : (
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
          isPdf ? "bg-legal-maroon/10 border border-legal-maroon/20" : "bg-parchment-200 border border-sepia-200"
        }`}>
          <svg className="h-6 w-6 text-legal-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-semibold text-sepia-900 truncate">
          {file.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-sepia-500 font-body">{formatFileSize(file.size)}</p>
          <span className="text-sepia-300">&middot;</span>
          <span className={`text-xs font-body font-medium ${
            isPdf ? "text-legal-maroon" : "text-sepia-600"
          }`}>
            {isPdf ? "PDF" : file.type.split("/")[1]?.toUpperCase()}
          </span>
        </div>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="p-1.5 text-sepia-300 hover:text-legal-maroon hover:bg-legal-maroon/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remove file"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
