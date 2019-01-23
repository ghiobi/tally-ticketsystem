'use strict'

const Ticket = use('App/Models/Ticket')

class FeedbackController {
  async index({ view, request }) {
    const { feedback_id } = request.params
    const ticket = await Ticket.query()
      .where('id', feedback_id)
      .with('messages.user') // returns messages linked to this ticket
      .with('user') // returns who submited the ticket
      .first()

    const data = { ticket: ticket.toJSON() }
    return view.render('feedback.main', data)
  }
}

module.exports = FeedbackController
