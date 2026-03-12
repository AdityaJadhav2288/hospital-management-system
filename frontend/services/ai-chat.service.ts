import { API_BASE_URL } from "@/config/app";

function resolveAiChatUrl(): string {
  const normalized = API_BASE_URL.replace(/\/+$/, "");

  if (normalized.endsWith("/api/v1")) {
    return `${normalized.slice(0, -"/api/v1".length)}/api/ai/chat`;
  }

  if (normalized.endsWith("/api")) {
    return `${normalized}/ai/chat`;
  }

  return `${normalized}/api/ai/chat`;
}

const AI_CHAT_URL = resolveAiChatUrl();

export const aiChatService = {
  send: async (message: string): Promise<string> => {
    const response = await fetch(AI_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const payload = (await response.json().catch(() => null)) as
      | { reply?: string; data?: { reply?: string }; message?: string }
      | null;

    if (!response.ok) {
      throw new Error(payload?.message || `AI request failed with status ${response.status}`);
    }

    const reply = payload?.reply ?? payload?.data?.reply;
    if (!reply || typeof reply !== "string") {
      throw new Error("Invalid AI response.");
    }

    return reply;
  },
};
