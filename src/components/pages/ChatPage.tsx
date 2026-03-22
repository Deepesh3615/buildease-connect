import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { Send, Pin, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  sender: string;
  senderRole: "admin" | "resident" | "staff";
  flat: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
  isPinned?: boolean;
};

const initialMessages: Message[] = [
  {
    id: "sys1",
    sender: "System",
    senderRole: "admin",
    flat: "",
    text: "Welcome to BuildEase Community Chat",
    timestamp: new Date(Date.now() - 86400000 * 2),
    isSystem: true,
  },
  {
    id: "m1",
    sender: "Priya Sharma",
    senderRole: "admin",
    flat: "A-101",
    text: "Good morning everyone! Water tank cleaning is scheduled for tomorrow 10 AM.",
    timestamp: new Date(Date.now() - 86400000),
    isPinned: true,
  },
  {
    id: "m2",
    sender: "Rahul Patil",
    senderRole: "resident",
    flat: "B-304",
    text: "Thank you for the update. Will water supply be interrupted?",
    timestamp: new Date(Date.now() - 82800000),
  },
  {
    id: "m3",
    sender: "Priya Sharma",
    senderRole: "admin",
    flat: "A-101",
    text: "Yes, for about 2 hours between 10 AM - 12 PM. Please store water accordingly.",
    timestamp: new Date(Date.now() - 79200000),
  },
  {
    id: "m4",
    sender: "Amit Deshmukh",
    senderRole: "staff",
    flat: "",
    text: "Lift maintenance completed in Tower B. All working fine now.",
    timestamp: new Date(Date.now() - 43200000),
  },
  {
    id: "sys2",
    sender: "System",
    senderRole: "admin",
    flat: "",
    text: "New resident Sneha Kulkarni joined (C-502)",
    timestamp: new Date(Date.now() - 7200000),
    isSystem: true,
  },
  {
    id: "m5",
    sender: "Meena Joshi",
    senderRole: "resident",
    flat: "A-403",
    text: "Is there parking available for visitors this weekend?",
    timestamp: new Date(Date.now() - 3600000),
  },
];

const roleColors: Record<string, string> = {
  admin: "text-primary",
  staff: "text-emerald-600",
  resident: "text-muted-foreground",
};

const roleBadge: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  staff: "bg-emerald-50 text-emerald-700",
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 86400000 && now.getDate() === date.getDate()) return "Today";
  if (diff < 172800000) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export const ChatPage: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pinnedMessage = messages.find((m) => m.isPinned);

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && last.sender === user?.name) {
      scrollToBottom();
    }
  }, [messages, user?.name]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !user) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      sender: user.name,
      senderRole: user.role,
      flat: user.flat,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setTimeout(() => scrollToBottom(), 50);
  };

  const handlePin = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        isPinned: m.id === id ? !m.isPinned : false,
      }))
    );
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!atBottom);
  };

  // Group messages by date
  const groupedMessages: { label: string; msgs: Message[] }[] = [];
  messages.forEach((msg) => {
    const label = formatDateLabel(msg.timestamp);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.label === label) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ label, msgs: [msg] });
    }
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col animate-in fade-in duration-300">
      {/* Pinned message */}
      {pinnedMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 mb-3">
          <Pin size={14} className="mt-0.5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary">{pinnedMessage.sender}</p>
            <p className="truncate text-xs text-foreground">{pinnedMessage.text}</p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto rounded-2xl bg-muted/40 px-3 py-3"
      >
        <div className="space-y-1">
          {groupedMessages.map((group) => (
            <div key={group.label}>
              {/* Date separator */}
              <div className="flex items-center justify-center py-3">
                <span className="rounded-full bg-secondary px-3 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {group.label}
                </span>
              </div>
              {group.msgs.map((msg) => {
                if (msg.isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center py-1.5">
                      <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                const isOwn = msg.sender === user?.name;

                return (
                  <div
                    key={msg.id}
                    className={`group flex mb-1.5 ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative max-w-[80%] rounded-2xl px-3 py-2 ${
                        isOwn
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-card card-shadow"
                      }`}
                    >
                      {/* Sender info */}
                      {!isOwn && (
                        <div className="mb-0.5 flex items-center gap-1.5">
                          <span className={`text-[11px] font-semibold ${roleColors[msg.senderRole]}`}>
                            {msg.sender}
                          </span>
                          {msg.senderRole !== "resident" && (
                            <span className={`rounded px-1 py-px text-[9px] font-semibold uppercase ${roleBadge[msg.senderRole]}`}>
                              {msg.senderRole}
                            </span>
                          )}
                          {msg.flat && (
                            <span className="text-[10px] text-muted-foreground">· {msg.flat}</span>
                          )}
                        </div>
                      )}
                      <p className="text-[13px] leading-relaxed break-words">{msg.text}</p>
                      <div className={`mt-0.5 flex items-center gap-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[10px] ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>

                      {/* Pin action for admins */}
                      {user?.role === "admin" && !isOwn && (
                        <button
                          onClick={() => handlePin(msg.id)}
                          className="absolute -right-1 -top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-card shadow group-hover:flex active:scale-95"
                          title={t("chat.pin")}
                        >
                          <Pin size={11} className={msg.isPinned ? "text-primary" : "text-muted-foreground"} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div ref={bottomRef} />

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            className="sticky bottom-2 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-md transition-all active:scale-95"
          >
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Input bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex flex-1 items-center rounded-2xl border border-border bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring transition-shadow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
};
