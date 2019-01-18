'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Role = use('App/Models/Role')

class RoleSeeder {
  async run() {
    await Role.createMany([
      { key: 'owner', display_name: 'Organization Owner' },
      { key: 'admin', display_name: 'Organization Administrator' }
    ])
  }
}

module.exports = RoleSeeder
