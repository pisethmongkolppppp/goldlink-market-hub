import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { ChartLegend, IllustrativeChart } from "@/components/site/IllustrativeChart";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/charts")({
  head: () => ({
    meta: [
      { title: "Gold vs Crypto Comparison Charts — GoldLink AI" },
      { name: "description", content: "Compare gold, Bitcoin and Ethereum on shared charts: growth, volatility and how they move together." },
      { property: "og:title", content: "Gold vs Crypto Comparison Charts — GoldLink AI" },
      { property: "og:description", content: "Gold, Bitcoin and Ethereum on the same charts, made easy to read." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChartsPage,
});

const RANGES = ["1M", "6M", "1Y", "5Y"] as const;
const SEEDS: Record<(typeof RANGES)[number], number> = { "1M": 1, "6M": 5, "1Y": 9, "5Y": 13 };

// Relative bar heights for layout only — not measured volatility.
const SHAPE_BARS = [
  { name: "Gold", v: 2, fill: "var(--chart-gold)" },
  { name: "Bitcoin", v: 6, fill: "var(--chart-btc)" },
  { name: "Ethereum", v: 7, fill: "var(--chart-eth)" },
];

function ChartsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("1Y");
  return (
    <>
      <PageHeader
        eyebrow="Comparison charts"
        title={<>Gold and crypto on <span className="text-gradient-gold italic">one chart.</span></>}
        description="Different prices are rescaled to start at the same point (100), so you can compare how each one grows or falls — not just which number is bigger."
      >
        <StatusBadge tone="sample">Illustrative layouts</StatusBadge>
      </PageHeader>

      <Section className="space-y-6 py-10">
        <div className="panel p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-medium">Relative performance</h2>
              <div className="mt-2"><ChartLegend keys={["gold", "btc", "eth"]} /></div>
            </div>
            <Tabs value={range} onValueChange={(v) => setRange(v as typeof range)}>
              <TabsList>
                {RANGES.map((r) => (
                  <TabsTrigger key={r} value={r}>{r}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <IllustrativeChart keys={["gold", "btc", "eth"]} height={360} seed={SEEDS[range]} points={60} />
          <p className="mt-3 text-xs text-muted-foreground">
            Illustrative shapes to preview the layout. Real indexed prices will appear once market data is connected.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-medium">Volatility</h2>
              <StatusBadge tone="sample">Illustrative</StatusBadge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              How much a price swings up and down. Bigger bars mean a bumpier ride.
            </p>
            <div className="mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SHAPE_BARS} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={false} axisLine={false} tickLine={false} />
                  <Bar dataKey="v" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                    {SHAPE_BARS.map((b) => (
                      <Cell key={b.name} fill={b.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-medium">Do they move together?</h2>
              <StatusBadge>Not connected</StatusBadge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Correlation runs from −1 (opposite directions) to +1 (same direction). Values will be calculated from real prices.
            </p>
            <div className="mt-5 overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-4 bg-muted/50 text-xs font-medium text-muted-foreground">
                <span className="p-3" />
                {["Gold", "BTC", "ETH"].map((h) => <span key={h} className="p-3 text-center">{h}</span>)}
              </div>
              {["Gold", "BTC", "ETH"].map((row, i) => (
                <div key={row} className="grid grid-cols-4 border-t border-border text-sm">
                  <span className="p-3 text-xs font-medium text-muted-foreground">{row}</span>
                  {[0, 1, 2].map((j) => (
                    <span key={j} className="tabular p-3 text-center text-foreground/50">
                      {i === j ? "1.00" : "—"}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
