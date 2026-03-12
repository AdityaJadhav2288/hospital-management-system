"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, SendHorizonal, X } from "lucide-react";
import { RobotAssistantTrigger } from "@/components/ai/robot-assistant-trigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiChatService } from "@/services/ai-chat.service";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

function createMessage(role: ChatRole, text: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
  };
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showRobotGreeting, setShowRobotGreeting] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: "Hello 👋 I'm your hospital assistant. I can help with doctor availability, symptoms, appointments, and hospital information.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowRobotGreeting(false);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      setShowRobotGreeting(false);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, sending]);

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || sending) return;

    setMessages((prev) => [...prev, createMessage("user", message)]);
    setInput("");
    setSending(true);

    try {
      const reply = await aiChatService.send(message);
      setMessages((prev) => [...prev, createMessage("assistant", reply)]);
    } catch (error) {
      const fallback =
        error instanceof Error ? error.message : "Unable to get a response right now. Please try again.";
      setMessages((prev) => [...prev, createMessage("assistant", fallback)]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <div
        className={`flex h-[72vh] w-[min(92vw,390px)] flex-col overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-[0_28px_80px_-28px_rgba(15,23,42,0.45)] transition-all duration-300 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-cyan-100 bg-[linear-gradient(135deg,#0f766e,#0ea5e9_52%,#2563eb)] px-4 py-3 text-white">
          <div>
            <p className="text-sm font-semibold">🏥 Hospital AI Assistant</p>
            <p className="text-xs text-white/85">Status: Online</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f8fbff_0%,#f1f8ff_100%)] px-3 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-msg flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[86%]">
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-[linear-gradient(135deg,#0f766e,#2563eb)] text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {message.text}
                </div>
                <p
                  className={`mt-1 text-[10px] ${
                    message.role === "user" ? "text-right text-slate-500" : "text-slate-500"
                  }`}
                >
                  {message.role === "user" ? "🙂 You" : "🤖 AI Assistant"}
                </p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="chat-msg flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                AI is typing...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="h-10 rounded-xl border-slate-300"
            />
            <Button
              type="button"
              className="h-10 rounded-xl px-3"
              onClick={() => {
                void sendMessage();
              }}
              disabled={sending || !input.trim()}
            >
              <SendHorizonal size={16} />
            </Button>
          </div>
        </div>
      </div>

      <RobotAssistantTrigger
        open={open}
        showGreeting={showRobotGreeting && !open}
        onClick={() => setOpen((prev) => !prev)}
      />

      <style jsx>{`
        @keyframes chatbotFadeIn {
          from {
            opacity: 0;
            transform: translateY(7px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chat-msg {
          animation: chatbotFadeIn 0.22s ease-out;
        }
      `}</style>
    </div>
  );
}
