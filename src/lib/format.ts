export const formatUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const formatAmount = (n: number, digits = 6) =>
  n.toLocaleString("en-US", { maximumFractionDigits: digits });
