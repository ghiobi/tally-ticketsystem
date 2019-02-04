'use strict'

const chance = new (require('chance'))()

class ApiTokenController {
  index({ view }) {
    return view.render('admin.token')
  }

  async generate({ request, response }) {
    const { organization } = request

    organization.api_token = chance.string({ length: 255 })
    await organization.save()

    return response.redirect('back')
  }
}

module.exports = ApiTokenController
