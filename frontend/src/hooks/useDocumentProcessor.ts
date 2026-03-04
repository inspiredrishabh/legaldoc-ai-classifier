import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { uploadBatch, pollBatchStatus } from "../api/upload-api";
import { useDocumentStore } from "../stores/document-store";

export function useDocumentProcessor() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { files, batchId, results, setBatchResult, updateResults } =
    useDocumentStore();

  // Determine if we should be polling
  const isPolling =
    batchId != null &&
    results.some((r) => r.status === "pending" || r.status === "processing");

  // Poll with TanStack Query - auto-stops when isPolling is false
  const { data: pollData } = useQuery({
    queryKey: ["batch-status", batchId],
    queryFn: () => pollBatchStatus(batchId!),
    enabled: isPolling,
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (pollData) {
      updateResults(pollData.results);
    }
  }, [pollData, updateResults]);

  const upload = useCallback(async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const response = await uploadBatch(files, setUploadProgress);
      setBatchResult(response.batch_id, response.results);
    } finally {
      setIsUploading(false);
    }
  }, [files, setBatchResult]);

  return { upload, uploadProgress, isUploading, isPolling };
}
