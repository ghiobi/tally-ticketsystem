'use strict'
class DashboardController {
  async index({ view, auth }) {
    const tickets = await auth.user
      .tickets()
      .with('user')
      .with('assignedTo')
      .fetch()

    return view.render('dashboard.main', { tickets: tickets.toJSON() })
  }
}

module.exports = DashboardController
