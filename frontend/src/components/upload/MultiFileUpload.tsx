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
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop files here..."
            : "Drag and drop files here, or click to select"}
        </p>
        <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPEG up to 50MB</p>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length})
          </h3>
          {files.map((file, index) => (
            <FilePreview
              key={`${file.name}-${index}`}
              file={file}
              index={index}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && results.length === 0 && (
        <button
          onClick={upload}
          disabled={isUploading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isUploading
            ? `Uploading... ${uploadProgress}%`
            : `Upload ${files.length} file(s)`}
        </button>
      )}

      {/* Progress / Results */}
      {isPolling && (
        <p className="text-sm text-blue-600 text-center animate-pulse">
          Processing documents...
        </p>
      )}
      <UploadProgress results={results} onSelectFile={selectFile} />
    </div>
  );
}
