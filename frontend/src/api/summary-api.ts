import api from "./axios-instance";
import type { SummaryResponse } from "../types";

export async function summarizeDocument(
  documentText: string,
  language: "en" | "hi" = "en",
  detailLevel: "brief" | "standard" | "detailed" = "standard"
): Promise<SummaryResponse> {
  const { data } = await api.post<SummaryResponse>(
    "/v1/summarize",
    { document_text: documentText, language, detail_level: detailLevel },
    { timeout: 360_000 }
  );
  return data;
}
