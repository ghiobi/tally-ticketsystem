'use strict'

const USER_SOCKET_CACHE_PREFIX = 'usms_'

/**
 * A service mapping a user's id to their connected sockets.
 */
class UserSocketMapService {
  constructor(cache = use('Cache')) {
    this.cache = cache
  }

  /**
   * Adds a socket id to the map.
   *
   * @param id User id
   * @param socketId
   */
  add(id, socketId) {
    const prefixId = this.getId(id)

    const array = [...this.getCachedArray(prefixId), socketId]
    this.cache.set(prefixId, array)
  }

  /**
   * Get array of socket ids based on the user id.
   *
   * @param id
   * @returns {*}
   */
  get(id) {
    const prefixId = this.getId(id)

    return this.getCachedArray(prefixId)
  }

  /**
   * Removes the socket id from the map.
   *
   * @param id User id
   * @param socketId
   */
  remove(id, socketId) {
    const prefixId = this.getId(id)

    const array = this.getCachedArray(prefixId).filter((sId) => sId !== socketId)
    this.cache.set(prefixId, array)
  }

  /**
   * Getting the cached array.
   *
   * @private
   * @param prefixedId
   * @returns {Array}
   */
  getCachedArray(prefixedId) {
    return this.cache.get(prefixedId) || []
  }

  /**
   * Prefixing the cache key so that it is scoped from other cached items.
   *
   * @private
   * @param id
   * @returns {string}
   */
  getId(id) {
    return `${USER_SOCKET_CACHE_PREFIX}${id}`
  }
}

module.exports = UserSocketMapService
