import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";

import { ChartLegend, IllustrativeChart } from "@/components/site/IllustrativeChart";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { AssetIcon, PriceTile } from "@/components/site/PriceTile";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/gold")({
  head: () => ({
    meta: [
      { title: "Gold Price Dashboard — GoldLink AI" },
      { name: "description", content: "A clear gold dashboard: spot price per ounce, gram and kilogram, plus a beginner's guide to gold purity." },
      { property: "og:title", content: "Gold Price Dashboard — GoldLink AI" },
      { property: "og:description", content: "Gold spot price per ounce, gram and kilogram, explained for beginners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GoldPage,
});

const PURITY = [
  { k: "24K", pct: "99.9%", use: "Bullion bars and coins" },
  { k: "22K", pct: "91.7%", use: "Coins and fine jewellery" },
  { k: "18K", pct: "75.0%", use: "Premium jewellery" },
  { k: "14K", pct: "58.3%", use: "Everyday jewellery" },
];

const DRIVERS = [
  { t: "Interest rates", d: "Gold pays no interest, so it often looks more attractive when rates fall." },
  { t: "The US dollar", d: "Gold is priced in dollars; a weaker dollar can make it cheaper for others to buy." },
  { t: "Uncertainty", d: "In uncertain times, many investors turn to gold as a store of value." },
  { t: "Central banks", d: "Large purchases or sales by national banks can shift demand." },
];

function GoldPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gold dashboard"
        title={<>The price of <span className="text-gradient-gold italic">gold</span>, made simple.</>}
        description="Gold is priced per troy ounce (about 31.1 grams). Here you'll see it per ounce, gram and kilogram once a market data source is connected."
      >
        <StatusBadge>Live data not connected</StatusBadge>
      </PageHeader>

      <Section className="space-y-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PriceTile label="Spot price" symbol="XAU / USD · per oz t" icon={<AssetIcon asset="gold" />} />
          <PriceTile label="Per gram" symbol="USD / g" />
          <PriceTile label="Per kilogram" symbol="USD / kg" />
          <PriceTile label="24h change" symbol="Percent" note="Shown once connected" />
        </div>

        <div className="panel p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-medium">Price history</h2>
              <div className="mt-2 flex items-center gap-3">
                <ChartLegend keys={["gold"]} />
                <StatusBadge tone="sample">Illustrative shape, not market data</StatusBadge>
              </div>
            </div>
            <Tabs defaultValue="1M">
              <TabsList>
                {["1D", "1W", "1M", "1Y", "5Y"].map((r) => (
                  <TabsTrigger key={r} value={r}>{r}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <IllustrativeChart keys={["gold"]} height={320} seed={4} points={60} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-6">
            <h2 className="text-2xl font-medium">Gold purity guide</h2>
            <p className="mt-2 text-sm text-muted-foreground">Karats (K) tell you how much of an item is pure gold.</p>
            <div className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {PURITY.map((p) => (
                <div key={p.k} className="grid grid-cols-[4rem_5rem_1fr] items-center gap-3 px-4 py-3 text-sm">
                  <span className="font-display text-lg text-primary">{p.k}</span>
                  <span className="tabular">{p.pct}</span>
                  <span className="text-muted-foreground">{p.use}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <h2 className="text-2xl font-medium">What moves the gold price?</h2>
            <ul className="mt-5 space-y-4">
              {DRIVERS.map((d) => (
                <li key={d.t} className="flex gap-3">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{d.t}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{d.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
