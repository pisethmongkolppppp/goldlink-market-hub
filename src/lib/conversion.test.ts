import { describe, expect, it } from "vitest";
import { convertCryptoToGold, TROY_OUNCE_GRAMS } from "./conversion";
import { DEMO_GOLD_PRICE_PER_GRAM_USD, DEMO_GOLD_PRICE_PER_OZ_USD } from "./demo-prices";

describe("convertCryptoToGold", () => {
  it("applies (amount × crypto price) ÷ gold price per gram", () => {
    const r = convertCryptoToGold({ amount: 2, cryptoPriceUsd: 1000, goldPricePerGramUsd: 50 });
    expect(r?.usdValue).toBe(2000);
    expect(r?.grams).toBe(40);
  });

  it("converts grams to troy ounces using 31.1034768 grams per ounce", () => {
    const r = convertCryptoToGold({ amount: 1, cryptoPriceUsd: 100, goldPricePerGramUsd: 100 });
    expect(r?.grams).toBe(1);
    expect(r?.troyOunces).toBeCloseTo(1 / 31.1034768, 10);
  });

  it("works for a fractional crypto amount", () => {
    const r = convertCryptoToGold({ amount: 0.5, cryptoPriceUsd: 68000, goldPricePerGramUsd: 102.5 });
    expect(r?.usdValue).toBeCloseTo(34000, 6);
    expect(r?.grams).toBeCloseTo(34000 / 102.5, 6);
    expect(r?.troyOunces).toBeCloseTo(34000 / 102.5 / 31.1034768, 8);
  });

  it("returns nothing when the amount or a price is missing, zero or negative", () => {
    const ok = { amount: 1, cryptoPriceUsd: 100, goldPricePerGramUsd: 100 };
    expect(convertCryptoToGold({ ...ok, amount: Number.NaN })).toBeNull();
    expect(convertCryptoToGold({ ...ok, amount: 0 })).toBeNull();
    expect(convertCryptoToGold({ ...ok, amount: -2 })).toBeNull();
    expect(convertCryptoToGold({ ...ok, cryptoPriceUsd: 0 })).toBeNull();
    expect(convertCryptoToGold({ ...ok, goldPricePerGramUsd: Number.NaN })).toBeNull();
  });
});

describe("demonstration gold price", () => {
  it("derives the per-gram price from the per-ounce price with 31.1034768 grams per ounce", () => {
    expect(DEMO_GOLD_PRICE_PER_GRAM_USD).toBeCloseTo(DEMO_GOLD_PRICE_PER_OZ_USD / TROY_OUNCE_GRAMS, 10);
    expect(DEMO_GOLD_PRICE_PER_GRAM_USD).toBeGreaterThan(0);
  });
});
