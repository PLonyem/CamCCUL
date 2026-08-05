"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useChatbotContext } from "./chatbot-context";

// Desktop-only inline pill, rendered by Navbar in normal document flow (not
// portaled) — the mobile floating button lives in ChatbotWidget instead.
export function ChatbotTrigger() {
  const { t } = useLanguage();
  const { openChat } = useChatbotContext();

  return (
    <button
      type="button"
      onClick={openChat}
      className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      {t("chatbot_trigger_label")}
    </button>
  );
}
