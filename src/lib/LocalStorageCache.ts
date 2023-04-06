/**
 * I would not recommend doing caching like this in production environments,
 * but since github api has some limitations when not providing api keys
 * I've made some effort to improve the user experience on this sample,
 * without using any third party libraries.
 */

interface CacheItem<T> {
  value: T
  timestamp: number
}

export class LocalStorageCache {
  private readonly cache: Storage

  constructor() {
    this.cache = window.localStorage
  }

  // Get an item from the cache
  getFromCache<T>(key: string): T | null {
    // Parse the cached value from localStorage
    const cachedValue = JSON.parse(
      this.cache.getItem(key) || 'null',
    ) as CacheItem<T> | null
    // If the cached value exists and is less than 1 minute old, return it
    if (cachedValue && cachedValue.timestamp > Date.now() - 60000) {
      return cachedValue.value
    }
    // Otherwise, remove the item from the cache and return null
    this.cache.removeItem(key)
    return null
  }

  // Set an item in the cache
  setCache<T>(key: string, value: T): void {
    // Create a new CacheItem with the given value and current timestamp
    const cachedValue: CacheItem<T> = {
      value,
      timestamp: Date.now(),
    }
    // Stringify the CacheItem and set it in localStorage
    this.cache.setItem(key, JSON.stringify(cachedValue))
  }
}
