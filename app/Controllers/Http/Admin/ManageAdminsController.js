'use strict'

const logger = use('App/Logger')
const User = use('App/Models/User')
const { HttpException } = require('@adonisjs/generic-exceptions')

class ManageAdminsController {
  async addAdmin({ request, response, session }) {
    const { modal_data } = request.post()

    const user = await User.find(modal_data)
    try {
      await user.setRole('admin')
    } catch (err) {
      logger.error(`Unable to grant admin role to user: ${user}. \n${err}`)
    }

    session.flash({ success: `${user.name} now has admin privileges.` })

    return response.redirect('back')
  }

  async removeAdmin({ request, response, session }) {
    const { modal_data } = request.post()

    const user = await User.find(modal_data)

    if (!user) {
      throw new HttpException(null, 404)
    }

    try {
      await user.removeRole('admin')
    } catch (err) {
      logger.error(`Unable to remove admin role for user: ${user}. \n${err}`)
    }

    session.flash({ success: `${user.name}'s admin privileges have been revoke.` })

    return response.redirect('back')
  }
}

module.exports = ManageAdminsController
