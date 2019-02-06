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
  async handle(error, { request, response, view, auth }) {
    switch (error.name) {
      case 'InvalidSessionException':
        if (request.organization) {
          return response.redirect(
            `/organization/${request.organization.slug}/login`
          )
        }
        return response.redirect('/organization')
      case 'HttpException':
        if (error.status === 404) {
          return response.status(404).send(view.render('404'))
        }
        if (error.message.indexOf('E_GUEST_ONLY') > -1) {
          const organization = await auth.user.organization().fetch()
          return response.redirect(`/organization/${organization.slug}`)
        }
    }

    /**
     * Exception Handler swallowing errors logs.
     *
     * eslint-disable no-console
     */
    console.error(error)
    super.handle(...arguments)
  }
}

module.exports = ExceptionHandler
