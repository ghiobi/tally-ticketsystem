'use strict'

class UsersController {
  async index({ request, view }) {
    let { organization } = request
    let role = request.input('role')
    let users = null

    switch (role) {
      case 'admin':
        users = await this.getUsers(organization)
          .has('roles')
          .fetch()
        break
      default:
        role = 'none'
        users = await this.getUsers(organization).fetch()
    }
    return view.render('admin.users', { users: users.toJSON(), role })
  }

  getUsers(organization) {
    return organization.users().with('roles')
  }
}

module.exports = UsersController
