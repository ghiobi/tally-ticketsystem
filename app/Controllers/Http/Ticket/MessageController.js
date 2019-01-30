'use strict'

const Ticket = use('App/Models/Ticket')

class MessageController {
  async getTicketMessages({ auth, response, params }) {
    let ticket = await Ticket.find(params.ticketId)

    if (
      ticket.user_id !== auth.user.id &&
      !(await auth.user.hasRole('admin'))
    ) {
      return response.redirect('/403')
    }

    return response.json(
      await ticket
        .messages()
        .with('user')
        .fetch()
    )
  }
}

module.exports = MessageController
