import api from "./axios-instance";
import type { JudgementResponse } from "../types";

export async function predictJudgement(
  caseDescription: string,
  caseType: string = "general",
  language: "en" | "hi" = "en"
): Promise<JudgementResponse> {
  const { data } = await api.post<JudgementResponse>(
    "/v1/predict-judgement",
    { case_description: caseDescription, case_type: caseType, language },
    { timeout: 360_000 }
  );
  return data;
}
