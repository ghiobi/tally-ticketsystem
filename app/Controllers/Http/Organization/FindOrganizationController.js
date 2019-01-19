'use strict'

class FindOrganizationController {
  /**
   * Renders the `find your organization` if the user is coming from the root page.
   *
   * @param request
   * @param view
   * @returns {*}
   */
  index({ request, view }) {
    return view.render('organizations.find', {
      request
    })
  }

  /**
   * Redirects the user to an organization's page.
   *
   * @param request
   * @param response
   * @returns {Promise<*>}
   */
  async find({ request, response }) {
    return response.redirect(`/organization/${request.input('organization')}`)
  }
}

module.exports = FindOrganizationController
