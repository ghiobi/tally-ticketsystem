'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class WithinOrganization {
  /**
   * Checks if a user is authenticated within an organization.
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Request} ctx.auth
   * @param {Function} next
   */
  async handle({ request, auth }, next) {
    const { organization } = request

    if (auth.user && auth.user.organization_id !== organization.id) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = WithinOrganization
