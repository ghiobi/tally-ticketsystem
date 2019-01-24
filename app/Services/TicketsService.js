const Organization = use('App/Models/Organization')
const User = use('App/Models/User')

class TicketsService {
  async getOrganizationTickets(user) {
    try {
      const organization = await Organization.find(user.organization_id)
      const tickets = await organization
        .tickets()
        .with('user')
        .fetch()
      return tickets
    } catch (e) {
      //
    }
  }

  async getUserTickets(userId) {
    try {
      const user = await User.find(userId)
      const tickets = await user.tickets().fetch()
      return tickets
    } catch (e) {
      //
    }
  }
}

module.exports = TicketsService
