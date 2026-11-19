import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Calculator } from "lucide-react";
import { useState } from "react";

import { PageHeader, Section } from "@/components/site/PageHeader";
import { AssetIcon } from "@/components/site/PriceTile";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertCryptoToGold, GOLD_UNITS, type GoldUnit } from "@/lib/conversion";
import { formatAmount, formatUsd } from "@/lib/format";

export const Route = createFileRoute("/converter")({
  head: () => ({
    meta: [
      { title: "Crypto to Gold Converter — GoldLink AI" },
      { name: "description", content: "Find out how much gold your Bitcoin or Ethereum is worth, in ounces, grams or kilograms." },
      { property: "og:title", content: "Crypto to Gold Converter — GoldLink AI" },
      { property: "og:description", content: "Convert Bitcoin or Ethereum into an equal weight of gold." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConverterPage,
});

const toNum = (s: string) => (s.trim() === "" ? NaN : Number(s));

function ConverterPage() {
  const [coin, setCoin] = useState<"BTC" | "ETH">("BTC");
  const [amount, setAmount] = useState("1");
  const [coinPrice, setCoinPrice] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [unit, setUnit] = useState<GoldUnit>("oz");

  const result = convertCryptoToGold({
    amount: toNum(amount),
    cryptoPriceUsd: toNum(coinPrice),
    goldPricePerOzUsd: toNum(goldPrice),
    unit,
  });
  const unitShort = GOLD_UNITS.find((u) => u.value === unit)!.short;

  return (
    <>
      <PageHeader
        eyebrow="Converter"
        title={<>Turn crypto into <span className="text-gradient-gold italic">gold</span> terms.</>}
        description="See how much gold your Bitcoin or Ethereum would equal. Live prices aren't connected yet, so enter the prices you want to use."
      >
        <StatusBadge>Live prices not connected</StatusBadge>
      </PageHeader>

      <Section className="grid gap-6 py-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="panel p-6 sm:p-8">
          <div className="space-y-6">
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-muted-foreground">You have</legend>
              <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                <Select value={coin} onValueChange={(v) => setCoin(v as "BTC" | "ETH")}>
                  <SelectTrigger className="h-12" aria-label="Cryptocurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="tabular h-12 text-lg"
                  inputMode="decimal"
                  type="number"
                  min="0"
                  step="any"
                  aria-label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coin-price">{coin} price (USD)</Label>
                <Input id="coin-price" className="tabular h-11" type="number" min="0" step="any" placeholder="Enter a price" value={coinPrice} onChange={(e) => setCoinPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gold-price">Gold price per troy oz (USD)</Label>
                <Input id="gold-price" className="tabular h-11" type="number" min="0" step="any" placeholder="Enter a price" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-center">
              <span className="grid size-10 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <ArrowDown className="size-4" />
              </span>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-muted-foreground">That equals</legend>
              <div className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-background/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <AssetIcon asset="gold" />
                  <div>
                    <p className="tabular text-3xl font-medium text-gradient-gold" aria-live="polite">
                      {result ? `${formatAmount(result.goldAmount, 4)} ${unitShort}` : "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {result ? `Worth ${formatUsd(result.usdValue)}` : "Fill in both prices to see the result"}
                    </p>
                  </div>
                </div>
                <Select value={unit} onValueChange={(v) => setUnit(v as GoldUnit)}>
                  <SelectTrigger className="h-11 sm:w-44" aria-label="Gold unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOLD_UNITS.map((u) => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </fieldset>
          </div>
        </div>

        <aside className="panel h-fit p-6">
          <div className="flex items-center gap-3">
            <Calculator className="size-5 text-primary" />
            <h2 className="text-2xl font-medium">How it's calculated</h2>
          </div>
          <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <li><span className="text-foreground">1.</span> Your crypto amount × its price = value in US dollars.</li>
            <li><span className="text-foreground">2.</span> Dollar value ÷ gold price per troy ounce = ounces of gold.</li>
            <li><span className="text-foreground">3.</span> 1 troy ounce = 31.1035 grams, so we convert to grams or kilograms if you choose.</li>
          </ol>
          <p className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
            This is an estimate for learning only. Real trades include fees and price differences between sellers.
          </p>
        </aside>
      </Section>
    </>
  );
}
