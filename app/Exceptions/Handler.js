'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {response}
   */
  async handle(error, { request, response, view }) {
    switch (error.name) {
      case 'InvalidSessionException':
        return response.redirect(
          `/organization/${request.organization.slug}/login`
        )
      case 'HttpException':
        if (error.status === 404) {
          return response.send(view.render('404'))
        }
    }

    response.status(error.status).send(error.message)
  }
}

module.exports = ExceptionHandler
