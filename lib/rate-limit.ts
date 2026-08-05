/**
 * Mika & Co. — Rate Limiter & Anti-Spam Guard Engine
 * Prevents checkout spam and brute-force passcode attempts
 */

import { getCache, setCache } from "@/lib/redis";

export interface RateLimitResponse {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Rate limit requests per IP address / Client Identifier
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<RateLimitResponse> {
  const cacheKey = `rate_limit:${identifier}`;
  const currentHits = (await getCache<number>(cacheKey)) || 0;

  if (currentHits >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: windowSeconds,
    };
  }

  const newHits = currentHits + 1;
  await setCache(cacheKey, newHits, windowSeconds);

  return {
    allowed: true,
    remaining: limit - newHits,
    resetSeconds: windowSeconds,
  };
}
