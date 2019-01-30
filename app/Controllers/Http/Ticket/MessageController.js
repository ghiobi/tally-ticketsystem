'use strict'

const Ticket = use('App/Models/Ticket')

class MessageController {
  async getTicketMessages({ response, params }) {
    let ticket = await Ticket.find(params.ticketId)

    return response.json(
      await ticket
        .messages()
        .with('user')
        .fetch()
    )
  }
}

module.exports = MessageController
