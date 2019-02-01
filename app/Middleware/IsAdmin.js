'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class IsAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth }, next) {
    if (!(await auth.user.hasRole('admin'))) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = IsAdmin
