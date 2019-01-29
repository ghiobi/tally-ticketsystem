'use strict'

class LogoutController {
  async logout({ request, response, auth }) {
    await auth.logout()

    return response.redirect(`/organization/${request.organization.slug}/login`)
  }
}

module.exports = LogoutController
