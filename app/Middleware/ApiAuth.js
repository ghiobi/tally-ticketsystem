'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Organization = use('App/Models/Organization')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class ApiAuth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    const token = request.input('token')
    const organization = await Organization.query()
      .where('slug', request.params['organization'])
      .first()

    if (!token || !organization.api_token || organization.api_token !== token) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = ApiAuth
