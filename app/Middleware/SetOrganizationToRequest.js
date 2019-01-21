'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/session/src/Session')} Session */

const Organization = use('App/Models/Organization')

class SetOrganizationToRequest {
  /**
   * Whenever a user enters an organization url, the organization is found and set to globally to the view and request
   * object. If no organization is found, they are redirected back to the organization page.
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Session} ctx.session
   * @param {Parameters} ctx.params
   * @param {Function} next
   */
  async handle({ request, response, session, params, view }, next) {
    const organization = await Organization.query()
      .where('slug', params.organization)
      .first()

    if (!organization) {
      session
        .withErrors([
          {
            field: '404',
            message:
              'Could not find organization. Please enter the correct url.'
          }
        ])
        .flashAll()
      return response.redirect('/organization')
    }

    // Provide the organization object on the view.
    view.share({ organization })

    request.organization = organization
    await next()
  }
}

module.exports = SetOrganizationToRequest
