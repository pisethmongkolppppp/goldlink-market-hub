import { createServerFn } from "@tanstack/react-start";

import { getMarketSnapshot } from "./market-source.server";

/**
 * Runs on the server only: the browser calls this function and the fetches,
 * cache and API keys stay server-side.
 */
export const fetchMarketSnapshot = createServerFn({ method: "GET" }).handler(() =>
  getMarketSnapshot(),
);
