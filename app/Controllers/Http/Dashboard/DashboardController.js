'use strict'

const logger = use('App/Logger')

class DashboardController {
  async index({ view, request, auth }) {
    const search_keyword = request.only('search').search
    let tickets = null
    let searching = false

    if (search_keyword && search_keyword !== '') {
      searching = true
      try {
        tickets = await auth.user
          .tickets()
          .whereRaw(`"title" LIKE '%${search_keyword}%'`)
          .with('user')
          .with('assignedTo')
          .paginate(request.input('page', 1))
      } catch (err) {
        logger.error(`Unable to get tickets for user: ${auth.user}. \n${err}`)
      }
    } else {
      try {
        tickets = await auth.user
          .tickets()
          .with('user')
          .with('assignedTo')
          .paginate(request.input('page', 1))
      } catch (err) {
        logger.error(`Unable to get tickets for user: ${auth.user}. \n${err}`)
      }
    }

    return view.render('dashboard.main', { tickets: tickets.toJSON(), searching: searching })
  }
}

module.exports = DashboardController
