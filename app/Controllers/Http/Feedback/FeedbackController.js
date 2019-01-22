'use strict'

const Ticket = use('App/Models/Ticket')

class FeedbackController {
  async index({ view, request, auth }) {
    const { organization, feedback_id } = request.params
    const ticket = await Ticket.query()
      .where('id', feedback_id)
      .with('messages.user') // returns messages linked to this ticket
      .with('user') // returns who submited the ticket
      .fetch()

    const data = { ticket: ticket.toJSON()[0] }
    return view.render('feedback.main', data)
  }
}

module.exports = FeedbackController
