import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot-system-prompt";

const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const REFUSAL_TEXT =
  "I'm not able to help with that. You can reach CamCCUL at +237 233 36 11 82 or info@camccul.cm.";
const ERROR_TEXT =
  "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach CamCCUL directly at +237 233 36 11 82 or info@camccul.cm.";

interface IncomingMessage {
  role: "user" | "bot";
  text: string;
}

function isIncomingMessage(value: unknown): value is IncomingMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "bot") &&
    typeof candidate.text === "string" &&
    candidate.text.trim().length > 0 &&
    candidate.text.length <= MAX_MESSAGE_LENGTH
  );
}

// Simple in-memory sliding-window limiter. This resets whenever the server
// process restarts and is per-instance (not shared across multiple
// deployment instances) — good enough to blunt casual abuse of a paid API,
// not a substitute for a real rate limiter (e.g. Upstash/Redis) at scale.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "The assistant isn't configured yet. Please contact CamCCUL at +237 233 36 11 82 or info@camccul.cm.",
      },
      { status: 503 }
    );
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(rawMessages)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // The client's displayed message list always opens with a static welcome
  // message that was never sent to the model — drop it before converting.
  const conversation = rawMessages
    .filter(isIncomingMessage)
    .filter((message, index) => !(index === 0 && message.role === "bot"))
    .slice(-MAX_HISTORY_MESSAGES);

  if (conversation.length === 0 || conversation[0].role !== "user") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const anthropicMessages: Anthropic.MessageParam[] = conversation.map((message) => ({
    role: message.role === "bot" ? "assistant" : "user",
    content: message.text,
  }));

  const client = new Anthropic();

  let claudeStream: ReturnType<typeof client.messages.stream>;
  try {
    claudeStream = client.messages.stream({
      model: "claude-opus-5",
      max_tokens: 1024,
      thinking: { type: "disabled" },
      system: [
        {
          type: "text",
          text: CHATBOT_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: anthropicMessages,
    });
  } catch (error) {
    console.error("Chatbot stream setup error:", error);
    return NextResponse.json({ error: ERROR_TEXT }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const responseStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sentAny = false;
      try {
        for await (const event of claudeStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sentAny = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const finalMessage = await claudeStream.finalMessage();
        if (!sentAny || finalMessage.stop_reason === "refusal") {
          controller.enqueue(encoder.encode(REFUSAL_TEXT));
        }
      } catch (error) {
        console.error("Chatbot stream error:", error);
        if (!sentAny) {
          controller.enqueue(encoder.encode(ERROR_TEXT));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
