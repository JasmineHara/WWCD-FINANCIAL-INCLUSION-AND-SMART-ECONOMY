"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { TopBar } from "@/components/tracker/TopBar";
import { useLanguage } from "@/context/LanguageContext";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

const stamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function Bubble({ sender, text, time }: { sender: "user" | "ai"; text: string; time?: string }) {
  const isUser = sender === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full bg-amber-600 text-white flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUser
            ? "bg-[#4a6741] text-white rounded-br-none"
            : "bg-black/5 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-bl-none"
        }`}
      >
        <p className="leading-relaxed whitespace-pre-line">{text}</p>
        {time && (
          <span
            className={`mt-1 block text-right text-[10px] ${
              isUser ? "text-emerald-100" : "text-gray-400"
            }`}
          >
            {time}
          </span>
        )}
      </div>

      {isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#f76f54] text-white flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default function AIChatPage() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, error]);

  const send = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setInput("");

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: query,
      time: stamp(),
    };
    const aiId = crypto.randomUUID();

    // Backend format: { role: "user" | "model", text }, ending with the new question.
    const payload = [...messages, userMsg].map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload, lang }),
      });

      const errors = t.chat.errors as Record<string, string>;

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(errors[data?.error] ?? errors.upstream);
      }

      // Show the reply as it streams in.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });

        setIsTyping(false);
        setMessages((prev) =>
          prev.some((m) => m.id === aiId)
            ? prev.map((m) => (m.id === aiId ? { ...m, text: full } : m))
            : [...prev, { id: aiId, sender: "ai", text: full, time: stamp() }]
        );
      }

      if (!full.trim()) throw new Error(errors.blocked);
    } catch (err) {
      console.error("AI Chat Error:", err);
      setError(
        err instanceof TypeError
          ? t.chat.errors.network
          : err instanceof Error
          ? err.message
          : t.chat.errors.upstream
      );
    } finally {
      setIsTyping(false);
      busyRef.current = false;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col pb-6">
      <TopBar title={t.chat.title} />

      <main className="flex-1 px-8 py-6 max-w-4xl w-full mx-auto flex flex-col space-y-4">
        {/* Conversation */}
        <div
          className="flex-1 rounded-3xl bg-surface border p-6 shadow-sm overflow-y-auto space-y-4 min-h-[450px] max-h-[600px]"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        >
          {/* Welcome is UI only: not stored in state, not sent to the backend */}
          <Bubble sender="ai" text={t.chat.welcome} />

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pl-11">
              {t.chat.suggestions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  className="flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-zinc-800 hover:bg-black/10 dark:hover:bg-zinc-700 px-3.5 py-2 text-left text-xs font-medium text-gray-800 dark:text-gray-200 transition"
                >
                  <Sparkles className="h-3 w-3 shrink-0 text-amber-600" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <Bubble key={m.id} sender={m.sender} text={m.text} time={m.time} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-xs italic text-gray-400">
              <div className="h-8 w-8 shrink-0 rounded-full bg-amber-600 text-white flex items-center justify-center">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <span>{t.chat.thinking}</span>
            </div>
          )}

          {error && (
            <p role="alert" className="text-center text-xs text-red-600">
              {error}
            </p>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-3 rounded-2xl border bg-surface p-2.5 shadow-sm"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat.placeholder}
            maxLength={1000}
            className="flex-1 bg-transparent px-3 text-sm text-gray-900 dark:text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label={t.chat.send}
            className="h-10 w-10 shrink-0 rounded-xl bg-[#f76f54] text-white flex items-center justify-center transition hover:brightness-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-400">{t.chat.disclaimer}</p>
      </main>
    </div>
  );
}