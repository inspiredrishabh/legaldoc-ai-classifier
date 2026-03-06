import api from "./axios-instance";
import type { AskResponse } from "../types";

export async function askLegal(query: string, language: "en" | "hi" = "en"): Promise<AskResponse> {
  const { data } = await api.post<AskResponse>("/v1/ask", { query, language }, {
    timeout: 360_000, // LLM inference can take 60-120s
  });
  return data;
}
