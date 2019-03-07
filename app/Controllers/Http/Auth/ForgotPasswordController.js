'use strict'

const Persona = use('Persona')
const { validateAll } = use('Validator')

class ForgotPasswordController {
  index({ view }) {
    return view.render('auth.forgot-password')
  }

  async recover({ request, response, session }) {
    const payload = { uid: request.input('email') }

    try {
      const user = await request.organization.findUserByEmail(payload.uid)

      if (!user) {
        throw { message: 'user does not exist' }
      }
      await Persona.forgotPassword(request.input('email'))
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err)
    }

    session.flash({
      success: 'If we find an account related to this email, we will send you an email to reset your password!'
    })
    return response.redirect('back')
  }

  resetpage({ view, params }) {
    return view.render('auth.reset-password', { ...params })
  }

  async resetByToken({ request, response, session }) {
    const token = decodeURIComponent(request.input('token'))
    const payload = request.only(['password', 'password_confirmation'])
    try {
      const validation = await validateAll(
        request.post(),
        {
          password: 'required|min:6|confirmed',
          password_confirmation: 'required'
        },
        {
          'password.min': 'Password needs to be atleast of length 6',
          'password.confirmed': 'Password did not match'
        }
      )

      if (validation.fails()) {
        throw validation.messages()
      }
    } catch (err) {
      session.withErrors(err).flashAll()

      return response.redirect('back')
    }

    try {
      await Persona.updatePasswordByToken(token, payload)
    } catch (err) {
      session.flash({ error: 'Token was invalid' })
      return response.redirect('back')
    }
    session.flash({ success: 'Password has been successfully changed!' })
    return response.redirect('/')
  }
}

module.exports = ForgotPasswordController
