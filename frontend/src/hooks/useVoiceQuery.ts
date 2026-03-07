import { useMutation } from "@tanstack/react-query";
import { voiceQuery } from "../api/voice-api";

export function useVoiceQuery() {
  return useMutation({
    mutationFn: ({
      transcript,
      language,
    }: {
      transcript: string;
      language: "en" | "hi";
    }) => voiceQuery(transcript, language),
  });
}
