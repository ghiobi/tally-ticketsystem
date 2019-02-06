'use strict'

class DashboardController {
  async index({ request, view, auth }) {
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

    return view.render('admin.dashboard', { tickets: tickets.toJSON(), show })
  }

  getTickets(organization) {
    return organization
      .tickets()
      .with('user')
      .with('assignedTo')
  }
}

module.exports = DashboardController
