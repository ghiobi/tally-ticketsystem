'use strict'

const UserOrganizationService = use('App/Services/UserOrganizationService')
const Hash = use('Hash')

const { validateAll } = use('Validator')

class LoginController {
  index({ view }) {
    return view.render('auth.login')
  }

  /**
   * Handles HTTP authentication.
   *
   * @param auth
   * @param request
   * @param session
   * @param response
   * @returns {Promise<*>}
   */
  async login({ auth, request, session, response }) {
    /**
     * Validating user input.
     */
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required'
    })

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll()

      return response.redirect('back')
    }

    /**
     * Validating the existance of the user.
     */
    const user = await UserOrganizationService.findByEmail(
      request.organization,
      request.input('email')
    )

    if (!user) {
      return this.failed(session, response)
    }

    /**
     * Validating password.
     */
    const isSame = await Hash.verify(request.input('password'), user.password)

    if (!isSame) {
      return this.failed(session, response)
    }

    /**
     * Success
     */
    await auth.login(user)
    return response.redirect(`/organization/${request.organization.slug}`)
  }

  failed(session, response) {
    session
      .withErrors({ invalid: 'Could not find user.' })
      .flashExcept(['password'])

    return response.redirect('back')
  }

}

module.exports = LoginController
