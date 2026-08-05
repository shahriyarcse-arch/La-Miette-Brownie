/**
 * La Miette — Redis Ultra-Fast Caching & Rate Limiting Engine
 * Uses Upstash Redis with In-Memory fallback for 0-ms caching
 */

import { Redis } from "@upstash/redis";

// Simple in-memory Cache fallback for local development
const inMemoryCache = new Map<string, { data: unknown; expiresAt: number }>();

export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Get cached item from Redis or In-Memory Store
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (redis) {
      const data = await redis.get<T>(key);
      return data;
    }
  } catch (err) {
    console.warn("Redis read error, falling back to memory:", err);
  }

  // Fallback to In-Memory Map
  const cached = inMemoryCache.get(key);
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      return cached.data as T;
    }
    inMemoryCache.delete(key);
  }
  return null;
}

/**
 * Set item in Redis or In-Memory Store with Time-To-Live (TTL in seconds)
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300
): Promise<void> {
  try {
    if (redis) {
      // The Upstash client serializes objects automatically on set and
      // deserializes them on get, so the raw value must be passed directly.
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    }
  } catch (err) {
    console.warn("Redis write error, using memory fallback:", err);
  }

  // Fallback to In-Memory Map
  inMemoryCache.set(key, {
    data: value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Invalidate/Delete cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    if (redis) {
      await redis.del(key);
    }
  } catch {
    // silent
  }
  inMemoryCache.delete(key);
}
