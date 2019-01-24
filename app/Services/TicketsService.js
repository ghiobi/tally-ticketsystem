const Organization = use('App/Models/Organization')
const User = use('App/Models/User')

class TicketsService {
  async getOrganizationTickets(user) {
    const organization = await Organization.find(user.organization_id)
    const tickets = await organization.tickets().fetch()
    return tickets
  }

  async getUserTickets(userId) {
    console.log(userId)
    const user = await User.find(userId)
    const tickets = await user.tickets().fetch()
    return tickets
  }
}

module.exports = TicketsService
