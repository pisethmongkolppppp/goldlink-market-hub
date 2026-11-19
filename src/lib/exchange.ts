export type DemoAsset = "XAU" | "BTC" | "ETH";
export type OrderSide = "buy" | "sell";

export const DEMO_STARTING_BALANCE = 10_000;

export const DEMO_ASSETS: { value: DemoAsset; label: string; unit: string }[] = [
  { value: "XAU", label: "Gold", unit: "oz t" },
  { value: "BTC", label: "Bitcoin", unit: "BTC" },
  { value: "ETH", label: "Ethereum", unit: "ETH" },
];

export interface DemoPortfolio {
  usd: number;
  holdings: Record<DemoAsset, number>;
}

export interface DemoOrder {
  side: OrderSide;
  asset: DemoAsset;
  quantity: number;
  price: number;
}

export type OrderResult =
  | { ok: true; portfolio: DemoPortfolio; total: number }
  | { ok: false; error: string };

export function createDemoPortfolio(): DemoPortfolio {
  return { usd: DEMO_STARTING_BALANCE, holdings: { XAU: 0, BTC: 0, ETH: 0 } };
}

const EPSILON = 1e-9;

/** Applies a simulated order to a virtual portfolio. No real funds or prices are involved. */
export function executeDemoOrder(portfolio: DemoPortfolio, order: DemoOrder): OrderResult {
  const { side, asset, quantity, price } = order;
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { ok: false, error: "Enter a quantity greater than zero." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "Enter a simulated price greater than zero." };
  }
  const total = quantity * price;
  if (side === "buy") {
    if (total > portfolio.usd + EPSILON) {
      return { ok: false, error: "Not enough demo balance for this order." };
    }
    return {
      ok: true,
      total,
      portfolio: {
        usd: portfolio.usd - total,
        holdings: { ...portfolio.holdings, [asset]: portfolio.holdings[asset] + quantity },
      },
    };
  }
  if (quantity > portfolio.holdings[asset] + EPSILON) {
    return { ok: false, error: "You don't hold enough of this asset to sell." };
  }
  return {
    ok: true,
    total,
    portfolio: {
      usd: portfolio.usd + total,
      holdings: { ...portfolio.holdings, [asset]: portfolio.holdings[asset] - quantity },
    },
  };
}
