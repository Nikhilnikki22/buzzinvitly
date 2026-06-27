/**
 * Simple in-memory cache for development
 * In production, use Redis or similar
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private cache: Map<string, CacheEntry<any>>
  private enabled: boolean

  constructor() {
    this.cache = new Map()
    this.enabled = process.env.ENABLE_CACHE === 'true'
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) return null

    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
    if (!this.enabled) return

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear()
  }

  /**
   * Get or set pattern
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetchFn()
    await this.set(key, data, ttlSeconds)
    return data
  }

  /**
   * Cleanup expired entries
   */
  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Singleton instance
export const cache = new Cache()

// Cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    cache['cleanup']()
  }, 5 * 60 * 1000)
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  templates: {
    all: () => 'templates:all',
    byCategory: (category: string) => `templates:category:${category}`,
    byId: (id: string) => `templates:id:${id}`,
  },
  events: {
    byUser: (userId: string) => `events:user:${userId}`,
    byId: (id: string) => `events:id:${id}`,
  },
  guests: {
    byEvent: (eventId: string) => `guests:event:${eventId}`,
  },
  user: {
    byId: (id: string) => `user:id:${id}`,
    byEmail: (email: string) => `user:email:${email}`,
  },
}

/**
 * Cache TTL constants (in seconds)
 */
export const cacheTTL = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
}
