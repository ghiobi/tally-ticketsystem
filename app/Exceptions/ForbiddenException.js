'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

/**
 * This class handles exceptions to not let users enter a resource.
 *
 * @class ForbiddenException
 */
class ForbiddenException extends LogicalException {
  constructor(message = 'User is not permitted to access this resource.') {
    super(message, 403, 'FORBIDDEN_EXCEPTION')
  }

  /**
   * Handle this exception by itself
   */
  handle(error, { response, view }) {
    return response.status(403).send(view.render('403', { error }))
  }
}

module.exports = ForbiddenException
