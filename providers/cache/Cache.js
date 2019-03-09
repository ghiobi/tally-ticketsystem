'use strict'

/**
 * Provides a central place for the application's cache.
 */
class Cache {
  /**
   *
   * @param cache Cache Strategy Engine
   */
  constructor(cache) {
    this.cache = cache
  }

  /**
   * Sets a value to be cached by key.
   *
   * @param key
   * @param value
   */
  set(key, value) {
    this.cache.set(key, value)
  }

  /**
   * Checks if cache has a value by key.
   *
   * @param key
   * @returns {*}
   */
  has(key) {
    return this.cache.has(key)
  }

  /**
   * Gets a value by key.
   *
   * @param key
   * @returns {*}
   */
  get(key) {
    return this.cache.get(key)
  }

  /**
   * Deletes a cache by key.
   * @param key
   */
  delete(key) {
    this.cache.delete(key)
  }
}

module.exports = Cache
