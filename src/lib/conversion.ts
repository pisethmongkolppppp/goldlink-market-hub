export const TROY_OUNCE_GRAMS = 31.1034768;

export interface GoldConversionInput {
  /** Amount of cryptocurrency, e.g. 0.5 BTC. */
  amount: number;
  /** Price of one unit of that cryptocurrency in US dollars. */
  cryptoPriceUsd: number;
  /** Price of one gram of gold in US dollars. */
  goldPricePerGramUsd: number;
}

export interface GoldConversionResult {
  /** Crypto amount × crypto price. */
  usdValue: number;
  /** (Crypto amount × crypto price) ÷ gold price per gram. */
  grams: number;
  /** Gold grams ÷ 31.1034768. */
  troyOunces: number;
}

/**
 * Converts a crypto amount into an equivalent weight of gold.
 *
 * gold grams = (crypto amount × crypto price in USD) ÷ gold price per gram in USD
 * troy ounces = gold grams ÷ 31.1034768
 *
 * Returns null when any input is missing, zero, negative or not a number.
 */
export function convertCryptoToGold(input: GoldConversionInput): GoldConversionResult | null {
  const { amount, cryptoPriceUsd, goldPricePerGramUsd } = input;
  if (![amount, cryptoPriceUsd, goldPricePerGramUsd].every((n) => Number.isFinite(n) && n > 0)) {
    return null;
  }
  const usdValue = amount * cryptoPriceUsd;
  const grams = usdValue / goldPricePerGramUsd;
  return { usdValue, grams, troyOunces: grams / TROY_OUNCE_GRAMS };
}
