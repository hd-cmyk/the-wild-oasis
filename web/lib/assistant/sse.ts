/**
 * SSE (Server-Sent Events) using the Web Streams API.
 * We use a ReadableStream and return new Response(stream, { headers }) so that
 * the client receives a long-lived stream. NextResponse.json() would send a
 * single payload and close the connection, so it cannot be used for SSE.
 */

function encodeSSE(event: string, data: Record<string, unknown>): string {
  const payload = JSON.stringify(data);
  return `event: ${event}\ndata: ${payload}\n\n`;
}

export type SSEHandler = (
  emit: (event: string, data: Record<string, unknown>) => void
) => Promise<void>;

/**
 * Create a ReadableStream that runs the given handler and encodes its
 * emit(event, data) calls as SSE. Events: start, token, tool_start, tool_end, done, error.
 */
export function createSSEStream(handler: SSEHandler): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: string, data: Record<string, unknown>) => {
        try {
          controller.enqueue(encoder.encode(encodeSSE(event, data)));
        } catch (e) {
          console.error("SSE emit error:", e);
        }
      };

      try {
        await handler(emit);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        emit("error", { message });
      } finally {
        controller.close();
      }
    },
  });
}
