import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const JSON_PATH = path.join(process.cwd(), "data", "community-posts.json");

async function readLocalThreads() {
  try {
    const file = await fs.readFile(JSON_PATH, "utf8");
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalThreads(threads: unknown[]) {
  await fs.writeFile(JSON_PATH, JSON.stringify(threads, null, 2));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const supabase = await createSupabaseServerClient();

    if (body?.type === "like") {
      const { data, error } = await supabase
        .from("community_posts")
        .update({ liked: Boolean(body.liked), likes: Number(body.likes ?? 0) })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json(data);
      }
    }

    if (body?.type === "reply") {
      const current = await readLocalThreads();
      const thread = current.find((item) => item.id === id);
      const nextReplies = Array.isArray(thread?.replies) ? [...thread.replies, body.reply] : [body.reply];
      const nextThread = { ...thread, replies: nextReplies };

      const { data, error } = await supabase
        .from("community_posts")
        .update({ replies: nextReplies })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json(data);
      }

      const updated = current.map((item) => (item.id === id ? nextThread : item));
      await writeLocalThreads(updated);
      return NextResponse.json(nextThread);
    }
  } catch {
    // Fall through to local-only mode.
  }

  const current = await readLocalThreads();
  const thread = current.find((item) => item.id === id);
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const updated = current.map((item) => {
    if (item.id !== id) return item;

    if (body?.type === "like") {
      const liked = Boolean(body.liked);
      return {
        ...item,
        liked,
        likes: Number(body.likes ?? item.likes),
      };
    }

    if (body?.type === "reply") {
      return {
        ...item,
        replies: [...(Array.isArray(item.replies) ? item.replies : []), body.reply],
      };
    }

    return item;
  });

  await writeLocalThreads(updated);
  return NextResponse.json(updated.find((item) => item.id === id));
}
