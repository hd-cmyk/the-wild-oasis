import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import {
  createAssistantAgent,
  runAssistantStream,
  createSSEStream,
} from "@/lib/assistant";

// Node runtime: LangChain/LangGraph and Supabase client use Node APIs; Edge has
// different limits and no native Node stream/buffer behavior for streaming.
export const runtime = "nodejs";

// SSE cannot use NextResponse.json(): that sends one JSON body and closes the
// connection. SSE requires a long-lived stream (text/event-stream) and multiple
// event payloads, so we return new Response(stream, { headers }).

function getConfigError(): string | null {
  if (!process.env.OPENAI_API_KEY) {
    return "OPENAI_API_KEY is not set. Add it to .env.local.";
  }
  if (
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (use the service_role key, not the anon key).";
  }
  return null;
}

const MAX_HISTORY_TURNS = 12;

function buildMessages(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Array<{ role: "human" | "ai"; content: string }> {
  const trimmed = history.slice(-MAX_HISTORY_TURNS);
  const converted = trimmed
    .filter((m) => m?.content != null && String(m.content).trim() !== "")
    .map((m) => ({
      role: (m.role === "user" ? "human" : "ai") as "human" | "ai",
      content: String(m.content),
    }));
  converted.push({ role: "human", content: message.trim() });
  return converted;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json(
      { error: "Request body must include a non-empty message." },
      { status: 400 }
    );
  }

  const history = Array.isArray(body.history) ? body.history : [];
  const messages = buildMessages(body.message.trim(), history);

  const session = await auth();
  const userEmail = session?.user?.email ?? null;

  const configError = getConfigError();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 503 });
  }

  const agent = createAssistantAgent(userEmail);
  const stream = createSSEStream((emit) =>
    runAssistantStream(agent, messages, emit)
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
