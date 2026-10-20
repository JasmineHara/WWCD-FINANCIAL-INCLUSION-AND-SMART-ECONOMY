/**
 * components/report/ChatbotPanel.tsx
 * ---------------------------------------
 * The small chat box on the right of the Report page (Image 2) — matches
 * the standalone "chatbot Page" mockup (Image 4) when expanded via the
 * arrows icon. Sends questions to POST /api/tracker/chat.
 *
 * 🎨 FRONTEND — bubble colors via --mifi-accent-secondary (assistant) /
 * gray (user), expand/collapse icon wiring is already done — just restyle.
 */
"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Send } from "lucide-react";
import type { ChatMessage } from "@/types/tracker";

export function ChatbotPanel({ reportId }: { reportId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage() {
    if (!input.trim() || sending) return;
    const question = input.trim();
    setInput("");
    setSending(true);

    // Optimistically show the user's message.
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: question, created_at: new Date().toISOString() },
    ]);

    try {
      const res = await fetch("/api/tracker/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, question }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className={`flex flex-col rounded-md bg-white ${expanded ? "fixed inset-6 z-40 shadow-2xl" : "h-full"}`}
      style={{ border: "1px solid var(--mifi-border)" }}
    >
      <div className="flex items-center justify-end px-3 pt-3">
        <button onClick={() => setExpanded((v) => !v)} aria-label="Toggle chatbot size" className="opacity-60 hover:opacity-100">
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400">Ask me anything about this report — e.g. &quot;why did expenses go up?&quot;</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "ml-auto" : ""}`}
            style={{
              backgroundColor: m.role === "assistant" ? "var(--mifi-accent-secondary)" : "#e5e5e5",
              color: "#2b2b2b",
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t p-3" style={{ borderColor: "var(--mifi-border)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question…"
          className="flex-1 rounded-full border px-4 py-2 text-sm outline-none"
          style={{ borderColor: "var(--mifi-border)" }}
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          aria-label="Send"
          className="flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-60"
          style={{ backgroundColor: "var(--mifi-accent-primary)" }}
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
}
