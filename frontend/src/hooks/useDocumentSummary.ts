import { useMutation } from "@tanstack/react-query";
import { summarizeDocument } from "../api/summary-api";

export function useDocumentSummary() {
  return useMutation({
    mutationFn: ({
      documentText,
      language,
      detailLevel,
    }: {
      documentText: string;
      language: "en" | "hi";
      detailLevel?: "brief" | "standard" | "detailed";
    }) => summarizeDocument(documentText, language, detailLevel),
  });
}
