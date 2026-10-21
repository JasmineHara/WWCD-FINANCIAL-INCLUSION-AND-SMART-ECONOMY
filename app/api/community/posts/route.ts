import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CommunityThread = {
  id: string;
  title: string;
  preview: string;
  content: string;
  author: string;
  timeAgo: string;
  tags: string[];
  likes: number;
  liked?: boolean;
  replies: Array<{
    id: string;
    author: string;
    timeAgo: string;
    content: string;
    isBestAnswer?: boolean;
  }>;
};

const JSON_PATH = path.join(process.cwd(), "data", "community-posts.json");

async function readLocalThreads(): Promise<CommunityThread[]> {
  try {
    const file = await fs.readFile(JSON_PATH, "utf8");
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalThreads(threads: CommunityThread[]) {
  await fs.writeFile(JSON_PATH, JSON.stringify(threads, null, 2));
}

function normalizeThread(thread: CommunityThread): CommunityThread {
  return {
    id: thread.id,
    title: thread.title,
    preview: thread.preview,
    content: thread.content,
    author: thread.author,
    timeAgo: thread.timeAgo,
    tags: Array.isArray(thread.tags) ? thread.tags : [],
    likes: Number(thread.likes ?? 0),
    liked: Boolean(thread.liked),
    replies: Array.isArray(thread.replies) ? thread.replies : [],
  };
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return NextResponse.json(data.map((row) => normalizeThread({
        id: String(row.id),
        title: row.title,
        preview: row.preview ?? row.content?.slice(0, 90) ?? "",
        content: row.content,
        author: row.author,
        timeAgo: row.time_ago ?? "Just now",
        tags: Array.isArray(row.tags) ? row.tags : [],
        likes: Number(row.likes ?? 0),
        liked: Boolean(row.liked),
        replies: Array.isArray(row.replies) ? row.replies : [],
      })));
    }
  } catch {
    // Fall back to local JSON file when Supabase is not configured or the table is not present.
  }

  const fallback = await readLocalThreads();
  return NextResponse.json(fallback);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CommunityThread>;

  const thread: CommunityThread = {
    id: body.id ?? `thread-${Date.now()}`,
    title: String(body.title ?? "").trim(),
    preview: String(body.preview ?? body.content ?? "").slice(0, 90),
    content: String(body.content ?? "").trim(),
    author: String(body.author ?? "You").trim() || "You",
    timeAgo: String(body.timeAgo ?? "Just now"),
    tags: Array.isArray(body.tags) ? body.tags : ["General"],
    likes: Number(body.likes ?? 0),
    liked: Boolean(body.liked),
    replies: Array.isArray(body.replies) ? body.replies : [],
  };

  if (!thread.title || !thread.content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        id: thread.id,
        title: thread.title,
        preview: thread.preview,
        content: thread.content,
        author: thread.author,
        time_ago: thread.timeAgo,
        tags: thread.tags,
        likes: thread.likes,
        liked: thread.liked,
        replies: thread.replies,
      })
      .select()
      .single();

    if (!error && data) {
      return NextResponse.json({
        ...thread,
        preview: data.preview ?? thread.preview,
        timeAgo: data.time_ago ?? thread.timeAgo,
      }, { status: 201 });
    }
  } catch {
    // Fall through to local JSON persistence.
  }

  const fallbackThreads = await readLocalThreads();
  const nextThreads = [thread, ...fallbackThreads];
  await writeLocalThreads(nextThreads);

  return NextResponse.json(thread, { status: 201 });
}
