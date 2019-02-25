'use strict'

const logger = use('App/Logger')

/** @type {import('@adonisjs/framework/src/Hash')} */
const { validateAll } = use('Validator')

class AccountController {
  index({ view }) {
    return view.render('account.index')
  }

  async password({ auth, response, request, session }) {
    const validation = await validateAll(
      request.post(),
      {
        newPassword: 'required|min:6',
        confirmPassword: 'same:newPassword'
      },
      {
        'newPassword.min': 'Passwords needs to be 6 in length',
        'confirmPassword.same': 'Passwords are not the same'
      }
    )

    const { newPassword } = request.only(['newPassword'])
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    auth.user.password = newPassword
    try {
      await auth.user.save()
    } catch (err) {
      logger.error(`Unable to save new user password for user: ${auth.user}. \n${err}`)
    }

    session.flash({ success: 'Passwords was successfully changed' })
    return response.redirect('back')
  }

  async clearNotifications({ auth }) {
    await auth.user
      .notifications()
      .where('read', false)
      .update({ read: true })

    return 'ok'
  }
}

module.exports = AccountController
