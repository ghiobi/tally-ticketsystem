const User = use('App/Models/User')

class TicketsService {
  async getOrganizationTickets(user) {
    const organization = await user.organization().fetch()
    return await organization
      .tickets()
      .with('user')
      .fetch()
  }

  async getUserTickets(userId) {
    const user = await User.find(userId)
    const tickets = await user.tickets().fetch()
    return tickets
  }
}

module.exports = TicketsService
