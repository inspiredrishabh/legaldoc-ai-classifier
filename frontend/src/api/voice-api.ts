import api from "./axios-instance";
import type { VoiceQueryResponse } from "../types";

export async function voiceQuery(
  transcript: string,
  language: "en" | "hi" = "en"
): Promise<VoiceQueryResponse> {
  const { data } = await api.post<VoiceQueryResponse>(
    "/v1/voice-query",
    { transcript, language },
    { timeout: 360_000 }
  );
  return data;
}
