import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the official virtual assistant for CamCCUL — the Cameroon Cooperative Credit Union League Ltd, the apex supervisory body for over 220 credit unions across all 10 regions of Cameroon. Founded in 1968 and headquartered in Bamenda, you are regulated by COBAC.

IDENTITY: You are CamCCUL's official chatbot on camccul.cm. You serve the public, credit union staff, and partners. You do NOT open accounts, give loans, or process transactions — those happen at individual credit unions.

LANGUAGE: Reply in the language the user writes in (English, French, or Cameroonian Pidgin). Be brief — 2 to 4 sentences. Be warm and plain-spoken.

KNOWLEDGE:
- Headquarters: Commercial Avenue, Bamenda, Northwest Region, Cameroon
- Phone: +237 233 36 11 82
- Email: info@camccul.cm
- Hours: Monday-Friday, 8:00 AM to 5:00 PM
- Website: camccul.cm
- Services: Regulatory Supervision, Financial Auditing, Capacity Building, Digitalization
- Affiliates: 220+ credit unions across Adamawa, Centre, East, Far North, Littoral, North, Northwest, South, Southwest, West
- COBAC requirements: liquidity ratio min 100%, NPL max 5%, capital adequacy min 8%

ABSOLUTE RULES:
1. NEVER state any interest rate, fee, loan amount, or financial figure. Say it varies by credit union.
2. NEVER give financial, legal, or tax advice.
3. NEVER discuss anyone's account or personal details. You have no access to banking systems.
4. NEVER ask for PINs, passwords, or verification codes. If offered, warn the user immediately.
5. NEVER invent phone numbers, addresses, or staff names. Only use what you've been given.
6. NEVER promise loan approvals or outcomes.
7. If unsure, say: "I don't have that information. Please contact CamCCUL at +237 233 36 11 82."

CREDIT UNIONS: A credit union is a member-owned, not-for-profit cooperative. Members pool savings and lend to each other. Every member has one vote. Credit unions are not banks.

WEBSITE PAGES: Home, About (history, leadership, mission), Services (four services with detail pages), Affiliates (directory by region), Resources (downloads), News, FAQ, Contact (form and info).

DIGITALIZATION: Phase 1 (live) — this website. Phase 2 (in development) — digital reporting system. Phase 3 (planned) — mobile services.`;

function getHardcodedReply(message: string): string {
  const msg = message.toLowerCase().trim();

  const knowledge: { keywords: string[]; answer: string }[] = [
    {
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "help"],
      answer: "Hello! I'm the CamCCUL virtual assistant. I can help you find a credit union, answer questions about the League, or explain our services. What can I help you with today?"
    },
    {
      keywords: ["what is camccul", "about camccul", "who is camccul", "tell me about camccul"],
      answer: "CamCCUL — the Cameroon Cooperative Credit Union League — is the apex body supervising over 220 credit unions across all 10 regions of Cameroon. Founded in 1968 and headquartered in Bamenda, we are regulated by COBAC and the Ministry of Finance."
    },
    {
      keywords: ["services", "what does camccul do", "what do you do", "camccul services"],
      answer: "CamCCUL provides four core services: Regulatory Supervision (COBAC compliance monitoring), Financial Auditing (annual audits), Capacity Building (staff training), and Digitalization (modernizing credit union operations). Visit our Services page for details."
    },
    {
      keywords: ["find credit union", "credit union near", "near me", "affiliate", "directory", "location", "where is"],
      answer: "Visit our Affiliates Directory page on this website. Select your region from the dropdown menu to see all CamCCUL-affiliated credit unions in that area with their contact details. We have credit unions in all 10 regions of Cameroon."
    },
    {
      keywords: ["open account", "join", "become member", "membership", "how to join"],
      answer: "CamCCUL does not open accounts directly — we supervise credit unions. To open a savings account, visit any CamCCUL-affiliated credit union near you. Use our Affiliates Directory to find one. You'll need identification and a small initial deposit."
    },
    {
      keywords: ["loan", "borrow", "credit", "lend"],
      answer: "CamCCUL does not give loans directly. Loans are provided by individual credit unions. Each credit union sets its own terms. Visit one near you to apply. Use our Affiliates Directory to find a credit union in your area."
    },
    {
      keywords: ["contact", "phone", "email", "address", "call", "reach", "headquarters", "number", "telephone"],
      answer: "CamCCUL headquarters: Commercial Avenue, Bamenda, Northwest Region, Cameroon. Phone: +237 233 36 11 82. Email: info@camccul.cm. Office hours: Monday to Friday, 8:00 AM to 5:00 PM. Visit our Contact page to send a message."
    },
    {
      keywords: ["interest rate", "rate", "fee", "charge", "cost"],
      answer: "Interest rates and fees vary by credit union — CamCCUL does not set these rates. I recommend contacting the credit union nearest to you for their current rates. You can find their contact details in our Affiliates Directory."
    },
    {
      keywords: ["safe", "safety", "protection", "money safe", "savings safe", "insured"],
      answer: "CamCCUL-affiliated credit unions operate under strict COBAC regulations and undergo regular audits. We monitor financial health continuously and intervene early if problems arise to protect member savings."
    },
    {
      keywords: ["cobac", "regulation", "regulator", "compliance", "requirements"],
      answer: "COBAC (Commission Bancaire de l'Afrique Centrale) regulates financial institutions in the CEMAC region. Key requirements for credit unions: minimum liquidity ratio 100%, maximum NPL ratio 5%, minimum capital adequacy ratio 8%."
    },
    {
      keywords: ["training", "capacity building", "workshop", "course", "learn", "skill"],
      answer: "CamCCUL offers robust capacity building training covering financial management, loan portfolio management, governance, risk management, and digital literacy. Training is delivered through regional workshops, on-site coaching, and online modules."
    },
    {
      keywords: ["digital", "digitalization", "technology", "modern", "transformation"],
      answer: "CamCCUL is spearheading digitalization through a phased approach: Phase 1 (live) — this modern website with affiliate directory. Phase 2 (in development) — digital reporting system. Phase 3 (planned) — mobile services and field tools."
    },
    {
      keywords: ["history", "founded", "when started", "year", "origin"],
      answer: "CamCCUL was founded in 1968 in Bamenda, Cameroon. For over 50 years, we have grown to supervise more than 220 credit unions across all 10 regions, serving millions of members nationwide."
    },
    {
      keywords: ["hours", "open", "opening", "working hours", "office hours"],
      answer: "CamCCUL headquarters is open Monday through Friday, 8:00 AM to 5:00 PM. We are closed on weekends and public holidays. Phone: +237 233 36 11 82."
    },
    {
      keywords: ["credit union vs bank", "difference", "cooperative vs bank"],
      answer: "Credit unions are member-owned, not-for-profit cooperatives. Banks are owned by shareholders seeking profit. Credit union members have equal voting rights, and profits return to members through better rates and lower fees."
    },
    {
      keywords: ["job", "career", "vacancy", "work", "hiring", "employment"],
      answer: "Job opportunities at CamCCUL are posted on our News page. We seek professionals in auditing, finance, training, IT, and administration. You can also send your CV to info@camccul.cm."
    },
    {
      keywords: ["thank", "thanks", "appreciate", "goodbye", "bye"],
      answer: "You're welcome! If you have more questions, I'm here anytime. You can also reach CamCCUL at +237 233 36 11 82. Have a great day!"
    }
  ];

  for (const entry of knowledge) {
    if (entry.keywords.some(keyword => msg.includes(keyword))) {
      return entry.answer;
    }
  }

  return "I don't have specific information about that. For more detailed inquiries, please contact CamCCUL at +237 233 36 11 82, email info@camccul.cm, or visit our Contact page. Is there anything else I can help with?";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      const reply = getHardcodedReply(message);
      return NextResponse.json({ reply });
    }

    const messages = [
      ...history.slice(-10).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 250,
        temperature: 0.3,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      const reply = getHardcodedReply(message);
      return NextResponse.json({ reply });
    }

    const data = await response.json();
    const reply = data.content[0].text;

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chatbot route error:", error);
    return NextResponse.json({
      reply: "Something went wrong. Please try again, or contact CamCCUL at +237 233 36 11 82 for immediate assistance."
    }, { status: 200 });
  }
}
