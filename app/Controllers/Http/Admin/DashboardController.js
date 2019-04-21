'use strict'

const logger = use('App/Logger')

class DashboardController {
  async index({ request, view, auth }) {
    let { organization } = request
    let show = request.input('show')
    let tickets = null

    switch (show) {
      case 'closed':
        try {
          tickets = this.getTickets(organization).where('status', 'closed')
        } catch (err) {
          logger.error(`Unable to get all closed tickets for organization: ${organization}. \n${err}`)
        }
        break
      case 'mine':
        try {
          tickets = this.getTickets(organization)
            .whereNot({ status: 'closed' })
            .where('assigned_to', auth.user.id)
        } catch (err) {
          logger.error(`Unable to get all open tickets for user_id: ${auth.user.id}. \n${err}`)
        }
        break
      default:
        show = 'all'
        try {
          tickets = this.getTickets(organization).whereNot({ status: 'closed' })
        } catch (err) {
          logger.error(`Unable to get all open tickets for organization: ${organization}. \n${err}`)
        }
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
