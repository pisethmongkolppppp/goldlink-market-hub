import type { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";

export function PriceTile({
  label,
  symbol,
  icon,
  note = "Awaiting data source",
  value, status = "Not connected",
}: {
  label: string;
  symbol: string;
  icon?: ReactNode;
  note?: string;
  value?: string;
  status?: string;
}) {
  return (
    <div className="panel flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{symbol}</p>
          </div>
        </div>
      </div>
      <p className="tabular text-3xl font-medium text-foreground">
        {value ?? "— —"}
      </p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{note}</span>
        <StatusBadge tone={status === "Demo" ? "demo" : "pending"}>{status}</StatusBadge>
      </div>
    </div>
  );
}

export function AssetIcon({ asset }: { asset: "gold" | "btc" | "eth" }) {
  const map = {
    gold: { text: "Au", cls: "bg-gradient-gold text-primary-foreground" },
    btc: { text: "₿", cls: "bg-chart-btc/15 text-chart-btc border border-chart-btc/40" },
    eth: { text: "Ξ", cls: "bg-chart-eth/15 text-chart-eth border border-chart-eth/40" },
  }[asset];
  return (
    <span className={`grid size-10 place-items-center rounded-full font-display text-base font-semibold ${map.cls}`}>
      {map.text}
    </span>
  );
}
