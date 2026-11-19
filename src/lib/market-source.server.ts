import {
  MARKET_SOURCES,
  parseCoinGecko,
  parseGoldApi,
  type AssetQuote,
  type MarketSnapshot,
} from "./market";

/**
 * Server-side market data fetching.
 *
 * CoinGecko provides Bitcoin and Ethereum; Gold-API.com provides gold (XAU).
 * Both are read through the parsers in ./market.ts. The API keys below are
 * optional: both free price endpoints work without one, but keys are honoured
 * when present and never leave the server.
 */

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd" +
  "&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&include_last_updated_at=true";
const GOLD_API_URL = "https://api.gold-api.com/price/XAU";

// Gold-API.com updates every 30 seconds and asks consumers to cache that long;
// CoinGecko's free tier tolerates a similar cadence.
const CACHE_TTL_MS = 30_000;
const FETCH_TIMEOUT_MS = 10_000;

let cached: { snapshot: MarketSnapshot; at: number } | null = null;
let inFlight: Promise<MarketSnapshot> | null = null;

async function fetchJson(url: string, headers: Record<string, string>): Promise<unknown> {
  const response = await fetch(url, {
    headers: { accept: "application/json", ...headers },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`responded ${response.status} ${response.statusText}`.trim());
  }
  return response.json();
}

async function fetchCoinGeckoQuotes(): Promise<{
  BTC: AssetQuote | null;
  ETH: AssetQuote | null;
}> {
  const apiKey = process.env.COINGECKO_DEMO_API_KEY;
  const json = await fetchJson(COINGECKO_URL, apiKey ? { "x-cg-demo-api-key": apiKey } : {});
  return parseCoinGecko(json);
}

async function fetchGoldQuote(): Promise<AssetQuote | null> {
  const apiKey = process.env.GOLD_API_KEY;
  const json = await fetchJson(GOLD_API_URL, apiKey ? { "x-api-key": apiKey } : {});
  return parseGoldApi(json);
}

function describe(reason: unknown): string {
  return reason instanceof Error ? reason.message : "unknown error";
}

/** Fetches both sources independently; a failure in one never blocks the other. */
export async function fetchSnapshot(): Promise<MarketSnapshot> {
  const [coingecko, goldApi] = await Promise.allSettled([
    fetchCoinGeckoQuotes(),
    fetchGoldQuote(),
  ]);

  const errors: string[] = [];
  let btc: AssetQuote | null = null;
  let eth: AssetQuote | null = null;
  if (coingecko.status === "fulfilled") {
    btc = coingecko.value.BTC;
    eth = coingecko.value.ETH;
    if (!btc || !eth) {
      errors.push(`${MARKET_SOURCES.coingecko.name} did not return a usable Bitcoin or Ethereum price.`);
    }
  } else {
    errors.push(`${MARKET_SOURCES.coingecko.name} is unreachable right now (${describe(coingecko.reason)}).`);
  }

  let xau: AssetQuote | null = null;
  if (goldApi.status === "fulfilled") {
    xau = goldApi.value;
    if (!xau) {
      errors.push(`${MARKET_SOURCES["gold-api"].name} did not return a usable gold price.`);
    }
  } else {
    errors.push(`${MARKET_SOURCES["gold-api"].name} is unreachable right now (${describe(goldApi.reason)}).`);
  }

  return { quotes: { BTC: btc, ETH: eth, XAU: xau }, errors, fetchedAt: new Date().toISOString() };
}

/**
 * Snapshot with a shared 30-second cache and in-flight deduplication, so any
 * number of visitors triggers at most one request per source per interval.
 */
export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.snapshot;
  if (!inFlight) {
    inFlight = fetchSnapshot()
      .then((snapshot) => {
        cached = { snapshot, at: Date.now() };
        return snapshot;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}
