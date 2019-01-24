const { User, Organization } = models

class TicketsService {
  async getOrganizationTickets(user) {
    const organization = await Organization.find(user.organization_id)
    const tickets = await organization
      .tickets()
      .with('user')
      .fetch()
    return tickets
  }

  async getUserTickets(userId) {
    const user = await User.find(userId)
    const tickets = await user.tickets().fetch()
    return tickets
  }
}

module.exports = TicketsService
