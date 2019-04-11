'use strict'

class DashboardController {
  async index({ request, view, auth }) {
    let { organization } = request
    let show = request.input('show')
    let tickets = null

    switch (show) {
      case 'closed':
        tickets = this.getTickets(organization).where('status', 'closed')
        break
      case 'mine':
        tickets = this.getTickets(organization)
          .whereNot({ status: 'closed' })
          .where('assigned_to', auth.user.id)
        break
      default:
        show = 'all'
        tickets = this.getTickets(organization).whereNot({ status: 'closed' })
    }

    const search = request.input('search', '')

    tickets = this.search(tickets, request.input('search', ''))
    tickets = await tickets.paginate(request.input('page', 1))

    const adminPaginateUrl = '/admin/tickets?show=' + show + '&' + (search ? 'search=' + search + '&' : '')
    
    return view.render('admin.dashboard', {
      tickets: tickets.toJSON(),
      show,
      search,
      adminPaginateUrl
    })
  }

  getTickets(organization) {
    return organization
      .tickets()
      .with('user')
      .with('assignedTo')
  }

  search(builder, title = '') {
    if (title) {
      return builder.where('title', 'like', `%${title}%`)
    }
    return builder
  }
}

module.exports = DashboardController
