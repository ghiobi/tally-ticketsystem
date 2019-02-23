'use strict'
const BaseValidator = require('./BaseValidator')

class StoreTicket extends BaseValidator {
  get rules() {
    return {
      title: 'required',
      body: 'required'
    }
  }

  get messages() {
    return {
      'title.required': 'Missing title.',
      'body.required': 'Missing body.'
    }
  }

  get validateAll() {
    return true
  }
}

module.exports = StoreTicket
