'use strict'
/** @type {import('@adonisjs/framework/src/Hash')} */
const { validateAll } = use('Validator')

class AccountController {
  index({ view }) {
    return view.render('account.index')
  }

  async password({ auth, response, request, session }) {
    const validation = await validateAll(request.post(), {
      newPassword: 'required|min:6'
    })

    var { newPassword, confirmPassword } = request.only([
      'newPassword',
      'confirmPassword'
    ])
    if (newPassword !== confirmPassword) {
      session.flash({ error: 'Passwords are not the same' })
    } else {
      if (validation.fails()) {
        session.flash({ error: 'Passwords needs to be 6 in length' })
        return response.redirect('back')
      }

      auth.user.password = newPassword
      await auth.user.save()
    }
    session.flash({ success: 'Passwords was successfully changed' })
    return response.redirect('back')
  }
}

module.exports = AccountController
