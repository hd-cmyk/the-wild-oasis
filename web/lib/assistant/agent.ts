import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { buildSystemPrompt } from "./prompt";
import { buildAssistantTools } from "./tools";

/**
 * Create the Wild Oasis assistant agent. Uses Node runtime (LangChain/LangGraph
 * and Supabase client work in Node; Edge has different APIs and limits).
 */
export function createAssistantAgent(userEmail: string | null | undefined) {
  const tools = buildAssistantTools(userEmail);

  const llm = new ChatOpenAI({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    temperature: 0.2,
    streaming: true,
  });

  return createAgent({
    model: llm,
    tools,
    systemPrompt: buildSystemPrompt(),
  });
}

type SSEEmit = (event: string, data: Record<string, unknown>) => void;

export type AssistantMessage = { role: "human" | "ai"; content: string };

function extractReply(result: { messages?: unknown[] }): string {
  const messages = result?.messages ?? [];
  const lastMessage = Array.isArray(messages) ? messages[messages.length - 1] : null;
  const content = (lastMessage as { content?: unknown })?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return (content as { text?: string }[])
      .map((block) => ("text" in block ? block.text : ""))
      .filter(Boolean)
      .join("\n") || "";
  }
  return String(content ?? "");
}

/**
 * Run the agent with streaming and emit SSE events. Tries streamEvents (v2),
 * then stream(), then invoke(). Emits: start, token, tool_start, tool_end, done, error.
 * messages: conversation history + current turn (role "human" | "ai", last must be "human").
 */
export async function runAssistantStream(
  agent: ReturnType<typeof createAssistantAgent>,
  messages: AssistantMessage[],
  emit: SSEEmit
): Promise<void> {
  const cleaned = messages
    .filter((m) => m?.content != null && String(m.content).trim() !== "")
    .map((m) => ({ role: m.role, content: String(m.content) }));
  const input = { messages: cleaned };

  emit("start", {});

  try {
    // Prefer streamEvents (v2) for token-level and tool events
    const hasStreamEvents = typeof (agent as { streamEvents?: unknown }).streamEvents === "function";
    if (hasStreamEvents) {
      console.log("SSE path: streamEvents");
      const eventStream = (agent as {
        streamEvents: (
          state: typeof input,
          config?: { version?: "v1" | "v2" }
        ) => AsyncIterable<{ event: string; data?: { chunk?: unknown; output?: unknown; error?: string } }>;
      }).streamEvents(input, { version: "v2" });

      let lastReply = "";
      for await (const e of eventStream) {
        const ev = e.event ?? "";
        const data = e.data ?? {};

        if (ev.includes("on_chat_model_stream") && data.chunk) {
          const chunk = data.chunk as { content?: string };
          if (typeof chunk?.content === "string") {
            lastReply += chunk.content;
            emit("token", { token: chunk.content });
          }
        }
        if (ev.includes("on_chat_model_end") && data.output) {
          const output = data.output as { content?: string };
          if (typeof output?.content === "string" && !lastReply) {
            lastReply = output.content;
          }
        }
        if (ev.includes("on_tool_start")) {
          emit("tool_start", { name: (e as { name?: string }).name ?? "tool" });
        }
        if (ev.includes("on_tool_end")) {
          emit("tool_end", { output: data.output });
        }
      }
      emit("done", { reply: lastReply || undefined });
      return;
    }
  } catch (_streamEventsErr) {
    // Fall through to stream() or invoke()
  }

  try {
    // Fallback: agent.stream() yields state updates; last chunk has final messages
    if (typeof (agent as { stream?: unknown }).stream === "function") {
      console.log("SSE path: stream()");
      const stream = await (agent as {
        stream: (state: typeof input) => Promise<AsyncIterable<{ messages?: unknown[] }>>;
      }).stream(input);

      let lastChunk: { messages?: unknown[] } = {};
      for await (const chunk of stream) {
        lastChunk = chunk;
      }
      const reply = extractReply(lastChunk);
      emit("done", { reply });
      return;
    }
  } catch (_streamErr) {
    // Fall through to invoke()
  }

  // Fallback: invoke() and emit a single done event
  console.log("SSE path: invoke()");
  try {
    const result = await (agent as { invoke: (state: typeof input) => Promise<{ messages?: unknown[] }> }).invoke(input);
    const reply = extractReply(result);
    emit("done", { reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emit("error", { message });
  }
}
