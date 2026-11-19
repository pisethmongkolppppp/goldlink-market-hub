import { describe, expect, it } from "vitest";

import { formatUpdatedAt, goldPerGram, parseCoinGecko, parseGoldApi, pickPrice } from "./market";

describe("parseCoinGecko", () => {
  it("reads price, change, market cap, volume and update time for BTC and ETH", () => {
    const res = parseCoinGecko({
      bitcoin: { usd: 63884, usd_24h_change: 0.5, usd_market_cap: 1.2e12, usd_24h_vol: 3e10, last_updated_at: 1795097450 },
      ethereum: { usd: 1809.76, last_updated_at: 1795097478 },
    });
    expect(res.BTC).toMatchObject({ priceUsd: 63884, change24hPct: 0.5, marketCapUsd: 1.2e12, volume24hUsd: 3e10, source: "coingecko" });
    expect(res.BTC?.updatedAt).toBe(new Date(1795097450 * 1000).toISOString());
    expect(res.ETH).toMatchObject({ priceUsd: 1809.76, change24hPct: null, marketCapUsd: null });
  });

  it("returns null for a coin without a usable price or update time", () => {
    const res = parseCoinGecko({ bitcoin: { usd: 0, last_updated_at: 1 }, ethereum: { usd: 100 } });
    expect(res.BTC).toBeNull();
    expect(res.ETH).toBeNull();
    expect(parseCoinGecko(null)).toEqual({ BTC: null, ETH: null });
  });
});

describe("parseGoldApi", () => {
  it("reads the gold price per troy ounce with its update time", () => {
    const q = parseGoldApi({ currency: "USD", name: "Gold", price: 3713.75, symbol: "XAU", updatedAt: "2026-11-19T14:12:03Z" });
    expect(q).toMatchObject({ symbol: "XAU", priceUsd: 3713.75, source: "gold-api", updatedAt: "2026-11-19T14:12:03.000Z" });
  });

  it("rejects responses that are not a USD gold price", () => {
    expect(parseGoldApi({ symbol: "XAG", price: 30, updatedAt: "2026-11-19T14:12:03Z" })).toBeNull();
    expect(parseGoldApi({ symbol: "XAU", currency: "EUR", price: 3000, updatedAt: "2026-11-19T14:12:03Z" })).toBeNull();
    expect(parseGoldApi({ symbol: "XAU", price: 3000 })).toBeNull();
  });
});

describe("price labelling helpers", () => {
  it("formats the update time in UTC", () => {
    expect(formatUpdatedAt("2026-11-19T14:12:03Z")).toBe("19 Nov 2026, 14:12 UTC");
  });

  it("derives gold per gram using 31.1034768 g per troy ounce", () => {
    expect(goldPerGram(3110.34768)).toBeCloseTo(100, 10);
  });

  it("uses the live price when available and falls back to the demonstration price otherwise", () => {
    const quote = parseGoldApi({ symbol: "XAU", price: 3713.75, updatedAt: "2026-11-19T14:12:03Z" });
    expect(pickPrice(quote, 3188)).toEqual({ usd: 3713.75, quote });
    expect(pickPrice(null, 3188)).toEqual({ usd: 3188, quote: null });
  });
});
