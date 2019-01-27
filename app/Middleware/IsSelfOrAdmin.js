'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsSelfOrAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth, params }, next) {
    if (
      +params.userId !== auth.user.id &&
      !(await auth.user.hasRole('admin'))
    ) {
      return response.redirect('/403')
    }

    await next()
  }
}

module.exports = IsSelfOrAdmin
