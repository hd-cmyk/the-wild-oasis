"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { readAssistantSSE } from "@/app/_lib/parse-sse";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(payload) {
    const text = typeof payload === "string" ? payload : input.trim();
    if (!text || loading) return;

    if (typeof payload !== "string") setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const history = messages.slice(-12).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error || data.reply || `Error: ${res.status}`,
          },
        ]);
        return;
      }

      let streamingId = null;
      let appendedPlaceholder = false;
      streamingId = crypto.randomUUID();
      setMessages((prev) => {
        appendedPlaceholder = true;
        return [
          ...prev,
          { id: streamingId, role: "assistant", content: "" },
        ];
      });

      const { reply, error } = await readAssistantSSE(res, {
        onToken: (delta) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamingId
                ? { ...m, content: (m.content || "") + delta }
                : m
            )
          );
        },
      });

      if (error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId ? { ...m, content: error } : m
          )
        );
      } else if (reply) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? { ...m, content: reply }
              : m
          )
        );
      }
    } catch (e) {
      const errContent = e.message || "Request failed.";
      if (appendedPlaceholder && streamingId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId ? { ...m, content: errContent } : m
          )
        );
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errContent },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setMessages([]);
    setLoading(false);
    setInput("");
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg transition hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-xl bg-white shadow-lg"
          role="dialog"
          aria-label="Chat panel"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-stone-200 px-4 py-3">
            <h2 className="font-semibold text-primary-900">
              Wild Oasis Assistant
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-1 rounded px-1.5 py-0.5"
              aria-label="Reset chat"
            >
              Reset
            </button>
          </div>

          {/* Message list */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {messages.length === 0 && !loading && (
              <div className="mb-3 flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-stone-100 px-3 py-2 text-sm text-primary-900">
                  <p className="whitespace-pre-wrap">
                    Hi! I&apos;m the Wild Oasis Assistant.
                    {"\n\n"}
                    What can I help you with today?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSend("I want to check cabin availability")}
                      className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-primary-800 shadow-sm transition hover:border-accent-400 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-1"
                    >
                      Check availability
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSend("Show me my bookings")}
                      className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-primary-800 shadow-sm transition hover:border-accent-400 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-1"
                    >
                      View my bookings
                    </button>
                  </div>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={msg.id ?? i}
                className={`mb-3 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-accent-500 text-white"
                      : "bg-stone-100 text-primary-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-3 flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-stone-100 px-3 py-2 text-sm text-primary-900">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
                </div>
              </div>
            )}
            <div ref={listEndRef} />
          </div>

          {/* Input + send */}
          <div className="shrink-0 border-t border-stone-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm text-primary-900 placeholder-stone-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white transition hover:bg-accent-600 disabled:opacity-50 disabled:hover:bg-accent-500"
                aria-label="Send"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
