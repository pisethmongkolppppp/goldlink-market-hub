/**
 * Deterministic, made-up curves used only to preview chart layouts.
 * These are NOT market data and must always be labelled as illustrative.
 */
export interface IllustrativePoint {
  label: string;
  gold: number;
  btc: number;
  eth: number;
}

export function illustrativeSeries(points = 40, seed = 1): IllustrativePoint[] {
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    return {
      label: `P${i + 1}`,
      gold: 100 + t * 8 + Math.sin(i / 3 + seed) * 1.6,
      btc: 100 + t * 22 + Math.sin(i / 2 + seed) * 7 + Math.cos(i / 5) * 4,
      eth: 100 + t * 14 + Math.sin(i / 2.4 + seed * 2) * 8 + Math.cos(i / 4) * 3,
    };
  });
}
