"use client";

import { useState, useRef, useEffect } from "react";
import { TopBar } from "@/components/tracker/TopBar";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `${crypto.randomUUID()}-user`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      // TODO: Replace with real backend streaming endpoint (e.g., fetch('/api/ai/chat'))
      // Simulating a clean delay before backend connection
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "meow",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "How can I improve my cash flow this month?",
    "Summarize my recent supplier expenses",
    "What are my highest expense categories?",
  ];

  return (
    <div className="w-full min-h-screen flex flex-col pb-6">
      <TopBar title="AI Financial Assistant" />

      <main className="flex-1 px-8 py-6 max-w-4xl w-full mx-auto flex flex-col justify-between space-y-4">
        {/* Chat History Container */}
        <div
          className="flex-1 rounded-3xl bg-surface border p-6 shadow-sm overflow-y-auto space-y-4 min-h-[450px] max-h-[600px]"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
              <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Welcome to mifi AI Assistant
                </h3>
                <p className="text-sm text-gray-500 max-w-md mt-1">
                  Ask questions about your business cash flow, transaction history, or tips on financial optimization.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="pt-4 flex flex-wrap justify-center gap-2 max-w-lg">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs font-medium bg-black/5 dark:bg-zinc-800 hover:bg-black/10 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 px-3.5 py-2 rounded-full transition text-left flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="h-8 w-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm space-y-1 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#4a6741] text-white rounded-br-none"
                      : "bg-black/5 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-bl-none"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[10px] text-right ${
                      msg.sender === "user" ? "text-emerald-100" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-[#f76f54] text-white flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 items-center text-gray-400 text-xs italic">
              <div className="h-8 w-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <span>AI is thinking...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3 bg-surface p-2.5 rounded-2xl border shadow-sm"
          style={{ borderColor: "var(--mifi-border, #e7e3d0)" }}
        >
          <input
            type="text"
            placeholder="Ask AI anything about your financials..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent px-3 text-sm text-gray-900 dark:text-white focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="h-10 w-10 rounded-xl bg-[#f76f54] hover:brightness-95 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  );
}