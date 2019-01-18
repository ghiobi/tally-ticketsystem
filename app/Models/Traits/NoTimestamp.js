'use strict'

class NoTimestamp {
  register(Model) {
    Object.defineProperty(Model, 'createdAtColumn', {
      get: function() {
        return null
      }
    })
    Object.defineProperty(Model, 'updatedAtColumn', {
      get: function() {
        return null
      }
    })
  }
}

module.exports = NoTimestamp
