"use client";

import { useEffect, useMemo, useState } from "react";
import { TopBar } from "@/components/tracker/TopBar";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MessageSquare,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
  isBestAnswer?: boolean;
}

interface Thread {
  id: string;
  title: string;
  preview: string;
  content: string;
  author: string;
  timeAgo: string;
  tags: string[];
  likes: number;
  liked?: boolean;
  replies: Comment[];
}

const initialThreads: Thread[] = [
  {
    id: "thread-1",
    title: "How do you handle slow cash-flow months as a small business?",
    preview: "Looking for practical ways to stay steady when sales dip temporarily.",
    content:
      "We are a retail business and our sales drop for two months every year. I want to keep stock moving without over-spending. What approaches have worked for you?",
    author: "Aisha",
    timeAgo: "2 hours ago",
    tags: ["Cash Flow", "Retail"],
    likes: 18,
    liked: false,
    replies: [
      {
        id: "reply-1",
        author: "Farid",
        timeAgo: "1 hour ago",
        content: "I usually build a leaner monthly forecast and freeze non-essential purchases until the sales rebound.",
        isBestAnswer: true,
      },
    ],
  },
  {
    id: "thread-2",
    title: "Best way to track recurring expenses in a growing business?",
    preview: "I want a cleaner system for subscriptions, utilities, and software costs.",
    content:
      "My monthly spending is becoming harder to track because the subscriptions and recurring bills are spread across different tools. I need a way to review them every month.",
    author: "Nadia",
    timeAgo: "1 day ago",
    tags: ["Accounting"],
    likes: 12,
    liked: true,
    replies: [
      {
        id: "reply-2",
        author: "Hafiz",
        timeAgo: "18 hours ago",
        content: "Create a recurring-expenses category in your tracker and review it every Friday with your cash-flow summary.",
      },
    ],
  },
];

export default function CommunityPage() {
  const { t } = useLanguage();
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    let isActive = true;

    const fetchThreads = async () => {
      try {
        const response = await fetch("/api/community/posts");
        const data = await response.json();

        if (!isActive) return;

        if (Array.isArray(data) && data.length > 0) {
          setThreads(data as Thread[]);
          return;
        }
      } catch (error) {
        console.error("Failed to load community posts:", error);
      }

      if (isActive) {
        setThreads(initialThreads);
      }
    };

    void fetchThreads();

    return () => {
      isActive = false;
    };
  }, []);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("General");
  const [isPosting, setIsPosting] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const filteredThreads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return threads;

    return threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(query) ||
        thread.preview.toLowerCase().includes(query) ||
        thread.content.toLowerCase().includes(query) ||
        thread.author.toLowerCase().includes(query),
    );
  }, [threads, searchQuery]);

  const activeThread = threads.find((thread) => thread.id === selectedThreadId) ?? null;

  const handleToggleLike = (id: string) => {
    setThreads((current) =>
      current.map((thread) => {
        if (thread.id !== id) return thread;

        const isLiked = !thread.liked;
        return {
          ...thread,
          liked: isLiked,
          likes: Math.max(0, thread.likes + (isLiked ? 1 : -1)),
        };
      }),
    );
  };

  const handleCreateThread = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isPosting) return;

    setIsPosting(true);

    const nextThread: Thread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim(),
      preview: newContent.trim().slice(0, 90) + (newContent.trim().length > 90 ? "..." : ""),
      content: newContent.trim(),
      author: "You",
      timeAgo: "Just now",
      tags: [newTag || "General"],
      likes: 0,
      liked: false,
      replies: [],
    };

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextThread),
      });

      const savedThread = (await response.json()) as Thread;
      setThreads((current) => [savedThread ?? nextThread, ...current]);
      setSelectedThreadId((savedThread ?? nextThread).id);
    } catch (error) {
      console.error("Failed to save community post:", error);
      setThreads((current) => [nextThread, ...current]);
      setSelectedThreadId(nextThread.id);
    } finally {
      setNewTitle("");
      setNewContent("");
      setNewTag("General");
      setIsPosting(false);
      setIsModalOpen(false);
    }
  };

  const handleAddReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedThreadId || !replyInput.trim() || isReplying) return;

    setIsReplying(true);

    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: "You",
      timeAgo: "Just now",
      content: replyInput.trim(),
    };

    try {
      const response = await fetch(`/api/community/posts/${selectedThreadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reply", reply: newReply }),
      });

      const updatedThread = (await response.json()) as Thread;
      if (updatedThread) {
        setThreads((current) =>
          current.map((thread) => (thread.id === selectedThreadId ? updatedThread : thread)),
        );
      }
    } catch (error) {
      console.error("Failed to save reply:", error);
      setThreads((current) =>
        current.map((thread) => {
          if (thread.id !== selectedThreadId) return thread;
          return {
            ...thread,
            replies: [...thread.replies, newReply],
          };
        }),
      );
    } finally {
      setReplyInput("");
      setIsReplying(false);
    }
  };

  return (
    <div className="w-full min-h-screen pb-16">
      <TopBar title={t.page.communityTitle} />

      <main className="mx-auto max-w-5xl space-y-6 px-8 py-6">
        {activeThread ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setSelectedThreadId(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to discussions
            </button>

            <div
              className="rounded-3xl border bg-surface p-8 shadow-sm"
              style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{activeThread.title}</h1>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{activeThread.author}</span>
                    <span>•</span>
                    <span>{activeThread.timeAgo}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeThread.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{activeThread.content}</p>

              <div
                className="mt-6 flex items-center justify-between border-t pt-4"
                style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleLike(activeThread.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeThread.liked
                      ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40"
                      : "bg-black/5 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${activeThread.liked ? "fill-current" : ""}`} />
                  <span>{activeThread.likes} Likes</span>
                </button>

                <span className="text-xs text-gray-500">{activeThread.replies.length} replies</span>
              </div>
            </div>

            <div
              className="rounded-3xl border bg-surface p-8 shadow-sm"
              style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
            >
              <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">
                Replies ({activeThread.replies.length})
              </h3>

              <div className="space-y-4">
                {activeThread.replies.length === 0 ? (
                  <p className="py-4 text-xs italic text-gray-400">No replies yet. Be the first to answer.</p>
                ) : (
                  activeThread.replies.map((reply) => (
                    <div key={reply.id} className="space-y-2 border-t pt-4 first:border-t-0 first:pt-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{reply.author}</span>
                          {reply.isBestAnswer && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" /> Best answer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400">{reply.timeAgo}</span>
                      </div>

                      <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">{reply.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddReply} className="mt-6 flex items-center gap-3">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(event) => setReplyInput(event.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 rounded-2xl border bg-white px-4 py-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-zinc-800 dark:text-white"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                />
                <button
                  type="submit"
                  disabled={!replyInput.trim() || isReplying}
                  className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-[#f76f54] px-5 py-3 text-xs font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
                >
                  {isReplying ? "Sending..." : "Reply"}
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative min-w-[280px] flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search for topics or questions..."
                  className="w-full rounded-2xl border bg-white pl-11 pr-4 py-3 text-xs text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-zinc-800 dark:text-white"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-sm transition hover:brightness-95"
                style={{
                  backgroundColor: "var(--color-secondary, #fae3b1)",
                  color: "#2b2b2b",
                }}
              >
                <Plus className="h-4 w-4" />
                Start new discussion
              </button>
            </div>

            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className="group cursor-pointer space-y-3 rounded-3xl border bg-surface p-6 shadow-sm transition hover:shadow-md"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                      {thread.title}
                    </h3>

                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">{thread.preview}</p>

                  <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {thread.author} • <span className="font-normal text-gray-400">{thread.timeAgo}</span>
                    </span>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleLike(thread.id);
                        }}
                        className={`flex items-center gap-1 transition ${
                          thread.liked ? "font-bold text-rose-600" : "hover:text-gray-700"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${thread.liked ? "fill-current" : ""}`} />
                        <span>{thread.likes}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{thread.replies.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredThreads.length === 0 && (
                <div
                  className="rounded-3xl border bg-surface p-12 text-center text-gray-400 shadow-sm"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                >
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">No discussions found</p>
                  <p className="mt-1 text-xs">Be the first to start a conversation.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-3xl border bg-white p-6 shadow-2xl dark:bg-zinc-900"
            style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Start a new discussion</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-gray-400 transition hover:text-gray-900 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="mt-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Topic title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="e.g. How to handle cash flow during low season?"
                  className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-zinc-800 dark:text-white"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Category tag</label>
                <select
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  className="w-full cursor-pointer rounded-xl border bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-zinc-800 dark:text-white"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                >
                  <option value="General">General</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Cash Flow">Cash Flow</option>
                  <option value="Tax & Audit">Tax & Audit</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Discussion details</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(event) => setNewContent(event.target.value)}
                  placeholder="Share details, questions, or tips with the community..."
                  className="w-full rounded-xl border bg-white p-3.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-zinc-800 dark:text-white"
                  style={{ borderColor: "var(--mifi-border, #e3dcc8)" }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-black/5 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting}
                  className="rounded-full bg-[#f76f54] px-5 py-2 text-xs font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
                >
                  {isPosting ? "Posting..." : "Post topic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}