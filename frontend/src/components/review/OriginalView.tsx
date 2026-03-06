interface OriginalViewProps {
  file: File | null;
}

export function OriginalView({ file }: OriginalViewProps) {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full parchment-card rounded-xl">
        <svg className="h-10 w-10 text-sepia-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <p className="text-sm text-sepia-500 font-body">Select a file to view</p>
      </div>
    );
  }

  const url = URL.createObjectURL(file);
  const isPdf = file.type === "application/pdf";

  return (
    <div className="h-full overflow-auto parchment-card rounded-xl flex flex-col">
      <div className="p-3 bg-parchment-100 border-b border-sepia-200 flex-shrink-0">
        <h3 className="text-sm font-serif font-semibold text-legal-brown">Original Document</h3>
        <p className="text-xs text-sepia-500 font-body mt-0.5">{file.name}</p>
      </div>
      <div className="p-2 flex-1">
        {isPdf ? (
          <iframe
            src={url}
            className="w-full h-full min-h-[600px] border-0 rounded"
            title="PDF Preview"
          />
        ) : (
          <img
            src={url}
            alt={file.name}
            className="max-w-full h-auto rounded"
            onLoad={() => URL.revokeObjectURL(url)}
          />
        )}
      </div>
    </div>
  );
}
