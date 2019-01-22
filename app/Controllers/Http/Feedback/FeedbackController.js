'use strict'

class FeedbackController {
  async index({ view }) {
    return view.render('feedback.main')
  }
}

module.exports = FeedbackController
