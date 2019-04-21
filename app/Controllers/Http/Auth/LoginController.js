'use strict'

const Hash = use('Hash')
const StatsD = require('../../../../config/statsd')
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
      session.withErrors(validation.messages()).flashAll()
      StatsD.increment('login.failed')

      return response.redirect('back')
    }

    /**
     * Validating the existance of the user.
     */
    const user = await request.organization.findUserByEmail(request.input('email'))

    if (!user) {
      StatsD.increment('login.failed')
      return this.failed(session, response)
    }

    /**
     * Validating password.
     */
    const isSame = await Hash.verify(request.input('password'), user.password)

    if (!isSame) {
      StatsD.increment('login.failed')
      return this.failed(session, response)
    }

    /**
     * Success
     */
    await auth.login(user)

    if (await user.hasRole('admin')) {
      StatsD.increment('login.admin.success')
      return response.redirect(`/organization/${request.organization.slug}/admin`)
    }
    StatsD.increment('login.user.success')
    return response.redirect(`/organization/${request.organization.slug}`)
  }

  failed(session, response) {
    session.withErrors({ invalid: 'Could not find user.' }).flashExcept(['password'])

    return response.redirect('back')
  }
}

module.exports = LoginController
