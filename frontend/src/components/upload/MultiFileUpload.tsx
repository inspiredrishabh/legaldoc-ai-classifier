import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDocumentStore } from "../../stores/document-store";
import { useDocumentProcessor } from "../../hooks/useDocumentProcessor";
import { FilePreview } from "./FilePreview";
import { UploadProgress } from "./UploadProgress";

export function MultiFileUpload() {
  const { files, results, addFiles, removeFile, selectFile } =
    useDocumentStore();
  const { upload, uploadProgress, isUploading, isPolling } =
    useDocumentProcessor();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles);
    },
    [addFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-legal-gold bg-legal-gold/10 shadow-parchment-lg"
            : "border-sepia-300 hover:border-legal-gold hover:bg-parchment-100 hover:shadow-parchment"
        }`}
      >
        <input {...getInputProps()} />
        {/* Document upload icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-parchment-200 flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-legal-brown"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-base font-body font-medium text-sepia-800">
          {isDragActive
            ? "Release to upload your documents..."
            : "Drag & drop legal documents here"}
        </p>
        <p className="mt-1 text-sm text-sepia-500 font-body">
          or click to browse files
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="badge-info">PDF</span>
          <span className="badge-info">PNG</span>
          <span className="badge-info">JPEG</span>
          <span className="text-xs text-sepia-400">up to 50 MB</span>
        </div>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="section-title text-base">
              Selected Documents
            </h3>
            <span className="badge-gold">{files.length}</span>
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                index={index}
                onRemove={removeFile}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && results.length === 0 && (
        <button
          onClick={upload}
          disabled={isUploading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Analyze {files.length} Document{files.length > 1 ? "s" : ""}
            </>
          )}
        </button>
      )}

      {/* Progress / Results */}
      {isPolling && (
        <div className="flex items-center justify-center gap-2 py-3 text-legal-brown animate-pulse">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-body font-medium">Extracting and analyzing document text...</p>
        </div>
      )}
      <UploadProgress results={results} onSelectFile={selectFile} />
    </div>
  );
}
