"use client";

import { useEffect, useState } from "react";
import { MessageCircleMore, Send, Bot, User, X, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
}

export default function FloatingChat() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "ai", text: t.chat.welcome },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages((previous) =>
      previous.length === 0
        ? [{ id: 1, sender: "ai", text: t.chat.welcome }]
        : previous.map((message, index) =>
            index === 0 && message.sender === "ai" ? { ...message, text: t.chat.welcome } : message,
          ),
    );
  }, [lang, t.chat.welcome]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    const history = messages.map((message) => ({
      role: message.sender === "user" ? "user" : "assistant",
      content: message.text,
    }));

    setMessages((previous) => [...previous, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "Unable to reach the AI assistant.");
      }

      const nextReply = data.reply ?? "I could not access the live AI service right now.";

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: nextReply,
        },
      ]);
    } catch (error) {
      console.error("Floating chat error:", error);
      const fallbackReply =
        error instanceof Error
          ? error.message
          : "I could not access the live AI service right now.";

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: fallbackReply,
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-[360px] overflow-hidden rounded-[28px] border border-[var(--mifi-border,#e7e3d0)] bg-[var(--surface,#ffffff)] shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-[var(--mifi-border,#e7e3d0)] bg-[var(--bg,#fdf8e2)] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f76f54] text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--table-text,#673c34)]">
                  {t.chat.title}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t.chat.closeChat}
              className="rounded-full p-1.5 text-[var(--mifi-sidebar-text-muted,#6b6b6b)] transition hover:bg-black/5 hover:text-[var(--fg,#000000)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex max-h-[420px] min-h-[320px] flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--bg,#fdf8e2)] p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                      message.sender === "user"
                        ? "bg-[#4a6741] text-white"
                        : "bg-white text-[var(--fg,#000000)] ring-1 ring-[var(--mifi-border,#e7e3d0)]"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--mifi-border,#e7e3d0)] bg-[var(--surface,#ffffff)] p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/chat")}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f7e289] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--table-text,#673c34)] transition hover:bg-[#f4d96a]"
                >
                  {t.chat.openFullChat}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={t.chat.placeholder}
                  className="flex-1 rounded-xl border border-[var(--mifi-border,#e7e3d0)] bg-[var(--bg,#fdf8e2)] px-3 py-2 text-sm text-[var(--fg,#000000)] outline-none ring-0 placeholder:text-[var(--mifi-sidebar-text-muted,#6b6b6b)]"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f76f54] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={t.chat.send}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t.chat.openChat}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f76f54] text-white shadow-[0_18px_35px_rgba(247,111,84,0.35)] transition hover:scale-105 hover:shadow-[0_20px_40px_rgba(247,111,84,0.45)]"
        >
          <MessageCircleMore className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
