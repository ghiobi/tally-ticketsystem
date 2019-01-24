'use strict'

const TicketService = use('App/Services/TicketsService')

class TicketController {
  async getOrganizationTickets({ auth, response }) {
    return response.json(TicketService.getOrganizationTickets(auth.user))
  }

  async getUserTickets({ response, params }) {
    return response.json(TicketService.getUserTickets(params.id))
  }
}

module.exports = TicketController
