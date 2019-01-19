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

class DemoSeeder {
  async run () {
    const organization = await Organization.create({
      name: 'Tally Inc.',
      slug: 'tally'
    })

    organization.users().create({
      email: 'owner@tally.com',
      name: 'Owner',
      password: 'password'
    })
  }
}

module.exports = DemoSeeder
