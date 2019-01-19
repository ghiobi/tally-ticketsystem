'use strict'

class DashboardController {
  index({ view }) {
    return view.render('dashboard.index')
  }
}

module.exports = DashboardController
