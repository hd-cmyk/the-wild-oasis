/**
 * Parse SSE (Server-Sent Events) from a fetch response body.
 * Yields { event, data } for each event. data is parsed JSON.
 */
export async function* parseSSE(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const block of parts) {
        if (!block.trim()) continue;
        let event = "message";
        let dataStr = "";
        for (const line of block.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          else if (line.startsWith("data:")) dataStr = line.slice(5).trim();
        }
        try {
          yield { event, data: dataStr ? JSON.parse(dataStr) : {} };
        } catch (_) {
          yield { event, data: dataStr };
        }
      }
    }
    if (buffer.trim()) {
      let event = "message";
      let dataStr = "";
      for (const line of buffer.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataStr = line.slice(5).trim();
      }
      if (dataStr !== "") {
        try {
          yield { event, data: JSON.parse(dataStr) };
        } catch (_) {
          yield { event, data: dataStr };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Consume SSE stream and accumulate reply from token + done events.
 * Returns { reply, error }. On error event or throw, error is set.
 *
 * @param {Response} response - fetch response with body stream
 * @param {Object} [options]
 * @param {(delta: string) => void} [options.onToken] - called for each token event with the streamed delta (payload.token or payload.content)
 * @param {(event: string, data: unknown) => void} [options.onEvent] - called for each SSE event
 */
export async function readAssistantSSE(response, options = {}) {
  const { onToken, onEvent } = options;
  let reply = "";
  let errorMsg = null;

  try {
    for await (const { event, data } of parseSSE(response)) {
      if (onEvent) onEvent(event, data);

      if (event === "token") {
        const delta = data?.token ?? data?.content ?? "";
        reply += delta;
        if (onToken && delta) onToken(delta);
      }
      if (event === "done" && data?.reply !== undefined) {
        reply = data.reply ?? reply;
      }
      if (event === "error" && data?.message) {
        errorMsg = data.message;
      }
    }
  } catch (e) {
    errorMsg = e?.message ?? String(e);
  }

  return { reply, error: errorMsg };
}
