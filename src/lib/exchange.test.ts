import { describe, expect, it } from "vitest";
import { createDemoPortfolio, executeDemoOrder } from "./exchange";

describe("executeDemoOrder", () => {
  it("starts with 10,000 virtual dollars", () => {
    expect(createDemoPortfolio().usd).toBe(10_000);
  });

  it("blocks buys larger than the demo balance", () => {
    const r = executeDemoOrder(createDemoPortfolio(), { side: "buy", asset: "BTC", quantity: 1, price: 10_001 });
    expect(r.ok).toBe(false);
  });

  it("blocks selling more than you hold", () => {
    const r = executeDemoOrder(createDemoPortfolio(), { side: "sell", asset: "ETH", quantity: 1, price: 10 });
    expect(r.ok).toBe(false);
  });

  it("moves cash into holdings on a buy", () => {
    const r = executeDemoOrder(createDemoPortfolio(), { side: "buy", asset: "XAU", quantity: 2, price: 1000 });
    expect(r.ok && r.portfolio.usd).toBe(8000);
    expect(r.ok && r.portfolio.holdings.XAU).toBe(2);
  });
});
