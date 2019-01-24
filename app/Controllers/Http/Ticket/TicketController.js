'use strict'

const User = use('App/Models/User')

class TicketController {
  async getOrganizationTickets({ response, request }) {
    return response.json(
      await request.organization
        .tickets()
        .with('user')
        .fetch()
    )
  }

  async getUserTickets({ response, params }) {
    const user = await User.find(params.userId)

    return response.json(await user.tickets().fetch())
  }
}

module.exports = TicketController
