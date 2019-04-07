'use strict'
class DashboardController {
  async index({ view, request, auth }) {
    const search_keyword = request.only('search').search
    let tickets = null
    let searching = false

    if (search_keyword && search_keyword !== '') {
      searching = true
      tickets = await auth.user
        .tickets()
        .whereRaw(`"title" LIKE '%${search_keyword}%'`)
        .with('user')
        .with('assignedTo')
        .paginate(request.input('page', 1))
    } else {
      tickets = await auth.user
        .tickets()
        .with('user')
        .with('assignedTo')
        .paginate(request.input('page', 1))
    }

    return view.render('dashboard.main', { tickets: tickets.toJSON(), searching: searching })
  }
}

module.exports = DashboardController
