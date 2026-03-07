import api from "./axios-instance";
import type { TimelineResponse } from "../types";

export async function generateTimeline(
  documentText: string,
  language: "en" | "hi" = "en"
): Promise<TimelineResponse> {
  const { data } = await api.post<TimelineResponse>(
    "/v1/generate-timeline",
    { document_text: documentText, language },
    { timeout: 360_000 }
  );
  return data;
}
