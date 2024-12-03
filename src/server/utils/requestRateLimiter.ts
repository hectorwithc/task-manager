import { upstashRateLimiter } from "../upstash/upstashRateLimiter";

export async function requestRateLimiter(identifier: string) {
  const { success } = await upstashRateLimiter.limit(identifier);

  return { success };
}
