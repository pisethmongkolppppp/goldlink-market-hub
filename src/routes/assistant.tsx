import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, User } from "lucide-react";
import { useState, type FormEvent } from "react";

import { PageHeader, Section } from "@/components/site/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — GoldLink AI" },
      { name: "description", content: "Ask plain-language questions about gold and cryptocurrency with the GoldLink AI assistant." },
      { property: "og:title", content: "AI Assistant — GoldLink AI" },
      { property: "og:description", content: "A friendly assistant for questions about gold and crypto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "What is a troy ounce?",
  "Why do people call Bitcoin digital gold?",
  "How is Ethereum different from Bitcoin?",
  "Is gold less risky than crypto?",
];

// Local educational knowledge base: no external model or API key required.
function educationalAnswer(question: string): string {
  const q = question.toLowerCase();
  if (/buy|sell|invest|predict|recommend|profit|should i/.test(q)) return "I can explain market concepts, but cannot recommend purchases or predict returns. Gold and crypto prices can both fall.";
  if (/troy|ounce|karat|purity/.test(q)) return "A troy ounce is 31.1034768 grams. Gold prices are usually quoted per troy ounce. Karats describe purity: 24K is nearly pure gold.";
  if (/risk|volatil/.test(q)) return "Volatility measures how much prices change. Gold and cryptocurrencies can both lose value; crypto has often had larger price swings.";
  if (/ethereum| ether|eth\b/.test(q)) return "Ethereum is a blockchain that supports smart contracts and applications. Bitcoin mainly focuses on transferring and recording digital value.";
  if (/bitcoin|btc|digital gold/.test(q)) return "Bitcoin is sometimes called digital gold because its supply is limited to 21 million coins. Unlike physical gold, it exists on a digital network.";
  if (/convert|gram|calculate/.test(q)) return "The converter multiplies the amount of crypto by its dollar price, then divides by the gold price per gram. It is a mathematical estimate, not an actual exchange.";
  if (/chart|correlat/.test(q)) return "Indexed charts start each asset at 100 to compare relative changes. Correlation describes whether two assets move together. The sample charts are illustrative, not historical market data.";
  if (/price|live|market/.test(q)) return "The dashboards request market quotes from CoinGecko and Gold-API.com. Check the source and timestamp; if a quote is unavailable, the displayed demo value is labelled.";
  if (/gold/.test(q)) return "Gold is a precious metal used in jewellery, industry and as a store of value. Its price changes with supply, demand and economic conditions.";
  return "I am a limited, rule-based educational assistant. Try asking about troy ounces, Bitcoin, Ethereum, gold, volatility or the converter.";
}

const CAPABILITIES = [
  "Explain market terms in plain language",
  "Explain differences between gold and crypto",
  "Explain the converter",
  "Explain market data sources",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! I am a rule-based educational assistant. Ask about gold, Bitcoin, Ethereum or market terms. I am not connected to a generative AI model.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }, { role: "assistant", text: educationalAnswer(t) }]);
    setDraft("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(draft);
  };

  return (
    <>
      <PageHeader
        eyebrow="AI assistant"
        title={<>Ask anything about <span className="text-gradient-gold italic">gold & crypto.</span></>}
        description="A patient guide for beginners. Ask in your own words and get clear, jargon-free answers."
      >
        <StatusBadge>Rule-based · no generative AI</StatusBadge>
      </PageHeader>

      <Section className="grid gap-6 py-10 lg:grid-cols-[1fr_20rem]">
        <div className="panel flex min-h-[520px] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="grid size-9 place-items-center rounded-full bg-gradient-gold text-primary-foreground">
              <Bot className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">GoldLink Assistant</p>
              <p className="text-xs text-muted-foreground">Educational knowledge base</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full ${
                    m.role === "user" ? "bg-secondary text-foreground" : "border border-primary/40 bg-primary/10 text-primary"
                  }`}
                >
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <p
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                className="h-11"
                placeholder="Type your question…"
                aria-label="Your question"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <Button type="submit" variant="gold" size="icon" className="size-11" aria-label="Send">
                <Send />
              </Button>
            </form>
          </div>
        </div>

        <aside className="panel h-fit p-6">
          <h2 className="text-xl font-medium">What the assistant can explain</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {CAPABILITIES.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
            The assistant shares general information, not personal financial advice.
          </p>
        </aside>
      </Section>
    </>
  );
}
