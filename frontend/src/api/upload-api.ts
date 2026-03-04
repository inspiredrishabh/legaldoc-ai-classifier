import api from "./axios-instance";
import type { BatchUploadResponse } from "../types";

export async function uploadBatch(
  files: File[],
  onUploadProgress?: (percent: number) => void,
): Promise<BatchUploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const { data } = await api.post<BatchUploadResponse>(
    "/v1/files/upload-batch",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && onUploadProgress) {
          onUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    },
  );
  return data;
}

export async function pollBatchStatus(
  batchId: string,
): Promise<BatchUploadResponse> {
  const { data } = await api.get<BatchUploadResponse>(
    `/v1/files/batch/${batchId}`,
  );
  return data;
}
