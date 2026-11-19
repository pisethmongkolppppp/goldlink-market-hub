import { describe, expect, it } from "vitest";
import { convertCryptoToGold } from "./conversion";

describe("convertCryptoToGold", () => {
  it("converts value to troy ounces using the entered prices", () => {
    const r = convertCryptoToGold({ amount: 2, cryptoPriceUsd: 1000, goldPricePerOzUsd: 500, unit: "oz" });
    expect(r?.usdValue).toBe(2000);
    expect(r?.goldAmount).toBe(4);
  });

  it("uses 31.1034768 grams per troy ounce", () => {
    const r = convertCryptoToGold({ amount: 1, cryptoPriceUsd: 100, goldPricePerOzUsd: 100, unit: "g" });
    expect(r?.goldAmount).toBeCloseTo(31.1034768, 6);
  });

  it("returns nothing when a price is missing", () => {
    expect(convertCryptoToGold({ amount: 1, cryptoPriceUsd: NaN, goldPricePerOzUsd: 100, unit: "oz" })).toBeNull();
  });
});
