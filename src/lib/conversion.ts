export const TROY_OUNCE_GRAMS = 31.1034768;

export type GoldUnit = "oz" | "g" | "kg";

export const GOLD_UNITS: { value: GoldUnit; label: string; short: string }[] = [
  { value: "oz", label: "Troy ounces", short: "oz t" },
  { value: "g", label: "Grams", short: "g" },
  { value: "kg", label: "Kilograms", short: "kg" },
];

const OUNCES_PER_UNIT: Record<GoldUnit, number> = {
  oz: 1,
  g: 1 / TROY_OUNCE_GRAMS,
  kg: 1000 / TROY_OUNCE_GRAMS,
};

export interface ConversionInput {
  amount: number;
  cryptoPriceUsd: number;
  goldPricePerOzUsd: number;
  unit: GoldUnit;
}

export interface ConversionResult {
  usdValue: number;
  goldAmount: number;
}

/** Converts a crypto amount into an equivalent weight of gold using user-supplied prices. */
export function convertCryptoToGold(input: ConversionInput): ConversionResult | null {
  const { amount, cryptoPriceUsd, goldPricePerOzUsd, unit } = input;
  if (![amount, cryptoPriceUsd, goldPricePerOzUsd].every((n) => Number.isFinite(n) && n > 0)) {
    return null;
  }
  const usdValue = amount * cryptoPriceUsd;
  const ounces = usdValue / goldPricePerOzUsd;
  return { usdValue, goldAmount: ounces / OUNCES_PER_UNIT[unit] };
}
