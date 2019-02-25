'use strict'

/**
 * System event notification.
 */
class SystemMessage {
  constructor(message) {
    this.message = message
  }

  get via() {
    return ['broadcast']
  }

  get type() {
    return 'message'
  }

  toJSON() {
    return {
      message: this.message
    }
  }
}

module.exports = SystemMessage
