'use strict'

const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')

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

  async reply({ response, request, auth }) {
    const { feedback_id } = request.params

    const ticket = await Ticket.query()
      .where('id', feedback_id)
      .with('messages.user') // returns messages linked to this ticket
      .with('user') // returns who submited the ticket
      .first()

    const reply = request.input('reply')
    if (reply !== null) {
      //check ownership
      if (ticket.toJSON().user.id !== auth.user.id) {
        if (!(await auth.user.hasRole('admin'))) {
          return response.redirect('403')
        }
      }

      Message.create({
        user_id: auth.user.id,
        ticket_id: ticket.id,
        body: reply
      })
    }
    return response.redirect('back')
  }
}

module.exports = FeedbackController
