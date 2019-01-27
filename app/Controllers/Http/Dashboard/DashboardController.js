'use strict'

class DashboardController {
  async index({ view, auth, request }) {
    if (await auth.user.hasRole('admin')) {
      const tickets = await request.organization.tickets().fetch()

      const data = {
        open: [],
        inprogress: [],
        closed: []
      }

      for (const ticket of tickets.toJSON()) {
        if (ticket.status === 'submitted') {
          data['open'].push(ticket)
        } else if (ticket.status === 'replied') {
          data['inprogress'].push(ticket)
        } else if (ticket.status === 'closed') {
          data['closed'].push(ticket)
        }
      }
      return view.render('dashboard.admin', data)
    }
    const tickets = await auth.user.tickets().fetch()
    return view.render('dashboard.main', { tickets })
  }
}

module.exports = DashboardController
