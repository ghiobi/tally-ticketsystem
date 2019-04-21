'use strict'
const chance = new (require('chance'))()
const logger = use('App/Logger')
const StatsD = require('../../../../config/statsd')

class ApiTokenController {
  index({ view }) {
    return view.render('admin.panel')
  }

  async generate({ request, response }) {
    const { organization } = request

    try {
      organization.api_token = chance.string({
        length: 75,
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      })
      StatsD.increment('api.token.generation.success')
    } catch (err) {
      logger.error(`Unable generate a new API Token. \n${err}`)
      StatsD.increment('api.token.generation.failed')
    }
    await organization.save()

    return response.redirect('back')
  }
}

module.exports = ApiTokenController
