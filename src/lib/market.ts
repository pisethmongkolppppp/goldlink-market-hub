import { TROY_OUNCE_GRAMS } from "./conversion";

/**
 * Client-safe market data types and parsers.
 *
 * Live prices come from two free public sources:
 * - CoinGecko for Bitcoin and Ethereum
 * - Gold-API.com for gold (XAU, priced per troy ounce)
 * Every price shown in the app must carry its source and update time.
 */

export type MarketSymbol = "BTC" | "ETH" | "XAU";
export type MarketSourceId = "coingecko" | "gold-api";

export const MARKET_SOURCES: Record<MarketSourceId, { name: string; url: string }> = {
  coingecko: { name: "CoinGecko", url: "https://www.coingecko.com" },
  "gold-api": { name: "Gold-API.com", url: "https://gold-api.com" },
};

export const SOURCE_FOR: Record<MarketSymbol, MarketSourceId> = {
  BTC: "coingecko",
  ETH: "coingecko",
  XAU: "gold-api",
};

export type AssetQuote = {
  symbol: MarketSymbol;
  /** USD per coin for BTC/ETH, USD per troy ounce for XAU. */
  priceUsd: number;
  change24hPct: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  /** ISO timestamp the source says the price was last updated. */
  updatedAt: string;
  source: MarketSourceId;
};

export type MarketSnapshot = {
  quotes: Record<MarketSymbol, AssetQuote | null>;
  /** Plain-language problems, one per source that failed. */
  errors: string[];
  fetchedAt: string;
};

const isPositive = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;
const finiteOrNull = (n: unknown): number | null => (typeof n === "number" && Number.isFinite(n) ? n : null);

type CoinGeckoEntry = {
  usd?: unknown;
  usd_24h_change?: unknown;
  usd_market_cap?: unknown;
  usd_24h_vol?: unknown;
  last_updated_at?: unknown;
};

function parseCoinGeckoEntry(entry: CoinGeckoEntry | undefined, symbol: "BTC" | "ETH"): AssetQuote | null {
  if (!entry || !isPositive(entry.usd) || !isPositive(entry.last_updated_at)) return null;
  return {
    symbol,
    priceUsd: entry.usd,
    change24hPct: finiteOrNull(entry.usd_24h_change),
    marketCapUsd: finiteOrNull(entry.usd_market_cap),
    volume24hUsd: finiteOrNull(entry.usd_24h_vol),
    updatedAt: new Date(entry.last_updated_at * 1000).toISOString(),
    source: "coingecko",
  };
}

/** Parses CoinGecko's /simple/price response. Missing or malformed coins become null. */
export function parseCoinGecko(json: unknown): { BTC: AssetQuote | null; ETH: AssetQuote | null } {
  const data = (json && typeof json === "object" ? json : {}) as Record<string, CoinGeckoEntry | undefined>;
  return {
    BTC: parseCoinGeckoEntry(data["bitcoin"], "BTC"),
    ETH: parseCoinGeckoEntry(data["ethereum"], "ETH"),
  };
}

/** Parses Gold-API.com's /price/XAU response (USD per troy ounce). */
export function parseGoldApi(json: unknown): AssetQuote | null {
  if (!json || typeof json !== "object") return null;
  const d = json as { price?: unknown; symbol?: unknown; currency?: unknown; updatedAt?: unknown };
  if (d.symbol !== "XAU" || (d.currency !== undefined && d.currency !== "USD")) return null;
  if (!isPositive(d.price) || typeof d.updatedAt !== "string") return null;
  const t = Date.parse(d.updatedAt);
  if (Number.isNaN(t)) return null;
  return {
    symbol: "XAU",
    priceUsd: d.price,
    change24hPct: null,
    marketCapUsd: null,
    volume24hUsd: null,
    updatedAt: new Date(t).toISOString(),
    source: "gold-api",
  };
}

export const goldPerGram = (perOz: number) => perOz / TROY_OUNCE_GRAMS;

/** "19 Nov 2026, 14:12 UTC" — fixed to UTC so server and browser render the same text. */
export function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown time";
  const text = d.toLocaleString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${text} UTC`;
}

/** A price used in a calculation: live (with its quote) or a labelled demonstration fallback. */
export type PriceUsed = { usd: number; quote: AssetQuote | null };

export const pickPrice = (quote: AssetQuote | null, demoUsd: number): PriceUsed =>
  quote ? { usd: quote.priceUsd, quote } : { usd: demoUsd, quote: null };
