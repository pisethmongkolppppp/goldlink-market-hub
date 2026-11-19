import { formatUsd } from "@/lib/format";
import { useMarketPrices } from "@/hooks/use-market-snapshot";
import { createFileRoute } from "@tanstack/react-router";

import { ChartLegend, IllustrativeChart } from "@/components/site/IllustrativeChart";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { AssetIcon } from "@/components/site/PriceTile";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/crypto")({
  head: () => ({
    meta: [
      { title: "Bitcoin & Ethereum Dashboard — GoldLink AI" },
      { name: "description", content: "Follow Bitcoin and Ethereum in one calm, beginner-friendly dashboard with clear explanations." },
      { property: "og:title", content: "Bitcoin & Ethereum Dashboard — GoldLink AI" },
      { property: "og:description", content: "Bitcoin and Ethereum side by side, explained for beginners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CryptoPage,
});

const COINS = [
  {
    key: "btc" as const,
    name: "Bitcoin",
    sym: "BTC",
    about:
      "The first cryptocurrency, launched in 2009. Its supply is capped at 21 million coins, which is why some people call it “digital gold”.",
    facts: [["Launched", "2009"], ["Max supply", "21,000,000 BTC"], ["Smallest unit", "1 satoshi = 0.00000001 BTC"]],
  },
  {
    key: "eth" as const,
    name: "Ethereum",
    sym: "ETH",
    about:
      "A programmable blockchain launched in 2015. Ether (ETH) powers apps, tokens and smart contracts built on the network.",
    facts: [["Launched", "2015"], ["Max supply", "No fixed cap"], ["Smallest unit", "1 wei = 10⁻¹⁸ ETH"]],
  },
];

const METRICS = ["Price (USD)", "24h change", "Market cap", "24h volume"];

function CryptoPage() {
  const market = useMarketPrices();
  return (
    <>
      <PageHeader
        eyebrow="Crypto dashboard"
        title={<>Bitcoin & Ethereum, <span className="text-gradient-gold italic">side by side.</span></>}
        description="The two largest cryptocurrencies in one view. Prices, changes and volumes are shown when available, with labelled demonstration fallbacks."
      >
        <StatusBadge>{market.query.isPending ? "Loading quotes" : "Market data"}</StatusBadge>
      </PageHeader>

      <Section className="space-y-6 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {COINS.map((c) => (
            <div key={c.key} className="panel p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AssetIcon asset={c.key} />
                  <div>
                    <p className="text-lg font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.sym} / USD</p>
                  </div>
                </div>
                <StatusBadge>{market.status(c.key === "btc" ? "BTC" : "ETH")}</StatusBadge>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {METRICS.map((m, i) => (
                  <div key={m} className="rounded-lg border border-border bg-background/40 p-3">
                    <p className="text-xs text-muted-foreground">{m}</p>
                    <p className="tabular mt-1 text-xl text-foreground">{(() => { const p = market.price(c.key === "btc" ? "BTC" : "ETH"); const v = [p.usd, p.quote?.change24hPct, p.quote?.marketCapUsd, p.quote?.volume24hUsd][i]; return v == null ? "—" : i === 1 ? `${v.toFixed(2)}%` : formatUsd(v); })()}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{market.label(c.key === "btc" ? "BTC" : "ETH")}</p>
              <div className="mt-5">
                <IllustrativeChart keys={[c.key]} height={160} seed={c.key === "btc" ? 3 : 7} />
                <p className="mt-2 text-right text-xs text-muted-foreground">Illustrative shape, not market data</p>
              </div>
            </div>
          ))}
        </div>

        <div className="panel p-6">
          <h2 className="text-2xl font-medium">Beginner's guide</h2>
          <Tabs defaultValue="btc" className="mt-5">
            <TabsList>
              {COINS.map((c) => (
                <TabsTrigger key={c.key} value={c.key}>{c.name}</TabsTrigger>
              ))}
            </TabsList>
            {COINS.map((c) => (
              <TabsContent key={c.key} value={c.key} className="mt-5 grid gap-6 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="leading-relaxed text-muted-foreground">{c.about}</p>
                  <div className="mt-4"><ChartLegend keys={[c.key]} /></div>
                </div>
                <dl className="divide-y divide-border rounded-lg border border-border">
                  {c.facts.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="tabular text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Section>
    </>
  );
}
