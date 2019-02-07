'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

/**
 * This class handles internal server error exceptions
 *
 * @class InternalServerErrorException
 */
class InternalServerErrorException extends LogicalException {
  constructor(message = 'User is not permitted to access this resource.') {
    super(message, 501, 'INTERNAL_SERVER_ERROR_EXCEPTION')
  }

  /**
   * Handle this exception by itself
   */
  handle(error, { response, view }) {
    return response.status(501).send(view.render('501', { error }))
  }
}

module.exports = InternalServerErrorException
