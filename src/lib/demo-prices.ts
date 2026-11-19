import { TROY_OUNCE_GRAMS } from "./conversion";

/**
 * Clearly labelled demonstration prices.
 *
 * These are fixed placeholder values used only to make the converter's maths work.
 * No market data source is connected, so these must never be presented as live prices.
 */

export type CryptoSymbol = "BTC" | "ETH";

export const DEMO_PRICE_NOTE = "Demonstration prices — not live market data";

export const DEMO_CRYPTOS: { value: CryptoSymbol; label: string; priceUsd: number }[] = [
  { value: "BTC", label: "Bitcoin (BTC)", priceUsd: 68_000 },
  { value: "ETH", label: "Ethereum (ETH)", priceUsd: 3_500 },
];

/** Gold is quoted per troy ounce; the per-gram figure is derived from it. */
export const DEMO_GOLD_PRICE_PER_OZ_USD = 3_188;

export const DEMO_GOLD_PRICE_PER_GRAM_USD = DEMO_GOLD_PRICE_PER_OZ_USD / TROY_OUNCE_GRAMS;

export const demoCryptoPrice = (symbol: CryptoSymbol): number =>
  DEMO_CRYPTOS.find((c) => c.value === symbol)!.priceUsd;
