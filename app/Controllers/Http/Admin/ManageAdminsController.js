'use strict'

const User = use('App/Models/User')
const ForbiddenException = use('App/Exceptions/ForbiddenException')

class ManageAdminsController {
  async addAdmin({ request, response, session, auth }) {
    if (!(await auth.user.hasRole('owner'))) {
      throw new ForbiddenException()
    }

    const { modal_data } = request.post()

    const user = await User.find(modal_data)
    await user.setRole('admin')

    session.flash({ success: `${user.name} now has admin privileges.` })

    return response.redirect('back')
  }

  async removeAdmin({ request, response, session, auth }) {
    if (!(await auth.user.hasRole('admin'))) {
      throw new ForbiddenException()
    }

    const { modal_data } = request.post()

    const user = await User.find(modal_data)
    await user.removeRole('admin')

    session.flash({ success: `${user.name}'s admin privileges have been revoke.` })

    return response.redirect('back')
  }
}

module.exports = ManageAdminsController
