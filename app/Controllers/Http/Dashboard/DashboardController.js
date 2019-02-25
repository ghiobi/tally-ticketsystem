'use strict'
class DashboardController {
  async index({ view, request, auth }) {
    const tickets = await auth.user
      .tickets()
      .with('user')
      .with('assignedTo')
      .paginate(request.input('page', 1))

    return view.render('dashboard.main', { tickets: tickets.toJSON() })
  }
}

module.exports = DashboardController
