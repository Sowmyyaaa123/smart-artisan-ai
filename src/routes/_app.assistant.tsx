import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User as UserIcon, Trash2 } from "lucide-react";
import { getChat, setChat, type ChatMessage, uid } from "@/lib/storage";
import { generateReply, estimateDelay } from "@/lib/mockAssistant";

export const Route = createFileRoute("/_app/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — ArtisanAI" }, { name: "description", content: "Smart guidance for craftsmanship, pricing, packaging, and marketing." }] }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "How do I price a hand-painted ceramic vase?",
  "Eco-friendly packaging ideas for fragile items",
  "Tips to photograph handmade jewelry for Instagram",
  "Best materials for monsoon-season block prints",
];

function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => getChat());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setChat(messages); }, [messages]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg: ChatMessage = { id: uid(), role: "user", content, ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    const reply = generateReply(content);
    await new Promise((r) => setTimeout(r, estimateDelay(reply)));
    setMessages((cur) => [...cur, { id: uid(), role: "assistant", content: reply, ts: Date.now() }]);
    setLoading(false);
  }

  function clearChat() { setMessages([]); }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            AI Assistant <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"><Sparkles className="h-3 w-3" /> Beta</span>
          </h1>
          <p className="text-muted-foreground mt-1">Your handmade-business co-pilot.</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-sm text-muted-foreground inline-flex items-center gap-1.5 hover:text-destructive transition">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        )}
      </div>

      <div className="flex-1 rounded-3xl bg-card border shadow-card flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full grid place-items-center text-center">
              <div className="max-w-md">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary grid place-items-center text-white shadow-glow mb-4">
                  <Bot className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold">How can I help your studio?</h2>
                <p className="text-muted-foreground mt-2">Ask about pricing, packaging, marketing, or material suggestions.</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-2 text-left">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)}
                      className="rounded-xl border px-4 py-3 text-sm hover:border-primary/40 hover:bg-primary/5 transition text-left">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in-up">
              <Avatar role="assistant" />
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 flex items-center gap-1">
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="border-t bg-gradient-to-b from-transparent to-muted/30 p-4">
          <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              rows={1}
              placeholder="Ask anything about your handmade business…"
              className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none max-h-40"
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-primary text-primary-foreground shadow hover:shadow-glow transition disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
        </form>
      </div>
    </div>
  );
}

function Bubble({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={m.role} />
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed rounded-2xl ${
          isUser
            ? "bg-gradient-primary text-primary-foreground rounded-tr-sm shadow"
            : "bg-muted text-foreground rounded-tl-sm"
        }`}>
          {m.content}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1 px-1">
          {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  if (role === "user") {
    return (
      <div className="h-9 w-9 rounded-full bg-secondary text-secondary-foreground grid place-items-center shrink-0">
        <UserIcon className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-white shrink-0 shadow">
      <Bot className="h-4 w-4" />
    </div>
  );
}
