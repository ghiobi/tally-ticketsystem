'use strict'

const TicketService = use('App/Services/TicketsService')

class TicketController {
  async getOrganizationTickets({ auth, response }) {
    return response.json(await TicketService.getOrganizationTickets(auth.user))
  }

  async getUserTickets({ response, params }) {
    return response.json(await TicketService.getUserTickets(params.userId))
  }
}

module.exports = TicketController
