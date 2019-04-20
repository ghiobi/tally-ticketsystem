'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

/**
 * This class handles exceptions to prevents API usage without a valid API token
 *
 * @class ForbiddenException
 */
class ForbiddenExceptionApi extends LogicalException {
  constructor(message = 'Access denied. Please ensure that you have the right API token.') {
    super(message, 403, 'FORBIDDEN_EXCEPTION')
  }

  /**
   * Handle this exception by itself
   */
  handle(error, { response }) {
    return response.status(403).send(error.message)
  }
}

module.exports = ForbiddenExceptionApi
