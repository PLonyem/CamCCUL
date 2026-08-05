"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  role: "bot" | "user";
  text: string;
}

const FOCUSABLE_SELECTOR = 'input, button, [href], [tabindex]:not([tabindex="-1"])';

// Offsets both the closed bubble and the open window the same amount from
// the corner, but adds env(safe-area-inset-*) on top so it clears the home
// indicator / rounded corners on notched phones instead of hiding under them.
const FAB_POSITION_CLASS =
  "fixed z-[60] bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] right-[calc(1.5rem_+_env(safe-area-inset-right))]";

export function Chatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: t("chatbot_welcome") },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Keep the standing welcome message in sync with the active language —
  // as long as the visitor hasn't started chatting yet. Adjusted during
  // render (rather than in an effect) since it's reacting to a change in
  // the `language` value itself, not synchronizing with an external system.
  const [lastLanguage, setLastLanguage] = useState(language);
  if (language !== lastLanguage) {
    setLastLanguage(language);
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "bot"
        ? [{ role: "bot", text: t("chatbot_welcome") }]
        : prev
    );
  }

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (e.key !== "Tab" || !windowRef.current) return;

      const focusable = Array.from(
        windowRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextMessages: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      // Error responses (rate limit, misconfiguration, bad request) come
      // back as plain JSON; a successful reply streams as plain text.
      if (!response.ok || !response.body) {
        const data: { error?: string } = await response.json().catch(() => ({}));
        setMessages((prev) => [...prev, { role: "bot", text: data.error ?? t("chatbot_error") }]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        botText += chunk;

        if (!started) {
          started = true;
          setIsTyping(false);
          setMessages((prev) => [...prev, { role: "bot", text: botText }]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "bot", text: botText };
            return updated;
          });
        }
      }

      if (!started) {
        setMessages((prev) => [...prev, { role: "bot", text: t("chatbot_error") }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: t("chatbot_error") }]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage();
  }

  const canSend = input.trim().length > 0 && !isTyping;

  if (!isOpen) {
    return (
      <div className={cn(FAB_POSITION_CLASS, "animate-chatbot-float")}>
        <span className="absolute inset-0 rounded-full bg-primary-500 animate-chatbot-pulse" />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t("chatbot_open_aria")}
          className="relative w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("chatbot_assistant_name")}
      className={cn(
        FAB_POSITION_CLASS,
        "origin-bottom-right animate-fade-in",
        "w-80 sm:w-96 max-[400px]:w-[calc(100vw-2rem)] h-[min(24rem,80dvh)]",
        "bg-white rounded-2xl shadow-2xl border border-gray-200",
        "flex flex-col overflow-hidden"
      )}
    >
      <div className="bg-primary-500 text-white px-4 py-3 flex items-center justify-between rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold text-sm">{t("chatbot_assistant_name")}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label={t("chatbot_close_aria")}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "px-4 py-3 text-sm max-w-[85%] animate-fade-in",
              message.role === "bot"
                ? "bg-white rounded-2xl rounded-bl-md text-gray-800 shadow-sm mr-auto"
                : "bg-primary-500 text-white rounded-2xl rounded-br-md ml-auto"
            )}
          >
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-400 shadow-sm max-w-[85%] mr-auto animate-fade-in">
            {t("chatbot_typing")}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-3 flex gap-2 bg-white rounded-b-2xl shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chatbot_placeholder")}
          aria-label={t("chatbot_input_aria")}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={t("chatbot_send_aria")}
          className="bg-primary-500 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-primary-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
