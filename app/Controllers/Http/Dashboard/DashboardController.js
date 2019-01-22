'use strict'
const Ticket = use('App/Models/Ticket')

class DashboardController {
  async index({ view, auth }) {
    // TODO: Clean this part up once API is available
    const tickets = await Ticket.all()
    const data = {
      open: [],
      inprogress: [],
      closed: []
    }
    for (const ticket of tickets.rows) {
      ticket.author = await ticket.user().fetch()
      if (ticket.status == 'submitted') {
        data['open'].push(ticket)
      } else if (ticket.status == 'replied') {
        data['inprogress'].push(ticket)
      } else if (ticket.status == 'closed') {
        data['closed'].push(ticket)
      }
    }

    return Promise.all([
      auth.user.hasRole('admin'),
      auth.user.hasRole('owner')
    ]).then((values) => {
      if (values.includes(true)) {
        return view.render('dashboard.admin', data)
      } else {
        return view.render('dashboard.main')
      }
    })
  }
}

module.exports = DashboardController
