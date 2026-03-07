import { useMutation } from "@tanstack/react-query";
import { predictJudgement } from "../api/judgement-api";

export function useJudgementPrediction() {
  return useMutation({
    mutationFn: ({
      caseDescription,
      caseType,
      language,
    }: {
      caseDescription: string;
      caseType?: string;
      language: "en" | "hi";
    }) => predictJudgement(caseDescription, caseType, language),
  });
}
