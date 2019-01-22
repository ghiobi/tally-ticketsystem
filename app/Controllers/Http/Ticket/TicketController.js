'use strict'

const User = use('App/Models/User')
const Organization = use('App/Models/Organization')

class TicketController {
  async getOrganizationTickets({ auth, response }) {
    const organization = await Organization.find(auth.user.organization_id)
    const tickets = await organization.tickets().fetch()
    return response.json(tickets)
  }

  async getUserTickets({ response, params }) {
    const user = await User.find(params.userId)
    const tickets = await user.tickets().fetch()
    return response.json(tickets)
  }
}

module.exports = TicketController
