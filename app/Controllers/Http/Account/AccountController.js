'use strict'
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

    var { newPassword } = request.only(['newPassword'])
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    auth.user.password = newPassword
    await auth.user.save()
    session.flash({ success: 'Passwords was successfully changed' })
    return response.redirect('back')
  }
}

module.exports = AccountController
