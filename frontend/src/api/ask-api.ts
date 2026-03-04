import api from "./axios-instance";
import type { AskResponse } from "../types";

export async function askLegal(query: string): Promise<AskResponse> {
  const { data } = await api.post<AskResponse>("/v1/ask", { query });
  return data;
}
