import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

// Fresh module instance per test so the module-level cache doesn't leak between cases.
async function freshModule() {
  vi.resetModules();
  return import("./market-source.server");
}

const okJson = async (body: unknown) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  json: async () => body,
});

const COINGECKO_BODY = {
  bitcoin: { usd: 68000, usd_24h_change: 1.5, last_updated_at: 1_795_097_450 },
  ethereum: { usd: 3500, usd_24h_change: -0.5, last_updated_at: 1_795_097_478 },
};

const GOLD_BODY = {
  currency: "USD",
  name: "Gold",
  price: 4103.8,
  symbol: "XAU",
  updatedAt: "2026-11-19T14:12:03Z",
};

beforeEach(() => {
  fetchMock.mockReset();
  process.env.COINGECKO_DEMO_API_KEY = "";
  process.env.GOLD_API_KEY = "";
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getMarketSnapshot", () => {
  it("fetches both sources and returns parsed quotes", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("coingecko") ? okJson(COINGECKO_BODY) : okJson(GOLD_BODY),
    );
    const { getMarketSnapshot } = await freshModule();

    const snap = await getMarketSnapshot();
    expect(snap.quotes.BTC?.priceUsd).toBe(68000);
    expect(snap.quotes.ETH?.priceUsd).toBe(3500);
    expect(snap.quotes.XAU?.priceUsd).toBe(4103.8);
    expect(snap.errors).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("caches the snapshot and refetches only after the TTL", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("coingecko") ? okJson(COINGECKO_BODY) : okJson(GOLD_BODY),
    );
    const { getMarketSnapshot } = await freshModule();

    await getMarketSnapshot();
    await getMarketSnapshot();
    await getMarketSnapshot();
    expect(fetchMock).toHaveBeenCalledTimes(2); // once per source, once total
  });

  it("sends the API key headers when env keys are set", async () => {
    process.env.COINGECKO_DEMO_API_KEY = "cg-key";
    process.env.GOLD_API_KEY = "gold-key";
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("coingecko") ? okJson(COINGECKO_BODY) : okJson(GOLD_BODY),
    );
    const { getMarketSnapshot } = await freshModule();

    await getMarketSnapshot();
    const calls = fetchMock.mock.calls as [string, { headers: Record<string, string> }][];
    const cg = calls.find((c) => c[0].includes("coingecko"))!;
    const gold = calls.find((c) => c[0].includes("gold-api"))!;
    expect(cg[1].headers["x-cg-demo-api-key"]).toBe("cg-key");
    expect(gold[1].headers["x-api-key"]).toBe("gold-key");
  });

  it("reports a source failure without blocking the other source", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("coingecko")) throw new Error("network down");
      return okJson(GOLD_BODY);
    });
    const { getMarketSnapshot } = await freshModule();

    const snap = await getMarketSnapshot();
    expect(snap.quotes.XAU?.priceUsd).toBe(4103.8);
    expect(snap.quotes.BTC).toBeNull();
    expect(snap.errors).toHaveLength(1);
    expect(snap.errors[0]).toContain("CoinGecko");
  });

  it("reports a plain-language error when a source answers with garbage", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("coingecko") ? okJson({ unexpected: true }) : okJson(GOLD_BODY),
    );
    const { getMarketSnapshot } = await freshModule();

    const snap = await getMarketSnapshot();
    expect(snap.quotes.XAU).not.toBeNull();
    expect(snap.errors).toEqual([
      expect.stringContaining("CoinGecko did not return a usable Bitcoin or Ethereum price"),
    ]);
  });
});
