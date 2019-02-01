'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ForbiddenException extends LogicalException {
  constructor(message = 'User is not permitted to access this resource.') {
    super(message, 403, 'FORBIDDEN_EXCEPTION')
  }

  /**
   * Handle this exception by itself
   */
  handle(error, { response, view }) {
    return response.send(view.render('403', { error }))
  }
}

module.exports = ForbiddenException
