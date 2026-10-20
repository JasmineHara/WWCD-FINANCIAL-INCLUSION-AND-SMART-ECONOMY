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
import { Maximize2, Minimize2, Send, Bot, User } from "lucide-react";
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
    } catch {
      // Fallback AI response for testing / non-backend state
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Connect your AI backend endpoint (/api/tracker/chat) to answer questions about this report.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className={`flex flex-col rounded-3xl bg-surface transition-all ${
        expanded ? "fixed inset-6 z-50 shadow-2xl" : "h-full"
      }`}
      style={{ border: "1px solid var(--mifi-border, #e7e3d0)" }}
    >
      {/* Header bar matching the main assistant header */}
      <div 
        className="flex items-center justify-between px-5 py-3.5 border-b" 
        style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            Report AI Assistant
          </span>
        </div>

        <button 
          onClick={() => setExpanded((v) => !v)} 
          aria-label="Toggle chatbot size" 
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition p-1"
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-xs">
        {messages.length === 0 && (
          <div className="text-center py-8 px-4 text-gray-400 space-y-1">
            <Bot className="h-8 w-8 mx-auto text-amber-600/60 mb-2" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">Got questions about this report?</p>
            <p className="text-[11px]">Ask anything — e.g., &quot;Why did supplier expenses increase?&quot;</p>
          </div>
        )}
        
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="h-6 w-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                m.role === "user"
                  ? "bg-[#4a6741] text-white rounded-br-none"
                  : "bg-black/5 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-bl-none"
              }`}
            >
              {m.content}
            </div>

            {m.role === "user" && (
              <div className="h-6 w-6 rounded-full bg-[#f76f54] text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area matching main chat style */}
      <div className="flex items-center gap-2 border-t p-3" style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a question about this report..."
          className="flex-1 rounded-xl border px-3.5 py-2 text-xs bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          aria-label="Send"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f76f54] text-white transition hover:brightness-95 disabled:opacity-40 shrink-0"
        >
          <Send size={14} color="white" />
        </button>
      </div>
    </div>
  );
}