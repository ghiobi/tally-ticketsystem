'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Ticket = use('App/Models/Ticket')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class TicketBelongsToUser {
  /**
   * @param {Response} ctx.reponse
   * @param {auth}
   * @param {Parameters} ctx.params
   * @param {Function} next
   */
  async handle({ auth, params }, next) {
    const ticket = await Ticket.find(params.ticket_id)

    if (
      ticket.user_id !== auth.user.id &&
      !(await auth.user.hasRole('admin'))
    ) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = TicketBelongsToUser
