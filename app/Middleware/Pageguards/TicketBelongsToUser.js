'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { HttpException } = require('@adonisjs/generic-exceptions')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class TicketBelongsToUser {
  /**
   * @param {Response} ctx.reponse
   * @param {auth}
   * @param {Parameters} ctx.params
   * @param {Function} next
   */
  async handle(
    {
      auth,
      request: { organization },
      params
    },
    next
  ) {
    const ticket = await organization
      .tickets()
      .where('tickets.id', params.ticket_id)
      .first()

    if (!ticket) {
      throw new HttpException(null, 404)
    }

    if (ticket.user_id !== auth.user.id) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = TicketBelongsToUser
