'use strict'
const Ticket = use('App/Models/Ticket')

class DashboardController {
  async index({ view, auth }) {
    // TODO: Clean this part up once API is available
    const tickets = await Ticket.query()
      .with('user')
      .fetch()
    const data = {
      open: [],
      inprogress: [],
      closed: []
    }
    for (const ticket of tickets.toJSON()) {
      if (ticket.status == 'submitted') {
        data['open'].push(ticket)
      } else if (ticket.status == 'replied') {
        data['inprogress'].push(ticket)
      } else if (ticket.status == 'closed') {
        data['closed'].push(ticket)
      }
    }

    if (await auth.user.hasRole('admin')) {
      return view.render('dashboard.admin', data)
    }
    return view.render('dashboard.main')
  }
}

module.exports = DashboardController
