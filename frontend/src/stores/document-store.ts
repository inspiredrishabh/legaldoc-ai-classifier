import { create } from "zustand";
import type { FileUploadResult } from "../types";

export type Language = "en" | "hi";

interface DocumentState {
  files: File[];
  batchId: string | null;
  results: FileUploadResult[];
  selectedFileId: string | null;
  language: Language;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  setBatchResult: (batchId: string, results: FileUploadResult[]) => void;
  updateResults: (results: FileUploadResult[]) => void;
  selectFile: (fileId: string) => void;
  setLanguage: (lang: Language) => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  files: [],
  batchId: null,
  results: [],
  selectedFileId: null,
  language: "en",

  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),

  removeFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
    })),

  setBatchResult: (batchId, results) => set({ batchId, results }),

  updateResults: (results) => set({ results }),

  selectFile: (fileId) => set({ selectedFileId: fileId }),

  setLanguage: (lang) => set({ language: lang }),

  reset: () =>
    set({ files: [], batchId: null, results: [], selectedFileId: null }),
}));
