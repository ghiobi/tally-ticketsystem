'use strict'
const TicketService = use('App/Services/TicketsService')

class DashboardController {
  async index({ view, auth }) {
    if (await auth.user.hasRole('admin')) {
      const tickets = await TicketService.getOrganizationTickets(auth.user)

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
      return view.render('dashboard.admin', data)
    }
    const tickets = await TicketService.getUserTickets(auth.user.id)
    const data = { tickets: tickets }
    return view.render('dashboard.main', data)
  }
}

module.exports = DashboardController
