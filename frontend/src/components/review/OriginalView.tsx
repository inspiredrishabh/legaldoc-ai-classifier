interface OriginalViewProps {
  file: File | null;
}

export function OriginalView({ file }: OriginalViewProps) {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">Select a file to view</p>
      </div>
    );
  }

  const url = URL.createObjectURL(file);
  const isPdf = file.type === "application/pdf";

  return (
    <div className="h-full overflow-auto bg-gray-50 rounded-lg border border-gray-200">
      <div className="p-2 bg-gray-100 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Original Document</h3>
        <p className="text-xs text-gray-500">{file.name}</p>
      </div>
      <div className="p-2">
        {isPdf ? (
          <iframe
            src={url}
            className="w-full h-[600px] border-0"
            title="PDF Preview"
          />
        ) : (
          <img
            src={url}
            alt={file.name}
            className="max-w-full h-auto"
            onLoad={() => URL.revokeObjectURL(url)}
          />
        )}
      </div>
    </div>
  );
}
