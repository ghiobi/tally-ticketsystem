'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Ticket = use('App/Models/Ticket')
class FeedbackBelongsToUser {
  /**
   * @param {Response} ctx.reponse
   * @param {auth}
   * @param {Parameters} ctx.params
   * @param {Function} next
   */
  async handle({ response, auth, params }, next) {
    // call next to advance the request
    const ticket = await Ticket.query()
      .where('id', params.feedback_id)
      .with('user')
      .first()
    if (ticket.user_id !== auth.user.id) {
      if (!(await auth.user.hasRole('admin'))) {
        return response.redirect('/403')
      }

      if (ticket.toJSON().user.organization_id !== auth.user.organization_id) {
        return response.redirect('/403')
      }
    }
    await next()
  }
}

module.exports = FeedbackBelongsToUser
