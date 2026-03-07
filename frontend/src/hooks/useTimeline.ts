import { useMutation } from "@tanstack/react-query";
import { generateTimeline } from "../api/timeline-api";

export function useTimeline() {
  return useMutation({
    mutationFn: ({
      documentText,
      language,
    }: {
      documentText: string;
      language: "en" | "hi";
    }) => generateTimeline(documentText, language),
  });
}
