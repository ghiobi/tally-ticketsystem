'use strict'
class DashboardController {
  async index({ view, auth, request }) {
    if (await auth.user.hasRole('admin')) {
      let { organization } = request
      let show = request.input('show')
      let tickets = null

      switch (show) {
        case 'closed':
          tickets = await this.getTickets(organization)
            .where('status', 'closed')
            .fetch()
          break
        case 'mine':
          tickets = await this.getTickets(organization)
            .whereNot({ status: 'closed' })
            .where('assigned_to', auth.user.id)
            .fetch()
          break
        default:
          show = 'all'
          tickets = await this.getTickets(organization)
            .whereNot({ status: 'closed' })
            .fetch()
      }

      return view.render('dashboard.admin', { tickets: tickets.toJSON(), show })
    }
    const tickets = await auth.user.tickets().fetch()
    return view.render('dashboard.main', { tickets })
  }

  getTickets(organization) {
    return organization
      .tickets()
      .with('user')
      .with('assignedTo')
  }
}

module.exports = DashboardController
