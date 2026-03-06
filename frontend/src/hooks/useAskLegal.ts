import { useMutation } from "@tanstack/react-query";
import { askLegal } from "../api/ask-api";

export function useAskLegal() {
  return useMutation({
    mutationFn: ({ query, language }: { query: string; language: "en" | "hi" }) =>
      askLegal(query, language),
  });
}
