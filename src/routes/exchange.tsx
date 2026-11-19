import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { useState, type FormEvent } from "react";

import { PageHeader, Section } from "@/components/site/PageHeader";
import { AssetIcon } from "@/components/site/PriceTile";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  createDemoPortfolio,
  DEMO_ASSETS,
  executeDemoOrder,
  type DemoAsset,
  type OrderSide,
} from "@/lib/exchange";
import { formatAmount, formatUsd } from "@/lib/format";

export const Route = createFileRoute("/exchange")({
  head: () => ({
    meta: [
      { title: "Simulated Exchange Demo — GoldLink AI" },
      { name: "description", content: "Practise buying and selling gold, Bitcoin and Ethereum with virtual money in a risk-free simulation." },
      { property: "og:title", content: "Simulated Exchange Demo — GoldLink AI" },
      { property: "og:description", content: "A risk-free practice exchange for gold and crypto, using virtual money." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExchangePage,
});

type HistoryRow = { id: number; side: OrderSide; asset: DemoAsset; quantity: number; price: number; total: number };

const ICON: Record<DemoAsset, "gold" | "btc" | "eth"> = { XAU: "gold", BTC: "btc", ETH: "eth" };
const toNum = (s: string) => (s.trim() === "" ? NaN : Number(s));

function ExchangePage() {
  const [portfolio, setPortfolio] = useState(createDemoPortfolio);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [side, setSide] = useState<OrderSide>("buy");
  const [asset, setAsset] = useState<DemoAsset>("XAU");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  const q = toNum(quantity);
  const p = toNum(price);
  const estimate = Number.isFinite(q) && Number.isFinite(p) && q > 0 && p > 0 ? q * p : null;
  const assetMeta = DEMO_ASSETS.find((a) => a.value === asset)!;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const res = executeDemoOrder(portfolio, { side, asset, quantity: q, price: p });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(null);
    setPortfolio(res.portfolio);
    setHistory((h) => [{ id: Date.now(), side, asset, quantity: q, price: p, total: res.total }, ...h]);
    setQuantity("");
  };

  const reset = () => {
    setPortfolio(createDemoPortfolio());
    setHistory([]);
    setError(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Exchange demo"
        title={<>Practise trading, <span className="text-gradient-gold italic">risk-free.</span></>}
        description="You start with a virtual balance. Choose an asset, set a pretend price, and see how buying and selling changes your portfolio."
      >
        <StatusBadge tone="demo">Simulation · virtual money only</StatusBadge>
      </PageHeader>

      <Section className="space-y-6 py-10">
        <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">This is not a real exchange.</span> No real money,
            accounts or market prices are used. Prices are whatever you type in.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium">Demo portfolio</h2>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw /> Reset
              </Button>
            </div>
            <div className="mt-5 rounded-xl border border-primary/30 bg-background/40 p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Virtual cash</p>
              <p className="tabular mt-1 text-3xl text-gradient-gold">{formatUsd(portfolio.usd)}</p>
            </div>
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {DEMO_ASSETS.map((a) => (
                <li key={a.value} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AssetIcon asset={ICON[a.value]} />
                    <div>
                      <p className="text-sm font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.value}</p>
                    </div>
                  </div>
                  <p className="tabular text-sm">
                    {formatAmount(portfolio.holdings[a.value])} <span className="text-muted-foreground">{a.unit}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="panel space-y-5 p-6">
            <h2 className="text-2xl font-medium">Place a demo order</h2>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Order side">
              {(["buy", "sell"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={side === s}
                  onClick={() => setSide(s)}
                  className={cn(
                    "rounded-md py-2 text-sm font-semibold capitalize transition-colors",
                    side === s
                      ? s === "buy"
                        ? "bg-success text-success-foreground"
                        : "bg-destructive text-destructive-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Asset</Label>
              <Select value={asset} onValueChange={(v) => setAsset(v as DemoAsset)}>
                <SelectTrigger className="h-11" aria-label="Asset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_ASSETS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label} ({a.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity ({assetMeta.unit})</Label>
                <Input id="qty" className="tabular h-11" type="number" min="0" step="any" placeholder="0.00" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Pretend price (USD per {assetMeta.unit})</Label>
                <Input id="price" className="tabular h-11" type="number" min="0" step="any" placeholder="Your choice" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Order total</span>
              <span className="tabular">{estimate !== null ? formatUsd(estimate) : "—"}</span>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" variant="gold" size="xl" className="w-full capitalize">
              {side} {assetMeta.label}
            </Button>
          </form>
        </div>

        <div className="panel p-6">
          <h2 className="text-2xl font-medium">Order history</h2>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No demo orders yet. Your trades will show up here.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-2 font-medium">Side</th>
                    <th className="py-2 font-medium">Asset</th>
                    <th className="py-2 text-right font-medium">Quantity</th>
                    <th className="py-2 text-right font-medium">Price</th>
                    <th className="py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td className={cn("py-3 font-semibold capitalize", h.side === "buy" ? "text-success" : "text-destructive")}>{h.side}</td>
                      <td className="py-3">{h.asset}</td>
                      <td className="tabular py-3 text-right">{formatAmount(h.quantity)}</td>
                      <td className="tabular py-3 text-right">{formatUsd(h.price)}</td>
                      <td className="tabular py-3 text-right">{formatUsd(h.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
