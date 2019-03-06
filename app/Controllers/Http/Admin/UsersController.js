'use strict'

class UsersController {
  async index({ request, view }) {
    let { organization } = request
    let role = request.input('role')
    const search = request.input('search', '')

    let users = this.getUsers(organization).where(function() {
      this.where('name', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`)
        .orWhere('id', parseInt(search))
    })

    switch (role) {
      case 'admin':
        users = users.has('roles')
        break
      default:
        role = 'all'
    }

    users = await users.fetch()

    return view.render('admin.users', { users: users.toJSON(), role, search })
  }

  getUsers(organization) {
    return organization.users().with('roles')
  }
}

module.exports = UsersController
