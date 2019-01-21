'use strict'

/*
|--------------------------------------------------------------------------
| FakeOrganizationrSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Organization = use('App/Models/Organization')
const Role = use('App/Models/Role')
const User = use('App/Models/User')

class DemoSeeder {
  async run() {
    const organization = await Organization.create({
      name: 'Tally Inc.',
      slug: 'tally'
    })

    await Role.createMany([
      { key: 'owner', display_name: 'Organization Owner' },
      { key: 'admin', display_name: 'Organization Administrator' }
    ])

    const userData = {
      email: 'owner@tally.com',
      name: 'Owner',
      password: 'password'
    }

    const user = new User(userData)
    user.fill(userData)

    await organization.users().save(user)

    await user.setRole('owner')
    await user.setRole('admin')
  }
}

module.exports = DemoSeeder
