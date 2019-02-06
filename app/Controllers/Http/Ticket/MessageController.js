'use strict'

const Ticket = use('App/Models/Ticket')

class MessageController {
  async getTicketMessages({ response, params }) {
    return response.json(
      await Ticket.query()
        .with('messages.user')
        .where('id', params.ticketId)
        .first()
    )
  }
}

module.exports = MessageController
