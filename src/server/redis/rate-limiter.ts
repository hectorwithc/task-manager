import redis from "./redis";

interface RateLimiterConfig {
  bucket: string;
  maxRequests: number;
  windowSizeInSeconds: number;
}

export class SlidingWindowRateLimiter {
  private bucket: string;
  private maxRequests: number;
  private windowSizeInSeconds: number;

  constructor(config: RateLimiterConfig) {
    this.bucket = config.bucket;
    this.maxRequests = config.maxRequests;
    this.windowSizeInSeconds = config.windowSizeInSeconds;
  }

  async isAllowed(
    identifier: string,
  ): Promise<{ allowed: boolean; retryAfterMs: number | null }> {
    const key = `rate_limiter:${this.bucket}:${identifier}`;
    const currentTimestamp = Date.now();
    const windowStartTimestamp =
      currentTimestamp - this.windowSizeInSeconds * 1000;

    // Remove old requests outside the sliding window
    await redis.zremrangebyscore(key, "-inf", windowStartTimestamp);

    // Count the number of requests in the window
    const requestsInWindow = await redis.zrangebyscore(
      key,
      windowStartTimestamp,
      currentTimestamp,
    );

    if (requestsInWindow.length >= this.maxRequests) {
      // Rate limit exceeded; calculate retry time
      const oldestRequestTimestamp = parseInt(requestsInWindow[0]!, 10);
      const retryAfterMs = Math.max(
        oldestRequestTimestamp +
          this.windowSizeInSeconds * 1000 -
          currentTimestamp,
        1,
      );
      return { allowed: false, retryAfterMs };
    }

    // Add the current request to the window
    await redis.zadd(key, currentTimestamp, currentTimestamp.toString());

    // Set expiration time for the key to the window size
    await redis.expire(key, this.windowSizeInSeconds);

    return { allowed: true, retryAfterMs: null };
  }
}
