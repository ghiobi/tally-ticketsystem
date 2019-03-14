'use strict'

const User = use('App/Models/User')

class ManageAdminsController {
  async addAdmin({ request, response, session }) {
    const { input_user_id } = request.post()
    const user = await User.find(input_user_id)
    await user.setRole('admin')
    session.flash({ success: `${user.name} now has admin privileges.` })
    return response.redirect('back')
  }

  async removeAdmin({ request, response, session }) {
    const { input_user_id } = request.post()
    const user = await User.find(input_user_id)
    await user.removeRole('admin')
    session.flash({ success: `${user.name}'s admin privileges have been revoke.` })
    return response.redirect('back')
  }
}

module.exports = ManageAdminsController
