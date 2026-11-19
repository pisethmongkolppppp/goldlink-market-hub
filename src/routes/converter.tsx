import { useMarketPrices } from "@/hooks/use-market-snapshot";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Calculator, Eraser, RefreshCw } from "lucide-react";
import { useState, type FormEvent } from "react";

import { PageHeader, Section } from "@/components/site/PageHeader";
import { AssetIcon } from "@/components/site/PriceTile";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { convertCryptoToGold, TROY_OUNCE_GRAMS, type GoldConversionResult } from "@/lib/conversion";
import {
  DEMO_CRYPTOS,
  type CryptoSymbol,
} from "@/lib/demo-prices";
import { formatAmount, formatUsd } from "@/lib/format";

export const Route = createFileRoute("/converter")({
  head: () => ({
    meta: [
      { title: "Crypto to Gold Converter — GoldLink AI" },
      { name: "description", content: "Turn Bitcoin or Ethereum into an equal weight of gold, in grams and troy ounces, using market quotes or clearly labelled demonstration prices." },
      { property: "og:title", content: "Crypto to Gold Converter — GoldLink AI" },
      { property: "og:description", content: "Convert Bitcoin or Ethereum into gold, shown in grams and troy ounces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConverterPage,
});

const toNum = (s: string) => (s.trim() === "" ? NaN : Number(s));

type Converted = { coin: CryptoSymbol; amount: number; conversion: GoldConversionResult; cryptoPrice: number; goldGram: number; source: string };

function ConverterPage() {
  const market = useMarketPrices();
  const [coin, setCoin] = useState<CryptoSymbol>("BTC");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Converted | null>(null);

  const cryptoPrice = market.price(coin).usd;
  const goldOz = market.price("XAU").usd;
  const goldGram = goldOz / TROY_OUNCE_GRAMS;
  const live = !!market.price(coin).quote && !!market.price("XAU").quote;
  const coinLabel = DEMO_CRYPTOS.find((c) => c.value === coin)!.label;

  const convert = (e: FormEvent) => {
    e.preventDefault();
    const value = toNum(amount);
    const conversion = convertCryptoToGold({
      amount: value,
      cryptoPriceUsd: cryptoPrice,
      goldPricePerGramUsd: goldGram,
    });
    if (!conversion) {
      setResult(null);
      setError("Enter an amount of Bitcoin or Ethereum greater than zero.");
      return;
    }
    setError(null);
    setResult({ coin, amount: value, conversion, cryptoPrice, goldGram, source: `${market.label(coin)}; gold: ${market.label("XAU")}` });
  };

  const clear = () => {
    setCoin("BTC");
    setAmount("");
    setError(null);
    setResult(null);
  };

  const stale = result !== null && (result.coin !== coin || toNum(amount) !== result.amount || result.cryptoPrice !== cryptoPrice || result.goldGram !== goldGram);

  return (
    <>
      <PageHeader
        eyebrow="Converter"
        title={<>Turn crypto into <span className="text-gradient-gold italic">gold</span> terms.</>}
        description="Choose Bitcoin or Ethereum, enter an amount, and see the equal weight of gold in grams and troy ounces. Market quotes are used when available; missing quotes use clearly labelled demonstration values."
      >
        <StatusBadge tone="demo">{live ? "Market quotes" : "Includes demonstration prices"}</StatusBadge>
      </PageHeader>

      <Section className="grid gap-6 py-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="panel p-6 sm:p-8">
          <form className="space-y-6" onSubmit={convert} noValidate>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-muted-foreground">1. Choose a cryptocurrency</legend>
              <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Cryptocurrency">
                {DEMO_CRYPTOS.map((c) => {
                  const active = c.value === coin;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCoin(c.value)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                        active
                          ? "border-primary/60 bg-primary/10 shadow-gold"
                          : "border-border bg-background/40 hover:border-primary/30",
                      )}
                    >
                      <AssetIcon asset={c.value === "BTC" ? "btc" : "eth"} />
                      <span>
                        <span className="block text-sm font-medium">{c.label}</span>
                        <span className="block text-xs text-muted-foreground">{market.status(c.value)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-muted-foreground">2. Enter an amount</legend>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="crypto-amount">Amount of {coinLabel}</Label>
                  <Input
                    id="crypto-amount"
                    className="tabular h-12 text-lg"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    placeholder="e.g. 0.5"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="h-12 px-6 text-base">
                    <RefreshCw className="size-4" aria-hidden />
                    Convert
                  </Button>
                  <Button type="button" variant="outline" className="h-12 px-5 text-base" onClick={clear}>
                    <Eraser className="size-4" aria-hidden />
                    Clear
                  </Button>
                </div>
              </div>
              {error && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </fieldset>

            <div className="flex justify-center" aria-hidden>
              <span className="grid size-10 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <ArrowDown className="size-4" />
              </span>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-muted-foreground">3. Gold equivalent</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-primary/30 bg-background/40 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Grams of gold</p>
                  <p className="tabular mt-2 text-3xl font-medium text-gradient-gold sm:text-4xl" aria-live="polite">
                    {result ? formatAmount(result.conversion.grams, 4) : "—"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">g</p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-background/40 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Troy ounces of gold</p>
                  <p className="tabular mt-2 text-3xl font-medium text-gradient-gold sm:text-4xl" aria-live="polite">
                    {result ? formatAmount(result.conversion.troyOunces, 4) : "—"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">oz t</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {result
                  ? `${formatAmount(result.amount, 8)} ${result.coin} is worth ${formatUsd(result.conversion.usdValue)} using the prices captured at conversion. ${result.source}`
                  : "Enter an amount and press Convert to see the gold equivalent."}
              </p>
              {stale && (
                <p className="text-xs text-primary">
                  You changed the inputs — press Convert again to update the result.
                </p>
              )}
            </fieldset>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium">Prices used</h2>
              <StatusBadge tone={live ? "pending" : "demo"}>{live ? "Market quotes" : "Demo fallback"}</StatusBadge>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">{coinLabel}</dt>
                <dd className="tabular font-medium">{formatUsd(cryptoPrice)} each</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Gold per gram</dt>
                <dd className="tabular font-medium">{formatUsd(goldGram)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Gold per troy ounce</dt>
                <dd className="tabular font-medium">{formatUsd(goldOz)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-border/60 pt-3">
                <dt className="text-muted-foreground">Grams per troy ounce</dt>
                <dd className="tabular font-medium">{TROY_OUNCE_GRAMS}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {market.label(coin)}. {market.label("XAU")}. No real cryptocurrency or gold is bought, sold or moved.
            </p>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <Calculator className="size-5 text-primary" />
              <h2 className="text-lg font-medium">How it's calculated</h2>
            </div>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="text-foreground">1.</span> Amount × {coinLabel} price = value in US dollars.
              </li>
              <li>
                <span className="text-foreground">2.</span> Dollar value ÷ gold price per gram = grams of gold.
              </li>
              <li>
                <span className="text-foreground">3.</span> Grams ÷ {TROY_OUNCE_GRAMS} = troy ounces.
              </li>
            </ol>
            <p className="mt-5 rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
              This is an estimate for learning only. Real trades include fees and price differences between sellers.
            </p>
          </div>
        </aside>
      </Section>
    </>
  );
}
