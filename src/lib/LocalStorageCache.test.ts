import { expect, describe, it, vi, beforeEach } from 'vitest'
import { LocalStorageCache } from './LocalStorageCache'

describe('LocalStorageCache', () => {
  let localStorageCache: LocalStorageCache

  beforeEach(() => {
    localStorageCache = new LocalStorageCache()
  })

  it('should get an item from the cache', () => {
    const key = 'key'
    const value = 'value'
    localStorageCache.setCache(key, value)
    const result = localStorageCache.getFromCache<string>(key)
    expect(result).toBe(value)
  })

  it('should remove an item from the cache if it is expired', () => {
    const key = 'key'
    const value = 'value'
    localStorageCache.setCache(key, value)
    vi.spyOn(Date, 'now').mockImplementationOnce(() => Date.now() + 60000)
    const result = localStorageCache.getFromCache<string>(key)
    expect(result).toBeNull()
  })
})
