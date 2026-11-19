import { useQuery } from "@tanstack/react-query";

import { fetchMarketSnapshot } from "@/lib/market-queries";

/**
 * Shared live market snapshot for the price dashboards.
 * Refreshes every minute; the server caches upstream sources for 30 seconds.
 */
export function useMarketSnapshot() {
  return useQuery({
    queryKey: ["market-snapshot"],
    queryFn: () => fetchMarketSnapshot(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useMarketPrices() {
  const query = useMarketSnapshot();
  const quotes = query.data?.quotes;
  const price = (symbol: MarketSymbol) => pickPrice(quotes?.[symbol] ?? null, symbol === "XAU" ? DEMO_GOLD_PRICE_PER_OZ_USD : demoCryptoPrice(symbol));
  const label = (symbol: MarketSymbol) => {
    const q = quotes?.[symbol];
    return q ? `${MARKET_SOURCES[q.source].name} · ${formatUpdatedAt(q.updatedAt)}` : query.isPending ? "Loading market data · demo value" : "Demo value · live quote unavailable";
  };
  const status = (symbol: MarketSymbol) => quotes?.[symbol] ? "Market quote" : "Demo";
  return { query, price, label, status };
}

import { pickPrice, MARKET_SOURCES, formatUpdatedAt, type MarketSymbol } from "@/lib/market";
import { DEMO_GOLD_PRICE_PER_OZ_USD, demoCryptoPrice } from "@/lib/demo-prices";
